const GEMINI_MODEL = 'gemini-3.1-flash-lite-preview';
const MAX_OUTPUT_TOKENS = 500;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Calls the Google Gemini API with the given prompt string.
 * Supports request cancellation via AbortController signal.
 *
 * @param {string} prompt - The complete prompt string to send
 * @param {AbortSignal} [signal] - Optional AbortController signal for cancellation
 * @returns {Promise<Object>} The raw JSON response from the Gemini API
 * @throws {Error} If the API key is missing, the request fails, or the response is not ok
 */
export async function callGemini(prompt, signal) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Check your .env file.');
  }

  const url = `${GEMINI_API_URL}?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: MAX_OUTPUT_TOKENS,
      },
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
