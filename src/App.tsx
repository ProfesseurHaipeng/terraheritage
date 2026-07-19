import { Routes, Route } from 'react-router';
import { LocaleProvider } from '@/lib/i18n';
import Home from './pages/Home';
import About from './pages/About';

export default function App() {
  return (
    <LocaleProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </LocaleProvider>
  );
}
