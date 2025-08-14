import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invite } from '../schema/invite.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { JoinGame } from 'src/joingame/schema/joingame.schema';
import { Game } from 'src/game/schema/game.schema';
import { Queue } from 'src/joingame/schema/queue.schema';

@Injectable()
export class InviteService {
  constructor(
    @InjectModel(Invite.name) private inviteModel: Model<Invite>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(JoinGame.name) private joinGameModel: Model<JoinGame>,
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(Queue.name) private queueModel: Model<Queue>,
  ) {}

  async createInvite(
    senderId: string,
    receiverId: string,
    gameId: string,
    note: string,
  ) {
    try {
      const sender = await this.userModel.findById(senderId);
      if (!sender) {
        return {
          status: false,
          message: 'Sender not found',
          data: null,
        };
      }

      const receiver = await this.userModel.findById(receiverId);

      if (!receiver) {
        return {
          status: false,
          message: 'Receiver not found',
          data: null,
        };
      }

      if (senderId === receiverId) {
        return {
          status: false,
          message: 'Sender and receiver cannot be the same',
          data: null,
        };
      }
      const invite = await this.inviteModel.create({
        sender: senderId,
        receiver: receiverId,
        game: gameId,
        note: note,
      });

      return {
        status: true,
        message: 'Invite sent successfully',
        data: invite,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
        data: null,
      };
    }
  }

  async rejectInvite(receiverId: string, gameId: string) {
    try {
      const cancelInvite = await this.inviteModel.findOneAndUpdate(
        {
          receiver: receiverId,
          game: gameId,
        },
        {
          $set: { status: 'rejected' },
        },
        {
          new: true,
        },
      );

      return {
        status: true,
        message: 'Invite Declined successfully',
        data: cancelInvite,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
        data: null,
      };
    }
  }

  async acceptInvite(
    receiverId: string,
    gameId: string,
    selectedNumber: number,
  ) {
    try {
      const acceptInvite = await this.inviteModel.findOneAndUpdate(
        {
          receiver: receiverId,
          game: gameId,
        },
        {
          $set: { status: 'accepted' },
        },
        {
          new: true,
        },
      );

      if (!acceptInvite) {
        return {
          status: false,
          message: 'Invite not found',
          data: null,
        };
      }

      const session = await this.gameModel.findOne({
        _id: acceptInvite.game,
      });

      if (!session) {
        return {
          status: false,
          message: 'Session not found ',
          data: null,
        };
      }
      if (session.status === 'ENDED') {
        return {
          status: false,
          message: 'Session has ended ',
          data: null,
        };
      }

      if (session.status === 'IN_PROGRESS') {
        return {
          status: false,
          message: 'Session in progress',
          data: null,
        };
      }
      const userId = acceptInvite.receiver;

      const MAX_LIMIT = Number(process.env.SESSION_DURATION);
      console.log(MAX_LIMIT);

      if (session.joinCount === session.maxPerGame) {
        await this.queueModel.create({ gameId: gameId, userId });
        return {
          success: true,
          message: 'Session is full. You have been added to the queue.',
        };
      }

      const autoJoin = await this.joinGameModel.create({
        gameId: gameId,
        userId: userId,
        selectedNumber,
      });

      const game = await this.gameModel.findByIdAndUpdate(
        { _id: gameId },
        { $inc: { joinCount: 1 } },
      );

      if (game?.joinCount === MAX_LIMIT) {
        await this.gameModel.findByIdAndUpdate(gameId, {
          status: 'IN_PROGRESS',
        });
      }

      return {
        success: true,
        message: 'User joined successfully',
        data: autoJoin,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
        data: null,
      };
    }
  }
}
