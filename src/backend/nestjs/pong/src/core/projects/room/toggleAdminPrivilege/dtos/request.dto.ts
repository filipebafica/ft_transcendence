export class RequestDTO {
    constructor(
        public readonly requesterId: number,
        public readonly targetId: number,
        public readonly roomId: number,
        public readonly toggle: boolean,
    ) {
    }
}
