# Fred — a chattable tamagotchi

A tiny digital pet that lives in your browser, has its own personality, and
talks back. Hatch it, name it, feed it, play with it, and chat with it —
its mood shifts based on how well you take care of it.

Built with Next.js (App Router) + Tailwind, and powered by Google's
**free** Gemini API for the chat replies.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then paste your Gemini key into .env.local
npm run dev
```

Open http://localhost:3000.

## Get a free Gemini API key (no credit card needed)

1. Go to https://aistudio.google.com/apikey
2. Sign in with a Google account
3. Click "Create API key"
4. Copy the key — you'll paste it into Vercel in the next section

The free tier has rate limits (fine for a personal pet project) and never
asks for billing info.

## Deploy on Vercel

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. Go to https://vercel.com/new and import this GitHub repository.
3. Before clicking "Deploy", open **Environment Variables** and add:
   - Name: `GEMINI_API_KEY`
   - Value: (the key you copied above)
4. Click **Deploy**. Vercel will build and give you a live `https://...vercel.app` link.
5. Open the link — hatch your pet, give it a name, and start chatting.

If you add or change the env var *after* the first deploy, go to the
project's **Settings → Environment Variables**, save it, then
**Deployments → ⋯ → Redeploy** so the new value takes effect.

## How it works

- `lib/pet.ts` — the pet's stats (hunger/happiness/energy), how they decay
  over time, and its personality prompt.
- `app/api/chat/route.ts` — server route that sends the personality prompt
  + chat history to Gemini and returns the reply. The API key never reaches
  the browser.
- `app/page.tsx` — the tamagotchi shell UI: avatar, stat bars, action
  buttons (feed/play/rest), and the chat panel. State is saved to
  `localStorage` so your pet remembers you between visits on the same
  browser.

## Customizing the personality

Edit `buildSystemPrompt` in `lib/pet.ts` — that's the pet's entire
personality in one place. Change its traits, speech quirks, or backstory
and every reply will follow the new character.
