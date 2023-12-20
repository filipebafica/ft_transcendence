import React from 'react'
import { useState, useContext } from 'react'
// import { useNavigate } from "react-router-dom";

// Components
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { Box, Menu, MenuItem } from '@mui/material'
import { TfiAngleDown } from 'react-icons/tfi'
import styles from './style.module.css'

// Context
import { AuthContext } from 'auth'

interface Member {
  isOwner: boolean
  isAdmin: boolean
  user: {
    id: string
    name: string
    nickName: string
  }
}
interface RoomUserCardProps {
  userRole: 'admin' | 'owner' | 'member'
  member: Member
  onAddFriend?: () => {}
  onSetAdmin?: () => {}
  onKick?: () => {}
  onBan?: () => {}
  onMute?: () => {}
}

const RoomUserCard = (props: RoomUserCardProps) => {
  // const navigate = useNavigate();
  const { member } = props
  const { user } = useContext(AuthContext)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenOptionsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseOptionsMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <Card className={styles.userCard}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar src="" alt="" />
          <Box className={styles.infos}>
            <Typography gutterBottom variant="h5" component="div" className={styles.userName}>
              {member.user.nickName}
            </Typography>
            <CardActions>
              <Button
                size="small"
                color="secondary"
                disabled={member.user.id.toString() === user?.id.toString()}
                // onClick={() => navigate(`/stats/${friend.id}`)}
              >
                Invite to Duel
              </Button>
              <div>
                <Button
                  onClick={(e) => handleOpenOptionsMenu(e)}
                  disabled={member.user.id.toString() === user?.id.toString()}
                >
                  <TfiAngleDown />
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseOptionsMenu}
                >
                  <MenuItem
                    key={'addFriend'}
                    // onClick={handleClickAddFriend}
                  >
                    <Typography textAlign="center">{'Add friend'}</Typography>
                  </MenuItem>
                  {props.userRole !== 'member' && (
                    <>
                      <MenuItem
                        key={'setAdmin'}
                        // onClick={handleClickSetAdmin}
                      >
                        <Typography textAlign="center">{'Set as Admin'}</Typography>
                      </MenuItem>
                      <MenuItem
                        key={'kick'}
                        // onClick={handleClickKick}
                      >
                        <Typography textAlign="center">{'Kick'}</Typography>
                      </MenuItem>
                      <MenuItem
                        key={'ban'}
                        // onClick={handleClickBan}
                      >
                        <Typography textAlign="center">{'Ban'}</Typography>
                      </MenuItem>
                      <MenuItem
                        key={'mute'}
                        // onClick={handleClickMute}
                      >
                        <Typography textAlign="center">{'Mute'}</Typography>
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </div>
            </CardActions>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RoomUserCard
