import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserInfo } from 'src/app/entities/user.info.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create.user.dto';
import { UpdateUserDTO } from './dto/update.user.dto';
import { UserInfoWithoutCredentials } from './dto/user.info.without.credentials';

@Injectable()
export class UsersService {
  private userRepo: Repository<UserInfo>;

  constructor(entityManager: EntityManager) {
    this.userRepo = entityManager.getRepository(UserInfo);
  }

  private returnWithoutCredentials(user: UserInfo): UserInfoWithoutCredentials {
    const {
      twoFactorAuthenticationSecret: _twoFactorAuthenticationSecret,
      oAuthProviderId: _oAuthProviderId,
      ...userWithoutCredentials
    } = user;

    return userWithoutCredentials;
  }

  async findOneWithoutCredentials(
    userId: number,
  ): Promise<UserInfoWithoutCredentials | null> {
    try {
      const user: UserInfo = await this.findOne({
        id: userId,
      });
      return this.returnWithoutCredentials(user);
    } catch (error) {
      throw error;
    }
  }

  async findOne(userInfo: Partial<UserInfo>): Promise<UserInfo | null> {
    try {
      const result: UserInfo = await this.userRepo.findOne({
        where: userInfo,
      });

      if (!result) {
        throw new NotFoundException('User not found');
      }
      return plainToInstance(UserInfo, result);
    } catch (error) {
      throw error;
    }
  }

  async create(userInfo: CreateUserDTO): Promise<UserInfo> {
    const user = this.userRepo.create(userInfo);

    return await this.userRepo.save(user);
  }

  async update(
    id: number,
    updatedUserInfo: UpdateUserDTO,
  ): Promise<UserInfoWithoutCredentials | null> {
    const userBeforeUpdate: UserInfo = await this.findOne({ id });

    Object.assign(userBeforeUpdate, updatedUserInfo);
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

  async userExists(userInfo: Partial<UserInfo>): Promise<boolean> {
    return !!(await this.findOne(userInfo));
  }

  async enableUserTwoFactorAuth(
    id: number,
  ): Promise<UserInfoWithoutCredentials> {
    return await this.update(id, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }
}
