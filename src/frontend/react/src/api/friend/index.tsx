import axiosInstance from '../config.api'

export const addFriend = async (userId: number, friendNickName: string) => {
  const response = await axiosInstance.post('/friend', { userId, friendNickName: friendNickName })
  return response.data
}

export const listFriends = async (userId: number) => {
  const response = await axiosInstance.get(`/friend/${userId}`)
  return response.data.data
}

export const blockFriend = async (userId: number, friendId: number) => {
  const response = await axiosInstance.post('/chat/block', {
    blockerUserId: userId,
    targetUserId: friendId,
  })
  return response.data
}

export const unblockFriend = async (userId: number, friendId: number) => {
  const response = await axiosInstance.delete('/chat/unblock', {
    data: { unBlockerUserId: userId, targetUserId: friendId },
  })
  return response.data
}
