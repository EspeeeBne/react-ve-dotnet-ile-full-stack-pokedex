import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { fourOhFourGif } from '../../themes/staticimagerouter';

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={(theme) => ({
        position: 'absolute',
        left: '50%',
        top: '50%',
        textAlign: 'center',
        transform: 'translate(-50%, -50%)',
        padding: theme.spacing(2),
        maxWidth: '90vw',
        transition: 'background-color 0.5s ease',
      })}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 360,
          mx: 'auto',
        }}
      >
        <img
          src={fourOhFourGif}
          alt={t('404.alt_text')}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: 8,
            boxShadow: '0px 0px 20px rgba(0,0,0,0.3)',
          }}
        />
      </Box>

      <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
        {t('404.header_text')}
      </Typography>

      <Typography variant="body1" sx={{ mt: 1 }}>
        {t('404.subtitle_text')}
      </Typography>
    </Box>
  );
};

export default NotFound;
