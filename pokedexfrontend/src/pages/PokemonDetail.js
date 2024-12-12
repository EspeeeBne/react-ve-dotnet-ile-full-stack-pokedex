import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Card, CardContent, Box, Grid, CircularProgress } from '@mui/material';
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
  const { t } = useTranslation();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`http://localhost:5145/api/pokemon/${id}`);
        setPokemon(response.data);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
      }
    };

    fetchPokemon();
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
  const boxStyle = isDarkTheme ? { backgroundColor: '#333', color: '#fff' } : { backgroundColor: '#fff', color: '#000' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
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
            <Typography
              variant="h4"
              style={{
                textTransform: 'capitalize',
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: '10px',
              }}
            >
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

            <Typography variant="h6" style={{ marginTop: '30px', fontWeight: 'bold', color: '#fff' }}>
              {pokemon.stats ? t('stats') : t('noStats')}
            </Typography>
            <Grid container spacing={2} style={{ marginTop: '10px' }}>
              {pokemon.stats &&
                pokemon.stats.map((stat, index) => {
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
                        <Typography variant="body2" style={{ color: '#555' }}>
                          {statValue}
                        </Typography>
                      </Card>
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PokemonDetail;
