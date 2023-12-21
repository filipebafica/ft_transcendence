import axiosInstance from '../config.api'

interface Room {
  userId: number
	roomName: string
	isPublic: boolean
	password?: string
}

interface JoinConfig {
  roomId: string
  userId: number
  isOwner: boolean,
  isAdmin: boolean
}

export const createRoom = async (room: Room) => {
  const response = await axiosInstance.post('/room/create', { ...room })
  return response.data
}

export const joinRoom = async (joinConfig: JoinConfig) => {
  const response = await axiosInstance.post('/room/join', {...joinConfig})
  return response.data
}

export const listAvailableRooms = async () => {
  const response = await axiosInstance.get('/room/list')
  return response.data
}

export const listMyRooms = async (userId: number) => {
  const response = await axiosInstance.get(`/room/list/${userId}`)
  return response.data
}
