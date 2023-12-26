export class RequestDTO {
    constructor(
        public readonly unmuterUserId: number,
        public readonly unmutedUserId: number,
        public readonly roomId: number
    ) {
    }
}