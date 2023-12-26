import { Logger } from "@nestjs/common";
import GetRoomRule from "./rules/get.room.rule";
import { RequestDTO } from "./dtos/request.dto";
import RoomParticipantsGateway from "../shared/gateways/room.participants.gateway";
import RoomGateway from "../shared/gateways/room.gateway";
import { ToggleAdminPrivilegeValidationRule } from "./rules/toggle.admin.privilege.validation.rule";
import { ToggleAdminPrivilegeRule } from "./rules/toggle.admin.privilege.rule";
import EventDispatchRule from "./rules/event.dispatch.rule";
import EventDispatchGateway from "../shared/gateways/event.dispatch.gateway";

export class ToggleAdminPrivilegeService {
    private getRoom:                            GetRoomRule;
    private toggleAdminPrivilegeValidationRule: ToggleAdminPrivilegeValidationRule;
    private toggleAdminPrivilegeRule:           ToggleAdminPrivilegeRule;
    private eventDispatchRule:                  EventDispatchRule;

    constructor(
        private readonly logger: Logger,
        roomGateway:             RoomGateway,
        roomParticipantsGateway: RoomParticipantsGateway,
        eventDispatchGateway:    EventDispatchGateway
    ) {
        this.getRoom = new GetRoomRule(roomGateway);
        this.toggleAdminPrivilegeValidationRule = new ToggleAdminPrivilegeValidationRule();
        this.toggleAdminPrivilegeRule = new ToggleAdminPrivilegeRule(roomParticipantsGateway);
        this.eventDispatchRule = new EventDispatchRule(eventDispatchGateway);
    }

    async execute(requestDTO: RequestDTO): Promise<void> {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            const room = await this.getRoom.apply(requestDTO.roomId);

            await this.toggleAdminPrivilegeValidationRule.apply(
                requestDTO.requesterId,
                requestDTO.targetId,
                requestDTO.toggle,
                room,
            );
            
            await this.toggleAdminPrivilegeRule.apply(
                requestDTO.targetId,
                requestDTO.roomId,
                requestDTO.toggle,
            );

            this.eventDispatchRule.apply(
                requestDTO.roomId,
                requestDTO.targetId
            );

            this.logger.log(JSON.stringify({"Service has finished": `User ${requestDTO.targetId} had its privileges changed from the room ${requestDTO.roomId}`}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
