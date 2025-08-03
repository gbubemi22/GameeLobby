import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ default: 0 })
  wins: number;

  @Prop({ default: true })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
