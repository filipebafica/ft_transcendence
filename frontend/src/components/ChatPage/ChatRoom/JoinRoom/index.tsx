import React, { useState, useEffect } from 'react'

import MessageBox from '../../Shared/MessageBox'

import { roomSocket } from 'socket'

import { listPublicRooms } from 'api/chat'

import style from './style.module.css'

const JoinRoom = () => {
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState('')

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await listPublicRooms()
        console.log('Rooms:', response.data)
        setRooms(response.data)
      } catch (error) {
        console.error('Error fetching rooms:', error)
      }
    }

    fetchRooms()
  }, [])

  const handleJoinRoom = (roomId: string) => {
    setSelectedRoom(roomId)
  }

  if (selectedRoom) {
    return (
      <MessageBox
        userFrom={{ name: 'user1', id: '1' }}
        userTo={{ name: 'user2', id: '2' }}
        socket={roomSocket}
        listenTo={selectedRoom}
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
    <div className={style.container}>
      <h2>Public Rooms</h2>
      {rooms.map((room: any) => (
        <button key={room.id} onClick={() => handleJoinRoom(room.id)}>{room.name}</button>
      ))}
    </div>
  )
}

export default JoinRoom
