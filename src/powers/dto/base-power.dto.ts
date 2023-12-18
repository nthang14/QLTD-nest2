import { IsNotEmpty, IsOptional } from 'class-validator';
export class BasePowerDTO {
  @IsNotEmpty()
  index: number;
  @IsNotEmpty()
  lastIndex: number;
  @IsNotEmpty()
  indexOfMonth: Date;
  @IsNotEmpty()
  passport: string;
  @IsOptional()
  note?: string;
  customerId: string;
}
