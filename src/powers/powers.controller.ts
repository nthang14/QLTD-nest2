import {
  Controller,
  //   Get,
  //   Put,
  //   Param,
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
import { PricesService } from '~/prices/prices.service';
import { UsersService } from '~/users/users.service';
import { Powers } from './schemas/power.schema';

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
    const customer = await this.userService.findUserByQuery({
      passport: power.passport,
    });
    const isPower = await this.service.getPowerByQuery({
      customerId: customer._id,
      indexOfMonth: indexOfMonth,
    });
    if (!isPower) {
      const rangePrice = await this.priceService.getRangePriceCurrent();
      const powerPayload: Powers = {
        index: power.index,
        indexOfMonth: indexOfMonth,
        priceId: rangePrice.data._id,
        customerId: customer._id,
      };
      return await this.service.createPower(powerPayload);
    } else {
      throw new NotFoundException(
        'Power of this month already exist in table !',
      );
    }
  }
}
