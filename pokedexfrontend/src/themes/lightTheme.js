import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: "#7077F9"
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5', 
    },
  },
});

export default lightTheme;
