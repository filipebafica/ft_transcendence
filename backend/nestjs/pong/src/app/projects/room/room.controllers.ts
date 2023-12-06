import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoomService } from 'src/core/projects/room/create/create.room.service';
import RoomAdapter from './room.adapter';
import { CreateDTO } from './create.dto';
import Request from 'src/core/projects/room/create/dtos/request.dto';


@Controller('/room')
@ApiTags('room')
export class RoomController {
    private createRoomService: CreateRoomService;

    constructor(
    ) {
        this.createRoomService = new CreateRoomService(
            new Logger(CreateRoomService.name),
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
            this.createRoomService.execute(
                new Request(
                    createDTO.userId,
                    createDTO.roomName,
                    createDTO.type
                )
            )

            return {
                "status": "success",
                "message": "created"
            }

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}