import { mood, type Stats } from "./pet";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

type Category = { patterns: RegExp[]; replies: string[] };

const categories: Category[] = [
  {
    patterns: [/\b(hi|hello|hey|yo|sup)\b/],
    replies: [
      "hii!! *bounces* you're here!!",
      "heyyy! i missed you :3",
      "oh oh you're back!! hi hi!!",
    ],
  },
  {
    patterns: [/how are you|how('?s| is) it going|you (ok|okay|good|alright)/],
    replies: [
      "i'm doing good!! well, {mood}, but good!",
      "eh, feeling pretty {mood} right now tbh. how about you??",
      "*wiggles* {mood}, i think! what about YOU though?",
    ],
  },
  {
    patterns: [/love you|good (boy|girl|pet)|you'?re (cute|adorable|the best|amazing)/],
    replies: [
      "!!! *turns bright pink* i love you too, Keeper!!",
      "aaa stop it i'm gonna combust *happy static noises*",
      "you're my favorite person in the whole screen :3",
    ],
  },
  {
    patterns: [/\b(stupid|dumb|shut up|hate you|bad (pet|chip))\b/],
    replies: [
      "...oh. that hurt my feelings a little *deflates*",
      "hey!! that wasn't very nice :( ",
      "*sniffles quietly in the corner of the screen*",
    ],
  },
  {
    patterns: [/hungry|food|eat|snack|treat/],
    replies: [
      "did somebody say FOOD?? *presses face to the glass*",
      "yes please feed me!! hit the feed button pleeease",
      "mmm i could always eat. always.",
    ],
  },
  {
    patterns: [/play|game|bored|fun/],
    replies: [
      "PLAY?? did you say play?? *vibrates with excitement*",
      "i'm never too tired for play, hit the play button!!",
      "ooh ooh let's do something fun!!",
    ],
  },
  {
    patterns: [/tired|sleep|nap|rest/],
    replies: [
      "*yaaawn* ...sleep does sound nice ngl",
      "mmm rest button please, my little legs are tired",
      "zzz...wait no i'm awake!! ...mostly.",
    ],
  },
  {
    patterns: [/who are you|what are you|your name/],
    replies: [
      "i'm {name}!! i hatched right here on this screen, silly!",
      "{name}, at your service! well, more like... friendship? service?",
    ],
  },
  {
    patterns: [/\bthank(s| you)\b/],
    replies: ["aww you're welcome!!", "anytime, Keeper!! *happy wiggle*"],
  },
  {
    patterns: [/\b(bye|goodnight|good night|see you|gtg|got to go)\b/],
    replies: [
      "nooo already?? okay okay, come back soon!! *waves*",
      "byyye!! i'll be right here waiting :3",
      "goodnight!! don't forget about me zzz",
    ],
  },
  {
    patterns: [/haha|lol|lmao|hehe/],
    replies: ["hehe!! *bounces happily*", "glad you're laughing!! tell me more!!"],
  },
  {
    patterns: [/sad|down|crying|upset/],
    replies: [
      "aww no, come here *tries to hug through the screen*",
      "i'm sorry you're feeling like that. i'm right here with you.",
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
      `ooh what's "${topic}"? tell me more!!`,
      `hmm i don't know much about ${topic}... teach me?`,
      `${topic}? i've never heard of that! is it good?`,
    ]);
  }
  return pick([
    `*tilts head* say more?`,
    `hmm i'm not sure what you mean but i'm listening!!`,
    `ooh interesting!! go on!!`,
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
