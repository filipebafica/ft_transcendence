export class RequestDTO {
    constructor(
        public readonly userId: number,
        public readonly newStatus: string,
    ) {
    }
}