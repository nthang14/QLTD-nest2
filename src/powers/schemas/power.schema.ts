import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type PowersDocument = HydratedDocument<Powers>;

@Schema({
  timestamps: true,
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.customerId;
      delete ret.priceId;
      return ret;
    },
  },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.customerId;
      delete ret.priceId;
      return ret;
    },
  },
})
export class Powers {
  @Prop()
  index: number;
  @Prop()
  indexOfMonth: Date;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
  })
  priceId: mongoose.Schema.Types.ObjectId[];
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
  })
  customerId: mongoose.Schema.Types.ObjectId[];
}
export const PricesSchema = SchemaFactory.createForClass(Powers);
