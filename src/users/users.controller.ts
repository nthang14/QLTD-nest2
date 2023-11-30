import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from '~/users/users.service';
import { CreateUserDto } from '~/users/dto/create-user.dto';
import { UpdateUserDto } from '~/users/dto/update-user.dto';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import RoleGuard from '~/auth/guards/role-auth';
import { Role } from '~/enum';

@Controller('users')
export class UsersController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly service: UsersService) {}
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Get()
  async getListUser() {
    return await this.service.getListUser();
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(@Body() user: CreateUserDto) {
    return await this.service.createUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.service.getUserById(id);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return await this.service.updateUserById(id, user);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.service.deleteUser(id);
  }
}
