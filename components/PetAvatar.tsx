"use client";

import { mood, moodEmoji, type Stats } from "@/lib/pet";

export default function PetAvatar({ name, stats }: { name: string; stats: Stats }) {
  const currentMood = mood(stats);

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="text-5xl animate-bob">{moodEmoji(stats)}</div>
      <div className="text-mist text-xs">
        {name} is feeling <span className="font-bold">{currentMood}</span>
      </div>
    </div>
  );
}
