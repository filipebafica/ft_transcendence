import React, { useEffect, useContext, useState } from 'react'

// API
import { addFriend, listFriends } from 'api/friend'

// Style
import styles from './style.module.css'

// Context
import { AuthContext } from 'auth'

// Constants
// import { testUsers } from 'constants/fake'

// Components
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import Friend from './Friend'

function FriendsList() {
  const { user } = useContext(AuthContext)
  const [friends, setFriends] = useState<any>([])
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const userId = user?.id

  const handleFriendClick = (e: any) => {
    setAnchorElUser(e.currentTarget)
  }

  const handleCloseFriendMenu = () => {
    setAnchorElUser(null)
  }

  const handleClickProfile = () => {
    console.log('profile')
  }

  const handleClickChat = () => {
    console.log('chat')
  }

  const handleClickBlock = () => {
    console.log('block')
  }

  useEffect(() => {
    if (!userId) return

    const fetchFriends = async () => {
      const friends = await listFriends(userId)
      console.log(friends)
      setFriends(friends)
    }

    fetchFriends()
  }, [userId])

  return (
    <div className={styles.friendsListContainer}>
      <div className={styles.addFriendSection}>
        <TextField id="outlined-basic" label="Friend Nickname" variant="outlined" size="small" />
        <Button variant="outlined">Add Friend</Button>
      </div>
      <div className={styles.friendsList}>
        <List>
          {friends.map((friend: any) => {
            return (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={(e) => handleFriendClick(e)}>
                    <Friend key={friend.userId} friend={friend} />
                  </ListItemButton>
                </ListItem>
                <Divider component="li" />
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseFriendMenu}
                  anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                  }}
                >
                  <MenuItem key={'profile'} onClick={handleClickProfile}>
                    <Typography textAlign="center">{'Profile'}</Typography>
                  </MenuItem>
                  <MenuItem key={'chat'} onClick={handleClickChat}>
                    <Typography textAlign="center">{'Chat'}</Typography>
                  </MenuItem>
                  <MenuItem key={'block'} onClick={handleClickBlock}>
                    <Typography textAlign="center">{'Block'}</Typography>
                  </MenuItem>
                </Menu>
              </>
            )
          })}
        </List>
      </div>
    </div>
  )
}

export default FriendsList
