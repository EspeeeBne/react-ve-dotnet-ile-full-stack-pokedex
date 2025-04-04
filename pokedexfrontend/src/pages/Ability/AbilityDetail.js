import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { Typography, Box, Card, CardContent, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';


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

const API_URL = process.env.REACT_APP_API_BASE_URL;

const AbilityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const [ability, setAbility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pokemonDetails, setPokemonDetails] = useState({});

  useEffect(() => {
    const fetchAbility = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/pokemon/ability/${id}`);
        setAbility(response.data);

        const fetchPokemonTypes = response.data.pokemon.map(async (pokemon) => {
          try {
            const pokemonResponse = await axios.get(`${API_URL}/api/pokemon/${pokemon.id}`);
            return { id: pokemon.id, types: pokemonResponse.data.types };
          } catch (pokemonError) {
            console.error(t('fetchPokemonErrorConsole'), pokemonError);
            return { id: pokemon.id, types: ['normal'] };
          }
        });

        const fetchedDetails = await Promise.all(fetchPokemonTypes);
        const detailsMap = fetchedDetails.reduce((acc, detail) => {
          acc[detail.id] = detail.types;
          return acc;
        }, {});

        setPokemonDetails(detailsMap);
      } catch (error) {
        console.error(t('fetchAbilityErrorConsole'), error);
        setAbility(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAbility();
  }, [id, t]);

  if (loading)
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
        <Skeleton variant="rectangular" width="80%" height={100} sx={{ mt: 2, mb: 4 }} />
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap="16px">
          {Array.from(new Array(20)).map((_, index) => (
            <Box key={index} width={150}>
              <Skeleton variant="rectangular" height={150} />
              <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
              <Skeleton variant="text" height={20} width="60%" />
            </Box>
          ))}
        </Box>
      </Box>
    );

  if (!ability)
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h6" color="error" align="center">
            {t('errorLoading')}
          </Typography>
        </motion.div>
      </Box>
    );

  const renderPokemonCard = (pokemon) => {
    const types = pokemonDetails[pokemon.id] || ['normal'];
    const translatedTypes = types.map((type) => t(type));
    const primaryType = types[0].toLowerCase();
    const cardColor = typeColors[primaryType] || theme.palette.background.paper;
    const textColor = theme.palette.text.primary;

    return (
      <motion.div
        key={pokemon.id}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(`/pokemon/${pokemon.id}`)}
        style={{ width: '150px' }}
      >
        <Card
          sx={{
            cursor: 'pointer',
            textAlign: 'center',
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            padding: 2,
            backgroundColor: cardColor,
            color: textColor,
            transition: 'background-color 0.5s ease, color 0.5s ease',
          }}
        >
          <img
            src={pokemon.imageUrl}
            alt={pokemon.name}
            style={{ width: '80px', height: '80px', marginBottom: '10px' }}
          />
          <CardContent>
            <Typography
              variant="body1"
              sx={{ textTransform: 'capitalize', fontWeight: 'bold', transition: 'color 0.5s ease' }}
            >
              {pokemon.name}
            </Typography>
            <Typography variant="body2" sx={{ transition: 'color 0.5s ease' }}>
              {translatedTypes.join(', ')}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ transition: 'background-color 0.5s ease, color 0.5s ease' }}
    >
      <Box
        sx={{
          maxWidth: '900px',
          margin: '40px auto',
          padding: '20px',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          transition: 'background-color 0.5s ease, color 0.5s ease',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'capitalize',
            transition: 'color 0.5s ease',
          }}
        >
          {t('abilityName')}: {ability.name}
        </Typography>

        <Box marginTop={3} marginBottom={3}>
          <Typography
            variant="body1"
            sx={{
              marginBottom: 1,
              fontStyle: 'italic',
              color: theme.palette.text.secondary,
              transition: 'color 0.5s ease',
            }}
          >
            {t('abilityEffect')}:
          </Typography>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.6,
              textAlign: 'center',
              transition: 'color 0.5s ease',
            }}
          >
            {ability.effect}
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 2,
            transition: 'color 0.5s ease',
          }}
        >
          {t('pokemonWithAbility')}:
        </Typography>
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap="16px"
          sx={{
            transition: 'background-color 0.5s ease, color 0.5s ease',
          }}
        >
          {ability.pokemon.map((pokemon) => renderPokemonCard(pokemon))}
        </Box>
      </Box>
    </motion.div>
  );
};

export default AbilityDetail;
