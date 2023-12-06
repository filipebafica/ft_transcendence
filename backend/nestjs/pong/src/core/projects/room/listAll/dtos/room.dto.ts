export default class RoomDTO {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly ownerId: number,
        public readonly adminId: number,
        public readonly participants: Array<number>
    ) {
    }
}