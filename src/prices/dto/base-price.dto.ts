import { IsNotEmpty } from 'class-validator';
import { RangeType } from '~/prices/schemas/price.schemas';

export class BasePriceDTO {
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  range: RangeType[];
}
