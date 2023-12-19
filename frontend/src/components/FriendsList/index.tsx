import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// API
import { listFriends, addFriend } from 'api/friend'

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
  const [friendNickName, setFriendNickName] = useState<string>('')

  const navigate = useNavigate()

  const userId = user?.id

  const handleAddFriend = async () => {
    if (!userId) return
    if (friendNickName === '') return

    try {
      const res = await addFriend(userId, friendNickName)
      console.log('Add friend response', res)
      navigate('/friends')
    } catch (err) {
      console.log(err)
    }
  }

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
      console.log('Friends', friends)
      setFriends(friends)
    }

    fetchFriends()
  }, [userId])

  // Socket for user statuses
  useEffect(() => {
    if (!userId) return

    friendsStatusSocket.on(`${userId}-friend-status-change`, (data: any) => {
      console.log('Friend status change', data)
      setFriends((prevFriends) => {
        const newFriends = prevFriends.map((friend) => {
          if (friend.id.toString() === data.userId) {
            return {
              ...friend,
              userStatus: data.status,
            }
          }
          return friend
        })
        console.log('New friends', newFriends)
        return newFriends
      })
    })
  }, [userId])

  console.log('Friends before render', friends)

  return (
    <div className={styles.friendsListContainer}>
      <div className={styles.addFriendSection}>
        <TextField
          id="outlined-basic"
          label="Friend Nickname"
          variant="outlined"
          size="small"
          onChange={(e) => {
            setFriendNickName(e.target.value)
          }}
        />
        <Button variant="outlined" onClick={handleAddFriend}>
          Add Friend
        </Button>
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
