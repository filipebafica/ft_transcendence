import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { TokenPayload } from '../../../../core/projects/jwt/entities/token.payload.entity';
import { EntityManager } from 'typeorm';
import { UsersService } from 'src/core/projects/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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
      return await this.usersService.findOne({
        id: payload.sub,
        email: payload.email,
        username: payload.username,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
