'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, TrendingUp, TrendingDown, AlertCircle, RefreshCw, Clock, Shield, Info } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import AnimatedGauge from '@/components/AnimatedGauge'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts'
import { useCryptoWithRisk, usePriceHistory } from '@/lib/hooks/useCryptoData'
import { CoinMarketData, calculateVolatilityScore } from '@/lib/api/crypto'

interface EnhancedCoinData extends CoinMarketData {
  riskScore: number
}

export default function RiskLabPage() {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>('bitcoin')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch real-time market data with risk scores
  const { coins, loading, error, refresh, lastUpdated } = useCryptoWithRisk({
    refreshInterval: 60000,
    autoRefresh: true,
  })

  // Fetch price history for selected coin (30 days)
  const { history: priceHistory, loading: historyLoading } = usePriceHistory(selectedCoinId, 30)

  const selectedCoin = coins.find(c => c.id === selectedCoinId) || null

  // Filter coins based on search
  const filteredCoins = coins.filter(
    coin => coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Transform price history for chart
  const chartData = priceHistory?.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: price,
    timestamp,
  })) || []

  // Calculate volatility from sparkline if available
  const getVolatilityData = (coin: EnhancedCoinData | null) => {
    if (!coin?.sparkline_in_7d?.price) return []
    const prices = coin.sparkline_in_7d.price
    // Sample every 6 hours (every 6 data points since sparkline is hourly)
    return prices
      .filter((_, i) => i % 6 === 0)
      .map((price, idx) => ({
        hour: idx * 6,
        value: price,
      }))
  }

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    if (price >= 0.01) return `$${price.toFixed(4)}`
    return `$${price.toFixed(6)}`
  }

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never'
    return date.toLocaleTimeString()
  }

  const getRiskLevel = (score: number): { label: string; color: string } => {
    if (score <= 3) return { label: 'Low Risk', color: 'text-cyber-neon-green' }
    if (score <= 5) return { label: 'Moderate Risk', color: 'text-yellow-400' }
    if (score <= 7) return { label: 'High Risk', color: 'text-orange-400' }
    return { label: 'Very High Risk', color: 'text-red-400' }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Risk Lab</h1>
          <p className="text-gray-400">Analyze cryptocurrency risk factors and volatility patterns</p>
        </div>
        <div className="flex items-center gap-4">
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

      {/* Risk Education Card */}
      <GlassCard className="p-6 bg-cyber-cyan/10 border-cyber-cyan/30">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-cyber-cyan flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-bold mb-2 text-cyber-cyan">Understanding Crypto Risk</h2>
            <p className="text-sm text-gray-300 mb-2">
              Risk scores are calculated based on <strong>market cap</strong>, <strong>24h volatility</strong>, 
              <strong>7d price changes</strong>, and <strong>market rank</strong>. Higher scores indicate more volatile assets.
            </p>
            <p className="text-xs text-gray-400">
              💡 Data powered by CoinCap API • Scores range from 0 (low risk) to 10 (high risk)
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

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold mb-6">Risk Assessment</h2>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a cryptocurrency..."
              className="w-full bg-cyber-navy/60 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyber-cyan transition-colors"
            />
          </div>
          
          {loading && coins.length === 0 ? (
            <div className="space-y-3">
              {/* Skeleton loading */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 rounded-lg border border-white/10 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full" />
                    <div className="flex-1">
                      <div className="w-24 h-4 bg-gray-700 rounded mb-2" />
                      <div className="w-16 h-3 bg-gray-700 rounded" />
                    </div>
                    <div className="w-16 h-6 bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredCoins.map((coin) => {
                const riskLevel = getRiskLevel(coin.riskScore)
                return (
                  <motion.button
                    key={coin.id}
                    onClick={() => setSelectedCoinId(coin.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      selectedCoinId === coin.id
                        ? 'border-cyber-cyan bg-cyber-cyan/20 shadow-cyber-glow'
                        : 'border-white/10 bg-cyber-navy/60 hover:border-cyber-cyan/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="font-bold text-lg uppercase">{coin.symbol}</div>
                          <div className="text-sm text-gray-400">{coin.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-cyber-neon-green' : 'text-red-400'}`}>
                          {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                        </div>
                        <div className={`text-sm ${riskLevel.color}`}>
                          Risk: {coin.riskScore}/10
                        </div>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )}
        </GlassCard>

        {selectedCoin && (
          <motion.div
            key={selectedCoin.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <img src={selectedCoin.image} alt={selectedCoin.name} className="w-10 h-10 rounded-full" />
                <div>
                  <h2 className="text-xl font-bold">{selectedCoin.name}</h2>
                  <span className="text-sm text-gray-400 uppercase">{selectedCoin.symbol}</span>
                </div>
              </div>

              <div className="flex items-center justify-center mb-8">
                <AnimatedGauge value={selectedCoin.riskScore} label="Risk Factor" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-card p-4 bg-cyber-navy/60">
                  <div className="text-sm text-gray-400 mb-1">Current Price</div>
                  <div className="text-2xl font-bold">{formatPrice(selectedCoin.current_price)}</div>
                </div>
                <div className={`glass-card p-4 ${
                  selectedCoin.price_change_percentage_24h >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="text-sm text-gray-400 mb-1">24h Change</div>
                  <div className={`text-2xl font-bold flex items-center gap-2 ${
                    selectedCoin.price_change_percentage_24h >= 0 ? 'text-cyber-neon-green' : 'text-red-400'
                  }`}>
                    {selectedCoin.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="w-6 h-6" />
                    ) : (
                      <TrendingDown className="w-6 h-6" />
                    )}
                    {selectedCoin.price_change_percentage_24h >= 0 ? '+' : ''}{selectedCoin.price_change_percentage_24h?.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Additional stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="glass-card p-3 bg-cyber-navy/40 text-center">
                  <div className="text-xs text-gray-400 mb-1">Market Cap</div>
                  <div className="font-bold text-sm">
                    ${(selectedCoin.market_cap / 1e9).toFixed(1)}B
                  </div>
                </div>
                <div className="glass-card p-3 bg-cyber-navy/40 text-center">
                  <div className="text-xs text-gray-400 mb-1">24h Volume</div>
                  <div className="font-bold text-sm">
                    ${(selectedCoin.total_volume / 1e9).toFixed(1)}B
                  </div>
                </div>
                <div className="glass-card p-3 bg-cyber-navy/40 text-center">
                  <div className="text-xs text-gray-400 mb-1">Rank</div>
                  <div className="font-bold text-sm">
                    #{selectedCoin.market_cap_rank}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  Price History (30D)
                  {historyLoading && <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />}
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="#6B7280" fontSize={10} interval="preserveStartEnd" />
                      <YAxis 
                        stroke="#6B7280" 
                        fontSize={10} 
                        tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value.toFixed(0)}`}
                        domain={['dataMin', 'dataMax']}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(26, 31, 46, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: '#fff' }}
                        formatter={(value: number) => [formatPrice(value), 'Price']}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#00D9FF"
                        strokeWidth={2}
                        fill="url(#priceGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {selectedCoin.riskScore >= 7 && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-red-400 mb-1">High Risk Warning</div>
                    <div className="text-sm text-gray-300">
                      This cryptocurrency shows elevated volatility. Consider this in your investment strategy 
                      and never invest more than you can afford to lose.
                    </div>
                  </div>
                </div>
              )}

              {selectedCoin.riskScore <= 4 && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                  <Shield className="w-5 h-5 text-cyber-neon-green flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-cyber-neon-green mb-1">Lower Risk Asset</div>
                    <div className="text-sm text-gray-300">
                      This cryptocurrency has a relatively stable market profile compared to others. 
                      However, all crypto investments carry inherent risk.
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}
