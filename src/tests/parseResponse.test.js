import { describe, it, expect } from 'vitest';
import { parseApiResponse } from '../utils/parseResponse.js';

const buildMockResponse = (text) => ({
  candidates: [
    {
      content: {
        parts: [{ text }],
      },
    },
  ],
});

describe('parseApiResponse', () => {
  it('returns clean message from valid API response', () => {
    const raw = buildMockResponse('Hey Sarah, noticed your work at Acme Corp.');
    const parsedResult = parseApiResponse(raw);
    expect(parsedResult).toEqual({
      message: 'Hey Sarah, noticed your work at Acme Corp.',
    });
  });

  it('strips preamble phrases like "Here is your message:"', () => {
    const raw = buildMockResponse('Here is your message: Hey Sarah, great work.');
    const parsedResult = parseApiResponse(raw);
    expect(parsedResult.message).toBe('Hey Sarah, great work.');
  });

  it('strips case-insensitive preamble "Sure, here\'s your message:"', () => {
    const raw = buildMockResponse(
      "Sure, here's your personalized message: Hello there.",
    );
    const parsedResult = parseApiResponse(raw);
    expect(parsedResult.message).toBe('Hello there.');
  });

  it('trims leading and trailing whitespace', () => {
    const raw = buildMockResponse('  \n  Hello world  \n  ');
    const parsedResult = parseApiResponse(raw);
    expect(parsedResult.message).toBe('Hello world');
  });

  it('throws on malformed API response shape — null', () => {
    expect(() => parseApiResponse(null)).toThrow('Malformed API response');
  });

  it('throws on malformed API response shape — empty candidates', () => {
    expect(() => parseApiResponse({ candidates: [] })).toThrow(
      'Malformed API response',
    );
  });

  it('throws on malformed API response shape — missing content parts', () => {
    expect(() =>
      parseApiResponse({ candidates: [{ content: { parts: [] } }] }),
    ).toThrow('Malformed API response');
  });
});
