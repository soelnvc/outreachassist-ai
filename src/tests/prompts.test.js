import { describe, it, expect } from 'vitest';
import { buildPersonalizerPrompt } from '../prompts/index.js';

const VALID_PROSPECT_INFO =
  'Sarah Chen is the Head of Growth at Acme Corp, specialising in B2B SaaS expansion across Southeast Asia.';

describe('buildPersonalizerPrompt', () => {
  it('returns a string containing the prospect info', () => {
    const generatedPrompt = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: null,
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: false,
    });
    expect(typeof generatedPrompt).toBe('string');
    expect(generatedPrompt).toContain('Sarah Chen');
  });

  it('includes gender context when gender is provided', () => {
    const generatedPrompt = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: 'Male',
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: false,
    });
    expect(generatedPrompt).toContain('Gender: Male');
  });

  it('omits gender context when gender is null', () => {
    const generatedPrompt = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: null,
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: false,
    });
    expect(generatedPrompt).not.toContain('Gender:');
  });

  it('includes humour instruction when humour is true', () => {
    const generatedPrompt = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: null,
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: true,
      intent: null,
    });
    expect(generatedPrompt).toContain('self-aware about cold-messaging');
    expect(generatedPrompt).toContain('Never use a meme');
  });

  it('omits humour instruction when humour is false', () => {
    const generatedPrompt = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: null,
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: false,
      intent: null,
    });
    expect(generatedPrompt).not.toContain('self-aware about cold-messaging');
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
        intent: null,
      }),
    ).toThrow();
  });

  it('includes all provided demographic context fields', () => {
    const generatedPrompt = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: 'Female',
      ageRange: '26–35',
      country: 'India',
      profession: 'Head of Growth',
      maritalStatus: 'Single',
      humour: false,
      intent: null,
    });
    expect(generatedPrompt).toContain('Gender: Female');
    expect(generatedPrompt).toContain('Age range: 26–35');
    expect(generatedPrompt).toContain('Country: India');
    expect(generatedPrompt).toContain('Profession: Head of Growth');
    expect(generatedPrompt).toContain('Marital status: Single');
  });

  it('always ends with the no-formatting instruction', () => {
    const generatedPrompt = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: null,
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: false,
      intent: null,
    });
    expect(generatedPrompt).toContain(
      'Return ONLY the message. No subject line, no preamble, no explanation. No markdown. No bold.',
    );
  });

  it('includes intent block when intent is provided', () => {
    const generatedPrompt = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: null,
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: false,
      intent: 'Selling a new CRM platform',
    });
    expect(generatedPrompt).toContain('Your reason for reaching out: Selling a new CRM platform');
  });

  it('omits intent block when intent is null', () => {
    const generatedPrompt = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: null,
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: false,
      intent: null,
    });
    expect(generatedPrompt).not.toContain('Your reason for reaching out:');
  });

  it('includes banned phrases list in output', () => {
    const generatedPrompt = buildPersonalizerPrompt({
      prospectInfo: VALID_PROSPECT_INFO,
      gender: null,
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: false,
      intent: null,
    });
    expect(generatedPrompt).toContain('I hope this message finds you well');
    expect(generatedPrompt).toContain('synergy');
  });

  it('includes prospect name in output prompt when provided', () => {
    const generatedPrompt = buildPersonalizerPrompt({
      name: 'Sarah Chen',
      prospectInfo: VALID_PROSPECT_INFO,
      gender: null,
      ageRange: null,
      country: null,
      profession: null,
      maritalStatus: null,
      humour: false,
      intent: null,
    });
    expect(generatedPrompt).toContain('Prospect Name: Sarah Chen');
    expect(generatedPrompt).toContain('address them by their first name');
  });
  
  it('throws when prospectInfo is exactly 19 characters', () => {
    expect(() => buildPersonalizerPrompt({ prospectInfo: 'x'.repeat(19) })).toThrow();
  });

  it('handles special characters in prospectInfo', () => {
    const infoWithSpecials = "Sarah's company \"Acme\" `Tech`";
    const generatedPrompt = buildPersonalizerPrompt({ prospectInfo: infoWithSpecials });
    expect(generatedPrompt).toContain(infoWithSpecials);
  });
});
