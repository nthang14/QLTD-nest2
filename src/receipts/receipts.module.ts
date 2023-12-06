import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReceiptsService } from './receipts.service';
import { Receipts, ReceiptsSchema } from '~/receipts/schemas/receipt.schema';
import { PowersModule } from '~/powers/powers.module';
import { ReceiptsController } from '~/receipts/receipts.controller';
import { UserModule } from '~/users/users.module';

@Module({
  imports: [
    PowersModule,
    UserModule,
    MongooseModule.forFeature([
      { name: Receipts.name, schema: ReceiptsSchema },
    ]),
  ],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
})
export class ReceiptsModule {}
