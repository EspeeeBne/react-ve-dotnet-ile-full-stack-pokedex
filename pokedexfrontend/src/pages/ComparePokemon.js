import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Button,
  useTheme,
  Alert,
  Skeleton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PokemonStatChart from '../components/PokemonStatChart';
import PokemonCompareRadar from '../components/PokemonCompareWithRadar';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


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

const PokemonCompare = () => {
  const { id1, id2 } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [evolution1, setEvolution1] = useState([]);
  const [evolution2, setEvolution2] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (id, setPokemon, setEvolution) => {
      try {
        const response = await axios.get(`${API_URL}/api/pokemon/${id}`);
        setPokemon(response.data);
        const evoResponse = await axios.get(`${API_URL}/api/pokemon/evolution/${id}`);
        setEvolution(evoResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(t('fetchDataError'));
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchData(id1, setPokemon1, setEvolution1),
        fetchData(id2, setPokemon2, setEvolution2),
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, [id1, id2, t]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          padding: 2,
          transition: 'background-color 0.5s ease',
        }}
      >

        <Skeleton variant="text" width="60%" height={40} />

        <Skeleton variant="rectangular" width="80%" height={300} sx={{ mt: 2, mb: 4 }} />

        <Box display="flex" flexWrap="wrap" justifyContent="center" gap="20px">
          {[1, 2].map((_, index) => (
            <Box key={index} width={300}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '15px' }} />
              <Skeleton variant="text" width="80%" height={30} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="60%" height={20} />
              <Box display="flex" flexDirection="row" gap="10px" mt={1}>
                <Skeleton variant="text" height={30} width="30%" />
                <Skeleton variant="text" height={30} width="30%" />
              </Box>

              <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" gap="20px" mt={2}>
                {Array.from(new Array(3)).map((_, evoIndex) => (
                  <React.Fragment key={evoIndex}>
                    <Skeleton variant="circular" width={80} height={80} />
                    {evoIndex < 2 && <ArrowForwardIcon fontSize="large" />}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          height: '100vh',
          backgroundColor: theme.palette.background.default,
          padding: 2,
          transition: 'background-color 0.5s ease, color 0.5s ease',
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const renderPokemonCard = (pokemon, evolutionChain) => {
    const translatedTypes = Array.isArray(pokemon.types) ? pokemon.types.map((type) => t(type)) : [];
    const primaryType = Array.isArray(pokemon.types) && pokemon.types.length > 0 ? pokemon.types[0] : 'normal';
    const pokemonTypeColor = typeColors[primaryType];
    const textColor = theme.palette.text.primary;
    const boxShadowColor =
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
    const wikiUrl = `https://pokemon.fandom.com/wiki/${pokemon.name}`;

    const formatPercentage = (value) => {
      return i18n.language === 'tr' ? `%${value}` : `${value}%`;
    };

    return (
      <Card
        sx={{
          flex: 1,
          margin: '20px',
          padding: '20px',
          borderRadius: '15px',
          backgroundColor: pokemonTypeColor,
          boxShadow: `0 4px 8px ${boxShadowColor}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'background-color 0.5s ease, color 0.5s ease',
        }}
      >
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                border: `4px solid ${pokemonTypeColor}`,
                borderRadius: '20px',
                padding: '10px',
                backgroundColor: pokemonTypeColor,
                boxShadow: `0px 4px 15px ${boxShadowColor}`,
                mb: 2,
                transition: 'background-color 0.5s ease',
              }}
            >
              <img
                src={pokemon.imageUrl}
                alt={pokemon.name}
                style={{
                  width: '200px',
                  borderRadius: '15px',
                }}
              />
            </Box>

            <Typography
              variant="h4"
              sx={{
                textTransform: 'capitalize',
                fontWeight: 'bold',
                color: textColor,
                transition: 'color 0.5s ease',
              }}
            >
              #{pokemon.id} {pokemon.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: textColor,
                transition: 'color 0.5s ease',
              }}
            >
              {`${t('type')}: ${translatedTypes.join(', ')}`}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: textColor,
                transition: 'color 0.5s ease',
              }}
            >
              {`${t('height')}: ${pokemon.height} m`}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: textColor,
                transition: 'color 0.5s ease',
              }}
            >
              {`${t('weight')}: ${pokemon.weight} kg`}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: textColor,
                transition: 'color 0.5s ease',
              }}
            >
              {`${t('region')}: ${t(pokemon.region)}`}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: textColor,
                transition: 'color 0.5s ease',
              }}
            >
              {`${t('generation')}: ${t(pokemon.generation)}`}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: textColor,
                transition: 'color 0.5s ease',
              }}
            >
              {`${t('growthRate.header')}: ${t(pokemon.growthRate)}`}
            </Typography>
            <Box display="flex" flexDirection="row" gap="10px" mt={1}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 'bold',
                  color: 'blue',
                  transition: 'color 0.5s ease',
                }}
              >
                {`♂️ ${formatPercentage(pokemon.genderRate?.malePercentage || 0)}`}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 'bold',
                  color: '#d84d78',
                  transition: 'color 0.5s ease',
                }}
              >
                {`♀️ ${formatPercentage(pokemon.genderRate?.femalePercentage || 0)}`}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="center" mt={3}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ width: 'auto' }}
            >
              <Button
                variant="contained"
                href={wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('goToWiki')}
                sx={{
                  backgroundColor: typeColors[primaryType] || theme.palette.primary.main,
                  color: textColor,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: '8px',
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? typeColors[primaryType]
                        : `${typeColors[primaryType]}CC`,
                  },
                  transition: 'background-color 0.5s ease, color 0.5s ease',
                }}
              >
                {t('goToWiki')}
              </Button>
            </motion.div>
          </Box>

          <Box mt={4} width="100%">
            <PokemonStatChart stats={pokemon.stats} name={pokemon.name} types={pokemon.types} />
          </Box>

          <Typography
            variant="h6"
            sx={{
              mt: 4,
              fontWeight: 'bold',
              color: textColor,
              transition: 'color 0.5s ease',
            }}
          >
            {t('abilities')}
          </Typography>
          <Grid container spacing={2} mt={1}>
            {Array.isArray(pokemon.abilities) && pokemon.abilities.length > 0 ? (
              pokemon.abilities.map((ability, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/ability/${ability.url.split('/').slice(-2, -1)[0]}`)}
                      aria-label={t('abilities')}
                      sx={{
                        backgroundColor: typeColors[primaryType] || theme.palette.primary.main,
                        color: textColor,
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[2],
                        '&:hover': {
                          backgroundColor:
                            theme.palette.mode === 'dark'
                              ? typeColors[primaryType]
                              : `${typeColors[primaryType]}CC`,
                        },
                        transition: 'background-color 0.5s ease, color 0.5s ease',
                      }}
                    >
                      {t(ability.name)} ({ability.isHidden ? t('hiddenAbility') : t('regularAbility')})
                    </Button>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.warning.main,
                  textAlign: 'center',
                  fontSize: '18px',
                  transition: 'color 0.5s ease',
                }}
              >
                {t('noAbilitiesFound')}
              </Typography>
            )}
          </Grid>

          <Typography
            variant="h6"
            sx={{
              mt: 4,
              fontWeight: 'bold',
              color: textColor,
              transition: 'color 0.5s ease',
            }}
          >
            {t('evolutionChain')}
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap="20px"
            mt={2}
            p={2}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: theme.shape.borderRadius,
              boxShadow: theme.shadows[3],
              overflowX: 'auto',
              width: '100%',
              transition: 'background-color 0.5s ease, color 0.5s ease',
            }}
          >
            {Array.isArray(evolutionChain) && evolutionChain.length > 0 ? (
              evolutionChain.map((step, index) => {
                return (
                  <React.Fragment key={index}>
                    <Box
                      component={motion.div}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/pokemon/${step.id}`)}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease, background-color 0.5s ease, color 0.5s ease',
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: theme.shape.borderRadius,
                        p: 2,
                        boxShadow: theme.shadows[2],
                      }}
                    >
                      <Box
                        sx={{
                          border: `2px solid ${theme.palette.background.paper}`,
                          borderRadius: '50%',
                          p: 1,
                          backgroundColor: theme.palette.background.paper,
                          transition: 'border-color 0.5s ease, background-color 0.5s ease',
                        }}
                      >
                        <img
                          src={step.imageUrl}
                          alt={step.name}
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          textTransform: 'capitalize',
                          fontWeight: 'bold',
                          color: theme.palette.text.primary,
                          mt: 1,
                          transition: 'color 0.5s ease',
                        }}
                      >
                        {step.name}
                      </Typography>
                    </Box>
                    {index < evolutionChain.length - 1 && (
                      <ArrowForwardIcon fontSize="large" sx={{ color: theme.palette.text.secondary }} />
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.warning.main,
                  textAlign: 'center',
                  fontSize: '18px',
                  transition: 'color 0.5s ease',
                }}
              >
                {t('finalEvolution')}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ transition: 'background-color 0.5s ease, color 0.5s ease' }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          margin: '20px 0',
          fontWeight: 'bold',
          color: theme.palette.text.primary,
          transition: 'color 0.5s ease',
        }}
      >
        {`${t(pokemon1.name)} ${t('and')} ${t(pokemon2.name)} ${t('comparison')}`}
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <PokemonCompareRadar pokemon1={pokemon1} pokemon2={pokemon2} />
      </Box>
      <Box display="flex" justifyContent="center" alignItems="stretch" flexWrap="wrap" gap="20px" mt={4} px={2}>
        {renderPokemonCard(pokemon1, evolution1)}
        {renderPokemonCard(pokemon2, evolution2)}
      </Box>
    </motion.div>
  );
};

export default PokemonCompare;
