import { UserInfo } from 'src/app/entities/user.info.entity';
import { UserInfoDTO } from 'src/core/projects/authentication/login/dto/user.info.dto';
import { UserInfoRepository } from 'src/core/projects/authentication/login/gateway/user.info.repository';
import { UsersService } from 'src/core/projects/users/users.service';
import { EntityManager } from 'typeorm';

export class UserInfoAdapter implements UserInfoRepository {
  private usersService: UsersService;

  constructor(entityManager: EntityManager) {
    this.usersService = new UsersService(entityManager);
  }

  async getUser(userInfo: Partial<UserInfo>): Promise<UserInfo | null> {
    return this.usersService.findOne(userInfo);
  }

  async createUser(userInfo: UserInfoDTO): Promise<UserInfo> {
    return this.usersService.create(userInfo);
  }

  async updateUser(
    userId: number,
    partialUserInfo: Partial<UserInfo>,
  ): Promise<Partial<UserInfo> | null> {
    return this.usersService.update(userId, partialUserInfo);
  }
}
