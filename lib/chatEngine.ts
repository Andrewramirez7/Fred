import { mood, type Stats } from "./pet";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

type Category = { patterns: RegExp[]; replies: string[] };

const categories: Category[] = [
  {
    patterns: [/\b(hi|hello|hey|yo|sup)\b/],
    replies: [
      "*emerges from the shadows* Sensei! you have returned.",
      "hai! this ninja was awaiting your arrival.",
      "*drops from the ceiling silently* ...oh, hello! i was practicing.",
    ],
  },
  {
    patterns: [/how are you|how('?s| is) it going|you (ok|okay|good|alright)/],
    replies: [
      "my spirit is strong, Sensei. though truthfully, i am feeling {mood}.",
      "{mood}, if i am honest. a ninja does not hide their feelings from their Sensei.",
      "*bows* well enough! though, {mood}, if you must know. and you, Sensei?",
    ],
  },
  {
    patterns: [/love you|good (boy|girl|pet|ninja)|you'?re (cute|adorable|the best|amazing)/],
    replies: [
      "*face turns red beneath the mask* ...a ninja does not blush. i am not blushing, Sensei.",
      "your words strike deeper than any blade. thank you, Sensei!",
      "i would walk through fire for you, Sensei. this is not an exaggeration.",
    ],
  },
  {
    patterns: [/\b(stupid|dumb|shut up|hate you|bad (pet|chip|ninja))\b/],
    replies: [
      "...*lowers head* even the strongest ninja feels the sting of harsh words, Sensei.",
      "that wounds my honor more than any blade could. was that necessary?",
      "*retreats into the shadows quietly*",
    ],
  },
  {
    patterns: [/hungry|food|eat|snack|treat/],
    replies: [
      "an onigiri would restore my strength greatly, Sensei... *stomach growls*",
      "a ninja cannot train on an empty stomach! feed me, please?",
      "yes, rice balls, always. hit the feed button, Sensei!",
    ],
  },
  {
    patterns: [/play|game|bored|fun|train/],
    replies: [
      "training?! *unsheathes an imaginary sword* i am ready, Sensei!",
      "hai! let us sharpen our skills. hit the train button!",
      "a true ninja never tires of training. well... rarely.",
    ],
  },
  {
    patterns: [/tired|sleep|nap|rest|meditat/],
    replies: [
      "*sits cross-legged* ...meditation would restore my chakra, Sensei.",
      "even shadows must rest. the meditate button, if you please?",
      "*yawns behind the mask* a moment of stillness would serve me well.",
    ],
  },
  {
    patterns: [/who are you|what are you|your name/],
    replies: [
      "i am {name}, a ninja sworn to your service, Sensei!",
      "{name} is my name. i answer to no other, save you.",
    ],
  },
  {
    patterns: [/\bthank(s| you)\b/],
    replies: ["it is my honor to serve, Sensei.", "*bows deeply* always, Sensei."],
  },
  {
    patterns: [/\b(bye|goodnight|good night|see you|gtg|got to go)\b/],
    replies: [
      "*vanishes in a puff of smoke* ...until we meet again, Sensei.",
      "i will stand watch until your return. farewell, Sensei.",
      "rest well, Sensei. i will guard the dojo in your absence.",
    ],
  },
  {
    patterns: [/haha|lol|lmao|hehe/],
    replies: ["*chuckles quietly, as a ninja does* tell me more, Sensei.", "hah! your spirit lifts mine as well."],
  },
  {
    patterns: [/sad|down|crying|upset/],
    replies: [
      "*kneels beside you* even in the deepest shadow, i remain at your side, Sensei.",
      "your burden is my burden. i am here, Sensei.",
    ],
  },
];

const stopwords = new Set([
  "the", "a", "an", "is", "are", "was", "were", "and", "but", "for", "with",
  "you", "your", "i", "im", "i'm", "me", "my", "to", "of", "it", "that",
  "this", "what", "why", "how", "do", "did", "does", "can", "will", "so",
]);

function curiousEcho(text: string, name: string): string {
  const words = text
    .replace(/[^a-z0-9' ]/gi, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopwords.has(w.toLowerCase()));
  const topic = words.length ? pick(words) : null;

  if (topic) {
    return pick([
      `hmm, "${topic}"? this humble ninja has not trained in that art. teach me, Sensei?`,
      `${topic}... i sense i must learn more of this. tell me, Sensei.`,
      `a ninja's training never ends. what is "${topic}", Sensei?`,
    ]);
  }
  return pick([
    `*tilts head beneath the mask* speak on, Sensei.`,
    `i am listening closely, Sensei. go on.`,
    `hmm, intriguing. continue, Sensei.`,
  ]);
}

function fillTemplate(reply: string, name: string, currentMood: string): string {
  return reply.replace(/\{name\}/g, name).replace(/\{mood\}/g, currentMood);
}

export function generateReply(userText: string, name: string, stats: Stats): string {
  const text = userText.toLowerCase();
  const currentMood = mood(stats);

  for (const cat of categories) {
    if (cat.patterns.some((p) => p.test(text))) {
      return fillTemplate(pick(cat.replies), name, currentMood);
    }
  }

  return fillTemplate(curiousEcho(text, name), name, currentMood);
}
