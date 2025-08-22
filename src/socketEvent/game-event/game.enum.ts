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
  INVITE_GAME = 'inviteGame',
  GAME_INVITED = 'gameInvited',
  ACCEPT_INVITE = 'acceptInvite',
  GAME_ACCEPTED = 'gameAccepted',
  REJECT_INVITE = 'rejectInvite',
  GAME_REJECTED = 'gameRejected',
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

export interface InviteGame {
  senderId: string;
  receiverId: string;
  gameId: string;
  note: string;
}


export interface AcceptInvite {
    receiverId: string,
    gameId: string,
    selectedNumber: number,
  
}


export interface RejectInvite {
  receiverId: string;
  gameId: string;
}