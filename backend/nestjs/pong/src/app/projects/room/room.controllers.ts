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
import { ListAllByUserIdService as ListAllByUserIdService } from 'src/core/projects/room/listAllByUserId/list.all.by.user.id.service';
import { RequestDTO as ListAllByUserIdRequestDTO } from 'src/core/projects/room/listAllByUserId/dtos/request.dto';
import { ResponseDTO as ListAllByUserIdResponseDTO} from 'src/core/projects/room/listAllByUserId/dtos/response.dto';
import { JoinService } from 'src/core/projects/room/join/join.service';
import { JoinDTO } from './join.dto';
import { RequestDTO as JoinRequestDTO } from 'src/core/projects/room/join/dtos/request.dto';
import { EntityManager } from 'typeorm';
import RoomParticipantsAdapter from './room.participants.adapter';
import RoomByUserIdDTO from 'src/core/projects/room/shared/dtos/room.by.user.id.dto';
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
import { UnmuteUserDTO } from './unmute.user.dto';
import { UnmuteUserService } from 'src/core/projects/room/unmuteUser/unmute.user.service';
import { RequestDTO as UnmuteUserRequestDTO } from 'src/core/projects/room/unmuteUser/dtos/request.dto';
import { ListOneByUserIdService } from 'src/core/projects/room/listOneByUserId/list.one.by.user.id.service';
import { RequestDTO as ListOneByUserIdRequestDTO } from 'src/core/projects/room/listOneByUserId/dtos/request.dto';
import { ResponseDTO as ListOneByUserIdResponseDTO } from 'src/core/projects/room/listOneByUserId/dtos/response.dto';
import RoomByOneUserIdDTO from 'src/core/projects/room/listOneByUserId/dtos/room.by.one.user.id.dto';
import RoomParticipantByOneUserIdDTO from 'src/core/projects/room/listOneByUserId/dtos/room.participant.by.one.user.iddto';
import { ToggleAdminPrivilegeService } from 'src/core/projects/room/toggleAdminPrivilege/toggle.admin.privilege.service';
import { RequestDTO as ToggleAdminPrivilegeRequestDTO} from 'src/core/projects/room/toggleAdminPrivilege/dtos/request.dto';
import {ToggleAdminPrivilegeDTO} from 'src/app/projects/room/toggle.admin.privilege.dto'

@Controller('/room')
@ApiTags('room')
export class RoomController {
    private createService: CreateService;
    private joinService: JoinService;
    private removeUserService: RemoveUserService;
    private banUserService: BanUserService;
    private unbanUserService: UnbanUserService;
    private muteUserService: MuteUserService;
    private unmuteUserService: UnmuteUserService;
    private listAllService: ListAllService;
    private listByUserIdService: ListAllByUserIdService;
    private listOneByUserService: ListOneByUserIdService;
    private toggleAdminPrivilegeService: ToggleAdminPrivilegeService;

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

        this.listByUserIdService = new ListAllByUserIdService(
            new Logger(ListAllByUserIdService.name),
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

        this.unmuteUserService = new UnmuteUserService(
            new Logger(UnmuteUserService.name),
            new RoomAdapter(entityManager),
            new RoomMutedUserAdapter(entityManager)
        );

        this.listOneByUserService = new ListOneByUserIdService(
            new Logger(ListOneByUserIdService.name),
            new RoomAdapter(entityManager),
        );
        this.toggleAdminPrivilegeService = new ToggleAdminPrivilegeService(
            new Logger(ToggleAdminPrivilegeService.name),
            new RoomAdapter(entityManager),
            new RoomParticipantsAdapter(entityManager),
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
        description: 'Data to mute a user in a room',
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

    @Delete('/user/unmute')
    @ApiBody({
        description: 'Data to unmute a user in a room',
        schema: {
            type: 'Object',
            properties: {
                unmuterUserId: {type: 'number'},
                unmutedUserId: {type: 'number'},
                roomId: {type: 'number'}
            }
        },
        examples: {
            example1: {
                value: {
                    unmuterUserId: 1,
                    unmutedUserId: 2,
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
                message: 'user {userID} has been unmuted in room {roomId}'
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
    async unmuteUser(
        @Body() unmuteUserDTO: UnmuteUserDTO
    ) {
        try {
            await this.unmuteUserService.execute(
                new UnmuteUserRequestDTO(
                    unmuteUserDTO.unmuterUserId,
                    unmuteUserDTO.unmutedUserId,
                    unmuteUserDTO.roomId
                )
            );

            return {
                "status": "success",
                "message": `user ${unmuteUserDTO.unmutedUserId} has been unmuted in room ${unmuteUserDTO.roomId}`
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

    @Get('/list/user/:userId')
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
                data: new ListAllByUserIdResponseDTO([
                        new RoomByUserIdDTO(1, "room1", true, true),
                        new RoomByUserIdDTO(2, "room2", false, true)
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
                new ListAllByUserIdRequestDTO(
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

    @Get('/:roomId/list/user/:userId')
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
                data: new ListOneByUserIdResponseDTO(
                    new RoomByOneUserIdDTO(
                        1,
                        "room1",
                        true,
                        [
                            new RoomParticipantByOneUserIdDTO(
                                true,
                                true,
                                false,
                                false,
                                "on-line",
                                new UserDTO(
                                    1,
                                    "userName",
                                    "nickname"
                                )
                            ),
                            new RoomParticipantByOneUserIdDTO(
                                false,
                                true,
                                true,
                                true,
                                "on-line",
                                new UserDTO(
                                    2,
                                    "userName",
                                    "nickname"
                                )
                            )
                        ]
                    )
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
    async listByOneUserId(
        @Param('roomId') roomId: string,
        @Param('userId') userId: string
    ) {
        try {
            const responseDTO = await this.listOneByUserService.execute(
                new ListOneByUserIdRequestDTO(
                    parseInt(roomId),
                    parseInt(userId)
                )
            );

            return {
                "status": "success",
                "data": responseDTO.room
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Put('/admin/toggle')
    @ApiBody({
        description: 'Data to toggle admin privileges from a room participant',
        schema: {
            type: 'Object',
            properties: {
                requesterId: {type: 'number'},
                targetId: {type: 'number'},
                roomId: {type: 'number'},
                toggle: {type: 'boolean'},
            }
        },
        examples: {
            example1: {
                value: {
                    requesterId: 1,
                    targetId: 2,
                    roomId: 1,
                    toogle: true
                },
                summary: 'Example of a valid request to toggle admin privilege to a room participant'
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
                message: 'user {userID} has its privileges toggled in room {roomId}'
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
    async toggleAdminPrivilege(
        @Body() toggleAdminPrivilegeDTO: ToggleAdminPrivilegeDTO
    ) {
        try {
            await this.toggleAdminPrivilegeService.execute(
                new ToggleAdminPrivilegeRequestDTO(
                    toggleAdminPrivilegeDTO.requesterId,
                    toggleAdminPrivilegeDTO.targetId,
                    toggleAdminPrivilegeDTO.roomId,
                    toggleAdminPrivilegeDTO.toggle,
                )
            );

            return {
                "status": "success",
                "message": `user ${toggleAdminPrivilegeDTO.targetId} has its privileges toggled in room ${toggleAdminPrivilegeDTO.roomId}`
            };
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
