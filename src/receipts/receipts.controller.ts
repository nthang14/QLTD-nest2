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
  energy: number;
  rangePrice: any[];
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
    const totalBill = calBill(paramsPower.energy, paramsPower.rangePrice);
    const payloadReceipt = {
      energy: paramsPower.energy,
      totalBill,
      customerId: new mongoose.Types.ObjectId(paramsPower.customerId),
      powerId: new mongoose.Types.ObjectId(paramsPower.powerId),
    };
    const result = await this.service.createReceipt(payloadReceipt);
    return result;
  }
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async paidReceipt(@Param('id') id: string) {
    const result: any = await this.service.updateReceipt(id);
    await this.powerService.updateReceiptStatus(result.data.powerId);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getReceiptById(@Param('id') id: string) {
    const receipt: any = await this.service.getReceiptById(id);
    if (receipt) {
      const power: any = await this.powerService.getPowerById(
        receipt?.powerId.toString(),
      );
      const data = {
        ...receipt._doc,
        rangePrice: power?.rangePrice,
        customer: power?.customer || {},
        index: power?.index || 0,
        lastIndex: power?.lastIndex || 0,
        indexOfMonth: power?.indexOfMonth || '',
      };
      return {
        data: data,
        statusCode: 200,
        message: 'Get receipt successfully !',
      };
    }
    return null;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getReceipts(@Query() query: any) {
    const paging = {
      page: query.page || PAGE_DEFAULT,
      limit: query.limit || LIMIT_DEFAULT,
    };
    const queryFilter: any = {};

    if (query?.passport) {
      queryFilter.passport = query.passport;
    }
    if (query?.indexOfMonth) {
      queryFilter.indexOfMonth = query.indexOfMonth;
    }
    return await this.service.getReceipts(queryFilter, paging);
  }
  
}
