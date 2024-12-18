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

const PokemonCompare = () => {
  const { id1, id2 } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [evolution1, setEvolution1] = useState([]);
  const [evolution2, setEvolution2] = useState([]);

  useEffect(() => {
    const fetchData = async (id, setPokemon, setEvolution) => {
      try {
        const response = await axios.get(`http://localhost:5145/api/pokemon/${id}`);
        setPokemon(response.data);
        const evoResponse = await axios.get(`http://localhost:5145/api/pokemon/evolution/${id}`);
        setEvolution(evoResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(id1, setPokemon1, setEvolution1);
    fetchData(id2, setPokemon2, setEvolution2);
  }, [id1, id2]);

  if (!pokemon1 || !pokemon2) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderEvolutionChain = (chain) => {
    return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          }}
        >
          {chain.map((step, index) => (
            <React.Fragment key={index}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/pokemon/${step.id}`)}
              >
                <img src={step.imageUrl} alt={step.name} style={{ width: '60px', marginBottom: '5px' }} />
                <Typography style={{ textTransform: 'capitalize', fontWeight: 'bold', color: '#333' }}>
                  {step.name}
                </Typography>
              </Box>
              {index < chain.length - 1 && (
                <Typography style={{ fontSize: '30px', margin: '0 10px' }}>➞</Typography>
              )}
            </React.Fragment>
          ))}
        </Box>
      );
    };

  const renderPokemonCard = (pokemon, evolutionChain) => {
    const translatedTypes = pokemon.types.map((type) => t(type));
    const wikiUrl = `https://pokemon.fandom.com/wiki/${pokemon.name}`;
    const boxStyle = { backgroundColor: '#fff', color: '#000' };

    return (
      <Card
        style={{
          flex: 1,
          margin: '20px',
          padding: '20px',
          borderRadius: '15px',
          backgroundColor: typeColors[pokemon.types[0]] || '#FFF',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
      >
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src={pokemon.imageUrl}
              alt={pokemon.name}
              style={{
                width: '200px',
                marginBottom: '20px',
                borderRadius: '15px',
                boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
              }}
            />
            <Typography variant="h4" style={{ fontWeight: 'bold', color: '#fff' }}>
              #{pokemon.id} {pokemon.name}
            </Typography>
            <Typography style={{ color: '#fff' }}>{`${t('type')}: ${translatedTypes.join(', ')}`}</Typography>
            <Typography style={{ color: '#fff' }}>{`${t('height')}: ${pokemon.height} m`}</Typography>
            <Typography style={{ color: '#fff' }}>{`${t('weight')}: ${pokemon.weight} kg`}</Typography>
          <Box display="flex" justifyContent="center" marginTop="20px">
            <Button
              variant="contained"
              href={wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#FFCB05',
                color: '#3B4CCA',
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '8px',
              }}
            >
              {t('goToWiki')}
            </Button>
          </Box>
          </Box>
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
                    <Typography style={{ fontSize: '30px', color: '#rgba(0,0,0,0)' }}>→</Typography>
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
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Box display="flex" justifyContent="center" margin="20px">
        {renderPokemonCard(pokemon1, evolution1)}
        {renderPokemonCard(pokemon2, evolution2)}
      </Box>
    </motion.div>
  );
};

export default PokemonCompare;