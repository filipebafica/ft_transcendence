export default class Request {
    constructor(
        public readonly userId: number,
        public readonly roomName: string,
        public readonly type: string
    ) {
    }
}