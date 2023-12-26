export default class RoomByUserIdDTO {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly isPublic: boolean,
        public readonly hasPassword: boolean,
        public readonly isOwner: boolean,
        public readonly isAdmin: boolean
    ) {
    }
}