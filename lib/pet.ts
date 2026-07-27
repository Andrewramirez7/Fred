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

export const DEFAULT_NAME = "Kuro";

export function freshState(name: string = DEFAULT_NAME): PetState {
  return {
    name,
    stats: { hunger: 8, happiness: 8, energy: 8 },
    lastUpdated: Date.now(),
    messages: [
      {
        role: "pet",
        text: `*appears in a puff of smoke and bows* hai, Sensei! i am ${name}, your loyal ninja. i await your training!`,
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
      return "🥷🍙";
    case "sleepy":
      return "🥷💤";
    case "grumpy":
      return "🥷💢";
    case "ecstatic":
      return "🥷✨";
    default:
      return "🥷";
  }
}
