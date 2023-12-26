export class RequestDTO {
    constructor(
        public readonly bannerUserId: number,
        public readonly bannedUserId: number,
        public readonly roomId: number
    ) {
    }
}