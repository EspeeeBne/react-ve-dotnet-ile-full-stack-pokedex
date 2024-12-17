import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
};

const Navbar = ({ toggleTheme, darkMode }) => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5145/api/pokemon/search/${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching Pokémon:', error);
    }
  };

  return (
    <AppBar position="sticky" color="primary" sx={{ padding: '10px 20px' }}>
      <Toolbar style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Typography variant="h6" style={{ fontWeight: 'bold', color: 'white' }}>
            {t('pokemonApp')}
          </Typography>
        </Link>

        <Box display="flex" alignItems="center" style={{ position: 'relative' }}>
          <InputBase
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              backgroundColor: darkMode ? '#555' : '#ddd',
              padding: '5px 10px',
              borderRadius: '10px',
              marginRight: '20px',
              color: darkMode ? 'white' : 'black',
            }}
          />
          <IconButton onClick={handleSearch} color="inherit">
            🔍
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
          <IconButton onClick={toggleTheme} color="inherit">
            {darkMode ? <WbSunnyIcon /> : <NightlightIcon />}
          </IconButton>

          <IconButton onClick={() => changeLanguage('tr')} color="inherit">
            <img
              src="https://flagcdn.com/w40/tr.png"
              alt="TR"
              style={{ width: 20, height: 15 }}
            />
          </IconButton>
          <IconButton onClick={() => changeLanguage('en')} color="inherit">
            <img
              src="https://flagcdn.com/w40/us.png"
              alt="EN"
              style={{ width: 20, height: 15 }}
            />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
