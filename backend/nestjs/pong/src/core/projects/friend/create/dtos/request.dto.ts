export class RequestDTO {
    constructor(
        public readonly userId: number,
        public readonly friendUserId?: number,
        public readonly friendNickName?: string
    ) {
    }
}