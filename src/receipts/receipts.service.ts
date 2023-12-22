import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Receipts, ReceiptsDocument } from '~/receipts/schemas/receipt.schema';
import { Model } from 'mongoose';
import { Search } from '~/type';
import { PAGE_DEFAULT, LIMIT_DEFAULT } from '~/utils/constants';
@Injectable()
export class ReceiptsService {
  constructor(
    @InjectModel(Receipts.name)
    private model: Model<ReceiptsDocument>,
  ) {}

  async createReceipt(receiptPayload: Receipts) {
    const receipt = await this.model.create(receiptPayload);
    if (!receipt) {
      throw new NotFoundException('Receipt create failed !');
    }
    return {
      data: receipt,
      statusCode: 201,
      message: 'Receipt create successfully !',
    };
  }

  async updateReceipt(id: string) {
    const receipt = await this.model.findByIdAndUpdate(
      id,
      { paid: true },
      { new: true },
    );
    if (!receipt) {
      throw new NotFoundException('Receipt update failed !');
    }
    return {
      data: receipt,
      statusCode: 200,
      message: 'Receipt update successfully !',
    };
  }

  async getReceipts(query?: any, searchQuery?: Search) {
    const limit = searchQuery?.limit || LIMIT_DEFAULT;
    const skip = ((searchQuery?.page || PAGE_DEFAULT) - 1) * limit;
    const receipts = await this.model
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        {
          $unwind: '$customer',
        },
        {
          $match: query?.passport
            ? {
                'customer.passport': query?.passport,
              }
            : {},
        },
        {
          $lookup: {
            from: 'powers',
            localField: 'powerId',
            foreignField: '_id',
            as: 'power',
          },
        },
        {
          $unwind: '$power',
        },
        {
          $match: query?.indexOfMonth
            ? {
                'power.indexOfMonth': new Date(query?.indexOfMonth),
              }
            : {},
        },
        {
          $limit: typeof limit === 'number' ? limit : parseInt(limit),
        },
        {
          $skip: typeof skip === 'number' ? skip : parseInt(skip),
        },
      ])
      .exec();
    const total = await this.model.find(query).count();
    const totalPage = Math.ceil(total / limit);
    if (!receipts) {
      throw new NotFoundException('Get receipt failed !');
    }
    return {
      data: receipts,
      total: total,
      totalPage: totalPage,
      currentPage: parseInt(skip.toString()),
      statusCode: 200,
      message: 'Get receipt successfully !',
    };
  }

  async getReceiptById(id: any) {
    const receipt = await this.model.findById(id).exec();
    if (!receipt) {
      return null;
    }
    return receipt;
  }
  async reportReceipt(query: any) {
    return await this.model.aggregate([
      {
        $lookup: {
          from: 'powers',
          localField: 'powerId',
          foreignField: '_id',
          as: 'power',
        },
      },
      {
        $unwind: '$power',
      },
      {
        $match: {
          'power.indexOfMonth': { $gte: query.to, $lte: query.from },
        },
      },
      {
        $group: {
          _id: '$power.indexOfMonth',
          totalEnergy: { $sum: '$energy' },
          totalPricePaid: {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ['$paid', true] }, '$totalBill'],
                },
                '$totalBill',
                0,
              ],
            },
          },
          totalPrice: { $sum: '$totalBill' },
        },
      },
    ]);
  }
}
