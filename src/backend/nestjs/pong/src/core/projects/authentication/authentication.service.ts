import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { EntityManager } from 'typeorm';
import { TokenGateway } from './gateway/token.gateway';
import { JwtAdapter } from 'src/app/projects/authentication/login/jwt.adapter';
import { UsersService } from '../users/users.service';
import { User } from 'src/app/entities/user.entity';

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

  async loginWith2fa(user: User, twoFactorAuthenticationCode: string) {
    this.validateTwoFactorAuthenticationCode(user, twoFactorAuthenticationCode);

    return {
      access_token: await this.tokenService.tokenizer(
        this.generateTokenPayload(user, true),
      ),
    };
  }

  async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret(32);
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      '42 Transcendence Pong Game',
      secret,
    );
    this.usersService.updateUserTwoFactorAuthSecret(user, secret);

    return otpAuthUrl;
  }

  private validateTwoFactorAuthenticationCode(
    user: User,
    authCode: string,
  ): void {
    if (!authCode) {
      throw new BadRequestException('Missing authentication code');
    }
    if (!user.twoFactorAuthenticationSecret) {
      throw new BadRequestException(
        'User does not have a 2FA secret configured. Generate QR Code with /auth/twoFactor/generate',
      );
    }
    try {
      const isCodeValid: boolean = authenticator.verify({
        token: authCode,
        secret: user.twoFactorAuthenticationSecret,
      });

      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong authentication code');
      }
    } catch (error) {
      throw new UnauthorizedException('Failed to verify authentication code');
    }
  }

  private generateTokenPayload(
    user: User,
    isTwoFactorAuthenticated: boolean,
  ): object {
    return {
      sub: user.id,
      email: user.email,
      name: user.name,
      isTwoFactorAuthenticationEnabled: !!user.isTwoFactorAuthenticationEnabled,
      isTwoFactorAuthenticated,
    };
  }

  async enableTwoFactorAuthentication(user: User, authCode: string) {
    this.validateTwoFactorAuthenticationCode(user, authCode);
    this.usersService.enableUserTwoFactorAuth(user.id);

    user.isTwoFactorAuthenticationEnabled = true;
    return {
      access_token: await this.tokenService.tokenizer(
        this.generateTokenPayload(user, true),
      ),
    };
  }
}
