/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Game } from '../schema/game.schema';
import { JoinGame } from 'src/joingame/schema/joingame.schema';
import dayjs from 'dayjs';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(JoinGame.name) private joinGameModel: Model<JoinGame>,
  ) {}

  async CreateGame(name: string, creatorId: string) {
    try {
      const startDateTime = new Date();

      const checkName = await this.gameModel.findOne({ name: name });

      if (checkName)
        throw new BadRequestException('Session  name already exists');

      const game = await this.gameModel.create({
        name,
        startedAt: startDateTime,
        creatorId,
        maxPerGame: Number(process.env.MAX_PLAYERS_PER_SESSION),
      });

      const duration = Number(process.env.SESSION_DURATION);

      this.scheduleGameEnd(game._id, duration);
      return {
        success: true,
        message: 'Session created successfully',
        data: game,
      };
    } catch (error: any) {
      throw new BadRequestException(error);
    }
  }

  private scheduleGameEnd(gameId: mongoose.Types.ObjectId, duration: number) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      try {
        await this.endGame(gameId);
      } catch (err) {
        console.error(`Failed to end game ${gameId}:`, err);
      }
    }, duration);
  }

  async endGame(gameId: mongoose.Types.ObjectId) {
    const winningNumber = Math.floor(Math.random() * 9) + 1;

    const winners = await this.joinGameModel.find({
      gameId,
      selectedNumber: winningNumber,
    });

    const winnerIds = winners.map((player) => player.userId);

    await this.gameModel.findByIdAndUpdate(gameId, {
      status: 'ENDED',
      endedAt: new Date(),
      winningNumber,
      winners: winnerIds,
    });

    await this.joinGameModel.updateMany(
      { _id: { $in: winnerIds } },
      { $set: { isWinner: true } },
    );
  }

  async getGames() {
    try {
      const games = await this.gameModel.find();
      return {
        success: true,
        message: 'Games fetched successfully',
        data: games,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getGameOne(gameId: string) {
    const game = await this.gameModel.findById(gameId);
    if (!game) {
      throw new BadRequestException('Game not found');
    }
    return {
      success: true,
      message: 'Game fetched successfully',
      data: game,
    };
  }

  async groupSessionsByDate(targetDate?: string) {
    try {
      const query: any = {};
      if (targetDate) {
        const startOfDay = dayjs(targetDate).startOf('day').toDate();
        const endOfDay = dayjs(targetDate).endOf('day').toDate();
        query.startedAt = { $gte: startOfDay, $lte: endOfDay };
      }

      const sessions = await this.gameModel
        .find(query)
        .sort({ startedAt: -1 })
        .lean();

      const grouped: Record<string, any[]> = {};

      for (const session of sessions) {
        const date = dayjs(session.startedAt).format('YYYY-MM-DD');
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(session);
      }

      const response = Object.entries(grouped).map(([date, sessions]) => ({
        date,
        sessions,
        count: sessions.length,
      }));

      return {
        success: true,
        message: 'Game sessions grouped by date',
        data: response,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
