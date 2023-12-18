import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// API
import { listFriends } from 'api/friend'

// Style
import styles from './style.module.css'

// Context
import { AuthContext } from 'auth'

// Socket
import { friendsStatusSocket } from 'socket'

// Components
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import List from '@mui/material/List'

import FriendItem from './FriendItem'

interface FriendInterface {
  id: string
  nickName: string
  userStatus: string
}

function FriendsList() {
  const { user } = useContext(AuthContext)
  const [friends, setFriends] = useState<FriendInterface[]>([])

  const navigate = useNavigate()

  const userId = user?.id

  const handleClickProfile = (friendId: string) => {
    console.log('profile', friendId)
  }

  const handleClickChat = (friendId: string) => {
    console.log('chat', friendId)
    navigate(`/friends/chat/${friendId}`)
  }

  const handleClickBlock = (friendId: string) => {
    console.log('block', friendId)
  }

  useEffect(() => {
    if (!userId) return

    const fetchFriends = async () => {
      let friends
      try {
        friends = await listFriends(userId)
      } catch (err) {
        console.log(err)
      }
      console.log('Friends',friends)
      setFriends(friends)
    }

    fetchFriends()
  }, [userId])

  useEffect(() => {
    if (!userId) return

    friendsStatusSocket.on(`${userId}-friend-status-change`, (data: any) => {
      console.log('friend-status-change', data)
    })
  }, [userId])

  return (
    <div className={styles.friendsListContainer}>
      <div className={styles.addFriendSection}>
        <TextField id="outlined-basic" label="Friend Nickname" variant="outlined" size="small" />
        <Button variant="outlined">Add Friend</Button>
      </div>
      <div className={styles.friendsList}>
        <List>
          {friends.map((friend) => (
            <FriendItem
              key={friend.id}
              friend={friend}
              onProfileClick={handleClickProfile}
              onChatClick={handleClickChat}
              onBlockClick={handleClickBlock}
            />
          ))}
        </List>
      </div>
    </div>
  )
}

export default FriendsList
