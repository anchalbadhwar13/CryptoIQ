'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface ChatbotProps {
  sessionData: {
    currentPrice: number
    balance: number
    holdings: number
    trades: Array<{ type: 'buy' | 'sell'; price: number; amount: number }>
    portfolioValue: number
    roi: number
    isPlaying: boolean
  }
}

export default function TradingChatbot({ sessionData }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hey! 👋 I\'m your trading assistant. I can help you analyze your trades, provide market insights, and answer questions about crypto trading. What would you like to know?',
      timestamp: Date.now(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          sessionData,
          conversationHistory: messages,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyber-cyan to-cyber-neon-green rounded-full flex items-center justify-center shadow-lg hover:shadow-cyber-glow transition-all duration-300 z-40 hover:scale-110"
          >
            <MessageCircle className="w-7 h-7 text-cyber-dark" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 w-screen max-w-2xl h-[32rem] glass-card border border-white/10 rounded-2xl flex flex-col shadow-2xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-cyber-cyan/10 to-cyber-neon-green/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyber-neon-green rounded-full animate-pulse" />
                <h3 className="font-bold text-white">Trading Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} w-full`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg break-words ${
                          message.type === 'user'
                            ? 'bg-cyber-cyan/20 border border-cyber-cyan/40 text-white'
                            : 'bg-cyber-navy/60 border border-white/10 text-gray-100'
                        }`}
                      >
                        {message.type === 'user' ? (
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        ) : (
                          <div className="text-sm whitespace-pre-wrap break-words">
                            <ReactMarkdown
                              components={{
                                h2: ({ node, ...props }) => <h2 className="text-sm font-bold mt-2 mb-1 break-words" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xs font-bold mt-1.5 mb-0.5 break-words" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-1 break-words" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-1 pl-2 break-words" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-1 pl-2 break-words" {...props} />,
                                li: ({ node, ...props }) => <li className="mb-0.5 break-words" {...props} />,
                                code: ({ node, inline, ...props }) => 
                                  inline ? (
                                    <code className="bg-cyber-cyan/20 px-1.5 py-0.5 rounded text-xs break-words" {...props} />
                                  ) : (
                                    <code className="bg-cyber-navy/40 px-2 py-1 rounded text-xs block my-1 break-words overflow-x-auto" {...props} />
                                  ),
                                strong: ({ node, ...props }) => <strong className="font-bold text-cyber-neon-green break-words" {...props} />,
                                em: ({ node, ...props }) => <em className="italic break-words" {...props} />,
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-cyber-navy/60 border border-white/10 px-4 py-2 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-cyber-navy/60 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyber-cyan/40 transition-colors"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="bg-gradient-to-r from-cyber-cyan to-cyber-neon-green p-2 rounded-lg hover:shadow-cyber-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4 text-cyber-dark" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
