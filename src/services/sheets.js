const SHEET_ID = import.meta.env.VITE_SHEET_ID;
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;
const PROSPECT_SNIPPET_MAX_LENGTH = 100;

/**
 * Appends one row of generated message data to the Google Sheet
 * via a Google Apps Script web app endpoint.
 * Non-blocking — call with .catch() to avoid breaking main flow.
 *
 * @param {Object} rowData - The data to log
 * @param {string|null} [customUrl] - User-specific Apps Script URL
 * @returns {Promise<boolean>} Resolves to true on success
 * @throws {Error} If the target URL is missing or the request fails
 */
export async function appendToSheet(rowData, customUrl) {
  const targetUrl = customUrl || APPS_SCRIPT_URL;

  if (!targetUrl || targetUrl.trim() === '') {
    throw new Error('Google Apps Script URL is not configured in Settings.');
  }

  // Safety check for prospectInfo
  const prospectRaw = rowData.prospectInfo || rowData.prospectSnippet || '';
  const prospectSnippet = prospectRaw.length > PROSPECT_SNIPPET_MAX_LENGTH
    ? prospectRaw.slice(0, PROSPECT_SNIPPET_MAX_LENGTH) + '...'
    : prospectRaw;

  const payload = {
    timestamp: new Date().toISOString(),
    outreachChannel: rowData.outreachChannel ?? 'Not specified',
    companySize: rowData.companySize ?? 'Not specified',
    industry: rowData.industry ?? 'Not specified',
    buyerPersona: rowData.buyerPersona ?? 'Not specified',
    tone: rowData.tone ?? 'Professional',
    humour: rowData.humour ? 'Yes' : 'No',
    intent: rowData.intent || 'Not specified',
    name: rowData.name || rowData.prospectName || 'Not specified',
    prospectSnippet: prospectSnippet,
    message: rowData.message,
  };

  const sheetResponse = await fetch(targetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  });

  if (!sheetResponse.ok) {
    throw new Error(`Server responded with ${sheetResponse.status}`);
  }

  return true;
}

/**
 * Returns the public URL to view the Google Sheet.
 *
 * @returns {string} The Google Sheet URL
 */
export function getSheetUrl() {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}`;
}
