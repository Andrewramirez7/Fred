"use client";

export default function HpBar({ current, max }: { current: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const fillColor = pct < 20 ? "#ef4444" : pct < 50 ? "#facc15" : "#39ff14";

  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] mb-0.5 text-mist">
        <span>HP</span>
        <span>
          {Math.max(0, Math.round(current))}/{max}
        </span>
      </div>
      <div className="h-3 w-full rounded-sm bg-black/30 border border-black/40 overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: fillColor }}
        />
      </div>
    </div>
  );
}
