import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { RequestDTO as sendMessageAuthorizationRequestDTO} from 'src/core/projects/chat/sendMessageAuthorization/dtos/request.dto';
import { SendMessageAuthorizationService } from 'src/core/projects/chat/sendMessageAuthorization/send.message.authorization.service';
import UserChatAdapter from './user.chat.adapter';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityManager } from 'typeorm';
import { BlockDTO } from './block.dto';
import { BlockUserService } from 'src/core/projects/chat/blockUser/block.user.service';
import { RequestDTO as BlockRequestDTO} from 'src/core/projects/chat/blockUser/dtos/request.dto';
import { UnBlockDTO } from './unblock.dto';
import { RequestDTO as UnblockRequestDTO } from 'src/core/projects/chat/unblockUser/dtos/request.dto';
import { UnblockUserService } from 'src/core/projects/chat/unblockUser/unblock.user.service';

@Controller('/chat')
@ApiTags('chat')
export class ChatController {
    private sendMessageAuthorizationService: SendMessageAuthorizationService;
    private blockUserService: BlockUserService;
    private unblockUserService: UnblockUserService;
    
    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.sendMessageAuthorizationService = new SendMessageAuthorizationService(
            new Logger(`chat::${SendMessageAuthorizationService.name}`),
            new UserChatAdapter(entityManager)
        );

        this.blockUserService = new BlockUserService(
            new Logger(`chat::${BlockUserService.name}`),
            new UserChatAdapter(entityManager)
        );

        this.unblockUserService = new UnblockUserService(
            new Logger(`chat::${UnblockUserService.name}`),
            new UserChatAdapter(entityManager)
        );
    }

    @Post('/block')
    @ApiBody({
        description: 'Data block a user',
        schema: {
            type: 'Object',
            properties: {
                blockerUserId: {type: 'number'},
                targetUserId: {type: 'number'},
            }
        },
        examples: {
            example1: {
                value: {
                    blockerUserId: 1,
                    targetUserId: 2,
                },
                summary: 'Example of a valid request'
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Successful response',
        schema: {
            type: 'Object',
            properties: {
                status: {type: 'string'},
                message: {type: 'string'}
            },
            example: {
                status: 'success',
                message: "user has been blocked"
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Unsuccessful response',
        schema: {
            type: "Object",
            properties: {
                statusCode: {type: 'number'},
                message: {type: 'string'}
            },
            example: {
                status: 500,
                message: 'Internal Server Error'
            }
        }
    })
    async block(
        @Body() blockDTO: BlockDTO
    ) {
        try {
            await this.blockUserService.execute(
                new BlockRequestDTO(
                    blockDTO.blockerUserId,
                    blockDTO.targetUserId
                )
            );

            return {
                "status": "success",
                "message": "user has been blocked"
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
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
                new sendMessageAuthorizationRequestDTO(
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

    @Delete('/unblock')
    @ApiBody({
        description: 'Data unblock a user',
        schema: {
            type: 'Object',
            properties: {
                unBlockerUserId: {type: 'number'},
                targetUserId: {type: 'number'},
            }
        },
        examples: {
            example1: {
                value: {
                    unBlockerUserId: 1,
                    targetUserId: 2,
                },
                summary: 'Example of a valid request'
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successful response',
        schema: {
            type: 'Object',
            properties: {
                status: {type: 'string'},
                message: {type: 'string'}
            },
            example: {
                status: 'success',
                message: "user has been unblocked"
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Unsuccessful response',
        schema: {
            type: "Object",
            properties: {
                statusCode: {type: 'number'},
                message: {type: 'string'}
            },
            example: {
                status: 500,
                message: 'Internal Server Error'
            }
        }
    })
    async unblock(
        @Body() blockDTO: UnBlockDTO
    ) {
        try {
            await this.unblockUserService.execute(
                new UnblockRequestDTO(
                    blockDTO.unBlockerUserId,
                    blockDTO.targetUserId
                )
            );

            return {
                "status": "success",
                "message": "user has been unblocked"
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

}
