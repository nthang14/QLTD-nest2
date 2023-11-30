import { IsNotEmpty } from 'class-validator';
export class BasePowerDTO {
  @IsNotEmpty()
  index: number;
  @IsNotEmpty()
  indexOfMonth: Date;
  @IsNotEmpty()
  passport: string;
}
