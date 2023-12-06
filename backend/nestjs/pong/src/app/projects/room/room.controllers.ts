import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateService } from 'src/core/projects/room/create/create.room.service';
import RoomAdapter from './room.adapter';
import { CreateDTO } from './create.dto';
import Request from 'src/core/projects/room/create/dtos/request.dto';
import { ListAllService } from 'src/core/projects/room/listAll/list.all.service';
import ResponseDTO from 'src/core/projects/room/listAll/dtos/response.dto';
import RoomDTO from "src/core/projects/room/listAll/dtos/room.dto";


@Controller('/room')
@ApiTags('room')
export class RoomController {
    private createService: CreateService;
    private listAllService: ListAllService;

    constructor(
    ) {
        this.createService = new CreateService(
            new Logger(CreateService.name),
            new RoomAdapter()
        );

        this.listAllService = new ListAllService(
            new Logger(ListAllService.name),
            new RoomAdapter()
        );
    }

    @Post('/create')
    @ApiBody({
        description: 'Data to create a room',
        schema: {
            type: 'object',
            properties: {
                userId: {type: 'number'},
                roomName: {type: 'string'},
                type: {type: 'string'}
            },
            example: {
                userId: 123,
                roomName: 'myRoom',
                type: 'public',
            }
        },
        examples: {
            example1: {
                value: {
                    userId: 123,
                    roomName: 'myRoom',
                    type: 'public'
                },
                summary: 'Example of a valid request'
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Successful response',
        schema: {
            type: 'object',
            properties: {
                status: {type: 'string'},
                message: {type: 'boolean'}
            },
            example: {
                status: 'success',
                message: 'created'
            }
        }
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
        }
    })
    create(
        @Body() createDTO: CreateDTO
    ) {
        try {
            this.createService.execute(
                new Request(
                    createDTO.userId,
                    createDTO.roomName,
                    createDTO.type
                )
            );

            return {
                "status": "success",
                "message": "created"
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
            type: 'object',
            properties: {
                status: {type: 'string'},
                data: {type: 'object'}
            },
            example: {
                status: 'success',
                data: new ResponseDTO([
                        new RoomDTO(1, 'room1', 1, 1, [1, 2, 3]),
                        new RoomDTO(2, 'room2', 2, 2, [1, 2, 3]),
                        new RoomDTO(3, 'room3', 3, 3, [1, 2, 3]),
                ])
            }
        }
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
        }
    })
    list() {
        try {
            const responseDTO = this.listAllService.execute();

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