'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Eye, Shield, Award, Trophy, Target, TrendingUp, CheckCircle2 } from 'lucide-react'
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

const baseLessons = [
  {
    id: 1,
    title: 'What is a Wallet?',
    description: 'Learn the fundamentals of cryptocurrency wallets',
    icon: Shield,
    views: 1234,
  },
  {
    id: 2,
    title: 'Market Cap vs. Price',
    description: 'Understand the difference between market capitalization and token price',
    icon: TrendingUp,
    views: 987,
  },
  {
    id: 3,
    title: 'Candlestick Charts',
    description: 'Master reading candlestick patterns for trading',
    icon: Target,
    views: 654,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'learn' | 'profile'>('learn')
  const [lessons, setLessons] = useState<Lesson[]>([])

  // Load progress from localStorage
  useEffect(() => {
    const loadLessonProgress = () => {
      const updatedLessons: Lesson[] = baseLessons.map((baseLesson) => {
        // Get progress from localStorage
        const progressData = localStorage.getItem(`lesson-${baseLesson.id}-progress`)
        const completed = localStorage.getItem(`lesson-${baseLesson.id}-completed`) === 'true'
        
        let progress = 0
        if (progressData) {
          try {
            const parsed = JSON.parse(progressData)
            progress = parsed.progress || 0
          } catch (e) {
            progress = 0
          }
        }

        return {
          ...baseLesson,
          progress,
          completed,
        }
      })
      
      setLessons(updatedLessons)
    }

    // Load progress on mount
    loadLessonProgress()

    // Refresh progress when page becomes visible (when user returns from lesson)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadLessonProgress()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Also refresh on focus as backup
    const handleFocus = () => {
      loadLessonProgress()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

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

  // Check if all lessons are 100% complete
  const allLessonsComplete = lessons.length > 0 && lessons.every(lesson => lesson.progress === 100)

  // Calculate Safety Score based on progress and badges
  const safetyScore = Math.round(
    (lessons.reduce((acc, lesson) => acc + lesson.progress, 0) / (lessons.length * 100)) * 50 +
    (badges.filter(b => b.unlocked).length / badges.length) * 50
  )

  // Count completed lessons
  const lessonsCompleted = lessons.filter(lesson => lesson.completed).length

  // Update profile stats in localStorage whenever they change
  useEffect(() => {
    if (lessons.length > 0) {
      localStorage.setItem('safetyScore', safetyScore.toString())
      localStorage.setItem('lessonsCompleted', lessonsCompleted.toString())
    }
  }, [safetyScore, lessonsCompleted, lessons.length])

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
                  <GlassCard 
                    className="p-6 glass-card-hover cursor-pointer transition-all hover:scale-105"
                    onClick={() => router.push(`/dashboard/lesson/${lesson.id}`)}
                  >
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
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="text-sm text-cyber-cyan font-medium flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Start Learning →
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
            
            {/* Quiz Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: lessons.length * 0.1 }}
            >
              <GlassCard 
                className={`p-6 ${
                  allLessonsComplete
                    ? 'glass-card-hover cursor-pointer transition-all hover:scale-105'
                    : 'opacity-50'
                }`}
                onClick={() => allLessonsComplete && router.push('/dashboard/quiz')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    allLessonsComplete
                      ? 'bg-gradient-to-br from-cyber-neon-green to-cyber-cyan'
                      : 'bg-cyber-navy/60'
                  }`}>
                    <Award className={`w-6 h-6 ${allLessonsComplete ? 'text-cyber-dark' : 'text-gray-500'}`} />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2">Final Quiz</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Test your knowledge with an AI-generated quiz. Score 80% or higher to pass!
                </p>
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">
                    {allLessonsComplete ? (
                      <span className="text-cyber-neon-green font-medium">✓ Unlocked - Ready to take!</span>
                    ) : (
                      <span>Complete all 3 lessons to unlock (0/{lessons.length} complete)</span>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className={`text-sm font-medium flex items-center gap-2 ${
                    allLessonsComplete ? 'text-cyber-cyan' : 'text-gray-600'
                  }`}>
                    <Trophy className="w-4 h-4" />
                    Take Quiz →
                  </div>
                </div>
              </GlassCard>
            </motion.div>
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

          {/* Quiz Status */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Quiz Progress</h2>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold mb-2">Final Knowledge Assessment</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {allLessonsComplete
                      ? 'All modules completed! You can now take the final quiz.'
                      : `Complete all ${lessons.length} modules to unlock the final quiz (${lessons.filter(l => l.progress === 100).length}/${lessons.length} complete)`}
                  </p>
                  {typeof window !== 'undefined' && localStorage.getItem('quiz-completed') === 'true' && (
                    <div className="flex items-center gap-3 mt-4">
                      <CheckCircle2 className="w-5 h-5 text-cyber-neon-green" />
                      <div>
                        <p className="text-sm font-medium text-cyber-neon-green">Quiz Completed</p>
                        <p className="text-xs text-gray-400">Score: {localStorage.getItem('quiz-score')}%</p>
                      </div>
                    </div>
                  )}
                </div>
                {allLessonsComplete && (
                  <button
                    onClick={() => router.push('/dashboard/quiz')}
                    className="btn-primary"
                  >
                    Take Quiz
                  </button>
                )}
              </div>
            </GlassCard>
          </div>
        </motion.div>
      )}
    </div>
  )
}
