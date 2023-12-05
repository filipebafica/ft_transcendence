import { Module } from '@nestjs/common';
import { ChatGateway } from 'src/app/projects/chat/chat.gateway';
import { ChatController } from './chat.controller';

@Module({
    imports: [],
    controllers: [ChatController],
    providers: [ChatGateway]
})
export class ChatModule {}
