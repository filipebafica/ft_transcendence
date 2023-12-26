export class RequestDTO {
    constructor(
        public readonly removerUserId: number,
        public readonly removedUserId: number,
        public readonly roomId: number
    ) {
    }
}