const MAX_INPUT_LENGTH = 3000;
const MIN_INPUT_LENGTH = 20;

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

/**
 * Validates the prospect form data before API submission.
 * Checks that prospectInfo exists and meets the minimum length requirement.
 *
 * @param {Object} formData - The form data object
 * @param {string} formData.prospectInfo - Raw prospect information
 * @returns {{ valid: boolean, error: string|null }} Validation result
 */
export function validateProspectInput(formData) {
  if (!formData.prospectInfo || formData.prospectInfo.trim().length < MIN_INPUT_LENGTH) {
    return {
      valid: false,
      error: 'Please add a bit more about the prospect — at least a sentence.',
    };
  }
  return { valid: true, error: null };
}

export { MAX_INPUT_LENGTH, MIN_INPUT_LENGTH };
