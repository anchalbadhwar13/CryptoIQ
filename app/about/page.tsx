'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Target, Heart, Sparkles, Users, GraduationCap } from 'lucide-react'

const teamMembers = [
  {
    name: 'Anchal Badhwar',
    role: 'Co-Founder',
    description: 'Passionate about making crypto education accessible and safe for everyone.',
  },
  {
    name: 'Ira Batra',
    role: 'Co-Founder',
    description: 'Dedicated to protecting new investors from scams through innovative learning tools.',
  },
  {
    name: 'Grace Chhabra',
    role: 'Co-Founder',
    description: 'Focused on creating engaging, gamified experiences that make learning fun.',
  },
  {
    name: 'Zinnia Nagpal',
    role: 'Co-Founder',
    description: 'Committed to building technology that empowers users to make informed decisions.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-dark to-cyber-navy">
      {/* Header */}
      <header className="p-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold gradient-text mb-6">About CoinCoach</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We're on a mission to protect crypto beginners from scams and empower them 
            with the knowledge they need to invest safely.
          </p>
        </motion.section>

        {/* Why We Built This */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyber-cyan to-cyber-neon-green rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-cyber-dark" />
            </div>
            <h2 className="text-3xl font-bold">Why We Built This</h2>
          </div>
          
          <div className="space-y-4 text-gray-300">
            <p>
              In 2024, <span className="text-red-400 font-semibold">$9.3 billion</span> was lost to crypto scams in the US alone. 
              That's 56% of all scam losses—and most victims were beginners who simply didn't know 
              what to look out for.
            </p>
            <p>
              When Wallet Guard shut down, we saw thousands of users left without protection. 
              We knew we had to act. CoinCoach was born from a simple belief: 
              <span className="text-cyber-cyan font-semibold"> education is the best defense against scams</span>.
            </p>
            <p>
              Our platform combines interactive simulations, real-time risk analysis, and gamified 
              learning to transform how people approach cryptocurrency. We don't just tell you 
              what's risky—we help you <span className="text-cyber-neon-green font-semibold">experience it safely</span> so 
              you can recognize danger in the real world.
            </p>
          </div>
        </motion.section>

        {/* Our Mission */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: Target,
              title: 'Our Mission',
              description: 'To reduce crypto scam losses by empowering users with knowledge before they invest.',
              color: 'from-cyber-cyan to-cyber-cyan',
            },
            {
              icon: Shield,
              title: 'Our Approach',
              description: 'Learn by doing. Our simulator lets you make mistakes safely so you won\'t make them with real money.',
              color: 'from-cyber-neon-green to-cyber-neon-green',
            },
            {
              icon: Sparkles,
              title: 'Our Promise',
              description: 'Free, accessible education for everyone. No hidden fees, no upsells—just protection.',
              color: 'from-cyber-orange to-cyber-orange',
            },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-7 h-7 text-cyber-dark" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            )
          })}
        </motion.section>

        {/* The Team */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <Users className="w-8 h-8 text-cyber-cyan" />
            <h2 className="text-3xl font-bold text-center">Meet Our Team</h2>
          </div>
          
          <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
            We're a team of students and developers passionate about making the crypto space 
            safer for everyone. Our diverse backgrounds unite around one goal: protecting you.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                className="glass-card glass-card-hover p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyber-cyan/30 to-cyber-neon-green/30 rounded-full flex items-center justify-center border border-cyber-cyan/30">
                    <span className="text-2xl font-bold text-cyber-cyan">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-cyber-cyan text-sm font-medium">{member.role}</p>
                  </div>
                </div>
                <p className="text-gray-400 mt-4">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="glass-card p-8 border border-cyber-cyan/30">
            <GraduationCap className="w-12 h-12 text-cyber-cyan mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-gray-400 mb-6">
              Join thousands of users who are building their crypto knowledge safely.
            </p>
            <Link 
              href="/auth" 
              className="btn-primary inline-flex items-center gap-2"
            >
              Get Started Free
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-6 text-center text-gray-400 text-sm">
        <p>© 2024 CoinCoach. Protecting crypto beginners, one lesson at a time.</p>
      </footer>
    </div>
  )
}
