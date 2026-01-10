'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Building2, CreditCard, Wallet, TrendingUp, CheckCircle2 } from 'lucide-react'
import GlassCard from '@/components/GlassCard'

interface StepData {
  savingsAmount?: string
  savingsGoal?: string
  riskTolerance?: string
  bankConnected?: boolean
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<StepData>({
    bankConnected: false,
  })

  const steps = [
    {
      title: 'Welcome to CoinCoach!',
      description: 'Let\'s personalize your learning experience',
      content: (
        <div className="space-y-4">
          <p className="text-gray-400 mb-6">We'll ask you a few quick questions to tailor your educational journey.</p>
          <div className="glass-card p-4 bg-cyber-cyan/10 border-cyber-cyan/30">
            <p className="text-sm text-cyber-cyan">
              ✨ Your Safety Score starts at 0. Complete lessons and practice in our simulator to increase it!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Tell us about your savings',
      description: 'This helps us customize your learning path',
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Approximate amount in savings accounts</label>
            <select
              value={data.savingsAmount || ''}
              onChange={(e) => setData({ ...data, savingsAmount: e.target.value })}
              className="w-full bg-cyber-navy/60 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyber-cyan transition-colors"
            >
              <option value="">Select an option</option>
              <option value="0-1000">$0 - $1,000</option>
              <option value="1000-5000">$1,000 - $5,000</option>
              <option value="5000-10000">$5,000 - $10,000</option>
              <option value="10000-50000">$10,000 - $50,000</option>
              <option value="50000+">$50,000+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-3">What's your savings goal?</label>
            <div className="grid grid-cols-2 gap-3">
              {['Emergency Fund', 'Retirement', 'Investment', 'Other'].map((goal) => (
                <button
                  key={goal}
                  onClick={() => setData({ ...data, savingsGoal: goal })}
                  className={`p-4 rounded-lg border transition-all ${
                    data.savingsGoal === goal
                      ? 'border-cyber-cyan bg-cyber-cyan/20 shadow-cyber-glow'
                      : 'border-white/10 bg-cyber-navy/60 hover:border-cyber-cyan/50'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Connect your bank (Optional)',
      description: 'Securely link your account for personalized insights',
      content: (
        <div className="space-y-6">
          <GlassCard className="p-6 bg-cyber-navy/60">
            <div className="flex items-start gap-4 mb-4">
              <Building2 className="w-8 h-8 text-cyber-cyan flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Bank Connect</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Connect securely to see your savings in one place. This is a mock integration for demonstration purposes.
                </p>
                <p className="text-xs text-gray-500">
                  🔒 Your data is encrypted and secure. This feature uses sandboxed API endpoints.
                </p>
              </div>
            </div>
            {data.bankConnected ? (
              <div className="flex items-center gap-2 text-cyber-neon-green">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Bank Account Connected</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  // Mock bank connection
                  setTimeout(() => {
                    setData({ ...data, bankConnected: true })
                  }, 1500)
                }}
                className="btn-secondary w-full"
              >
                <CreditCard className="w-5 h-5 inline mr-2" />
                Connect Bank Account (Mock)
              </button>
            )}
          </GlassCard>
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="w-full text-gray-400 hover:text-cyber-cyan transition-colors text-sm"
          >
            Skip for now
          </button>
        </div>
      ),
    },
    {
      title: 'Almost done!',
      description: 'Let\'s understand your risk tolerance',
      content: (
        <div className="space-y-4">
          <label className="block text-sm font-medium mb-3">How would you describe your risk tolerance?</label>
          <div className="space-y-3">
            {[
              { value: 'conservative', label: 'Conservative', desc: 'I prefer stable, low-risk investments' },
              { value: 'moderate', label: 'Moderate', desc: 'I\'m willing to take some risks for potential gains' },
              { value: 'aggressive', label: 'Aggressive', desc: 'I\'m comfortable with high risk for higher rewards' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setData({ ...data, riskTolerance: option.value })}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  data.riskTolerance === option.value
                    ? 'border-cyber-cyan bg-cyber-cyan/20 shadow-cyber-glow'
                    : 'border-white/10 bg-cyber-navy/60 hover:border-cyber-cyan/50'
                }`}
              >
                <div className="font-bold mb-1">{option.label}</div>
                <div className="text-sm text-gray-400">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-cyber-navy/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-neon-green"
            />
          </div>
        </div>

        <GlassCard className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold gradient-text mb-2">{steps[currentStep].title}</h1>
              <p className="text-gray-400 mb-8">{steps[currentStep].description}</p>
              {steps[currentStep].content}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentStep === 0
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-cyber-cyan hover:bg-cyber-navy/60'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleNext}
              className="btn-primary flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
