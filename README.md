# CoinCoach - Gamified Crypto Education Platform

A high-fidelity, gamified cryptocurrency educational platform built with Next.js, featuring interactive simulations, risk assessment tools, and a unique Safety Score system.

## 🎨 Features

- **Glassmorphism Cyber-Dark UI**: Modern dark theme with glowing cyan and neon green accents
- **Interactive Trading Simulator**: Practice trading in a risk-free environment with real-time scenarios
- **Risk Lab**: Analyze cryptocurrency risk factors with animated gauges and volatility charts
- **Market Watch**: Live market data with educational tooltips explaining Market Cap vs Price
- **Learning Hub**: Gamified lesson system with progress tracking
- **Safety Score**: Unique scoring system that increases as users complete tutorials and assessments
- **Tutorial System**: Interactive walkthrough using react-joyride
- **Onboarding Flow**: Multi-step questionnaire with Bank Connect mock feature

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
app/
  ├── (authenticated)/     # Routes that require authentication
  │   ├── dashboard/       # Learning Hub & User Profile
  │   ├── risk-lab/        # Risk assessment tool
  │   ├── market/          # Market watch with tooltips
  │   └── game/            # Trading simulator
  ├── auth/                # Login/Signup page
  ├── onboarding/          # Multi-step onboarding flow
  └── page.tsx             # Landing page

components/
  ├── Sidebar.tsx          # Navigation sidebar
  ├── Navbar.tsx           # Top navigation bar
  ├── GlassCard.tsx        # Reusable glassmorphism card
  └── AnimatedGauge.tsx    # Animated risk gauge component
```

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom cyber-dark theme
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization (charts)
- **react-joyride** - Interactive tutorial system
- **Lucide React** - Icon library

## 🎯 Key Pages

### Landing Page (`/`)
- Hero section with feature highlights
- Call-to-action buttons

### Authentication (`/auth`)
- Sleek login/signup forms with glassmorphism design

### Onboarding (`/onboarding`)
- Multi-step questionnaire about savings accounts
- Bank Connect mock integration
- Progress tracking

### Dashboard (`/dashboard`)
- **Learning Hub**: Lesson cards with progress bars
- **User Profile**: Safety Score display and badges

### Risk Lab (`/risk-lab`)
- Interactive risk score checker (8.2/10 style gauge)
- 30-day volatility sparklines
- Searchable cryptocurrency list

### Market Watch (`/market`)
- Live market data table
- Interactive tooltips explaining Market Cap vs Price
- Market Heatmap with colored cards

### Trading Simulator (`/game`)
- Real-time price chart (Recharts)
- Random scenario engine (Elon Tweets, Market Crash, etc.)
- Buy/Sell functionality with mock currency
- Session summary with ROI and patterns identified
- Tutorial overlay using react-joyride

## 🎨 Design System

### Colors
- Background: `#0B0E14` (Cyber Dark)
- Primary: `#00D9FF` (Cyan)
- Accent: `#00FF88` (Neon Green)
- Warning: `#FF6B35` (Orange)

### Components
- **GlassCard**: Backdrop blur with subtle borders and glows
- **AnimatedGauge**: Semicircular gauge with animated needle
- **Buttons**: Gradient primary buttons with hover effects

## 📝 Notes

- All data is currently mocked for demonstration purposes
- Structure is ready to integrate with real crypto APIs (CoinGecko, Binance, etc.)
- Bank Connect is a mock feature for demonstration

## 🔮 Future Enhancements

- Real-time crypto API integration
- User authentication and database
- Progress persistence
- More interactive lessons
- Advanced charting (candlestick patterns)
- Social features (leaderboards)

## 📄 License

This project is built for educational purposes.
