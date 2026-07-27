import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, type ChatMessage, type Stats } from "@/lib/pet";

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

type ChatRequestBody = {
  name: string;
  stats: Stats;
  messages: ChatMessage[]; // full history including the latest user message
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY is not set on the server. Add it in your Vercel project's Environment Variables.",
      },
      { status: 500 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, stats, messages } = body;
  if (!name || !stats || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Missing name, stats, or messages." }, { status: 400 });
  }

  const contents = messages.slice(-20).map((m) => ({
    role: m.role === "pet" ? "model" : "user",
    parts: [{ text: m.text }],
  }));

  const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildSystemPrompt(name, stats) }],
      },
      contents,
      generationConfig: {
        temperature: 1,
        maxOutputTokens: 200,
      },
    }),
  });

  if (!geminiRes.ok) {
    const detail = await geminiRes.text();
    return NextResponse.json(
      { error: `Gemini API error (${geminiRes.status}): ${detail.slice(0, 300)}` },
      { status: 502 }
    );
  }

  const data = await geminiRes.json();
  const reply: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    return NextResponse.json(
      { error: "Gemini returned an empty response. It may have blocked the content." },
      { status: 502 }
    );
  }

  return NextResponse.json({ reply: reply.trim() });
}
