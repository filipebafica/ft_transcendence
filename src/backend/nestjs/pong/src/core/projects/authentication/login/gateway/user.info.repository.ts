import { User } from 'src/app/entities/user.entity';
import { UserDTO } from '../dto/user.dto';

export interface UserRepository {
  getUser(user: Partial<User>): Promise<User | null>;
  createUser(user: UserDTO): Promise<User>;
  updateUser(
    userId: number,
    partialUser: Partial<User>,
  ): Promise<Partial<User> | null>;
}
