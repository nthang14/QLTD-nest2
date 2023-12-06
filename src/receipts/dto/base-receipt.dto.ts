import { IsNotEmpty } from 'class-validator';
export class BaseReceiptDTO {
  @IsNotEmpty()
  energy: number;
  @IsNotEmpty()
  totalBill: number;
  @IsNotEmpty()
  powerId: string;
  @IsNotEmpty()
  customerId: string;
}
