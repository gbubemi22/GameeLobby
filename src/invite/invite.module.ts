import { Module } from '@nestjs/common';
import { InviteService } from './service/invite.service';
import { InviteController } from './controller/invite.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from 'src/game/schema/game.schema';
import { JoinGame, JoinGameSchema } from 'src/joingame/schema/joingame.schema';
import { Invite, InviteSchema } from './schema/invite.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Queue, QueueSchema } from 'src/joingame/schema/queue.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: JoinGame.name, schema: JoinGameSchema },
      { name: Invite.name, schema: InviteSchema },
      { name: User.name, schema: UserSchema },
      { name: Queue.name, schema: QueueSchema },
    ]),
  ],
  controllers: [InviteController],
  providers: [InviteService],
})
export class InviteModule {}
