const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log("Gemini key set?", Boolean(import.meta.env.VITE_GEMINI_API_KEY));
const geminiModel = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash";

export const geminiConfigured = Boolean(geminiApiKey);

export async function generateGeminiText({ prompt }) {
  if (!geminiApiKey) {
    throw new Error(
      "Missing AI config. Set VITE_GEMINI_API_KEY in frontend/.env (Google AI Studio free tier).",
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    geminiModel,
  )}:generateContent?key=${encodeURIComponent(geminiApiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 512,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Gemini request failed (${response.status}). ${errorText}`.trim(),
    );
  }

  const json = await response.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned no text.");
  }

  return text;
}

