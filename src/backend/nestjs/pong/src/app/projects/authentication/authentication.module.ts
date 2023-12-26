import { Module } from '@nestjs/common';
import { AuthenticationService } from '../../../core/projects/authentication/authentication.service';
import { AuthenticationController } from './authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FortyTwoStrategy } from './strategies/forty.two.oauth.strategy';
import { UsersModule } from '../users/users.module';

import config from '../../ormconfig';
import { Jwt2faAuthGuard } from './guards/jwt.2fa.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot(config)],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    Jwt2faAuthGuard,
    FortyTwoStrategy,
  ],
})
export class AuthenticationModule {}
