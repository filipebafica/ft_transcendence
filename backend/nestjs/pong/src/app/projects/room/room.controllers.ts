import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Put, Param } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateService } from 'src/core/projects/room/create/create.room.service';
import RoomAdapter from './room.adapter';
import { CreateDTO } from './create.dto';
import { RequestDTO as CreateRequestDTO } from 'src/core/projects/room/create/dtos/request.dto';
import { ResponseDTO as CreateResponseDTO} from 'src/core/projects/room/create/dtos/response.dto';
import { ListAllService } from 'src/core/projects/room/listAll/list.all.service';
import { ResponseDTO as ListAllResponseDTO} from 'src/core/projects/room/listAll/dtos/response.dto';
import RoomDTO from "src/core/projects/room/shared/dtos/room.dto";
import { ListByUserIdService } from 'src/core/projects/room/listByUserId/list.by.user.id.service';
import { RequestDTO as ListByUserIdRequestDTO } from 'src/core/projects/room/listByUserId/dtos/request.dto';
import { ResponseDTO as ListByUserIdResponseDTO} from 'src/core/projects/room/listByUserId/dtos/response.dto';
import { JoinService } from 'src/core/projects/room/join/join.service';
import { JoinDTO } from './join.dto';
import { RequestDTO as JoinRequestDTO } from 'src/core/projects/room/join/dtos/request.dto';
import { ResponseDTO as JoinResponseDTO} from 'src/core/projects/room/join/dtos/response.dto';
import { EntityManager } from 'typeorm';
import RoomParticipantsAdapter from './room.participants.adapter';
import RoomPartitipantsDTO from 'src/core/projects/room/join/dtos/room.participants.dto';


@Controller('/room')
@ApiTags('room')
export class RoomController {
    private createService: CreateService;
    private joinService: JoinService;
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
            new Logger(ListAllService.name),
            new RoomAdapter(entityManager)
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
                        new RoomDTO(1, 'room1')
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
                message: 'user has joined the room'
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
                "message": "user has joined the room"
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('/list/all')
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
                    new RoomDTO(1, 'room1', [1, 2, 3]),
                    new RoomDTO(2, 'room2', [1, 2, 3]),
                    new RoomDTO(3, 'room3', [1, 2, 3]),
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
                        new RoomDTO(1, 'room1', [1, 2, 3]),
                        new RoomDTO(2, 'room2', [1, 2, 3]),
                        new RoomDTO(3, 'room3', [1, 2, 3]),
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