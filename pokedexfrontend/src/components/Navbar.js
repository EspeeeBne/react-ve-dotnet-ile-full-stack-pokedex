import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  InputBase,
  Paper,
  Card,
  CardContent,
  Modal,
  Button,
  MenuItem,
  Select,
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
import SearchIcon from '@mui/icons-material/Search';
import TranslateIcon from '@mui/icons-material/Translate';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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

const Navbar = ({ toggleTheme, darkMode }) => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/pokemon/search/${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching Pokémon:', error);
    }
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguageModalOpen(false);
  };

  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
              {t('pokemonApp')}
            </Typography>
          </Link>

          <Box display="flex" alignItems="center" sx={{ position: 'relative' }}>
            <InputBase
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              sx={{
                backgroundColor: (theme) => theme.palette.background.default,
                color: (theme) => theme.palette.text.primary,
                padding: '5px 10px',
                borderRadius: 1,
                marginRight: 2,
              }}
            />
            <IconButton onClick={handleSearch} sx={{ color: 'white' }}>
              <SearchIcon />
            </IconButton>

            {searchQuery && searchResults.length > 0 && (
              <Paper
                style={{
                  position: 'absolute',
                  top: '40px',
                  left: 0,
                  width: '300px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  borderRadius: '10px',
                }}
              >
                <Box>
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      to={`/pokemon/${result.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Card
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          margin: '5px',
                          backgroundColor: typeColors[result.types?.[0]] || '#fff',
                          color: darkMode ? 'white' : 'black',
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
                        <CardContent style={{ flex: '1 1 auto' }}>
                          <Typography
                            variant="body1"
                            style={{
                              fontWeight: 'bold',
                              textTransform: 'capitalize',
                              textAlign: 'center',
                            }}
                          >
                            {result.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </Box>
              </Paper>
            )}
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={toggleTheme} sx={{ color: 'white' }}>
              {darkMode ? <WbSunnyIcon /> : <NightlightIcon />}
            </IconButton>

            <Button
              onClick={() => setLanguageModalOpen(true)}
              startIcon={<TranslateIcon />}
              sx={{
                color: 'white',
                textTransform: 'none',
                backgroundColor: (theme) => theme.palette.action.hover,
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.action.selected,
                },
              }}
            >
              {t('changeLanguage')}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

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
            backgroundColor: (theme) => theme.palette.background.paper,
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
              <img src="https://flagcdn.com/w40/tr.png" alt="TR" style={{ marginRight: '10px' }} />
              Türkçe
            </MenuItem>
            <MenuItem value="en">
              <img src="https://flagcdn.com/w40/us.png" alt="EN" style={{ marginRight: '10px' }} />
              English
            </MenuItem>
          </Select>
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;
