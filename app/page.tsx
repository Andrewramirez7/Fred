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

function hasAdvantage(attackType: string, defendType: string) {
  return BEATS[attackType] === defendType;
}

function calcDamage(move: Move, attackerAttack: number, defenderDefense: number, defenderType: string) {
  const base = (move.power * attackerAttack) / defenderDefense;
  const damage = hasAdvantage(move.type, defenderType) ? base * 1.5 : base;
  return Math.max(1, Math.round(damage));
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

    // Player attacks immediately.
    const playerDmg = calcDamage(move, player.attack, enemy.defense, enemy.type);
    const nextEnemyHp = Math.max(0, enemyHp - playerDmg);
    setEnemyHp(nextEnemyHp);
    setLog((l) => [...l, `${player.name} used ${move.name}! ${enemy.name} took ${playerDmg} damage.`]);

    if (nextEnemyHp <= 0) {
      if (enemyIndex + 1 < wildEnemies.length) {
        const next = wildEnemies[enemyIndex + 1];
        setLog((l) => [...l, `${enemy.name} was defeated!`, `A wild ${next.name} appears!`]);
        setEnemyIndex(enemyIndex + 1);
        setEnemyHp(next.maxHp);
      } else {
        setLog((l) => [...l, `${enemy.name} was defeated! You won the battle!`]);
        setResult("victory");
      }
      setBusy(false);
      return;
    }

    // Enemy automatically picks a move and counterattacks after a 1 second delay.
    setTimeout(() => {
      const enemyMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
      const enemyDmg = calcDamage(enemyMove, enemy.attack, player.defense, player.type);
      const nextPlayerHp = Math.max(0, playerHp - enemyDmg);
      setPlayerHp(nextPlayerHp);
      setLog((l) => [...l, `${enemy.name} used ${enemyMove.name}! ${player.name} took ${enemyDmg} damage.`]);

      if (nextPlayerHp <= 0) {
        setLog((l) => [...l, `${player.name} fainted! You lost the battle.`]);
        setResult("defeat");
      }
      setBusy(false);
    }, 1000);
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
