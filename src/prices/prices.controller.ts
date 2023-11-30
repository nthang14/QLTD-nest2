import {
  Controller,
  Get,
  //   Put,
  //   Param,
  Body,
  UseGuards,
  Post,
} from '@nestjs/common';
import { PricesService } from '~/prices/prices.service';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import RoleGuard from '~/auth/guards/role-auth';
import { Role } from '~/enum';
import { CreatePriceDto } from '~/prices/dto/create-price.dto';
// import { UpdatePriceDto } from '~/prices/dto/update-price.dto';

@Controller('prices')
export class PricesController {
  constructor(private readonly service: PricesService) {}
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Post()
  async createRangePrice(@Body() price: CreatePriceDto) {
    console.log('price', price);
    return await this.service.createPrice(price);
  }

  @Get('/newest')
  async getRangePriceCurrent() {
    return await this.service.getRangePriceCurrent();
  }
}
