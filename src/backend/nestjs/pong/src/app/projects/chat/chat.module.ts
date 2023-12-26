import { Module } from '@nestjs/common';
import { ChatGateway } from 'src/app/projects/chat/chat.gateway';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../ormconfig';

@Module({
    imports: [TypeOrmModule.forRoot(config)],
    controllers: [ChatController],
    providers: [ChatGateway]
})
export class ChatModule {}
