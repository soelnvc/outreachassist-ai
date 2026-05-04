# OutreachAI — Message Personalizer

## What it does
Generates hyper-personalized cold sales outreach messages using AI.
Paste prospect info, select demographics, optionally add humour — get a message
that sounds like a human wrote it for that specific person.

## Features
- Prospect info free text input
- Demographic context selectors (gender, age, country, profession, marital status)
- Humour toggle for meme-style opening hooks
- Google Sheets logging of all generated messages (for team review, CRM syncing, and performance tracking)

## Run locally
1. Clone the repo
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your API keys
4. Run `npm run dev`

## Environment variables
```
VITE_GEMINI_API_KEY=        # Google AI Studio → API Keys
VITE_GOOGLE_SHEETS_API_KEY= # Google Cloud Console → Credentials
VITE_SHEET_ID=              # From your Google Sheet URL
```

## Google Sheets setup
1. Create a new Google Sheet
2. Add headers in row 1: Timestamp | Gender | Age Range | Country | Profession | Marital Status | Humour | Prospect Snippet | Generated Message
3. Go to Google Cloud Console → Create a project → Enable Google Sheets API
4. Go to Credentials → Create API Key → Restrict to Sheets API
5. Copy the Sheet ID from the URL: docs.google.com/spreadsheets/d/[SHEET_ID]/edit
6. Add VITE_GOOGLE_SHEETS_API_KEY and VITE_SHEET_ID to your .env file

## Run tests
```
npm run test
```

## Tech stack
React 18 + Vite, Tailwind CSS, Google Gemini API, Google Sheets API v4, Vitest
