import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from 'src/game/schema/game.schema';
import { GameService } from 'src/game/service/game.service';
import { JoinGame, JoinGameSchema } from 'src/joingame/schema/joingame.schema';
import { Queue, QueueSchema } from 'src/joingame/schema/queue.schema';
import { JoinGameService } from 'src/joingame/service/joingame.service';
import { GameServiceGateway } from './game-event/game.event';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Invite, InviteSchema } from 'src/invite/schema/invite.schema';
import { InviteService } from 'src/invite/service/invite.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: JoinGame.name, schema: JoinGameSchema },
      { name: Queue.name, schema: QueueSchema },
      { name: User.name, schema: UserSchema },
      { name: Invite.name, schema: InviteSchema },
    ]),
  ],

  providers: [GameServiceGateway, GameService, JoinGameService, InviteService],
})
export class SocketEventModule {}
