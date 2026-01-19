import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// Rate limiting
const RATE_LIMIT_WINDOW = 60000
const MAX_REQUESTS_PER_WINDOW = 10
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  return forwarded?.split(',')[0] || realIp || 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }
  
  record.count++
  return true
}

interface Trade {
  type: 'buy' | 'sell'
  price: number
  amount: number
  timestamp: number
}

interface AnalysisRequest {
  trades: Trade[]
  priceHistory: Array<{ time: number; price: number }>
  currentPrice: number
  balance: number
  holdings: number
  portfolioValue: number
  roi: number
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getRateLimitKey(req)
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before analyzing again.' },
        { status: 429 }
      )
    }

    if (!GEMINI_API_KEY) {
      // Return intelligent fallback patterns without AI
      return NextResponse.json({ patterns: generateFallbackPatterns(await req.json()) })
    }

    const data: AnalysisRequest = await req.json()
    
    // Validate input
    if (!data.trades || !Array.isArray(data.trades)) {
      return NextResponse.json({ patterns: [] })
    }

    // If too few trades, return basic patterns
    if (data.trades.length < 3) {
      return NextResponse.json({ 
        patterns: ['Continue trading to identify patterns'],
        insights: 'Make more trades to unlock AI-powered pattern analysis.'
      })
    }

    // Calculate trading metrics for analysis
    const buyTrades = data.trades.filter(t => t.type === 'buy')
    const sellTrades = data.trades.filter(t => t.type === 'sell')
    const avgBuyPrice = buyTrades.length > 0 
      ? buyTrades.reduce((sum, t) => sum + t.price, 0) / buyTrades.length 
      : 0
    const avgSellPrice = sellTrades.length > 0 
      ? sellTrades.reduce((sum, t) => sum + t.price, 0) / sellTrades.length 
      : 0
    
    // Price trend analysis
    const recentPrices = data.priceHistory.slice(-20)
    const priceChange = recentPrices.length > 1 
      ? ((recentPrices[recentPrices.length - 1]?.price || 0) - (recentPrices[0]?.price || 0)) / (recentPrices[0]?.price || 1) * 100
      : 0

    const prompt = `Analyze this crypto trading session and identify 3-4 specific trading patterns or insights. Be concise and educational.

Trading Data:
- Total trades: ${data.trades.length} (${buyTrades.length} buys, ${sellTrades.length} sells)
- Average buy price: $${avgBuyPrice.toFixed(2)}
- Average sell price: $${avgSellPrice.toFixed(2)}
- Current price: $${data.currentPrice.toFixed(2)}
- Price trend (last 20 ticks): ${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}%
- Portfolio ROI: ${data.roi.toFixed(2)}%
- Current holdings: ${data.holdings.toFixed(4)} BTC
- Cash balance: $${data.balance.toFixed(2)}

Return a JSON object with this exact structure (no markdown):
{
  "patterns": ["Pattern 1 description", "Pattern 2 description", "Pattern 3 description"],
  "insights": "A brief 1-2 sentence overall insight about their trading behavior",
  "suggestion": "One actionable tip for improvement"
}

Focus on:
- Buy/sell timing patterns
- Position sizing behavior
- Risk management observations
- Trend recognition ability`

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      }),
    })

    if (!response.ok) {
      console.error('Gemini API error:', await response.text())
      return NextResponse.json({ patterns: generateFallbackPatterns(data) })
    }

    const result = await response.json()
    const content = result.candidates?.[0]?.content?.parts?.[0]?.text

    if (!content) {
      return NextResponse.json({ patterns: generateFallbackPatterns(data) })
    }

    // Parse JSON response
    let parsed
    try {
      // Clean markdown if present
      let cleanContent = content
      if (cleanContent.includes('```json')) {
        cleanContent = cleanContent.split('```json')[1].split('```')[0]
      } else if (cleanContent.includes('```')) {
        cleanContent = cleanContent.split('```')[1].split('```')[0]
      }
      parsed = JSON.parse(cleanContent.trim())
    } catch {
      // If parsing fails, extract patterns manually
      return NextResponse.json({ patterns: generateFallbackPatterns(data) })
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Pattern analysis error:', error)
    return NextResponse.json({ 
      patterns: ['Analysis temporarily unavailable'],
      insights: 'Keep trading to build your pattern recognition skills!'
    })
  }
}

function generateFallbackPatterns(data: AnalysisRequest): string[] {
  const patterns: string[] = []
  const buyTrades = data.trades?.filter(t => t.type === 'buy') || []
  const sellTrades = data.trades?.filter(t => t.type === 'sell') || []
  
  // Analyze trading behavior
  if (buyTrades.length > sellTrades.length * 2) {
    patterns.push('Heavy accumulation strategy detected - building position')
  } else if (sellTrades.length > buyTrades.length * 2) {
    patterns.push('Profit-taking behavior observed - securing gains')
  } else if (buyTrades.length > 0 && sellTrades.length > 0) {
    patterns.push('Balanced trading approach - active position management')
  }

  // ROI analysis
  if (data.roi > 5) {
    patterns.push('Strong positive returns - effective entry timing')
  } else if (data.roi < -5) {
    patterns.push('Learning opportunity - consider waiting for dips to buy')
  } else {
    patterns.push('Steady performance - maintaining capital preservation')
  }

  // Position analysis
  if (data.holdings > 0 && data.balance > data.portfolioValue * 0.3) {
    patterns.push('Diversified position - good risk management with cash reserve')
  } else if (data.holdings > 0 && data.balance < 1000) {
    patterns.push('Fully invested - high conviction play, monitor closely')
  }

  // Trade frequency
  if (data.trades?.length > 10) {
    patterns.push('Active trader profile - high engagement with market movements')
  }

  return patterns.length > 0 ? patterns.slice(0, 4) : ['Complete more trades to identify patterns']
}
