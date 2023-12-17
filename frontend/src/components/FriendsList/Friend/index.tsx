import React, { useContext } from 'react'

// Style
import styles from './style.module.css'

// Components
import Avatar from '@mui/material/Avatar'
import StyledBadge from '@mui/material/Badge'

// Context
import { DirectChatContext } from 'providers/directChat'

interface FriendProps {
  friend: {
    id: string
    nickName: string
    userStatus: string
    avatar?: string
  }
}

const userStatuses = {
  online: 'Online',
  offline: 'Offline',
  [`in-game`]: 'In Game'
}

function Friend(props: FriendProps) {
  const { friend } = props
  const { messagesData } = useContext(DirectChatContext)

  const pendingMessages = messagesData.pendingMessages[friend.id] || 0

  return (
    <div className={styles.friendContainer}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        className={`${styles.friendBadge} ${
          friend.userStatus === 'online' ? styles.online : styles.offline
        }`}
      >
        <Avatar alt={friend.nickName} src={friend.avatar} />
      </StyledBadge>
      <div className={styles.friendInfo}>
        <h3>{friend.nickName}</h3>
        <p>{friend.userStatus ? userStatuses[friend.userStatus as 'online'] : userStatuses.offline }</p>
      </div>
      {pendingMessages !== 0 && (
        <div className={styles.pendingMessages}>
          <p> {pendingMessages}</p>
        </div>
      )}
    </div>
  )
}

export default Friend
