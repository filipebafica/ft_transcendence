export class RequestDTO {
    constructor(
        public readonly muterUserId: number,
        public readonly mutedUserId: number,
        public readonly roomId: number,
        public readonly muteTme: number
    ) {
    }
}