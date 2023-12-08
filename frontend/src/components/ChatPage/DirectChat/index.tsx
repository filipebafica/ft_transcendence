import React, { useState } from 'react'
import MessageBox from '../Shared/MessageBox'

import { chatSocket } from 'socket'

import styles from './style.module.css'

const DirectChat = () => {
  const [userFrom, setUserFrom] = useState({ name: '', id: '' })
  const [userTo, setUserTo] = useState({ name: '', id: '' })
  const [isConfigComplete, setIsConfigComplete] = useState(false)

  const handleStartChat = () => {
    if (userFrom.name && userTo.name) {
      setIsConfigComplete(true)
    } else {
      alert('Please enter both user names')
    }
  }

  if (isConfigComplete) {
    return (
      <MessageBox
        userFrom={userFrom}
        userTo={userTo}
        socket={chatSocket}
        listenTo={userFrom.name + userTo.name}
        onSendMessage={(message) => {
          chatSocket.emit(
            'messageRouter',
            JSON.stringify({ from: userFrom.name, to: userTo.name, message }),
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
      <input
        type="text"
        value={userFrom.name}
        onChange={(e) => setUserFrom({ ...userFrom, name: e.target.value })}
        placeholder="Your Name"
      />
      <input
        type="text"
        value={userTo.name}
        onChange={(e) => setUserTo({ ...userTo, name: e.target.value })}
        placeholder="Recipient Name"
      />
      <button onClick={handleStartChat}>Start Chat</button>
    </div>
  )
}

export default DirectChat
