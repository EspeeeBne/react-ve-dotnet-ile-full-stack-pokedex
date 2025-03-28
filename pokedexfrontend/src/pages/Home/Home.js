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
  Alert,
  Skeleton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PokemonCard = lazy(() => import('../../components/Pokemoncardstuff/PokemonCard'));
const Loading = lazy(() => import('../../components/Fallbackloading/Loading'));

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
      console.log(t('apiResponse'), response.data);
      const { data, hasMore } = response.data;

      if (!Array.isArray(data)) {
        throw new Error(t('error.dataNotArray'));
      }

      setPokemonList((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPokemon = data.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newPokemon];
      });
      setHasMore(hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error(t('error.dataLoad'), error);
      setSnackbarMessage(t('error.dataLoad'));
      setSnackbarOpen(true);
    }
  }, [API_BASE_URL, page, limit, t]);

  const fetchPokemonByType = useCallback(
    async (type) => {
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
        console.error(t('error.typeFilter'), error);
        setSnackbarMessage(t('error.typeFilter'));
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [API_BASE_URL, t]
  );

  const fetchPokemonByRegion = useCallback(
    async (region) => {
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
        console.error(t('error.regionFilter'), error);
        setSnackbarMessage(t('error.regionFilter'));
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [API_BASE_URL, t]
  );

  const fetchPokemonByGeneration = useCallback(
    async (generation) => {
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
        console.error(t('error.generationFilter'), error);
        setSnackbarMessage(t('error.generationFilter'));
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [API_BASE_URL, t]
  );

  useEffect(() => {
    fetchPokemonList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generationMapping = {
    i: 'generation-i',
    ii: 'generation-ii',
    iii: 'generation-iii',
    iv: 'generation-iv',
    v: 'generation-v',
    vi: 'generation-vi',
    vii: 'generation-vii',
    viii: 'generation-viii',
    ix: 'generation-ix',
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
    <Box
      sx={{
        transition: 'background-color 0.5s ease, color 0.5s ease',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: '100vh',
        paddingBottom: '20px',
      }}
    >
      <Box>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          padding="0 20px"
          gap={{ xs: '20px', sm: '10px' }}
          sx={{
            transition: 'background-color 0.5s ease, color 0.5s ease',
            backgroundColor: theme.palette.background.paper,
            borderRadius: '8px',
            boxShadow: theme.shadows[2],
            padding: '10px',
          }}
        >
          <Button
            variant="contained"
            onClick={() => setIsDrawerOpen(true)}
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              fontWeight: 'bold',
              boxShadow: theme.shadows[2],
              transition: 'background-color 0.3s ease, color 0.3s ease',
              border: `2px solid ${theme.palette.divider}`,
              '&:hover': {
                backgroundColor: theme.palette.background.paper,
              },
              padding: '8px 16px',
              fontSize: '1rem',
              borderRadius: '8px',
            }}
          >
            {t('comparePokemon')}
          </Button>

          <Box display="flex" alignItems="center" gap="8px">
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}
            >
              {t('filterByType')}:
            </Typography>
            <FormControl sx={{ minWidth: 120, height: 35 }}>
              <Select
                value={selectedType}
                onChange={handleTypeChange}
                displayEmpty
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '4px',
                  color: theme.palette.text.primary,
                  boxShadow: theme.shadows[2],
                  '& .MuiSelect-icon': { color: theme.palette.text.primary },
                  fontSize: '0.9rem',
                  height: '35px',
                  paddingY: '6px',
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      backgroundColor: theme.palette.background.paper,
                    },
                  },
                }}
                inputProps={{
                  'aria-label': t('filterByType'),
                }}
              >
                <MenuItem value="">
                  <em>{t('all')}</em>
                </MenuItem>
                <MenuItem value="grass" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('grass')}
                </MenuItem>
                <MenuItem value="fire" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('fire')}
                </MenuItem>
                <MenuItem value="water" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('water')}
                </MenuItem>
                <MenuItem value="bug" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('bug')}
                </MenuItem>
                <MenuItem value="electric" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('electric')}
                </MenuItem>
                <MenuItem value="poison" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('poison')}
                </MenuItem>
                <MenuItem value="rock" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('rock')}
                </MenuItem>
                <MenuItem value="ghost" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('ghost')}
                </MenuItem>
                <MenuItem value="steel" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('steel')}
                </MenuItem>
                <MenuItem value="dragon" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('dragon')}
                </MenuItem>
                <MenuItem value="dark" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('dark')}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" alignItems="center" gap="8px">
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}
            >
              {t('filterByRegion')}:
            </Typography>
            <FormControl sx={{ minWidth: 120, height: 35 }}>
              <Select
                value={selectedRegion}
                onChange={handleRegionChange}
                displayEmpty
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '4px',
                  color: theme.palette.text.primary,
                  boxShadow: theme.shadows[2],
                  '& .MuiSelect-icon': { color: theme.palette.text.primary },
                  fontSize: '0.9rem',
                  height: '35px',
                  paddingY: '6px',
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      backgroundColor: theme.palette.background.paper,
                    },
                  },
                }}
                inputProps={{
                  'aria-label': t('filterByRegion'),
                }}
              >
                <MenuItem value="">
                  <em>{t('all')}</em>
                </MenuItem>
                <MenuItem value="kanto" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('kanto')}
                </MenuItem>
                <MenuItem value="johto" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('johto')}
                </MenuItem>
                <MenuItem value="hoenn" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('hoenn')}
                </MenuItem>
                <MenuItem value="sinnoh" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('sinnoh')}
                </MenuItem>
                <MenuItem value="unova" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('unova')}
                </MenuItem>
                <MenuItem value="kalos" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('kalos')}
                </MenuItem>
                <MenuItem value="alola" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('alola')}
                </MenuItem>
                <MenuItem value="galar" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('galar')}
                </MenuItem>
                <MenuItem value="paldea" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('paldea')}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" alignItems="center" gap="8px">
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}
            >
              {t('filterByGeneration')}:
            </Typography>
            <FormControl sx={{ minWidth: 120, height: 35 }}>
              <Select
                value={selectedGeneration}
                onChange={handleGenerationChange}
                displayEmpty
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '4px',
                  color: theme.palette.text.primary,
                  boxShadow: theme.shadows[2],
                  '& .MuiSelect-icon': { color: theme.palette.text.primary },
                  fontSize: '0.9rem',
                  height: '35px',
                  paddingY: '6px',
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      backgroundColor: theme.palette.background.paper,
                    },
                  },
                }}
                inputProps={{
                  'aria-label': t('filterByGeneration'),
                }}
              >
                <MenuItem value="">
                  <em>{t('all')}</em>
                </MenuItem>
                <MenuItem value="i" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('generation1')}
                </MenuItem>
                <MenuItem value="ii" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('generation2')}
                </MenuItem>
                <MenuItem value="iii" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('generation3')}
                </MenuItem>
                <MenuItem value="iv" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('generation4')}
                </MenuItem>
                <MenuItem value="v" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('generation5')}
                </MenuItem>
                <MenuItem value="vi" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('generation6')}
                </MenuItem>
                <MenuItem value="vii" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('generation7')}
                </MenuItem>
                <MenuItem value="viii" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('generation8')}
                </MenuItem>
                <MenuItem value="ix" sx={{ paddingY: '6px', fontSize: '0.9rem' }}>
                  {t('generation9')}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '90vw', sm: '400px' },
            padding: '20px',
            backgroundColor: theme.palette.background.default,
            borderRadius: '8px',
            boxShadow: theme.shadows[5],
          },
        }}
        transitionDuration={500}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{
            height: '100%',
            transition: 'background-color 0.5s ease, color 0.5s ease',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: '20px',
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              fontSize: '1.2rem',
            }}
          >
            {t('comparePokemon')}
          </Typography>
          <FormControl fullWidth sx={{ marginBottom: '15px' }}>
            <InputLabel id="select-first-pokemon-label">{t('selectFirstPokemon')}</InputLabel>
            <Select
              labelId="select-first-pokemon-label"
              value={comparePokemon1}
              onChange={(e) => setComparePokemon1(e.target.value)}
              label={t('selectFirstPokemon')}
              sx={{
                backgroundColor: theme.palette.background.default,
                borderRadius: '4px',
                color: theme.palette.text.primary,
                '& .MuiSelect-icon': { color: theme.palette.text.primary },
                fontSize: '1rem',
                height: '40px',
                paddingY: '6px',
                boxShadow: theme.shadows[2],
              }}
            >
              {pokemonList.map((pokemon) => (
                <MenuItem
                  key={`${pokemon.id}-${pokemon.name}`}
                  value={pokemon.id}
                  sx={{ paddingY: '6px', fontSize: '1rem' }}
                >
                  {pokemon.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: '15px' }}>
            <InputLabel id="select-second-pokemon-label">{t('selectSecondPokemon')}</InputLabel>
            <Select
              labelId="select-second-pokemon-label"
              value={comparePokemon2}
              onChange={(e) => setComparePokemon2(e.target.value)}
              label={t('selectSecondPokemon')}
              sx={{
                backgroundColor: theme.palette.background.default,
                borderRadius: '4px',
                color: theme.palette.text.primary,
                boxShadow: theme.shadows[2],
                '& .MuiSelect-icon': { color: theme.palette.text.primary },
                fontSize: '1rem',
                height: '40px',
                paddingY: '6px',
              }}
            >
              {pokemonList.map((pokemon) => (
                <MenuItem
                  key={`${pokemon.id}-${pokemon.name}`}
                  value={pokemon.id}
                  sx={{ paddingY: '6px', fontSize: '1rem' }}
                >
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
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              transition: 'background-color 0.3s ease, color 0.3s ease',
              border: `2px solid ${theme.palette.divider}`,
              '&:hover': {
                backgroundColor: theme.palette.background.paper,
              },
              padding: '10px 20px',
              fontSize: '1rem',
              borderRadius: '8px',
              boxShadow: theme.shadows[2],
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
    <Box display="flex" justifyContent="center" mt={2}>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap="20px">
        {Array.from(new Array(20)).map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 200,
              backgroundColor: theme.palette.background.paper,
              borderRadius: '8px',
              p: 2,
              boxShadow: theme.shadows[2],
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height={100}
              sx={{ borderRadius: '8px' }}
            />
            <Skeleton variant="text" sx={{ mt: 1, mb: 0.5 }} />
            <Skeleton variant="text" width="80%" sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="60%" sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="50%" />
          </Box>
        ))}
      </Box>
    </Box>
  }
  endMessage={
    <Typography variant="body1" align="center" sx={{ mt: 2, fontSize: '0.9rem' }}>
      <b>{t('allPokemonLoaded')}</b>
    </Typography>
  }
  scrollableTarget="scroll-node"
>
  <Box
    display="flex"
    flexWrap="wrap"
    justifyContent="center"
    gap="20px"
    sx={{
      padding: '20px',
      transition: 'background-color 0.5s ease, color 0.5s ease',
    }}
  >
    {loading ? (
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap="20px">
        {Array.from(new Array(20)).map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 200,
              backgroundColor: theme.palette.background.paper,
              borderRadius: '8px',
              p: 2,
              boxShadow: theme.shadows[2],
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height={100}
              sx={{ borderRadius: '8px' }}
            />
            <Skeleton variant="text" sx={{ mt: 1, mb: 0.5 }} />
            <Skeleton variant="text" width="80%" sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="60%" sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="50%" />
          </Box>
        ))}
      </Box>
    ) : (
      <Suspense fallback={<Box display="flex" justifyContent="center" mt={2}><Loading /></Box>}>
        {pokemonList.map((pokemon) => (
          <PokemonCard key={`${pokemon.id}-${pokemon.name}`} pokemon={pokemon} />
        ))}
      </Suspense>
    )}
  </Box>
</InfiniteScroll>
  </Box>
  );
};

export default Home;
