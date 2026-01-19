'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Gamepad2, Shield, TrendingUp, Award, AlertTriangle, Users, DollarSign, Zap, TrendingDown } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

// Floating Crypto Coin Component
const FloatingCoin = ({ delay, duration, x, size, icon, color }: { delay: number; duration: number; x: number; size: number; icon: string; color: string }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: `${x}%` }}
    initial={{ y: '100vh', opacity: 0, rotate: 0 }}
    animate={{ 
      y: '-100vh', 
      opacity: [0, 1, 1, 0],
      rotate: 360,
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'linear',
    }}
  >
    <div 
      className={`rounded-full flex items-center justify-center font-bold shadow-lg ${color}`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {icon}
    </div>
  </motion.div>
)

// Animated Phone Mockup Component
const PhoneMockup = () => {
  const [prices, setPrices] = useState([
    { symbol: 'BTC', name: 'Bitcoin', price: 67234.52, change: 2.34, up: true },
    { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change: -1.23, up: false },
    { symbol: 'SOL', name: 'Solana', price: 142.89, change: 5.67, up: true },
    { symbol: 'ADA', name: 'Cardano', price: 0.58, change: 3.21, up: true },
  ])

  // Simulate price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(coin => ({
        ...coin,
        price: coin.price * (1 + (Math.random() - 0.5) * 0.002),
        change: coin.change + (Math.random() - 0.5) * 0.5,
        up: Math.random() > 0.4,
      })))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      {/* Phone Frame */}
      <div className="relative w-[280px] h-[580px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl shadow-cyber-cyan/20">
        {/* Phone Inner Bezel */}
        <div className="w-full h-full bg-cyber-dark rounded-[2.5rem] overflow-hidden relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-10" />
          
          {/* Screen Content */}
          <div className="p-4 pt-10 h-full bg-gradient-to-b from-cyber-navy to-cyber-dark">
            {/* App Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyber-cyan to-cyber-neon-green rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-cyber-dark">$</span>
                </div>
                <span className="text-white font-semibold text-sm">CoinCoach</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-cyber-neon-green animate-pulse" />
                <span className="text-xs text-gray-400">Live</span>
              </div>
            </div>

            {/* Portfolio Value */}
            <motion.div 
              className="glass-card p-4 mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-gray-400 text-xs mb-1">Portfolio Value</p>
              <motion.p 
                className="text-2xl font-bold text-white"
                key={prices[0].price}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
              >
                $12,458.32
              </motion.p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-cyber-neon-green" />
                <span className="text-cyber-neon-green text-xs">+$324.56 (2.68%)</span>
              </div>
            </motion.div>

            {/* Crypto List */}
            <div className="space-y-2">
              {prices.map((coin, idx) => (
                <motion.div
                  key={coin.symbol}
                  className="glass-card p-3 flex items-center justify-between"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1 + idx * 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      coin.symbol === 'BTC' ? 'bg-orange-500' :
                      coin.symbol === 'ETH' ? 'bg-blue-500' :
                      coin.symbol === 'SOL' ? 'bg-purple-500' : 'bg-blue-400'
                    }`}>
                      {coin.symbol.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium">{coin.symbol}</p>
                      <p className="text-gray-500 text-[10px]">{coin.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <motion.p 
                      className="text-white text-xs font-medium"
                      key={coin.price}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                    >
                      ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </motion.p>
                    <p className={`text-[10px] flex items-center justify-end gap-0.5 ${coin.up ? 'text-cyber-neon-green' : 'text-red-400'}`}>
                      {coin.up ? <TrendingUp className="w-2 h-2" /> : <TrendingDown className="w-2 h-2" />}
                      {coin.change > 0 ? '+' : ''}{coin.change.toFixed(2)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mini Chart Animation */}
            <motion.div 
              className="mt-4 glass-card p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">BTC/USD</span>
                <span className="text-xs text-cyber-neon-green">Live</span>
              </div>
              <svg className="w-full h-16" viewBox="0 0 200 60">
                <motion.path
                  d="M0,40 Q20,35 40,38 T80,30 T120,35 T160,25 T200,30"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1.8 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00D9FF" />
                    <stop offset="100%" stopColor="#00FF88" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Glow Effect Behind Phone */}
      <div className="absolute -inset-10 bg-gradient-to-r from-cyber-cyan/20 via-cyber-neon-green/20 to-cyber-cyan/20 rounded-full blur-3xl -z-10 animate-pulse" />
      
      {/* Floating Elements Around Phone */}
      <motion.div
        className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg"
        animate={{ y: [-5, 5, -5], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-2xl font-bold">₿</span>
      </motion.div>
      
      <motion.div
        className="absolute -bottom-4 -left-8 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
        animate={{ y: [5, -5, 5], rotate: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xl font-bold">Ξ</span>
      </motion.div>
      
      <motion.div
        className="absolute top-1/3 -left-12 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
        animate={{ y: [-8, 8, -8], x: [-2, 2, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-lg font-bold">◎</span>
      </motion.div>
    </motion.div>
  )
}

// Particle Background Component
const ParticleBackground = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-cyber-cyan/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Floating coins configuration
  const floatingCoins = [
    { delay: 0, duration: 15, x: 10, size: 40, icon: '₿', color: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' },
    { delay: 3, duration: 18, x: 85, size: 35, icon: 'Ξ', color: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' },
    { delay: 6, duration: 20, x: 25, size: 30, icon: '◎', color: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white' },
    { delay: 9, duration: 16, x: 75, size: 38, icon: '₿', color: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' },
    { delay: 12, duration: 22, x: 50, size: 32, icon: 'Ξ', color: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' },
    { delay: 4, duration: 19, x: 92, size: 28, icon: '◎', color: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white' },
    { delay: 8, duration: 17, x: 5, size: 36, icon: '₿', color: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' },
  ]

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Animated Background */}
      <ParticleBackground />
      
      {/* Floating Crypto Coins */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {floatingCoins.map((coin, idx) => (
          <FloatingCoin key={idx} {...coin} />
        ))}
      </div>

      {/* Header with About Us */}
      <header className="absolute top-0 right-0 p-6 z-20">
        <Link 
          href="/about" 
          className="px-4 py-2 rounded-lg border border-white/20 hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10 transition-all duration-200 text-gray-300 hover:text-white backdrop-blur-sm"
        >
          About Us
        </Link>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-10 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-cyber-cyan/30 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyber-neon-green/20 rounded-full blur-[120px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-orange/10 rounded-full blur-[150px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />

        <motion.div 
          style={{ y, opacity }}
          className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10"
        >
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full mb-6"
            >
              <motion.div 
                className="w-2 h-2 rounded-full bg-cyber-neon-green"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-cyber-cyan text-sm font-medium">Learn Crypto Risk-Free</span>
            </motion.div>

            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-cyber-cyan to-cyber-neon-green rounded-2xl flex items-center justify-center shadow-green-glow"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <span className="text-4xl font-bold text-cyber-dark">$</span>
              </motion.div>
              <h1 className="text-5xl lg:text-6xl font-bold gradient-text">CoinCoach</h1>
            </div>
            
            <motion.p 
              className="text-2xl lg:text-3xl text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Gamified Crypto Education
            </motion.p>
            
            <motion.p 
              className="text-lg text-gray-400 max-w-xl mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Master cryptocurrency trading through interactive simulations, risk assessment tools, and gamified learning experiences.
              Build your Safety Score and become a confident crypto investor.
            </motion.p>
            
            <motion.div 
              className="flex items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/auth" className="btn-primary inline-flex items-center gap-2 group">
                Get Started
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Link>
              <Link href="/about" className="btn-secondary inline-flex items-center gap-2">
                Learn More
              </Link>
            </motion.div>

            {/* Journey Steps */}
            <motion.div 
              className="mt-8 pt-8 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30">
                  <span className="text-cyber-cyan text-sm">Learn</span>
                </div>
                <motion.div 
                  className="w-8 h-px bg-gradient-to-r from-cyber-cyan to-cyber-neon-green"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-neon-green/10 border border-cyber-neon-green/30">
                  <span className="text-cyber-neon-green text-sm">Practice</span>
                </div>
                <motion.div 
                  className="w-8 h-px bg-gradient-to-r from-cyber-neon-green to-cyber-orange"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-orange/10 border border-cyber-orange/30">
                  <span className="text-cyber-orange text-sm">Master</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-3 text-center lg:text-left">No real money. No risk. Just knowledge.</p>
            </motion.div>
          </motion.div>

          {/* Right: Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1.5 h-1.5 bg-cyber-cyan rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Why This Matters - Stats Section */}
      <section className="px-6 py-20 relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,107,53,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                className="h-px flex-1 bg-gradient-to-r from-transparent to-red-500/50"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />
              <span className="text-red-400 text-sm font-mono uppercase tracking-widest">The Reality</span>
              <motion.div 
                className="h-px flex-1 bg-gradient-to-l from-transparent to-red-500/50"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-center">
              <span className="text-white">Crypto is </span>
              <span className="text-red-400">risky</span>
              <span className="text-white">. Be </span>
              <span className="text-cyber-neon-green">ready</span>
              <span className="text-white">.</span>
            </h2>
          </motion.div>

          {/* Stats in a more unique layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main big stat */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 relative group"
            >
              <div className="glass-card p-8 border border-red-500/20 relative overflow-hidden">
                {/* Animated corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/20 to-transparent" />
                <motion.div 
                  className="absolute top-4 right-4 w-3 h-3 rounded-full bg-red-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm font-mono mb-2">// 2024 US LOSSES</p>
                    <motion.p 
                      className="text-6xl lg:text-7xl font-bold text-red-400 mb-4"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      $9.3B
                    </motion.p>
                    <p className="text-xl text-white mb-2">Lost to crypto scams</p>
                    <p className="text-gray-500">That's $25 million every single day vanishing into scammers' wallets.</p>
                  </div>
                  <div className="hidden md:block">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <DollarSign className="w-20 h-20 text-red-500/30" />
                    </motion.div>
                  </div>
                </div>

                {/* Mini bar chart visualization */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-end gap-2 h-16">
                    {[40, 55, 45, 70, 60, 85, 75, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-red-500/50 to-red-400/80 rounded-t"
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Scam losses trending upward year over year</p>
                </div>
              </div>
            </motion.div>

            {/* Side stats */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card p-6 border border-cyber-orange/20"
              >
                <p className="text-gray-400 text-xs font-mono mb-1">// GLOBAL IMPACT</p>
                <p className="text-4xl font-bold text-cyber-orange mb-1">$1T+</p>
                <p className="text-white text-sm">Stolen worldwide</p>
                <div className="mt-3 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-1 flex-1 rounded-full bg-cyber-orange"
                      initial={{ opacity: 0.2 }}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="glass-card p-6 border border-cyber-cyan/20"
              >
                <p className="text-gray-400 text-xs font-mono mb-1">// AT RISK</p>
                <p className="text-4xl font-bold text-cyber-cyan mb-1">50M+</p>
                <p className="text-white text-sm">US crypto users</p>
                <p className="text-gray-500 text-xs mt-2">Most jumping in without proper education</p>
              </motion.div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-600 text-xs text-center mt-8 font-mono"
          >
            Data: Elliptic & Global Anti Scam Alliance 2024
          </motion.p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent" />
      </div>

      {/* Features Section */}
      <section className="px-6 py-20 relative">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                className="h-px flex-1 bg-gradient-to-r from-transparent to-cyber-neon-green/50"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />
              <span className="text-cyber-neon-green text-sm font-mono uppercase tracking-widest">Your Toolkit</span>
              <motion.div 
                className="h-px flex-1 bg-gradient-to-l from-transparent to-cyber-neon-green/50"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-center text-white">
              Everything you need to trade <span className="text-cyber-neon-green">smarter</span>
            </h2>
          </motion.div>

          {/* Features in unique card layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Feature 1 - Simulator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="glass-card p-6 h-full border border-cyber-cyan/20 overflow-hidden">
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyber-cyan/20 to-cyber-cyan/5 flex items-center justify-center border border-cyber-cyan/20">
                    <Gamepad2 className="w-8 h-8 text-cyber-cyan" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 relative">Trading Simulator</h3>
                <p className="text-gray-400 relative mb-4">Practice with fake money, real market data. Make mistakes here, not with your savings.</p>
                
                {/* Mini preview */}
                <div className="relative mt-4 p-3 rounded-lg bg-cyber-dark/50 border border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">BTC/USD</span>
                    <span className="text-cyber-neon-green">+2.4%</span>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {[20, 35, 25, 45, 40, 55, 50].map((h, i) => (
                      <div key={i} className="flex-1 bg-cyber-cyan/30 rounded-sm" style={{ height: h }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 - Safety Score */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="glass-card p-6 h-full border border-cyber-neon-green/20 overflow-hidden">
                
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyber-neon-green/20 to-cyber-neon-green/5 flex items-center justify-center border border-cyber-neon-green/20">
                    <Shield className="w-8 h-8 text-cyber-neon-green" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 relative">Safety Score</h3>
                <p className="text-gray-400 relative mb-4">Level up your knowledge. Track your progress with a score that actually means something.</p>
                
                {/* Score preview */}
                <div className="relative mt-4 p-3 rounded-lg bg-cyber-dark/50 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Your Score</span>
                    <motion.span 
                      className="text-lg font-bold text-cyber-neon-green"
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      847
                    </motion.span>
                  </div>
                  <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-cyber-neon-green to-cyber-cyan rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '78%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 3 - Risk Lab */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-card p-6 h-full border border-cyber-orange/20 overflow-hidden">
                
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyber-orange/20 to-cyber-orange/5 flex items-center justify-center border border-cyber-orange/20">
                    <TrendingUp className="w-8 h-8 text-cyber-orange" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 relative">Risk Lab</h3>
                <p className="text-gray-400 relative mb-4">Understand volatility before it wrecks your portfolio. Analyze any coin's risk profile.</p>
                
                {/* Risk meter preview */}
                <div className="relative mt-4 p-3 rounded-lg bg-cyber-dark/50 border border-white/5">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                  <div className="h-3 bg-gradient-to-r from-cyber-neon-green via-cyber-orange to-red-500 rounded-full relative">
                    <motion.div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-cyber-dark"
                      animate={{ left: ['20%', '70%', '45%'] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-16"
          >
            <Link href="/auth" className="btn-primary inline-flex items-center gap-3 text-lg px-8 py-4 group">
              Start Your Journey
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
            <p className="text-gray-500 text-sm mt-4">Free forever. No credit card needed.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyber-cyan to-cyber-neon-green rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-cyber-dark">$</span>
            </div>
            <span className="text-white font-semibold">CoinCoach</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 CoinCoach. Learn smart, trade smarter.</p>
        </div>
      </footer>
    </div>
  )
}
