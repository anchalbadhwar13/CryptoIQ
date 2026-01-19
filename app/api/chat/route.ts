import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20 // Max requests per minute per IP
const MAX_MESSAGE_LENGTH = 2000 // Max characters per message

// Simple in-memory rate limiter (use Redis in production for multi-instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(req: NextRequest): string {
  // Get IP from various headers (Vercel, Cloudflare, etc.)
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const cfIp = req.headers.get('cf-connecting-ip')
  return forwarded?.split(',')[0] || realIp || cfIp || 'unknown'
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 }
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 }
  }
  
  record.count++
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count }
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip)
    }
  }
}, 60000)

interface TradeData {
  type: 'buy' | 'sell'
  price: number
  amount: number
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting check
    const clientIp = getRateLimitKey(req)
    const rateLimit = checkRateLimit(clientIp)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': '0',
            'Retry-After': '60'
          }
        }
      )
    }

    // Check if API key exists
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { message, sessionData, conversationHistory } = body

    // Input validation
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.` },
        { status: 400 }
      )
    }

    // Sanitize message - remove potential injection attempts
    const sanitizedMessage = message
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .trim()

    if (!sanitizedMessage) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      )
    }

    // Build conversation context based on whether we have session data
    let systemPrompt: string
    
    if (sessionData && sessionData.isPlaying !== undefined) {
      // Simulator page - include trading session data
      systemPrompt = `You are an expert crypto trading assistant helping users learn about trading in a simulator. 
You have access to their current session data:
- Current BTC Price: $${sessionData.currentPrice?.toLocaleString() || 'N/A'}
- Cash Balance: $${sessionData.balance?.toFixed(2) || 'N/A'}
- BTC Holdings: ${sessionData.holdings?.toFixed(4) || '0'} BTC
- Portfolio Value: $${sessionData.portfolioValue?.toFixed(2) || 'N/A'}
- ROI: ${sessionData.roi?.toFixed(2) || '0'}%
- Total Trades Made: ${sessionData.trades?.length || 0}
- Trading Status: ${sessionData.isPlaying ? 'Active' : 'Paused'}

Provide detailed, comprehensive advice about their trades, market analysis, and crypto trading strategies. Include:
- Specific analysis of their current position
- Trading tips and techniques
- Market insights
- Recommendations with reasoning

Be encouraging, educational, and thorough in your responses.`
    } else {
      // General pages - be a helpful crypto education assistant
      systemPrompt = `You are CoinCoach, a friendly and knowledgeable crypto education assistant. 
You help beginners learn about cryptocurrency safely.

Your expertise includes:
- Explaining crypto concepts in simple terms
- Teaching about different cryptocurrencies and their uses
- Explaining blockchain technology
- Helping users understand market analysis
- Teaching about risk management and safe trading practices
- Warning about common scams and how to avoid them
- Explaining DeFi, NFTs, wallets, and exchanges

Be friendly, encouraging, and educational. Use simple language and examples.
Always emphasize safety and warn about risks when relevant.
If asked about specific investment advice, remind users to do their own research (DYOR).`
    }

    const contents = (conversationHistory || [])
      .slice(-10) // Keep last 10 messages for context
      .map((msg: any) => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }))
      .concat([{ role: 'user', parts: [{ text: sanitizedMessage }] }])

    // Add system prompt at the beginning if first message
    if (!conversationHistory || conversationHistory.length === 0) {
      contents.unshift(
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood. I am your trading assistant. How can I help you today?' }] }
      )
    }

    // Filter out any invalid entries
    const validContents = contents.filter((c: any) => c.parts && c.parts[0] && c.parts[0].text)

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`
    
    console.log('Sending request to Gemini API...')

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: validContents,
        generationConfig: {
          maxOutputTokens: 8000,
          temperature: 0.7,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Gemini API error:', error)
      return NextResponse.json(
        { error: `Gemini API error: ${error.error?.message || 'Unknown error'}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0]) {
      console.error('Invalid response structure:', data)
      return NextResponse.json(
        { error: 'Invalid response from Gemini API' },
        { status: 500 }
      )
    }

    const assistantResponse = data.candidates[0].content.parts[0].text

    return NextResponse.json({ response: assistantResponse })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
