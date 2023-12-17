export default class UserDTO {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly nickName: string
    ) {
    }
}