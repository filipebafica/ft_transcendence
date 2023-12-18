import axiosInstance from "../config.api";

export const getMatchResult = async (gameId: string) => {
	const response = await axiosInstance.get(`/game/${gameId}/winner`);
	console.log(response.data);
	return response.data;
};
