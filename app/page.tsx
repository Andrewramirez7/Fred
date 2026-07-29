"use client";

import { useState } from "react";
import creaturesData from "@/src/data/creatures.json";
import CreaturePanel from "@/components/CreaturePanel";

type Move = { name: string; power: number; type: string };
type Creature = {
  id: string;
  name: string;
  type: string;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: Move[];
};

const player: Creature = creaturesData.playerCreatures[0];
const wildEnemies: Creature[] = creaturesData.wildEnemyCreatures;

// This universe's elemental cycle: Fire dries out Mud, Mud erodes Rock, Rock smothers Fire.
const BEATS: Record<string, string> = { Fire: "Mud", Mud: "Rock", Rock: "Fire" };

function effectiveness(attackType: string, defendType: string) {
  if (BEATS[attackType] === defendType) return 1.5;
  if (BEATS[defendType] === attackType) return 0.75;
  return 1;
}

function rollDamage(attacker: Creature, defender: Creature, move: Move) {
  const eff = effectiveness(move.type, defender.type);
  const base = move.power * (attacker.attack / defender.defense) * eff;
  const variance = 0.85 + Math.random() * 0.3;
  return Math.max(1, Math.round(base * variance));
}

export default function Home() {
  const [playerHp, setPlayerHp] = useState(player.maxHp);
  const [enemyIndex, setEnemyIndex] = useState(0);
  const [enemyHp, setEnemyHp] = useState(wildEnemies[0].maxHp);
  const [log, setLog] = useState<string[]>([`A wild ${wildEnemies[0].name} appears!`]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<"victory" | "defeat" | null>(null);

  const enemy = wildEnemies[enemyIndex];

  function handleMove(move: Move) {
    if (busy || result) return;
    setBusy(true);

    const messages: string[] = [];
    let nextPlayerHp = playerHp;
    let nextEnemyHp = enemyHp;
    const order: ("player" | "enemy")[] =
      player.speed >= enemy.speed ? ["player", "enemy"] : ["enemy", "player"];

    for (const side of order) {
      if (side === "player") {
        if (nextEnemyHp <= 0) continue;
        const dmg = rollDamage(player, enemy, move);
        nextEnemyHp = Math.max(0, nextEnemyHp - dmg);
        messages.push(`${player.name} used ${move.name}! ${enemy.name} took ${dmg} damage.`);
      } else {
        if (nextPlayerHp <= 0) continue;
        const enemyMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
        const dmg = rollDamage(enemy, player, enemyMove);
        nextPlayerHp = Math.max(0, nextPlayerHp - dmg);
        messages.push(`${enemy.name} used ${enemyMove.name}! ${player.name} took ${dmg} damage.`);
      }
    }

    setPlayerHp(nextPlayerHp);
    setEnemyHp(nextEnemyHp);

    if (nextPlayerHp <= 0) {
      messages.push(`${player.name} fainted! You lost the battle.`);
      setResult("defeat");
    } else if (nextEnemyHp <= 0) {
      if (enemyIndex + 1 < wildEnemies.length) {
        const next = wildEnemies[enemyIndex + 1];
        messages.push(`${enemy.name} was defeated!`, `A wild ${next.name} appears!`);
        setEnemyIndex(enemyIndex + 1);
        setEnemyHp(next.maxHp);
      } else {
        messages.push(`${enemy.name} was defeated! You won the battle!`);
        setResult("victory");
      }
    }

    setLog((l) => [...l, ...messages]);
    setBusy(false);
  }

  function restart() {
    setPlayerHp(player.maxHp);
    setEnemyIndex(0);
    setEnemyHp(wildEnemies[0].maxHp);
    setLog([`A wild ${wildEnemies[0].name} appears!`]);
    setResult(null);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-shell rounded-3xl border-4 border-ninja/30 shadow-2xl shadow-ninja/10 p-4 w-full max-w-2xl space-y-4">
        <h1 className="text-center text-mist text-sm tracking-wide">⚔️ Glorpot Battle Arena</h1>

        <div className="rounded-2xl border-4 border-black/40 bg-screen p-4 grid grid-cols-2 gap-4">
          <CreaturePanel creature={player} hp={playerHp} align="left" />
          <CreaturePanel creature={enemy} hp={enemyHp} align="right" />
        </div>

        <div className="rounded-sm border border-ninja/30 bg-black/40 p-2 h-24 overflow-y-auto text-[11px] text-mist space-y-0.5">
          {log.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>

        {result ? (
          <div className="text-center space-y-2">
            <p className="text-sm text-mist">{result === "victory" ? "🏆 Victory!" : "💀 Defeat..."}</p>
            <button
              onClick={restart}
              className="text-xs px-4 py-2 rounded-sm bg-ninja text-black font-bold active:scale-95"
            >
              battle again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {player.moves.map((move) => (
              <button
                key={move.name}
                disabled={busy}
                onClick={() => handleMove(move)}
                className="flex flex-col items-center text-[11px] px-2 py-2 rounded-sm bg-black/40 border border-ninja/30 text-mist active:scale-95 disabled:opacity-40"
              >
                <span className="font-bold">{move.name}</span>
                <span className="text-mist/60">
                  {move.type} · {move.power} pwr
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
