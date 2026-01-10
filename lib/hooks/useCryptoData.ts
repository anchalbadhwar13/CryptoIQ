'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getMarketData,
  getPriceHistory,
  getSimplePrices,
  getTrendingCoins,
  calculateRiskScore,
  CoinMarketData,
  PriceHistory,
  SUPPORTED_COINS,
} from '@/lib/api/crypto'

interface UseCryptoDataOptions {
  coinIds?: string[]
  refreshInterval?: number // in milliseconds
  autoRefresh?: boolean
}

interface UseCryptoDataReturn {
  data: CoinMarketData[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  lastUpdated: Date | null
}

/**
 * Hook for fetching market data with auto-refresh
 */
export function useCryptoMarketData(
  options: UseCryptoDataOptions = {}
): UseCryptoDataReturn {
  const {
    coinIds = [...SUPPORTED_COINS],
    refreshInterval = 60000, // Default: 60 seconds
    autoRefresh = true,
  } = options

  const [data, setData] = useState<CoinMarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const marketData = await getMarketData(coinIds)
      setData(marketData)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [coinIds])

  useEffect(() => {
    fetchData()

    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, autoRefresh, refreshInterval])

  return { data, loading, error, refresh: fetchData, lastUpdated }
}

/**
 * Hook for fetching price history for a specific coin
 */
export function usePriceHistory(
  coinId: string | null,
  days: number = 30
): {
  history: PriceHistory | null
  loading: boolean
  error: string | null
} {
  const [history, setHistory] = useState<PriceHistory | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!coinId) {
      setHistory(null)
      return
    }

    const fetchHistory = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getPriceHistory(coinId, days)
        setHistory(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [coinId, days])

  return { history, loading, error }
}

/**
 * Hook for simple price updates (lightweight, faster updates)
 */
export function useSimplePrices(
  coinIds: string[] = [...SUPPORTED_COINS],
  refreshInterval: number = 30000
): {
  prices: Record<string, { usd: number; usd_24h_change: number }>
  loading: boolean
  error: string | null
} {
  const [prices, setPrices] = useState<Record<string, { usd: number; usd_24h_change: number }>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setError(null)
        const data = await getSimplePrices(coinIds)
        setPrices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch prices')
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, refreshInterval)
    return () => clearInterval(interval)
  }, [coinIds, refreshInterval])

  return { prices, loading, error }
}

/**
 * Hook for trending coins
 */
export function useTrendingCoins(): {
  trending: string[]
  loading: boolean
  error: string | null
} {
  const [trending, setTrending] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingCoins()
        setTrending(data.coins.map((c: any) => c.item.id))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trending')
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  return { trending, loading, error }
}

/**
 * Enhanced hook combining market data with risk calculations
 */
export function useCryptoWithRisk(options: UseCryptoDataOptions = {}): {
  coins: Array<CoinMarketData & { riskScore: number }>
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  lastUpdated: Date | null
} {
  const { data, loading, error, refresh, lastUpdated } = useCryptoMarketData(options)

  const coinsWithRisk = data.map(coin => ({
    ...coin,
    riskScore: calculateRiskScore(
      coin.price_change_percentage_24h,
      coin.price_change_percentage_7d_in_currency || 0,
      coin.total_volume,
      coin.market_cap
    ),
  }))

  return { coins: coinsWithRisk, loading, error, refresh, lastUpdated }
}

/**
 * Hook for market data with frequent polling (simulates real-time)
 * Polls every 60 seconds for fresh data (respects CoinGecko free tier limits)
 */
export function useCryptoMarketDataRealtime(
  options: UseCryptoDataOptions = {}
): UseCryptoDataReturn & { isLive: boolean } {
  const { coinIds = [...SUPPORTED_COINS] } = options
  
  // Get full market data with 60 second refresh (respects rate limits)
  const { data, loading, error, refresh, lastUpdated } = useCryptoMarketData({
    ...options,
    coinIds,
    refreshInterval: 60000, // Poll every 60 seconds
    autoRefresh: true,
  })

  // isLive indicates data is being auto-refreshed
  const isLive = !loading && !error && data.length > 0

  return {
    data,
    loading,
    error,
    refresh,
    lastUpdated,
    isLive,
  }
}
