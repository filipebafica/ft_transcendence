import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthContext } from '../../auth'

import Button from '@mui/material/Button'

import hero from '../../assets/hero_3.png'
import logo from '../../assets/logo.png'

import styles from './style.module.css'

const LandingPage = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  return (
    <div className={styles.landingPage}>
      <div className={styles.mainContent}>
        <div className={styles.titleContent}>
          {!user &&
            <>
            <div className={styles.welcomeContainer}>
              <h1>Welcome to </h1>
              <img src={logo} alt={"logo"}/>
            </div>
            <p>Play the classic Pong game online.</p>
            <p>Play with your friends or any other player.</p>

            <p>Sign up now to play!</p>
            </>
          } 
          {
            user &&
            <>
              <div className={styles.welcomeContainer}>
                <h1>Welcome back to </h1> 
                <img src={logo} alt={"logo"}/>
              </div>
              <div >
                <Button variant="contained" size="large" onClick={() => navigate('/game')}>Play Now!</Button>
              </div>
            </>
          }
        </div>
        <div className={styles.heroContent}>
          <img src={hero} alt="game" />
        </div>
      </div>
    </div>
  )
}

export default LandingPage
