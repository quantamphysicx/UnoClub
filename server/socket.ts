import { Server as SocketIOServer, Socket } from 'socket.io';
import { RoomManager, SessionData, Room } from './rooms';
import { CardColor, Player, RoomSettings } from '../src/types/game';
import { z } from 'zod';

const CreateRoomSchema = z.object({
  name: z.string().trim().min(2).max(20),
  avatar: z.string().min(1),
  settings: z
    .object({
      maxPlayers: z.number().min(2).max(8).optional(),
      startingCards: z.number().min(3).max(10).optional(),
      turnTimerSeconds: z.number().min(0).max(60).optional(),
    })
    .optional(),
});

const JoinRoomSchema = z.object({
  roomCode: z.string().trim().min(4).max(8),
  name: z.string().trim().min(2).max(20),
  avatar: z.string().min(1),
});

const PlayCardSchema = z.object({
  cardId: z.string().min(1),
  selectedColor: z.enum(['red', 'blue', 'green', 'yellow']).optional(),
});

export function setupSocketServer(io: SocketIOServer, roomManager: RoomManager) {
  // Map socket.id -> session
  const socketSessions: Map<string, SessionData> = new Map();

  function syncRoomState(room: Room) {
    const publicState = room.engine.getPublicState();
    io.to(room.id).emit('game:state_sync', publicState);

    // Send private hand sync to all connected sockets in this room
    const socketsInRoom = io.sockets.adapter.rooms.get(room.id);
    if (!socketsInRoom) return;

    for (const socketId of socketsInRoom) {
      const session = socketSessions.get(socketId);
      if (session) {
        const hand = room.engine.getPlayerHand(session.playerId);
        const validPlayCardIds = room.engine.getPlayableCardIds(session.playerId);
        io.to(socketId).emit('game:hand_sync', hand, validPlayCardIds);
      }
    }
  }

  io.on('connection', (socket: Socket) => {
    // 1. Session Auth / Reconnect
    socket.on('session:auth', (data: { sessionToken?: string; roomCode?: string }, callback) => {
      let session: SessionData;
      if (data.sessionToken) {
        const existing = roomManager.getSession(data.sessionToken);
        if (existing) {
          session = existing;
          session.socketId = socket.id;
        } else {
          session = roomManager.createOrUpdateSession('Player', 'geom-1', data.sessionToken);
        }
      } else {
        session = roomManager.createOrUpdateSession('Player', 'geom-1');
      }

      socketSessions.set(socket.id, session);

      // Check if user was in a room
      let activeRoom: Room | undefined;
      if (session.currentRoomId) {
        activeRoom = roomManager.getRoomById(session.currentRoomId);
      } else if (data.roomCode) {
        activeRoom = roomManager.getRoomByCode(data.roomCode);
      }

      if (activeRoom) {
        socket.join(activeRoom.id);
        activeRoom.markPlayerConnected(session.playerId);
        syncRoomState(activeRoom);
      }

      callback({
        success: true,
        player: {
          id: session.playerId,
          name: session.name,
          avatar: session.avatar,
          isHost: activeRoom ? activeRoom.hostId === session.playerId : false,
          isReady: false,
          isConnected: true,
          cardCount: 0,
          hasCalledUno: false,
        },
        roomCode: activeRoom?.code,
        sessionToken: session.token,
      });
    });

    // 2. Create Room
    socket.on('room:create', (payload, callback) => {
      try {
        const parsed = CreateRoomSchema.parse(payload);
        let session = socketSessions.get(socket.id);
        if (!session) {
          session = roomManager.createOrUpdateSession(parsed.name, parsed.avatar);
          socketSessions.set(socket.id, session);
        } else {
          session.name = parsed.name;
          session.avatar = parsed.avatar;
        }

        const room = roomManager.createRoom(session, parsed.settings);
        socket.join(room.id);
        session.currentRoomId = room.id;

        callback({ success: true, roomCode: room.code, playerId: session.playerId });
        syncRoomState(room);
      } catch (err: any) {
        callback({ success: false, error: err.message || 'Failed to create room.' });
      }
    });

    // 3. Join Room
    socket.on('room:join', (payload, callback) => {
      try {
        const parsed = JoinRoomSchema.parse(payload);
        const room = roomManager.getRoomByCode(parsed.roomCode);
        if (!room) {
          return callback({ success: false, error: 'Room not found. Check the code.' });
        }

        let session = socketSessions.get(socket.id);
        if (!session) {
          session = roomManager.createOrUpdateSession(parsed.name, parsed.avatar);
          socketSessions.set(socket.id, session);
        } else {
          session.name = parsed.name;
          session.avatar = parsed.avatar;
        }

        const player: Player = {
          id: session.playerId,
          name: session.name,
          avatar: session.avatar,
          isHost: room.hostId === session.playerId,
          isReady: false,
          isConnected: true,
          cardCount: 0,
          hasCalledUno: false,
        };

        const res = room.addPlayer(player);
        if (!res.success) {
          return callback({ success: false, error: res.error });
        }

        session.currentRoomId = room.id;
        socket.join(room.id);

        callback({ success: true, roomCode: room.code, playerId: session.playerId });
        syncRoomState(room);
      } catch (err: any) {
        callback({ success: false, error: err.message || 'Failed to join room.' });
      }
    });

    // 4. Leave Room
    socket.on('room:leave', () => {
      const session = socketSessions.get(socket.id);
      if (!session || !session.currentRoomId) return;

      const room = roomManager.getRoomById(session.currentRoomId);
      if (room) {
        socket.leave(room.id);
        const { removed, empty, newHostId } = room.removePlayer(session.playerId);
        session.currentRoomId = undefined;

        if (empty) {
          roomManager.deleteRoom(room.id);
        } else {
          syncRoomState(room);
        }
      }
    });

    // 5. Toggle Ready
    socket.on('room:toggle_ready', () => {
      const session = socketSessions.get(socket.id);
      if (!session || !session.currentRoomId) return;

      const room = roomManager.getRoomById(session.currentRoomId);
      if (!room) return;

      const player = room.engine.players.find((p) => p.id === session.playerId);
      if (player) {
        player.isReady = !player.isReady;
        syncRoomState(room);
      }
    });

    // 6. Update Settings (Host Only)
    socket.on('room:update_settings', (newSettings: Partial<RoomSettings>) => {
      const session = socketSessions.get(socket.id);
      if (!session || !session.currentRoomId) return;

      const room = roomManager.getRoomById(session.currentRoomId);
      if (!room || room.hostId !== session.playerId) return;

      if (room.engine.phase !== 'lobby') return;

      room.settings = { ...room.settings, ...newSettings };
      room.engine.settings = room.settings;
      syncRoomState(room);
    });

    // 7. Kick Player (Host Only)
    socket.on('room:kick_player', (targetPlayerId: string) => {
      const session = socketSessions.get(socket.id);
      if (!session || !session.currentRoomId) return;

      const room = roomManager.getRoomById(session.currentRoomId);
      if (!room || room.hostId !== session.playerId) return;

      if (targetPlayerId === room.hostId) return; // Cannot kick host

      room.removePlayer(targetPlayerId);

      // Notify target socket
      for (const [sId, s] of socketSessions.entries()) {
        if (s.playerId === targetPlayerId) {
          s.currentRoomId = undefined;
          io.to(sId).emit('room:closed', 'You were removed from the room by the host.');
          const targetSocket = io.sockets.sockets.get(sId);
          if (targetSocket) targetSocket.leave(room.id);
        }
      }

      syncRoomState(room);
    });

    // 8. Start Game (Host Only)
    socket.on('game:start', () => {
      const session = socketSessions.get(socket.id);
      if (!session || !session.currentRoomId) return;

      const room = roomManager.getRoomById(session.currentRoomId);
      if (!room || room.hostId !== session.playerId) return;

      if (room.engine.players.length < 2) {
        socket.emit('error:notification', 'At least 2 players are required to start.');
        return;
      }

      const started = room.engine.startMatch();
      if (started) {
        syncRoomState(room);
      }
    });

    // 9. Play Card
    socket.on('game:play_card', (payload, callback) => {
      try {
        const parsed = PlayCardSchema.parse(payload);
        const session = socketSessions.get(socket.id);
        if (!session || !session.currentRoomId) {
          return callback({ success: false, error: 'Not in a room.' });
        }

        const room = roomManager.getRoomById(session.currentRoomId);
        if (!room) {
          return callback({ success: false, error: 'Room not found.' });
        }

        const res = room.engine.playCard(
          session.playerId,
          parsed.cardId,
          parsed.selectedColor as CardColor | undefined
        );

        if (!res.success) {
          return callback({ success: false, error: res.error });
        }

        callback({ success: true });
        syncRoomState(room);
      } catch (err: any) {
        callback({ success: false, error: err.message || 'Invalid card play.' });
      }
    });

    // 10. Draw Card
    socket.on('game:draw_card', (callback) => {
      const session = socketSessions.get(socket.id);
      if (!session || !session.currentRoomId) {
        return callback({ success: false, error: 'Not in a room.' });
      }

      const room = roomManager.getRoomById(session.currentRoomId);
      if (!room) {
        return callback({ success: false, error: 'Room not found.' });
      }

      const res = room.engine.drawCard(session.playerId);
      callback(res);
      if (res.success) {
        syncRoomState(room);
      }
    });

    // 11. Pass Turn
    socket.on('game:pass_turn', (callback) => {
      const session = socketSessions.get(socket.id);
      if (!session || !session.currentRoomId) {
        return callback({ success: false, error: 'Not in a room.' });
      }

      const room = roomManager.getRoomById(session.currentRoomId);
      if (!room) {
        return callback({ success: false, error: 'Room not found.' });
      }

      const res = room.engine.passTurn(session.playerId);
      callback(res);
      if (res.success) {
        syncRoomState(room);
      }
    });

    // 12. Call UNO
    socket.on('game:call_uno', (callback) => {
      const session = socketSessions.get(socket.id);
      if (!session || !session.currentRoomId) {
        return callback({ success: false, error: 'Not in a room.' });
      }

      const room = roomManager.getRoomById(session.currentRoomId);
      if (!room) {
        return callback({ success: false, error: 'Room not found.' });
      }

      const res = room.engine.callUno(session.playerId);
      callback(res);
      if (res.success) {
        syncRoomState(room);
      }
    });

    // 13. Challenge UNO
    socket.on('game:challenge_uno', (targetPlayerId: string, callback) => {
      const session = socketSessions.get(socket.id);
      if (!session || !session.currentRoomId) {
        return callback({ success: false, error: 'Not in a room.' });
      }

      const room = roomManager.getRoomById(session.currentRoomId);
      if (!room) {
        return callback({ success: false, error: 'Room not found.' });
      }

      const res = room.engine.challengeUno(session.playerId, targetPlayerId);
      callback(res);
      if (res.success) {
        syncRoomState(room);
      }
    });

    // 14. Rematch
    socket.on('game:rematch', () => {
      const session = socketSessions.get(socket.id);
      if (!session || !session.currentRoomId) return;

      const room = roomManager.getRoomById(session.currentRoomId);
      if (!room) return;

      // Allow anyone or host to trigger rematch
      const started = room.engine.startMatch();
      if (started) {
        syncRoomState(room);
      }
    });

    // 15. Disconnect handling
    socket.on('disconnect', () => {
      const session = socketSessions.get(socket.id);
      if (session && session.currentRoomId) {
        const room = roomManager.getRoomById(session.currentRoomId);
        if (room) {
          room.markPlayerDisconnected(session.playerId);
          syncRoomState(room);

          // Grace period timer: if player doesn't reconnect in 60s
          const timeout = setTimeout(() => {
            const currentP = room.engine.players.find((p) => p.id === session.playerId);
            if (currentP && !currentP.isConnected) {
              if (room.engine.phase === 'lobby') {
                const { empty } = room.removePlayer(session.playerId);
                if (empty) {
                  roomManager.deleteRoom(room.id);
                } else {
                  syncRoomState(room);
                }
              }
            }
          }, 60000);

          room.disconnectTimeouts.set(session.playerId, timeout);
        }
      }
      socketSessions.delete(socket.id);
    });
  });
}
