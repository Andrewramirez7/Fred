"use client";

import { useEffect, useRef, useState } from "react";
import creaturesData from "@/src/data/creatures.json";
import CreaturePanel from "@/components/CreaturePanel";

type Move = { name: string; power: number; type: string; maxUses?: number };
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

const playerCreatures: Creature[] = creaturesData.playerCreatures;
const wildEnemies: Creature[] = creaturesData.wildEnemyCreatures;
const STARTING_CAGE_SPHERES: number = creaturesData.startingCageSpheres;

// This universe's elemental cycle: Fire dries out Mud, Mud erodes Rock, Rock smothers Fire.
// Ghost-types sit outside the cycle, but the Nosk herd makes up for it with raw power.
const BEATS: Record<string, string> = { Fire: "Mud", Mud: "Rock", Rock: "Fire" };

function hasAdvantage(attackType: string, defendType: string) {
  return BEATS[attackType] === defendType;
}

function resolveAttack(move: Move, attackerAttack: number, defenderDefense: number, defenderType: string) {
  const superEffective = hasAdvantage(move.type, defenderType);
  const base = (move.power * attackerAttack) / defenderDefense;
  const damage = Math.max(1, Math.round(superEffective ? base * 1.5 : base));
  return { damage, superEffective };
}

const SHAKE_MS = 400;

function usesKey(creatureId: string, moveName: string) {
  return `${creatureId}:${moveName}`;
}

function initialUses(creatures: Creature[]) {
  const uses: Record<string, number> = {};
  for (const creature of creatures) {
    for (const move of creature.moves) {
      if (move.maxUses !== undefined) uses[usesKey(creature.id, move.name)] = move.maxUses;
    }
  }
  return uses;
}

function initialHp(creatures: Creature[]) {
  return Object.fromEntries(creatures.map((c) => [c.id, c.maxHp]));
}

export default function Home() {
  const [hp, setHp] = useState<Record<string, number>>(() => initialHp(playerCreatures));
  const [activeIndex, setActiveIndex] = useState(0);
  const [mustSwitch, setMustSwitch] = useState(false);
  const [enemyIndex, setEnemyIndex] = useState(0);
  const [enemyHp, setEnemyHp] = useState(wildEnemies[0].maxHp);
  const [log, setLog] = useState<string[]>([`A wild ${wildEnemies[0].name} appears!`]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<"victory" | "defeat" | null>(null);
  const [playerShake, setPlayerShake] = useState(false);
  const [enemyShake, setEnemyShake] = useState(false);
  const [usesLeft, setUsesLeft] = useState<Record<string, number>>(() => initialUses(playerCreatures));
  const [cageSpheresLeft, setCageSpheresLeft] = useState(STARTING_CAGE_SPHERES);
  const [caught, setCaught] = useState<Creature[]>([]);
  const [caughtBanner, setCaughtBanner] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const roster = [...playerCreatures, ...caught];
  const active = roster[activeIndex];
  const enemy = wildEnemies[enemyIndex];

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [log]);

  function triggerShake(side: "player" | "enemy") {
    const setShake = side === "player" ? setPlayerShake : setEnemyShake;
    setShake(true);
    setTimeout(() => setShake(false), SHAKE_MS);
  }

  // Enemy automatically picks a move and counterattacks the given creature after a 1 second delay.
  function scheduleEnemyAttack(target: Creature, targetHpBefore: number) {
    setTimeout(() => {
      const enemyMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
      const { damage, superEffective } = resolveAttack(enemyMove, enemy.attack, target.defense, target.type);
      const nextHp = Math.max(0, targetHpBefore - damage);
      setHp((h) => ({ ...h, [target.id]: nextHp }));
      triggerShake("player");
      setLog((l) => [
        ...l,
        `${enemy.name} used ${enemyMove.name} for ${damage} damage!${superEffective ? " It was super effective!" : ""}`,
      ]);

      if (nextHp <= 0) {
        const anyAlive = roster.some((c) => c.id !== target.id && hp[c.id] > 0);
        if (anyAlive) {
          setLog((l) => [...l, `${target.name} fainted! Choose your next creature.`]);
          setMustSwitch(true);
        } else {
          setLog((l) => [...l, `${target.name} fainted! You lost the battle.`]);
          setResult("defeat");
        }
      }
      setBusy(false);
    }, 1000);
  }

  // Advances to the next wild encounter, or ends the battle in victory if the herd is cleared.
  function advanceEncounter(clearMessage: string) {
    if (enemyIndex + 1 < wildEnemies.length) {
      const next = wildEnemies[enemyIndex + 1];
      setLog((l) => [...l, clearMessage, `A wild ${next.name} appears!`]);
      setEnemyIndex(enemyIndex + 1);
      setEnemyHp(next.maxHp);
      setBusy(false);
    } else {
      setLog((l) => [...l, clearMessage, "You won the battle!"]);
      setResult("victory");
      setBusy(false);
    }
  }

  function handleMove(move: Move) {
    if (busy || result || mustSwitch) return;
    const key = usesKey(active.id, move.name);
    if (move.maxUses !== undefined && (usesLeft[key] ?? 0) <= 0) return;
    setBusy(true);

    if (move.maxUses !== undefined) {
      setUsesLeft((u) => ({ ...u, [key]: u[key] - 1 }));
    }

    // Player attacks immediately.
    const { damage, superEffective } = resolveAttack(move, active.attack, enemy.defense, enemy.type);
    const nextEnemyHp = Math.max(0, enemyHp - damage);
    setEnemyHp(nextEnemyHp);
    triggerShake("enemy");
    setLog((l) => [
      ...l,
      `${active.name} used ${move.name} for ${damage} damage!${superEffective ? " It was super effective!" : ""}`,
    ]);

    if (nextEnemyHp <= 0) {
      advanceEncounter(`${enemy.name} was defeated!`);
      return;
    }

    scheduleEnemyAttack(active, hp[active.id]);
  }

  function handleCatch() {
    if (busy || result || mustSwitch || cageSpheresLeft <= 0) return;
    setBusy(true);
    setCageSpheresLeft((c) => c - 1);

    const catchChance = Math.max(0.1, Math.min(0.9, 1.1 - enemyHp / enemy.maxHp));
    const didCatch = Math.random() < catchChance;

    if (didCatch) {
      const newTeammate = enemy;
      setCaught((c) => [...c, newTeammate]);
      setHp((h) => ({ ...h, [newTeammate.id]: newTeammate.maxHp }));
      setUsesLeft((u) => ({ ...u, ...initialUses([newTeammate]) }));
      setCaughtBanner(newTeammate.name);
      setTimeout(() => setCaughtBanner(null), 2500);
      setLog((l) => [...l, `You threw a CageSphere... ${enemy.name} was caught!`]);
      advanceEncounter(`${enemy.name} is safely contained.`);
      return;
    }

    setLog((l) => [...l, `You threw a CageSphere... ${enemy.name} broke free!`]);
    scheduleEnemyAttack(active, hp[active.id]);
  }

  function handleSwitch(idx: number) {
    if (idx === activeIndex || result) return;
    const target = roster[idx];
    if (hp[target.id] <= 0) return;

    if (mustSwitch) {
      setLog((l) => [...l, `${target.name}, go!`]);
      setActiveIndex(idx);
      setMustSwitch(false);
      return;
    }

    if (busy) return;
    setBusy(true);
    setLog((l) => [...l, `You withdrew ${active.name} and sent out ${target.name}!`]);
    setActiveIndex(idx);
    scheduleEnemyAttack(target, hp[target.id]);
  }

  function restart() {
    setHp(initialHp(playerCreatures));
    setActiveIndex(0);
    setMustSwitch(false);
    setEnemyIndex(0);
    setEnemyHp(wildEnemies[0].maxHp);
    setLog([`A wild ${wildEnemies[0].name} appears!`]);
    setResult(null);
    setUsesLeft(initialUses(playerCreatures));
    setCageSpheresLeft(STARTING_CAGE_SPHERES);
    setCaught([]);
    setCaughtBanner(null);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="relative bg-shell rounded-3xl border-4 border-ninja/30 shadow-2xl shadow-ninja/10 p-4 w-full max-w-2xl space-y-4">
        <h1 className="text-center text-mist text-sm tracking-wide">⚔️ Glorpot Battle Arena</h1>

        <div className="rounded-2xl border-4 border-black/40 bg-screen p-4 grid grid-cols-2 gap-4">
          <CreaturePanel creature={active} hp={hp[active.id]} align="left" shake={playerShake} />
          <CreaturePanel creature={enemy} hp={enemyHp} align="right" shake={enemyShake} />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {roster.map((creature, idx) => {
            const fainted = hp[creature.id] <= 0;
            const isActive = idx === activeIndex;
            return (
              <button
                key={creature.id}
                disabled={isActive || fainted || result !== null || (busy && !mustSwitch)}
                onClick={() => handleSwitch(idx)}
                className={`text-[10px] px-2 py-1.5 rounded-sm border active:scale-95 disabled:opacity-40 ${
                  isActive ? "border-ninja bg-ninja/10 text-ninja" : "border-ninja/30 bg-black/40 text-mist"
                } ${mustSwitch && !isActive && !fainted ? "animate-pulse" : ""}`}
              >
                {creature.name} {fainted ? "(fainted)" : `${hp[creature.id]}/${creature.maxHp}`}
              </button>
            );
          })}
        </div>

        <div>
          <div className="text-[10px] text-mist/60 mb-1">Combat Log</div>
          <div className="rounded-sm border border-ninja/30 bg-black/40 p-2 h-24 overflow-y-auto text-[11px] text-mist space-y-0.5">
            {log.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        {mustSwitch ? (
          <p className="text-center text-[11px] text-mist/60">Choose a creature above to send out!</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              {active.moves.map((move) => {
                const key = usesKey(active.id, move.name);
                const outOfUses = move.maxUses !== undefined && (usesLeft[key] ?? 0) <= 0;
                return (
                  <button
                    key={move.name}
                    disabled={busy || !!result || outOfUses}
                    onClick={() => handleMove(move)}
                    className="flex flex-col items-center text-[11px] px-2 py-2 rounded-sm bg-black/40 border border-ninja/30 text-mist active:scale-95 disabled:opacity-40"
                  >
                    <span className="font-bold">{move.name}</span>
                    <span className="text-mist/60">
                      {move.type} · {move.power} pwr
                      {move.maxUses !== undefined && ` · ${usesLeft[key] ?? 0}/${move.maxUses} left`}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleCatch}
              disabled={busy || !!result || cageSpheresLeft <= 0}
              className="w-full text-[11px] px-3 py-2 rounded-sm bg-black/40 border border-yellow-500/40 text-yellow-400 active:scale-95 disabled:opacity-40"
            >
              🔴 Throw CageSphere ({cageSpheresLeft} left)
            </button>
          </>
        )}

        {result && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 rounded-3xl bg-black/85 backdrop-blur-sm animate-overlayIn">
            <p className={`text-2xl font-bold ${result === "victory" ? "text-ninja" : "text-red-500"}`}>
              {result === "victory" ? "🏆 VICTORY!" : "💀 GAME OVER"}
            </p>
            <button
              onClick={restart}
              className="text-xs px-4 py-2 rounded-sm bg-ninja text-black font-bold active:scale-95"
            >
              battle again
            </button>
          </div>
        )}

        {caughtBanner && (
          <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center gap-2 rounded-3xl bg-black/80 backdrop-blur-sm animate-overlayIn">
            <p className="text-xl font-bold text-yellow-400 text-center px-4">
              🎉 WOW! YOU CAUGHT A {caughtBanner.toUpperCase()}!
            </p>
            <p className="text-[11px] text-mist/70">You can now switch to {caughtBanner} in your party.</p>
          </div>
        )}
      </div>
    </main>
  );
}
