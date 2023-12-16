import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './app/projects/chat/chat.module';
import { GameModule } from './app/projects/game/game.module';
import { RoomModule } from './app/projects/room/room.module';
import { FriendModule } from './app/projects/friend/friend.module';

@Module({
  imports: [ChatModule, RoomModule, FriendModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
