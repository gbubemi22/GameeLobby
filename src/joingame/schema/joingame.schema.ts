import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type JoinGameDocument = JoinGame & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class JoinGame {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true })
  gameId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  selectedNumber?: number;

  @Prop({ default: false })
  isWinner?: boolean;

  @Prop({ default: Date.now })
  joinedAt: Date;
}

export const JoinGameSchema = SchemaFactory.createForClass(JoinGame);
