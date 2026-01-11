'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen, PlayCircle, CheckCircle2, Loader2 } from 'lucide-react'
import GlassCard from '@/components/GlassCard'

interface Section {
  title: string
  content: string
}

interface LessonData {
  id: number
  content: string
  sections: Section[]
  youtubeVideos: string[]
  keyPoints: string[]
  generatedAt?: string
}

interface Page {
  type: 'content' | 'video'
  title: string
  content?: string
  videoId?: string
}

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = parseInt(params.id as string)
  const [lessonData, setLessonData] = useState<LessonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pages, setPages] = useState<Page[]>([])
  const [progress, setProgress] = useState(0)

  const lessonTitles: Record<number, string> = {
    1: 'What is a Wallet?',
    2: 'Market Cap vs. Price',
    3: 'Candlestick Charts',
  }

  // Load progress from localStorage
  useEffect(() => {
    if (lessonId) {
      const savedProgress = localStorage.getItem(`lesson-${lessonId}-progress`)
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress)
        setCurrentPage(parsed.currentPage || 0)
        setProgress(parsed.progress || 0)
      }
    }
  }, [lessonId])

  // Build pages array from lesson data
  useEffect(() => {
    if (!lessonData) return

    const newPages: Page[] = []
    
    // Add introduction page
    if (lessonData.content) {
      newPages.push({
        type: 'content',
        title: 'Introduction',
        content: lessonData.content
      })
    }

    // Interleave sections and videos
    lessonData.sections?.forEach((section, idx) => {
      // Add section
      newPages.push({
        type: 'content',
        title: section.title,
        content: section.content
      })

      // Add video after section (if available)
      if (lessonData.youtubeVideos && lessonData.youtubeVideos.length > 0 && idx === 0) {
        newPages.push({
          type: 'video',
          title: 'Video Tutorial',
          videoId: lessonData.youtubeVideos[0]
        })
      }
    })

    setPages(newPages)
  }, [lessonData])

  // Update progress when page changes
  useEffect(() => {
    if (pages.length > 0) {
      const newProgress = Math.round(((currentPage + 1) / pages.length) * 100)
      setProgress(newProgress)
      
      // Save to localStorage
      localStorage.setItem(`lesson-${lessonId}-progress`, JSON.stringify({
        currentPage,
        progress: newProgress
      }))
    }
  }, [currentPage, pages.length, lessonId])

  useEffect(() => {
    const fetchLessonContent = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/lesson/${lessonId}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch lesson content')
        }
        
        setLessonData(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load lesson content')
      } finally {
        setLoading(false)
      }
    }

    if (lessonId) {
      fetchLessonContent()
    }
  }, [lessonId])

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleComplete = () => {
    // Mark lesson as completed
    localStorage.setItem(`lesson-${lessonId}-completed`, 'true')
    localStorage.setItem(`lesson-${lessonId}-progress`, JSON.stringify({
      currentPage: pages.length - 1,
      progress: 100
    }))
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyber-cyan mx-auto mb-4" />
          <p className="text-gray-400">Loading lesson content...</p>
        </div>
      </div>
    )
  }

  if (error || !lessonData || pages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <GlassCard className="p-8 max-w-2xl w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-400">Error Loading Lesson</h2>
            <p className="text-gray-400 mb-6">{error || 'Lesson not found'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </GlassCard>
      </div>
    )
  }

  const currentPageData = pages[currentPage]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 rounded-lg border border-white/10 hover:border-cyber-cyan transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold gradient-text">{lessonTitles[lessonId] || 'Lesson'}</h1>
            <p className="text-gray-400 mt-1">Page {currentPage + 1} of {pages.length}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Progress</div>
            <div className="text-2xl font-bold text-cyber-cyan">{progress}%</div>
          </div>
          <div className="w-32 h-2 bg-cyber-navy/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-neon-green"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Content Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-6 min-h-[500px]">
                {currentPageData.type === 'content' ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen className="w-6 h-6 text-cyber-cyan" />
                      <h2 className="text-2xl font-bold">{currentPageData.title}</h2>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                        {currentPageData.content}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <PlayCircle className="w-6 h-6 text-cyber-cyan" />
                      <h2 className="text-2xl font-bold">{currentPageData.title}</h2>
                    </div>
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${currentPageData.videoId}`}
                        title={currentPageData.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </>
                )}
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                currentPage === 0
                  ? 'bg-cyber-navy/30 text-gray-600 cursor-not-allowed'
                  : 'bg-cyber-navy/60 text-white hover:bg-cyber-navy/80 hover:border-cyber-cyan/50 border border-white/10'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex gap-2">
              {pages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentPage
                      ? 'bg-cyber-cyan w-8'
                      : idx < currentPage
                      ? 'bg-cyber-neon-green'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {currentPage < pages.length - 1 ? (
              <button
                onClick={handleNext}
                className="btn-primary flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="btn-primary flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Complete Lesson
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Points */}
          {lessonData.keyPoints && lessonData.keyPoints.length > 0 && (
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-cyber-neon-green" />
                <h3 className="text-lg font-bold">Key Takeaways</h3>
              </div>
              <ul className="space-y-3">
                {lessonData.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyber-cyan mt-2 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {/* Progress Card */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold mb-4">Lesson Progress</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">{progress}%</div>
                <div className="text-sm text-gray-400">
                  {currentPage + 1} of {pages.length} pages completed
                </div>
              </div>
              <div className="h-3 bg-cyber-navy/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-neon-green"
                />
              </div>
              {progress === 100 && (
                <div className="text-center pt-2">
                  <div className="text-cyber-neon-green font-medium flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Lesson Completed!
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
