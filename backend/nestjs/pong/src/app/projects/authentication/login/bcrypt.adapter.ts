import { compareSync, hashSync } from 'bcrypt';
import { PasswordGateway } from 'src/core/projects/authentication/gateway/password.gateway';

export class BcryptAdapter implements PasswordGateway {
  private readonly saltRounds = 12;

  isValid(plainPassword: string, encryptedPassword: string): boolean {
    return compareSync(plainPassword, encryptedPassword);
  }

  encrypt(plainPassword: string): string {
    return hashSync(plainPassword, this.saltRounds);
  }
}
