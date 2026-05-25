/**
 * Groq AI (OpenAI-compatible) client for this dashboard.
 *
 * Why Groq:
 * - Free-tier friendly for coursework
 * - Fast inference on open models like Llama 3.1
 *
 * Configuration (frontend/.env):
 * - VITE_GROQ_API_KEY=...
 * - VITE_GROQ_MODEL=llama-3.1-8b-instant (default)
 */

const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
const groqModel = import.meta.env.VITE_GROQ_MODEL || "llama-3.1-8b-instant";

export const groqConfigured = Boolean(groqApiKey);

export async function generateGroqText({ prompt }) {
  // This helper is intentionally minimal: it sends a single prompt and returns plain text.
  // The dashboard builds the prompt using real aggregate metrics from Supabase.
  if (!groqApiKey) {
    throw new Error(
      "Missing AI config. Set VITE_GROQ_API_KEY in frontend/.env.",
    );
  }

  // Groq provides an OpenAI-compatible Chat Completions endpoint.
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqApiKey}`,
    },
    body: JSON.stringify({
      model: groqModel,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful business analyst. Ground answers in the provided data and avoid making up facts.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 512,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Groq request failed (${response.status}). ${errorText}`.trim(),
    );
  }

  const json = await response.json();
  const text = json?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("Groq returned no text.");
  }

  return text;
}
