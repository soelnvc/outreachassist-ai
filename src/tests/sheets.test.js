import { describe, it, expect, vi, beforeEach } from 'vitest';

// Force environment variables for the tests
process.env.VITE_SHEET_ID = 'test-sheet-id-123';
process.env.VITE_GOOGLE_SHEETS_API_KEY = 'test-api-key';

// Mock import.meta.env for Vitest
vi.mock('../services/sheets.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
  };
});

const SAMPLE_ROW_DATA = {
  name: 'Sarah Chen',
  gender: 'Female',
  ageRange: '26–35',
  country: 'India',
  profession: 'Head of Growth',
  buyerPersona: 'Growth Leader',
  maritalStatus: 'Single',
  humour: true,
  intent: 'Selling CRM software',
  prospectInfo: 'Sarah Chen is the Head of Growth at Acme Corp specialising in B2B SaaS.',
  message: 'Hey Sarah, noticed your work at Acme Corp.',
};

describe('appendToSheet', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
    // Ensure env is set for each test
    vi.stubEnv('VITE_SHEET_ID', 'test-sheet-id-123');
    vi.stubEnv('VITE_GOOGLE_SHEETS_API_KEY', 'test-api-key');
  });

  it('calls fetch with the correct URL and 2D array payload', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });

    const { appendToSheet } = await import('../services/sheets.js');
    await appendToSheet(SAMPLE_ROW_DATA);

    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toContain('sheets.googleapis.com/v4/spreadsheets/test-sheet-id-123/values/Sheet1!A:I:append');
    expect(url).toContain('key=test-api-key');
    expect(options.method).toBe('POST');

    const body = JSON.parse(options.body);
    expect(Array.isArray(body.values)).toBe(true);
    expect(body.values[0].length).toBe(9);
    
    const row = body.values[0];
    expect(row[4]).toBe('Growth Leader');
    expect(row[6]).toBe('Yes');
    expect(row[8]).toBe(SAMPLE_ROW_DATA.message);
  });

  it('throws a typed error on non-ok response', async () => {
    global.fetch.mockResolvedValueOnce({ 
      ok: false, 
      status: 403,
      json: () => Promise.resolve({ error: { message: 'Invalid API Key' } })
    });

    const { appendToSheet } = await import('../services/sheets.js');
    await expect(appendToSheet(SAMPLE_ROW_DATA)).rejects.toThrow('Sheets API error: 403 Invalid API Key');
  });

  it('truncates prospectInfo to 100 characters', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    const { appendToSheet } = await import('../services/sheets.js');
    
    const longInfo = 'a'.repeat(200);
    await appendToSheet({ ...SAMPLE_ROW_DATA, prospectInfo: longInfo });

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    const row = body.values[0];
    expect(row[7].length).toBe(100); 
    expect(row[7]).toBe('a'.repeat(100));
  });
});

describe('getSheetUrl', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns the correct Google Sheet URL', async () => {
    vi.stubEnv('VITE_SHEET_ID', 'test-sheet-id-123');
    const { getSheetUrl } = await import('../services/sheets.js');
    const url = getSheetUrl();
    expect(url).toBe('https://docs.google.com/spreadsheets/d/test-sheet-id-123');
  });

  it('returns # if Sheet ID is missing', async () => {
    vi.stubEnv('VITE_SHEET_ID', '');
    const { getSheetUrl } = await import('../services/sheets.js');
    expect(getSheetUrl()).toBe('#');
  });

  it('returns # if Sheet ID is "undefined" string', async () => {
    vi.stubEnv('VITE_SHEET_ID', 'undefined');
    const { getSheetUrl } = await import('../services/sheets.js');
    expect(getSheetUrl()).toBe('#');
  });
});
