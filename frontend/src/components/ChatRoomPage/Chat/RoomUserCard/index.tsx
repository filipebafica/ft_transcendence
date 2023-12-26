import React, { useEffect } from 'react'
import { useState, useContext } from 'react'

import { useNavigate } from "react-router-dom";

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

// API
import { getUser } from 'api/user'
import { addFriend } from 'api/friend'


// Icons
import { CiStar } from "react-icons/ci";
import { AiOutlineAudioMuted } from "react-icons/ai";


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
interface RoomUserCardProps {
  userRole: 'admin' | 'owner' | 'member'
  member: Member
  onAddFriend?: () => {}
  onSetAdmin?: (id: string, toggle: boolean) => {}
  onKick?: (memberId: string) => {}
  onBan?: (memberId: string) => {}
  onMute?: (memberId: string) => {}
}

const RoomUserCard = (props: RoomUserCardProps) => {
  // const navigate = useNavigate();
  const { member } = props
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const [avatar, setAvatar] = useState('' as string)

  const handleOpenOptionsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseOptionsMenu = () => {
    setAnchorElUser(null)
  }

  useEffect(() => {
    if (!member.user.id) return
    getUser(member.user.id)
      .then((res) => {
        const avatar = res.avatar
        setAvatar(avatar)
      })
      .catch((err: any) => {
        console.log('Error fetchin user avatar', err)
      })
  }, [member.user.id])

  // Handlers
  const handleAddFriend = async (userId: string) => {
    if (!user?.id) return
    
    try {
      await addFriend(user?.id, member.user.nickName)
    }
    catch (error) {
      console.error('Error adding friend:', error)
    }
  }

  const handleSeeProfile = () => {
    navigate(`/stats/${member.user.id}`)
  }

  const handleKick = (memberId: string) => {
    props.onKick && props.onKick(memberId)
    handleCloseOptionsMenu()
  }

  const handleClickBan = (memberId: string) => {
    props.onBan && props.onBan(memberId)
    handleCloseOptionsMenu()
  }

  const handleClickMute = (memberId: string) => {
    props.onMute && props.onMute(memberId)
    handleCloseOptionsMenu()
  }

  return (
    <Card className={styles.userCard}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar src={avatar} alt={member.user.nickName} />
          <Box className={styles.infos}>
            <div className={styles.userName}>
              <span> {member.user.nickName} </span> 
              {member.isOwner && <CiStar className={styles.ownerIcon}/>}
              {member.isMuted && <AiOutlineAudioMuted className={styles.mutedIcon}/>}
            </div>
            <CardActions>
              <Button
                size="small"
                color="secondary"
                disabled={member.user.id.toString() === user?.id.toString()}
                onClick={() => handleAddFriend(member.user.id)}
              >
                Add Friend
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
                    key={'seeProfile'}
                    onClick={handleSeeProfile}
                  >
                    <Typography textAlign="center">{'See Profile'}</Typography>
                  </MenuItem>
                  {props.userRole !== 'member' && (
                    <>
                      <MenuItem
                        key={'setAdmin'}
                        disabled={member.isOwner}
                        onClick={() => {
                          props.onSetAdmin && props.onSetAdmin(member.user.id, !(member.isAdmin))
                          handleCloseOptionsMenu()}
                        }
                      >
                        <Typography textAlign="center">{member.isAdmin ? 'Remove Admin' : 'Set Admin'}</Typography>
                      </MenuItem>
                      <MenuItem
                        key={'kick'}
                        disabled={member.isOwner}
                        onClick={() => handleKick(member.user.id)}
                      >
                        <Typography textAlign="center">{'Kick'}</Typography>
                      </MenuItem>
                      <MenuItem
                        key={'ban'}
                        disabled={member.isOwner}
                        onClick={() => handleClickBan(member.user.id)}
                      >
                        <Typography textAlign="center">{'Ban'}</Typography>
                      </MenuItem>
                      <MenuItem
                        key={'mute'}
                        disabled={member.isOwner}
                        onClick={() => handleClickMute(member.user.id)}
                      >
                        <Typography textAlign="center">{member.isMuted ? 'UnMute' : 'Mute'}</Typography>
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
