/**
 * Script to pre-generate all lesson content using Gemini API
 * Run this script to fetch and display content for all modules
 * 
 * Usage: npx tsx scripts/generate-all-lessons.ts
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import * as fs from 'fs'
import * as path from 'path'

// Fallback YouTube video IDs for each lesson topic
const fallbackVideos: Record<number, string[]> = {
  1: ['3xALYstoMrk', 'GZNUX7mR4yE', 'JO8yAJvY4Lk'], // Cryptocurrency wallets
  2: ['ZbHFLqLKuPo', 'kQFG1wHq-RY', 'B7y2iZ4b0kQ'], // Market cap vs price
  3: ['Bu7dK3JGt3Q', 'hJnMa-XqPSY', 'Vhx6gFQZIrE'], // Candlestick charts
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

async function generateLessonContent(lessonId: number, apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  
  console.log(`\n📚 Generating content for Lesson ${lessonId}...`)
  
  try {
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
      console.error(`⚠️  Failed to parse JSON for lesson ${lessonId}, using fallback structure`)
      parsedResponse = {
        content: text.split('\n\n')[0] || text,
        sections: [
          { title: 'Introduction', content: text.split('\n\n')[0] || text },
          { title: 'Key Concepts', content: text.split('\n\n').slice(1).join('\n\n') || text }
        ],
        keyPoints: []
      }
    }
    
    // Add YouTube videos (fallback if not provided by Gemini)
    if (!parsedResponse.youtubeVideos || parsedResponse.youtubeVideos.length === 0) {
      parsedResponse.youtubeVideos = fallbackVideos[lessonId] || []
      console.log(`  ✓ Using fallback YouTube videos`)
    } else {
      console.log(`  ✓ Received ${parsedResponse.youtubeVideos.length} YouTube video IDs from Gemini`)
    }
    
    return {
      id: lessonId,
      ...parsedResponse,
      generatedAt: new Date().toISOString()
    }
  } catch (error: any) {
    console.error(`  ❌ Error generating lesson ${lessonId}:`, error.message)
    throw error
  }
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY environment variable is not set!')
    console.log('\n📝 To set up your API key:')
    console.log('   1. Get your API key from: https://makersuite.google.com/app/apikey')
    console.log('   2. Create a .env.local file in the project root')
    console.log('   3. Add: GEMINI_API_KEY=your_api_key_here')
    console.log('   4. Restart your development server\n')
    process.exit(1)
  }
  
  console.log('🚀 Starting lesson content generation...')
  console.log('✓ API key found\n')
  
  const lessons = [1, 2, 3]
  const results: any[] = []
  
  for (const lessonId of lessons) {
    try {
      const content = await generateLessonContent(lessonId, apiKey)
      results.push(content)
      console.log(`  ✓ Lesson ${lessonId} generated successfully`)
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`  ❌ Failed to generate lesson ${lessonId}`)
      results.push({
        id: lessonId,
        error: 'Failed to generate content',
        content: '',
        sections: [],
        youtubeVideos: fallbackVideos[lessonId] || [],
        keyPoints: []
      })
    }
  }
  
  console.log('\n✅ Content generation complete!')
  console.log('\n📊 Summary:')
  results.forEach(lesson => {
    if (lesson.error) {
      console.log(`  Lesson ${lesson.id}: ❌ Failed`)
    } else {
      console.log(`  Lesson ${lesson.id}: ✓ Generated`)
      console.log(`    - Content: ${lesson.content?.substring(0, 50)}...`)
      console.log(`    - Sections: ${lesson.sections?.length || 0}`)
      console.log(`    - Videos: ${lesson.youtubeVideos?.length || 0}`)
      console.log(`    - Key Points: ${lesson.keyPoints?.length || 0}`)
    }
  })
  
  console.log('\n💡 Content will be generated on-demand when users access each lesson.')
  console.log('   The API route will call Gemini API when a lesson page is visited.\n')
}

main().catch(console.error)
