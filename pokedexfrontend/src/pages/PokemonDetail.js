import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Card, CardContent, Box, Grid, CircularProgress, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const typeColors = {
  grass: '#78C850',
  fire: '#F08030',
  water: '#6890F0',
  poison: '#A040A0',
  electric: '#F8D030',
  bug: '#8B8B56',
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

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [pokemon, setPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`http://localhost:5145/api/pokemon/${id}`);
        setPokemon(response.data);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
      }
    };

    const fetchEvolutionChain = async () => {
      try {
        const response = await axios.get(`http://localhost:5145/api/pokemon/evolution/${id}`);
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
  const pokemonTypeColor = typeColors[pokemon.types[0]] || '#FFF';
  const isDarkTheme = document.body.classList.contains('dark-theme');
  const boxStyle = isDarkTheme
    ? { backgroundColor: '#333', color: '#fff' }
    : { backgroundColor: '#fff', color: '#000' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Card
        style={{
          maxWidth: 800,
          margin: '40px auto',
          padding: '20px',
          backgroundColor: pokemonTypeColor,
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
      >
        <CardContent>
          {/* Pokemon Resim ve Bilgiler */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src={pokemon.imageUrl}
              alt={pokemon.name}
              style={{
                width: '250px',
                marginBottom: '20px',
                borderRadius: '20px',
                boxShadow: '0px 4px 15px rgba(0,0,0,0.3)',
              }}
            />
            <Typography variant="h4" style={{ textTransform: 'capitalize', fontWeight: 'bold', color: '#fff' }}>
              #{pokemon.id} {pokemon.name}
            </Typography>
            <Typography variant="body1" style={{ color: '#fff' }}>
              {`${t('type')}: ${translatedTypes.join(', ')}`}
            </Typography>
            <Typography variant="body1" style={{ color: '#fff' }}>
              {`${t('height')}: ${pokemon.height} m`}
            </Typography>
            <Typography variant="body1" style={{ color: '#fff' }}>
              {`${t('weight')}: ${pokemon.weight} kg`}
            </Typography>
          </Box>

          {/* İstatistikler */}
          <Typography variant="h6" style={{ marginTop: '30px', fontWeight: 'bold', color: '#fff' }}>
            {t('stats')}
          </Typography>
          <Grid container spacing={2} style={{ marginTop: '10px' }}>
            {pokemon.stats.map((stat, index) => {
              const [statName, statValue] = stat.split(':');
              return (
                <Grid item xs={6} sm={4} key={index}>
                  <Card
                    style={{
                      padding: '10px',
                      backgroundColor: boxStyle.backgroundColor,
                      color: boxStyle.color,
                      borderRadius: '10px',
                      boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                      {t(statName)}:
                    </Typography>
                    <Typography variant="body2">{statValue}</Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Yetenekler */}
          <Typography variant="h6" style={{ marginTop: '30px', fontWeight: 'bold', color: '#fff' }}>
            {t('abilities')}
          </Typography>
          <Grid container spacing={2} style={{ marginTop: '10px' }}>
            {pokemon.abilities.map((ability, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate(`/ability/${ability.url.split('/').slice(-2, -1)[0]}`)}
                  style={{
                    backgroundColor: boxStyle.backgroundColor,
                    color: boxStyle.color,
                    textTransform: 'capitalize',
                  }}
                >
                  {t(ability.name)} ({ability.isHidden ? t('hiddenAbility') : t('regularAbility')})
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* Evrim Zinciri */}
          <Typography variant="h6" style={{ marginTop: '30px', fontWeight: 'bold', color: '#fff' }}>
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
              backgroundColor: boxStyle.backgroundColor,
              color: boxStyle.color,
              borderRadius: '10px',
              boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
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
                      backgroundColor: '#f4f4f4',
                      borderRadius: '10px',
                      padding: '10px',
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
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
                      }}
                    />
                    <Typography
                      variant="body2"
                      style={{ textTransform: 'capitalize', fontWeight: 'bold', color: '#333' }}
                    >
                      {step.name}
                    </Typography>
                  </Box>
                  {index < evolutionChain.length - 1 && (
                    <Typography style={{ fontSize: '30px', color: '#fff' }}>→</Typography>
                  )}
                </React.Fragment>
              ))
            ) : (
              <Typography
                variant="body1"
                style={{
                  fontWeight: 'bold',
                  color: '#ff9800',
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
