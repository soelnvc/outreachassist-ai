import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PersonalizerPage } from './features/personalizer/index.jsx';
import { HistoryPage } from './features/history/index.jsx';
import { SettingsPage } from './features/settings/index.jsx';
import { GuidePage } from './features/guide/index.jsx';
import { PrivacyPage } from './features/privacy/index.jsx';
import { TermsPage } from './features/terms/index.jsx';
import { TOSGuard } from './components/TOSGuard.jsx';

/**
 * The main application component that sets up routing and the Terms of Service guard.
 *
 * @returns {JSX.Element}
 */
export function App() {
  return (
    <BrowserRouter>
      <TOSGuard>
        <Routes>
          <Route path="/" element={<PersonalizerPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </TOSGuard>
    </BrowserRouter>
  );
}
