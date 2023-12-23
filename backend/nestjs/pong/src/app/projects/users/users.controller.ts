import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { UpdateUserDTO } from 'src/core/projects/users/dto/update.user.dto';
import { UsersService } from 'src/core/projects/users/users.service';
import { Jwt2faAuthGuard } from '../authentication/guards/jwt.2fa.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(Jwt2faAuthGuard)
  async findOne(@Param('id') id: number) {
    return this.usersService.findOneWithoutCredentials(id);
  }

  @Patch(':id')
  @UseGuards(Jwt2faAuthGuard)
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDTO) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(Jwt2faAuthGuard)
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
