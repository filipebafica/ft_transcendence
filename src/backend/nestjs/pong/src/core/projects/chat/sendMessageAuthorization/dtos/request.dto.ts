export class RequestDTO {
    constructor(
        public readonly senderId: number,
        public readonly receiverId: number
    ) {
    }
}