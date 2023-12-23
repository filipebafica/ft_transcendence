import React, { useContext, useEffect, useState } from 'react'

// Style
import styles from './style.module.css'

// Components
import Avatar from '@mui/material/Avatar'
import StyledBadge from '@mui/material/Badge'
import Chip from '@mui/material/Chip'

// Context
import { DirectChatContext } from 'providers/directChat'

// Api
import { getUser } from 'api/user'

// Icons
import { MdBlock } from "react-icons/md";

interface FriendProps {
  friend: {
    id: string
    nickName: string
    userStatus: string
    avatar?: string
    isBlocked: boolean
  }
}

const userStatuses = {
  online: 'Online',
  offline: 'Offline',
  [`in-game`]: 'In Game',
  [`off-line`]: 'Offline',
}

function Friend(props: FriendProps) {
  const { friend } = props
  const { messagesData } = useContext(DirectChatContext)
  const [avatar, setAvatar] = useState<string>(friend.avatar || '')

  const pendingMessages = messagesData.pendingMessages[friend.id] || 0

  useEffect(() => {
    const fetchAvatar = async () => {
      if (friend.avatar) return

      const user = await getUser(friend.id)
      if (user) {
        setAvatar(user.avatar)
      }
    }
    fetchAvatar()
  }, [friend])

  return (
    <div className={styles.friendContainer}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        className={`${styles.friendBadge} ${
          friend.userStatus === 'online'
            ? styles.online
            : friend.userStatus === 'in-game'
            ? styles.inGame
            : styles.offline
        }`}
      >
        <Avatar alt={friend.nickName} src={avatar} />
      </StyledBadge>
      <div className={styles.friendInfo}>
        <h3>{friend.nickName}</h3>
        <p>
          {friend.userStatus ? userStatuses[friend.userStatus as 'online'] : userStatuses.offline}
          {
          friend.isBlocked && <MdBlock title={`User Blocked`}/>
          }
        </p>
      </div>
      {pendingMessages !== 0 && (
        <Chip
          className={styles.newMessages}
          label={`${pendingMessages} new message${pendingMessages > 1 ? 's' : ''}`}
          variant="outlined"
        />
      )}
    </div>
  )
}

export default Friend
