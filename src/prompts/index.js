import { sanitizeInput } from '../utils/validators.js';

const MIN_PROSPECT_LENGTH = 20;

/**
 * Builds a personalized cold outreach prompt from prospect data.
 * Includes optional demographic context and humour instruction.
 *
 * @param {Object} prospectData - The form data object
 * @param {string} prospectData.prospectInfo - Raw prospect information (required)
 * @param {string|null} prospectData.gender - Selected gender or null
 * @param {string|null} prospectData.ageRange - Selected age range or null
 * @param {string|null} prospectData.country - Selected country or null
 * @param {string|null} prospectData.profession - Selected profession or null
 * @param {string|null} prospectData.maritalStatus - Selected marital status or null
 * @param {boolean} prospectData.humour - Whether to include humour instruction
 * @returns {string} The complete prompt string ready to send to Gemini
 * @throws {Error} If prospectInfo is missing or too short
 */
export function buildPersonalizerPrompt(prospectData) {
  if (
    !prospectData.prospectInfo ||
    prospectData.prospectInfo.trim().length < MIN_PROSPECT_LENGTH
  ) {
    throw new Error('prospectInfo is required and must be at least 20 characters.');
  }

  const sanitizedInfo = sanitizeInput(prospectData.prospectInfo);

  const contextLines = [];
  if (prospectData.gender) {
    contextLines.push(`- Gender: ${prospectData.gender}`);
  }
  if (prospectData.ageRange) {
    contextLines.push(`- Age range: ${prospectData.ageRange}`);
  }
  if (prospectData.country) {
    contextLines.push(`- Country: ${prospectData.country}`);
  }
  if (prospectData.profession) {
    contextLines.push(`- Profession: ${prospectData.profession}`);
  }
  if (prospectData.maritalStatus) {
    contextLines.push(`- Marital status: ${prospectData.maritalStatus}`);
  }

  const contextBlock =
    contextLines.length > 0
      ? `\nProspect context:\n${contextLines.join('\n')}\n`
      : '';

  const humourBlock = prospectData.humour
    ? '\nOpen with one subtle, culturally relevant meme reference or witty hook. It must be self-aware and light — never forced, never cringe. The humour should make the prospect smile, not groan.\n'
    : '';

  return `You are an expert sales copywriter. Write a personalised cold outreach message for the following prospect.

Prospect information:
"""
${sanitizedInfo}
"""
${contextBlock}
The message must:
- Feel genuinely human and personal — reference specific details from the prospect info
- Be under 100 words
- End with one clear, low-friction call to action
- Never sound templated, robotic, or salesy
${humourBlock}
Return only the final message. No subject line, no preamble, no explanation. Do not use any markdown formatting or bold text.`;
}
