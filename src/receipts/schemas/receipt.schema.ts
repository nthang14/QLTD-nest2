import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Prices } from '~/prices/schemas/price.schemas';
import { Users } from '~/users/schemas/users.schema';
import { Powers } from '~/powers/schemas/power.schema';
export type ReceiptsDocument = HydratedDocument<Receipts>;

export class RangeType {
  unitPrice: number;
  range: number;
}
@Schema({
  timestamps: true,
})
export class Receipts {
  @Prop()
  energy: number;
  @Prop({ type: Boolean, default: false })
  paid?: boolean;
  @Prop()
  totalBill: number;
  @Prop({
    type: mongoose.Types.ObjectId,
  })
  customerId: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Types.ObjectId,
  })
  powerId: mongoose.Types.ObjectId;
}
const ReceiptsSchema = SchemaFactory.createForClass(Receipts);
ReceiptsSchema.virtual('rangePrice', {
  ref: Prices.name,
  localField: 'priceId',
  foreignField: '_id',
  justOne: true,
});
ReceiptsSchema.virtual('customer', {
  ref: Users.name,
  localField: 'customerId',
  foreignField: '_id',
});
ReceiptsSchema.virtual('power', {
  ref: Powers.name,
  localField: 'powerId',
  foreignField: '_id',
});
export { ReceiptsSchema };
