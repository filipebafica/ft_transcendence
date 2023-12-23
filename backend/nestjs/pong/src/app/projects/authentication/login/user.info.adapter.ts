import { User } from 'src/app/entities/user.entity';
import { UserDTO } from 'src/core/projects/authentication/login/dto/user.info.dto';
import { UserRepository as UserRepository } from 'src/core/projects/authentication/login/gateway/user.info.repository';
import { UsersService } from 'src/core/projects/users/users.service';
import { EntityManager } from 'typeorm';

export class UserAdapter implements UserRepository {
  private usersService: UsersService;

  constructor(entityManager: EntityManager) {
    this.usersService = new UsersService(entityManager);
  }

  async getUser(user: Partial<User>): Promise<User | null> {
    return this.usersService.findOne(user);
  }

  async createUser(user: UserDTO): Promise<User> {
    return this.usersService.create(user);
  }

  async updateUser(
    userId: number,
    partialUser: Partial<User>,
  ): Promise<Partial<User> | null> {
    return this.usersService.update(userId, partialUser);
  }
}
