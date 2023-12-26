import { Controller, Get, HttpException, HttpStatus, Logger, Param } from "@nestjs/common";
import { GetStatusService } from "src/core/projects/status/get/get.status.service";
import { EntityManager } from "typeorm";
import StatusAdapter from "./status.adapter";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseDTO as GetResponseDTO} from 'src/core/projects/status/get/dtos/response.dto'
import { RequestDTO as GetRequestDTO} from 'src/core/projects/status/get/dtos/request.dto'
import StatusDTO from "src/core/projects/status/shared/dtos/status.dto";


@Controller('/users')
@ApiTags('users')
export class StatusController {
    private getStatusService: GetStatusService;

    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.getStatusService = new GetStatusService(
            new Logger(`userStatus::${GetStatusService.name}`),
            new StatusAdapter(entityManager)
        );
    }

    @Get('/status/:id')
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
                data: new GetResponseDTO(
                    new StatusDTO('on-line'),
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
    async get(
        @Param('id') id: string) {
            try {
                const responseDTO = await this.getStatusService.execute(
                    new GetRequestDTO(
                        parseInt(id)
                    )
                );

                return {
                    "status": "success",
                    "data": responseDTO.satus
                };

            } catch (error) {
                throw new HttpException(
                    error.message,
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
}