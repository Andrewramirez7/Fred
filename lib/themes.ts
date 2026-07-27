export type CharacterId = "ninja" | "spider";

export type CharacterTheme = {
  id: CharacterId;
  label: string;
  defaultName: string;
  actionLabels: { feed: string; play: string; rest: string };
  actionEmoji: { feed: string; play: string; rest: string };
  transformMessage: (name: string) => string;
  colors: {
    shell: string;
    shellBorder: string;
    screen: string;
    mist: string;
    accent: string;
    accentBorder: string;
  };
};

export const themes: Record<CharacterId, CharacterTheme> = {
  ninja: {
    id: "ninja",
    label: "Ninja",
    defaultName: "Kuro",
    actionLabels: { feed: "feed", play: "train", rest: "meditate" },
    actionEmoji: { feed: "🍙", play: "🥋", rest: "🧘" },
    transformMessage: (name) =>
      `*smoke fills the screen* ...the ninja returns. ${name} is ready, Sensei!`,
    colors: {
      shell: "#1c1c1c",
      shellBorder: "rgba(57, 255, 20, 0.25)",
      screen: "#0f1f13",
      mist: "#d7f5df",
      accent: "#39ff14",
      accentBorder: "rgba(57, 255, 20, 0.3)",
    },
  },
  spider: {
    id: "spider",
    label: "Spider Hero",
    defaultName: "Webster",
    actionLabels: { feed: "feed", play: "swing", rest: "rest" },
    actionEmoji: { feed: "🍕", play: "🕸️", rest: "🌙" },
    transformMessage: (name) =>
      `*a web shoots across the screen* ...thwip! ${name} the spider hero is here!`,
    colors: {
      shell: "#170f27",
      shellBorder: "rgba(255, 45, 59, 0.25)",
      screen: "#2b0a12",
      mist: "#ffe9ec",
      accent: "#ff2d3b",
      accentBorder: "rgba(43, 107, 255, 0.4)",
    },
  },
};

export const characterOrder: CharacterId[] = ["ninja", "spider"];

export function nextCharacter(current: CharacterId): CharacterId {
  const i = characterOrder.indexOf(current);
  return characterOrder[(i + 1) % characterOrder.length];
}
