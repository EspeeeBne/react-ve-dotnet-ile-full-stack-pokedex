import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRedirect(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  if (redirect) {
    navigate('/');
    return null;
  }

  return (
    <Box
      sx={(theme) => ({
        position: 'absolute',
        left: '50%',
        top: '50%',
        textAlign: 'center',
        transform: 'translate(-50%, -50%)',
        '& img': {
          maxWidth: '100vw',
          width: '500px',
          boxShadow: theme.shadows[6],
          marginBottom: theme.spacing(2),
        },
        '& h4': {
          fontWeight: 'bold',
          color: theme.palette.text.primary,
          marginBottom: theme.spacing(1),
        },
        '& p': {
          color: theme.palette.text.secondary,
        },
      })}
    >
      <img src="/images/404.gif" alt="404 Not Found" />
      <Typography variant="h4">{t('404.header_text')}</Typography>
      <Typography variant="body1">{t('404.subtitle_text')}</Typography>
    </Box>
  );
};

export default NotFound;
