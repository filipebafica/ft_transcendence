import axiosInstance from '../config.api'

export const addFriend = async (userId: number, friendNickName: string) => {
  const response = await axiosInstance.post('/friend', { userId, friendNickName: friendNickName })
  return response.data
}

export const listFriends = async (userId: number) => {
  const response = await axiosInstance.get(`/friend/${userId}`)
  return response.data.data
}
