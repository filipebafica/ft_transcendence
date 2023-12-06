import { Module } from '@nestjs/common';
import { RoomGateway } from 'src/app/projects/room/room.gateway';

@Module({
    imports: [],
    controllers: [],
    providers: [RoomGateway]
})
export class RoomModule {}
