import { Module } from '@nestjs/common';
import { RoomGateway } from 'src/app/projects/room/room.gateway';
import { RoomController } from './room.controllers';

@Module({
    imports: [],
    controllers: [RoomController],
    providers: [RoomGateway]
})
export class RoomModule {}
