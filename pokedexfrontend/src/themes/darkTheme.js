import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#7038F8"
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

export default darkTheme;
