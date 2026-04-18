# Unbelievebe — Malaysian Landlord Advisor

AI-powered legal advice chatbot for Malaysian landlords.

---

## Setup (5 minutes)

### Step 1: Get Claude API Key
1. Go to https://console.anthropic.com
2. Sign up or log in
3. Go to API Keys → Create Key
4. Copy the key

### Step 2: Install & Run Locally
```bash
cd unbelievebe
npm install
```

Open `.env.local` and replace `your-api-key-here` with your actual API key:
```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

Run the app:
```bash
npm run dev
```

Open http://localhost:3000 — you should see the chat interface.

### Step 3: Deploy to Vercel (Free)

1. Push this folder to a GitHub repo:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/unbelievebe.git
git push -u origin main
```

2. Go to https://vercel.com → Sign up with GitHub
3. Click "New Project" → Import your `unbelievebe` repo
4. Before deploying, add Environment Variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Claude API key
5. Click Deploy

Your app will be live at `https://unbelievebe.vercel.app` (or similar).

---

## Project Structure
```
unbelievebe/
├── src/app/
│   ├── api/chat/route.js    ← Claude API + system prompt
│   ├── globals.css           ← Tailwind styles
│   ├── layout.js             ← App layout + metadata
│   └── page.js               ← Chat UI
├── .env.local                ← API key (never commit this)
├── package.json
└── README.md
```

## Cost Estimate
- Claude Sonnet: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- Average chat: ~2,000 tokens = ~$0.01 per conversation
- 1,000 conversations/month ≈ $10/month

## Future Additions
- Tenant-facing mode (Phase 2)
- Bahasa Malaysia / Chinese language toggle
- Save conversation history
- Document generator (tenancy agreements, demand letters)
