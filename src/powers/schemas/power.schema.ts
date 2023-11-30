import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Prices } from '~/prices/schemas/price.schemas';
import { Users } from '~/users/schemas/users.schema';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
export type PowersDocument = HydratedDocument<Powers>;

@Schema({
  timestamps: true,
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.id;
      delete ret.customerId;
      delete ret.priceId;
      return ret;
    },
  },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.id;
      delete ret.customerId;
      delete ret.priceId;
      return ret;
    },
  },
})
export class Powers {
  @Prop()
  indexOfMonth: Date;
  @Prop()
  index: number;
  @Prop({
    type: mongoose.Types.ObjectId,
  })
  priceId: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Types.ObjectId,
  })
  customerId: mongoose.Types.ObjectId;
}
const PowersSchema = SchemaFactory.createForClass(Powers);
PowersSchema.virtual('rangePrice', {
  ref: Prices.name,
  localField: 'priceId',
  foreignField: '_id',
  justOne: true,
});
PowersSchema.virtual('customer', {
  ref: Users.name,
  localField: 'customerId',
  foreignField: '_id',
});
export { PowersSchema };
