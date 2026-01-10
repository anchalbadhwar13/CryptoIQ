'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Gamepad2, Shield, TrendingUp, Award } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
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
              <Link href="/dashboard" className="btn-secondary">
                Explore Dashboard
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 mt-20"
          >
            {[
              {
                icon: Gamepad2,
                title: 'Interactive Simulator',
                description: 'Practice trading in a risk-free environment with real-time market scenarios',
                color: 'from-cyber-cyan to-cyber-cyan',
              },
              {
                icon: Shield,
                title: 'Safety Score',
                description: 'Track your learning progress and build confidence with our unique Safety Score system',
                color: 'from-cyber-neon-green to-cyber-neon-green',
              },
              {
                icon: TrendingUp,
                title: 'Risk Lab',
                description: 'Analyze cryptocurrency risk factors with advanced volatility tracking and assessments',
                color: 'from-cyber-orange to-cyber-orange',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                  className="glass-card glass-card-hover p-6"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-cyber-dark" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-6 text-center text-gray-400 text-sm">
        <p>© 2024 CoinCoach. Learn, Practice, Master Cryptocurrency Trading.</p>
      </footer>
    </div>
  )
}
