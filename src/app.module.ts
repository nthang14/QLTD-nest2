import { Module } from '@nestjs/common';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { UserModule } from '~/users/users.module';
import { AuthModule } from '~/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PricesModule } from './prices/prices.module';
import { PowersService } from './powers/powers.service';
import { PowersModule } from './powers/powers.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/quanlytiendien'),
    PricesModule,
    PowersModule,
  ],
  controllers: [AppController],
  providers: [AppService, PowersService],
})
export class AppModule {}
