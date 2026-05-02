import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PersonalizerPage } from './features/personalizer/index.jsx';
import { HistoryPage } from './features/history/index.jsx';
import { SettingsPage } from './features/settings/index.jsx';
import { GuidePage } from './features/guide/index.jsx';
import { PrivacyPage } from './features/privacy/index.jsx';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PersonalizerPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </BrowserRouter>
  );
}
