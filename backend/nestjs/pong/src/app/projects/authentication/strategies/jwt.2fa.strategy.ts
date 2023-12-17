import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenPayload } from '../../../../core/projects/jwt/entities/token.payload.entity';
import { UsersService } from 'src/core/projects/users/users.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  private usersService: UsersService;

  constructor(entityManager: EntityManager) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
    this.usersService = new UsersService(entityManager);
  }

  async validate(payload: TokenPayload) {
    try {
      const user = await this.usersService.findOne({
        id: payload.sub,
        email: payload.email,
        username: payload.username,
      });
      if (
        user.isTwoFactorAuthenticationEnabled &&
        !payload.isTwoFactorAuthenticated
      ) {
        throw new UnauthorizedException('Not two factor authenticated');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
