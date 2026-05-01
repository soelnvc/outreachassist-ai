import { describe, it, expect } from 'vitest';
import { buildPersonalizerPrompt } from '../prompts/index.js';

const VALID_PROSPECT_INFO =
  'Sarah Chen is the Head of Growth at Acme Corp, specialising in B2B SaaS expansion across Southeast Asia.';

describe('buildPersonalizerPrompt', () => {
  it('returns a string containing the prospect info', () => {
    const result = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: null,
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: false,
    });
    expect(typeof result).toBe('string');
    expect(result).toContain('Sarah Chen');
  });

  it('includes gender context when gender is provided', () => {
    const result = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: 'Male',
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: false,
    });
    expect(result).toContain('Gender: Male');
  });

  it('omits gender context when gender is null', () => {
    const result = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: null,
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: false,
    });
    expect(result).not.toContain('Gender:');
  });

  it('includes humour instruction when humour is true', () => {
    const result = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: null,
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: true,
    });
    expect(result).toContain('meme reference');
    expect(result).toContain('witty hook');
  });

  it('omits humour instruction when humour is false', () => {
    const result = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: null,
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: false,
    });
    expect(result).not.toContain('meme reference');
  });

  it('throws when prospectInfo is missing', () => {
    expect(() =>
      buildPersonalizerPrompt({
        prospectInfo: '',
        gender: null,
        ageRange: null,
        country: null,
        profession: null,
        maritalStatus: null,
        humour: false,
      }),
    ).toThrow();
  });

  it('includes all provided demographic context fields', () => {
    const result = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: 'Female',
      ageRange: '26–35',
      country: 'India',
      profession: 'Head of Growth',
      maritalStatus: 'Single',
      humour: false,
    });
    expect(result).toContain('Gender: Female');
    expect(result).toContain('Age range: 26–35');
    expect(result).toContain('Country: India');
    expect(result).toContain('Profession: Head of Growth');
    expect(result).toContain('Marital status: Single');
  });

  it('always ends with the no-formatting instruction', () => {
    const result = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: null,
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: false,
    });
    expect(result).toContain(
      'Return only the final message. No subject line, no preamble, no explanation.',
    );
  });
});
