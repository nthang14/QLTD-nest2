import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PowersController } from '~/powers/powers.controller';
import { PowersService } from '~/powers/powers.service';
import { Powers, PowersSchema } from '~/powers/schemas/power.schema';
import { PricesModule } from '~/prices/prices.module';
import { UserModule } from '~/users/users.module';
@Module({
  imports: [
    PricesModule,
    UserModule,
    MongooseModule.forFeature([{ name: Powers.name, schema: PowersSchema }]),
  ],
  controllers: [PowersController],
  providers: [PowersService],
  exports: [PowersService],
})
export class PowersModule {}
