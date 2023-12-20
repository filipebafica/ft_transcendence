import { Injectable } from '@nestjs/common';

import { TokenGateway, TokenType } from '../gateway/token.gateway';

import { UserInfoRepository } from './gateway/user.info.repository';
import { UserInfo } from 'src/app/entities/user.info.entity';
import { LoginResponseDTO } from './dto/response.dto';
import { UserInfoDTO } from './dto/user.info.dto';

@Injectable()
export class LoginService {
  constructor(
    private tokenGateway: TokenGateway,
    private userInfoRepo: UserInfoRepository,
  ) {}

  async execute(request: UserInfoDTO): Promise<LoginResponseDTO> {
    let user: UserInfo;

    try {
      user = await this.userInfoRepo.getUser({
        oAuthProviderId: request.oAuthProviderId,
      });
    } catch (error) {
      user = await this.userInfoRepo.createUser(request);
    }
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      isTwoFactorAuthenticated: false,
      isTwoFactorAuthenticationEnabled: user.isTwoFactorAuthenticationEnabled,
    };
    const token: TokenType = await this.tokenGateway.tokenizer(tokenPayload);

    return new LoginResponseDTO(token);
  }
}
