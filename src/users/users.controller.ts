import {
  Controller,
  Get,
  Put,
  Param,
  Query,
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
import { PAGE_DEFAULT, LIMIT_DEFAULT } from '~/utils/constants';
@Controller()
export class UsersController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly service: UsersService) {}
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getListUser(@Query() query: any) {
    const paging = {
      page: query.page || PAGE_DEFAULT,
      limit: query.limit || LIMIT_DEFAULT,
    };
    const queryFilter: any = {
      level: 1,
    };
    if (query?.passport) queryFilter.passport = query.passport;
    return await this.service.getListUser(queryFilter, paging);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Put('user-passport')
  async getUserByPassport(@Body() query: any) {
    if (query && query?.passport) {
      return await this.service.findUserByPassport(query);
    }
    return false;
  }
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(@Body() user: CreateUserDto) {
    user.username = user.passport;
    return await this.service.createUser(user);
  }
  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return await this.service.getUserById(id);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return await this.service.updateUserById(id, user);
  }
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Put('users/:id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() user: { isActive: boolean },
  ) {
    return await this.service.updateUserStatusById(id, user.isActive);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.service.deleteUser(id);
  }
}
