import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import PlayerPage from './pages/PlayerPage.jsx';
import MobilePage from './pages/MobilePage.jsx';
import RulesPage from './pages/RulesPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="/mobile" element={<MobilePage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
