import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create.user.dto';
import { UpdateUserDTO } from './dto/update.user.dto';
import { UserWithoutCredentials } from './dto/user.info.without.credentials';
import { User } from 'src/app/entities/user.entity';

@Injectable()
export class UsersService {
  private userRepo: Repository<User>;

  constructor(entityManager: EntityManager) {
    this.userRepo = entityManager.getRepository(User);
  }

  private returnWithoutCredentials(user: User): UserWithoutCredentials {
    const {
      twoFactorAuthenticationSecret: _twoFactorAuthenticationSecret,
      oAuthProviderId: _oAuthProviderId,
      ...userWithoutCredentials
    } = user;

    Logger.log(JSON.stringify(user));
    Logger.log(JSON.stringify(userWithoutCredentials));

    return userWithoutCredentials;
  }

  async findOneWithoutCredentials(
    userId: number,
  ): Promise<UserWithoutCredentials | null> {
    try {
      const user: User = await this.findOne({
        id: userId,
      });
      return this.returnWithoutCredentials(user);
    } catch (error) {
      throw error;
    }
  }

  async findOne(user: Partial<User>): Promise<User> {
    try {
      const result: User = await this.userRepo.findOne({
        where: user,
      });

      if (!result) {
        throw new NotFoundException('User not found');
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async create(userToCreate: CreateUserDTO): Promise<User> {
    const user = this.userRepo.create(userToCreate);

    return await this.userRepo.save(user);
  }

  async update(
    id: number,
    updatedUser: UpdateUserDTO,
  ): Promise<UserWithoutCredentials | null> {
    const userBeforeUpdate: User = await this.findOne({ id });

    Object.assign(userBeforeUpdate, updatedUser);
    await this.userRepo.save(userBeforeUpdate);

    return this.returnWithoutCredentials(userBeforeUpdate);
  }

  async remove(id: number): Promise<void> {
    const userToRemove = await this.findOne({ id });

    if (userToRemove) {
      await this.userRepo.remove(userToRemove);
    } else {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async userExists(user: Partial<User>): Promise<boolean> {
    return !!(await this.findOne(user));
  }

  async enableUserTwoFactorAuth(id: number): Promise<UserWithoutCredentials> {
    return await this.update(id, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }

  async updateUserTwoFactorAuthSecret(user: User, secret: string) {
    user.twoFactorAuthenticationSecret = secret;
    this.userRepo.save(user);
  }
}
