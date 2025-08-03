import { Module } from '@nestjs/common';
import { JoinGameService } from './service/joingame.service';
import { JoingameController } from './controller/joingame.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from 'src/game/schema/game.schema';
import { JoinGame, JoinGameSchema } from './schema/joingame.schema';
import { Queue, QueueSchema } from './schema/queue.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: JoinGame.name, schema: JoinGameSchema },
      { name: Queue.name, schema: QueueSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [JoingameController],
  providers: [JoinGameService],
  exports: [JoinGameService],
})
export class JoingameModule {}
