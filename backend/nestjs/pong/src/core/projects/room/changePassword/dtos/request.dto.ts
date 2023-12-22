export class RequestDTO {
    constructor(
        public readonly requesterId: number,
        public readonly roomId: number,
        public readonly newPassword: string = null
    ) {
    }
}
