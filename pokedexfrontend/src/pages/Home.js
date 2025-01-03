import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
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
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PokemonCard = lazy(() => import('../components/PokemonCard'));
const Loading = lazy(() => import('../components/Loading'));

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

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('');

  const [page, setPage] = useState(1);
  const limit = 20;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchPokemonList = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/pokemon/paged?page=${page}&limit=${limit}`);
      console.log('API Response:', response.data);
      const { data, hasMore } = response.data;

      if (!Array.isArray(data)) {
        throw new Error(t('error.dataNotArray'));
      }

      setPokemonList((prev) => {
        const existingIds = new Set(prev.map(p => p.id));
        const newPokemon = data.filter(p => !existingIds.has(p.id));
        return [...prev, ...newPokemon];
      });
      setHasMore(hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('API Error:', error);
      setSnackbarMessage(t('error.dataLoad'));
      setSnackbarOpen(true);
    }
  }, [API_BASE_URL, page, limit, t]);

  const fetchPokemonByType = useCallback(async (type) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/pokemon/filter/type/${type}`);
      const { data } = response.data;

      if (!Array.isArray(data)) {
        throw new Error(t('error.dataNotArray'));
      }

      setPokemonList(data);
      setHasMore(false);
    } catch (error) {
      console.error('Error fetching Pokémon by type:', error);
      setSnackbarMessage(t('error.typeFilter'));
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, t]);

  const fetchPokemonByRegion = useCallback(async (region) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/pokemon/filter/region/${region}`);
      const { data } = response.data;

      if (!Array.isArray(data)) {
        throw new Error(t('error.dataNotArray'));
      }

      setPokemonList(data);
      setHasMore(false);
    } catch (error) {
      console.error('Error fetching Pokémon by region:', error);
      setSnackbarMessage(t('error.regionFilter'));
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, t]);

  const fetchPokemonByGeneration = useCallback(async (generation) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/pokemon/filter/generation/${generation}`);
      const { data } = response.data;

      if (!Array.isArray(data)) {
        throw new Error(t('error.dataNotArray'));
      }

      setPokemonList(data);
      setHasMore(false);
    } catch (error) {
      console.error('Error fetching Pokémon by generation:', error);
      setSnackbarMessage(t('error.generationFilter'));
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, t]);

  useEffect(() => {
    fetchPokemonList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generationMapping = {
    i: 1,
    ii: 2,
    iii: 3,
    iv: 4,
    v: 5,
    vi: 6,
    vii: 7,
    viii: 8,
    ix: 9,
  };

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);
    setPokemonList([]);
    setPage(1);
    setHasMore(true);
    if (region) {
      fetchPokemonByRegion(region);
    } else {
      fetchPokemonList();
    }
  };

  const handleGenerationChange = (event) => {
    const generation = event.target.value;
    setSelectedGeneration(generation);
    setPokemonList([]);
    setPage(1);
    setHasMore(true);
    if (generation) {
      const generationNumber = generationMapping[generation];
      fetchPokemonByGeneration(generationNumber);
    } else {
      fetchPokemonList();
    }
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
    setPokemonList([]);
    setPage(1);
    setHasMore(true);
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
      setSnackbarMessage(t('error.compareSelection'));
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
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

        <Box display="flex" alignItems="center" gap="10px">
          <Typography
            variant="h6"
            style={{
              color: theme.palette.text.primary,
              fontWeight: 'bold',
            }}
          >
            {t('filterByRegion')}:
          </Typography>
          <Select
            value={selectedRegion}
            onChange={handleRegionChange}
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
            <MenuItem value="kanto">{t('kanto')}</MenuItem>
            <MenuItem value="johto">{t('johto')}</MenuItem>
            <MenuItem value="hoenn">{t('hoenn')}</MenuItem>
            <MenuItem value="sinnoh">{t('sinnoh')}</MenuItem>
            <MenuItem value="unova">{t('unova')}</MenuItem>
            <MenuItem value="kalos">{t('kalos')}</MenuItem>
            <MenuItem value="alola">{t('alola')}</MenuItem>
            <MenuItem value="galar">{t('galar')}</MenuItem>
            <MenuItem value="paldea">{t('paldea')}</MenuItem>
          </Select>
        </Box>

        <Box display="flex" alignItems="center" gap="10px">
          <Typography
            variant="h6"
            style={{
              color: theme.palette.text.primary,
              fontWeight: 'bold',
            }}
          >
            {t('filterByGeneration')}:
          </Typography>
          <Select
            value={selectedGeneration}
            onChange={handleGenerationChange}
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
            <MenuItem value="i">{t('generation1')}</MenuItem>
            <MenuItem value="ii">{t('generation2')}</MenuItem>
            <MenuItem value="iii">{t('generation3')}</MenuItem>
            <MenuItem value="iv">{t('generation4')}</MenuItem>
            <MenuItem value="v">{t('generation5')}</MenuItem>
            <MenuItem value="vi">{t('generation6')}</MenuItem>
            <MenuItem value="vii">{t('generation7')}</MenuItem>
            <MenuItem value="viii">{t('generation8')}</MenuItem>
            <MenuItem value="ix">{t('generation9')}</MenuItem>
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
                <MenuItem key={`${pokemon.id}-${pokemon.name}`} value={pokemon.id}>
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
                <MenuItem key={`${pokemon.id}-${pokemon.name}`} value={pokemon.id}>
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <InfiniteScroll
        dataLength={pokemonList.length}
        next={fetchPokemonList}
        hasMore={hasMore}
        loader={
          <Suspense fallback={<div>{t('loading')}...</div>}>
            <Loading />
          </Suspense>
        }
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>{t('allPokemonLoaded')}</b>
          </p>
        }
      >
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap="20px">
          {loading && (
            <Typography>{t('loading')}</Typography>
          )}
          <Suspense fallback={<div>{t('loading')}...</div>}>
            {pokemonList.map((pokemon) => (
              <PokemonCard key={`${pokemon.id}-${pokemon.name}`} pokemon={pokemon} />
            ))}
          </Suspense>
        </Box>
      </InfiniteScroll>
    </Box>
  );
};

export default Home;
