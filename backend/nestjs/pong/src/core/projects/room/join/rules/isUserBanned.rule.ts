import RoomBannedUserGateway from "../../shared/gateways/room.user.banned.gateway";

export default class IsUserBannedRule {
	constructor(
		private roomBannedUserGateway: RoomBannedUserGateway
	) {}

	async apply(
		userId: number,
		roomId: number
	): Promise<boolean> {
		return await this.roomBannedUserGateway.isUserBanned(
			userId,
			roomId,
		);
	}
}
