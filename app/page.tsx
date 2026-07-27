"use client";

import { useEffect, useState } from "react";
import PetAvatar from "@/components/PetAvatar";
import StatBar from "@/components/StatBar";
import ChatPanel from "@/components/ChatPanel";
import SwapIcon from "@/components/SwapIcon";
import { generateReply } from "@/lib/chatEngine";
import { applyDecay, feed, play, rest, freshState, migrateState, STORAGE_KEY, type PetState } from "@/lib/pet";
import { themes, nextCharacter } from "@/lib/themes";

export default function Home() {
  const [state, setState] = useState<PetState | null>(null);
  const [pending, setPending] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  // Load from localStorage on mount.
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setState(applyDecay(migrateState(JSON.parse(raw))));
        return;
      } catch {
        // fall through to fresh state
      }
    }
    setState(null);
  }, []);

  // Persist on every change.
  useEffect(() => {
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
    const name = nameDraft.trim() || themes.ninja.defaultName;
    setState(freshState(name));
  }

  function switchCharacter() {
    setState((s) => {
      if (!s) return s;
      const next = nextCharacter(s.characterId);
      return {
        ...s,
        characterId: next,
        messages: [...s.messages, { role: "pet", text: themes[next].transformMessage(s.name) }],
      };
    });
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
    const replyText = generateReply(text, withUser.name, withUser.stats, withUser.characterId);
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 500));

    setState((s) =>
      s ? { ...s, messages: [...s.messages, { role: "pet", text: replyText }] } : s
    );
    setPending(false);
  }

  if (state === null) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-shell rounded-3xl border-4 border-ninja/30 shadow-2xl shadow-ninja/10 p-6 w-full max-w-sm text-center space-y-4">
          <div className="text-4xl">🥷💨</div>
          <h1 className="text-mist text-sm">a shadow stirs in the dojo...</h1>
          <p className="text-mist/60 text-xs">name your new ninja:</p>
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && hatch()}
            placeholder={themes.ninja.defaultName}
            maxLength={16}
            className="w-full text-center text-xs px-2 py-2 rounded-sm border border-ninja/30 bg-black/40 text-mist placeholder:text-mist/30 outline-none"
          />
          <button
            onClick={hatch}
            className="w-full text-xs px-3 py-2 rounded-sm bg-ninja text-black font-bold active:scale-95"
          >
            summon!
          </button>
        </div>
      </main>
    );
  }

  const theme = themes[state.characterId];

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div
        className="relative rounded-3xl border-4 shadow-2xl p-4 w-full max-w-sm transition-colors duration-500"
        style={{ backgroundColor: theme.colors.shell, borderColor: theme.colors.shellBorder }}
      >
        <button
          onClick={switchCharacter}
          title={`switch to ${themes[nextCharacter(state.characterId)].label}`}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/40 border active:scale-90"
          style={{ borderColor: theme.colors.accentBorder }}
        >
          <SwapIcon color={theme.colors.accent} />
        </button>

        <div
          className="rounded-2xl border-4 border-black/40 p-3 space-y-3 transition-colors duration-500"
          style={{ backgroundColor: theme.colors.screen }}
        >
          <PetAvatar name={state.name} stats={state.stats} theme={theme} />

          <div className="space-y-1.5">
            <StatBar label="hunger" value={state.stats.hunger} accent={theme.colors.accent} mist={theme.colors.mist} />
            <StatBar label="spirit" value={state.stats.happiness} accent={theme.colors.accent} mist={theme.colors.mist} />
            <StatBar label="chakra" value={state.stats.energy} accent={theme.colors.accent} mist={theme.colors.mist} />
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setState((s) => (s ? feed(s) : s))}
              className="text-[10px] py-1.5 rounded-sm bg-black/40 border active:scale-95"
              style={{ borderColor: theme.colors.accentBorder, color: theme.colors.accent }}
            >
              {theme.actionEmoji.feed} {theme.actionLabels.feed}
            </button>
            <button
              onClick={() => setState((s) => (s ? play(s) : s))}
              className="text-[10px] py-1.5 rounded-sm bg-black/40 border active:scale-95"
              style={{ borderColor: theme.colors.accentBorder, color: theme.colors.accent }}
            >
              {theme.actionEmoji.play} {theme.actionLabels.play}
            </button>
            <button
              onClick={() => setState((s) => (s ? rest(s) : s))}
              className="text-[10px] py-1.5 rounded-sm bg-black/40 border active:scale-95"
              style={{ borderColor: theme.colors.accentBorder, color: theme.colors.accent }}
            >
              {theme.actionEmoji.rest} {theme.actionLabels.rest}
            </button>
          </div>

          <div className="h-64">
            <ChatPanel
              name={state.name}
              messages={state.messages}
              onSend={handleSend}
              disabled={pending}
              theme={theme}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
