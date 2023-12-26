export class RequestDTO {
    constructor(
        public readonly blockerUserId: number,
        public readonly targetUserId: number
    ) {
    }
}