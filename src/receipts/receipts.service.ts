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
      .find(query)
      .skip(skip)
      .limit(limit)
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
}
