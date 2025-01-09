import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const Loading = ({ disableShrink = false, size = 40 }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: 'background-color 0.5s ease, color 0.5s ease',
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <img
          src="/favicon.ico"
          alt="Logo"
          style={{ width: 40, height: 40 }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.text.primary,
          }}
        >
          {t('pokemonApp')}
        </Typography>
      </Box>

      <CircularProgress
        size={size}
        disableShrink={disableShrink}
        sx={{ color: theme.palette.primary.main }}
      />
    </Box>
  );
};

export default Loading;
