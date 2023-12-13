export class RequestDTO {
    constructor(
        public readonly userId: number,
        public readonly roomId: number,
        public readonly isOwner: boolean,
        public readonly isAdamin: boolean
    ) {
    }
}