import React, { useState, Suspense, lazy } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import darkTheme from './themes/darkTheme';
import lightTheme from './themes/lightTheme';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import './i18n';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const PokemonDetail = lazy(() => import('./pages/PokemonDetail'));
const AbilityDetail = lazy(() => import('./pages/AbilityDetail'));
const ComparePokemon = lazy(() => import('./pages/ComparePokemon'));

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar toggleTheme={toggleTheme} darkMode={darkMode} />
        <Suspense fallback={<Loading size={60} disableShrink={true} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
            <Route path="/ability/:id" element={<AbilityDetail />} />
            <Route path="/compare/:id1/:id2" element={<ComparePokemon />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
