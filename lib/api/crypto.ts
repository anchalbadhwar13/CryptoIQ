// CoinGecko Free API Service
// Docs: https://www.coingecko.com/en/api/documentation
// No API key required for basic usage

const API_BASE_URL = '/api/crypto'

export interface CoinMarketData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency?: number
  sparkline_in_7d?: { price: number[] }
  ath: number
  ath_change_percentage: number
  atl: number
  high_24h: number
  low_24h: number
}

export interface PriceHistory {
  prices: [number, number][] // [timestamp, price]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

// Supported coin IDs (CoinGecko format)
export const SUPPORTED_COINS = [
  'bitcoin',
  'ethereum',
  'solana',
  'cardano',
  'binancecoin',
  'ripple',
  'dogecoin',
  'polkadot',
  'avalanche-2',
  'chainlink',
] as const

export type SupportedCoinId = (typeof SUPPORTED_COINS)[number]

// Mapping for display names
export const COIN_ID_MAP: Record<string, string> = {
  'btc': 'bitcoin',
  'eth': 'ethereum',
  'sol': 'solana',
  'ada': 'cardano',
  'bnb': 'binancecoin',
  'xrp': 'ripple',
  'doge': 'dogecoin',
  'dot': 'polkadot',
  'avax': 'avalanche-2',
  'link': 'chainlink',
}

/**
 * Fetch market data for multiple coins
 * CoinGecko returns data directly in the format we need
 */
export async function getMarketData(
  coinIds: string[] = [...SUPPORTED_COINS],
  currency: string = 'usd'
): Promise<CoinMarketData[]> {
  const ids = coinIds.join(',')
  const url = `${API_BASE_URL}?endpoint=markets&ids=${ids}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No data received from API')
  }

  // CoinGecko returns data in the exact format we need
  return data.map((coin: any): CoinMarketData => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    image: coin.image,
    current_price: coin.current_price || 0,
    market_cap: coin.market_cap || 0,
    market_cap_rank: coin.market_cap_rank || 0,
    total_volume: coin.total_volume || 0,
    price_change_percentage_24h: coin.price_change_percentage_24h || 0,
    price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency || 0,
    sparkline_in_7d: coin.sparkline_in_7d,
    ath: coin.ath || 0,
    ath_change_percentage: coin.ath_change_percentage || 0,
    atl: coin.atl || 0,
    high_24h: coin.high_24h || 0,
    low_24h: coin.low_24h || 0,
  }))
}

/**
 * Fetch detailed data for a single coin
 */
export async function getCoinDetail(coinId: string): Promise<CoinMarketData> {
  const data = await getMarketData([coinId])
  if (data.length === 0) {
    throw new Error(`Coin ${coinId} not found`)
  }
  return data[0]
}

/**
 * Fetch price history for charts
 */
export async function getPriceHistory(
  coinId: string,
  days: number | string = 30,
  currency: string = 'usd'
): Promise<PriceHistory> {
  const url = `${API_BASE_URL}?endpoint=history/${coinId}&days=${days}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }

  return {
    prices: data.prices || [],
    market_caps: data.market_caps || [],
    total_volumes: data.total_volumes || [],
  }
}

/**
 * Fetch simple prices for multiple coins (lightweight)
 */
export async function getSimplePrices(
  coinIds: string[] = [...SUPPORTED_COINS],
  currency: string = 'usd'
): Promise<Record<string, { usd: number; usd_24h_change: number }>> {
  const ids = coinIds.join(',')
  const url = `${API_BASE_URL}?endpoint=simple&ids=${ids}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }

  // Transform CoinGecko simple price format
  const prices: Record<string, { usd: number; usd_24h_change: number }> = {}
  Object.entries(data).forEach(([id, values]: [string, any]) => {
    prices[id] = {
      usd: values.usd || 0,
      usd_24h_change: values.usd_24h_change || 0,
    }
  })

  return prices
}

/**
 * Get trending coins
 */
export async function getTrendingCoins(): Promise<{
  coins: Array<{ item: { id: string; name: string; symbol: string; market_cap_rank: number } }>
}> {
  const url = `${API_BASE_URL}?endpoint=trending`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }

  return data
}

/**
 * Calculate a simple risk score (0-10) based on volatility
 */
export function calculateRiskScore(
  priceChange24h: number,
  priceChange7d: number = 0,
  volume: number = 0,
  marketCap: number = 0
): number {
  // Higher volatility = higher risk
  const volatility24h = Math.abs(priceChange24h)
  const volatility7d = Math.abs(priceChange7d)
  
  // Base risk from 24h volatility
  let risk = Math.min(volatility24h / 5, 5) // Max 5 from 24h
  
  // Add risk from 7d volatility
  risk += Math.min(volatility7d / 10, 3) // Max 3 from 7d
  
  // Lower market cap = higher risk (small cap coins are riskier)
  if (marketCap > 0) {
    if (marketCap < 1_000_000_000) risk += 2 // Under 1B
    else if (marketCap < 10_000_000_000) risk += 1 // Under 10B
  }
  
  // Cap at 10
  return Math.min(Math.round(risk * 10) / 10, 10)
}

/**
 * Get risk level label
 */
export function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'extreme' {
  if (score <= 2.5) return 'low'
  if (score <= 5) return 'medium'
  if (score <= 7.5) return 'high'
  return 'extreme'
}

/**
 * Get risk color for UI
 */
export function getRiskColor(score: number): string {
  if (score <= 2.5) return '#22c55e' // green
  if (score <= 5) return '#eab308' // yellow
  if (score <= 7.5) return '#f97316' // orange
  return '#ef4444' // red
}
