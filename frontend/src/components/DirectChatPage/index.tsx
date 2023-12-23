// URL: /friends/chat/:friendId
import React, { useEffect, useState, useRef, useContext } from 'react'
import { useParams } from 'react-router-dom'

import styles from './style.module.css'

// Context
import { AuthContext } from 'auth'
import { DirectChatContext } from 'providers/directChat'

// Socket
import { chatSocket } from 'socket'

// Component
import FriendCard from './FriendCard'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Api
import { getUser } from 'api/user'

interface UserMessage {
  name: string
  id: string
}

interface Message {
  from: string
  to: string
  message: string
  timeStamp: number
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
  const [friendData, setFriendData] = useState({})

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData = {
        from: userId,
        to: Number(friendId),
        message: newMessage,
        timeStamp: Date.now(),
      }
      console.log('sending message to event messageRouter', messageData)
      chatSocket.emit(`messageRouter`, JSON.stringify(messageData))
    }
    setNewMessage('')
  }

  // Fetch friend data
  useEffect(() => {
    if (!friendId) return

    const fetchFriendData = async () => {
      const friend = await getUser(friendId)
      if (friend) {
        setFriendData(friend)
      }
    }
    fetchFriendData()
  }, [friendId])

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
      <div className={styles.chatSection}>
        <div className={styles.messagesBox} id="message-list">
          {friendId &&
            messagesData.messages[friendId]?.map((msg: Message, index) => {
              const from =
                msg.from.toString() === userId?.toString() ? 'Me' : (friendData as any)?.nick_name

              return (
                <div key={index} className={styles.messageContainer}>
                  <div className={styles.from}>{from}</div>
                  <div className={styles.timeStamp}>{`[${new Date(msg.timeStamp).toLocaleTimeString(
                    undefined,
                    { hour12: false },
                  )}]:`}</div>
                  <div className={styles.message}>{msg.message}</div>
                </div>
              )
            })}

          <div ref={messagesEndRef} />
        </div>
        <div className={styles.inputContainer}>
          <TextField
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            multiline
            rows={2}
          />
          <Button onClick={sendMessage} variant="outlined">
            Send
          </Button>
        </div>
      </div>
      <div className={styles.friendCard}>
        <FriendCard friend={friendData as any} />
      </div>
    </div>
  )
}

export default DirectChatPage
