import { UserInfo } from 'src/app/entities/user.info.entity';
import { UserInfoDTO } from '../dto/user.info.dto';

export interface UserInfoRepository {
  getUser(userInfo: Partial<UserInfo>): Promise<UserInfo | null>;
  createUser(userInfo: UserInfoDTO): Promise<UserInfo>;
  updateUser(
    userId: number,
    partialUserInfo: Partial<UserInfo>,
  ): Promise<Partial<UserInfo> | null>;
}
