import React, { useRef, useContext } from 'react'
import { Avatar, Button, IconButton, TextField, Dialog } from '@mui/material'
// import default_avatar from "../../assets/default_avatar.png";
import styles from './style.module.css'

// API
import { updateUserNickname } from 'api/user'
import { updateUserAvatar } from 'api/user'
import { enable2FA } from 'api/user'
import { generate2FA } from 'api/user'

import { AuthContext } from '../../auth'
import { useSnackbar } from 'providers'

function Profile() {
  const inputFile = useRef<HTMLInputElement>(null)

  const { user, refreshUser, setToken } = useContext(AuthContext)
  const { showSnackbar } = useSnackbar()

  const [nickName, setNickname] = React.useState<string>(user?.nick_name || '')
  const [twoFactorModal, setTwoFactorModal] = React.useState<boolean>(false)
  const [twoFactoQR, setTwoFactorQR] = React.useState<string>('')
  const [twoFactorCode, setTwoFactorCode] = React.useState<number>(0)

  const handleAvatarUpload = () => {
    // TODO: upload avatar
    if (inputFile.current) inputFile.current.click()
  }

  const handleTwoFactor = async () => {
    if (!user?.id) return

    console.log('Two Factor Button')
    try {
      const res = await generate2FA()

      setTwoFactorModal(true)
      setTwoFactorQR(res)
    } catch (err) {
      console.log(err)
      showSnackbar('Something went wrong, try again', 'error')
    }
  }

  const handleUpdate = () => {
    if (!user?.id) return
    if (nickName === user?.nick_name) return
    if (nickName === '') return

    updateUserNickname(user?.id, nickName)
      .then((res) => {
        setNickname(res.nickname)
        refreshUser()
      })
      .catch((err) => {
        setNickname(user?.nick_name || '')
      })
  }

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0]
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
        console.log('Error update avatar', error)
        showSnackbar('Something went wrong, try again', 'error')
      }
    }
    reader.onerror = (error) => {
      console.error('Error converting image to Base64', error)
    }
  }

  const onAuthenticate = async () => {
    if (!user?.id) return
    if (twoFactorCode === 0) return
    try {
      const res = await enable2FA(twoFactorCode)
      setTwoFactorModal(false)

      // Get token
      const token = res.access_token

      // Save token to local storage and context
      setToken(token)
    } catch (error) {
      console.log('Error enable 2FA', error)
      showSnackbar('Something went wrong, try again', 'error')
    }
  }

  return (
    <div className={styles.container}>
      {
        <Dialog
          open={twoFactorModal}
          onClose={() => setTwoFactorModal(false)}
          className={styles.TwoFAContainer}
        >
          <div className={styles.twoFactorModal}>
            <h3>Two Factor Authentication</h3>
            <div className={styles.twoFactorModalContent}>
              <div className={styles.twoFactorModalQR}>
                <img src={twoFactoQR} alt={'2fa'} />
              </div>
              <div className={styles.twoFactorModalCode}>
                <TextField
                  label="Code"
                  variant="outlined"
                  onChange={(e) => {
                    setTwoFactorCode(parseInt(e.target.value))
                  }}
                />
                <Button variant="outlined" onClick={() => onAuthenticate()}>
                  Authenticate
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      }
      <div className={styles.profile}>
        <TextField
          label="Nickname"
          variant="outlined"
          placeholder={nickName}
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
            <Avatar src={user?.avatar || ''} sx={{ width: 160, height: 160 }}></Avatar>
          </IconButton>
        </div>
      </div>
      <div className={styles.twoFactor}>
        <h3>Security</h3>
        <Button
          variant="outlined"
          onClick={handleTwoFactor}
          disabled={user?.isTwoFactorAuthenticationEnabled}
        >
          {user?.isTwoFactorAuthenticationEnabled
            ? 'Two factor authentication already enabled'
            : 'Enable two factor authentication'}
        </Button>
      </div>
    </div>
  )
}

export default Profile
