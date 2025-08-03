import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Game {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 'WAITING' }) // WAITING, IN_PROGRESS, ENDED
  status: string;

  @Prop({ default: 0 })
  winningNumber: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  creatorId: mongoose.Types.ObjectId;

  @Prop({ default: 0 })
  maxPerGame: number;

  @Prop({ default: 0 })
  joinCount: number;

  @Prop({ type: Date, default: Date.now })
  startedAt: Date;

  @Prop({ type: Date })
  endedAt: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  winners: mongoose.Types.ObjectId[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
