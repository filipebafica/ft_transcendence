import { Injectable, Logger } from '@nestjs/common';

import { TokenGateway, TokenType } from '../gateway/token.gateway';

import { UserRepository } from './gateway/user.info.repository';
import { LoginResponseDTO } from './dto/response.dto';
import { UserDTO } from './dto/user.dto';
import { User } from 'src/app/entities/user.entity';

@Injectable()
export class LoginService {
  constructor(
    private tokenGateway: TokenGateway,
    private userRepo: UserRepository,
  ) {}

  async execute(request: UserDTO): Promise<LoginResponseDTO> {
    let user: User;

    try {
      user = await this.userRepo.getUser({
        oAuthProviderId: request.oAuthProviderId,
      });
    } catch (error) {
      user = await this.userRepo.createUser(request);
    }
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      isTwoFactorAuthenticated: false,
      isTwoFactorAuthenticationEnabled: user.isTwoFactorAuthenticationEnabled,
    };
    const token: TokenType = await this.tokenGateway.tokenizer(tokenPayload);

    return new LoginResponseDTO(token, user.isTwoFactorAuthenticationEnabled);
  }
}
