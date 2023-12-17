// URL: /friends/chat/:friendId
import React, { useEffect, useState, useRef, useContext } from 'react'
import { useParams } from 'react-router-dom'

import styles from './style.module.css'

// Context
import { AuthContext } from 'auth'
import { DirectChatContext } from 'providers/directChat'

// Socket
import { chatSocket } from 'socket'

interface UserMessage {
  name: string
  id: string
}

interface Message {
  from: string
  to: string
  message: string
  timestamp: number
}

interface MessageBoxProps {
  userFrom: UserMessage
  userTo: UserMessage
  onSendMessage: (message: Message) => void
  onReceiveMessage: (message: Message) => void
  socket: any
  listenTo: string
}

const DirectChatPage = (props: MessageBoxProps) => {
  const { user } = useContext(AuthContext)
  const { messagesData, setMessagesData } = useContext(DirectChatContext)

  const { friendId } = useParams()
  const userId = user?.id

  const [newMessage, setNewMessage] = useState('')

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      chatSocket.emit(
        `${friendId}-direct-message`,
        JSON.stringify({
          from: userId,
          to: friendId,
          message: newMessage,
          timestamp: Date.now(),
        }),
      )
    }
    setNewMessage('')
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messagesData.messages])

  useEffect(() => {
    if (!userId || !friendId) return

    // Remove pending messages
    const pendingMessages = messagesData.pendingMessages
    if (pendingMessages[friendId] && pendingMessages[friendId] > 0) {
      pendingMessages[friendId] = 0
      setMessagesData({
        messages: messagesData.messages,
        pendingMessages: pendingMessages,
      })
    }
  }, [userId, friendId, messagesData, setMessagesData])

  return (
    <div className={styles.container}>
      <div className={styles.messagesBox} id="message-list">
        {messagesData.messages.map((msg: Message, index) => (
          <div key={index} className={styles.messageContainer}>
            <div className={styles.from}>{msg.from}</div>
            <div className={styles.timestamp}>{`[${new Date(msg.timestamp).toLocaleTimeString(
              undefined,
              { hour12: false },
            )}]:`}</div>
            <div className={styles.message}>{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div id="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default DirectChatPage
