import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import PokemonCard from '../components/PokemonCard';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Select,
  MenuItem,
  Typography,
  useTheme,
  Button,
  Drawer,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [pokemonList, setPokemonList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);

  const [comparePokemon1, setComparePokemon1] = useState('');
  const [comparePokemon2, setComparePokemon2] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchPokemonList = async () => {
    try {
      const response = await axios.get('http://localhost:5145/api/pokemon/all/details');
      setPokemonList(response.data);
      setHasMore(false);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const fetchPokemonByType = async (type) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5145/api/pokemon/filter/type/${type}`);
      setPokemonList(response.data);
    } catch (error) {
      console.error('Error fetching Pokémon by type:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonList();
  }, []);

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
    if (type) {
      fetchPokemonByType(type);
    } else {
      fetchPokemonList();
    }
  };

  const handleCompareClick = () => {
    if (comparePokemon1 && comparePokemon2) {
      navigate(`/compare/${comparePokemon1}/${comparePokemon2}`);
    } else {
      alert(t('selectTwoPokemon'));
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        margin="20px"
        padding="0 20px"
      >
        <Button
          variant="contained"
          onClick={() => setIsDrawerOpen(true)}
          style={{
            backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#fff',
            color: theme.palette.mode === 'dark' ? '#fff' : '#000',
            fontWeight: 'bold',
            boxShadow: theme.shadows[2],
          }}
        >
          {t('comparePokemon')}
        </Button>

        <Box display="flex" alignItems="center" gap="10px">
          <Typography
            variant="h6"
            style={{
              marginRight: '10px',
              color: theme.palette.text.primary,
              fontWeight: 'bold',
            }}
          >
            {t('filterByType')}:
          </Typography>
          <Select
            value={selectedType}
            onChange={handleTypeChange}
            displayEmpty
            style={{
              minWidth: 150,
              height: 40,
              backgroundColor: theme.palette.background.paper,
              borderRadius: theme.shape.borderRadius,
              color: theme.palette.text.primary,
              boxShadow: theme.shadows[2],
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: theme.palette.background.paper,
                },
              },
            }}
          >
            <MenuItem value="">
              <em>{t('all')}</em>
            </MenuItem>
            <MenuItem value="grass">{t('grass')}</MenuItem>
            <MenuItem value="fire">{t('fire')}</MenuItem>
            <MenuItem value="water">{t('water')}</MenuItem>
            <MenuItem value="bug">{t('bug')}</MenuItem>
            <MenuItem value="electric">{t('electric')}</MenuItem>
            <MenuItem value="poison">{t('poison')}</MenuItem>
            <MenuItem value="rock">{t('rock')}</MenuItem>
            <MenuItem value="ghost">{t('ghost')}</MenuItem>
            <MenuItem value="steel">{t('steel')}</MenuItem>
            <MenuItem value="dragon">{t('dragon')}</MenuItem>
            <MenuItem value="dark">{t('dark')}</MenuItem>
          </Select>
        </Box>
      </Box>

      <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box
          width="300px"
          padding="20px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          style={{
            backgroundColor: theme.palette.background.default,
            height: '100%',
          }}
        >
          <Typography
            variant="h6"
            style={{
              marginBottom: '20px',
              fontWeight: 'bold',
              color: theme.palette.text.primary,
            }}
          >
            {t('comparePokemon')}
          </Typography>
          <FormControl fullWidth style={{ marginBottom: '20px' }}>
            <InputLabel>{t('selectFirstPokemon')}</InputLabel>
            <Select
              value={comparePokemon1}
              onChange={(e) => setComparePokemon1(e.target.value)}
            >
              {pokemonList.map((pokemon) => (
                <MenuItem key={pokemon.id} value={pokemon.id}>
                  {pokemon.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth style={{ marginBottom: '20px' }}>
            <InputLabel>{t('selectSecondPokemon')}</InputLabel>
            <Select
              value={comparePokemon2}
              onChange={(e) => setComparePokemon2(e.target.value)}
            >
              {pokemonList.map((pokemon) => (
                <MenuItem key={pokemon.id} value={pokemon.id}>
                  {pokemon.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={handleCompareClick}
            disabled={!comparePokemon1 || !comparePokemon2}
            style={{
              backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#fff',
              color: theme.palette.mode === 'dark' ? '#fff' : '#000',
            }}
          >
            {t('compare')}
          </Button>
        </Box>
      </Drawer>

      <InfiniteScroll
        dataLength={pokemonList.length}
        next={fetchPokemonList}
        hasMore={hasMore}
        loader={<h4>{t('loading')}...</h4>}
      >
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap="20px">
          {loading ? (
            <Typography>{t('loading')}</Typography>
          ) : (
            pokemonList.map((pokemon) => <PokemonCard key={pokemon.id} pokemon={pokemon} />)
          )}
        </Box>
      </InfiniteScroll>
    </Box>
  );
};

export default Home;
