import { sanitizeInput } from '../utils/validators.js';

const MIN_PROSPECT_LENGTH = 20;

const BANNED_PHRASES = [
  '"I hope this message finds you well"',
  '"I came across your profile"',
  '"I was impressed by"',
  '"I\'d love to pick your brain"',
  '"leverage"',
  '"synergy"',
  '"circle back"',
  '"touch base"',
  '"value proposition"',
];

/**
 * Builds the prompt string to send to Gemini based on the collected user inputs
 * and the logged-in user's profile data.
 * 
 * @param {Object} prospectData - The collected form data
 * @param {string} [prospectData.name] - Prospect name
 * @param {string} prospectData.prospectInfo - Raw prospect information (required)
 * @param {string} [prospectData.intent] - Optional outreach goal
 * @param {string|null} prospectData.gender - Selected gender or null
 * @param {string|null} prospectData.ageRange - Selected age range or null
 * @param {string|null} prospectData.country - Selected country or null
 * @param {string|null} prospectData.profession - Selected profession or null
 * @param {string|null} prospectData.maritalStatus - Selected marital status or null
 * @param {boolean} prospectData.humour - Whether to include humour instruction
 * @param {Object} [userProfile] - The logged-in user's profile data
 * @returns {string} The formatted prompt
 */
export function buildPersonalizerPrompt(prospectData, userProfile) {
  if (
    !prospectData.prospectInfo ||
    prospectData.prospectInfo.trim().length < MIN_PROSPECT_LENGTH
  ) {
    throw new Error('prospectInfo is required and must be at least 20 characters.');
  }

  const sanitizedInfo = sanitizeInput(prospectData.prospectInfo);
  const sanitizedIntent = prospectData.intent ? sanitizeInput(prospectData.intent) : '';
  const sanitizedName = prospectData.name ? sanitizeInput(prospectData.name) : '';

  const nameBlock = sanitizedName ? `\nProspect Name: ${sanitizedName}\n` : '';
  const intentBlock = sanitizedIntent
    ? `\nYour reason for reaching out: ${sanitizedIntent}\n`
    : '';

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
      ? `\nAdditional context about this person:\n${contextLines.join('\n')}\n`
      : '';

  const humourBlock = prospectData.humour
    ? `\nHUMOUR INSTRUCTION:\nBefore the main message, add ONE line that shows you're self-aware about cold-messaging. Examples of the TONE (do not copy these literally):\n- "This is technically a cold message, but I've read enough about your work that it feels weird calling it that."\n- "I promise this isn't another 'quick 15-min call' message. Okay, it kind of is. But hear me out."\n- "I spent way too long reading your profile before writing this, so at minimum I'm a dedicated cold-emailer."\nMake it specific to their situation. Never use a meme. Never reference internet culture. Just be a witty, self-aware human.\n`
    : '';

  let userProfileBlock = '';
  if (userProfile && (userProfile.name || userProfile.work || userProfile.about)) {
    userProfileBlock = `\nABOUT YOU (The Sender):\nUse the following information to find similarities with the prospect and briefly introduce yourself where natural. Keep your introduction minimal.\n`;
    if (userProfile.name) userProfileBlock += `- Your Name: ${userProfile.name}\n`;
    if (userProfile.work) userProfileBlock += `- Your Role/Profession: ${userProfile.work}\n`;
    if (userProfile.about) userProfileBlock += `- About You: ${userProfile.about}\n`;
  }

  return `You are writing a short, personal message to someone you've looked into and genuinely want to reach out to. This is NOT a sales template. This is a real human writing to another real human.

Here is everything you know about this person:
"""
${sanitizedInfo}
"""
${nameBlock}${intentBlock}${contextBlock}${userProfileBlock}
WRITING RULES — follow these exactly:
1. Start with something specific you noticed about THEM — not a generic opener like "I came across your profile." Pull a real detail from the info above.
2. If the Prospect Name is provided, address them by their first name naturally in the message.
3. Keep it under 80 words. Shorter is better. Real messages are short.
4. Write like you'd text a professional acquaintance — not like a LinkedIn bot. Use contractions. Use dashes. Be casual but respectful.
5. ONE sentence about why you're reaching out. Don't oversell. Don't list benefits.
6. End with a simple question — not a "call to action." Real people ask questions, they don't issue CTAs.
7. DO NOT use any of these phrases: ${BANNED_PHRASES.join(', ')}
${humourBlock}
Return ONLY the message. No subject line, no preamble, no explanation. No markdown. No bold. Just the raw message text.`;
}
