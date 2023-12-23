import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { TokenPayload } from '../../../../core/projects/jwt/entities/token.payload.entity';
import { EntityManager } from 'typeorm';
import { UsersService } from 'src/core/projects/users/users.service';
import { User } from 'src/app/entities/user.entity';

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

  async validate(payload: TokenPayload): Promise<Partial<User>> {
    Logger.log('JwtStrategy validate');
    Logger.log(`Token payload: ${JSON.stringify(payload)}`);
    try {
      const user = await this.usersService.findOne({
        id: payload.sub,
        email: payload.email,
        name: payload.name,
      });

      console.log(user);
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
