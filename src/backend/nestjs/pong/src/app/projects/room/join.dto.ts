export class JoinDTO {
    userId: number;
    roomId: number;
    isOwner: boolean;
    isAdmin: boolean;
    password?: string;
}