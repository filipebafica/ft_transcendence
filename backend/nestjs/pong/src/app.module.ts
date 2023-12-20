import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './app/projects/chat/chat.module';
import { GameModule } from './app/projects/game/game.module';
import { RoomModule } from './app/projects/room/room.module';
import { FriendModule } from './app/projects/friend/friend.module';
import { AuthenticationModule } from './app/projects/authentication/authentication.module';
import { UsersModule } from './app/projects/users/users.module';
import { StatusModule } from './app/projects/status/status.module';

@Module({
  imports: [
    AuthenticationModule,
    ChatModule,
    RoomModule,
    FriendModule,
    StatusModule,
    GameModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
