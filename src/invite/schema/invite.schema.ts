import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type InviteDocument = Invite & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Invite {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  sender: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  receiver: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true })
  game: mongoose.Types.ObjectId;

  @Prop({ type: String })
  note: string;

  @Prop({ default: 'pending' }) // 'pending', 'accepted', 'rejected'
  status: string;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
