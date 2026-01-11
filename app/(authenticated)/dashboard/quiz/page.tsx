'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, CheckCircle2, XCircle, Loader } from 'lucide-react'
import GlassCard from '@/components/GlassCard'
import { generateQuizQuestions, calculateScore, type QuizQuestion, type QuizSession } from '@/lib/gemini'

export default function QuizPage() {
  const router = useRouter()
  const [session, setSession] = useState<QuizSession | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize quiz
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setIsLoading(true)
        const questions = await generateQuizQuestions()

        const newSession: QuizSession = {
          id: `quiz-${Date.now()}`,
          questions,
          userAnswers: new Array(questions.length).fill(null),
          score: 0,
          passed: false,
          completed: false,
        }

        setSession(newSession)
        setError(null)
      } catch (err) {
        console.error('Error initializing quiz:', err)
        setError('Failed to load quiz questions. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    initializeQuiz()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-cyber-cyan" />
          <p className="text-gray-400">Loading quiz questions...</p>
        </GlassCard>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <XCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-gray-400 mb-6">{error || 'Failed to initialize quiz'}</p>
          <button onClick={() => router.back()} className="btn-primary">
            Go Back
          </button>
        </GlassCard>
      </div>
    )
  }

  const handleAnswerSelect = (optionIndex: number) => {
    const updatedAnswers = [...session.userAnswers]
    updatedAnswers[currentQuestion] = optionIndex
    setSession({ ...session, userAnswers: updatedAnswers })
  }

  const handleNext = () => {
    if (currentQuestion < session.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Submit quiz
      submitQuiz()
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitQuiz = () => {
    const { score, passed } = calculateScore(session.questions, session.userAnswers)
    const completedSession = { ...session, score, passed, completed: true }
    setSession(completedSession)
    setShowResults(true)

    // Save quiz result to localStorage
    localStorage.setItem('quiz-completed', 'true')
    localStorage.setItem('quiz-score', score.toString())
    localStorage.setItem('quiz-passed', passed.toString())
  }

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center px-6 py-12"
      >
        <GlassCard className="p-8 max-w-2xl w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            {session.passed ? (
              <CheckCircle2 className="w-20 h-20 text-cyber-neon-green mx-auto" />
            ) : (
              <XCircle className="w-20 h-20 text-red-500 mx-auto" />
            )}
          </motion.div>

          <h1 className="text-3xl font-bold gradient-text mb-4">
            {session.passed ? 'Quiz Passed!' : 'Quiz Failed'}
          </h1>

          <div className="mb-6">
            <div className="text-5xl font-bold gradient-text mb-2">{session.score}%</div>
            <p className="text-gray-400 mb-4">
              You answered {session.userAnswers.filter((a, i) => a === session.questions[i].correctAnswer).length} out of{' '}
              {session.questions.length} questions correctly.
            </p>
            {session.passed ? (
              <p className="text-cyber-neon-green font-medium">Great job! You've mastered the fundamentals.</p>
            ) : (
              <p className="text-gray-400">
                You need 80% to pass. Review the lessons and try again!
              </p>
            )}
          </div>

          {/* Show wrong answers */}
          <div className="mb-8 max-h-96 overflow-y-auto">
            {session.questions.map((question, idx) => {
              const userAnswer = session.userAnswers[idx]
              const isCorrect = userAnswer === question.correctAnswer

              if (isCorrect) return null

              return (
                <div key={idx} className="mb-4 p-4 bg-cyber-navy/60 rounded-lg text-left">
                  <p className="text-sm text-gray-400 mb-2">Question {idx + 1}</p>
                  <p className="font-medium mb-3">{question.question}</p>
                  <div className="space-y-2 text-sm">
                    <div className="text-red-500">
                      Your answer: {userAnswer !== null ? question.options[userAnswer] : 'Not answered'}
                    </div>
                    <div className="text-cyber-neon-green">Correct answer: {question.options[question.correctAnswer]}</div>
                    <div className="text-gray-400">{question.explanation}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-4">
            <button onClick={() => router.push('/dashboard')} className="btn-secondary flex-1">
              Back to Dashboard
            </button>
            {!session.passed && (
              <button onClick={() => window.location.reload()} className="btn-primary flex-1">
                Retake Quiz
              </button>
            )}
          </div>
        </GlassCard>
      </motion.div>
    )
  }

  const question = session.questions[currentQuestion]
  const selectedAnswer = session.userAnswers[currentQuestion]
  const progress = ((currentQuestion + 1) / session.questions.length) * 100

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {session.questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-cyber-navy/60 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-neon-green"
            />
          </div>
        </div>

        <GlassCard className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">{question.question}</h2>

              <div className="space-y-3 mb-8">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      selectedAnswer === idx
                        ? 'border-cyber-cyan bg-cyber-cyan/20 shadow-cyber-glow'
                        : 'border-white/10 bg-cyber-navy/60 hover:border-cyber-cyan/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedAnswer === idx
                            ? 'border-cyber-cyan bg-cyber-cyan'
                            : 'border-gray-400'
                        }`}
                      >
                        {selectedAnswer === idx && <div className="w-2 h-2 bg-cyber-dark rounded-full" />}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentQuestion === 0
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-cyber-cyan hover:bg-cyber-navy/60'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedAnswer === null
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {currentQuestion === session.questions.length - 1 ? 'Submit' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
