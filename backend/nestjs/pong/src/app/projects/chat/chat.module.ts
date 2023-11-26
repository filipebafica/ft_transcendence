import { Module } from '@nestjs/common';
import { ChatGateway } from 'src/app/projects/chat/chat.gateway';

@Module({
    providers: [ChatGateway]
})
export class ChatModule {}
