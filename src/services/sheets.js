const SHEET_ID = import.meta.env.VITE_SHEET_ID;
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

/**
 * Appends one row of generated message data to the Google Sheet
 * via a Google Apps Script web app endpoint.
 * Non-blocking — call with .catch() to avoid breaking main flow.
 *
 * @param {Object} rowData - The data to log
 * @param {string|null} rowData.gender - Selected gender or null
 * @param {string|null} rowData.ageRange - Selected age range or null
 * @param {string|null} rowData.country - Selected country or null
 * @param {string|null} rowData.profession - Selected profession or null
 * @param {string|null} rowData.maritalStatus - Selected marital status or null
 * @param {boolean} rowData.humour - Whether humour was enabled
 * @param {string} rowData.prospectInfo - The original prospect info
 * @param {string} [rowData.intent] - The outreach intent
 * @param {string} rowData.message - The generated message
 * @returns {Promise<void>}
 * @throws {Error} If the API call fails
 */
export async function appendToSheet(rowData) {
  if (!APPS_SCRIPT_URL) {
    throw new Error('Google Apps Script URL is not configured. Check your .env file.');
  }

  const payload = {
    timestamp: new Date().toISOString(),
    gender: rowData.gender ?? 'Not specified',
    ageRange: rowData.ageRange ?? 'Not specified',
    country: rowData.country ?? 'Not specified',
    profession: rowData.profession ?? 'Not specified',
    maritalStatus: rowData.maritalStatus ?? 'Not specified',
    humour: rowData.humour ? 'Yes' : 'No',
    intent: rowData.intent || 'Not specified',
    prospectSnippet: rowData.prospectInfo.slice(0, 100) + '...',
    message: rowData.message,
  };

  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Sheets API error: ${response.status}`);
  }
}

/**
 * Returns the public URL to view the Google Sheet.
 *
 * @returns {string} The Google Sheet URL
 */
export function getSheetUrl() {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}`;
}
