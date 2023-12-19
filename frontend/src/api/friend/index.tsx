import axiosInstance from '../config.api'

export const addFriend = async (userId: string, friendNickName: string) => {
  const response = await axiosInstance.post('/friend', { userId, friendNickName: friendNickName })
  return response.data
}

export const listFriends = async (userId: string) => {
  const response = await axiosInstance.get(`/friend/${userId}`)
  return response.data.data
}
