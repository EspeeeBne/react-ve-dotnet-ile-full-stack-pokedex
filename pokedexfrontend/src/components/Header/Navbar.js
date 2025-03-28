import React, { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  InputBase,
  Card,
  CardContent,
  Modal,
  Button,
  MenuItem,
  Select,
  CircularProgress,
  Paper,
  useMediaQuery,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
import SearchIcon from '@mui/icons-material/Search';
import TranslateIcon from '@mui/icons-material/Translate';
import CloseIcon from '@mui/icons-material/Close';

import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useThemePoke } from "../../themes/themeProvider";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const typeColors = {
  grass: '#78C850',
  fire: '#F08030',
  water: '#6890F0',
  poison: '#A040A0',
  electric: '#F8D030',
  bug: '#A8B820',
  normal: '#A8A878',
  fairy: '#EE99AC',
  ground: '#E0C068',
  fighting: '#C03028',
  psychic: '#F85888',
  rock: '#B8A038',
  ghost: '#705898',
  steel: '#B8B8D0',
  dragon: '#7038F8',
  dark: '#705848',
  ice: '#98D8D8',
};

const searchContainerVariants = {
  initial: { width: '200px' },
  expanded: { width: '300px' },
};

export default function Navbar() {
  const { toggleTheme, darkMode } = useThemePoke();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [isFocused, setIsFocused] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const debouncedSearchRef = useRef(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setError(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/api/pokemon/search/${query}`);
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setSearchResults(data);
      } catch (err) {
        setError(t('searchError'));
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 500)
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearchRef.current(query);
  };

  const handleSearch = () => {
    debouncedSearchRef.current.cancel();
    debouncedSearchRef.current(searchQuery);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguageModalOpen(false);
  };

  useEffect(() => {
    setSearchResults([]);
    setSearchQuery('');
    setError(null);
  }, [location.pathname]);

  useEffect(() => {
    const currentDebounced = debouncedSearchRef.current;
    return () => {
      currentDebounced.cancel();
    };
  }, []);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          boxShadow: 3,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? theme.palette.background.default
              : theme.palette.background.default,
          transition: 'background-color 0.5s ease, color 0.5s ease',
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingX: { xs: 1, sm: 2 },
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {isMobile && (
              <IconButton
                sx={{ color: theme.palette.text.primary }}
                onClick={handleMobileMenuToggle}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Link to="/" style={{ textDecoration: 'none' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <img
                  src="/favicon.ico"
                  alt="Logo"
                  style={{ width: 28, height: 28 }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.text.primary,
                  }}
                >
                  {t('pokemonApp')}
                </Typography>
              </Box>
            </Link>
          </Box>

          {!isMobile && (
            <motion.div
              variants={searchContainerVariants}
              initial="initial"
              animate={isFocused ? 'expanded' : 'initial'}
              transition={{ duration: 0.3 }}
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            >
              <InputBase
                placeholder={t('search')}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                aria-label={t('searchAriaLabel')}
                sx={{
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  padding: '5px 10px',
                  borderRadius: 1,
                  marginRight: 1,
                  width: '100%',
                  '&::placeholder': {
                    color: theme.palette.text.primary,
                    opacity: 0.7,
                  },
                }}
              />
              <IconButton
                onClick={handleSearch}
                sx={{ color: theme.palette.text.primary }}
                aria-label={t('searchButtonAriaLabel')}
              >
                <SearchIcon />
              </IconButton>

              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: '50px',
                      left: 0,
                      width: '100%',
                      padding: '10px',
                      zIndex: 1000,
                      borderRadius: '10px',
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.mode === 'dark' ? 'white' : 'black',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress size={24} color="inherit" />
                    <Typography variant="body2" sx={{ marginLeft: 1 }}>
                      {t('loading')}
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: '50px',
                      left: 0,
                      width: '100%',
                      padding: '10px',
                      zIndex: 1000,
                      borderRadius: '10px',
                      backgroundColor: theme.palette.error.main,
                      color: 'white',
                    }}
                  >
                    <Typography variant="body2">{error}</Typography>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {searchQuery && searchResults.length > 0 && !loading && !error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      top: '60px',
                      left: 0,
                      width: '100%',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      zIndex: 1000,
                      borderRadius: '10px',
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <Paper elevation={3}>
                      <Box>
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            to={`/pokemon/${result.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                            onClick={() => {
                              setSearchResults([]);
                              setSearchQuery('');
                            }}
                          >
                            <motion.div
                              whileHover={{
                                scale: 1.02,
                                boxShadow: '0px 4px 20px rgba(0,0,0,0.2)',
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  margin: '5px',
                                  backgroundColor:
                                    typeColors[result.types?.[0]] ||
                                    theme.palette.background.paper,
                                  color: theme.palette.text.primary,
                                  cursor: 'pointer',
                                }}
                              >
                                <img
                                  src={result.imageUrl}
                                  alt={result.name}
                                  style={{
                                    width: '50px',
                                    height: '50px',
                                    margin: '5px',
                                    borderRadius: '50%',
                                    backgroundColor: 'theme.palette.background.default',
                                  }}
                                />
                                <CardContent sx={{ flex: '1 1 auto' }}>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontWeight: 'bold',
                                      textTransform: 'capitalize',
                                      textAlign: 'center',
                                    }}
                                  >
                                    {result.name}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Link>
                        ))}
                      </Box>
                    </Paper>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {!isMobile && (
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton
                onClick={toggleTheme}
                sx={{ color: theme.palette.text.primary }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {darkMode ? (
                    <motion.div
                      key="light"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <WbSunnyIcon />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="dark"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <NightlightIcon />
                    </motion.div>
                  )}
                </AnimatePresence>
              </IconButton>

              <Button
                onClick={() => setLanguageModalOpen(true)}
                startIcon={<TranslateIcon />}
                variant="outlined"
                sx={{
                  color: theme.palette.text.primary,
                  textTransform: 'none',
                  borderColor: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    borderColor: theme.palette.text.primary,
                  },
                }}
              >
                {t('changeLanguage')}
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Modal
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backdropFilter: 'blur(3px)',
        }}
      >
        <Box
          sx={{
            width: '80vw',
            maxWidth: 300,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: 5,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            position: 'relative',
          }}
        >
          <IconButton
            onClick={handleMobileMenuToggle}
            sx={{ position: 'absolute', top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>

          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              onClick={toggleTheme}
              sx={{ color: theme.palette.text.primary }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {darkMode ? (
                  <motion.div
                    key="light-mobile"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <WbSunnyIcon />
                  </motion.div>
                ) : (
                  <motion.div
                    key="dark-mobile"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NightlightIcon />
                  </motion.div>
                )}
              </AnimatePresence>
            </IconButton>
            <Button
              onClick={() => {
                setLanguageModalOpen(true);
                setMobileMenuOpen(false);
              }}
              startIcon={<TranslateIcon />}
              variant="outlined"
              sx={{
                color: theme.palette.text.primary,
                textTransform: 'none',
                borderColor: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  borderColor: theme.palette.text.primary,
                },
              }}
            >
              {t('changeLanguage')}
            </Button>
          </Box>

          <Box>
            <motion.div
              variants={searchContainerVariants}
              initial="initial"
              animate={isFocused ? 'expanded' : 'initial'}
              transition={{ duration: 0.3 }}
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            >
              <InputBase
                placeholder={t('search')}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                aria-label={t('searchAriaLabel')}
                sx={{
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  padding: '5px 10px',
                  borderRadius: 1,
                  marginRight: 1,
                  width: '100%',
                  '&::placeholder': {
                    color: theme.palette.text.primary,
                    opacity: 0.7,
                  },
                }}
              />
              <IconButton
                onClick={handleSearch}
                sx={{ color: theme.palette.text.primary }}
                aria-label={t('searchButtonAriaLabel')}
              >
                <SearchIcon />
              </IconButton>

              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: '50px',
                      left: 0,
                      width: '100%',
                      padding: '10px',
                      zIndex: 1000,
                      borderRadius: '10px',
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.mode === 'dark' ? 'white' : 'black',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress size={24} color="inherit" />
                    <Typography variant="body2" sx={{ marginLeft: 1 }}>
                      {t('loading')}
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: '50px',
                      left: 0,
                      width: '100%',
                      padding: '10px',
                      zIndex: 1000,
                      borderRadius: '10px',
                      backgroundColor: theme.palette.error.main,
                      color: 'white',
                    }}
                  >
                    <Typography variant="body2">{error}</Typography>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {searchQuery && searchResults.length > 0 && !loading && !error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      top: '60px',
                      left: 0,
                      width: '100%',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      zIndex: 1000,
                      borderRadius: '10px',
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <Paper elevation={3}>
                      <Box>
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            to={`/pokemon/${result.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                            onClick={() => {
                              setSearchResults([]);
                              setSearchQuery('');
                              setMobileMenuOpen(false);
                            }}
                          >
                            <motion.div
                              whileHover={{
                                scale: 1.02,
                                boxShadow: '0px 4px 20px rgba(0,0,0,0.2)',
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  margin: '5px',
                                  backgroundColor:
                                    typeColors[result.types?.[0]] ||
                                    theme.palette.background.paper,
                                  color: theme.palette.text.primary,
                                  cursor: 'pointer',
                                }}
                              >
                                <img
                                  src={result.imageUrl}
                                  alt={result.name}
                                  style={{
                                    width: '50px',
                                    height: '50px',
                                    margin: '5px',
                                    borderRadius: '50%',
                                    backgroundColor: '#f3f3f3',
                                  }}
                                />
                                <CardContent sx={{ flex: '1 1 auto' }}>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontWeight: 'bold',
                                      textTransform: 'capitalize',
                                      textAlign: 'center',
                                    }}
                                  >
                                    {result.name}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Link>
                        ))}
                      </Box>
                    </Paper>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            padding: 3,
            borderRadius: 1,
            boxShadow: 24,
            width: 300,
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={() => setLanguageModalOpen(false)}
            sx={{ position: 'absolute', top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
            {t('selectLanguage')}
          </Typography>
          <Select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="tr">
              <Box display="flex" alignItems="center">
                <img
                  src="https://flagcdn.com/w40/tr.png"
                  alt="TR"
                  style={{ marginRight: '10px' }}
                />
                Türkçe
              </Box>
            </MenuItem>
            <MenuItem value="en">
              <Box display="flex" alignItems="center">
                <img
                  src="https://flagcdn.com/w40/us.png"
                  alt="EN"
                  style={{ marginRight: '10px' }}
                />
                English
              </Box>
            </MenuItem>
          </Select>
        </Box>
      </Modal>
    </>
  );
}
