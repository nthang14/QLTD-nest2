import { Module } from '@nestjs/common';
import { PowersController } from './powers.controller';

@Module({
  controllers: [PowersController]
})
export class PowersModule {}
