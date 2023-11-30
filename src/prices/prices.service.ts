import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Prices, PricesDocument } from '~/prices/schemas/price.schemas';
import { Model } from 'mongoose';
@Injectable()
export class PricesService {
  constructor(
    @InjectModel(Prices.name) private readonly model: Model<PricesDocument>,
  ) {}

  async createPrice(pricePayload: Prices) {
    const price = await this.model.create(pricePayload);
    if (!price) {
      throw new NotFoundException('Price create failed !');
    }
    return {
      data: price,
      statusCode: 201,
      message: 'Price create successfully !',
    };
  }

  async getRangePriceCurrent() {
    const price = await this.model.find().limit(1).sort({ _id: -1 });
    if (!price) {
      throw new NotFoundException('Price get failed !');
    }
    return {
      data: price,
      statusCode: 200,
      message: 'Price get successfully !',
    };
  }
}
