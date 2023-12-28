import { User } from "src/app/entities/user.entity";
import { UserRepository } from "src/core/projects/authentication/login/gateway/user.info.repository";

export class GetUserNameRule {
    constructor(
        private userRepository: UserRepository,
    ) {
    }

    public async apply(userId: number): Promise<string> {
        const user: User = await this.userRepository.getUser({
            id: userId,
        });

        const userName: string = user?.nick_name || 'unknown';

        return userName;
    }
}