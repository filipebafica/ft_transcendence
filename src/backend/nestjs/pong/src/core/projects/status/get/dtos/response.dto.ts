import StatusDTO from "../../shared/dtos/status.dto";

export class ResponseDTO {
    constructor(
        public readonly satus: StatusDTO
    ) {
    }
}