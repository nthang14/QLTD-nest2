import {
  Controller,
  Get,
  Query,
  Put,
  Param,
  Body,
  UseGuards,
  Post,
  // NotFoundException,
} from '@nestjs/common';
import { PowersService } from '~/powers/powers.service';
import { UsersService } from '~/users/users.service';
import { ReceiptsService } from '~/receipts/receipts.service';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import RoleGuard from '~/auth/guards/role-auth';
import { Role } from '~/enum';
import { calBill } from '~/utils/helper';
import mongoose from 'mongoose';
import { PAGE_DEFAULT, LIMIT_DEFAULT } from '~/utils/constants';
class PReceipt {
  powerId: string;
  customerId: string;
}
@Controller('receipts')
export class ReceiptsController {
  constructor(
    private readonly powerService: PowersService,
    private readonly service: ReceiptsService,
    private readonly userService: UsersService,
  ) {}
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Post()
  async createReceipt(@Body() paramsPower: PReceipt) {
    const customerId = new mongoose.Types.ObjectId(paramsPower.customerId);
    const powerPrevious = await this.powerService.getPowersByQuery(customerId);
    const powerCurrent = await this.powerService.getPowerById(
      paramsPower.powerId,
    );
    const energy = (powerCurrent?.index || 0) - (powerPrevious.index || 0);
    const totalBill = calBill(energy, powerCurrent.rangePrice);
    const payloadReceipt = {
      energy,
      totalBill,
      customerId: customerId,
      powerId: new mongoose.Types.ObjectId(paramsPower.powerId),
    };
    return await this.service.createReceipt(payloadReceipt);
  }
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async paidReceipt(@Param('id') id: string) {
    return await this.service.updateReceipt(id);
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Get()
  async getReceipts(@Query() query: any) {
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
    return await this.service.getReceipts(queryFilter, paging);
  }
}
