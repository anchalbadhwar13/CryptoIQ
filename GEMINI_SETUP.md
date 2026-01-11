# Gemini API Setup Guide

This guide will help you configure the Gemini API key and generate all tutorial content for your three modules.

## Step 1: Get Your Gemini API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy your API key (it will look like: `AIzaSy...`)

## Step 2: Configure the API Key

You have two options:

### Option A: Use the Setup Script (Recommended)

Run this command in your terminal:
```bash
npm run setup:api-key
```

Then paste your API key when prompted.

### Option B: Manual Setup

1. Create a file named `.env.local` in the project root directory
2. Add the following line (replace `YOUR_API_KEY_HERE` with your actual API key):
   ```
   GEMINI_API_KEY=YOUR_API_KEY_HERE
   ```
3. Save the file

**Important:** The `.env.local` file is already in `.gitignore`, so your API key won't be committed to git.

## Step 3: Generate All Lesson Content

Once your API key is configured, you can pre-generate all tutorial content:

```bash
npm run generate:lessons
```

This will:
- Generate content for all 3 modules (Wallets, Market Cap, Candlestick Charts)
- Test the API connection
- Display a summary of generated content

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the dashboard: `http://localhost:3000/dashboard`

3. Click on any of the three lesson cards:
   - "What is a Wallet?"
   - "Market Cap vs. Price"
   - "Candlestick Charts"

4. The lesson detail page will automatically fetch and display content from Gemini API, including:
   - Educational text content
   - Structured sections
   - Embedded YouTube videos
   - Key takeaway points

## Troubleshooting

### Error: "Gemini API key not configured"
- Make sure you created `.env.local` file in the project root
- Check that the file contains: `GEMINI_API_KEY=your_key_here`
- Restart your development server after creating/updating `.env.local`

### Error: "Failed to generate lesson content"
- Verify your API key is correct
- Check your internet connection
- Make sure you have API quota available on Google AI Studio
- Check the browser console for detailed error messages

### API Key Not Working
- Make sure you copied the entire API key (they're usually long strings)
- Check that there are no extra spaces or line breaks in `.env.local`
- Try generating a new API key from Google AI Studio

## Notes

- Content is generated on-demand when users visit each lesson page
- YouTube video IDs are included as fallback videos if Gemini doesn't provide them
- The API calls Gemini's `gemini-pro` model for content generation
- There's a 2-second delay between generating lessons to avoid rate limiting

## Next Steps

After setting up, all three tutorial modules will automatically generate content from Gemini API when users click on them. The content includes:
- Comprehensive educational text
- Organized sections for easy reading
- Embedded YouTube tutorial videos
- Key takeaway points

Enjoy your AI-powered tutorial system! 🚀
