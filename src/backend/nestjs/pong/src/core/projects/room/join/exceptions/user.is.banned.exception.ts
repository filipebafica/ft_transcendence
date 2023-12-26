export class UserIdBannedException extends Error {

    constructor(
        userId: number,
        roomId: number,
        message: string = "User is banned from the room: "
    ) {
        super(`${message} User ID: ${userId}, Room ID: ${roomId}`);
        this.name = "UserIdBannedException";
        Object.setPrototypeOf(this, UserIdBannedException.prototype);
    }
}
