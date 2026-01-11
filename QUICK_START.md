# Quick Start - Configure Gemini API & Generate Tutorial Content

## 🚀 Fast Setup (3 Steps)

### Step 1: Get Your Gemini API Key

1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with Google
3. Click **"Create API Key"**
4. Copy the key (starts with `AIzaSy...`)

### Step 2: Configure API Key

**Option A - Interactive Setup (Easiest):**
```bash
npm run setup:api-key
```
Then paste your API key when prompted.

**Option B - Manual Setup:**
Create `.env.local` file in the project root:
```
GEMINI_API_KEY=paste_your_api_key_here
```

### Step 3: Generate All Tutorial Content

```bash
npm run generate:lessons
```

This generates content for all 3 modules:
- ✅ Lesson 1: What is a Wallet?
- ✅ Lesson 2: Market Cap vs. Price  
- ✅ Lesson 3: Candlestick Charts

## ✅ Verify It Works

1. Start dev server: `npm run dev`
2. Go to: `http://localhost:3000/dashboard`
3. Click any lesson card
4. Content should load automatically from Gemini API!

## 📝 What Gets Generated?

Each lesson includes:
- 📖 Comprehensive educational content
- 📑 Structured sections (5-6 per lesson)
- 🎥 YouTube tutorial videos (2-3 per lesson)
- 💡 Key takeaway points (5 per lesson)

## ⚠️ Troubleshooting

**"API key not configured" error?**
- Make sure `.env.local` exists in project root
- Check the file contains: `GEMINI_API_KEY=your_key`
- Restart dev server after creating `.env.local`

**Content not generating?**
- Verify API key is correct (check for typos)
- Check internet connection
- Verify you have API quota on Google AI Studio

---

**That's it!** Your tutorial system is now powered by Gemini AI 🎉
