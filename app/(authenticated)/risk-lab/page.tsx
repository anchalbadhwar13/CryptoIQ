'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import AnimatedGauge from '@/components/AnimatedGauge'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface CoinData {
  symbol: string
  name: string
  riskScore: number
  price: number
  change24h: number
  volatility: Array<{ date: string; value: number }>
}

const mockCoins: CoinData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    riskScore: 8.2,
    price: 71000,
    change24h: 3.1,
    volatility: Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1}`,
      value: 65 + Math.sin(i / 5) * 10 + Math.random() * 5,
    })),
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    riskScore: 6.5,
    price: 3500,
    change24h: -3.1,
    volatility: Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1}`,
      value: 55 + Math.cos(i / 4) * 8 + Math.random() * 4,
    })),
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    riskScore: 7.8,
    price: 180,
    change24h: -5.2,
    volatility: Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1}`,
      value: 70 + Math.sin(i / 3) * 12 + Math.random() * 6,
    })),
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    riskScore: 5.2,
    price: 0.52,
    change24h: -3.5,
    volatility: Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1}`,
      value: 45 + Math.cos(i / 6) * 6 + Math.random() * 3,
    })),
  },
]

export default function RiskLabPage() {
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(mockCoins[0])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCoins = mockCoins.filter(
    coin => coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Risk Lab</h1>
        <p className="text-gray-400">Analyze cryptocurrency risk factors and volatility patterns</p>
      </div>

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
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCoins.map((coin) => (
              <motion.button
                key={coin.symbol}
                onClick={() => setSelectedCoin(coin)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-lg border transition-all text-left ${
                  selectedCoin?.symbol === coin.symbol
                    ? 'border-cyber-cyan bg-cyber-cyan/20 shadow-cyber-glow'
                    : 'border-white/10 bg-cyber-navy/60 hover:border-cyber-cyan/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">{coin.symbol}</div>
                    <div className="text-sm text-gray-400">{coin.name}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${coin.change24h >= 0 ? 'text-cyber-neon-green' : 'text-red-400'}`}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                    </div>
                    <div className="text-sm text-gray-400">Risk: {coin.riskScore}/10</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </GlassCard>

        {selectedCoin && (
          <motion.div
            key={selectedCoin.symbol}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold mb-6">{selectedCoin.name} ({selectedCoin.symbol})</h2>
              <div className="flex items-center justify-center mb-8">
                <AnimatedGauge value={selectedCoin.riskScore} label="Risk Factor" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-card p-4 bg-cyber-navy/60">
                  <div className="text-sm text-gray-400 mb-1">Current Price</div>
                  <div className="text-2xl font-bold">${selectedCoin.price.toLocaleString()}</div>
                </div>
                <div className={`glass-card p-4 ${
                  selectedCoin.change24h >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="text-sm text-gray-400 mb-1">24h Change</div>
                  <div className={`text-2xl font-bold flex items-center gap-2 ${
                    selectedCoin.change24h >= 0 ? 'text-cyber-neon-green' : 'text-red-400'
                  }`}>
                    {selectedCoin.change24h >= 0 ? (
                      <TrendingUp className="w-6 h-6" />
                    ) : (
                      <TrendingDown className="w-6 h-6" />
                    )}
                    {selectedCoin.change24h >= 0 ? '+' : ''}{selectedCoin.change24h}%
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Volatility (30D)</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedCoin.volatility}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(26, 31, 46, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#00D9FF"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#00FF88' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {selectedCoin.riskScore >= 7 && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-red-400 mb-1">High Risk Warning</div>
                    <div className="text-sm text-gray-300">
                      This cryptocurrency shows elevated volatility. Consider this in your investment strategy.
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
