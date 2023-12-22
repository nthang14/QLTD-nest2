import { Injectable } from '@nestjs/common';
import { UsersService } from '~/users/users.service';
import { ReceiptsService } from './receipts/receipts.service';
// import mongoose from 'mongoose';
@Injectable()
export class AppService {
  constructor(
    private usersService: UsersService,
    private receiptService: ReceiptsService,
  ) {}

  async countTotalUsers() {
    return await this.usersService.countTotalUsers();
  }
  async reportReceipt(data: any) {
    return await this.receiptService.reportReceipt(data);
  }
}
