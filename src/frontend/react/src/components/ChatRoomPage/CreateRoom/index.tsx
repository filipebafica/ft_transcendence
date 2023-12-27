// URL: /chatRoom/createRoom

import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { createRoom, joinRoom } from 'api/room'

import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material'

import styles from './style.module.css'

// Context
import { AuthContext } from 'auth'
import { RoomChatContext } from 'providers/roomChat'

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('')
  const [roomType, setRoomType] = useState('public' as 'public' | 'private')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const { user } = useContext(AuthContext)
  const { reloadRooms } = useContext(RoomChatContext)

  const handleSubmit = async () => {
    if (!user?.id) return

    // Create Room
    let res
    try {
      res = await createRoom({
        userId: user?.id,
        roomName: roomName,
        isPublic: roomType === 'public',
        password: password,
      })
      console.log('Room created:', res)
    } catch (error) {
      console.error('Error creating room:', error)
    }
    const roomId = res?.data && res.data.id

    if (!roomId) return

    // Join that room
    let joinRes
    try {
      joinRes = await joinRoom({
        roomId: roomId,
        userId: user?.id,
        isOwner: true,
        isAdmin: true,
      })

      // Reload rooms
      await reloadRooms()

      navigate(`/chatRoom/chat/${roomId}`)
    } catch (error) {
      console.error('Error joining room:', error)
    }
  }

  return (
    <div className={styles.container}>
      <Typography variant="h5" style={{ marginBottom: '20px' }}>
        Create Room
      </Typography>
      <TextField
        className={styles.customInput}
        label="Room Name"
        type="text"
        value={roomName}
        required
        onChange={(e) => setRoomName(e.target.value)}
      />
      <FormControl className={styles.customInput}>
        <InputLabel>Room Type</InputLabel>
        <Select
          value={roomType}
          onChange={(e) => setRoomType(e.target.value as any)}
          label="Room Type"
        >
          <MenuItem value={'public'}>Public</MenuItem>
          <MenuItem value="private">Private</MenuItem>
        </Select>
      </FormControl>
      <TextField
        className={styles.customInput}
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" className={styles.button} onClick={handleSubmit}>
        Create Room
      </Button>
    </div>
  )
}

export default CreateRoom
