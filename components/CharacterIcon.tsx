"use client";

import type { CharacterId } from "@/lib/themes";

/**
 * Hand-drawn vector avatars instead of emoji. Some devices/browsers are
 * missing glyphs for newer emoji (like the ninja emoji) and render an empty
 * box instead — these SVGs always render the same everywhere.
 */
export default function CharacterIcon({
  character,
  accent,
  mist,
  size = 64,
}: {
  character: CharacterId;
  accent: string;
  mist: string;
  size?: number;
}) {
  if (character === "spider") {
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
        <circle cx="32" cy="32" r="26" fill={accent} />
        <path d="M10 20 Q32 8 54 20" stroke={mist} strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M10 44 Q32 56 54 44" stroke={mist} strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M32 6 L32 58" stroke={mist} strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M6 32 L58 32" stroke={mist} strokeWidth="1.5" fill="none" opacity="0.5" />
        <ellipse cx="21" cy="30" rx="9" ry="11" fill={mist} stroke="#111" strokeWidth="2" />
        <ellipse cx="43" cy="30" rx="9" ry="11" fill={mist} stroke="#111" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="-10 -6 84 74" width={size} height={size} aria-hidden>
      <path d="M8 30 L-6 20" stroke="#111" strokeWidth="6" strokeLinecap="round" />
      <path d="M56 30 L70 20" stroke="#111" strokeWidth="6" strokeLinecap="round" />
      <circle cx="32" cy="34" r="24" fill="#2b2b2b" />
      <rect x="6" y="26" width="52" height="14" rx="6" fill="#111" />
      <ellipse cx="23" cy="33" rx="5" ry="6" fill={accent} />
      <ellipse cx="41" cy="33" rx="5" ry="6" fill={accent} />
    </svg>
  );
}
