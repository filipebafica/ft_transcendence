import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/app/projects/users/users.controller';
import { UsersService } from 'src/core/projects/users/users.service';

import config from '../../ormconfig';
import { Jwt2faStrategy } from '../authentication/strategies/jwt.2fa.strategy';
import { StatusController } from '../status/status.controller';

@Module({
  imports: [TypeOrmModule.forRoot(config)],
  providers: [UsersService, Jwt2faStrategy],
  controllers: [UsersController, StatusController],
  exports: [UsersService],
})
export class UsersModule {}
