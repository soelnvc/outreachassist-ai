import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PersonalizerPage } from './features/personalizer/index.jsx';
import { HistoryPage } from './features/history/index.jsx';
import { SettingsPage } from './features/settings/index.jsx';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PersonalizerPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
