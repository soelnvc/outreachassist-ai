# AI Coding Instructions — Evaluation Criteria
> This file governs every line of code written in this project.
> These are not suggestions. Every rule here is a hard requirement.
> Apply all rules to every file, component, function, and line — no exceptions, no shortcuts.
> When in doubt between two approaches, always choose the one that satisfies more rules from this file.

---

## How this project is evaluated

This submission is reviewed entirely by an AI evaluator across 6 criteria. The AI will read the source code directly. It checks for patterns, not just functionality. A beautiful UI means nothing if the code structure, security, tests, and accessibility are weak. Optimize for code correctness and completeness first.

---

## CRITERION 1 — Code Quality
### Target: Perfect structure, readability, and maintainability

### File and folder rules:
- Follow the exact file structure defined in `Plan.md` — no deviations
- One file = one responsibility. Never put multiple concerns in one file
- Components only render UI. They never contain business logic, API calls, or prompt strings
- All prompt strings live exclusively in `src/prompts/index.js`
- All API calls live exclusively in `src/services/`
- All validation logic lives exclusively in `src/utils/validators.js`
- All response parsing lives exclusively in `src/utils/parseResponse.js`

### Naming rules:
- Variables and functions: `camelCase`, descriptive, action-based for functions
  - GOOD: `buildPersonalizerPrompt`, `validateProspectInput`, `parseApiResponse`
  - BAD: `func1`, `handleClick`, `doThing`, `data`, `res`
- Components: `PascalCase` matching the filename exactly
- Constants: `SCREAMING_SNAKE_CASE`
  ```js
  const MAX_TOKENS = 300;
  const MAX_INPUT_LENGTH = 3000;
  const SHEET_APPEND_URL = `https://sheets.googleapis.com/v4/...`;
  ```

### JSDoc rules — every exported function must have one:
```js
/**
 * Builds a personalized cold outreach prompt from prospect data.
 * Includes optional demographic context and humour instruction.
 *
 * @param {Object} prospectData - The form data object
 * @param {string} prospectData.prospectInfo - Raw prospect information (required)
 * @param {string|null} prospectData.gender - Selected gender or null
 * @param {string|null} prospectData.ageRange - Selected age range or null
 * @param {string|null} prospectData.country - Selected country or null
 * @param {string|null} prospectData.profession - Selected profession or null
 * @param {string|null} prospectData.maritalStatus - Selected marital status or null
 * @param {boolean} prospectData.humour - Whether to include humour instruction
 * @returns {string} The complete prompt string ready to send to Gemini
 * @throws {Error} If prospectInfo is missing or too short
 */
export function buildPersonalizerPrompt(prospectData) { ... }
```

### Component rules:
- Every component under 150 lines. If longer, split it
- Props must be destructured in the function signature
  ```jsx
  // GOOD
  export function OutputCard({ message, onCopy, onSave, isSaving }) { ... }
  // BAD
  export function OutputCard(props) { return <div>{props.message}</div> }
  ```
- No anonymous default exports
  ```jsx
  // GOOD
  export function InputForm() { ... }
  // BAD
  export default () => { ... }
  ```
- Use `useCallback` for all event handlers passed as props
- Use `useMemo` for computed values derived from props or state

### Code cleanliness rules:
- Zero `console.log` statements in any file
- Zero commented-out code blocks in any commit
- Zero unused imports
- No magic numbers — every numeric constant gets a named variable
- Consistent quote style: single quotes everywhere (enforced by Prettier)
- Consistent indentation: 2 spaces (enforced by Prettier)
- Every file ends with a newline character

### `package.json` must contain these scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src --ext .js,.jsx",
    "format": "prettier --write src"
  }
}
```

---

## CRITERION 2 — Security
### Target: No vulnerabilities, no exposed secrets, responsible implementation

### API key rules — the most critical section in this file:
- **NEVER** hardcode any API key anywhere in the codebase
- **NEVER** put a key in a comment, a string, a template literal, or a log
- **NEVER** commit `.env` — it must be in `.gitignore` from the very first commit
- Access keys ONLY via `import.meta.env.VITE_*`:
  ```js
  // CORRECT
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // WRONG — all of these are disqualifying
  const apiKey = 'AIzaSy...';
  const apiKey = process.env.GEMINI_API_KEY;
  ```
- `.env.example` must exist with placeholder values only:
  ```
  VITE_GEMINI_API_KEY=your_gemini_key_here
  VITE_GOOGLE_SHEETS_API_KEY=your_google_sheets_key_here
  VITE_SHEET_ID=your_google_sheet_id_here
  ```

### Input sanitization rules — apply in `validators.js` before every API call:
```js
/**
 * Sanitizes raw prospect info before including in a prompt.
 * @param {string} input
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input) {
  return input
    .trim()
    .slice(0, MAX_INPUT_LENGTH)       // cap length
    .replace(/[<>]/g, '')             // strip HTML brackets
    .replace(/\n{3,}/g, '\n\n');      // collapse excess newlines
}
```

### Validation rules — apply before every API call:
```js
/**
 * Validates the prospect form data before API submission.
 * @param {Object} formData
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateProspectInput(formData) {
  if (!formData.prospectInfo || formData.prospectInfo.trim().length < 20) {
    return { valid: false, error: 'Please add a bit more about the prospect — at least a sentence.' };
  }
  return { valid: true, error: null };
}
```

### Request protection rules:
- Disable the submit button immediately when `isLoading` is true — set `disabled={isLoading}` on the button
- Use `AbortController` in every fetch call to cancel in-flight requests:
  ```js
  const abortControllerRef = useRef(null);
  
  const handleSubmit = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    callGemini(prompt, abortControllerRef.current.signal);
  }, [prompt]);
  ```
- Catch and handle `AbortError` separately — it is not a real error, do not show it to the user:
  ```js
  } catch (err) {
    if (err.name === 'AbortError') return;
    setError('Something went wrong. Please try again.');
  }
  ```

### `max_tokens` rule:
- Set `max_tokens` to the minimum needed — never leave it at default or 4000:
  ```js
  // A personalised message under 100 words needs max 500 tokens
  maxOutputTokens: 500
  ```

---

## CRITERION 3 — Efficiency
### Target: Optimal use of resources, fast, no waste

### State management rules:
- Use `useCallback` on every function that is passed as a prop or used in a `useEffect` dependency array
- Use `useMemo` for any value that is derived from state/props and used in render:
  ```jsx
  const contextSummary = useMemo(() => {
    return [formData.gender, formData.ageRange, formData.country]
      .filter(Boolean)
      .join(', ');
  }, [formData.gender, formData.ageRange, formData.country]);
  ```
- Never re-derive the same value multiple times in a render — compute once, reuse

### API call efficiency rules:
- Only call the API when the user explicitly submits — never on keystroke or field change
- Cache the last result in state — if nothing changed, do not re-call
- Set a sensible `max_tokens` (see Security section)
- The Google Sheets call is non-blocking — it must not delay showing the AI result:
  ```js
  // Show result immediately, save to Sheets in parallel
  setResult(parsedMessage);
  setIsLoading(false);
  appendToSheet(rowData).catch(() => setSheetStatus('error')); // fire and forget
  ```

### Loading state rules — every async action must have one:
- `isLoading` state controls: button disabled, spinner visible, input fields disabled
- Show a descriptive loading message — not just a spinner:
  ```jsx
  {isLoading && (
    <LoadingSpinner message="Crafting your personalised message..." />
  )}
  ```
- Never show stale results while loading — clear previous result when a new request starts:
  ```js
  setResult(null);
  setError(null);
  setIsLoading(true);
  ```

### Re-render efficiency rules:
- Split components at the boundary of what changes — `OutputCard` should not re-render when the form changes
- Pass only the props each component needs — no prop-drilling entire state objects

---

## CRITERION 4 — Testing
### Target: All logic is validated, edge cases are covered, all tests pass

### Test file rules:
- Every utility function in `utils/` has a matching test file in `tests/`
- Every service function in `services/` has a matching test file in `tests/`
- The prompt builder function has its own test file
- Test files are named `[module].test.js` — never `test.js` or `spec.js`

### Minimum test count:
- `validators.test.js`: minimum 5 tests
- `prompts.test.js`: minimum 4 tests
- `parseResponse.test.js`: minimum 4 tests
- `sheets.test.js`: minimum 3 tests (with mocked fetch)
- Total minimum: 16 tests, all passing

### What to test in `validators.test.js`:
```js
describe('validateProspectInput', () => {
  it('returns valid for sufficient prospect info')
  it('returns invalid when prospectInfo is empty')
  it('returns invalid when prospectInfo is under 20 chars')
  it('returns invalid when prospectInfo is only whitespace')
});

describe('sanitizeInput', () => {
  it('trims leading and trailing whitespace')
  it('strips HTML angle brackets')
  it('truncates input over MAX_INPUT_LENGTH')
  it('collapses multiple blank lines')
});
```

### What to test in `prompts.test.js`:
```js
describe('buildPersonalizerPrompt', () => {
  it('returns a string containing the prospect info')
  it('includes gender context when gender is provided')
  it('omits gender context when gender is null')
  it('includes humour instruction when humour is true')
  it('omits humour instruction when humour is false')
  it('throws when prospectInfo is missing')
});
```

### What to test in `parseResponse.test.js`:
```js
describe('parseApiResponse', () => {
  it('returns clean message from valid API response')
  it('strips preamble phrases like "Here is your message:"')
  it('trims leading and trailing whitespace')
  it('throws on malformed API response shape')
});
```

### Mocking pattern for `sheets.test.js`:
```js
import { vi } from 'vitest';

global.fetch = vi.fn();

describe('appendToSheet', () => {
  it('calls fetch with the correct URL and payload')
  it('returns success on 200 response')
  it('throws a typed error on network failure')
});
```

### Test command:
`npm run test` must exit with code 0 (all passing) before every git push.

---

## CRITERION 5 — Accessibility
### Target: Fully usable by all users including screen reader and keyboard users

### Label rules — zero exceptions:
Every `<input>`, `<textarea>`, and `<select>` must have a visible `<label>` with `htmlFor` matching the element's `id`:
```jsx
// CORRECT
<label htmlFor="prospect-info">
  Prospect information
  <span aria-label="optional"> (optional)</span>
</label>
<textarea id="prospect-info" name="prospect-info" ... />

// WRONG — no label, aria-label only, or label not linked
<textarea placeholder="Enter info..." />
<textarea aria-label="Prospect info" />
```

### Semantic HTML rules — use the right tag for every element:
```
<main>        — the main content area (one per page)
<header>      — the page header
<section>     — each logical section with an aria-labelledby heading
<article>     — the output message card
<form>        — the input form (even with no action)
<button>      — all clickable controls (never <div onClick>)
<fieldset>    — each group of related inputs (chip groups)
<legend>      — the label for each fieldset
```

### Chip group / radio group accessibility:
Chip selectors (gender, age, marital status) must be implemented as radio inputs styled as chips — not as `<div>` elements with `onClick`:
```jsx
<fieldset>
  <legend>Gender</legend>
  <div role="group" aria-labelledby="gender-label">
    {['Male', 'Female', 'Other'].map(option => (
      <label key={option} className={`chip ${gender === option ? 'active' : ''}`}>
        <input
          type="radio"
          name="gender"
          value={option}
          checked={gender === option}
          onChange={() => setGender(option)}
          className="sr-only"  // visually hidden but accessible
        />
        {option}
      </label>
    ))}
  </div>
</fieldset>
```

### Error message rules:
All error messages must use `role="alert"` and `aria-live="polite"` so screen readers announce them:
```jsx
export function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      aria-live="polite"
      className="error-message"
    >
      {message}
    </p>
  );
}
```

### Loading state rules:
The loading spinner must be announced to screen readers:
```jsx
export function LoadingSpinner({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message || 'Loading...'}
    >
      <span aria-hidden="true">{/* visual spinner */}</span>
      <span className="sr-only">{message || 'Loading...'}</span>
    </div>
  );
}
```

### Button rules:
- Every button must have descriptive text — describe the action, not the icon
- Icon-only buttons must have `aria-label`:
  ```jsx
  // CORRECT
  <button onClick={onCopy} aria-label="Copy message to clipboard">
    <CopyIcon aria-hidden="true" />
  </button>
  
  // WRONG
  <button onClick={onCopy}><CopyIcon /></button>
  ```
- The submit button communicates loading state:
  ```jsx
  <button
    type="submit"
    disabled={isLoading}
    aria-disabled={isLoading}
    aria-busy={isLoading}
  >
    {isLoading ? 'Generating...' : 'Generate personalised message'}
  </button>
  ```

### Keyboard navigation rules:
- The entire form must be completable using only Tab, Shift+Tab, Space, and Enter
- Never remove the browser's default focus outline — enhance it instead:
  ```css
  :focus-visible {
    outline: 2px solid #534AB7;
    outline-offset: 2px;
  }
  ```
- Focus must return to the submit button (or a logical place) after the result appears

### Color contrast rules:
- All text on white/light backgrounds: minimum 4.5:1 contrast ratio
- Placeholder text: minimum 3:1 contrast ratio
- Error messages: use red that meets contrast requirements on white
- Never use light grey text (`#999`, `#aaa`) on white backgrounds — it fails contrast

### `index.html` rules:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="AI-powered sales message personalizer — generate human-feeling cold outreach in seconds" />
  <title>OutreachAI — Message Personalizer</title>
</head>
```

### Screen reader utility class — must exist in CSS:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## CRITERION 6 — Google Services
### Target: Meaningful, functional, live integration — not decorative

### Integration: Google Sheets API v4

This is not optional decoration. The Sheets integration must be live, functional, and demonstrably useful.

### What it does:
Every time a message is generated and the user clicks "Save to Sheets", one row is appended to a Google Sheet with these columns:

| Timestamp | Gender | Age Range | Country | Profession | Marital Status | Humour | Prospect Snippet | Generated Message |
|---|---|---|---|---|---|---|---|---|
| 2024-01-15 14:32:11 | Male | 26–35 | India | Head of Growth | Single | Yes | "Sarah Chen, Head of... | "Hey Sarah, noticed your..." |

### Why this is meaningful:
- Creates a persistent, queryable log of all outreach messages
- Sales teams can review what inputs produced the best outputs
- Demonstrates real integration that adds value beyond the AI generation itself
- The "View log" button gives judges instant visible proof of integration working

### `services/sheets.js` must implement:
```js
const SHEET_ID = import.meta.env.VITE_SHEET_ID;
const SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const RANGE = 'Sheet1!A:I';

/**
 * Appends one row of generated message data to the Google Sheet.
 * Non-blocking — call with .catch() to avoid breaking main flow.
 *
 * @param {Object} rowData - The data to log
 * @returns {Promise<void>}
 * @throws {Error} If the Sheets API call fails
 */
export async function appendToSheet(rowData) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append`
    + `?valueInputOption=RAW&key=${SHEETS_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      values: [[
        new Date().toISOString(),
        rowData.gender ?? 'Not specified',
        rowData.ageRange ?? 'Not specified',
        rowData.country ?? 'Not specified',
        rowData.profession ?? 'Not specified',
        rowData.maritalStatus ?? 'Not specified',
        rowData.humour ? 'Yes' : 'No',
        rowData.prospectInfo.slice(0, 100) + '...',
        rowData.message,
      ]],
    }),
  });

  if (!response.ok) {
    throw new Error(`Sheets API error: ${response.status}`);
  }
}

/**
 * Returns the public URL to view the Google Sheet.
 * @returns {string}
 */
export function getSheetUrl() {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}`;
}
```

### UI integration requirements:
- "Save to Sheets" button appears in `OutputCard.jsx` after a message is generated
- Button shows loading state while saving: "Saving..." with `aria-busy="true"`
- On success: button text changes to "Saved" with a checkmark, links to the Sheet
- On failure: non-blocking warning appears below the button — the generated message remains visible
- "View log" link opens the Sheet in a new tab: `target="_blank" rel="noopener noreferrer"`

### Setup documentation in README:
The README must include clear steps to set up the Sheets integration:
```
## Google Sheets setup
1. Create a new Google Sheet
2. Add headers in row 1: Timestamp | Gender | Age Range | Country | Profession | Marital Status | Humour | Prospect Snippet | Generated Message
3. Go to Google Cloud Console → Create a project → Enable Google Sheets API
4. Go to Credentials → Create API Key → Restrict to Sheets API
5. Copy the Sheet ID from the URL: docs.google.com/spreadsheets/d/[SHEET_ID]/edit
6. Add VITE_GOOGLE_SHEETS_API_KEY and VITE_SHEET_ID to your .env file
```

### Error handling for Google Services:
- If `VITE_SHEET_ID` or `VITE_GOOGLE_SHEETS_API_KEY` are not set: show a non-blocking warning in the UI, do not crash
- If the API call fails: show "Could not save to Sheets" warning — never block the main message output
- All Sheets errors must be caught — they must never propagate to the main error state

---

## Pre-Commit Verification Checklist
Run through all of these before every `git push`:

### Security
- [ ] `git grep -ri "AIzaSy"` returns no results
- [ ] `git grep -ri "api_key ="` returns only `.env.example`
- [ ] `.env` appears in `.gitignore`
- [ ] `.env.example` is committed with placeholder values

### Code Quality
- [ ] `npm run lint` exits with 0 errors
- [ ] `npm run format` has been run
- [ ] No `console.log` in any file: `git grep "console.log"` returns nothing
- [ ] All exported functions have JSDoc comments
- [ ] No file exceeds 150 lines

### Testing
- [ ] `npm run test` exits with code 0
- [ ] All 16+ tests pass
- [ ] No test is skipped with `.skip` or `.todo`

### Accessibility
- [ ] Every `<input>`, `<textarea>`, `<select>` has a `<label>` with matching `htmlFor`
- [ ] All chip groups implemented as radio inputs
- [ ] Error messages use `role="alert"`
- [ ] Submit button has `aria-busy` and `aria-disabled` during loading
- [ ] `index.html` has `lang="en"` and `meta description`
- [ ] `.sr-only` CSS class exists and is used

### Google Services
- [ ] `appendToSheet()` makes a real API call (not mocked in production code)
- [ ] Sheets errors are caught and non-blocking
- [ ] "Save to Sheets" and "View log" buttons visible in OutputCard
- [ ] README contains complete Sheets setup instructions

### Repository
- [ ] Single branch (main only): `git branch` shows only `* main`
- [ ] Repo under 10MB: check GitHub repo page
- [ ] `node_modules` not committed: `git ls-files | grep node_modules` returns nothing
- [ ] README.md exists and is complete