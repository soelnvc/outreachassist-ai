import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubEnv('VITE_SHEET_ID', 'test-sheet-id-123');
vi.stubEnv('VITE_APPS_SCRIPT_URL', 'https://script.google.com/macros/s/test-id/exec');

const SAMPLE_ROW_DATA = {
  gender: 'Male',
  ageRange: '26–35',
  country: 'India',
  profession: 'Head of Growth',
  maritalStatus: 'Single',
  humour: true,
  prospectInfo: 'Sarah Chen is the Head of Growth at Acme Corp specialising in B2B SaaS.',
  message: 'Hey Sarah, noticed your work at Acme Corp.',
};

describe('appendToSheet', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it('calls fetch with the correct URL and payload', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });

    const { appendToSheet } = await import('../services/sheets.js');
    await appendToSheet(SAMPLE_ROW_DATA);

    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toContain('script.google.com');
    expect(options.method).toBe('POST');

    const body = JSON.parse(options.body);
    expect(body.gender).toBe('Male');
    expect(body.humour).toBe('Yes');
    expect(body.message).toContain('Sarah');
  });

  it('returns success on 200 response', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });

    const { appendToSheet } = await import('../services/sheets.js');
    await expect(appendToSheet(SAMPLE_ROW_DATA)).resolves.toBeUndefined();
  });

  it('throws a typed error on network failure', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const { appendToSheet } = await import('../services/sheets.js');
    await expect(appendToSheet(SAMPLE_ROW_DATA)).rejects.toThrow('Sheets API error: 500');
  });
});

describe('getSheetUrl', () => {
  it('returns the correct Google Sheet URL', async () => {
    const { getSheetUrl } = await import('../services/sheets.js');
    const url = getSheetUrl();
    expect(url).toContain('docs.google.com/spreadsheets/d/');
  });
});
