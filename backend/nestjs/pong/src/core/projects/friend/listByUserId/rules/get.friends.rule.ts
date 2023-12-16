import FriendGateway from "../../shared/gateways/friend.gateway";
import FriendDTO from "../dtos/friend.dto";

export default class GetFriendsRule {
    constructor(
        private readonly friendGateway: FriendGateway
    ) {
    }

    apply(userId: number): Promise<FriendDTO[]> {
        return this.friendGateway.getByUserId(userId);
    }

}