import { Logger } from "@nestjs/common";
import GetRoomRule from "./rules/get.room.rule";
import { RequestDTO } from "./dtos/request.dto";
import RoomParticipantsGateway from "../shared/gateways/room.participants.gateways";
import RoomGateway from "../shared/gateways/room.gateway";
import { ToggleAdminPrivilegeValidationRule } from "./rules/toggle.admin.privilege.validation.rule";
import { ToggleAdminPrivilegeRule } from "./rules/toggle.admin.privilege.rule";

export class ToggleAdminPrivilegeService {
    private getRoom:           GetRoomRule;
    private toggleAdminPrivilegeValidationRule: ToggleAdminPrivilegeValidationRule;
    private toggleAdminPrivilegeRule:           ToggleAdminPrivilegeRule;

    constructor(
        private readonly logger: Logger,
        roomGateway:             RoomGateway,
        roomParticipantsGateway: RoomParticipantsGateway
    ) {
        this.getRoom = new GetRoomRule(roomGateway);
        this.toggleAdminPrivilegeValidationRule = new ToggleAdminPrivilegeValidationRule();
        this.toggleAdminPrivilegeRule = new ToggleAdminPrivilegeRule(roomParticipantsGateway);
    }

    async execute(requestDTO: RequestDTO): Promise<void> {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            let room = await this.getRoom.apply(requestDTO.roomId);

            await this.toggleAdminPrivilegeValidationRule.apply(
                requestDTO.requesterId,
                requestDTO.targetId,
                requestDTO.toggle,
                room,
            );
            
            await this.toggleAdminPrivilegeRule.apply(
                requestDTO.targetId,
				room.id,
                requestDTO.toggle,
            );

            this.logger.log(JSON.stringify({"Service has finished": `User ${requestDTO.targetId} had its privileges changed from the room ${requestDTO.roomId}`}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
