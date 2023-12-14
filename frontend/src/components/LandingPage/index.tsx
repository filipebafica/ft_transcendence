import React from 'react';
import Header from './Header';

import Button from '@mui/material/Button';

import hero from "../../assets/hero_3.png";

import styles from './style.module.css';

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
};

const theme = createTheme(themeOptions);

const LandingPage = () => {
    return (
		// <ThemeProvider theme={theme}>
        <div className={styles.landingPage}>
            <Header />
            <div className={styles.mainContent}>
				<div className={styles.titleContent}>
					<h1>Welcome to Pong!</h1>
					<p>Play the classic Pong game online.</p>
					<Button variant="contained">Play Now</Button>
				</div>
				<div className={styles.heroContent}>
					<img src={hero} alt="game" />
				</div>
            </div>
            <footer className={styles.footer}>
                © {new Date().getFullYear()} 42 Transcendence, Inc. All rights reserved.
            </footer>
        </div>
		// </ThemeProvider>
    );
};

export default LandingPage;
