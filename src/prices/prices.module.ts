import { Module } from '@nestjs/common';
import { PricesController } from '~/prices/prices.controller';
import { PricesService } from '~/prices/prices.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Prices, PricesSchema } from '~/prices/schemas/price.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Prices.name, schema: PricesSchema }]),
  ],
  controllers: [PricesController],
  providers: [PricesService],
  exports: [PricesService, PricesModule],
})
export class PricesModule {}
