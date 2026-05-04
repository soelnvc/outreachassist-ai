import { describe, it, expect } from 'vitest';
import {
  validateProspectInput,
  sanitizeInput,
  MAX_INPUT_LENGTH,
} from '../utils/validators.js';

describe('validateProspectInput', () => {
  it('returns valid for sufficient prospect info', () => {
    const result = validateProspectInput({
      name: 'Sarah Chen',
      prospectInfo: 'Sarah Chen is the Head of Growth at Acme Corp with 10 years experience',
    });
    expect(result).toEqual({ valid: true, error: null });
  });

  it('returns invalid when name is too short', () => {
    const result = validateProspectInput({
      name: 'S',
      prospectInfo: 'Sarah Chen is the Head of Growth at Acme Corp with 10 years experience',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('valid name');
  });

  it('returns valid when name is missing but prospect info is fine', () => {
    const result = validateProspectInput({
      prospectInfo: 'Sarah Chen is the Head of Growth at Acme Corp with 10 years experience',
    });
    expect(result).toEqual({ valid: true, error: null });
  });

  it('returns invalid when prospectInfo is empty', () => {
    const result = validateProspectInput({ prospectInfo: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please add a bit more about the prospect.');
  });

  it('returns invalid when prospectInfo is under 20 chars', () => {
    const result = validateProspectInput({ prospectInfo: 'Too short' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please add a bit more about the prospect.');
  });

  it('returns invalid when prospectInfo is only whitespace', () => {
    const result = validateProspectInput({ prospectInfo: '              ' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please add a bit more about the prospect.');
  });

  it('returns invalid when prospectInfo is missing entirely', () => {
    const result = validateProspectInput({});
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please add a bit more about the prospect.');
  });

  it('returns valid when intent is not provided', () => {
    const result = validateProspectInput({
      prospectInfo: 'Sarah Chen is the Head of Growth at Acme Corp with 10 years experience',
    });
    expect(result).toEqual({ valid: true, error: null });
  });

  it('returns invalid when intent is under 10 chars', () => {
    const result = validateProspectInput({
      prospectInfo: 'Sarah Chen is the Head of Growth at Acme Corp with 10 years experience',
      intent: 'short',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('10 characters');
  });

  it('returns valid when intent is sufficient', () => {
    const result = validateProspectInput({
      prospectInfo: 'Sarah Chen is the Head of Growth at Acme Corp with 10 years experience',
      intent: 'Selling our new AI analytics tool',
    });
    expect(result).toEqual({ valid: true, error: null });
  });

  it('returns invalid for string of exactly 19 characters', () => {
    const result = validateProspectInput({ prospectInfo: 'x'.repeat(19) });
    expect(result.valid).toBe(false);
  });

  it('returns valid for string of exactly 20 characters', () => {
    const result = validateProspectInput({ prospectInfo: 'x'.repeat(20) });
    expect(result.valid).toBe(true);
  });

  it('returns invalid for null input', () => {
    const result = validateProspectInput(null);
    expect(result.valid).toBe(false);
  });

  it('returns invalid for undefined input', () => {
    const result = validateProspectInput(undefined);
    expect(result.valid).toBe(false);
  });

  it('returns invalid for number input instead of object', () => {
    const result = validateProspectInput(12345);
    expect(result.valid).toBe(false);
  });
});

describe('sanitizeInput', () => {
  it('trims leading and trailing whitespace', () => {
    const result = sanitizeInput('  hello world  ');
    expect(result).toBe('hello world');
  });

  it('strips HTML angle brackets', () => {
    const result = sanitizeInput('<script>alert("xss")</script>');
    expect(result).toBe('scriptalert("xss")/script');
  });

  it('truncates input over MAX_INPUT_LENGTH', () => {
    const longInput = 'a'.repeat(MAX_INPUT_LENGTH + 500);
    const result = sanitizeInput(longInput);
    expect(result.length).toBe(MAX_INPUT_LENGTH);
  });

  it('collapses multiple blank lines', () => {
    const result = sanitizeInput('line one\n\n\n\n\nline two');
    expect(result).toBe('line one\n\nline two');
  });

  it('handles combined sanitization operations', () => {
    const result = sanitizeInput('  <b>hello</b>\n\n\n\nworld  ');
    expect(result).toBe('bhello/b\n\nworld');
  });
});
