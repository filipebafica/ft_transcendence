import React, { createContext, useEffect, useState, useContext } from 'react'

// Socket
import { chatSocket } from 'socket'

// Provider
import { AuthContext } from 'auth'

interface Message {
  from: string
  to: string
  message: string
  timeStamp: number
}

interface MessagesData {
  messages: Message[],
  pendingMessages: {
    [key: string /* userId */]: number
  }
}

export const DirectChatContext = createContext({
  messagesData: {messages: [], pendingMessages: {}} as MessagesData,
  setMessagesData: (messages: MessagesData) => {}
})

export const DirectChatProvider = (props: { children: any }) => {
  const { children } = props
  const [messagesData, setMessagesData ] = useState({messages: [], pendingMessages: {}} as MessagesData)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (!user) return
    const existingMessagesDataString = localStorage.getItem('messagesData')
    if (existingMessagesDataString !== null) {
      const existingMessages = JSON.parse(existingMessagesDataString)
      setMessagesData(existingMessages)
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    console.log('connecting to socket', `${user.id}-direct-message`)
    chatSocket.on(`${user.id}-direct-message`, (message: any) => {
      console.log('direct message received', message)
      setMessagesData((prevMessages: MessagesData) => { 
        const pendingMessages = prevMessages.pendingMessages
        const from = message.from

        if (pendingMessages[from]) {
          pendingMessages[from] += 1
        } else {
          pendingMessages[from] = 1
        }

        const newMessageData = {
          messages: [...prevMessages.messages, message],
          pendingMessages: pendingMessages
        }

        localStorage.setItem('messagesData', JSON.stringify(newMessageData))

        return newMessageData
      })
    })

    return () => {
      chatSocket.disconnect()
    }
  }, [user])

  return (
    <DirectChatContext.Provider value={{ messagesData, setMessagesData }}>
      {children}
    </DirectChatContext.Provider>
  )
}
