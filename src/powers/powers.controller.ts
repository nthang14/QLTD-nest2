import {
  Controller,
  Get,
  Query,
  Put,
  Param,
  Body,
  UseGuards,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { PowersService } from '~/powers/powers.service';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import RoleGuard from '~/auth/guards/role-auth';
import { Role } from '~/enum';
import { CreatePowerDto } from '~/powers/dto/create-power.dto';
import { UpdatePowerDto } from '~/powers/dto/update-power.dto';
import { PricesService } from '~/prices/prices.service';
import { UsersService } from '~/users/users.service';
import { Powers } from './schemas/power.schema';
import { PAGE_DEFAULT, LIMIT_DEFAULT } from '~/utils/constants';
import mongoose from 'mongoose';

@Controller('powers')
export class PowersController {
  constructor(
    private readonly service: PowersService,
    private readonly priceService: PricesService,
    private readonly userService: UsersService,
  ) {}
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPower(@Body() power: CreatePowerDto) {
    const indexOfMonth = new Date(power.indexOfMonth);
    const isPower = await this.service.getPowerByQuery({
      customerId: new mongoose.Types.ObjectId(power.customerId),
      indexOfMonth: indexOfMonth,
    });
    if (!isPower) {
      const rangePrice = await this.priceService.getRangePriceCurrent();
      const powerPayload: Powers = {
        index: power.index,
        indexOfMonth: indexOfMonth,
        rangePrice: rangePrice.data.range,
        customerId: new mongoose.Types.ObjectId(power.customerId),
        lastIndex: power.lastIndex,
        note: power.note,
      };
      return await this.service.createPower(powerPayload);
    } else {
      throw new NotFoundException(
        'Power of this month already exist in table !',
      );
    }
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Put('/previous')
  async getPreviousPower(@Body() query: any) {
    if (query && query.customerId && query.indexOfMonth) {
      const indexOfMonth = new Date(query.indexOfMonth);
      const isPower = await this.service.getPowerByQuery({
        customerId: new mongoose.Types.ObjectId(query.customerId),
        indexOfMonth: indexOfMonth,
      });
      if (isPower) {
        return isPower;
      }
    }
    return false;
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updatePower(@Param('id') id: string, @Body() power: UpdatePowerDto) {
    const indexOfMonth = new Date(power.indexOfMonth);
    const rangePrice = await this.priceService.getRangePriceCurrent();
    const powerPayload: Powers = {
      index: power.index,
      indexOfMonth: indexOfMonth,
      rangePrice: rangePrice.data.range,
      customerId: new mongoose.Types.ObjectId(power.customerId),
      lastIndex: power.lastIndex,
      note: power.note,
    };
    return await this.service.updatePower(id, powerPayload);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPowers(@Query() query: any) {
    const paging = {
      page: query.page || PAGE_DEFAULT,
      limit: query.limit || LIMIT_DEFAULT,
    };
    const queryFilter: any = {};
    if (query?.passport) {
      const customer = await this.userService.findUserByPassport({
        passport: query.passport,
      });
      if (!!customer) {
        queryFilter.customerId = customer._id;
      }
    }
    return await this.service.getPowers(queryFilter, paging);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPowerById(@Param('id') id: string) {
    return await this.service.getPowerById(id);
  }
}
