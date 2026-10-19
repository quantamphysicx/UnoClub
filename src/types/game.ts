export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild';

export type CardValue =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | 'skip' | 'reverse' | 'draw2'
  | 'wild' | 'wild_draw4';

export interface Card {
  id: string; // Unique instance ID, e.g. "c_red_5_1"
  color: CardColor;
  value: CardValue;
  score: number;
}

export interface Player {
  id: string; // Session guest ID
  name: string;
  avatar: string; // Avatar identifier (e.g., "geom-1", "geom-2", etc.)
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
  cardCount: number;
  hasCalledUno: boolean;
  unoChallengeableUntil?: number | null; // Timestamp until which player can be called out for failing to call UNO
  score?: number;
}

export type RoomPhase = 'lobby' | 'in_game' | 'round_over' | 'closed';

export type TurnDirection = 1 | -1; // 1 = clockwise, -1 = counter-clockwise

export interface RoomSettings {
  maxPlayers: number; // 2 to 8
  startingCards: number; // 7
  turnTimerSeconds: number; // 0 = off, 15, 30, 45
  drawUntilMatch: boolean; // false = draw 1 and pass, true = draw until playable
}

export interface GameLogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: 'play' | 'draw' | 'uno' | 'challenge' | 'turn' | 'system' | 'win';
}

export interface PublicGameState {
  roomId: string;
  roomCode: string;
  phase: RoomPhase;
  hostId: string;
  settings: RoomSettings;
  players: Player[];
  currentTurnPlayerId: string | null;
  direction: TurnDirection;
  topDiscardCard: Card | null;
  activeColor: CardColor | null;
  drawPileCount: number;
  discardPileCount: number;
  winnerId: string | null;
  turnTimeRemaining: number | null;
  hasDrawnCardThisTurn: boolean; // Whether current player has already drawn this turn
  logs: GameLogEntry[];
}

export interface PrivateGameState {
  publicState: PublicGameState;
  hand: Card[];
  validPlayCardIds: string[];
  canDraw: boolean;
  canPass: boolean;
  canCallUno: boolean;
  canChallengeUno: boolean;
}

// Client to Server Events
export interface ClientToServerEvents {
  'room:create': (data: { name: string; avatar: string; settings?: Partial<RoomSettings> }, callback: (res: { success: boolean; roomCode?: string; error?: string }) => void) => void;
  'room:join': (data: { roomCode: string; name: string; avatar: string }, callback: (res: { success: boolean; roomCode?: string; error?: string }) => void) => void;
  'room:leave': () => void;
  'room:toggle_ready': () => void;
  'room:update_settings': (settings: Partial<RoomSettings>) => void;
  'room:kick_player': (targetPlayerId: string) => void;
  'game:start': () => void;
  'game:play_card': (data: { cardId: string; selectedColor?: CardColor }, callback: (res: { success: boolean; error?: string }) => void) => void;
  'game:draw_card': (callback: (res: { success: boolean; cardDrawn?: Card; canPlay?: boolean; error?: string }) => void) => void;
  'game:pass_turn': (callback: (res: { success: boolean; error?: string }) => void) => void;
  'game:call_uno': (callback: (res: { success: boolean; error?: string }) => void) => void;
  'game:challenge_uno': (targetPlayerId: string, callback: (res: { success: boolean; penaltyApplied?: boolean; error?: string }) => void) => void;
  'session:auth': (data: { sessionToken?: string; roomCode?: string; name?: string; avatar?: string }, callback: (res: { success: boolean; player?: Player; roomCode?: string; sessionToken?: string; error?: string }) => void) => void;
  'player:update_profile': (data: { name: string; avatar: string }, callback?: (res: { success: boolean }) => void) => void;
}

// Server to Client Events
export interface ServerToClientEvents {
  'game:state_sync': (state: PublicGameState) => void;
  'game:hand_sync': (hand: Card[], validPlayCardIds: string[]) => void;
  'game:action_event': (event: { type: string; playerId: string; message: string; card?: Card; selectedColor?: CardColor }) => void;
  'room:player_joined': (player: Player) => void;
  'room:player_left': (playerId: string, newHostId?: string) => void;
  'room:closed': (reason: string) => void;
  'error:notification': (message: string) => void;
}
