// URL: /chatRoom/joinRoom

import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

// API
import { listAvailableRooms, joinRoom } from 'api/chat'

import style from './style.module.css'

// Context
import { AuthContext } from 'auth'

// Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Divider } from '@mui/material'

const JoinRoom = () => {
  const [rooms, setRooms] = useState([])
  const { user } = useContext(AuthContext)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await listAvailableRooms()
        console.log('Rooms:', response.data)
        setRooms(response.data)
      } catch (error) {
        console.error('Error fetching rooms:', error)
      }
    }
    fetchRooms()
  }, [])

  const handleJoinRoom = async (roomId: string) => {
    console.log('Joining room:', roomId)
    if (!user?.id) return
    
    await joinRoom({
      roomId: roomId,
      userId: user?.id,
      isOwner: false,
      isAdmin: false,
    })

    // Redirect to chat room
    navigate(`/chatRoom/chat/${roomId}`)
  }

  return (
    <div className={style.container}>
      <h2>Available Rooms to Join:</h2>
      {
        rooms.length === 0 && <i>No rooms available to join.</i>
      }
      {
        rooms.map((room: any) => (
          <>
            <div className={style.roomBox}>
              <Typography variant="body1">{room.name}</Typography>
              <Button variant="outlined" onClick={() => handleJoinRoom(room.id)}>
                Join Room
              </Button>
            </div>
            <Divider flexItem/>
          </>
        ))
      }
    </div>
  )
}

export default JoinRoom
