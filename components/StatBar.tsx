"use client";

export default function StatBar({
  label,
  value,
  accent,
  mist,
}: {
  label: string;
  value: number;
  accent: string;
  mist: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / 10) * 100));
  const fillColor = pct < 30 ? "#ef4444" : pct < 60 ? "#facc15" : accent;

  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] mb-0.5" style={{ color: mist }}>
        <span>{label}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2 w-full rounded-sm bg-black/30 border border-black/40 overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: fillColor }}
        />
      </div>
    </div>
  );
}
