import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { UserInfo } from 'src/app/entities/user.info.entity';
import { EntityManager } from 'typeorm';
import { TokenGateway } from './gateway/token.gateway';
import { JwtAdapter } from 'src/app/projects/authentication/login/jwt.adapter';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthenticationService {
  private usersService: UsersService;
  private tokenService: TokenGateway;

  constructor(entityManager: EntityManager) {
    this.tokenService = new JwtAdapter(new JwtService());
    this.usersService = new UsersService(entityManager);
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  async loginWith2fa(user: UserInfo, twoFactorAuthenticationCode: string) {
    this.validateTwoFactorAuthenticationCode(user, twoFactorAuthenticationCode);

    return {
      access_token: await this.tokenService.tokenizer(
        this.generateTokenPayload(user, true),
      ),
    };
  }

  async generateTwoFactorAuthenticationSecret(user: UserInfo) {
    const secret = authenticator.generateSecret(32);
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      '42 Transcendence Pong Game',
      secret,
    );
    this.usersService.update(user.id, {
      twoFactorAuthenticationSecret: secret,
    });

    return otpAuthUrl;
  }

  private validateTwoFactorAuthenticationCode(
    user: UserInfo,
    authCode: string,
  ): void {
    const isCodeValid: boolean = authenticator.verify({
      token: authCode,
      secret: user.twoFactorAuthenticationSecret,
    });
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
  }

  private generateTokenPayload(
    user: UserInfo,
    isTwoFactorAuthenticated: boolean,
  ): object {
    return {
      sub: user.id,
      email: user.email,
      username: user.username,
      isTwoFactorAuthenticationEnabled: !!user.isTwoFactorAuthenticationEnabled,
      isTwoFactorAuthenticated,
    };
  }

  async enableTwoFactorAuthentication(user: UserInfo, authCode: string) {
    this.validateTwoFactorAuthenticationCode(user, authCode);
    this.usersService.enableUserTwoFactorAuth(user.id);

    return {
      access_token: await this.tokenService.tokenizer(
        this.generateTokenPayload(user, true),
      ),
    };
  }
}
