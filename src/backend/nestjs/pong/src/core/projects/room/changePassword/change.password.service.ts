import { Logger } from "@nestjs/common";
import GetRoomRule from "./rules/get.room.rule";
import { RequestDTO } from "./dtos/request.dto";
import RoomGateway from "../shared/gateways/room.gateway";
import { ChangePasswordValidationRule } from "./rules/change.password.validation.rule";
import { ChangePasswordRule } from "./rules/change.password.rule";
import HashRule from "./rules/hash.rule";

export class ChangePasswordService {
    private getRoom:                      GetRoomRule;
    private changePasswordValidationRule: ChangePasswordValidationRule;
    private hashRule:                     HashRule;
    private changePasswordRule:           ChangePasswordRule;

    constructor(
        private readonly logger: Logger,
        roomGateway:             RoomGateway
    ) {
        this.getRoom = new GetRoomRule(roomGateway);
        this.changePasswordValidationRule = new ChangePasswordValidationRule();
        this.hashRule = new HashRule();
        this.changePasswordRule = new ChangePasswordRule(roomGateway);
    }

    async execute(requestDTO: RequestDTO): Promise<void> {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            const room = await this.getRoom.apply(requestDTO.roomId);

            await this.changePasswordValidationRule.apply(
                requestDTO.requesterId,
                room
            );

            const newPassword = this.hashRule.apply(requestDTO.newPassword); 

            await this.changePasswordRule.apply(
                requestDTO.roomId,
                newPassword
            );

            this.logger.log(JSON.stringify({"Service has finished": `User ${requestDTO.requesterId} has changed room ${requestDTO.roomId} password`}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
