"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/pet";
import type { CharacterTheme } from "@/lib/themes";

export default function ChatPanel({
  name,
  messages,
  onSend,
  disabled,
  theme,
}: {
  name: string;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  disabled: boolean;
  theme: CharacterTheme;
}) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function submit() {
    const text = draft.trim();
    if (!text || disabled) return;
    onSend(text);
    setDraft("");
  }

  const { mist, accent, accentBorder } = theme.colors;

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-1 overflow-y-auto space-y-2 p-2 bg-black/30 rounded-sm border"
        style={{ borderColor: accentBorder }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] text-xs px-2 py-1.5 rounded-sm ${
              m.role === "pet" ? "bg-black/40 border border-white/10 mr-auto" : "ml-auto font-medium"
            }`}
            style={
              m.role === "pet"
                ? { color: mist }
                : { backgroundColor: accent, color: "#000" }
            }
          >
            {m.text}
          </div>
        ))}
        {disabled && (
          <div
            className="max-w-[85%] text-xs px-2 py-1.5 rounded-sm bg-black/40 border border-white/10 mr-auto italic"
            style={{ color: mist, opacity: 0.7 }}
          >
            {name} is typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-1 mt-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={`say something to ${name}...`}
          disabled={disabled}
          className="flex-1 text-xs px-2 py-1.5 rounded-sm border bg-black/40 outline-none disabled:opacity-60 placeholder:text-white/30"
          style={{ borderColor: accentBorder, color: mist }}
        />
        <button
          onClick={submit}
          disabled={disabled}
          className="text-xs px-3 py-1.5 rounded-sm font-bold disabled:opacity-50"
          style={{ backgroundColor: accent, color: "#000" }}
        >
          send
        </button>
      </div>
    </div>
  );
}
