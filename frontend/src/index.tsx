import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { RouterProvider } from "react-router-dom";

import { AuthProvider } from './auth';

import router from './routes/routes';

import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#2e2c33',
    },
    secondary: {
      main: '#5386ac',
    },
  },
  typography: {
    fontFamily: ['Fredoka'].join(','),
    button: {
      textTransform: 'none',
    }
  }
};

const theme = createTheme(themeOptions);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </AuthProvider>
);
