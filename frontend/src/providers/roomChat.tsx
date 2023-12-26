import React, { createContext, useEffect, useState, useContext, useCallback } from 'react'

// Socket
import { roomSocket } from 'socket'

// Provider
import { AuthContext } from 'auth'

// API
import { listMyRooms } from 'api/room'

interface Message {
  from: string
  to: string
  message: string
  timeStamp: number
}

interface MessagesData {
  messages: {
    [key: string /* roomId */]: Message[]
  }
  pendingMessages: {
    [key: string /* roomId */]: number
  }
}

interface Room {
  id: string
  name: string
  type: 'public' | 'private'
  password?: string
}

export const RoomChatContext = createContext({
  messagesData: { messages: {}, pendingMessages: {} } as MessagesData,
  setMessagesData: (messages: MessagesData) => {},
  myRooms: [] as Room[],
  reloadRooms: () => {},
  cleanPendingMessages: (roomId: string) => {},
})

export const RoomChatProvider = (props: { children: any }) => {
  const { children } = props
  const [myRooms, setMyRooms] = useState([] as Room[])
  const [messagesData, setMessagesData] = useState({
    messages: {},
    pendingMessages: {},
  } as MessagesData)
  const { user } = useContext(AuthContext)

  // Reload the rooms of the user
  const reloadRooms = useCallback(async () => {
    if (!user?.id) return

    try {
      const response = await listMyRooms(user?.id)
      setMyRooms(response.data)
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }, [user])

  // Clean pending messages
  const cleanPendingMessages = useCallback(
    async (roomId: string) => {
      setMessagesData((prevMessages: MessagesData) => {
        const pendingMessages = prevMessages.pendingMessages
        const from = roomId

        if (pendingMessages[from]) {
          pendingMessages[from] = 0
        } else {
          pendingMessages[from] = 0
        }

        const newMessageData = {
          messages: prevMessages.messages,
          pendingMessages: pendingMessages,
        }

        localStorage.setItem(`roomMessagesData-${user?.id}`, JSON.stringify(newMessageData))
        return newMessageData
      })
    },
    [setMessagesData, user?.id],
  )

  // We load the rooms of the user
  useEffect(() => {
    let rooms
    const fetchRooms = async () => {
      if (!user?.id) return

      try {
        const response = await listMyRooms(user?.id)
        rooms = response.data
        setMyRooms(rooms)
      } catch (error) {
        console.error('Error fetching rooms:', error)
      }
    }
    fetchRooms()
  }, [user])

  // We load the messages from localStorage the first time the user logs in
  useEffect(() => {
    if (!user) return
    const existingMessagesDataString = localStorage.getItem(`roomMessagesData-${user.id}`)

    if (existingMessagesDataString !== null) {
      const existingMessages = JSON.parse(existingMessagesDataString)
      setMessagesData(existingMessages)
    }
  }, [user])

  // We connect to each socket and listen for direct messages
  useEffect(() => {
    if (!user) return

    myRooms.forEach((room) => {
      roomSocket.connect()
      console.log('connecting to socket', `${room.id}-room-message`)

      roomSocket.on(`${room.id}-room-message`, (message: any) => {
        console.log('Room message received from-to', message.from)

        setMessagesData((prevMessages: MessagesData) => {
          const pendingMessages = prevMessages.pendingMessages
          const from = room.id

          if (pendingMessages[from]) {
            pendingMessages[from] += 1
          } else {
            pendingMessages[from] = 1
          }

          // Define a chatId
          const chatId = room.id

          const newMessageData = {
            messages: {
              ...prevMessages.messages,
              [chatId]: [...(prevMessages.messages[chatId] || []), message],
            },
            pendingMessages: pendingMessages,
          }

          localStorage.setItem(`roomMessagesData-${user.id}`, JSON.stringify(newMessageData))

          return newMessageData
        })
      })
    })

    return () => {
      myRooms.forEach((room) => {
        console.log('disconnecting from socket', `${room.id}-room-message`)
        roomSocket.removeAllListeners(`${room.id}-room-message`)
      })
      roomSocket.disconnect()
    }
  }, [myRooms, user])

  return (
    <RoomChatContext.Provider
      value={{ messagesData, setMessagesData, myRooms, reloadRooms, cleanPendingMessages }}
    >
      {children}
    </RoomChatContext.Provider>
  )
}
