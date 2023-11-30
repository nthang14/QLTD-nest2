import { IsNotEmpty } from 'class-validator';
import { RangeType } from '~/prices/schemas/price.schemas';

export class BasePriceDTO {
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  level1: RangeType;
  @IsNotEmpty()
  level2: RangeType;
  @IsNotEmpty()
  level3: RangeType;
  @IsNotEmpty()
  level4: RangeType;
  @IsNotEmpty()
  level5: RangeType;
  @IsNotEmpty()
  level6: RangeType;
}
