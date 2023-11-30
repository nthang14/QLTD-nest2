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
  username: string;
  @Prop()
  passport: string;
  @Prop()
  password: string;
  @Prop({ type: Number, default: 1 })
  level?: number;
}
export const UsersSchema = SchemaFactory.createForClass(Users);
