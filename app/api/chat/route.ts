import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

interface TradeData {
  type: 'buy' | 'sell'
  price: number
  amount: number
}

export async function POST(req: NextRequest) {
  try {
    // Check if API key exists
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const { message, sessionData, conversationHistory } = await req.json()

    // Build conversation context
    const systemPrompt = `You are an expert crypto trading assistant helping users learn about trading in a simulator. 
You have access to their current session data:
- Current BTC Price: $${sessionData.currentPrice.toLocaleString()}
- Cash Balance: $${sessionData.balance.toFixed(2)}
- BTC Holdings: ${sessionData.holdings.toFixed(4)} BTC
- Portfolio Value: $${sessionData.portfolioValue.toFixed(2)}
- ROI: ${sessionData.roi.toFixed(2)}%
- Total Trades Made: ${sessionData.trades.length}
- Trading Status: ${sessionData.isPlaying ? 'Active' : 'Paused'}

Provide detailed, comprehensive advice about their trades, market analysis, and crypto trading strategies. Include:
- Specific analysis of their current position
- Trading tips and techniques
- Market insights
- Recommendations with reasoning

Be encouraging, educational, and thorough in your responses.`

    const contents = conversationHistory
      .slice(-10) // Keep last 10 messages for context
      .map((msg: any) => ({
        role: msg.type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }))
      .concat([{ role: 'user', parts: [{ text: message }] }])

    // Add system prompt at the beginning if first message
    if (conversationHistory.length === 0) {
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
