// lib/chat.ts

import OpenAI from "openai";

// Safely load the API key
const apiKey = process.env.NEXT_PUBLIC_OPENAI_KEY;

if (!apiKey) {
  throw new Error("OpenAI API key is missing. Make sure it's defined in `.env.local`");
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true, // WARNING: This exposes your key in client-side apps. Use server-side route for production.
});

/**
 * Sends a transcript to OpenAI and returns the assistant's reply.
 * @param userText The final STT transcript string
 * @returns LLM-generated reply string
 */
export async function getReplyFromLLM(userText: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o", // or "gpt-3.5-turbo" if you're on the free tier
    messages: [
      { role: "system", content: "You are a helpful voice assistant." },
      { role: "user", content: userText },
    ],
  });

  return response.choices[0].message.content ?? "";
}
