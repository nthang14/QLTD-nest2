import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PricesDocument = HydratedDocument<Prices>;

export class RangeType {
  level: number;
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
  range: RangeType[];
}
export const PricesSchema = SchemaFactory.createForClass(Prices);
