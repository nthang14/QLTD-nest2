import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UsersDocument = HydratedDocument<Users>;

@Schema({
  timestamps: true,
})
export class Users {
  @Prop()
  fullName: string;
  @Prop()
  username?: string;
  @Prop({ type: Boolean, default: true })
  isActive?: boolean;
  @Prop({ type: Boolean, default: true })
  first?: boolean;
  @Prop()
  passport: string;
  @Prop()
  phoneNumber: string;
  @Prop()
  address: string;
  @Prop({ type: String, default: '123456Aa' })
  password?: string;
  @Prop({ type: Number, default: 1 })
  level?: number;
}
export const UsersSchema = SchemaFactory.createForClass(Users);
