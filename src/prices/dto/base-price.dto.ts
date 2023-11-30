import { IsNotEmpty } from 'class-validator';
import { RangeType } from '~/prices/schemas/price.schemas';

export class BasePriceDTO {
  @IsNotEmpty()
  description: string;
  level1: RangeType;
  level2: RangeType;
  level3: RangeType;
  level4: RangeType;
  level5: RangeType;
  level6: RangeType;
}
