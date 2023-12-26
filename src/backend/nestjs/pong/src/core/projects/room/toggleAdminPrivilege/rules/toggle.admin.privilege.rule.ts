import RoomParticipantsGateway from "../../shared/gateways/room.participants.gateway";

export class ToggleAdminPrivilegeRule {
	constructor(
		private roomGateway: RoomParticipantsGateway,
	){}

	public async apply(
		targetId: number,
		roomId: number,
		toggle: boolean,
	){
		await this.roomGateway.changeAdminPrivilege(
			targetId,
			roomId,
			toggle,
		);
	}
}
