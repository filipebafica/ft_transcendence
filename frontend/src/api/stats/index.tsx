import axiosInstance from '../config.api'

export const getStats = async (userId: string) => {
	const response = await axiosInstance.get(`/game/stats/${userId}`)

	return response.data
}

export const getMatches = async (userId: string, index: number) => {
	const response = await axiosInstance.get(`/game/list/${userId}/${index}`)

	return response.data
}
