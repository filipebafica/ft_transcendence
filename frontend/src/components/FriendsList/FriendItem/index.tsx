import React from 'react'

// Components
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import Friend from '../Friend'

interface FriendItemProps {
  friend: {
    id: string
    nickName: string
    userStatus: string
  }
  onProfileClick: (friendId: string) => void
  onChatClick: (friendId: string) => void
  onBlockClick: (friendId: string) => void
}

const FriendItem = ({ friend, onProfileClick, onChatClick, onBlockClick }: FriendItemProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleFriendClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <ListItem disablePadding>
        <ListItemButton onClick={handleFriendClick}>
          <Friend key={friend.id} friend={friend} />
        </ListItemButton>
      </ListItem>
      <Menu
        id={`menu-appbar-${friend.id}`}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <MenuItem key={'profile'} onClick={() => onProfileClick(friend.id)}>
          <Typography textAlign="center">Profile</Typography>
        </MenuItem>
        <MenuItem key={'chat'} onClick={() => onChatClick(friend.id)}>
          <Typography textAlign="center">Chat </Typography>
        </MenuItem>
        <MenuItem key={'block'} onClick={() => onBlockClick(friend.id)}>
          <Typography textAlign="center">Block</Typography>
        </MenuItem>
      </Menu>
      <Divider component="li" />
    </div>
  )
}

export default FriendItem