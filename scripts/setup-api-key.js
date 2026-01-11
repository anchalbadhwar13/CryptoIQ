/**
 * Helper script to set up Gemini API key
 * This script helps you configure your API key interactively
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function main() {
  console.log('🔑 Gemini API Key Setup\n')
  console.log('To get your API key:')
  console.log('  1. Visit: https://makersuite.google.com/app/apikey')
  console.log('  2. Sign in with your Google account')
  console.log('  3. Click "Create API Key"')
  console.log('  4. Copy your API key\n')
  
  const apiKey = await question('Enter your Gemini API key: ')
  
  if (!apiKey || apiKey.trim().length === 0) {
    console.log('\n❌ No API key provided. Exiting...')
    rl.close()
    process.exit(1)
  }
  
  const envPath = path.join(process.cwd(), '.env.local')
  const envContent = `# Google Gemini API Key
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=${apiKey.trim()}
`
  
  try {
    fs.writeFileSync(envPath, envContent, 'utf8')
    console.log(`\n✅ API key saved to .env.local`)
    console.log('\n📝 Next steps:')
    console.log('  1. Restart your development server (Ctrl+C and run "npm run dev" again)')
    console.log('  2. Visit the dashboard and click on any lesson')
    console.log('  3. The content will be generated automatically using Gemini AI\n')
  } catch (error) {
    console.error('\n❌ Error writing .env.local file:', error.message)
    console.log('\nPlease create .env.local manually and add:')
    console.log(`GEMINI_API_KEY=${apiKey.trim()}\n`)
  }
  
  rl.close()
}

main()
