# Fred — a chattable tamagotchi

A tiny digital pet that lives in your browser, has its own personality, and
talks back. Hatch it, name it, feed it, play with it, and chat with it —
its mood shifts based on how well you take care of it.

Built with Next.js (App Router) + Tailwind. The chat runs entirely in the
browser with a rule-based personality engine — **no API key, no account,
no signup required.**

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy on Vercel

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. Go to https://vercel.com/new and import this GitHub repository.
3. Click **Deploy** — no environment variables needed.
4. Open the link you get — hatch your pet, give it a name, and start chatting.

## How it works

- `lib/pet.ts` — the pet's stats (hunger/happiness/energy), how they decay
  over time, and mood calculation.
- `lib/chatEngine.ts` — the pet's entire personality. It matches your
  message against topic patterns (greetings, food, play, compliments,
  sadness, etc.) and picks a personality-flavored reply, sprinkled with
  its current mood. Anything it doesn't recognize gets a curious
  "tell me more" style response instead of a canned "I don't understand."
- `app/page.tsx` — the tamagotchi shell UI: avatar, stat bars, action
  buttons (feed/play/rest), and the chat panel. State is saved to
  `localStorage` so your pet remembers you between visits on the same
  browser.

## Customizing the personality

Edit `lib/chatEngine.ts` to add new topics it responds to, or change the
tone of existing replies. Edit `mood()` and `moodEmoji()` in `lib/pet.ts`
to change how its mood is calculated or displayed.
