import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Users } from '~/users/schemas/users.schema';
import { Powers } from '~/powers/schemas/power.schema';
export type ReceiptsDocument = HydratedDocument<Receipts>;

export class RangeType {
  unitPrice: number;
  range: number;
}
@Schema({
  timestamps: true,
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.id;
      delete ret.customerId;
      delete ret.powerId;
      return ret;
    },
  },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.id;
      delete ret.customerId;
      delete ret.powerId;
      return ret;
    },
  },
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
    ref: Users.name,
  })
  customerId: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: Powers.name,
  })
  powerId: mongoose.Types.ObjectId;
}
const ReceiptsSchema = SchemaFactory.createForClass(Receipts);
ReceiptsSchema.virtual('customer', {
  ref: Users.name,
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
});
ReceiptsSchema.virtual('power', {
  ref: Powers.name,
  localField: 'powerId',
  foreignField: '_id',
  justOne: true,
});
export { ReceiptsSchema };
