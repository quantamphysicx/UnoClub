import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { io as ClientSocket, Socket as ClientSocketType } from 'socket.io-client';
import { RoomManager } from '../server/rooms';
import { setupSocketServer } from '../server/socket';
import { Card, PublicGameState } from '../src/types/game';

describe('Real-Time Multiplayer Integration Test', () => {
  let server: any;
  let port: number;
  let clientA: ClientSocketType;
  let clientB: ClientSocketType;
  let roomCode: string;
  let gameAState: PublicGameState;
  let handA: Card[];
  let handB: Card[];

  beforeAll(async () => {
    // Start isolated test server on random port
    const httpServer = createServer();
    const io = new SocketIOServer(httpServer);
    const roomManager = new RoomManager();
    setupSocketServer(io, roomManager);

    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => {
        port = (httpServer.address() as any).port;
        resolve();
      });
    });

    server = httpServer;
  });

  afterAll(() => {
    if (clientA) clientA.disconnect();
    if (clientB) clientB.disconnect();
    if (server) server.close();
  });

  it('connects Client A and creates a room with unique 6-char code', async () => {
    clientA = ClientSocket(`http://localhost:${port}`, { transports: ['websocket'] });

    await new Promise<void>((resolve) => {
      clientA.on('connect', resolve);
    });

    const createRes = await new Promise<any>((resolve) => {
      clientA.emit(
        'room:create',
        { name: 'HostAlice', avatar: 'geom-1', settings: { maxPlayers: 4 } },
        resolve
      );
    });

    expect(createRes.success).toBe(true);
    expect(createRes.roomCode).toBeDefined();
    expect(createRes.roomCode.length).toBe(6);
    roomCode = createRes.roomCode;
  });

  it('connects Client B and joins the same room with real-time synchronization', async () => {
    clientB = ClientSocket(`http://localhost:${port}`, { transports: ['websocket'] });

    await new Promise<void>((resolve) => {
      clientB.on('connect', resolve);
    });

    const statePromiseA = new Promise<PublicGameState>((resolve) => {
      clientA.once('game:state_sync', resolve);
    });

    const joinRes = await new Promise<any>((resolve) => {
      clientB.emit('room:join', { roomCode, name: 'GuestBob', avatar: 'geom-2' }, resolve);
    });

    expect(joinRes.success).toBe(true);

    const updatedState = await statePromiseA;
    expect(updatedState.players.length).toBe(2);
    expect(updatedState.players.map((p) => p.name)).toContain('HostAlice');
    expect(updatedState.players.map((p) => p.name)).toContain('GuestBob');
  });

  it('synchronizes ready state and starts match with private hands', async () => {
    const readyPromiseA = new Promise<PublicGameState>((resolve) => {
      clientA.once('game:state_sync', resolve);
    });
    const readyPromiseB = new Promise<PublicGameState>((resolve) => {
      clientB.once('game:state_sync', resolve);
    });

    clientB.emit('room:toggle_ready');
    const [readyA, readyB] = await Promise.all([readyPromiseA, readyPromiseB]);
    expect(readyA.players.find((p) => p.name === 'GuestBob')?.isReady).toBe(true);
    expect(readyB.players.find((p) => p.name === 'GuestBob')?.isReady).toBe(true);

    const startPromiseA = new Promise<PublicGameState>((resolve) => {
      clientA.once('game:state_sync', resolve);
    });
    const startPromiseB = new Promise<PublicGameState>((resolve) => {
      clientB.once('game:state_sync', resolve);
    });
    const handPromiseA = new Promise<Card[]>((resolve) => {
      clientA.once('game:hand_sync', (hand) => resolve(hand));
    });
    const handPromiseB = new Promise<Card[]>((resolve) => {
      clientB.once('game:hand_sync', (hand) => resolve(hand));
    });

    clientA.emit('game:start');

    const [gameA, gameB, hA, hB] = await Promise.all([
      startPromiseA,
      startPromiseB,
      handPromiseA,
      handPromiseB,
    ]);

    expect(gameA.phase).toBe('in_game');
    expect(gameB.phase).toBe('in_game');
    expect(gameA.topDiscardCard).toBeDefined();
    expect(gameA.currentTurnPlayerId).toBeDefined();

    expect(hA.length).toBe(7);
    expect(hB.length).toBe(7);

    gameAState = gameA;
    handA = hA;
    handB = hB;
  });

  it('executes card draw and pass turn on player turn', async () => {
    // Current player draws a card
    const turnPlayer = gameAState.currentTurnPlayerId;
    const activeClient = turnPlayer === gameAState.players[0].id ? clientA : clientB;

    const drawRes = await new Promise<any>((resolve) => {
      activeClient.emit('game:draw_card', resolve);
    });

    expect(drawRes.success).toBe(true);
    expect(drawRes.cardDrawn).toBeDefined();

    // Player passes turn
    const passRes = await new Promise<any>((resolve) => {
      activeClient.emit('game:pass_turn', resolve);
    });

    expect(passRes.success).toBe(true);
  });
});
