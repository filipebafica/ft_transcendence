import axiosInstance from '../config.api'

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

// Generate
// Turn on
// Authenticate