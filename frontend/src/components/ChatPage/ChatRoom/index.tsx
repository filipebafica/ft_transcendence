import React, { useEffect, useState } from 'react'

import { socket } from '../../../socket'

interface UserMessage {
  name: string
  id: string
}

interface ChatRoomProps {
  userFrom: UserMessage
  userTo: UserMessage
}

const ChatRoom = (props: ChatRoomProps) => {
  const { userFrom, userTo } = props
  const [messages, setMessages] = useState([] as string[])
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      console.log('newMessage', newMessage)

      socket.emit(
        'messageRouter',
        JSON.stringify({ from: userFrom.name, to: userTo.name, message: newMessage }),
      )
    }
  }

  useEffect(() => {
    socket.on(userFrom.name, (message: any) => {
          const { from, to, message: msg } = message
          if (from === userFrom.name && to === userTo.name) {
            setMessages((prevMessages) => [...prevMessages, msg])
          }
      return (
        setMessages((prevMessages) => [...prevMessages, msg])
      )
    })
  }, [])

  return (
    <div>
      <div id="message-list">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
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

export default ChatRoom
