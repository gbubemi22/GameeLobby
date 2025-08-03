import { Module } from '@nestjs/common';
import { GameService } from './service/game.service';
import { GameController } from './controller/game.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './schema/game.schema';
import { JoinGame, JoinGameSchema } from 'src/joingame/schema/joingame.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: JoinGame.name, schema: JoinGameSchema },
    ]),
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
