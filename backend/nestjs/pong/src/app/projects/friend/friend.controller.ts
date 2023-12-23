import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post } from '@nestjs/common';
import { CreateService } from 'src/core/projects/friend/create/create.service';
import { DeleteService } from 'src/core/projects/friend/delete/delete.service';
import { ListByUserIdService } from 'src/core/projects/friend/listByUserId/list.by.user.id.service';
import { EntityManager } from 'typeorm';
import FriendAdapter from './friend.adapter';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDTO } from './create.dto';
import { RequestDTO as CreateRequestDTO } from 'src/core/projects/friend/create/dtos/request.dto';
import { RequestDTO as ListByUserIdRequestDTO } from 'src/core/projects/friend/listByUserId/dtos/request.dto';
import { ResponseDTO as ListByUserIdResponseDTO } from 'src/core/projects/friend/listByUserId/dtos/response.dto';
import FriendDTO from 'src/core/projects/friend/listByUserId/dtos/friend.dto';
import { DeleteDTO } from './delete.dto';
import { RequestDTO as DeleteRequestDTO } from 'src/core/projects/friend/delete/dtos/request.dto';

@Controller('/friend')
@ApiTags('friend')
export class FriendController {
    private createService: CreateService;
    private listByUserIdService: ListByUserIdService;
    private deleteService: DeleteService;

    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.createService = new CreateService(
            new Logger(`friend::${CreateService.name}`),
            new FriendAdapter(entityManager)
        )

        this.listByUserIdService = new ListByUserIdService(
            new Logger(`friend::${ListByUserIdService.name}`),
            new FriendAdapter(entityManager)
        )

        this.deleteService = new DeleteService(
            new Logger(`friend::${DeleteService.name}`),
            new FriendAdapter(entityManager)
        )
    }

    @Post()
    @ApiBody({
        description: 'Data to create a friend',
        schema: {
            type: 'Object',
            properties: {
                userId: {type: 'number'},
                friendUserId: {type: 'number'},
                friendNickName: {type: 'number'},
            },
            required: ['userId'],
        },
        examples: {
            example1: {
                value: {
                    userId: 1,
                    friendUserId: 2,
                    friendNickName: 'nick.name',
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
                message: 'friendship has been created'
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
            await this.createService.execute(
                new CreateRequestDTO(
                    createDTO.userId,
                    createDTO.friendUserId,
                    createDTO.friendNickName
                )
            );

            return {
                "status": "success",
                "message": "friendship has been created"
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(':userId')
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
                    new FriendDTO(1, 'monica', 'on-line', true),
                    new FriendDTO(2, 'ross', 'in-game', false),
                    new FriendDTO(3, 'rachel', 'off-line', false),
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
                "data": responseDTO.friends
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Delete()
    @ApiBody({
        description: 'Data to delete a friend',
        schema: {
            type: 'Object',
            properties: {
                userId: {type: 'number'},
                friendUserId: {type: 'number'}
            }
        },
        examples: {
            example1: {
                value: {
                    userId: 1,
                    friendUserId: 2
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
                message: 'friendship has been deleted'
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
    async delete(
        @Body() deleteDTO: DeleteDTO
    ) {
        try {
            await this.deleteService.execute(
                new DeleteRequestDTO(
                    deleteDTO.userId,
                    deleteDTO.friendUserId
                )
            );

            return {
                "status": "success",
                "message": "friendship has been deleted"
            };

        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
