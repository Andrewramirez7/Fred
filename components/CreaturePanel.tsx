"use client";

import HpBar from "./HpBar";

type Creature = {
  id: string;
  name: string;
  type: string;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: { name: string; power: number; type: string }[];
};

const TYPE_EMOJI: Record<string, string> = {
  Fire: "🔥",
  Mud: "🟤",
  Rock: "🪨",
};

const TYPE_COLOR: Record<string, string> = {
  Fire: "#ff6b35",
  Mud: "#8b5e34",
  Rock: "#8d8d7a",
};

export default function CreaturePanel({
  creature,
  hp,
  align,
  shake,
}: {
  creature: Creature;
  hp: number;
  align: "left" | "right";
  shake?: boolean;
}) {
  const icon = <span className="text-3xl">{TYPE_EMOJI[creature.type] ?? "❓"}</span>;

  return (
    <div
      className={`flex flex-col gap-2 ${align === "right" ? "items-end text-right" : "items-start text-left"} ${
        shake ? "animate-shake" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {align === "left" && icon}
        <div>
          <div className="text-mist text-xs font-bold">{creature.name}</div>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-sm font-bold text-black inline-block"
            style={{ backgroundColor: TYPE_COLOR[creature.type] ?? "#999" }}
          >
            {creature.type}
          </span>
        </div>
        {align === "right" && icon}
      </div>
      <HpBar current={hp} max={creature.maxHp} />
    </div>
  );
}
