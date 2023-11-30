import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PricesDocument = HydratedDocument<Prices>;

export class RangeType {
  unitPrice: number;

  range: number;
}
@Schema({
  timestamps: true,
})
export class Prices {
  @Prop()
  description: string;
  @Prop()
  level1: RangeType;
  @Prop()
  level2: RangeType;
  @Prop()
  level3: RangeType;
  @Prop()
  level4: RangeType;
  @Prop()
  level5: RangeType;
  @Prop()
  level6: RangeType;
}
export const PricesSchema = SchemaFactory.createForClass(Prices);
