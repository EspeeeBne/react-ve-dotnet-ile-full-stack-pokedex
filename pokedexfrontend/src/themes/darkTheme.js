import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#7038F8",
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bbbbbb',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default darkTheme;
