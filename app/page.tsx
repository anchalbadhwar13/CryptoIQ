'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Gamepad2, Shield, TrendingUp, Award, AlertTriangle, Users, DollarSign, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with About Us */}
      <header className="absolute top-0 right-0 p-6 z-10">
        <Link 
          href="/about" 
          className="px-4 py-2 rounded-lg border border-white/20 hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10 transition-all duration-200 text-gray-300 hover:text-white"
        >
          About Us
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex items-center justify-center px-6 pt-20 pb-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-cyan to-cyber-neon-green rounded-2xl flex items-center justify-center shadow-green-glow">
                <span className="text-4xl font-bold text-cyber-dark">$</span>
              </div>
              <h1 className="text-6xl font-bold gradient-text">CoinCoach</h1>
            </div>
            <p className="text-2xl text-gray-300 mb-4">Gamified Crypto Education Platform</p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Master cryptocurrency trading through interactive simulations, risk assessment tools, and gamified learning experiences.
              Build your Safety Score and become a confident crypto investor.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/auth" className="btn-primary inline-flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why This Matters - Stats Section */}
      <section className="px-6 py-16 relative">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 via-cyber-orange/5 to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-medium">The Problem Is Real</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Why Crypto Education Matters</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Millions are losing money to scams every year. Knowledge is your best protection.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: DollarSign,
                stat: '$9.3B',
                label: 'Lost to Crypto Scams',
                sublabel: 'In the US alone (2024)',
                color: 'text-red-400',
                bgColor: 'bg-red-500/20',
                borderColor: 'border-red-500/30',
              },
              {
                icon: AlertTriangle,
                stat: '$1T',
                label: 'Global Scam Losses',
                sublabel: 'Stolen worldwide in 2024',
                color: 'text-cyber-orange',
                bgColor: 'bg-cyber-orange/20',
                borderColor: 'border-cyber-orange/30',
              },
              {
                icon: Users,
                stat: '50M+',
                label: 'US Crypto Users',
                sublabel: 'Most are beginners at risk',
                color: 'text-cyber-cyan',
                bgColor: 'bg-cyber-cyan/20',
                borderColor: 'border-cyber-cyan/30',
              },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                  className={`glass-card p-6 border ${item.borderColor} text-center`}
                >
                  <div className={`w-14 h-14 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <p className={`text-5xl font-bold ${item.color} mb-2`}>{item.stat}</p>
                  <p className="text-white font-semibold">{item.label}</p>
                  <p className="text-gray-400 text-sm mt-1">{item.sublabel}</p>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-500 text-xs text-center mt-6"
          >
            Source: Elliptic & Global Anti Scam Alliance Reports 2024
          </motion.p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent" />
      </div>

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-neon-green/10 border border-cyber-neon-green/30 rounded-full mb-4">
              <Zap className="w-4 h-4 text-cyber-neon-green" />
              <span className="text-cyber-neon-green text-sm font-medium">The Solution</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Learn Before You Invest</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Our platform gives you the tools to practice, learn, and build confidence—risk-free.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Gamepad2,
                title: 'Interactive Simulator',
                description: 'Practice trading in a risk-free environment with real-time market scenarios',
                color: 'from-cyber-cyan to-cyber-cyan',
                borderColor: 'hover:border-cyber-cyan/40',
              },
              {
                icon: Shield,
                title: 'Safety Score',
                description: 'Track your learning progress and build confidence with our unique Safety Score system',
                color: 'from-cyber-neon-green to-cyber-neon-green',
                borderColor: 'hover:border-cyber-neon-green/40',
              },
              {
                icon: TrendingUp,
                title: 'Risk Lab',
                description: 'Analyze cryptocurrency risk factors with advanced volatility tracking and assessments',
                color: 'from-cyber-orange to-cyber-orange',
                borderColor: 'hover:border-cyber-orange/40',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + idx * 0.1 }}
                  className={`glass-card glass-card-hover p-6 border border-white/10 ${feature.borderColor} transition-all duration-300`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7 text-cyber-dark" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center mt-12"
          >
            <Link href="/auth" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              Start Learning Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-6 text-center text-gray-400 text-sm mt-auto">
        <p>© 2024 CoinCoach. Learn, Practice, Master Cryptocurrency Trading.</p>
      </footer>
    </div>
  )
}
