import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import logo from '../../../assets/logo_clean.png'

import styles from './style.module.css'

import { AuthContext } from '../../../auth'

import { Button, Menu, MenuItem, Typography } from '@mui/material'

const Header = () => {
  const { user, signIn, signOut } = useContext(AuthContext)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()

  const handleSignIn = () => {
    const randomNumber = Math.floor(Math.random() * 10000) + 1
    signIn({ name: 'test', email: 'test', password: 'test', id: randomNumber.toString() })
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleClickSettings = () => {
    navigate('/settings')
    setAnchorElUser(null)
  }

  const handleClickStats = () => {
    navigate('/stats')
    setAnchorElUser(null)
  }

  const handleClickSignOut = () => {
    signOut()
    setAnchorElUser(null)
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        <img src={logo} alt="Logo" />
      </div>

      {user && (
        <div className={styles.loggedOutNavigation}>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/game')
            }}
          >
            Play Game!
          </Button>
          <Button
            onClick={() => {
              navigate('/chat')
            }}
          >
            Chat Rooms
          </Button>
          <Button
            onClick={() => {
              navigate('/friends')
            }}
          >
            Buddy List
          </Button>
          <div>
            <Button onClick={(e) => handleOpenUserMenu(e)}>Profile</Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key={'settings'} onClick={handleClickSettings}>
                <Typography textAlign="center">{'Settings'}</Typography>
              </MenuItem>
              <MenuItem key={'stats'} onClick={handleClickStats}>
                <Typography textAlign="center">{'Stats'}</Typography>
              </MenuItem>
              <MenuItem key={'signOut'} onClick={handleClickSignOut}>
                <Typography textAlign="center">{'Sign out'}</Typography>
              </MenuItem>
            </Menu>
          </div>
        </div>
      )}
      {!user && (
        <div className={styles.loggedOutNavigation}>
          <Button variant="outlined" onClick={() => handleSignIn()}>
            Log In
          </Button>
          <Button variant="outlined">Sign Up</Button>
        </div>
      )}
    </header>
  )
}

export default Header
