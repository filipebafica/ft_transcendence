import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/app/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(config)
  ],
  controllers: [FriendController]
})
export class FriendModule {}
