'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Flame, Info, RefreshCw, Clock, AlertCircle, Wifi, WifiOff } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import { useCryptoMarketDataRealtime, useTrendingCoins } from '@/lib/hooks/useCryptoData'

interface TooltipData {
  term: string
  definition: string
}

const tooltips: Record<string, TooltipData> = {
  price: { term: 'Price', definition: 'The current market price of a single unit of the cryptocurrency. This is what you would pay to buy one token.' },
  marketCap: { term: 'Market Cap', definition: 'Market Capitalization = Price × Total Supply. It represents the total value of all tokens in circulation. A higher market cap generally indicates a more established cryptocurrency, but it doesn\'t tell you about price movement direction.' },
  volume: { term: '24h Volume', definition: 'The total value of all trades in the last 24 hours. Higher volume indicates more market activity and liquidity.' },
}

export default function MarketPage() {
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Fetch real-time market data with WebSocket updates
  const { data: marketData, loading, error, refresh, lastUpdated, isLive } = useCryptoMarketDataRealtime({
    refreshInterval: 120000, // Full refresh every 2 minutes, WebSocket handles live prices
    autoRefresh: true,
  })

  // Fetch trending coins
  const { trending } = useTrendingCoins()

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  const formatPrice = (price: number) => {
    if (price >= 1) return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    if (price >= 0.01) return price.toFixed(4)
    return price.toFixed(6)
  }

  const handleMouseEnter = (term: string, event: React.MouseEvent) => {
    setHoveredTerm(term)
    setTooltipPosition({ x: event.clientX, y: event.clientY })
  }

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never'
    return date.toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Market Watch</h1>
          <p className="text-gray-400">Live cryptocurrency market data with educational tooltips</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Live connection indicator */}
          <div className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full ${
            isLive 
              ? 'bg-cyber-neon-green/20 text-cyber-neon-green border border-cyber-neon-green/30' 
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }`}>
            {isLive ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span>{isLive ? 'Live' : 'Polling'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Updated: {formatLastUpdated(lastUpdated)}</span>
          </div>
          <motion.button
            onClick={() => refresh()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan/20 border border-cyber-cyan/50 rounded-lg hover:bg-cyber-cyan/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>
      </div>

      <GlassCard className="p-6 bg-cyber-cyan/10 border-cyber-cyan/30">
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-cyber-cyan flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-bold mb-2 text-cyber-cyan">Understanding Market Cap vs. Price</h2>
            <p className="text-sm text-gray-300 mb-4">
              Hover over the <span className="text-cyber-cyan font-medium">ℹ️</span> icons to learn more. 
              <strong> Price</strong> = cost of one token. <strong>Market Cap</strong> = total value of all tokens.
            </p>
            <p className="text-xs text-gray-400">
              💡 Data powered by CoinCap API • {isLive ? 'Real-time WebSocket updates' : 'Auto-refreshes every 2 minutes'}
            </p>
          </div>
        </div>
      </GlassCard>

      {error && (
        <GlassCard className="p-4 bg-red-500/10 border-red-500/30">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-red-400 font-medium">Failed to load market data</p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
          </div>
        </GlassCard>
      )}

      <GlassCard className="p-6 overflow-x-auto">
        <div className="min-w-[800px]">
          {loading && marketData.length === 0 ? (
            <div className="space-y-4">
              {/* Skeleton loading */}
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3 animate-pulse">
                  <div className="w-8 h-4 bg-gray-700 rounded" />
                  <div className="w-10 h-10 bg-gray-700 rounded-full" />
                  <div className="flex-1">
                    <div className="w-24 h-4 bg-gray-700 rounded mb-2" />
                    <div className="w-16 h-3 bg-gray-700 rounded" />
                  </div>
                  <div className="w-20 h-4 bg-gray-700 rounded" />
                  <div className="w-16 h-4 bg-gray-700 rounded" />
                  <div className="w-24 h-4 bg-gray-700 rounded" />
                  <div className="w-24 h-4 bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 font-bold">#</th>
                  <th className="text-left py-4 px-4 font-bold">Coin</th>
                  <th className="text-right py-4 px-4 font-bold">
                    <div className="inline-flex items-center gap-2">
                      Price
                      <Info className="w-4 h-4 text-gray-400 cursor-help" onMouseEnter={(e) => handleMouseEnter('price', e)} onMouseLeave={() => setHoveredTerm(null)} />
                    </div>
                  </th>
                  <th className="text-right py-4 px-4 font-bold">24h Change</th>
                  <th className="text-right py-4 px-4 font-bold">
                    <div className="inline-flex items-center gap-2">
                      Market Cap
                      <Info className="w-4 h-4 text-gray-400 cursor-help" onMouseEnter={(e) => handleMouseEnter('marketCap', e)} onMouseLeave={() => setHoveredTerm(null)} />
                    </div>
                  </th>
                  <th className="text-right py-4 px-4 font-bold">
                    <div className="inline-flex items-center gap-2">
                      24h Volume
                      <Info className="w-4 h-4 text-gray-400 cursor-help" onMouseEnter={(e) => handleMouseEnter('volume', e)} onMouseLeave={() => setHoveredTerm(null)} />
                    </div>
                  </th>
                  <th className="text-right py-4 px-4 font-bold">7d Chart</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((coin, idx) => {
                  const isTrending = trending.includes(coin.id)
                  return (
                    <motion.tr 
                      key={coin.id} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ duration: 0.3, delay: idx * 0.05 }} 
                      className="border-b border-white/5 hover:bg-cyber-navy/60 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 text-gray-400">{coin.market_cap_rank}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={coin.image} 
                            alt={coin.name} 
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="font-bold flex items-center gap-2">
                              {coin.name} 
                              {isTrending && <Flame className="w-4 h-4 text-orange-400" title="Trending" />}
                            </div>
                            <div className="text-sm text-gray-400 uppercase">{coin.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-4 px-4 font-medium">
                        ${formatPrice(coin.current_price)}
                      </td>
                      <td className="text-right py-4 px-4">
                        <div className={`inline-flex items-center gap-1 font-medium ${
                          coin.price_change_percentage_24h >= 0 ? 'text-cyber-neon-green' : 'text-red-400'
                        }`}>
                          {coin.price_change_percentage_24h >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                          {coin.price_change_percentage_24h?.toFixed(2)}%
                        </div>
                      </td>
                      <td className="text-right py-4 px-4 text-gray-300">
                        {formatCurrency(coin.market_cap)}
                      </td>
                      <td className="text-right py-4 px-4 text-gray-400">
                        {formatCurrency(coin.total_volume)}
                      </td>
                      <td className="text-right py-4 px-4">
                        {coin.sparkline_in_7d?.price && (
                          <MiniSparkline 
                            data={coin.sparkline_in_7d.price} 
                            isPositive={coin.price_change_percentage_24h >= 0}
                          />
                        )}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>

      {hoveredTerm && tooltips[hoveredTerm] && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.9 }} 
          className="fixed z-50 pointer-events-none" 
          style={{ left: `${tooltipPosition.x + 20}px`, top: `${tooltipPosition.y - 20}px`, maxWidth: '300px' }}
        >
          <GlassCard className="p-4 bg-cyber-navy shadow-2xl border-cyber-cyan/50">
            <h3 className="font-bold text-cyber-cyan mb-2">{tooltips[hoveredTerm].term}</h3>
            <p className="text-sm text-gray-300">{tooltips[hoveredTerm].definition}</p>
          </GlassCard>
        </motion.div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Market Heatmap</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {marketData.slice(0, 10).map((coin) => (
            <motion.div 
              key={coin.id} 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              whileHover={{ scale: 1.05 }} 
              className={`glass-card p-4 text-center cursor-pointer transition-all ${
                coin.price_change_percentage_24h >= 0 
                  ? 'bg-green-500/20 border-green-500/40 hover:border-green-500/60' 
                  : 'bg-red-500/20 border-red-500/40 hover:border-red-500/60'
              }`}
            >
              <img src={coin.image} alt={coin.name} className="w-8 h-8 mx-auto mb-2 rounded-full" />
              <div className="font-bold text-lg mb-1 uppercase">{coin.symbol}</div>
              <div className={`text-sm font-medium flex items-center justify-center gap-1 ${
                coin.price_change_percentage_24h >= 0 ? 'text-cyber-neon-green' : 'text-red-400'
              }`}>
                {coin.price_change_percentage_24h >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </div>
              {trending.includes(coin.id) && (
                <Flame className="w-4 h-4 text-orange-400 mx-auto mt-2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Mini sparkline component for 7d chart
function MiniSparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  // Sample every 4th point for a smoother mini chart
  const sampledData = data.filter((_, i) => i % 4 === 0)
  const min = Math.min(...sampledData)
  const max = Math.max(...sampledData)
  const range = max - min || 1

  const points = sampledData
    .map((value, index) => {
      const x = (index / (sampledData.length - 1)) * 80
      const y = 20 - ((value - min) / range) * 20
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width="80" height="24" className="inline-block">
      <polyline
        fill="none"
        stroke={isPositive ? '#00ff88' : '#ff4d4d'}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  )
}
