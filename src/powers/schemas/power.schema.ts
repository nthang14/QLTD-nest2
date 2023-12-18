import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Users } from '~/users/schemas/users.schema';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { RangeType } from '~/prices/schemas/price.schemas';

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
  @Prop()
  lastIndex: number;
  @Prop({ type: String, default: '' })
  note?: string;
  @Prop()
  rangePrice: RangeType[];
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: Users.name,
  })
  customerId: mongoose.Types.ObjectId;
}
const PowersSchema = SchemaFactory.createForClass(Powers);
PowersSchema.virtual('customer', {
  ref: Users.name,
  localField: 'customerId',
  foreignField: '_id',
  justOne: true,
});
export { PowersSchema };
