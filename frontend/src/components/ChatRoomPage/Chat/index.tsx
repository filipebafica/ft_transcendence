// URL: /chatRoom/chat/:roomId
import React, { useEffect, useState, useRef, useContext, useCallback } from 'react'
import { useParams } from 'react-router-dom'

import styles from './style.module.css'

// API
import { listRoomMembers, getRoomName } from 'api/room'
import { toggleAdmin} from 'api/room'
import { removeMember } from 'api/room'
import { banMember } from 'api/room'
// import { unBanMember } from 'api/room'
import { muteMember } from 'api/room'
// import { unMuteMember } from 'api/room'

// Context
import { AuthContext } from 'auth'
import { RoomChatContext } from 'providers/roomChat'

// Component
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import RoomUserCard from './RoomUserCard'

// Socket
import { roomSocket } from 'socket'

interface Member {
  isOwner: boolean
  isAdmin: boolean
  user: {
    id: string
    name: string
    nickName: string
  }
}

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

const Chat = (props: MessageBoxProps) => {
  const { user } = useContext(AuthContext)
  const { messagesData, cleanPendingMessages } = useContext(RoomChatContext)

  const [members, setMembers] = useState([] as Member[])
  const [userRole, setUserRole] = useState<'admin' | 'owner' | 'member'>('member')
  const [roomName, setRoomName] = useState('')
  const [newMessage, setNewMessage] = useState('')

  const { roomId } = useParams()
  const userId = user?.id

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Send message to messageRouter event
  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      console.log('sending message to event', `messageRouter`)
      roomSocket.emit(
        `messageRouter`,
        JSON.stringify({
          from: userId,
          room: roomId,
          message: newMessage,
          timeStamp: Date.now(),
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

  const fetchMembers = useCallback(async () => {
    if (!roomId) return
    const members = await listRoomMembers(roomId)

    // Check if user is admin or owner
    const member = members.find((member: Member) => member.user.id.toString() === userId?.toString())
    if (member) {
      if (member.isOwner) setUserRole('owner')
      else if (member.isAdmin) setUserRole('admin')
    }
    console.log('Members', members)

    // Room Name
    const roomName = await getRoomName(roomId)
    setRoomName(roomName)
    setMembers(members)
  },[roomId, userId])

  // Fetch members of the room
  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  // Check for changes in the messageData
  useEffect(() => {
    if (!userId || !roomId) return

    // Remove pending messages
    cleanPendingMessages(roomId)
  }, [cleanPendingMessages, roomId, userId]) 

  // Handlers
  const handleSetAdmin = async (memberId: string, toggle: boolean) => {
    if (!user?.id) return
    if (!roomId) return

    try {
      const res = await toggleAdmin(user?.id, Number(memberId), roomId, toggle)
      console.log('Admin res', res)
      fetchMembers()
    }
    catch (error) {
      console.error('Error setting admin:', error)
    }
  }

  const handleOnKick = async (memberId: string) => {
    if (!user?.id) return
    if (!roomId) return

    try {
      const res = await removeMember(user?.id, Number(memberId), roomId)
      console.log('Kick res', res)
      fetchMembers()
    }
    catch (error) {
      console.error('Error kicking member:', error)
    }
  }

  const handleOnBan = async (memberId: string) => {
    if (!user?.id) return
    if (!roomId) return

    try {
      const res = await banMember(user?.id, Number(memberId), roomId)
      console.log('Ban res', res)
      fetchMembers()
    }
    catch (error) {
      console.error('Error banning member:', error)
    }
  }

  const handleOnMute = async (memberId: string) => {
    if (!user?.id) return
    if (!roomId) return

    try {
      const res = await muteMember(user?.id, Number(memberId), roomId, 10)
      console.log('Mute res', res)
      fetchMembers()
    }
    catch (error) {
      console.error('Error muting member:', error)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.chatSection}>
        <h2>Room: {roomName}</h2>
        <div className={styles.messagesBox} id="message-list">
          {roomId && (messagesData.messages[roomId!] || []).map((msg: Message, index) => {
            const member = members.find((member: Member) => member.user.id === msg.from)

            return <div key={index} className={styles.messageContainer}>
              <div className={styles.from}>{member?.user.nickName}</div>
              <div className={styles.timeStamp}>{`[${new Date(msg.timeStamp).toLocaleTimeString(
                undefined,
                { hour12: false },
              )}]:`}</div>
              <div className={styles.message}>{msg.message}</div>
            </div>
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
      <div className={styles.usersSection}>
        <h2> Members: {members.length}</h2>
        {members.map((member: Member) => {
          return <RoomUserCard 
            member={member} 
            userRole={userRole} 
            onSetAdmin={handleSetAdmin}
            onKick={handleOnKick}
            onBan={handleOnBan}
            onMute={handleOnMute}
            />
        })}
      </div>
    </div>
  )
}

export default Chat
