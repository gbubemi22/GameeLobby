export enum GameServiceSocketEnum {
  CREATE_GAME = 'createGame',
  GAME_CREATED = 'gameCreated',
  LIST_GAMES = 'listGames',
  GAMES_LISTED = 'gamesListed',
  LIST_ONE_GAME = 'listOneGame',
  ONE_GAME_LISTED = 'oneGameListed',
  JOIN_GAME = 'joinGame',
  GAME_JOINED = 'gameJoined',
  LEAVE_GAME = 'leaveGame',
  GAME_LEFT = 'gameLeft',
  ERROR = 'error',
}

export interface createGame {
  name: string;
  userId: string;
}

export interface JoinGame {
  sessionId: string;
  userId: string;
  selectedNumber: number;
}

export interface LeaveGame {
  sessionId: string;
  userId: string;
}

export interface ListGame {
  sessionId: string;
}
