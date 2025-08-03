/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable } from '@nestjs/common';
import { JoinGame } from '../schema/joingame.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from 'src/game/schema/game.schema';
import { Queue } from '../schema/queue.schema';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class JoinGameService {
  constructor(
    @InjectModel(JoinGame.name) private joinGameModel: Model<JoinGame>,
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(Queue.name) private queueModel: Model<Queue>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async joinSession(sessionId: string, userId: string, selectedNumber: number) {
    try {
      const session = await this.gameModel.findOne({
        _id: sessionId,
      });

      if (!session) {
        throw new BadRequestException('Session not found ');
      }
      if (session.status === 'ENDED') {
        throw new BadRequestException('Session has ended');
      }

      if (session.status === 'IN_PROGRESS') {
        throw new BadRequestException('Session in progress');
      }

      // if (session.joinCount >= session.maxPerGame) {
      //   throw new BadRequestException('Session is full');
      // }

      const MAX_LIMIT = Number(process.env.SESSION_DURATION);
      console.log(MAX_LIMIT);

      if (session.joinCount === session.maxPerGame) {
        await this.queueModel.create({ gameId: sessionId, userId });
        return {
          success: true,
          message: 'Session is full. You have been added to the queue.',
        };
      }

      const newPlayer = await this.joinGameModel.create({
        gameId: sessionId,
        userId: userId,
        selectedNumber,
      });

      const game = await this.gameModel.findByIdAndUpdate(
        { _id: sessionId },
        { $inc: { joinCount: 1 } },
      );

      if (game?.joinCount === MAX_LIMIT) {
        await this.gameModel.findByIdAndUpdate(sessionId, {
          status: 'IN_PROGRESS',
        });
      }

      return {
        success: true,
        message: 'User joined successfully',
        data: newPlayer,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async leaveSession(sessionId: string, userId: string) {
    try {
      const session = await this.gameModel.findOne({
        _id: sessionId,
        status: { $nin: ['IN_PROGRESS', 'ENDED'] },
      });

      if (!session) {
        throw new BadRequestException('Session not available for leaving');
      }

      await this.joinGameModel.deleteOne({ gameId: sessionId, userId });

      await this.gameModel.findByIdAndUpdate(sessionId, {
        $inc: { maxPerGame: -1 },
      });

      // Pull next user from the queue
      const nextInQueue = await this.queueModel.findOneAndDelete({
        gameId: sessionId,
      });

      if (nextInQueue) {
        const selectedNumber = Math.floor(Math.random() * 9) + 1;

        await this.joinGameModel.create({
          gameId: sessionId,
          userId: nextInQueue.userId,
          selectedNumber,
        });

        await this.gameModel.findByIdAndUpdate(sessionId, {
          $inc: { maxPerGame: 1 },
        });
      }

      return {
        success: true,
        message: 'User left session, next in queue has joined',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getTopTenPlayers() {
    try {
      // Find all winning entries
      const allWinners = await this.joinGameModel
        .find({ isWinner: true })
        .lean();

      // Count wins per user
      const userWinCount: Record<string, number> = {};
      for (const winner of allWinners) {
        const userId = winner.userId.toString();
        userWinCount[userId] = (userWinCount[userId] || 0) + 1;
      }

      // Sort and slice top 10
      const sorted = Object.entries(userWinCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

      const topPlayerIds = sorted.map(([userId]) => userId);

      // Fetch user data
      const users = await this.userModel
        .find({ _id: { $in: topPlayerIds } })
        .lean();

      // Map results
      const topPlayers = sorted.map(([userId, wins]) => {
        const user = users.find((u) => u._id.toString() === userId);
        return {
          userId,
          username: user?.username || 'Unknown',
          wins,
        };
      });

      return {
        success: true,
        message: 'Top players fetched successfully',
        data: topPlayers,
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to fetch top players',
      );
    }
  }
}
