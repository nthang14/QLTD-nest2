import { Module } from '@nestjs/common';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { UserModule } from '~/users/users.module';
import { AuthModule } from '~/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PricesModule } from '~/prices/prices.module';
import { PowersModule } from '~/powers/powers.module';
import { ReceiptsModule } from '~/receipts/receipts.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ReceiptsModule,
    MongooseModule.forRoot(
      'mongodb+srv://nguyenhang04141997:Hang1441997@cluster0.hqeq7yk.mongodb.net/QLTD',
    ),
    PricesModule,
    PowersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
