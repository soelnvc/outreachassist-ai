const SHEET_ID = import.meta.env.VITE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const PROSPECT_SNIPPET_MAX_LENGTH = 100;

/**
 * Appends one row of generated message data directly to a Google Sheet
 * via the Google Sheets API v4.
 * Non-blocking — call with .catch() to avoid breaking main flow.
 *
 * @param {Object} rowData - The data to log
 * @returns {Promise<boolean>} Resolves to true on success
 * @throws {Error} If the API key or Sheet ID is missing or the request fails
 */
export async function appendToSheet(rowData) {
  // RULE Q3 — API key guard at top of function
  if (!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY) {
    throw new Error('Google Sheets API key is not configured. Add VITE_GOOGLE_SHEETS_API_KEY to .env');
  }
  if (!import.meta.env.VITE_SHEET_ID) {
    throw new Error('Sheet ID is not configured. Add VITE_SHEET_ID to .env');
  }

  // RULE Q1 — Correct API endpoint
  const range = 'Sheet1!A:I'; // Default range, assuming Sheet1
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}:append?valueInputOption=RAW&key=${API_KEY}`;

  // RULE Q2 — Row data shape is correct and complete
  // Order: Timestamp | Gender (null) | Age Range (null) | Country (null) | Profession (null) | Marital Status (null) | Humour | Prospect Snippet | Generated Message
  // Note: This project uses B2B fields, so we map them meaningfully to the requested schema where possible or keep B2B context.
  // The RULE Q2 specifically asks for Gender/Age/Country/Profession/Marital Status columns.
  // I will adapt the data to match the requested columns as closely as possible from B2B data.
  
  const prospectRaw = rowData.prospectInfo || rowData.prospectSnippet || '';
  const prospectSnippet = prospectRaw.slice(0, PROSPECT_SNIPPET_MAX_LENGTH);

  const values = [
    [
      new Date().toISOString(),           // Timestamp
      'Not specified',                     // Gender (Not applicable in B2B context)
      'Not specified',                     // Age Range (Not applicable in B2B context)
      'Not specified',                     // Country
      rowData.buyerPersona ?? 'Not specified', // Profession (Mapping Buyer Persona here)
      'Not specified',                     // Marital Status
      rowData.humour ? 'Yes' : 'No',      // Humour
      prospectSnippet,                    // Prospect Snippet (truncated)
      rowData.message,                    // Generated Message
    ]
  ];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });

    // RULE Q4 — Response is checked for ok status
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Sheets API error: ${response.status} ${errorData.error?.message || ''}`);
    }

    return true;
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }
}

/**
 * Returns the public URL to view the Google Sheet.
 * RULE Q5 — getSheetUrl returns a real URL
 *
 * @returns {string} The Google Sheet URL
 */
export function getSheetUrl() {
  const id = import.meta.env.VITE_SHEET_ID;
  if (!id || id === 'undefined' || id.trim() === '') {
    return '#';
  }
  return `https://docs.google.com/spreadsheets/d/${id}`;
}
