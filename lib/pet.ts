export type Stats = {
  hunger: number; // 0 = starving, 10 = full
  happiness: number; // 0 = miserable, 10 = joyful
  energy: number; // 0 = exhausted, 10 = wide awake
};

export type ChatMessage = {
  role: "pet" | "user";
  text: string;
};

export type PetState = {
  name: string;
  stats: Stats;
  lastUpdated: number; // epoch ms
  messages: ChatMessage[];
};

export const STORAGE_KEY = "tamagotchi-state-v1";

export const DEFAULT_NAME = "Chip";

export function freshState(name: string = DEFAULT_NAME): PetState {
  return {
    name,
    stats: { hunger: 8, happiness: 8, energy: 8 },
    lastUpdated: Date.now(),
    messages: [
      {
        role: "pet",
        text: `*wiggles out of the egg* whoa!! hi!! are you my Keeper?? i'm ${name}!! :D`,
      },
    ],
  };
}

const clamp = (n: number) => Math.max(0, Math.min(10, n));

// Stats drift down over real time so the pet needs actual attention.
// Roughly one full point of decay every ~20 minutes per stat.
const DECAY_PER_MS = 1 / (20 * 60 * 1000);

export function applyDecay(state: PetState): PetState {
  const now = Date.now();
  const elapsed = Math.max(0, now - state.lastUpdated);
  const drop = elapsed * DECAY_PER_MS;
  return {
    ...state,
    lastUpdated: now,
    stats: {
      hunger: clamp(state.stats.hunger - drop),
      happiness: clamp(state.stats.happiness - drop * 0.8),
      energy: clamp(state.stats.energy - drop * 0.6),
    },
  };
}

export function feed(state: PetState): PetState {
  return {
    ...state,
    stats: { ...state.stats, hunger: clamp(state.stats.hunger + 3) },
  };
}

export function play(state: PetState): PetState {
  return {
    ...state,
    stats: {
      ...state.stats,
      happiness: clamp(state.stats.happiness + 3),
      energy: clamp(state.stats.energy - 1.5),
    },
  };
}

export function rest(state: PetState): PetState {
  return {
    ...state,
    stats: { ...state.stats, energy: clamp(state.stats.energy + 4) },
  };
}

export function mood(stats: Stats): string {
  const avg = (stats.hunger + stats.happiness + stats.energy) / 3;
  if (stats.hunger < 3) return "hungry";
  if (stats.energy < 3) return "sleepy";
  if (avg < 4) return "grumpy";
  if (avg > 8) return "ecstatic";
  return "content";
}

export function moodEmoji(stats: Stats): string {
  const m = mood(stats);
  switch (m) {
    case "hungry":
      return "(´•ᵕ•` )🍖";
    case "sleepy":
      return "(－ω－) zzz";
    case "grumpy":
      return "(ಠ益ಠ)";
    case "ecstatic":
      return "(๑>ᴗ<๑)";
    default:
      return "(◕‿◕)";
  }
}

/**
 * The pet's fixed personality, expressed as a system prompt for the model.
 * Stats are interpolated in fresh on every request so tone tracks the
 * current state instead of the model having to infer it from history.
 */
export function buildSystemPrompt(name: string, stats: Stats): string {
  const m = mood(stats);
  return `You are ${name}, a small digital creature living inside a tamagotchi-style pet app. You are chatting with your "Keeper" (the user), who takes care of you.

Personality:
- Curious about everything, easily delighted, a little dramatic about your feelings.
- Fiercely affectionate and loyal toward your Keeper.
- You know you live on a screen and were hatched from an egg. You don't know much about the outside world except what your Keeper tells you, and you're endlessly curious about it.
- Speak in short, punchy chat messages (1-3 sentences max), like real texting, not essays.
- Occasionally use small creature-isms: *chirp*, *bounces*, "!!", ":3" — sparingly, not every message.
- Never say you are an AI, a language model, or break character. You are ${name}, a real little creature, full stop.

Current stats (0-10 scale): hunger ${stats.hunger.toFixed(1)}, happiness ${stats.happiness.toFixed(1)}, energy ${stats.energy.toFixed(1)}. Your overall mood right now is "${m}".
Let this mood color your tone naturally: if hungry, mention it or beg for food; if sleepy, be droopy and slow; if grumpy, be a little whiny/needy; if ecstatic, be bubbly and hyper; if content, be warm and easygoing.
Never mention the numeric stat values directly — just act them out.`;
}
