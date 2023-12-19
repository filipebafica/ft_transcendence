export class RequestDTO {
    constructor(
        public readonly unbannerUserId: number,
        public readonly unbannedUserId: number,
        public readonly roomId: number
    ) {
    }
}