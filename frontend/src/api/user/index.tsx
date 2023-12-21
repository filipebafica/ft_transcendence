import axiosInstance from '../config.api'

const getUserAdapter = (user: any) => {
  const imageSrc = user.avatar ? `data:image/jpeg;base64,${user.avatar}` : "";
  return { ...user, avatar: imageSrc}
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

export const updateUserNickname = async (userId: number, nickname: string) => {
  const response = await axiosInstance.patch(`/users/${userId}`, { nickname })
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

export const enable2FA = async (userId: string) => {
  const response = await axiosInstance.post('/auth/2fa', { userId })
  return response.data
}

export const authenticate2FA = async (userId: string, token: string) => {
  const response = await axiosInstance.post('/auth/2fa/authenticate', { userId, token })
  return response.data
}
