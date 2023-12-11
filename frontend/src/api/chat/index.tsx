import axiosInstance from '../config.api'

interface Room {
	name: string
	type: "public" | "private"
	password: string
}

export const createRoom = async (room: Room) => {
  const response = await axiosInstance.post('/room/create', { ...room })
  return response.data
}

export const listPublicRooms = async () => {
  const response = await axiosInstance.get('/room/list/all')
  return response.data
}
