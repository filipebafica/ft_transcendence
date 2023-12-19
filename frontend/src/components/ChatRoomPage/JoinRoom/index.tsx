// URL: /chatRoom/joinRoom

import React, { useState, useEffect, useContext } from 'react'

// API
import { listAvailableRooms, joinRoom } from 'api/chat'

import style from './style.module.css'

// Context
import { AuthContext } from 'auth'

// Components
import Button from '@mui/material/Button'

const JoinRoom = () => {
  const [rooms, setRooms] = useState([])
  const { user } = useContext(AuthContext)

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

  const handleJoinRoom = (roomId: string) => {
    console.log('Joining room:', roomId)
    joinRoom({
      roomId: roomId,
      userId: user?.id || '',
      isOwner: false,
      isAdmin: false,
    })
  }

  return (
    <div className={style.container}>
      <h2>Available Rooms to Join:</h2>
      {
        rooms.length === 0 && <i>No rooms available to join.</i>
      }
      {rooms.map((room: any) => (
        <Button variant={"contained"} onClick={() => handleJoinRoom(room.id)}>{room.name}</Button>
      ))}
    </div>
  )
}

export default JoinRoom
