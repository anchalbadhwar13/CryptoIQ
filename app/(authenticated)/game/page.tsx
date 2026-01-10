'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, TrendingUp, TrendingDown, DollarSign, Target, Award, Info, X } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import Joyride, { CallBackProps, STATUS, EVENTS, ACTIONS, Step } from 'react-joyride'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface Trade {
  id: string
  type: 'buy' | 'sell'
  price: number
  amount: number
  timestamp: number
}

interface Scenario {
  id: string
  title: string
  description: string
  impact: number
  type: 'positive' | 'negative' | 'neutral'
}

const scenarios: Scenario[] = [
  { id: 'elon-tweet', title: '🚀 Influencer Tweet', description: 'Major influencer tweets positive news about BTC', impact: 8, type: 'positive' },
  { id: 'market-crash', title: '📉 Market Crash', description: 'Sudden market downturn triggers panic selling', impact: -12, type: 'negative' },
  { id: 'regulatory', title: '⚖️ Regulatory News', description: 'New regulations announced, uncertainty rises', impact: -5, type: 'negative' },
  { id: 'adoption', title: '💼 Corporate Adoption', description: 'Major corporation announces crypto adoption', impact: 10, type: 'positive' },
  { id: 'hack', title: '🔐 Security Breach', description: 'Exchange security incident shakes confidence', impact: -8, type: 'negative' },
]

export default function GamePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPrice, setCurrentPrice] = useState(70000)
  const [priceHistory, setPriceHistory] = useState<Array<{ time: number; price: number; open?: number; high?: number; low?: number; close?: number }>>([])
  const [balance, setBalance] = useState(10000)
  const [holdings, setHoldings] = useState(0)
  const [trades, setTrades] = useState<Trade[]>([])
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [sessionStartPrice, setSessionStartPrice] = useState(70000)
  const [time, setTime] = useState(0)
  const [runTutorial, setRunTutorial] = useState(false)
  const [tutorialStepIndex, setTutorialStepIndex] = useState(0)

  const tutorialSteps: Step[] = [
    { target: '.tutorial-chart', content: 'This is the live price chart showing real-time cryptocurrency movements. Watch how the price changes over time!', placement: 'top' },
    { target: '.tutorial-buy', content: 'Click here to buy cryptocurrency at the current market price. Start with small amounts to learn!', placement: 'right' },
    { target: '.tutorial-sell', content: 'Sell your holdings when you want to lock in profits or cut losses. Remember: buy low, sell high!', placement: 'right' },
    { target: '.tutorial-scenario', content: 'Random events can trigger price movements. Watch for scenario popups that explain market dynamics!', placement: 'bottom' },
    { target: '.tutorial-balance', content: 'Track your balance and holdings here. Your goal is to maximize your portfolio value!', placement: 'left' },
  ]

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setTime((prev) => prev + 1)
      const change = (Math.random() - 0.5) * 2
      const newPrice = currentPrice * (1 + change / 100)
      const scenarioImpact = activeScenario ? (activeScenario.impact / 100) : 0
      const finalPrice = newPrice * (1 + scenarioImpact)
      setCurrentPrice(finalPrice)
      setPriceHistory((prev) => {
        const newEntry = { time: prev.length, price: finalPrice, open: prev.length > 0 ? prev[prev.length - 1].price : finalPrice, high: finalPrice * 1.01, low: finalPrice * 0.99, close: finalPrice }
        return [...prev.slice(-100), newEntry]
      })
      if (activeScenario) {
        setTimeout(() => setActiveScenario(null), 3000)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying, currentPrice, activeScenario])

  useEffect(() => {
    if (!isPlaying) return
    const scenarioInterval = setInterval(() => {
      if (Math.random() < 0.15 && !activeScenario) {
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
        setActiveScenario(randomScenario)
        setCurrentPrice((prev) => prev * (1 + randomScenario.impact / 100))
      }
    }, 10000)
    return () => clearInterval(scenarioInterval)
  }, [isPlaying, activeScenario])

  const handleBuy = () => {
    const amount = 0.1
    const cost = currentPrice * amount
    if (balance >= cost) {
      setBalance((prev) => prev - cost)
      setHoldings((prev) => prev + amount)
      setTrades((prev) => [...prev, { id: Date.now().toString(), type: 'buy', price: currentPrice, amount, timestamp: Date.now() }])
    }
  }

  const handleSell = () => {
    if (holdings > 0) {
      const amount = Math.min(holdings, 0.1)
      const revenue = currentPrice * amount
      setBalance((prev) => prev + revenue)
      setHoldings((prev) => prev - amount)
      setTrades((prev) => [...prev, { id: Date.now().toString(), type: 'sell', price: currentPrice, amount, timestamp: Date.now() }])
    }
  }

  const handleTutorialCallback = (data: CallBackProps) => {
    const { status, type, action, index } = data
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setTutorialStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTutorial(false)
      setTutorialStepIndex(0)
    }
  }

  const portfolioValue = balance + holdings * currentPrice
  const roi = ((currentPrice - sessionStartPrice) / sessionStartPrice) * 100
  const profit = portfolioValue - 10000
  const identifiedPatterns = trades.length > 5 ? ['Recognized bullish momentum', 'Identified support level', 'Detected trend reversal'] : []

  return (
    <div className="space-y-6">
      <Joyride steps={tutorialSteps} run={runTutorial} continuous={true} showProgress={true} showSkipButton={true} callback={handleTutorialCallback} stepIndex={tutorialStepIndex} styles={{ options: { primaryColor: '#00D9FF', textColor: '#fff', backgroundColor: '#1A1F2E', overlayColor: 'rgba(11, 14, 20, 0.9)', arrowColor: '#1A1F2E' } }} locale={{ back: 'Back', close: 'Close', last: 'Finish', next: 'Next', skip: 'Skip' }} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Trading Simulator</h1>
          <p className="text-gray-400">Practice trading in a risk-free environment with real-time scenarios</p>
        </div>
        <div className="flex items-center gap-4">
          {!runTutorial && (
            <button onClick={() => { setRunTutorial(true); setTutorialStepIndex(0) }} className="btn-secondary flex items-center gap-2">
              <Info className="w-5 h-5" />
              Start Tutorial
            </button>
          )}
          <button onClick={() => { if (!isPlaying) { setSessionStartPrice(currentPrice); setPriceHistory([{ time: 0, price: currentPrice, open: currentPrice, high: currentPrice, low: currentPrice, close: currentPrice }]); setTime(0) } setIsPlaying(!isPlaying) }} className="btn-primary flex items-center gap-2">
            {isPlaying ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> Start Simulation</>}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {activeScenario && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`glass-card p-6 border-2 ${activeScenario.type === 'positive' ? 'border-cyber-neon-green bg-green-500/10' : activeScenario.type === 'negative' ? 'border-red-500 bg-red-500/10' : 'border-cyber-cyan bg-cyber-cyan/10'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">{activeScenario.title}</h3>
                <p className="text-gray-300">{activeScenario.description}</p>
                <div className="mt-2 text-sm font-medium">Price Impact: {activeScenario.impact >= 0 ? '+' : ''}{activeScenario.impact}%</div>
              </div>
              <button onClick={() => setActiveScenario(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 tutorial-chart">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">BTC/USD</h2>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold">${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div className={`flex items-center gap-1 font-medium ${roi >= 0 ? 'text-cyber-neon-green' : 'text-red-400'}`}>
                    {roi >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-gray-400">
                <div>Session Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</div>
              </div>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} domain={['dataMin - 1000', 'dataMax + 1000']} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(26, 31, 46, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']} />
                  <Line type="monotone" dataKey="price" stroke="#00D9FF" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#00FF88' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
        <div className="space-y-6">
          <GlassCard className="p-6 tutorial-balance">
            <h3 className="font-bold mb-4">Portfolio</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Balance</span>
                <span className="font-bold">${balance.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">BTC Holdings</span>
                <span className="font-bold">{holdings.toFixed(4)} BTC</span>
              </div>
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400">Portfolio Value</span>
                  <span className="font-bold text-lg">${portfolioValue.toFixed(2)}</span>
                </div>
                <div className={`text-sm ${profit >= 0 ? 'text-cyber-neon-green' : 'text-red-400'}`}>
                  {profit >= 0 ? '+' : ''}${profit.toFixed(2)} ({((profit / 10000) * 100).toFixed(2)}%)
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-6 tutorial-scenario">
            <h3 className="font-bold mb-4">Trading Controls</h3>
            <div className="space-y-4">
              <button onClick={handleBuy} disabled={!isPlaying || balance < currentPrice * 0.1} className="w-full btn-primary tutorial-buy disabled:opacity-50 disabled:cursor-not-allowed">
                <DollarSign className="w-5 h-5 inline mr-2" />
                Buy 0.1 BTC
              </button>
              <button onClick={handleSell} disabled={!isPlaying || holdings <= 0} className="w-full btn-secondary tutorial-sell disabled:opacity-50 disabled:cursor-not-allowed">
                <TrendingDown className="w-5 h-5 inline mr-2" />
                Sell 0.1 BTC
              </button>
            </div>
            <div className="mt-4 p-3 bg-cyber-navy/60 rounded-lg text-sm text-gray-400">
              <Info className="w-4 h-4 inline mr-2" />
              Current price: ${currentPrice.toLocaleString()}
            </div>
          </GlassCard>
          {trades.length > 0 && (
            <GlassCard className="p-6">
              <h3 className="font-bold mb-4">Recent Trades</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {trades.slice(-5).reverse().map((trade) => (
                  <div key={trade.id} className={`p-3 rounded-lg border ${trade.type === 'buy' ? 'border-cyber-cyan/30 bg-cyber-cyan/10' : 'border-cyber-neon-green/30 bg-cyber-neon-green/10'}`}>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${trade.type === 'buy' ? 'text-cyber-cyan' : 'text-cyber-neon-green'}`}>{trade.type.toUpperCase()}</span>
                      <span>{trade.amount} BTC</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">@ ${trade.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
      {showSummary && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6" onClick={() => setShowSummary(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()}>
            <GlassCard className="p-8 max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold gradient-text">Session Summary</h2>
                <button onClick={() => setShowSummary(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="glass-card p-4 bg-cyber-navy/60 text-center">
                    <div className="text-sm text-gray-400 mb-1">Total Trades</div>
                    <div className="text-2xl font-bold">{trades.length}</div>
                  </div>
                  <div className="glass-card p-4 bg-cyber-navy/60 text-center">
                    <div className="text-sm text-gray-400 mb-1">Final Value</div>
                    <div className="text-2xl font-bold">${portfolioValue.toFixed(2)}</div>
                  </div>
                  <div className={`glass-card p-4 text-center ${profit >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <div className="text-sm text-gray-400 mb-1">P&L</div>
                    <div className={`text-2xl font-bold ${profit >= 0 ? 'text-cyber-neon-green' : 'text-red-400'}`}>{profit >= 0 ? '+' : ''}${profit.toFixed(2)}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-cyber-cyan" />
                    Patterns Identified
                  </h3>
                  {identifiedPatterns.length > 0 ? (
                    <ul className="space-y-2">
                      {identifiedPatterns.map((pattern, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-300">
                          <Target className="w-4 h-4 text-cyber-neon-green" />
                          {pattern}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm">Complete more trades to identify trading patterns!</p>
                  )}
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-sm mb-4">
                    ROI: {roi >= 0 ? '+' : ''}{roi.toFixed(2)}% | Session Duration: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
                  </p>
                  <button onClick={() => { setShowSummary(false); setIsPlaying(false); setBalance(10000); setHoldings(0); setTrades([]); setCurrentPrice(70000); setPriceHistory([]); setTime(0) }} className="w-full btn-primary">
                    Start New Session
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
      {isPlaying && (
        <div className="flex justify-center">
          <button onClick={() => { setIsPlaying(false); setShowSummary(true) }} className="btn-secondary">
            End Session & View Summary
          </button>
        </div>
      )}
    </div>
  )
}
