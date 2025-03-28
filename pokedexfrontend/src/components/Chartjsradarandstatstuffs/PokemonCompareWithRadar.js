import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const PokemonCompareWithRadar = ({ pokemon1, pokemon2 }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const parseStats = (stats) =>
    stats.map((stat) => {
      const [key, value] = stat.split(':');
      return { label: t(key.trim()), value: parseInt(value.trim(), 10) || 0 };
    });

  const stats1 = parseStats(pokemon1.stats);
  const stats2 = parseStats(pokemon2.stats);

  const data = {
    labels: stats1.map((stat) => stat.label),
    datasets: [
      {
        label: pokemon1.name,
        data: stats1.map((stat) => stat.value),
        backgroundColor: theme.palette.primary.light + '80',
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        pointBackgroundColor: theme.palette.primary.dark,
      },
      {
        label: pokemon2.name,
        data: stats2.map((stat) => stat.value),
        backgroundColor: theme.palette.secondary.light + '80',
        borderColor: theme.palette.secondary.main,
        borderWidth: 2,
        pointBackgroundColor: theme.palette.secondary.dark,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        ticks: { color: theme.palette.text.primary, backdropColor: theme.palette.background.default },
        grid: { color: theme.palette.divider },
        pointLabels: { color: theme.palette.text.primary, font: { size: 14 } },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: theme.palette.text.primary,
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      style={{
        width: '80%',
        maxWidth: '600px',
        margin: '30px auto',
        padding: '20px',
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[3],
      }}
    >
      <Radar data={data} options={options} />
    </Box>
  );
};

export default PokemonCompareWithRadar;
