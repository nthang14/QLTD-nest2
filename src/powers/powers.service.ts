import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Powers, PowersDocument } from '~/powers/schemas/power.schema';
import { Model } from 'mongoose';
@Injectable()
export class PowersService {
  constructor(
    @InjectModel(Powers.name)
    private model: Model<PowersDocument>,
  ) {}

  async createPower(powerPayload: Partial<Powers>) {
    console.log('powerPayload', powerPayload);
    const power = await this.model.create(powerPayload);
    if (!power) {
      throw new NotFoundException('Power create failed !');
    }
    return {
      data: power,
      statusCode: 201,
      message: 'Power create successfully !',
    };
  }

  async updatePower(powerPayload: Powers) {
    const power = await this.model.create(powerPayload);
    if (!power) {
      throw new NotFoundException('Power create failed !');
    }
    return {
      data: power,
      statusCode: 201,
      message: 'Power create successfully !',
    };
  }

  async getPowerByQuery(query: any) {
    const power = await this.model.findOne(query).exec();
    if (!!power) {
      return power;
    } else {
      return null;
    }
  }
}
