'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Eye, Shield, Award, Trophy, Target, TrendingUp } from 'lucide-react'
import GlassCard from '@/components/GlassCard'

interface Lesson {
  id: number
  title: string
  description: string
  progress: number
  icon: any
  views: number
  completed: boolean
}

interface Badge {
  id: string
  name: string
  description: string
  icon: any
  unlocked: boolean
  color: string
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'learn' | 'profile'>('learn')

  const lessons: Lesson[] = [
    {
      id: 1,
      title: 'What is a Wallet?',
      description: 'Learn the fundamentals of cryptocurrency wallets',
      progress: 75,
      icon: Shield,
      views: 1234,
      completed: false,
    },
    {
      id: 2,
      title: 'Market Cap vs. Price',
      description: 'Understand the difference between market capitalization and token price',
      progress: 50,
      icon: TrendingUp,
      views: 987,
      completed: false,
    },
    {
      id: 3,
      title: 'Candlestick Charts',
      description: 'Master reading candlestick patterns for trading',
      progress: 100,
      icon: Target,
      views: 654,
      completed: true,
    },
  ]

  const badges: Badge[] = [
    {
      id: 'first-lesson',
      name: 'First Steps',
      description: 'Completed your first lesson',
      icon: Trophy,
      unlocked: true,
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      id: 'risk-master',
      name: 'Risk Master',
      description: 'Scored 8+ in Risk Lab 5 times',
      icon: Shield,
      unlocked: false,
      color: 'from-gray-600 to-gray-800',
    },
    {
      id: 'trader',
      name: 'Trader',
      description: 'Made 10 successful trades in simulator',
      icon: Award,
      unlocked: true,
      color: 'from-cyber-cyan to-cyber-neon-green',
    },
  ]

  // Calculate Safety Score based on progress and badges
  const safetyScore = Math.round(
    (lessons.reduce((acc, lesson) => acc + lesson.progress, 0) / (lessons.length * 100)) * 50 +
    (badges.filter(b => b.unlocked).length / badges.length) * 50
  )

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('learn')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'learn'
              ? 'text-cyber-cyan border-b-2 border-cyber-cyan'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Learning Hub
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'profile'
              ? 'text-cyber-cyan border-b-2 border-cyber-cyan'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          User Profile
        </button>
      </div>

      {/* Learning Hub */}
      {activeTab === 'learn' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6">Learning Hub</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, idx) => {
              const Icon = lesson.icon
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <GlassCard className="p-6 glass-card-hover cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        lesson.completed
                          ? 'bg-gradient-to-br from-cyber-neon-green to-cyber-cyan'
                          : 'bg-cyber-navy/60'
                      }`}>
                        <Icon className={`w-6 h-6 ${lesson.completed ? 'text-cyber-dark' : 'text-cyber-cyan'}`} />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span>{lesson.views}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{lesson.id}. {lesson.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{lesson.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="font-medium">{lesson.progress}%</span>
                      </div>
                      <div className="h-2 bg-cyber-navy/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${lesson.progress}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-neon-green"
                        />
                      </div>
                    </div>
                    {lesson.completed && (
                      <div className="mt-4 flex items-center gap-2 text-cyber-neon-green text-sm font-medium">
                        <Award className="w-4 h-4" />
                        Completed
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* User Profile */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Safety Score */}
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Safety Score</h2>
                <p className="text-gray-400">Your comprehensive learning and safety rating</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold gradient-text">{safetyScore}/100</div>
                <div className="text-sm text-gray-400 mt-1">Keep learning to increase!</div>
              </div>
            </div>
            <div className="h-4 bg-cyber-navy/60 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${safetyScore}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-neon-green"
              />
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Complete lessons, practice in the simulator, and assess risks in Risk Lab to boost your Safety Score.
            </div>
          </GlassCard>

          {/* Badges */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Badges & Achievements</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {badges.map((badge, idx) => {
                const Icon = badge.icon
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                  >
                    <GlassCard className={`p-6 text-center ${
                      !badge.unlocked && 'opacity-50'
                    }`}>
                      <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center ${
                        !badge.unlocked && 'grayscale'
                      }`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="font-bold mb-1">{badge.name}</h3>
                      <p className="text-sm text-gray-400">{badge.description}</p>
                      {badge.unlocked && (
                        <div className="mt-4 text-xs text-cyber-neon-green font-medium">
                          ✓ Unlocked
                        </div>
                      )}
                    </GlassCard>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
