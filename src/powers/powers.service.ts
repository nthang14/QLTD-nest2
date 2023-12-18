import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Powers, PowersDocument } from '~/powers/schemas/power.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { Search } from '~/type';
import { PAGE_DEFAULT, LIMIT_DEFAULT } from '~/utils/constants';
@Injectable()
export class PowersService {
  constructor(
    @InjectModel(Powers.name)
    private model: Model<PowersDocument>,
  ) {}

  async createPower(powerPayload: Partial<Powers>) {
    const power = await this.model.create(powerPayload).then((f) =>
      f.populate({
        path: 'customer',
        select: '_id passport fullName',
      }),
    );
    if (!power) {
      throw new NotFoundException('Power create failed !');
    }
    return {
      data: power,
      statusCode: 201,
      message: 'Power create successfully !',
    };
  }

  async updatePower(id: string, powerPayload: Powers) {
    const power = await this.model
      .findByIdAndUpdate(id, powerPayload, {
        new: true,
      })
      .exec();
    if (!power) {
      throw new NotFoundException('Power create failed !');
    }
    return {
      data: power,
      statusCode: 201,
      message: 'Power create successfully !',
    };
  }

  async getPowers(query?: any, searchQuery?: Search) {
    const limit = searchQuery?.limit || LIMIT_DEFAULT;
    const skip = ((searchQuery?.page || PAGE_DEFAULT) - 1) * limit;
    const powers = await this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: 'customer',
          select: '_id passport fullName',
        },
      ])
      .exec();
    const total = await this.model.find(query).count();
    const totalPage = Math.ceil(total / limit);
    if (!powers) {
      throw new NotFoundException('Get power failed !');
    }
    return {
      data: powers,
      total: total,
      totalPage: totalPage,
      currentPage: parseInt(skip.toString()),
      statusCode: 200,
      message: 'Get power successfully !',
    };
  }

  async getPowerByQuery(query: any) {
    const power = await this.model
      .findOne(query)
      .sort({
        createAt: -1,
      })
      .exec();
    if (!!power) {
      return power;
    } else {
      return null;
    }
  }
  async getPowerById(id: string) {
    const power = await this.model
      .findById(id)
      .populate([
        {
          path: 'customer',
          select: '_id passport fullName',
        },
      ])
      .exec();
    if (!!power) {
      return power;
    } else {
      return null;
    }
  }
  async getPowersByQuery(customerId: mongoose.Types.ObjectId) {
    const powers = await this.model
      .find({
        customerId,
      })
      .sort({
        index: -1,
      })
      .skip(1)
      .limit(1)
      .populate([
        {
          path: 'customer',
          select: '_id passport fullName',
        },
        {
          path: 'rangePrice',
          select: '_id range',
        },
      ])
      .exec();
    if (!!powers && !!powers.length) {
      return powers[0];
    } else {
      return null;
    }
  }
}
