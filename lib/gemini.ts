const GEMINI_API_KEY = 'AIzaSyCTC4pu05FvfypR8MUdzfof08Aip63z0i0'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface QuizSession {
  id: string
  questions: QuizQuestion[]
  userAnswers: (number | null)[]
  score: number
  passed: boolean
  completed: boolean
}

export async function generateQuizQuestions(): Promise<QuizQuestion[]> {
  const prompt = `Generate 10 multiple choice quiz questions about cryptocurrency and blockchain safety. Each question should test understanding of crypto wallets, market analysis, and risk management.

Return ONLY a valid JSON array with this exact structure (no markdown, no extra text):
[
  {
    "id": "q1",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct"
  }
]

Make questions progressively harder. Ensure questions cover: wallets (q1-q3), market analysis (q4-q7), risk management (q8-q10).`

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API error:', errorData)
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!content) {
      throw new Error('No content in Gemini response')
    }

    // Clean the response - remove markdown code blocks if present
    let cleanedContent = content
    if (cleanedContent.includes('```json')) {
      cleanedContent = cleanedContent.split('```json')[1].split('```')[0]
    } else if (cleanedContent.includes('```')) {
      cleanedContent = cleanedContent.split('```')[1].split('```')[0]
    }

    const questions = JSON.parse(cleanedContent.trim())

    // Validate the response format
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array')
    }

    return questions.map((q, index) => ({
      id: q.id || `q${index + 1}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }))
  } catch (error) {
    console.error('Error generating quiz:', error)
    // Return fallback questions
    return getFallbackQuestions()
  }
}

function getFallbackQuestions(): QuizQuestion[] {
  return [
    {
      id: 'q1',
      question: 'What is a cryptocurrency wallet?',
      options: [
        'A physical wallet to store coins',
        'A digital tool to manage public and private keys',
        'A bank account for crypto',
        'An exchange platform',
      ],
      correctAnswer: 1,
      explanation:
        'A crypto wallet is a digital tool that stores your public key (for receiving) and private key (for sending).',
    },
    {
      id: 'q2',
      question: 'What does market cap represent?',
      options: [
        'The price of one token',
        'Total value = current price × circulating supply',
        'The maximum price ever reached',
        'The trading volume per day',
      ],
      correctAnswer: 1,
      explanation: 'Market cap is calculated by multiplying the current price by the total circulating supply.',
    },
    {
      id: 'q3',
      question: 'What is a private key?',
      options: [
        'A public identifier for your wallet',
        'A secret code that grants access to your funds',
        'A transaction ID',
        'A password that changes daily',
      ],
      correctAnswer: 1,
      explanation: 'A private key is a secret code that you must never share - it grants full access to your funds.',
    },
    {
      id: 'q4',
      question: 'How do candlestick charts display price movement?',
      options: [
        'Using only closing prices',
        'With open, high, low, and close prices in time intervals',
        'Using pie charts',
        'With random data points',
      ],
      correctAnswer: 1,
      explanation:
        'Candlestick charts show open, high, low, and close prices for each time period (e.g., hourly, daily).',
    },
    {
      id: 'q5',
      question: 'What is a bullish signal in trading?',
      options: [
        'Price moving downward',
        'Price moving upward, indicating buying interest',
        'High trading volume decrease',
        'Portfolio losses',
      ],
      correctAnswer: 1,
      explanation: 'A bullish signal indicates an upward price movement and buying interest in the market.',
    },
    {
      id: 'q6',
      question: 'What does volatility measure?',
      options: [
        'The total amount traded',
        'How quickly prices change up and down',
        'The oldest price history',
        'Exchange transaction fees',
      ],
      correctAnswer: 1,
      explanation: 'Volatility measures how rapidly and significantly price changes occur over time.',
    },
    {
      id: 'q7',
      question: 'How should you assess your risk tolerance?',
      options: [
        'Based on others recommendations',
        'Your financial situation, goals, and comfort with losses',
        'Only market trends',
        'Random selection',
      ],
      correctAnswer: 1,
      explanation:
        'Risk tolerance is personal and should be based on your financial situation, time horizon, and emotional comfort.',
    },
    {
      id: 'q8',
      question: 'What is diversification?',
      options: [
        'Investing all money in one asset',
        'Spreading investments across different assets to reduce risk',
        'Trading more frequently',
        'Using only cryptocurrency',
      ],
      correctAnswer: 1,
      explanation: 'Diversification reduces risk by spreading your investment across multiple different assets.',
    },
    {
      id: 'q9',
      question: 'What is FOMO in crypto trading?',
      options: [
        'Fear of Missing Out - making hasty decisions',
        'A type of technical indicator',
        'A blockchain protocol',
        'A mining strategy',
      ],
      correctAnswer: 0,
      explanation: 'FOMO is the fear of missing out, which can lead to poor investment decisions based on emotion.',
    },
    {
      id: 'q10',
      question: 'What should you do with your private keys?',
      options: [
        'Share them with trusted friends',
        'Store them in plain text on your computer',
        'Keep them secure and never share them',
        'Write them on public forums for backup',
      ],
      correctAnswer: 2,
      explanation:
        'Private keys should be kept secure and never shared. Anyone with your private key can access your funds.',
    },
  ]
}

export function calculateScore(
  questions: QuizQuestion[],
  userAnswers: (number | null)[]
): { score: number; passed: boolean } {
  let correctCount = 0

  questions.forEach((question, index) => {
    if (userAnswers[index] === question.correctAnswer) {
      correctCount++
    }
  })

  const score = Math.round((correctCount / questions.length) * 100)
  const passed = score >= 80

  return { score, passed }
}
