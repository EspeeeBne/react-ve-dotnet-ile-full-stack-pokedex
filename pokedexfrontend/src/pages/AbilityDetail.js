import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, List, ListItem, CircularProgress, Card, CardContent, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const AbilityDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [ability, setAbility] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbility = async () => {
      try {
        const response = await axios.get(`http://localhost:5145/api/pokemon/ability/${id}`);
        console.log("API Response:", response.data);
        setAbility(response.data);
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
      <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
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
      <Card
        style={{
          maxWidth: '800px',
          margin: '40px auto',
          padding: '20px',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: '15px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        }}
      >
        <CardContent>
          <Typography variant="h4" style={{ fontWeight: 'bold', textTransform: 'capitalize', textAlign: 'center' }}>
            {t('abilityName')}: {ability.name}
          </Typography>

          <Box marginTop={3}>
            <Typography variant="body1" style={{ marginBottom: '10px', fontStyle: 'italic', color: theme.palette.text.secondary }}>
              {t('abilityEffect')}:
            </Typography>
            <Typography variant="body1" style={{ lineHeight: 1.6 }}>
              {ability.effect}
            </Typography>
          </Box>

          <Box marginTop={4}>
            <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
              {t('pokemonWithAbility')}:
            </Typography>
            <List>
              {ability.pokemon.map((pokemon, index) => (
                <ListItem key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" style={{ textTransform: 'capitalize' }}>
                    {pokemon.name}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/pokemon/${pokemon.id}`)}
                  >
                    {t('viewDetails')}
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AbilityDetail;
