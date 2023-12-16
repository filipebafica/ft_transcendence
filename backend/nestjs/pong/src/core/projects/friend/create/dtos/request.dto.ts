export class RequestDTO {
    constructor(
        public readonly userId: number,
        public readonly friendUserId: number
    ) {
    }
}