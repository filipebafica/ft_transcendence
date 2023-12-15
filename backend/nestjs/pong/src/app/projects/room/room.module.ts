import { Module } from '@nestjs/common';
import { RoomGateway } from 'src/app/projects/room/room.gateway';
import { RoomController } from './room.controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../ormconfig';
import { Room } from 'src/app/entities/room.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot(config)
    ],
    controllers: [RoomController],
    providers: [RoomGateway]
})
export class RoomModule {}
