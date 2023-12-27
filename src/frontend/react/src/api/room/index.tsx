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
  isAdmin: boolean,
  password?: string
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
  const response = await axiosInstance.get(`/room/list/user/${userId}`)
  return response.data
}

export const listRoomMembers = async (roomId: string) => {
  const response = await axiosInstance.get(`/room/list`)
  const rooms = response.data.data
  const room = rooms.find((room: any) => room.id?.toString() === roomId?.toString())
  return room.participants
}

export const getRoomName = async (roomId: string) => {
  const response = await axiosInstance.get(`/room/list`)
  const rooms = response.data.data
  const room = rooms.find((room: any) => room.id?.toString() === roomId?.toString())
  return room.name
}

export const toggleAdmin = async (requesterId: number, targetId: number, roomId: string, toogle: boolean) => {
  const response = await axiosInstance.put(`/room/admin/toggle`, {
    requesterId,
    targetId,
    roomId,
    toogle
  })
  return response.data
}

export const removeMember = async (removerUserId: number, removedUserId: number, roomId: string) => {
  const response = await axiosInstance.delete(`/room/user/remove`, {
    data: {
      removerUserId,
      removedUserId,
      roomId
    }
  })
  return response.data
}

export const banMember = async (bannerUserId: number, bannedUserId: number, roomId: string) => {
  const response = await axiosInstance.post(`/room/user/ban`, {
    bannerUserId,
    bannedUserId,
    roomId
  })
  return response.data
}

export const unBanMember = async (unbannerUserId: number, unbannedUserId: number, roomId: string) => {
  const response = await axiosInstance.delete(`/room/user/unban`, {
    data: {
      unbannerUserId,
      unbannedUserId,
      roomId
    }
  })
  return response.data
}

export const muteMember = async (muterUserId: number, mutedUserId: number, roomId: string, muteTime: number) => {
  const response = await axiosInstance.post(`/room/user/mute`, {
    muterUserId,
    mutedUserId,
    roomId,
    muteTime
  })
  return response.data
}

export const unMuteMember = async (unmuterUserId: number, unmutedUserId: number, roomId: string) => {
  const response = await axiosInstance.delete(`/room/user/unmute`, {
    data: {
      unmuterUserId,
      unmutedUserId,
      roomId
    }
  })
  return response.data
}

export const changePassword = async (requesterId: number, roomId: string, newPassword: string) => {
  const response = await axiosInstance.put(`/room/password/change`, {
    requesterId,
    roomId,
    newPassword
  })
  return response.data
}

export const searchPrivateRoom = async (roomName: string) => {
  const response = await axiosInstance.get(`/room/search/${roomName}`)
  return response.data
}