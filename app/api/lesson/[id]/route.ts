import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as fs from 'fs'
import * as path from 'path'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Path to cached content
const CACHE_FILE = path.join(process.cwd(), 'data', 'lessons', 'cached-content.json')

// Load cached content
function loadCachedContent() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading cache:', error)
  }
  return { lessons: {}, generatedAt: null }
}

// Save content to cache
function saveToCache(lessonId: number, content: any) {
  try {
    const cache = loadCachedContent()
    cache.lessons[lessonId] = content
    cache.generatedAt = new Date().toISOString()
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving to cache:', error)
  }
}

// YouTube video IDs for each lesson (user-provided)
const lessonVideos: Record<number, string[]> = {
  1: ['AdXpYGnFhs0'], // Cryptocurrency wallets - What is a wallet in cryptocurrency
  2: ['KkE3kweQKgE'], // Market cap vs price - Market cap vs price
  3: ['AOz1YPOKvEs'], // Candlestick charts - What is candlestick charts in crypto
}

const lessonPrompts: Record<number, string> = {
  1: `Generate comprehensive educational content about cryptocurrency wallets for beginners. Include:
- A clear, beginner-friendly explanation of what a cryptocurrency wallet is
- Different types of wallets: hot wallets (software, mobile, web) vs cold wallets (hardware, paper)
- How wallets work: public keys (addresses) and private keys
- Security best practices: seed phrases, backups, 2FA
- Common wallet mistakes beginners make and how to avoid them
- Examples of popular wallet options

Provide the response as a JSON object with this exact structure:
{
  "content": "A comprehensive introduction paragraph explaining cryptocurrency wallets in simple terms (3-4 sentences)",
  "sections": [
    {"title": "What is a Cryptocurrency Wallet?", "content": "Detailed explanation here"},
    {"title": "Types of Wallets", "content": "Explain hot vs cold wallets with examples"},
    {"title": "How Wallets Work", "content": "Explain public/private keys, addresses, transactions"},
    {"title": "Security Best Practices", "content": "Important security tips and precautions"},
    {"title": "Common Mistakes to Avoid", "content": "List of mistakes and how to prevent them"}
  ],
  "keyPoints": [
    "A cryptocurrency wallet stores your private keys, not the coins themselves",
    "Cold wallets (hardware/paper) are more secure than hot wallets",
    "Never share your private key or seed phrase with anyone",
    "Always backup your wallet and store backups securely",
    "Research wallet options before choosing one"
  ]
}`,
  
  2: `Generate comprehensive educational content about Market Cap vs Price in cryptocurrency. Include:
- Clear explanation of what market capitalization means in crypto
- How market cap is calculated: price × circulating supply
- Why market cap matters more than price alone (examples: Bitcoin vs Shiba Inu)
- Real-world examples comparing cryptocurrencies with similar market caps but different prices
- How to use market cap for investment decisions
- Common misconceptions about price vs market cap

Provide the response as a JSON object with this exact structure:
{
  "content": "A comprehensive introduction explaining why market cap matters more than price in cryptocurrency (3-4 sentences)",
  "sections": [
    {"title": "Understanding Market Capitalization", "content": "Definition and calculation formula"},
    {"title": "Price vs Market Cap: Why the Difference Matters", "content": "Explain with examples like Bitcoin vs meme coins"},
    {"title": "Real-World Examples", "content": "Compare different cryptocurrencies to illustrate the concept"},
    {"title": "Using Market Cap for Investment Decisions", "content": "Practical guidance on evaluating investments"},
    {"title": "Common Misconceptions", "content": "Debunk myths about price vs market cap"}
  ],
  "keyPoints": [
    "Market cap = Price × Circulating Supply",
    "A lower-priced coin isn't necessarily cheaper to invest in",
    "Market cap shows the total value of a cryptocurrency",
    "Compare market caps, not prices, when evaluating investments",
    "Price alone can be misleading; always consider market cap"
  ]
}`,
  
  3: `Generate comprehensive educational content about candlestick charts in cryptocurrency trading. Include:
- History and origin of candlestick charts (Japanese rice trading)
- Anatomy of a candlestick: open, high, low, close (OHLC)
- Bullish vs bearish candles explained
- Essential candlestick patterns: doji, hammer, engulfing patterns, shooting star
- How to read candlestick patterns for trading signals
- Practical tips for using candlesticks in crypto trading
- Common mistakes when reading candlesticks

Provide the response as a JSON object with this exact structure:
{
  "content": "A comprehensive introduction to candlestick charts and their importance in trading (3-4 sentences)",
  "sections": [
    {"title": "What are Candlestick Charts?", "content": "History and basic explanation"},
    {"title": "Reading a Candlestick", "content": "Explain OHLC and candle anatomy"},
    {"title": "Bullish vs Bearish Patterns", "content": "Green/red candles and what they mean"},
    {"title": "Essential Candlestick Patterns", "content": "Doji, hammer, engulfing, shooting star with examples"},
    {"title": "Trading with Candlesticks", "content": "Practical tips and strategies"},
    {"title": "Common Mistakes", "content": "What to avoid when reading candlestick charts"}
  ],
  "keyPoints": [
    "Candlesticks show open, high, low, and close prices in one visual",
    "Green candles indicate price went up; red candles show price went down",
    "Patterns like doji suggest market indecision",
    "Never rely on candlesticks alone; use with other indicators",
    "Practice reading patterns on historical charts before trading"
  ]
}`
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lessonId = parseInt(params.id)
    
    if (!lessonPrompts[lessonId]) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Check cache first
    const cache = loadCachedContent()
    if (cache.lessons[lessonId]) {
      return NextResponse.json(cache.lessons[lessonId])
    }

    // If not in cache, generate new content
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Gemini API key not configured',
          content: 'Please set GEMINI_API_KEY in your environment variables.',
          sections: [],
          youtubeVideos: [],
          keyPoints: []
        },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const prompt = lessonPrompts[lessonId]
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse JSON from the response
    let parsedResponse
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || text.match(/(\{[\s\S]*\})/)
      const jsonString = jsonMatch ? jsonMatch[1] : text
      parsedResponse = JSON.parse(jsonString)
    } catch (parseError) {
      // If parsing fails, create a structured response from the text
      parsedResponse = {
        content: text.split('\n\n')[0] || text,
        sections: [
          { title: 'Introduction', content: text.split('\n\n')[0] || text },
          { title: 'Key Concepts', content: text.split('\n\n').slice(1).join('\n\n') || text }
        ],
        youtubeVideos: [],
        keyPoints: text.split('\n').filter((line: string) => line.trim().startsWith('-') || line.trim().startsWith('•')).slice(0, 5).map((line: string) => line.replace(/^[-•]\s*/, ''))
      }
    }

    // Use user-provided YouTube videos
    parsedResponse.youtubeVideos = lessonVideos[lessonId] || []

    // Ensure sections and keyPoints are arrays
    if (!parsedResponse.sections || !Array.isArray(parsedResponse.sections)) {
      parsedResponse.sections = []
    }
    if (!parsedResponse.keyPoints || !Array.isArray(parsedResponse.keyPoints)) {
      parsedResponse.keyPoints = []
    }

    const finalContent = {
      id: lessonId,
      ...parsedResponse,
      generatedAt: new Date().toISOString()
    }

    // Save to cache
    saveToCache(lessonId, finalContent)

    return NextResponse.json(finalContent)
  } catch (error: any) {
    console.error('Error generating lesson content:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate lesson content',
        message: error.message,
        content: 'Unable to fetch content from Gemini API. Please check your API key and try again.',
        sections: [],
        youtubeVideos: [],
        keyPoints: []
      },
      { status: 500 }
    )
  }
}
