/**
 * Extracts the spreadsheet ID from a full Google Sheets URL or returns the ID if already one.
 * @param {string} input - Full URL or ID
 * @returns {string} The extracted ID
 */
function extractSheetId(input) {
  if (typeof input !== 'string' || !input.trim()) return '';
  
  // Case 1: Full URL (https://docs.google.com/spreadsheets/d/ID/...)
  const urlMatch = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (urlMatch && urlMatch[1]) return urlMatch[1];
  
  // Case 2: Clean ID or ID with trailing bits (ID/edit?...)
  // We take the first part before any slash or question mark
  return input.split(/[\/\?#]/)[0].trim();
}

const API_KEY = import.meta.env?.VITE_GOOGLE_SHEETS_API_KEY || '';
const DEFAULT_SHEET_ID = extractSheetId(import.meta.env?.VITE_SHEET_ID || '');
const PROSPECT_SNIPPET_MAX_LENGTH = 100;

/**
 * Appends one row of generated message data directly to a Google Sheet.
 * If customId is provided, it saves to that specific sheet.
 *
 * @param {Object} rowData - The data to log
 * @param {string} [customId] - Optional personal sheet ID
 * @returns {Promise<boolean>} Resolves to true on success
 */
export async function appendToSheet(rowData, bridgeUrl) {
  const finalUrl = bridgeUrl || import.meta.env.VITE_APPS_SCRIPT_URL;

  if (!finalUrl || !finalUrl.includes('script.google.com')) {
    throw new Error('Apps Script Bridge URL is not configured or invalid.');
  }

  const prospectRaw = rowData.prospectInfo || rowData.prospectSnippet || '';
  const prospectSnippet = prospectRaw.slice(0, PROSPECT_SNIPPET_MAX_LENGTH);

  const payload = {
    outreachChannel: rowData.outreachChannel || 'Not specified',
    industry: rowData.industry || 'Not specified',
    companySize: rowData.companySize || 'Not specified',
    tone: rowData.tone || 'Not specified',
    buyerPersona: rowData.buyerPersona || 'Not specified',
    prospectSnippet: prospectSnippet,
    intent: rowData.intent || 'Not specified',
    message: rowData.message
  };

  try {
    const response = await fetch(finalUrl, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // With no-cors, we can't check response.ok, but if it doesn't throw, we assume success
    return true;
  } catch (error) {
    console.error('Error appending to sheet via bridge:', error);
    throw error;
  }
}

/**
 * Returns the public URL to view the Google Sheet.
 * If a customId is provided (from user profile), it uses that.
 * Otherwise, falls back to the global VITE_SHEET_ID.
 *
 * @param {string} [customId] - Optional personal sheet ID
 * @returns {string} The Google Sheet URL
 */
export function getSheetUrl(customId) {
  const id = extractSheetId(customId) || DEFAULT_SHEET_ID;
  if (!id || id === 'undefined' || id.trim() === '') {
    return '#';
  }
  return `https://docs.google.com/spreadsheets/d/${id}`;
}
