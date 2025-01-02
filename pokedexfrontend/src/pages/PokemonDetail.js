import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Card, CardContent, Box, Grid, CircularProgress, Button, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PokemonStatChart from '../components/PokemonStatChart';


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

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/pokemon/${id}`);
        setPokemon(response.data);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
      }
    };

    const fetchEvolutionChain = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/pokemon/evolution/${id}`);
        setEvolutionChain(response.data);
      } catch (error) {
        console.error('Error fetching evolution chain:', error);
      }
    };

    fetchPokemon();
    fetchEvolutionChain();
  }, [id]);

  if (!pokemon) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const translatedTypes = pokemon.types.map((type) => t(type));
  const pokemonTypeColor = typeColors[pokemon.types[0]] || theme.palette.background.paper;
  const textColor = theme.palette.text.primary;
  const boxShadowColor = theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.2)';
  const wikiUrl = `https://pokemon.fandom.com/wiki/${pokemon.name}`;

  const formatPercentage = (value) => {
    return i18n.language === 'tr' ? `%${value}` : `${value}%`;
  };

  return (
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
  <Card
    style={{
      maxWidth: 800,
      margin: '40px auto',
      padding: '20px',
      backgroundColor: pokemonTypeColor,
      borderRadius: '15px',
      boxShadow: `0 4px 8px ${boxShadowColor}`,
    }}
  >
    <CardContent>
      <Box display="flex" flexDirection="column" alignItems="center">
        <img
          src={pokemon.imageUrl}
          alt={pokemon.name}
          style={{
            width: '250px',
            marginBottom: '20px',
            borderRadius: '20px',
            boxShadow: `0px 4px 15px ${boxShadowColor}`,
          }}
        />
        <Typography
          variant="h4"
          style={{
            textTransform: 'capitalize',
            fontWeight: 'bold',
            color: textColor,
          }}
        >
          #{pokemon.id} {pokemon.name}
        </Typography>
        <Typography variant="body1" style={{ color: textColor }}>
          {`${t('type')}: ${translatedTypes.join(', ')}`}
        </Typography>
        <Typography variant="body1" style={{ color: textColor }}>
          {`${t('height')}: ${pokemon.height} m`}
        </Typography>
        <Typography variant="body1" style={{ color: textColor }}>
          {`${t('weight')}: ${pokemon.weight} kg`}
        </Typography>
        <Typography variant="body1" style={{ color: textColor }}>
        {`${t('region')}: ${t(pokemon.region)}`}
        </Typography>
        <Typography variant="body1" style={{ color: textColor }}>
        {`${t('generation')}: ${t(pokemon.generation)}`}
      </Typography>
      <Typography variant="body1" style={{ color: textColor }}>
        {`${t('growthRate.header')}: ${t(pokemon.growthRate)}`}
        </Typography>
            <Box display="flex" flexDirection="row" gap="10px" marginTop="10px">
              <Typography
                variant="body1"
                style={{
                  fontWeight: 'bold',
                  color: 'blue',
                }}
              >
                {`♂️ ${formatPercentage(pokemon.genderRate.malePercentage)}`}
              </Typography>
              <Typography
                variant="body1"
                style={{
                  fontWeight: 'bold',
                  color: 'pink',
                }}
              >
                {`♀️ ${formatPercentage(pokemon.genderRate.femalePercentage)}`}
              </Typography>
            </Box>
      </Box>

          <Box display="flex" justifyContent="center" marginTop="20px">
            <Button
              variant="contained"
              href={wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: pokemonTypeColor,
                color: theme.palette.text.primary,
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '8px',
              }}
            >
              {t('goToWiki')}
            </Button>
          </Box>

          <PokemonStatChart stats={pokemon.stats} name={pokemon.name} types={pokemon.types} />


      <Typography
        variant="h6"
        style={{
          marginTop: '30px',
          fontWeight: 'bold',
          color: theme.palette.text.primary,
        }}
      >
        {t('abilities')}
      </Typography>
      <Grid container spacing={2} style={{ marginTop: '10px' }}>
        {pokemon.abilities.map((ability, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate(`/ability/${ability.url.split('/').slice(-2, -1)[0]}`)}
              style={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.text.primary,
                textTransform: 'capitalize',
                fontWeight: 'bold',
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[2],
              }}
            >
              {t(ability.name)} ({ability.isHidden ? t('hiddenAbility') : t('regularAbility')})
            </Button>
          </Grid>
        ))}
      </Grid>

              <Typography
          variant="h6"
          style={{
            marginTop: '30px',
            fontWeight: 'bold',
            color: theme.palette.text.primary,
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
          marginTop="20px"
          padding="10px"
          style={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[3],
          }}
        >
          {evolutionChain.length > 0 ? (
            evolutionChain.map((step, index) => (
              <React.Fragment key={index}>
                <Box
                  onClick={() => navigate(`/pokemon/${step.id}`)}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    backgroundColor: theme.palette.background.default,
                    borderRadius: theme.shape.borderRadius,
                    padding: '10px',
                    boxShadow: theme.shadows[2],
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <img
                    src={step.imageUrl}
                    alt={step.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      marginBottom: '5px',
                      borderRadius: '50%',
                      boxShadow: theme.shadows[1],
                    }}
                  />
                  <Typography
                    variant="body2"
                    style={{
                      textTransform: 'capitalize',
                      fontWeight: 'bold',
                      color: theme.palette.text.primary,
                    }}
                  >
                    {step.name}
                  </Typography>
                </Box>
                {index < evolutionChain.length - 1 && (
                  <Typography
                    style={{
                      fontSize: '30px',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    ➞
                  </Typography>
                )}
              </React.Fragment>
            ))
          ) : (
            <Typography
              variant="body1"
              style={{
                fontWeight: 'bold',
                color: theme.palette.warning.main,
                textAlign: 'center',
                fontSize: '18px',
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
