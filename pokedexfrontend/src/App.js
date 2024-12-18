import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import darkTheme from './themes/darkTheme';
import lightTheme from './themes/lightTheme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PokemonDetail from './pages/PokemonDetail';
import AbilityDetail from './pages/AbilityDetail';
import ComparePokemon from './pages/ComparePokemon';
import './i18n';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { t } = useTranslation();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const textColor = darkMode ? '#fff' : '#000';

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Navbar toggleTheme={toggleTheme} darkMode={darkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/ability/:id" element={<AbilityDetail />} />
          <Route path="/compare/:id1/:id2" element={<ComparePokemon />} />
        </Routes>
        <div
          style={{
            position: 'static',
            bottom: '10px',
            right: '10px',
            fontSize: '14px',
            color: textColor,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          {t('createdBy')}
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
