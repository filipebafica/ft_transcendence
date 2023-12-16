import React from 'react'

// Style
import styles from './style.module.css'

// Components
import Avatar from '@mui/material/Avatar'
import StyledBadge from '@mui/material/Badge'

interface FriendProps {
	  friend: any
}

function Friend(props: FriendProps) {
  const { friend } = props


  return (
    <div className={styles.friendContainer}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
		className={`${styles.friendBadge} ${friend.status === 'online' ? styles.online : styles.offline}`}
      >
        <Avatar alt={friend.username} src={friend.avatar} />
      </StyledBadge>
      <div className={styles.friendInfo}>
        <h3>{friend.name}</h3>
        <p>{friend.status}</p>
      </div>
    </div>
  )
}

export default Friend