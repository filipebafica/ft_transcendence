import axiosInstance from '../config.api'

const getUserAdapter = (user: any) => {
  const imageSrc = user.avatar ? `data:image/jpeg;base64,${user.avatar}` : ''
  return { ...user, avatar: imageSrc }
}

export const getMyUser = async () => {
  const response = await axiosInstance.get('/users/me')
  return getUserAdapter(response.data)
}

export const getUser = async (userId: string) => {
  const response = await axiosInstance.get(`/users/${userId}`)
  const userData = getUserAdapter(response.data)
  return userData
}

export const updateUserNickname = async (userId: number, nick_name: string) => {
  const response = await axiosInstance.patch(`/users/${userId}`, { nick_name })
  return response.data
}

export const updateUserAvatar = async (userId: number, avatar: string) => {
  const response = await axiosInstance.patch(`/users/${userId}`, { avatar })
  return response.data
}

export const login = async () => {
  const response = await axiosInstance.get('/auth/login')
  return response.data
}

export const enable2FA = async (code: number) => {
  const response = await axiosInstance.post('/auth/twoFactor/enable', {
    twoFactorAuthenticationCode: code.toString(),
  })
  return response.data
}

export const authenticate2FA = async (twoFactorAuthenticationCode: string) => {
  const response = await axiosInstance.post('/auth/twoFactor/login', { twoFactorAuthenticationCode })
  return response.data
}

export const generate2FA = async () => {
  const response = await axiosInstance.post('/auth/twoFactor/generate')
  return response.data
}