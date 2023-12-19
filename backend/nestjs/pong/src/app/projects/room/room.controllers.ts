import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Put, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateService } from 'src/core/projects/room/create/create.room.service';
import RoomAdapter from './room.adapter';
import { CreateDTO } from './create.dto';
import { RequestDTO as CreateRequestDTO } from 'src/core/projects/room/create/dtos/request.dto';
import { ResponseDTO as CreateResponseDTO} from 'src/core/projects/room/create/dtos/response.dto';
import { ListAllService } from 'src/core/projects/room/listAll/list.all.service';
import { ResponseDTO as ListAllResponseDTO } from 'src/core/projects/room/listAll/dtos/response.dto';
import RoomDTO from "src/core/projects/room/shared/dtos/room.dto";
import { ListByUserIdService } from 'src/core/projects/room/listByUserId/list.by.user.id.service';
import { RequestDTO as ListByUserIdRequestDTO } from 'src/core/projects/room/listByUserId/dtos/request.dto';
import { ResponseDTO as ListByUserIdResponseDTO} from 'src/core/projects/room/listByUserId/dtos/response.dto';
import { JoinService } from 'src/core/projects/room/join/join.service';
import { JoinDTO } from './join.dto';
import { RequestDTO as JoinRequestDTO } from 'src/core/projects/room/join/dtos/request.dto';
import { EntityManager } from 'typeorm';
import RoomParticipantsAdapter from './room.participants.adapter';
import RoomByParticipantDTO from 'src/core/projects/room/listByUserId/dtos/room.by.participant.dto';
import RoomParticipantDTO from 'src/core/projects/room/shared/dtos/room.participant.dto';
import UserDTO from 'src/core/projects/room/shared/dtos/user.dto';
import { RemoveUserService } from 'src/core/projects/room/removeUser/remove.user.service';
import { RequestDTO as RemoveUserRequestDTO } from 'src/core/projects/room/removeUser/dtos/request.dto';
import { RemoveUserDTO } from './remove.user.dto';
import { BanUserService } from 'src/core/projects/room/banUser/ban.user.service';
import { RequestDTO as BanUserRequestDTO } from 'src/core/projects/room/banUser/dtos/request.dto';
import { BanUserDTO } from './ban.user.dto ';
import RoomBannedUserAdapter from './room.banned.user.adapter';
import { UnbanUserDTO } from './unban.user.dto';
import { UnbanUserService } from 'src/core/projects/room/unbanUser/unban.user.service';
import { RequestDTO as UnbanUserRequestDTO } from 'src/core/projects/room/unbanUser/dtos/request.dto';
import RoomMutedUserAdapter from './room.muted.user.adapter';
import { MuteUserDTO } from './mute.user.dto';
import { MuteUserService } from 'src/core/projects/room/muteUser/mute.user.service';
import { RequestDTO as MuteUserRequestDTO } from 'src/core/projects/room/muteUser/dtos/request.dto';


@Controller('/room')
@ApiTags('room')
export class RoomController {
    private createService: CreateService;
    private joinService: JoinService;
    private removeUserService: RemoveUserService;
    private banUserService: BanUserService;
    private unbanUserService: UnbanUserService;
    private muteUserService: MuteUserService;
    private listAllService: ListAllService;
    private listByUserIdService: ListByUserIdService;

    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.createService = new CreateService(
            new Logger(CreateService.name),
            new RoomAdapter(entityManager)
        );

        this.joinService = new JoinService(
            new Logger(CreateService.name),
            new RoomParticipantsAdapter(entityManager)
        );

        this.listAllService = new ListAllService(
            new Logger(ListAllService.name),
            new RoomAdapter(entityManager)
        );

        this.listByUserIdService = new ListByUserIdService(
            new Logger(ListByUserIdService.name),
            new RoomAdapter(entityManager)
        );

        this.removeUserService = new RemoveUserService(
            new Logger(RemoveUserService.name),
            new RoomAdapter(entityManager),
            new RoomParticipantsAdapter(entityManager)
        );

        this.banUserService = new BanUserService(
            new Logger(BanUserService.name),
            new RoomAdapter(entityManager),
            new RoomBannedUserAdapter(entityManager),
            new RoomParticipantsAdapter(entityManager)
        );

        this.unbanUserService = new UnbanUserService(
            new Logger(UnbanUserService.name),
            new RoomAdapter(entityManager),
            new RoomBannedUserAdapter(entityManager)
        );

        this.muteUserService = new MuteUserService(
            new Logger(MuteUserService.name),
            new RoomAdapter(entityManager),
            new RoomMutedUserAdapter(entityManager)
        );

    }

    @Post('/create')
    @ApiBody({
        description: 'Data to create a room',
        schema: {
            type: 'Object',
            properties: {
                userId: {type: 'number'},
                roomName: {type: 'string'},
                isPublic: {type: 'boolean'}
            }
        },
        examples: {
            example1: {
                value: {
                    userId: 123,
                    roomName: 'myRoom',
                    isPublic: true
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
                data: {type: 'Object'}
            },
            example: {
                status: 'success',
                data: new CreateResponseDTO(
                        new RoomDTO(1, 'room1', true)
                )
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
    async create(
        @Body() createDTO: CreateDTO
    ) {
        try {
            const responseDTO = await this.createService.execute(
                new CreateRequestDTO(
                    createDTO.userId,
                    createDTO.roomName,
                    createDTO.isPublic
                )
            );

            return {
                "status": "success",
                "data": responseDTO.rooms
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('/join')
    @ApiBody({
        description: 'Data to join a room',
        schema: {
            type: 'Object',
            properties: {
                userId: {type: 'number'},
                roomId: {type: 'number'},
                isOwner: {type: 'boolean'},
                isAdmin: {type: 'boolean'}
            }
        },
        examples: {
            example1: {
                value: {
                    userId: 123,
                    roomId: 321,
                    isOwner: true,
                    isAdmin: true
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
                message: {type: 'boolean'}
            },
            example: {
                status: 'success',
                message: 'user {userID} has joined the room'
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
    async join(
        @Body() joinDTO: JoinDTO
    ) {
        try {
            await this.joinService.execute(
                new JoinRequestDTO(
                    joinDTO.userId,
                    joinDTO.roomId,
                    joinDTO.isOwner,
                    joinDTO.isAdmin
                )
            );

            return {
                "status": "success",
                "message": `user ${joinDTO.userId} has joined the room ${joinDTO.roomId}`
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Delete('/user/remove')
    @ApiBody({
        description: 'Data to remove a user from a room',
        schema: {
            type: 'Object',
            properties: {
                removerUserId: {type: 'number'},
                removedUserId: {type: 'number'},
                roomId: {type: 'number'}
            }
        },
        examples: {
            example1: {
                value: {
                    removerUserId: 1,
                    removedUserId: 2,
                    roomId: 1
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
                message: {type: 'boolean'}
            },
            example: {
                status: 'success',
                message: 'user {userID} has been removed from room {roomId}'
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
    async removeUser(
        @Body() removeUserDTO: RemoveUserDTO
    ) {
        try {
            await this.removeUserService.execute(
                new RemoveUserRequestDTO(
                    removeUserDTO.removerUserId,
                    removeUserDTO.removedUserId,
                    removeUserDTO.roomId,
                )
            );

            return {
                "status": "success",
                "message": `user ${removeUserDTO.removedUserId} has been removed from room ${removeUserDTO.roomId}`
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('/user/ban')
    @ApiBody({
        description: 'Data to ban a user from a room',
        schema: {
            type: 'Object',
            properties: {
                bannerUserId: {type: 'number'},
                bannedUserId: {type: 'number'},
                roomId: {type: 'number'}
            }
        },
        examples: {
            example1: {
                value: {
                    bannerUserId: 1,
                    bannedUserId: 2,
                    roomId: 1
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
                message: {type: 'boolean'}
            },
            example: {
                status: 'success',
                message: 'user {userID} has been banned from room {roomId}'
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
    async banUser(
        @Body() banUserDTO: BanUserDTO
    ) {
        try {
            await this.banUserService.execute(
                new BanUserRequestDTO(
                    banUserDTO.bannerUserId,
                    banUserDTO.bannedUserId,
                    banUserDTO.roomId,
                )
            );

            return {
                "status": "success",
                "message": `user ${banUserDTO.bannedUserId} has been banned from room ${banUserDTO.roomId}`
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Delete('/user/unban')
    @ApiBody({
        description: 'Data to unban a user from a room',
        schema: {
            type: 'Object',
            properties: {
                unbannerUserId: {type: 'number'},
                unbannedUserId: {type: 'number'},
                roomId: {type: 'number'}
            }
        },
        examples: {
            example1: {
                value: {
                    unbannerUserId: 1,
                    unbannedUserId: 2,
                    roomId: 1
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
                message: {type: 'boolean'}
            },
            example: {
                status: 'success',
                message: 'user {userID} has been unbanned from room {roomId}'
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
    async unbanUser(
        @Body() unbanUserDTO: UnbanUserDTO
    ) {
        try {
            await this.unbanUserService.execute(
                new UnbanUserRequestDTO(
                    unbanUserDTO.unbannerUserId,
                    unbanUserDTO.unbannedUserId,
                    unbanUserDTO.roomId,
                )
            );

            return {
                "status": "success",
                "message": `user ${unbanUserDTO.unbannedUserId} has been unbanned from room ${unbanUserDTO.roomId}`
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('/user/mute')
    @ApiBody({
        description: 'Data to mute a user from in room',
        schema: {
            type: 'Object',
            properties: {
                muterUserId: {type: 'number'},
                mutedUserId: {type: 'number'},
                roomId: {type: 'number'},
                muteTime: {type: 'number'}
            }
        },
        examples: {
            example1: {
                value: {
                    muterUserId: 1,
                    mutedUserId: 2,
                    roomId: 1,
                    muteTime: 10
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
                message: {type: 'boolean'}
            },
            example: {
                status: 'success',
                message: 'user {userID} has been muted in room {roomId}'
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
    async muteUser(
        @Body() muteUserDTO: MuteUserDTO
    ) {
        try {
            await this.muteUserService.execute(
                new MuteUserRequestDTO(
                    muteUserDTO.muterUserId,
                    muteUserDTO.mutedUserId,
                    muteUserDTO.roomId,
                    muteUserDTO.muteTime
                )
            );

            return {
                "status": "success",
                "message": `user ${muteUserDTO.mutedUserId} has been muted in room ${muteUserDTO.roomId}`
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('/list')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successful response',
        schema: {
            type: 'Object',
            properties: {
                status: {type: 'string'},
                data: {type: 'Object'}
            },
            example: {
                status: 'success',
                data: new ListAllResponseDTO([
                    new RoomDTO(1, 'room1', true, [new RoomParticipantDTO(
                        true,
                        false,
                        new UserDTO(
                            1,
                            'user',
                            'nickname'
                        )
                    )]),
                ])
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
    async list() {
        try {
            const responseDTO = await this.listAllService.execute();

            return {
                "status": "success",
                "data": responseDTO.rooms
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('/list/:userId')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successful response',
        schema: {
            type: 'Object',
            properties: {
                status: {type: 'string'},
                data: {type: 'Object'}
            },
            example: {
                status: 'success',
                data: new ListByUserIdResponseDTO([
                        new RoomByParticipantDTO(1, "room1", true, true),
                        new RoomByParticipantDTO(2, "room2", false, true)
                ])
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
    async listByUserId(@Param('userId') userId: string) {
        try {
            const responseDTO = await this.listByUserIdService.execute(
                new ListByUserIdRequestDTO(
                    parseInt(userId)
                )
            );

            return {
                "status": "success",
                "data": responseDTO.rooms
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}