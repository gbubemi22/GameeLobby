/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Logger } from '@nestjs/common';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from 'src/game/service/game.service';
import { JoinGameService } from 'src/joingame/service/joingame.service';
import {
  createGame,
  GameServiceSocketEnum,
  JoinGame,
  LeaveGame,
  ListGame,
} from './game.enum';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'game',
})
export class GameServiceGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(GameServiceGateway.name);

  constructor(
    private readonly gameService: GameService,
    private readonly joinGameService: JoinGameService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  afterInit(server: Server) {
    this.logger.log('MessageServiceGateway Socket Connected and running');
    server.disconnectSockets();
  }
  ////// GAMES SOCKET EVENT ////////
  @SubscribeMessage(GameServiceSocketEnum.CREATE_GAME)
  async handleCreateGame(
    @MessageBody()
    data: createGame,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { name, userId } = data;
      const game = await this.gameService.CreateGame(name, userId);

      client.emit(
        GameServiceSocketEnum.GAME_CREATED,
        JSON.stringify({
          game: game,
        }),
      );
    } catch (error) {
      client.emit(GameServiceSocketEnum.ERROR, error?.message);

      throw new WsException(`MessageServiceGateway.handleCreateGame, ${error}`);
    }
  }

  @SubscribeMessage(GameServiceSocketEnum.LIST_GAMES)
  async handleListGames(
    @MessageBody()
    @ConnectedSocket()
    client: Socket,
  ) {
    try {
      const games = await this.gameService.getGames();

      client.emit(
        GameServiceSocketEnum.GAMES_LISTED,
        JSON.stringify({
          games: games,
        }),
      );
    } catch (error) {
      client.emit(GameServiceSocketEnum.ERROR, error?.message);

      throw new WsException(`MessageServiceGateway.handleListGames, ${error}`);
    }
  }

  @SubscribeMessage(GameServiceSocketEnum.LIST_ONE_GAME)
  async handleListOneGame(
    @MessageBody()
    data: ListGame,
    @ConnectedSocket()
    client: Socket,
  ) {
    try {
      const games = await this.gameService.getGameOne(data.sessionId);

      client.emit(
        GameServiceSocketEnum.ONE_GAME_LISTED,
        JSON.stringify({
          games: games,
        }),
      );
    } catch (error) {
      client.emit(GameServiceSocketEnum.ERROR, error?.message);

      throw new WsException(
        `MessageServiceGateway.handleListOneGame, ${error}`,
      );
    }
  }

  //////////////// JOIN GAMES || SESSION /////////

  @SubscribeMessage(GameServiceSocketEnum.JOIN_GAME)
  async handleJoinGame(
    @MessageBody()
    data: JoinGame,
    @ConnectedSocket()
    client: Socket,
  ) {
    try {
      const { sessionId, userId, selectedNumber } = data;
      const games = await this.joinGameService.joinSession(
        sessionId,
        userId,
        selectedNumber,
      );

      client.emit(
        GameServiceSocketEnum.GAME_JOINED,
        JSON.stringify({
          games: games,
        }),
      );
    } catch (error) {
      client.emit(GameServiceSocketEnum.ERROR, error?.message);

      throw new WsException(`MessageServiceGateway.handleJoinGame, ${error}`);
    }
  }

  @SubscribeMessage(GameServiceSocketEnum.LEAVE_GAME)
  async handleLeaveGame(
    @MessageBody()
    data: LeaveGame,
    @ConnectedSocket()
    client: Socket,
  ) {
    try {
      const { sessionId, userId } = data;
      const games = await this.joinGameService.leaveSession(sessionId, userId);

      client.emit(
        GameServiceSocketEnum.GAME_LEFT,
        JSON.stringify({
          games: games,
        }),
      );
    } catch (error) {
      client.emit(GameServiceSocketEnum.ERROR, error?.message);

      throw new WsException(`MessageServiceGateway.handleLeaveGame, ${error}`);
    }
  }
}
