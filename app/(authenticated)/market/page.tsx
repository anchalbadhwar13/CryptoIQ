'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Flame, Info, DollarSign, BarChart3 } from 'lucide-react'
import GlassCard from '@/components/GlassCard'

interface MarketCoin {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  trending: boolean
}

const mockMarketData: MarketCoin[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 71000, change24h: 3.1, marketCap: 1.3e12, volume24h: 45000000000, trending: true },
  { symbol: 'ETH', name: 'Ethereum', price: 3500, change24h: -3.1, marketCap: 420000000000, volume24h: 18000000000, trending: false },
  { symbol: 'SOL', name: 'Solana', price: 180, change24h: -5.2, marketCap: 85000000000, volume24h: 3200000000, trending: false },
  { symbol: 'ADA', name: 'Cardano', price: 0.52, change24h: -3.5, marketCap: 18000000000, volume24h: 450000000, trending: false },
  { symbol: 'BNB', name: 'Binance Coin', price: 620, change24h: 5.2, marketCap: 95000000000, volume24h: 2800000000, trending: true },
  { symbol: 'XRP', name: 'Ripple', price: 0.65, change24h: 2.3, marketCap: 35000000000, volume24h: 1800000000, trending: true },
]

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

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  const handleMouseEnter = (term: string, event: React.MouseEvent) => {
    setHoveredTerm(term)
    setTooltipPosition({ x: event.clientX, y: event.clientY })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Market Watch</h1>
        <p className="text-gray-400">Live cryptocurrency market data with educational tooltips</p>
      </div>

      <GlassCard className="p-6 bg-cyber-cyan/10 border-cyber-cyan/30">
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-cyber-cyan flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-bold mb-2 text-cyber-cyan">Understanding Market Cap vs. Price</h2>
            <p className="text-sm text-gray-300 mb-4">
              Hover over the <span className="text-cyber-cyan font-medium">ℹ️</span> icons to learn more. 
              <strong>Price</strong> = cost of one token. <strong>Market Cap</strong> = total value of all tokens.
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6 overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
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
              </tr>
            </thead>
            <tbody>
              {mockMarketData.map((coin, idx) => (
                <motion.tr key={coin.symbol} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="border-b border-white/5 hover:bg-cyber-navy/60 transition-colors cursor-pointer">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-neon-green flex items-center justify-center font-bold text-cyber-dark">{coin.symbol[0]}</div>
                      <div>
                        <div className="font-bold flex items-center gap-2">{coin.name} {coin.trending && <Flame className="w-4 h-4 text-orange-400" />}</div>
                        <div className="text-sm text-gray-400">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-4 px-4 font-medium">${coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price < 1 ? 4 : 2, maximumFractionDigits: coin.price < 1 ? 4 : 2 })}</td>
                  <td className="text-right py-4 px-4">
                    <div className={`inline-flex items-center gap-1 font-medium ${coin.change24h >= 0 ? 'text-cyber-neon-green' : 'text-red-400'}`}>
                      {coin.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                    </div>
                  </td>
                  <td className="text-right py-4 px-4 text-gray-300">{formatCurrency(coin.marketCap)}</td>
                  <td className="text-right py-4 px-4 text-gray-400">{formatCurrency(coin.volume24h)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {hoveredTerm && tooltips[hoveredTerm] && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed z-50 pointer-events-none" style={{ left: `${tooltipPosition.x + 20}px`, top: `${tooltipPosition.y - 20}px`, maxWidth: '300px' }}>
          <GlassCard className="p-4 bg-cyber-navy shadow-2xl border-cyber-cyan/50">
            <h3 className="font-bold text-cyber-cyan mb-2">{tooltips[hoveredTerm].term}</h3>
            <p className="text-sm text-gray-300">{tooltips[hoveredTerm].definition}</p>
          </GlassCard>
        </motion.div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Market Heatmap</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockMarketData.map((coin) => (
            <motion.div key={coin.symbol} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05 }} className={`glass-card p-4 text-center cursor-pointer transition-all ${coin.change24h >= 0 ? 'bg-green-500/20 border-green-500/40 hover:border-green-500/60' : 'bg-red-500/20 border-red-500/40 hover:border-red-500/60'}`}>
              <div className="font-bold text-lg mb-1">{coin.symbol}</div>
              <div className={`text-sm font-medium flex items-center justify-center gap-1 ${coin.change24h >= 0 ? 'text-cyber-neon-green' : 'text-red-400'}`}>
                {coin.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
              </div>
              {coin.trending && <Flame className="w-4 h-4 text-orange-400 mx-auto mt-2" />}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
