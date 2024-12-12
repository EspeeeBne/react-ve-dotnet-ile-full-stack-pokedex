import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, IconButton, Typography, Box, InputBase, Paper } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
      console.error('Error searching Pokemon:', error);
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
              backgroundColor: '#7038F8',
              padding: '5px 10px',
              borderRadius: '5px',
              marginRight: '20px',
            }}
          />
          <IconButton onClick={handleSearch} color="inherit">
            🔍
          </IconButton>

          {searchQuery && searchResults.length > 0 && (
            <Paper style={{ position: 'absolute', top: '35px', width: '200px', zIndex: 1000 }}>
              <Box>
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    to={`/pokemon/${result.id}`}
                    style={{ textDecoration: 'none', color: 'black' }}
                  >
                    <Box
                      style={{
                        padding: '10px',
                        borderBottom: '1px solid #ccc',
                        backgroundColor: 'lightgray',
                        cursor: 'pointer',
                      }}
                    >
                      <Typography variant="body2" style={{ textTransform: 'capitalize' }}>
                        {result.name}
                      </Typography>
                    </Box>
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
