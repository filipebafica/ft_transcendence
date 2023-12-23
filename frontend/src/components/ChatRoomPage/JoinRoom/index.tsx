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
import { Dialog, TextField } from '@mui/material'

// Icons
import { FaLock } from 'react-icons/fa'

interface Room {
  id: number
  hasPassword: boolean
  isPublic: boolean
  name: string
}

const JoinRoom = () => {
  const [rooms, setRooms] = useState([] as Room[])
  const [roomPasswordModal, setRoomPasswordModal] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [roomIdToJoin, setRoomIdToJoin] = useState<string>('')
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

  const handleJoinRoom = async (roomId: string, hasPassword: boolean) => {
    if (!user?.id) return

    // If room has password, prompt user to enter password
    if (hasPassword) {
      setRoomPasswordModal(true)
      setRoomIdToJoin(roomId)
      return
    }

    // If not, join room
    try {
      await joinRoom({
        roomId: roomId,
        userId: user?.id,
        isOwner: false,
        isAdmin: false,
      })
      // Redirect to chat room
      navigate(`/chatRoom/chat/${roomId}`)
    }
    catch (error) {
      console.log('Error joining room:', error)
    }
  }

  const handleJoinRoomPassword = async () => {
    console.log('Joining room with password')
    if (!user?.id) return
    if (roomIdToJoin === '') return
    if (password === '') return

    try {
      // Join room
      const res = await joinRoom({
        roomId: roomIdToJoin,
        userId: user?.id,
        isOwner: false,
        isAdmin: false,
        password: password,
      })

      // If res status code is 403, user was banned
      if (res.status === 403) {
        alert('You are banned from this room.')
        return
      }
      setRoomPasswordModal(false)
      navigate(`/chatRoom/chat/${roomIdToJoin}`)
    } catch (error) {
      console.error('Error joining room:', error)
      alert('Wrong password.')
    }
  }

  return (
    <div className={style.container}>
      <h2>Available Rooms to Join:</h2>
      {rooms.length === 0 && <i>No rooms available to join.</i>}
      {rooms.map((room: any) => (
        <>
          <div className={style.roomBox}>
            <Typography variant="body1">{room.name}</Typography>
            <Button variant="outlined" onClick={() => handleJoinRoom(room.id, room.hasPassword)}>
              <span> Join Room </span>
              {room.hasPassword && <FaLock />}
            </Button>
          </div>
          <Divider flexItem />
        </>
      ))}

      {
        <Dialog
          open={roomPasswordModal}
          onClose={() => {
            setRoomPasswordModal(false)
            setPassword('')
          }}
        >
          <div className={style.setPasswordContainer}>
            <div className={style.setPasswordContent}>
              <h3>Enter room Password</h3>
              <TextField
                label="Password"
                variant="outlined"
                type={'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
              <Button variant="outlined" onClick={() => handleJoinRoomPassword()}>
                Enter Room
              </Button>
            </div>
          </div>
        </Dialog>
      }
    </div>
  )
}

export default JoinRoom
