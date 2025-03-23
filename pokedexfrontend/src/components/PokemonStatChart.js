import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PokemonStatBarChart = ({ stats, name }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const labels = stats.map((stat) => t(stat.split(':')[0]));
  const dataValues = stats.map((stat) => parseInt(stat.split(':')[1], 10));

  const chartData = {
    labels,
    datasets: [
      {
        label: `${t(name)} ${t('stats')}`,
        data: dataValues,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.dark,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.primary,
        },
        grid: {
          color: theme.palette.divider,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: theme.palette.text.primary,
        },
        grid: {
          color: theme.palette.divider,
        },
      },
    },
  };

  return (
    <Box
      sx={{
        margin: '20px auto',
        maxWidth: '500px',
        padding: '20px',
        borderRadius: '15px',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
      }}
    >
      <Typography
        variant="h6"
        align="center"
        style={{
          color: theme.palette.text.primary,
          marginBottom: '20px',
        }}
      >
        {`${t(name)} ${t('stats')}`}
      </Typography>
      <Bar data={chartData} options={chartOptions} />
    </Box>
  );
};

export default PokemonStatBarChart;
