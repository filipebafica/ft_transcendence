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
      // window.location.href = 'https://api.intra.42.fr/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fredirect&client_id=u-s4t2ud-b6e1af3d451f19aab0da44f81e6a17f483469ddaf869384d86033635e6ed1046'
      window.location.href = 'https://api.intra.42.fr/oauth/authorize?response_type=code&redirect_uri=https%3A%2F%2F31c9-2001-1388-91-6e3-472-8abc-b4a4-d06.ngrok-free.app%2Fauth%2Fredirect&client_id=u-s4t2ud-b6e1af3d451f19aab0da44f81e6a17f483'
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
          <Button variant="outlined">Sign Up</Button>
        </div>
      )}
    </header>
  )
}

export default Header
