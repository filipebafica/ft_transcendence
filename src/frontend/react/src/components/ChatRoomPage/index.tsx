import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './style.module.css'

// Api
import { listMyRooms } from 'api/room'

// Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'

// Context
import { AuthContext } from 'auth'
import { RoomChatContext } from 'providers/roomChat'

interface Room {
  id: string
  name: string
  type: 'public' | 'private'
  password?: string
}

const ChatRoomPage = () => {
  const [myRooms, setMyRooms] = useState([] as Room[])
  const navigate = useNavigate()

  const { user } = useContext(AuthContext)
  const { messagesData } = useContext(RoomChatContext)

  const handleCreateRoom = () => {
    navigate('/chatRoom/createRoom')
  }

  const handleJoinRoom = () => {
    navigate('/chatRoom/joinRoom')
  }

  const handleChatRoomClick = (roomId: string) => {
    navigate(`/chatRoom/chat/${roomId}`)
  }

  useEffect(() => {
    let rooms
    const fetchRooms = async () => {
      if (!user?.id) return

      try {
        const response = await listMyRooms(user?.id)
        console.log('Rooms:', response.data)
        rooms = response.data
        setMyRooms(rooms)
      } catch (error) {
        console.error('Error fetching rooms:', error)
      }
    }
    fetchRooms()
  }, [user])

  return (
    <div className={styles.container}>
      <div className={styles.roomsContainer}>
        <h2> Your Rooms: </h2>
        {myRooms.length === 0 && (
          <>
            <i> No rooms available. </i> <i>Create or join an existing room! </i>{' '}
          </>
        )}
        {myRooms.map((room) => {
          const pendingMessages = messagesData.pendingMessages[room.id] || 0

          return (
            <>
              <div className={styles.roomBox}>
                <div className={styles.roomName}>{room.name}</div>
                {pendingMessages !== 0 && (
                  <Chip
                    className={styles.roomMessages}
                    label={`${pendingMessages} new message${pendingMessages > 1 ? 's' : ''}`}
                    variant="outlined"
                  />
                )}
                <Button variant="outlined" onClick={() => handleChatRoomClick(room.id)}>
                  Enter Room
                </Button>
              </div>
              <Divider flexItem />
            </>
          )
        })}
      </div>
      <Divider orientation="vertical" flexItem />
      <div className={styles.actionsContainer}>
        <Button variant="contained" onClick={handleCreateRoom}>
          Create a Room
        </Button>
        <Button variant="contained" onClick={handleJoinRoom}>
          Join a Room
        </Button>
      </div>
    </div>
  )
}

export default ChatRoomPage
