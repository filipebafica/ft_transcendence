import { Controller, Get, HttpException, HttpStatus, Logger, Query } from '@nestjs/common';
import RequestDTO from 'src/core/projects/chat/sendMessageAuthorization/dtos/request.dto';
import { SendMessageAuthorizationService } from 'src/core/projects/chat/sendMessageAuthorization/send.message.authorization.service';
import UserChatAdapter from './user.chat.adapter';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityManager } from 'typeorm';

@Controller('/chat')
@ApiTags('chat')
export class ChatController {
    private sendMessageAuthorizationService: SendMessageAuthorizationService;
    
    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.sendMessageAuthorizationService = new SendMessageAuthorizationService(
            new Logger(SendMessageAuthorizationService.name),
            new UserChatAdapter(entityManager)
        );
    }

    @Get('/authorization')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successful response',
        schema: {
            type: 'object',
            properties: {
                status: {type: 'string'},
                message: {type: 'boolean'}
            },
            example: {
                status: 'success',
                message: true
            }
        },
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Unsuccessful response',
        schema: {
            type: "object",
            properties: {
                statusCode: {type: 'number'},
                message: {type: 'string'}
            },
            example: {
                status: 500,
                message: 'Internal Server Error'
            }
        },
    })
    async isAuthorized(
        @Query('senderId') senderId: string,
        @Query('receiverId') receiverId: string,
    ) {
        try {
            const responseDTO = await this.sendMessageAuthorizationService.execute(
                new RequestDTO(
                        parseInt(senderId),
                        parseInt(receiverId)
                    )
                );

            return {
                "status": "success",
                "message": responseDTO.isAuthorized
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
