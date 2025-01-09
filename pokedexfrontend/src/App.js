import React, { useState, Suspense, lazy, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import darkTheme from './themes/darkTheme';
import lightTheme from './themes/lightTheme';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';
import InitialLoading from './components/InitialLoading';

import SiteStatusContext from './contexts/SiteStatusContext';

import './i18n';

const Home = lazy(() => import('./pages/Home'));
const PokemonDetail = lazy(() => import('./pages/PokemonDetail'));
const AbilityDetail = lazy(() => import('./pages/AbilityDetail'));
const ComparePokemon = lazy(() => import('./pages/ComparePokemon'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => setDarkMode(!darkMode);

  const [siteStatus] = useContext(SiteStatusContext);

  if (siteStatus.loading) {
    return (
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <InitialLoading error={false} />
      </ThemeProvider>
    );
  }

  if (!siteStatus.status) {
    return (
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <InitialLoading error={true} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar
          toggleTheme={toggleTheme}
          darkMode={darkMode}
        />
        <Suspense fallback={<Loading size={60} disableShrink={true} />}>
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/pokemon/:id"
              element={<PokemonDetail />}
            />
            <Route
              path="/ability/:id"
              element={<AbilityDetail />}
            />
            <Route
              path="/compare/:id1/:id2"
              element={<ComparePokemon />}
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
