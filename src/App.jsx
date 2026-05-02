import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PersonalizerPage } from './features/personalizer/index.jsx';
import { HistoryPage } from './features/history/index.jsx';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PersonalizerPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
