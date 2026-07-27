"use client";

import { mood, moodGlow, type Stats } from "@/lib/pet";
import type { CharacterTheme } from "@/lib/themes";
import CharacterIcon from "./CharacterIcon";

export default function PetAvatar({
  name,
  stats,
  theme,
}: {
  name: string;
  stats: Stats;
  theme: CharacterTheme;
}) {
  const currentMood = mood(stats);
  const glow = moodGlow(stats);

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div
        className="animate-bob rounded-full"
        style={{ filter: glow === "transparent" ? undefined : `drop-shadow(0 0 10px ${glow})` }}
      >
        <CharacterIcon character={theme.id} accent={theme.colors.accent} mist={theme.colors.mist} />
      </div>
      <div className="text-xs" style={{ color: theme.colors.mist }}>
        {name} is feeling <span className="font-bold">{currentMood}</span>
      </div>
    </div>
  );
}
