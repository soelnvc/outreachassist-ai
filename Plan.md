# PromptWars — Project Plan
> This document is the single source of truth for the AI assistant (Antigravity) working on this project.
> Read it fully before writing any code. Refer back to it when making any architectural decision.

---

## Project Overview

**Competition:** PromptWars — AI Prototyping Competition (Round 1, AI-evaluated)
**Problem Statement:** AI-Powered Sales Automation & Persuasion
**Submission format:** Public GitHub repository (single branch, under 10MB)
**Evaluation:** Automated AI scoring across 6 criteria (see Instructions.md)

**What we are building:**
A single-feature web application called **"OutreachAI — Message Personalizer"**.

It takes information about a sales prospect and generates a hyper-personalized cold outreach message. The user enriches the output using demographic selectors (gender, age, country, profession, marital status) and an optional humour toggle that adds a witty meme-style opening hook.

**Why one feature only:**
AI evaluation rewards depth over breadth. One feature built with perfect code quality, full test coverage, complete accessibility, and meaningful Google integration scores higher than three shallow features. Every file in this repo must serve this one feature excellently.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend framework | React 18 (Vite) | Fast setup, JSX for accessible components, hooks for state |
| Styling | Tailwind CSS | Utility classes, no CSS file bloat, responsive by default |
| AI API | Google Gemini API (`gemini-1.5-flash`) | Fast, cheap, excellent instruction-following for prompt tasks |
| Google Service | Google Sheets API v4 | Saves every generated message to a Sheet — live demo-able, meaningful, not decorative |
| Testing | Vitest | Zero-config with Vite, fast, same syntax as Jest |
| Linting | ESLint + Prettier | Code quality enforcement |
| Environment | `.env` via Vite (`import.meta.env`) | Secure key management |
| Deployment | Static (no backend) | All API calls from browser using env keys |

**No backend server. No database. No auth.** State lives in React. Keys live in `.env`.

---

## File Structure

Every file listed here must exist in the final submission. No extra files, no missing files.

```
/
├── .env.example                        ← safe to commit, placeholder keys only
├── .gitignore                          ← must include .env and node_modules
├── package.json                        ← scripts: dev, build, test, lint
├── vite.config.js
├── tailwind.config.js
├── index.html                          ← accessible, has lang="en", meta viewport
├── README.md                           ← setup instructions, features, test run steps
│
└── src/
    ├── main.jsx                        ← React root, no logic here
    ├── App.jsx                         ← renders <PersonalizerPage />, no logic here
    │
    ├── components/
    │   ├── InputForm.jsx               ← accessible form, all inputs with labels
    │   ├── DemographicSelectors.jsx    ← chip-group selectors for gender/age/country/profession/marital
    │   ├── HumourToggle.jsx            ← toggle button for humour mode
    │   ├── OutputCard.jsx              ← renders generated message + copy button + save button
    │   ├── ErrorMessage.jsx            ← role="alert", aria-live="polite"
    │   └── LoadingSpinner.jsx          ← aria-busy, accessible loading state
    │
    ├── features/
    │   └── personalizer/
    │       └── index.jsx               ← wires form → prompt → api → output, owns all state
    │
    ├── prompts/
    │   └── index.js                    ← ALL prompt strings as exported functions, nothing else
    │
    ├── services/
    │   ├── gemini.js                   ← Gemini API fetch call, AbortController, error handling
    │   └── sheets.js                   ← Google Sheets API call to append a row
    │
    ├── utils/
    │   ├── validators.js               ← input validation and sanitization functions
    │   └── parseResponse.js            ← cleans and structures API response
    │
    └── tests/
        ├── validators.test.js          ← unit tests for validators.js
        ├── prompts.test.js             ← unit tests for prompts/index.js
        ├── parseResponse.test.js       ← unit tests for parseResponse.js
        └── sheets.test.js             ← unit tests for sheets.js (mocked fetch)
```

---

## All Input Fields

### 1. Prospect Info (required — textarea)
- Free text, minimum 20 characters
- User pastes: LinkedIn bio, company about page, recent post, job title, anything
- This is the primary raw material for the AI prompt
- Sanitized before use: trimmed, capped at 3000 characters, HTML-stripped

### 2. Gender (optional chip selector)
- Options: Male, Female, Other
- Default: none selected (prompt omits this context if not selected)
- Affects: pronoun use and cultural framing in the message

### 3. Age Range (optional chip selector)
- Options: 18–25, 26–35, 36–45, 45+
- Default: none selected
- Affects: energy level, references, formality of the message

### 4. Country (optional dropdown select)
- Options: United States, India, United Kingdom, Germany, Singapore, Other
- Default: "Select country" (empty — prompt omits if not selected)
- Affects: cultural context, idioms, timezone references

### 5. Profession (optional dropdown select)
- Options: Founder/CEO, Head of Growth, Sales Leader, Product Manager, Engineer, Marketing, Other
- Default: "Select profession" (empty — prompt omits if not selected)
- Affects: pain points referenced, language register, value proposition angle

### 6. Marital Status (optional chip selector — explicitly labelled optional)
- Options: Single, Married, Parent, Skip
- Default: none / Skip
- Affects: subtle tone — parents get efficiency/ROI framing, younger singles get ambition framing

### 7. Humour Toggle (optional boolean toggle)
- Default: off
- When ON: appends an extra instruction to the prompt asking for a witty, culturally relevant meme-style opening hook
- The hook must be subtle, self-aware, and relevant — never forced or cringe

---

## Prompt Architecture

All prompt logic lives exclusively in `src/prompts/index.js`.

### Function signature:
```js
export function buildPersonalizerPrompt(prospectData) {
  // prospectData shape:
  // {
  //   prospectInfo: string,     (required)
  //   gender: string | null,
  //   ageRange: string | null,
  //   country: string | null,
  //   profession: string | null,
  //   maritalStatus: string | null,
  //   humour: boolean
  // }
}
```

### Prompt construction logic:
1. Build a `contextBlock` string from whichever optional fields are provided (skip nulls entirely)
2. Append the humour instruction only if `humour === true`
3. Always end with: "Return only the final message. No subject line, no preamble, no explanation. Do not use any markdown formatting or bold text."

### Example output prompt:
```
You are an expert sales copywriter. Write a personalised cold outreach message for the following prospect.

Prospect information:
"""
[sanitized prospectInfo]
"""

Prospect context:
- Gender: Male
- Age range: 26–35
- Country: India
- Profession: Head of Growth

The message must:
- Feel genuinely human and personal — reference specific details from the prospect info
- Be under 100 words
- End with one clear, low-friction call to action
- Never sound templated, robotic, or salesy

[HUMOUR BLOCK — only if humour === true]:
Open with one subtle, culturally relevant meme reference or witty hook. It must be self-aware and light — never forced, never cringe. The humour should make the prospect smile, not groan.

Return only the final message. No subject line, no preamble, no explanation. Do not use any markdown formatting or bold text.
```

---

## Full Data Flow

### Step 1 — User fills the form
- `InputForm.jsx` collects `prospectInfo` (textarea)
- `DemographicSelectors.jsx` collects gender, ageRange, maritalStatus (chip groups)
- Profession and country collected via `<select>` dropdowns
- `HumourToggle.jsx` manages the boolean humour flag
- All state is lifted to `features/personalizer/index.jsx`

### Step 2 — User clicks "Generate"
- `features/personalizer/index.jsx` calls `validateProspectInput(formData)` from `utils/validators.js`
- If invalid: sets `errorMessage` state → `ErrorMessage.jsx` renders with `role="alert"`
- If valid: sets `isLoading = true`, disables submit button, cancels any in-flight request via `AbortController`

### Step 3 — Prompt building
- `buildPersonalizerPrompt(formData)` from `prompts/index.js` is called
- Returns a single string — the complete prompt ready to send

### Step 4 — Gemini API call
- `callGemini(prompt)` from `services/gemini.js` is called
- Uses `fetch` to POST to `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`
- API key read from `import.meta.env.VITE_GEMINI_API_KEY`
- AbortController signal passed to fetch for cancellation support
- `maxOutputTokens: 500` (sufficient for a <100 word message)
- On success: returns raw response text
- On failure: throws a typed error caught by the feature component

### Step 5 — Response parsing
- `parseApiResponse(rawResponse)` from `utils/parseResponse.js` is called
- Trims whitespace, strips any accidental preamble like "Here is your message:"
- Returns a clean `{ message: string }` object
- Sets `isLoading = false`, sets `result` state

### Step 6 — Output rendering
- `OutputCard.jsx` receives the `result` and renders:
  - The formatted message in a readable card
  - "Copy to clipboard" button (uses `navigator.clipboard.writeText`)
  - "Save to Sheets" button → calls `appendToSheet()` from `services/sheets.js`

### Step 7 — Google Sheets save
- `appendToSheet(rowData)` from `services/sheets.js` is called
- Posts to Google Sheets API v4: `spreadsheets.values.append`
- Row data: `[timestamp, gender, ageRange, country, profession, humourOn, truncatedProspectInfo, generatedMessage]`
- On success: shows a brief "Saved to Sheets" confirmation in the output card
- On failure: shows a non-blocking warning (does not break the main flow)

---

## State Shape (inside `features/personalizer/index.jsx`)

```js
const [formData, setFormData] = useState({
  prospectInfo: '',
  gender: null,
  ageRange: null,
  country: null,
  profession: null,
  maritalStatus: null,
  humour: false,
});

const [isLoading, setIsLoading] = useState(false);
const [result, setResult] = useState(null);
const [error, setError] = useState(null);
const [sheetStatus, setSheetStatus] = useState(null); // null | 'saving' | 'saved' | 'error'
```

---

## Google Sheets Integration

### Setup:
1. Create a Google Sheet with headers: `Timestamp | Gender | Age | Country | Profession | Humour | Prospect Snippet | Generated Message`
2. Enable Google Sheets API in Google Cloud Console
3. Create an API key (restricted to Sheets API)
4. Store as `VITE_GOOGLE_SHEETS_API_KEY` and `VITE_SHEET_ID` in `.env`

### Why this integration is meaningful (not decorative):
- Every message generated is logged with full context
- Creates a persistent history of outreach messages
- Sales teams could use this log to analyse what inputs produce the best messages
- The "View log" button links directly to the Sheet so judges can see real data

### `services/sheets.js` responsibilities:
- `appendToSheet(rowData)` — appends one row to the Sheet
- `getSheetUrl()` — returns the public Sheet URL for the "View log" link
- Handles auth errors gracefully with a user-visible non-blocking warning

---

## Security Rules (non-negotiable)

1. `.env` is in `.gitignore` before the first commit — verified every push
2. `.env.example` contains only placeholder strings — safe to commit
3. All API keys accessed only via `import.meta.env.VITE_*` — never hardcoded
4. All user input sanitized in `validators.js` before being included in prompts
5. `max_tokens` set to minimum viable value — never wasteful defaults
6. Submit button disabled during in-flight requests — prevents duplicate API calls
7. AbortController cancels previous request on new submission

---

## README Must Contain

```
# OutreachAI — Message Personalizer

## What it does
Generates hyper-personalized cold sales outreach messages using AI.
Paste prospect info, select demographics, optionally add humour — get a message
that sounds like a human wrote it for that specific person.

## Features
- Prospect info free text input
- Demographic context selectors (gender, age, country, profession, marital status)
- Humour toggle for meme-style opening hooks
- Google Sheets logging of all generated messages

## Run locally
1. Clone the repo
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your API keys
4. Run `npm run dev`

## Environment variables
VITE_GEMINI_API_KEY=        # Google AI Studio → API Keys
VITE_GOOGLE_SHEETS_API_KEY= # Google Cloud Console → Credentials
VITE_SHEET_ID=              # From your Google Sheet URL

## Run tests
npm run test

## Tech stack
React 18 + Vite, Tailwind CSS, Google Gemini API, Google Sheets API v4, Vitest
```

---

## Day-by-Day Build Plan

### Day 1 — Foundation and prompts
- [ ] Init Vite + React project, install Tailwind, Vitest, ESLint, Prettier
- [ ] Create full file structure (all folders and empty files)
- [ ] Write `.gitignore`, `.env.example`
- [ ] Write and iterate `prompts/index.js` — test prompts manually via curl or Postman
- [ ] Write `utils/validators.js` with full input validation
- [ ] Write `utils/parseResponse.js`
- [ ] Write tests for all utils (validators, prompts, parseResponse)
- [ ] All Day 1 tests must pass before Day 2

### Day 2 — Services, components, wiring
- [ ] Write `services/gemini.js` with AbortController
- [ ] Write `services/sheets.js` with Google Sheets append
- [ ] Build all components: InputForm, DemographicSelectors, HumourToggle, OutputCard, ErrorMessage, LoadingSpinner
- [ ] Apply full accessibility: labels, roles, aria attributes, semantic HTML
- [ ] Wire everything in `features/personalizer/index.jsx`
- [ ] Manual test: full happy path, error path, humour on/off, sheets save
- [ ] Write `sheets.test.js` with mocked fetch

### Day 3 — Polish, README, submission
- [ ] Fix all rough edges from Day 2 testing
- [ ] Run all tests — all must pass
- [ ] Write README.md completely
- [ ] Run ESLint — fix all warnings
- [ ] Final security check: `git grep -i "api_key"` must return only .env.example
- [ ] Check repo size on GitHub — must be under 10MB
- [ ] Verify single branch (main only)
- [ ] Submit on Hack2skill portal