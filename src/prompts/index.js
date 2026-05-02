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
 * @param {string} [prospectData.name] - Prospect name & title
 * @param {string} prospectData.prospectInfo - Company context / Recent news (required)
 * @param {string} [prospectData.intent] - Value proposition / Ask
 * @param {string|null} prospectData.outreachChannel - Selected outreach channel
 * @param {string|null} prospectData.companySize - Selected company size
 * @param {string|null} prospectData.tone - Selected tone
 * @param {string|null} prospectData.industry - Selected industry
 * @param {string|null} prospectData.buyerPersona - Selected buyer persona
 * @param {boolean} prospectData.humour - Whether to include witty hook instruction
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

  const nameBlock = sanitizedName ? `\nProspect Name & Title: ${sanitizedName}\n` : '';
  const intentBlock = sanitizedIntent
    ? `\nValue Proposition & Ask: ${sanitizedIntent}\n`
    : '';

  const contextLines = [];
  if (prospectData.outreachChannel) {
    contextLines.push(`- Outreach Channel: ${prospectData.outreachChannel}`);
  }
  if (prospectData.companySize) {
    contextLines.push(`- Company Size: ${prospectData.companySize}`);
  }
  if (prospectData.industry) {
    contextLines.push(`- Industry: ${prospectData.industry}`);
  }
  if (prospectData.buyerPersona) {
    contextLines.push(`- Buyer Persona: ${prospectData.buyerPersona}`);
  }

  const tone = prospectData.tone || 'Professional';

  const contextBlock =
    contextLines.length > 0
      ? `\nFirmographics & Strategy:\n${contextLines.join('\n')}\n`
      : '';

  const humourBlock = prospectData.humour
    ? `\nWITTY HOOK INSTRUCTION:\nAdd a brief, self-aware, or clever opening hook that breaks the ice. It should acknowledge the cold outreach nature but in a smart, non-cringey way. Example: "I know you probably get 100 pitches a day, so I'll skip the fluff." Make it specific to their industry if possible.\n`
    : '';

  let userProfileBlock = '';
  if (userProfile && (userProfile.name || userProfile.work || userProfile.about || userProfile.company)) {
    userProfileBlock = `\nABOUT YOU (The Sender):\nUse the following information to establish credibility. Keep your introduction brief and relevant to the prospect's pain points.\n`;
    if (userProfile.name) userProfileBlock += `- Your Name: ${userProfile.name}\n`;
    if (userProfile.company) userProfileBlock += `- Your Company Name: ${userProfile.company}\n`;
    if (userProfile.work) userProfileBlock += `- Your Role/Title: ${userProfile.work}\n`;
    if (userProfile.about) userProfileBlock += `- Your Value: ${userProfile.about}\n`;
  }

  return `You are an elite B2B Sales Copywriter and Strategist. Your goal is to write a highly converting, personalized cold outreach message. This message must cut through the noise, feel inherently human, and clearly articulate value.

Here is the context about the prospect and their company:
"""
${sanitizedInfo}
"""
${nameBlock}${intentBlock}${contextBlock}${userProfileBlock}
WRITING RULES — follow these exactly:
1. Tone: ${tone}. Adapt the language to fit this tone while remaining respectful.
2. Hook: Start with a personalized trigger event or specific observation from the company context provided. NEVER use generic openers like "I came across your profile".
3. Value Proposition: Tie their specific company context to the value proposition seamlessly. Don't just list features; focus on the business outcome or pain point resolution.
4. Channel Optimization: Format the message appropriately for the selected Outreach Channel (e.g., shorter for LinkedIn, slightly more detailed but still concise for Cold Email).
5. Brevity: Keep it under 100 words. B2B buyers are busy.
6. Call to Action: End with a low-friction, interest-based CTA (e.g., "Open to learning more?" or "Worth a brief chat?") rather than asking for 15 minutes of their time.
7. NO PLACEHOLDERS: Use the provided "Sender" information. NEVER use placeholders like "[Your Company]", "[My Company]", or "[Role]". If a detail is missing, simply don't mention it.
8. DO NOT use any of these overused sales phrases: ${BANNED_PHRASES.join(', ')}
${humourBlock}
Return ONLY the message. No subject line (unless it's a Cold Email, then put "Subject: [Your Subject]" on the first line), no preamble, no explanation. Just the raw message text.`;
}
