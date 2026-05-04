const MAX_INPUT_LENGTH = 3000;
const MIN_INPUT_LENGTH = 20;
const MIN_NAME_LENGTH = 2;
const MIN_INTENT_LENGTH = 10;

/**
 * Sanitizes raw prospect info before including in a prompt.
 * Trims whitespace, caps length, strips HTML brackets, and collapses excess newlines.
 *
 * @param {string} input - The raw prospect info string
 * @returns {string} Sanitized string safe for prompt inclusion
 */
export function sanitizeInput(input) {
  return input
    .trim()
    .slice(0, MAX_INPUT_LENGTH)
    .replace(/[<>]/g, '')
    .replace(/\n{3,}/g, '\n\n');
}

/** @constant {number} Maximum allowed length for the prospect name field. */
export const MAX_NAME_LENGTH = 100;

/** @constant {number} Maximum allowed length for the outreach intent field. */
export const MAX_INTENT_LENGTH = 500;

export { MAX_INPUT_LENGTH, MIN_INPUT_LENGTH };

/**
 * Validates the prospect form data before API submission.
 * Checks that prospectInfo exists and meets the minimum length requirement.
 * Also validates name and intent if provided.
 *
 * @param {Object} formData - The form data object
 * @param {string} formData.prospectInfo - Raw prospect information
 * @param {string} [formData.name] - Optional prospect name
 * @param {string} [formData.intent] - Optional outreach intent
 * @returns {{ valid: boolean, error: string|null }} Validation result
 */
export function validateProspectInput(formData) {
  if (formData.name && formData.name.trim().length > 0 && formData.name.trim().length < MIN_NAME_LENGTH) {
    return {
      valid: false,
      error: `Please enter a valid name (at least ${MIN_NAME_LENGTH} characters).`,
    };
  }

  if (!formData.prospectInfo || formData.prospectInfo.trim().length < MIN_INPUT_LENGTH) {
    return {
      valid: false,
      error: 'Please add a bit more about the prospect — at least a sentence.',
    };
  }

  if (formData.intent && formData.intent.trim().length > 0 && formData.intent.trim().length < MIN_INTENT_LENGTH) {
    return {
      valid: false,
      error: `Please make your outreach goal a bit more specific (at least ${MIN_INTENT_LENGTH} characters).`,
    };
  }

  return { valid: true, error: null };
}
