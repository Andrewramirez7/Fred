"use client";

import { useEffect, useRef, useState } from "react";
import PetAvatar from "@/components/PetAvatar";
import StatBar from "@/components/StatBar";
import ChatPanel from "@/components/ChatPanel";
import { generateReply } from "@/lib/chatEngine";
import {
  applyDecay,
  feed,
  play,
  rest,
  freshState,
  STORAGE_KEY,
  type PetState,
} from "@/lib/pet";

export default function Home() {
  const [state, setState] = useState<PetState | null>(null);
  const [pending, setPending] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const stateRef = useRef<PetState | null>(null);

  // Load from localStorage on mount, or ask for a name if this is a fresh pet.
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setState(applyDecay(JSON.parse(raw)));
        return;
      } catch {
        // fall through to fresh state
      }
    }
    setState(null);
  }, []);

  // Persist on every change.
  useEffect(() => {
    stateRef.current = state;
    if (state) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Decay stats once a minute while the tab is open.
  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => (s ? applyDecay(s) : s));
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  function hatch() {
    const name = nameDraft.trim() || "Chip";
    setState(freshState(name));
  }

  async function handleSend(text: string) {
    if (!state) return;
    const withUser: PetState = {
      ...state,
      messages: [...state.messages, { role: "user", text }],
    };
    setState(withUser);
    setPending(true);

    // Small delay so the reply feels like a real back-and-forth instead of instant.
    const replyText = generateReply(text, withUser.name, withUser.stats);
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 500));

    setState((s) =>
      s ? { ...s, messages: [...s.messages, { role: "pet", text: replyText }] } : s
    );
    setPending(false);
  }

  if (state === null) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-shell rounded-3xl border-4 border-black/40 shadow-2xl p-6 w-full max-w-sm text-center space-y-4">
          <div className="text-4xl">🥚</div>
          <h1 className="text-screendark text-sm">an egg is about to hatch!</h1>
          <p className="text-screendark/70 text-xs">name your new tamagotchi:</p>
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && hatch()}
            placeholder="Chip"
            maxLength={16}
            className="w-full text-center text-xs px-2 py-2 rounded-sm border border-black/30 bg-white/90 text-screendark outline-none"
          />
          <button
            onClick={hatch}
            className="w-full text-xs px-3 py-2 rounded-sm bg-screendark text-white"
          >
            hatch!
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-shell rounded-3xl border-4 border-black/40 shadow-2xl p-4 w-full max-w-sm">
        <div className="bg-screen rounded-2xl border-4 border-black/30 p-3 space-y-3">
          <PetAvatar name={state.name} stats={state.stats} />

          <div className="space-y-1.5">
            <StatBar label="hunger" value={state.stats.hunger} />
            <StatBar label="happiness" value={state.stats.happiness} />
            <StatBar label="energy" value={state.stats.energy} />
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setState((s) => (s ? feed(s) : s))}
              className="text-[10px] py-1.5 rounded-sm bg-white/80 text-screendark active:scale-95"
            >
              🍖 feed
            </button>
            <button
              onClick={() => setState((s) => (s ? play(s) : s))}
              className="text-[10px] py-1.5 rounded-sm bg-white/80 text-screendark active:scale-95"
            >
              🎾 play
            </button>
            <button
              onClick={() => setState((s) => (s ? rest(s) : s))}
              className="text-[10px] py-1.5 rounded-sm bg-white/80 text-screendark active:scale-95"
            >
              💤 rest
            </button>
          </div>

          <div className="h-64">
            <ChatPanel
              name={state.name}
              messages={state.messages}
              onSend={handleSend}
              disabled={pending}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
