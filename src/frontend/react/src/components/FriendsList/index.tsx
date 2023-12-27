import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// API
import { listFriends, addFriend } from 'api/friend'
import { blockFriend, unblockFriend } from 'api/friend'

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
import FriendCard from './FriendCard'

// Hooks
import { useSnackbar } from 'providers'

export interface FriendInterface {
  id: string
  nickName: string
  userStatus: string
  isBlocked: boolean
}

function FriendsList() {
  const { user } = useContext(AuthContext)
  const [friends, setFriends] = useState<FriendInterface[]>([])
  const [friendNickName, setFriendNickName] = useState<string>('')

  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()

  const userId = user?.id

  const handleAddFriend = async () => {
    if (!userId) return
    if (friendNickName === '') return

    try {
      const res = await addFriend(userId, friendNickName)
      console.log('Add friend response', res)

      // Reload friends list
      const friends = await listFriends(userId)
      const friendsWithStatus = friends.map((friend: any) => {
        return {
          ...friend,
          userStatus: friend.userStatus,
        }
      })
      setFriends(friendsWithStatus)
      showSnackbar('Friend added', 'success')
    } catch (err) {
      showSnackbar('Error adding friend', 'error')
      console.log(err)
    }
  }

  const handleClickProfile = (friendId: string) => {
    navigate(`/stats/${friendId}`)
  }

  const handleClickChat = (friendId: string) => {
    console.log('chat', friendId)
    navigate(`/friends/chat/${friendId}`)
  }

  const handleClickBlock = async (friendId: string) => {
    console.log('block/unblock', friendId)
    if (!userId) return

    try {
      const isBlocked = friends.find(
        (friend: FriendInterface) => friend.id === friendId
      )?.isBlocked

      console.log('isBlocked', isBlocked)
      let res
      if (isBlocked) {
        res = await unblockFriend(userId, Number(friendId))
        console.log('Unblock friend response', res)
        showSnackbar('Friend unblocked', 'success')
      } else {
        res = await blockFriend(userId, Number(friendId))
        console.log('Block friend response', res)
        showSnackbar('Friend blocked', 'success')
      }

      // Reload friends list
      const reloadedFriends = await listFriends(userId)
      const friendsWithStatus = reloadedFriends.map((friend: any) => {
        return {
          ...friend,
          userStatus: friend.userStatus,
        }
      })
      setFriends(friendsWithStatus)
    } catch (err) {
      console.log('Error blocking friend', err)
    }
  }

  // Fetch friends list
  useEffect(() => {
    if (!userId) return

    const fetchFriends = async () => {
      let friends = []
      try {
        friends = await listFriends(userId)
        const friendsWithStatus = friends.map((friend: any) => {
          return {
            ...friend,
            userStatus: friend.userStatus,
          }
        })
        setFriends(friendsWithStatus)
      } catch (err) {
        console.log('Error while fetching friends', err)
      }
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
        return newFriends
      })
    })

    return () => {
      friendsStatusSocket.off(`${userId}-friend-status-change`)
    }
  }, [userId])

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
          {friends.length === 0 && <div>No friends</div>}
          {friends.length > 0 &&
            friends.map((friend) => (
              <FriendCard
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
