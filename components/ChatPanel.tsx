"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/pet";

export default function ChatPanel({
  name,
  messages,
  onSend,
  disabled,
}: {
  name: string;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  disabled: boolean;
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-black/10 rounded-sm border border-black/30">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] text-xs px-2 py-1.5 rounded-sm ${
              m.role === "pet"
                ? "bg-white/80 text-screendark mr-auto"
                : "bg-screendark text-white ml-auto"
            }`}
          >
            {m.text}
          </div>
        ))}
        {disabled && (
          <div className="max-w-[85%] text-xs px-2 py-1.5 rounded-sm bg-white/60 text-screendark mr-auto italic">
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
          className="flex-1 text-xs px-2 py-1.5 rounded-sm border border-black/30 bg-white/90 text-screendark placeholder:text-screendark/50 outline-none disabled:opacity-60"
        />
        <button
          onClick={submit}
          disabled={disabled}
          className="text-xs px-3 py-1.5 rounded-sm bg-screendark text-white disabled:opacity-50"
        >
          send
        </button>
      </div>
    </div>
  );
}
