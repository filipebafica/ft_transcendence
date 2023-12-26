import RoomBannedUserGateway from "../../shared/gateways/room.user.banned.gateway";
import { UserIdBannedException } from '../exceptions/user.is.banned.exception';

export default class IsUserBannedRule {
	constructor(
		private roomBannedUserGateway: RoomBannedUserGateway
	) {
	}

	async apply(
		userId: number,
		roomId: number
	): Promise<void> {
		let isBanned = await this.roomBannedUserGateway.isUserBanned(
			userId,
			roomId,
		);

		if (isBanned) {
			throw new UserIdBannedException(
				userId,
				roomId,
			);
		}
	}
}
