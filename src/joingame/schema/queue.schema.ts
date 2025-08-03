import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type QueueDocument = Queue & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Queue {
  @Prop({ required: true })
  gameId: string;

  @Prop({ required: true })
  userId: string;
}

export const QueueSchema = SchemaFactory.createForClass(Queue);
