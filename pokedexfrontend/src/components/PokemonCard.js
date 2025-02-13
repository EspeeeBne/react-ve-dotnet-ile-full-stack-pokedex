import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

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

const PokemonCard = ({ pokemon }) => {
  const { t } = useTranslation();

  const translatedTypes = pokemon.types.map((type) => t(type));

  return (
    <Link to={`/pokemon/${pokemon.id}`} style={{ textDecoration: 'none' }}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: 200,
          margin: 10,
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <Card
          style={{
            backgroundColor: typeColors[pokemon.types[0]] || '#FFF',
            color: '#000',
            textAlign: 'center',
            height: '100%',
          }}
        >
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center">
              <motion.img
                src={pokemon.imageUrl}
                alt={pokemon.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  marginBottom: '10px',
                }}
                whileHover={{ scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              />
              <Typography variant="h6" style={{ textTransform: 'capitalize' }}>
                #{pokemon.id} {pokemon.name}
              </Typography>
              <Typography variant="body2">
                {t('type')}: {translatedTypes.join(', ')}
              </Typography>
              <Typography variant="body2">
                {t('height')}: {pokemon.height} m | {t('weight')}: {pokemon.weight} kg
              </Typography>
              <Typography variant="body2" style={{ marginTop: '10px' }}>
                {t('region')}: {pokemon.region ? t(pokemon.region) : t('unknown')}
              </Typography>
              <Typography variant="body2">
                {t('generation')}: {pokemon.generation ? t(pokemon.generation) : t('unknown')}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default PokemonCard;
