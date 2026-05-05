# 🌌 OutreachAI Sales Copilot

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Status" />
  <img src="https://img.shields.io/badge/Powered%20By-Gemini%201.5%20Pro-blueviolet?style=for-the-badge&logo=google-gemini&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Framework-React%20+%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Database-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
</p>

---

## 🎭 The Pitch
**OutreachAI** is a premium, AI-driven B2B sales copilot designed to transform cold outreach into warm conversations. Built for modern sales teams, it leverages the power of **Google Gemini 1.5 Pro** to generate hyper-personalized, human-first messages that cut through the noise of crowded inboxes.

> "Don't just reach out. Stand out."

---

## ✨ Key Features

- **🧠 Context-Aware Generation**: Analyzes prospect info, buyer persona, and company context to craft unique hooks.
- **🎭 Multi-Tone Personas**: Choose between Professional, Consultative, Direct, or Enthusiastic tones.
- **📊 Real-time Sheet Sync**: Automatically logs every successful outreach to your personal Google Sheet via a secure Apps Script bridge.
- **🛡️ Enterprise Security**: Secure Firebase Authentication and Firestore data isolation.
- **🎨 Glassmorphic UI**: A premium, "Obsidian & Lavender" aesthetic designed for focus and productivity.
- **⏳ History Management**: Automatically clears logs every 30 days to keep your workspace lean.

---

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Framer Motion |
| **Intelligence** | Google Gemini API (1.5 Pro) |
| **Backend/Auth** | Firebase Auth, Firestore |
| **Integration** | Google Sheets API v4 + Apps Script |
| **Styling** | Vanilla CSS (Custom Glassmorphism) |

---

## 📖 How to Use

### 1. The Workspace
This is your command center. 
*   **Target Info**: Enter the prospect's LinkedIn snippet or company info.
*   **Parameters**: Select the outreach channel (Email, LinkedIn, X) and desired tone.
*   **Generate**: Click "Generate" to see the AI magic.
*   **Refine**: Edit the message directly in the output card before saving.

### 2. Personal Integration
Go to the **Settings** page to connect your own Google Sheet.
*   **Spreadsheet Link**: Paste your Google Sheet URL to enable "View Logs."
*   **Bridge URL**: Deploy our custom Apps Script (see below) to enable "Save to Logs."

### 3. History & Logs
*   View your past generations in the **History** tab.
*   Click the **Database icon** in the sidebar to jump directly to your Google Sheet.

---

## 🔌 Google Sheets Setup (The Bridge)

To enable automatic logging, you must set up a simple "Bridge" script:

1.  Open your Google Sheet -> **Extensions** -> **Apps Script**.
2.  Paste the bridge code found in our [Integration Guide](src/services/sheets.js).
3.  Click **Deploy** -> **New Deployment** -> **Web App**.
4.  Set access to **"Anyone"** and copy the `/exec` URL.
5.  Paste this URL into your **OutreachAI Settings**.

---

## 🚀 Getting Started (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/your-repo/outreachassist-ai.git

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Gemini, Firebase, and Google Sheets keys

# 4. Launch development server
npm run dev
```

---

## 🛡️ Security & Privacy
OutreachAI is built with privacy at its core.
- **No Data Training**: Your prospect data is never used to train the AI models.
- **Local Control**: Your API keys are managed via environment variables and never exposed in the client-side code.
- **Data Isolation**: Firestore rules ensure you only ever see your own generation history.

---

<p align="center">
  Built with ❤️ for the sales community.
</p>
