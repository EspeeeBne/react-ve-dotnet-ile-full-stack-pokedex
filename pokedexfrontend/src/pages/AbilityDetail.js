import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { Typography, Box, Grid2, CircularProgress, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

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

const AbilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const [ability, setAbility] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbility = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/pokemon/ability/${id}`);
        const updatedPokemon = response.data.pokemon.map((pokemon) => ({
          ...pokemon,
          type: pokemon.type || 'normal',
        }));
        setAbility({ ...response.data, pokemon: updatedPokemon });
      } catch (error) {
        console.error('Error fetching ability:', error);
        setAbility(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAbility();
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Box>
    );

  if (!ability)
    return (
      <Typography variant="h6" color="error" align="center">
        {t('errorLoading')}
      </Typography>
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Box
        sx={{
          maxWidth: '900px',
          margin: '40px auto',
          padding: '20px',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 2,
          boxShadow: theme.shadows[3],
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', textTransform: 'capitalize' }}>
          {t('abilityName')}: {ability.name}
        </Typography>

        <Box marginTop={3} marginBottom={3}>
          <Typography
            variant="body1"
            sx={{ marginBottom: 1, fontStyle: 'italic', color: theme.palette.text.secondary }}
          >
            {t('abilityEffect')}:
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6, textAlign: 'center' }}>
            {ability.effect}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}>
          {t('pokemonWithAbility')}:
        </Typography>
        <Grid2 container spacing={2} justifyContent="center">
          {ability.pokemon.map((pokemon, index) => {
            const backgroundColor = typeColors[pokemon.type] || theme.palette.action.selected;
            const textColor = theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black;

            return (
              <Grid2 xs={6} sm={4} md={3} key={index}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate(`/pokemon/${pokemon.id}`)}
                >
                  <Card
                    sx={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      borderRadius: 1,
                      boxShadow: theme.shadows[2],
                      padding: 2,
                      backgroundColor: backgroundColor,
                      color: textColor,
                    }}
                  >
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                      alt={pokemon.name}
                      style={{ width: '80px', height: '80px', marginBottom: '10px' }}
                    />
                    <CardContent>
                      <Typography
                        variant="body1"
                        sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                      >
                        {pokemon.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid2>
            );
          })}
        </Grid2>
      </Box>
    </motion.div>
  );
};

export default AbilityDetail;
