import React from 'react';

import logo from "../../../assets/logo.png";

import styles from './style.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <nav className={styles.navigation}>
                <a href="/play-game">Play Game</a>
                <a href="/leaderboard">Leaderboard</a>
                <a href="/login">Login</a>
                <a href="/signup">Sign Up</a>
            </nav>
        </header>
    );
};

export default Header;
