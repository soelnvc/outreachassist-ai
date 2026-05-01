const PREAMBLE_PATTERNS = [
  /^here is your message:?\s*/i,
  /^here's your message:?\s*/i,
  /^sure,?\s*here'?s?\s*(your|the)\s*(personali[sz]ed\s*)?message:?\s*/i,
  /^here you go:?\s*/i,
  /^certainly[,!]?\s*/i,
  /^of course[,!]?\s*/i,
];

/**
 * Parses and cleans the raw Gemini API response into a usable message object.
 * Extracts text content, strips accidental preamble phrases, and trims whitespace.
 *
 * @param {Object} rawResponse - The raw JSON response from the Gemini API
 * @returns {{ message: string }} A clean message object
 * @throws {Error} If the response shape is malformed or missing content
 */
export function parseApiResponse(rawResponse) {
  if (
    !rawResponse ||
    !rawResponse.candidates ||
    !Array.isArray(rawResponse.candidates) ||
    rawResponse.candidates.length === 0
  ) {
    throw new Error('Malformed API response: missing candidates array.');
  }

  const candidate = rawResponse.candidates[0];

  if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
    throw new Error('Malformed API response: missing content parts.');
  }

  let text = candidate.content.parts[0].text;

  if (typeof text !== 'string') {
    throw new Error('Malformed API response: text content is not a string.');
  }

  text = text.trim();

  for (const pattern of PREAMBLE_PATTERNS) {
    text = text.replace(pattern, '');
  }

  text = text.trim();

  return { message: text };
}
