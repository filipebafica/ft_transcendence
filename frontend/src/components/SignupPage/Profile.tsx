import React, { useRef, useContext } from 'react'
import { Avatar, Button, IconButton, TextField } from '@mui/material'
// import default_avatar from "../../assets/default_avatar.png";
import styles from './style.module.css'

// API
import { updateUserNickname } from 'api/user'
import { updateUserAvatar } from 'api/user'
import { enable2FA } from 'api/user'

import { AuthContext } from '../../auth'

function Profile() {
  const inputFile = useRef<HTMLInputElement>(null)
  const { user, refreshUser } = useContext(AuthContext)

  const [nickName, setNickname] = React.useState<string>(user?.nickname || '')

  const handleAvatarUpload = () => {
    // TODO: upload avatar
    if (inputFile.current) inputFile.current.click()
  }

  const handleTwoFactor = async () => {
    if (!user?.id) return
    console.log('Two Factor Button')
    const res = await enable2FA(user?.id)
    console.log(res)
  }

  const handleUpdate = () => {
    if (!user?.id) return
    if (nickName === user?.nickname) return
    if (nickName === '') return
    updateUserNickname(user?.id, nickName)
      .then((res) => {
        setNickname(res.nickname)
      })
      .catch((err) => {
        console.log(err)
        setNickname(user?.nickname || '')
      })
  }

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0]
    console.log('handleFileChange', file)
    if (!file) return
    if (!user?.id) return

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const base64String = reader.result as string
      const base64Image = base64String.split(',')[1]
      try {
       	await updateUserAvatar(user?.id, base64Image)
		refreshUser()
      } catch (error) {
        console.error(error) // Handle the error
      }
    }
    reader.onerror = (error) => {
      console.error('Error converting image to Base64', error)
    }
  }
  console.log('user', user)

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <TextField
          label="Nickname"
          variant="outlined"
          value={nickName}
          onChange={(e) => {
            setNickname(e.target.value)
          }}
        />
        <Button variant="contained" onClick={handleUpdate}>
          Update Nickname
        </Button>
        <div className={styles.avatar}>
          <input
            accept="image/*"
            id="contained-button-file"
            ref={inputFile}
            type="file"
            onChange={handleFileChange}
          />
          <IconButton onClick={handleAvatarUpload}>
            <Avatar src={user?.avatar || ""} sx={{ width: 160, height: 160 }}></Avatar>
          </IconButton>
        </div>
      </div>
      <div className={styles.twoFactor}>
        <h3>Security</h3>
        <Button variant="outlined" onClick={handleTwoFactor}>
          Enable two factor authentication
        </Button>
      </div>
    </div>
  )
}

export default Profile
