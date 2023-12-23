import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import logo from '../../../assets/logo_clean.png'

import styles from './style.module.css'

// API
import { login } from 'api/user'

// Provider
import { AuthContext } from '../../../auth'
import { DirectChatContext } from '../../../providers/directChat'

// Components
import { Button, Menu, MenuItem, Typography } from '@mui/material'
import { Badge } from '@mui/material'

// Socket
import { friendsStatusSocket } from 'socket'

const Header = () => {
  const { user, signOut, fakeSignIn } = useContext(AuthContext)
  const { messagesData } = useContext(DirectChatContext)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()

  // Todo
  const [id, setId] = useState('1')

  const handleSignIn = async () => {
    try {
      // await login()
      const authorizationUrl = `${process.env.REACT_APP_OAUTH_BASE_URL}?response_type=${process.env.REACT_APP_RESPONSE_TYPE}&redirect_uri=${encodeURIComponent(process.env.REACT_APP_REDIRECT_URI as string)}&client_id=${process.env.REACT_APP_CLIENT_ID}`;
      window.location.href = authorizationUrl
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleFakeSignIn = async () => {
    try {
      const res = fakeSignIn(id)
      console.log(res)
      window.location.href = '/'
    }
    catch (err) {
      console.log(err)
    }
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
    if (!user) return
    navigate(`/stats/${user.id}`)
    setAnchorElUser(null)
  }

  const handleClickSignOut = () => {
    friendsStatusSocket.emit(
      'statusRouter',
      JSON.stringify({
        userId: id,
        status: 'offline',
      }),
    )
    signOut()
    setAnchorElUser(null)
    window.location.href = '/'
  }

  const totalPendingMessages = Object.keys(messagesData.pendingMessages).reduce((acc, key) => {
    if (key === user?.id.toString()) return acc
    return acc + messagesData.pendingMessages[key]
  }, 0)

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
              navigate('/chatRoom')
            }}
          >
            Chat Rooms
          </Button>
          <Badge color="secondary" badgeContent={totalPendingMessages} className={styles.badgePending}>
            <Button
              onClick={() => {
                navigate('/friends')
              }}
            >
              Buddy List
            </Button>
          </Badge>
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
          <input value={id} onChange={(e) => setId(e.target.value)} />
          <Button variant="outlined" onClick={() => handleFakeSignIn()}>
            Fake Log In
          </Button>
          <Button variant="outlined" onClick={() => handleSignIn()}>
            Log In
          </Button>
        </div>
      )}
    </header>
  )
}

export default Header
