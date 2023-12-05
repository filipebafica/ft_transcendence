import React, { useEffect, useState, useRef } from 'react'

import { socket } from '../../../../socket'

import styles from './style.module.css'

interface UserMessage {
  name: string
  id: string
}

interface MessageBoxProps {
  userFrom: UserMessage
  userTo: UserMessage
}

interface Message {
  from: string
  to: string
  message: string
  timestamp: number
}

const MessageBox = (props: MessageBoxProps) => {
  const { userFrom, userTo } = props
  const [messages, setMessages] = useState([] as Message[])
  const [newMessage, setNewMessage] = useState('')

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      socket.emit(
        'messageRouter',
        JSON.stringify({ from: userFrom.name, to: userTo.name, message: newMessage }),
      )
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: userFrom.name, to: userTo.name, message: newMessage, timestamp: Date.now() },
      ])
    }
    setNewMessage('')
  }

  useEffect(() => {
    socket.on(userFrom.name, (msgResponse: any) => {
      const { from, to, message } = msgResponse
      const msg = { from, to, message, timestamp: Date.now() }

      if (from === userFrom.name && to === userTo.name) {
        setMessages((prevMessages) => [...prevMessages, msg])
      }
      return setMessages((prevMessages) => [...prevMessages, msg])
    })
  }, [userFrom.name, userTo.name])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={styles.container}>
      <div className={styles.messagesBox} id="message-list">
        {messages.map((msg: Message, index) => (
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

export default MessageBox
