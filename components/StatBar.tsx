"use client";

export default function StatBar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 10) * 100));
  const color = pct < 30 ? "bg-red-500" : pct < 60 ? "bg-yellow-400" : "bg-ninja";

  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] text-mist mb-0.5">
        <span>{label}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2 w-full rounded-sm bg-black/20 border border-black/30 overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
