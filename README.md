# Ask Sela

**Honest advice before you commit.**

## Setup

1. Clone this repo
2. Run `npm install`
3. Create a `.env` file in the root:
   ```
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   ```
4. Run `npm run dev` to test locally

## Deploy to Vercel

1. Push this repo to GitHub
2. Connect to Vercel
3. In Vercel project settings → Environment Variables, add:
   - Key: `VITE_ANTHROPIC_API_KEY`
   - Value: your Anthropic API key
4. Deploy

## Stack

- React 18 + Vite
- React Router for navigation
- Anthropic Claude API (direct browser calls)
- No backend required
