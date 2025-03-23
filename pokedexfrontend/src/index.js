import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SiteStatusProvider } from './contexts/SiteStatusContext';
import reportWebVitals from './reportWebVitals';
import './index.scss';
import { CustomThemeProvider } from './themes/themeProvider';
import { CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SiteStatusProvider>
      <CustomThemeProvider>
      <CssBaseline />
      <App />
      </CustomThemeProvider>
    </SiteStatusProvider>
  </React.StrictMode>
);

reportWebVitals();
