# Fred — a chattable ninja tamagotchi

A tiny ninja pet that lives in your browser, has its own personality, and
talks back. Summon it, name it, feed it, train it, and chat with it — its
mood shifts based on how well you take care of it.

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
4. Open the link you get — summon your ninja, give it a name, and start chatting.

## How it works

- `lib/pet.ts` — the pet's stats (hunger/spirit/chakra), how they decay
  over time, mood calculation, and its mood emoji.
- `lib/chatEngine.ts` — the pet's entire personality. It matches your
  message against topic patterns (greetings, food, training, compliments,
  sadness, etc.) and picks a personality-flavored reply, sprinkled with
  its current mood. Anything it doesn't recognize gets a curious
  "teach me, Sensei" style response instead of a canned "I don't understand."
- `app/page.tsx` — the tamagotchi shell UI: avatar, stat bars, action
  buttons (feed/train/meditate), and the chat panel. State is saved to
  `localStorage` so your ninja remembers you between visits on the same
  browser.
- `tailwind.config.ts` — the black-and-neon-green color palette
  (`shell`, `screen`, `screendark`, `ninja`, `mist`).

## Customizing

- **Personality/speech**: edit `lib/chatEngine.ts` — add new topics or
  change the tone of existing replies.
- **Mood logic/emoji**: edit `mood()` and `moodEmoji()` in `lib/pet.ts`.
- **Look/theme**: edit the `colors` block in `tailwind.config.ts` to
  change the color scheme (e.g. back to a lighter theme, or a different
  accent color), or swap the 🥷 emoji throughout for a different look.
- **Default name**: change `DEFAULT_NAME` in `lib/pet.ts`.
