import { NextRequest, NextResponse } from 'next/server'

// Using CoinGecko API - more reliable DNS resolution
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

// Simple in-memory cache to avoid rate limits
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 60000 // 60 seconds cache

function getCachedData(key: string): any | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const endpoint = searchParams.get('endpoint') || 'coins/markets'
  const ids = searchParams.get('ids') || ''
  const days = searchParams.get('days') || '30'
  
  // Create cache key from request params
  const cacheKey = `${endpoint}-${ids}-${days}`
  
  // Check cache first
  const cachedData = getCachedData(cacheKey)
  if (cachedData) {
    console.log('Cache hit:', cacheKey)
    return NextResponse.json(cachedData)
  }

  try {
    let url = ''
    
    // Route to appropriate CoinGecko endpoint
    if (endpoint === 'markets' || endpoint === 'assets') {
      // Market data for multiple coins
      url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h,7d`
    } else if (endpoint.includes('history')) {
      // Price history for a single coin
      const coinId = endpoint.split('/')[1] || ids.split(',')[0]
      url = `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    } else if (endpoint === 'trending') {
      url = `${COINGECKO_BASE_URL}/search/trending`
    } else if (endpoint === 'simple') {
      url = `${COINGECKO_BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    } else {
      // Default: market data
      url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true`
    }

    console.log('Fetching:', url)

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (response.status === 429) {
      // Rate limited - return cached data if available, otherwise return error
      const anyCached = Array.from(cache.values()).find(c => c.data)
      if (anyCached) {
        return NextResponse.json(anyCached.data)
      }
      return NextResponse.json(
        { error: 'Rate limited. Please wait a moment and try again.' },
        { status: 429 }
      )
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      return NextResponse.json(
        { error: `CoinGecko API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Cache the successful response
    setCachedData(cacheKey, data)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crypto data. Check your internet connection.' },
      { status: 500 }
    )
  }
}
