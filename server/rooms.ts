import crypto from 'crypto';
import { Player, RoomSettings, RoomPhase, PublicGameState, CardColor } from '../src/types/game';
import { UnoGameEngine } from '../src/lib/game-engine/engine';

const ROOM_CODE_CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // 30 characters, no 0/O, 1/I/L

export interface SessionData {
  token: string;
  playerId: string;
  name: string;
  avatar: string;
  currentRoomId?: string;
  socketId?: string;
  lastActive: number;
}

export class Room {
  public id: string;
  public code: string;
  public hostId: string;
  public createdAt: number;
  public lastActivity: number;
  public settings: RoomSettings;
  public engine: UnoGameEngine;
  public disconnectTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(hostPlayer: Player, settings?: Partial<RoomSettings>, code?: string) {
    this.id = `room_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    this.code = code || Room.generateCode();
    this.hostId = hostPlayer.id;
    this.createdAt = Date.now();
    this.lastActivity = Date.now();

    this.settings = {
      maxPlayers: 8,
      startingCards: 7,
      turnTimerSeconds: 0,
      drawUntilMatch: false,
      ...settings,
    };

    this.engine = new UnoGameEngine(this.id, this.code, this.hostId, [hostPlayer], this.settings);
  }

  public static generateCode(): string {
    let result = '';
    const bytes = crypto.randomBytes(6);
    for (let i = 0; i < 6; i++) {
      result += ROOM_CODE_CHARS[bytes[i] % ROOM_CODE_CHARS.length];
    }
    return result;
  }

  public addPlayer(player: Player): { success: boolean; error?: string } {
    this.lastActivity = Date.now();
    if (this.engine.phase !== 'lobby') {
      return { success: false, error: 'Match has already started in this room.' };
    }

    if (this.engine.players.length >= this.settings.maxPlayers) {
      return { success: false, error: 'Room is full.' };
    }

    const existingIndex = this.engine.players.findIndex((p) => p.id === player.id);
    if (existingIndex !== -1) {
      // Re-joining player
      this.engine.players[existingIndex].isConnected = true;
      this.engine.players[existingIndex].name = player.name;
      this.engine.players[existingIndex].avatar = player.avatar;
      return { success: true };
    }

    this.engine.players.push(player);
    return { success: true };
  }

  public removePlayer(playerId: string): { removed: boolean; newHostId?: string; empty: boolean } {
    this.lastActivity = Date.now();
    const idx = this.engine.players.findIndex((p) => p.id === playerId);
    if (idx === -1) return { removed: false, empty: this.engine.players.length === 0 };

    this.engine.players.splice(idx, 1);

    if (this.engine.players.length === 0) {
      return { removed: true, empty: true };
    }

    let newHostId: string | undefined = undefined;
    if (this.hostId === playerId) {
      // Transfer host to first active player
      const nextHost = this.engine.players.find((p) => p.isConnected) || this.engine.players[0];
      nextHost.isHost = true;
      this.hostId = nextHost.id;
      this.engine.hostId = nextHost.id;
      newHostId = nextHost.id;
    }

    return { removed: true, newHostId, empty: false };
  }

  public markPlayerDisconnected(playerId: string) {
    const player = this.engine.players.find((p) => p.id === playerId);
    if (player) {
      player.isConnected = false;
    }
  }

  public updatePlayerIdentity(playerId: string, name: string, avatar: string) {
    const player = this.engine.players.find((p) => p.id === playerId);
    if (player) {
      if (name && name.trim()) player.name = name.trim().slice(0, 20);
      if (avatar) player.avatar = avatar;
    }
  }

  public markPlayerConnected(playerId: string) {
    const player = this.engine.players.find((p) => p.id === playerId);
    if (player) {
      player.isConnected = true;
      // Clear any disconnect grace period timer
      const timer = this.disconnectTimeouts.get(playerId);
      if (timer) {
        clearTimeout(timer);
        this.disconnectTimeouts.delete(playerId);
      }
    }
  }
}

export class RoomManager {
  private roomsById: Map<string, Room> = new Map();
  private roomsByCode: Map<string, Room> = new Map();
  private sessions: Map<string, SessionData> = new Map();

  public getSession(token: string): SessionData | undefined {
    return this.sessions.get(token);
  }

  public createOrUpdateSession(name?: string, avatar?: string, existingToken?: string): SessionData {
    let token = existingToken;
    let session = token ? this.sessions.get(token) : undefined;

    const cleanName = name && name.trim() ? name.trim().slice(0, 20) : 'Player';
    const cleanAvatar = avatar || 'geom-1';

    if (!session) {
      token = `sess_${crypto.randomBytes(16).toString('hex')}`;
      const playerId = `usr_${crypto.randomBytes(8).toString('hex')}`;
      session = {
        token,
        playerId,
        name: cleanName,
        avatar: cleanAvatar,
        lastActive: Date.now(),
      };
      this.sessions.set(token, session);
    } else {
      if (name && name.trim()) {
        session.name = name.trim().slice(0, 20);
      }
      if (avatar) {
        session.avatar = avatar;
      }
      session.lastActive = Date.now();
    }

    return session;
  }

  public createRoom(hostSession: SessionData, settings?: Partial<RoomSettings>): Room {
    // Generate unique code
    let code = Room.generateCode();
    while (this.roomsByCode.has(code)) {
      code = Room.generateCode();
    }

    const hostPlayer: Player = {
      id: hostSession.playerId,
      name: hostSession.name,
      avatar: hostSession.avatar,
      isHost: true,
      isReady: true,
      isConnected: true,
      cardCount: 0,
      hasCalledUno: false,
    };

    const room = new Room(hostPlayer, settings, code);
    this.roomsById.set(room.id, room);
    this.roomsByCode.set(room.code, room);
    hostSession.currentRoomId = room.id;

    return room;
  }

  public getRoomByCode(code: string): Room | undefined {
    return this.roomsByCode.get(code.toUpperCase().trim());
  }

  public getRoomById(id: string): Room | undefined {
    return this.roomsById.get(id);
  }

  public deleteRoom(roomId: string) {
    const room = this.roomsById.get(roomId);
    if (room) {
      this.roomsByCode.delete(room.code);
      this.roomsById.delete(roomId);
    }
  }
}
