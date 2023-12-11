import React, { useState } from 'react'

import MessageBox from '../../Shared/MessageBox'

import { roomSocket } from 'socket'

import { createRoom } from 'api/chat'

import styles from './style.module.css'

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('')
  const [roomType, setRoomType] = useState<'public' | 'private'>('public')
  const [password, setPassword] = useState('')
  const [isConfigComplete, setIsConfigComplete] = useState(false)

  const handleSubmit = async () => {
    // Logic to handle room creation
    console.log('Creating room:', { roomName, roomType, password })
    await createRoom({ name: roomName, type: roomType, password }).then((res) => {
      console.log('Room created:', res);
    })
    setIsConfigComplete(true)
  }

  if (isConfigComplete) {
    return (
      <MessageBox
        userFrom={{ name: 'user1', id: '1' }}
        userTo={{ name: 'user2', id: '2' }}
        socket={roomSocket}
        listenTo={roomName}
        onSendMessage={(message) => {
          roomSocket.emit(
            'messageRouter',
            JSON.stringify({ from: 'user1', message }),
          )
        }}
        onReceiveMessage={(message) => {
          console.log(message)
        }}
      />
    )
  }

  return (
    <div className={styles.container}>
      <h2>Create Room</h2>
      <div className={styles.field}>
        <label>Room Name:</label>
        <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
      </div>
      <div className={styles.field}>
        <label>Room Type:</label>
        <select value={roomType} onChange={(e) => setRoomType(e.target.value as "public" | "private")}>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>
      {roomType === 'private' && (
        <div className={styles.field}>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      )}
      <button onClick={handleSubmit}>Create Room</button>
    </div>
  )
}

export default CreateRoom
