// URL: /chatRoom/chat/:roomId
import React, { useEffect, useState, useRef, useContext, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import styles from './style.module.css'

// API
import { listRoomMembers, getRoomName } from 'api/room'
import { toggleAdmin } from 'api/room'
import { removeMember } from 'api/room'
import { banMember } from 'api/room'
// import { unBanMember } from 'api/room'
import { muteMember } from 'api/room'
import { unMuteMember } from 'api/room'
import { changePassword } from 'api/room'

// Context
import { AuthContext } from 'auth'
import { RoomChatContext } from 'providers/roomChat'

// Component
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import RoomUserCard from './RoomUserCard'
import AlertDialog from './AlertDialog'

// Socket
import { roomSocket } from 'socket'
import { roomActionsSocket } from 'socket'

// Hooks
import { useSnackbar } from 'providers'

interface Member {
  isOwner: boolean
  isAdmin: boolean
  isMuted: boolean
  user: {
    id: string
    name: string
    nickName: string
  }
}

interface Message {
  from: string
  to: string
  message: string
  timeStamp: number
}

const roomActions = {
  USER_HAS_JOINED_ROOM: 'USER_HAS_JOINED_ROOM',
  USER_HAS_BEEN_BANNED_FROM_ROOM: 'USER_HAS_BEEN_BANNED_FROM_ROOM',
  USER_HAS_BEEN_MUTED_IN_ROOM: 'USER_HAS_BEEN_MUTED_IN_ROOM',
  USER_HAS_BEEN_REMOVED_FROM_ROOM: 'USER_HAS_BEEN_REMOVED_FROM_ROOM',
  USER_HAS_ADMIN_PRIVILEGE_CHANGED_IN_ROOM: 'USER_HAS_ADMIN_PRIVILEGE_CHANGED_IN_ROOM',
  USER_HAS_BEEN_UNMUTED_IN_ROOM: 'USER_HAS_BEEN_UNMUTED_IN_ROOM',
}

interface RoomActionMessage {
  room: string
  user: string
  action: string
  timeStamp: number
}

const Chat = () => {
  const { user } = useContext(AuthContext)
  const { messagesData, cleanPendingMessages } = useContext(RoomChatContext)

  const [members, setMembers] = useState([] as Member[])
  const [userRole, setUserRole] = useState<'admin' | 'owner' | 'member'>('member')
  const [isMuted, setIsMuted] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [roomPassword, setRoomPassword] = useState('' as string)

  const { roomId } = useParams()
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()
  const userId = user?.id

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Send message to messageRouter event
  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      console.log('sending message to event room', `messageRouter`)
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
    const member = members.find(
      (member: Member) => member.user.id.toString() === userId?.toString(),
    )
    if (member) {
      if (member.isOwner) setUserRole('owner')
      else if (member.isAdmin) setUserRole('admin')

      if (member.isMuted) setIsMuted(true)
      else setIsMuted(false)
    }
    console.log('Members', members)

    // Room Name
    const roomName = await getRoomName(roomId)
    setRoomName(roomName)
    setMembers(members)
  }, [roomId, userId])

  // Fetch members of the room
  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  // Check for changes in the messageData
  useEffect(() => {
    if (!userId || !roomId) return

    // Remove pending messages
    cleanPendingMessages(roomId)
  }, [cleanPendingMessages, roomId, userId, messagesData.messages])

  // Handlers
  const handleSetAdmin = async (memberId: string, toggle: boolean) => {
    if (!user?.id) return
    if (!roomId) return

    try {
      const res = await toggleAdmin(user?.id, Number(memberId), roomId, toggle)
      console.log('Admin res', res)
    } catch (error) {
      console.error('Error setting admin:', error)
    }
  }

  const handleOnKick = async (memberId: string) => {
    if (!user?.id) return
    if (!roomId) return

    try {
      const res = await removeMember(user?.id, Number(memberId), roomId)
      console.log('Kick res', res)
    } catch (error) {
      console.error('Error kicking member:', error)
    }
  }

  const handleOnBan = async (memberId: string) => {
    if (!user?.id) return
    if (!roomId) return

    try {
      const res = await banMember(user?.id, Number(memberId), roomId)
      console.log('Ban res', res)
    } catch (error) {
      console.error('Error banning member:', error)
    }
  }

  const handleOnMute = async (memberId: string) => {
    if (!user?.id) return
    if (!roomId) return

    try {
      const memberIsMuted = members.find(
        (member: Member) => member.user.id.toString() === memberId.toString(),
      )?.isMuted

      if (memberIsMuted) {
        // Unmute
        const res = await unMuteMember(user?.id, Number(memberId), roomId)
        console.log('Unmute res', res)
        return
      } else {
        // Mute
        const res = await muteMember(user?.id, Number(memberId), roomId, 10)
        console.log('Mute res', res)
      }
    } catch (error) {
      console.error('Error muting member:', error)
    }
  }

  const handleRoomPassword = async () => {
    if (!user?.id || !roomId ) return
    if (roomPassword.trim() === '') {
      showSnackbar('Password cannot be empty', 'error');
      return
    }

    try {
      await changePassword(user?.id, roomId, roomPassword)
    }
    catch (error) {
      console.error('Error changing room password:', error)
    }
  }


  // Check for changes in the room members (bans, mutes etc)
  useEffect(() => {
    if (!roomId) return

    console.log('Listening to room action messages', `${roomId}-room-participants-action-message`)
    roomActionsSocket.on(`${roomId}-room-participants-action-message`, (message: RoomActionMessage) => {
      console.log('Room action message received', message.action)
      const isCurrentUser = message.user.toString() === userId?.toString()

      if (message.action === roomActions.USER_HAS_JOINED_ROOM) {
        fetchMembers()
      } else if (message.action === roomActions.USER_HAS_BEEN_BANNED_FROM_ROOM) {
        if (isCurrentUser) {
          setShowAlert(true)
          setAlertMessage('You have been banned from this room')
        }
        fetchMembers()
      } else if (message.action === roomActions.USER_HAS_BEEN_MUTED_IN_ROOM) {
        if (isCurrentUser) {
          showSnackbar('You have been muted', 'warning');
        }
        fetchMembers()
      } else if (message.action === roomActions.USER_HAS_BEEN_UNMUTED_IN_ROOM) {
        if (isCurrentUser) {
          showSnackbar('You have been unmuted', 'info');
        }
        fetchMembers()
      } else if (message.action === roomActions.USER_HAS_BEEN_REMOVED_FROM_ROOM) {
        if (message.user.toString() === userId?.toString()) {
          setShowAlert(true)
          setAlertMessage('You have been removed from this room')
        }
        fetchMembers()
      } else if (message.action === roomActions.USER_HAS_ADMIN_PRIVILEGE_CHANGED_IN_ROOM) {
        if (isCurrentUser) {
          if (userRole === 'member')
            showSnackbar('You are now an admin', 'info');
          else
            showSnackbar('You are no longer an admin', 'info');
        }
        fetchMembers()
      }
    })

    return () => {
      console.log('Removing listener', `${roomId}-room-participants-action-message`)
      roomActionsSocket.off(`${roomId}-room-participants-action-message`)
    }
  }, [roomId, userId, userRole, fetchMembers, showSnackbar]) 

  return (
    <div className={styles.container}>
      <div className={styles.chatSection}>
        <h2>Room: {roomName}</h2>
        <div className={styles.messagesBox} id="message-list">
          {roomId &&
            (messagesData.messages[roomId!] || []).map((msg: Message, index) => {
              const member = members.find((member: Member) => member.user.id === msg.from)

              return (
                <div key={index} className={styles.messageContainer}>
                  <div className={styles.from}>{member?.user.nickName}</div>
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
            disabled={isMuted}
          />
          <Button onClick={sendMessage} variant="outlined" disabled={isMuted}>
            Send
          </Button>
        </div>
      </div>
      <div className={styles.usersSection}>
        <h2> Members: {members.length}</h2>
        {members.map((member: Member) => {
          return (
            <RoomUserCard
              member={member}
              userRole={userRole}
              onSetAdmin={handleSetAdmin}
              onKick={handleOnKick}
              onBan={handleOnBan}
              onMute={handleOnMute}
            />
          )
        })}
      </div>
      { userRole === 'owner' &&
        <div className={styles.updatePasswordSection}>
        <h2> Change Room Password </h2>
        <TextField
          type="password"
          size="small"
          value={roomPassword}
          onChange={(e) => setRoomPassword(e.target.value)}/>
        <Button onClick={handleRoomPassword} variant="outlined" disabled={isMuted} >
          Change Password
        </Button>
        </div>
      }

      {showAlert && (
        <AlertDialog
          message={alertMessage}
          onAccept={() => {
            setShowAlert(false)
            navigate('/')
          }}
          isOpen={showAlert}
        />
      )}
    </div>
  )
}

export default Chat
