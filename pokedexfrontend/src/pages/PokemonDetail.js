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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PokemonStatChart from '../components/PokemonStatChart';
import Loading from '../components/Loading';

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


const PokemonDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [pokemon, setPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/pokemon/${id}`);
        setPokemon(response.data);
      } catch (err) {
        console.error(t('fetchPokemonErrorConsole'), err);
        setError(t('fetchPokemonError'));
      }
    };

    const fetchEvolutionChain = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/pokemon/evolution/${id}`);
        setEvolutionChain(response.data);
      } catch (err) {
        console.error(t('fetchEvolutionErrorConsole'), err);
        setError(t('fetchEvolutionError'));
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPokemon(), fetchEvolutionChain()]);
      setLoading(false);
    };

    fetchData();
  }, [id, t]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ height: '100vh', backgroundColor: theme.palette.background.default, transition: 'background-color 0.5s ease' }}
      >
        <Loading />
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ transition: 'background-color 0.5s ease, color 0.5s ease' }}
    >
      <Card
        sx={{
          maxWidth: 800,
          margin: '40px auto',
          padding: '20px',
          backgroundColor: pokemonTypeColor,
          borderRadius: '15px',
          boxShadow: `0 4px 8px ${boxShadowColor}`,
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
                transition: 'background-color 0.5s ease, color 0.5s ease',
              }}
            >
              <img
                src={pokemon.imageUrl}
                alt={pokemon.name}
                style={{
                  width: '250px',
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
              style={{ width: 'auto', transition: 'background-color 0.5s ease, color 0.5s ease' }}
            >
              <Button
                variant="contained"
                href={wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
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

          <Box mt={4}>
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
                      <Typography
                        sx={{
                          fontSize: '30px',
                          color: theme.palette.text.secondary,
                          transition: 'color 0.5s ease',
                        }}
                      >
                        ➞
                      </Typography>
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
    </motion.div>
  );
};

export default PokemonDetail;
