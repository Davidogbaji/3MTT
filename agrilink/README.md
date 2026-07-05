# AgriLink

AI-powered market access for smallholder farmers in Nigeria — fair price checks, direct buyer connections, and storage/loss-prevention guidance.

Built for the 3MTT Knowledge Showcase Challenge.

## What it does

- **Price Checker** — AI chat gives a fair-market price range for a crop and flags whether an offered price is fair, borderline, or underpaying the farmer
- **Marketplace** — farmers post produce listings, buyers see them directly (no middleman)
- **Storage Tips** — practical, low-cost post-harvest storage guidance to reduce spoilage

## Tech stack

- React + Vite (frontend)
- Vercel serverless function (`/api/chat.js`) — calls the Anthropic API server-side so your API key is never exposed to the browser
- Plain CSS (no framework) with a custom design system

## Run locally

```bash
npm install
npm run dev
```

The AI features need an Anthropic API key. Copy `.env.example` to `.env` and add your key:

```bash
cp .env.example .env
```

Then edit `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Note: Vite's local dev server does **not** run the `/api` serverless function automatically. To test the AI features locally, use the Vercel CLI instead of `npm run dev`:

```bash
npm install -g vercel
vercel dev
```

## Deploy to Vercel

1. **Push this project to GitHub**
   ```bash
   git init
   git add .
   git commit -m "AgriLink - 3MTT Knowledge Showcase"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/agrilink.git
   git push -u origin main
   ```

2. **Import into Vercel**
   - Go to vercel.com, sign in, click "Add New Project"
   - Import your `agrilink` GitHub repo
   - Vercel auto-detects it's a Vite project — leave build settings as default

3. **Add your API key as an environment variable**
   - In the Vercel project settings, go to "Environment Variables"
   - Add: `ANTHROPIC_API_KEY` = your key from console.anthropic.com
   - Redeploy if you added the key after the first deploy

4. **Get your public link**
   - Vercel gives you a URL like `agrilink-yourname.vercel.app`
   - That's your submission link — works for anyone, no sign-in required

## Notes for judges / submission

- Marketplace listings are stored in the browser (localStorage) for this prototype — a production version would use a shared database so listings are visible across devices
- Price guidance is general AI market knowledge, not a live pricing feed — the app is transparent about this to farmers
