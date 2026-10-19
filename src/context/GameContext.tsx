'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Card, CardColor, Player, PublicGameState, RoomSettings } from '@/types/game';
import { sounds } from '@/lib/sound/audio';

interface ToastMessage {
  id: string;
  text: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface GameContextType {
  socket: Socket | null;
  isConnected: boolean;
  playerName: string;
  playerAvatar: string;
  sessionToken: string | null;
  playerId: string | null;
  setPlayerIdentity: (name: string, avatar: string) => void;

  publicState: PublicGameState | null;
  hand: Card[];
  validPlayCardIds: string[];

  toasts: ToastMessage[];
  addToast: (text: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  isMuted: boolean;
  toggleMute: () => void;

  createRoom: (settings?: Partial<RoomSettings>) => Promise<{ success: boolean; roomCode?: string; error?: string }>;
  joinRoom: (roomCode: string) => Promise<{ success: boolean; roomCode?: string; error?: string }>;
  leaveRoom: () => void;
  toggleReady: () => void;
  updateSettings: (settings: Partial<RoomSettings>) => void;
  kickPlayer: (targetId: string) => void;
  startGame: () => void;
  playCard: (cardId: string, selectedColor?: CardColor) => Promise<boolean>;
  drawCard: () => Promise<boolean>;
  passTurn: () => Promise<boolean>;
  callUno: () => Promise<boolean>;
  challengeUno: (targetId: string) => Promise<boolean>;
  rematch: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('Player');
  const [playerAvatar, setPlayerAvatar] = useState('geom-1');

  const [publicState, setPublicState] = useState<PublicGameState | null>(null);
  const [hand, setHand] = useState<Card[]>([]);
  const [validPlayCardIds, setValidPlayCardIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const addToast = useCallback((text: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleMute = useCallback(() => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  }, []);

  // Initialize identity from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('uno_session_token');
      const storedName = localStorage.getItem('uno_player_name');
      const storedAvatar = localStorage.getItem('uno_player_avatar');
      setIsMuted(sounds.getMuted());

      if (storedToken) setSessionToken(storedToken);
      if (storedName) setPlayerName(storedName);
      if (storedAvatar) setPlayerAvatar(storedAvatar);
    }
  }, []);

  // Setup Socket connection
  useEffect(() => {
    const socketInstance = io({
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      const token =
        (typeof window !== 'undefined'
          ? sessionStorage.getItem('uno_session_token')
          : null) || undefined;

      // Extract room code from URL path if in /room/[code]
      const pathParts = window.location.pathname.split('/');
      const urlCode = pathParts[1] === 'room' && pathParts[2] ? pathParts[2] : undefined;

      socketInstance.emit('session:auth', { sessionToken: token, roomCode: urlCode }, (res: any) => {
        if (res.success && res.player) {
          setPlayerId(res.player.id);
          if (res.sessionToken) {
            setSessionToken(res.sessionToken);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('uno_session_token', res.sessionToken);
            }
          }
        }
      });
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('game:state_sync', (state: PublicGameState) => {
      setPublicState((prev) => {
        // Play sounds on phase changes or plays
        if (prev?.phase === 'lobby' && state.phase === 'in_game') {
          sounds.drawCard();
        } else if (state.phase === 'round_over' && prev?.phase !== 'round_over') {
          sounds.win();
        } else if (state.topDiscardCard?.id !== prev?.topDiscardCard?.id) {
          sounds.playCard();
        } else if (state.direction !== prev?.direction) {
          sounds.reverse();
        } else if (state.activeColor !== prev?.activeColor && state.topDiscardCard?.color === 'wild') {
          sounds.colorChange();
        }
        return state;
      });
    });

    socketInstance.on('game:hand_sync', (newHand: Card[], validIds: string[]) => {
      setHand(newHand);
      setValidPlayCardIds(validIds);
    });

    socketInstance.on('room:closed', (reason: string) => {
      addToast(reason, 'warning');
      setPublicState(null);
      setHand([]);
      window.location.href = '/';
    });

    socketInstance.on('error:notification', (msg: string) => {
      sounds.error();
      addToast(msg, 'error');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [addToast]);

  const setPlayerIdentity = useCallback(
    (name: string, avatar: string) => {
      const cleanName = name.trim().slice(0, 20);
      setPlayerName(cleanName);
      setPlayerAvatar(avatar);
      if (typeof window !== 'undefined') {
        localStorage.setItem('uno_player_name', cleanName);
        localStorage.setItem('uno_player_avatar', avatar);
      }
    },
    []
  );

  const createRoom = useCallback(
    async (settings?: Partial<RoomSettings>): Promise<{ success: boolean; roomCode?: string; error?: string }> => {
      if (!socket) return { success: false, error: 'Connecting to server...' };

      return new Promise((resolve) => {
        socket.emit(
          'room:create',
          {
            name: playerName,
            avatar: playerAvatar,
            settings,
          },
          (res: any) => {
            if (res.success && res.roomCode) {
              if (res.playerId) setPlayerId(res.playerId);
              addToast(`Room created! Code: ${res.roomCode}`, 'success');
              resolve(res);
            } else {
              sounds.error();
              addToast(res.error || 'Failed to create room', 'error');
              resolve(res);
            }
          }
        );
      });
    },
    [socket, playerName, playerAvatar, addToast]
  );

  const joinRoom = useCallback(
    async (roomCode: string): Promise<{ success: boolean; roomCode?: string; error?: string }> => {
      if (!socket) return { success: false, error: 'Connecting to server...' };

      return new Promise((resolve) => {
        socket.emit(
          'room:join',
          {
            roomCode: roomCode.trim().toUpperCase(),
            name: playerName,
            avatar: playerAvatar,
          },
          (res: any) => {
            if (res.success) {
              if (res.playerId) setPlayerId(res.playerId);
              addToast('Joined room successfully!', 'success');
              resolve(res);
            } else {
              sounds.error();
              addToast(res.error || 'Could not join room', 'error');
              resolve(res);
            }
          }
        );
      });
    },
    [socket, playerName, playerAvatar, addToast]
  );

  const leaveRoom = useCallback(() => {
    if (socket) {
      socket.emit('room:leave');
      setPublicState(null);
      setHand([]);
    }
  }, [socket]);

  const toggleReady = useCallback(() => {
    if (socket) socket.emit('room:toggle_ready');
  }, [socket]);

  const updateSettings = useCallback(
    (settings: Partial<RoomSettings>) => {
      if (socket) socket.emit('room:update_settings', settings);
    },
    [socket]
  );

  const kickPlayer = useCallback(
    (targetId: string) => {
      if (socket) socket.emit('room:kick_player', targetId);
    },
    [socket]
  );

  const startGame = useCallback(() => {
    if (socket) socket.emit('game:start');
  }, [socket]);

  const playCard = useCallback(
    async (cardId: string, selectedColor?: CardColor): Promise<boolean> => {
      if (!socket) return false;
      return new Promise((resolve) => {
        socket.emit('game:play_card', { cardId, selectedColor }, (res: any) => {
          if (res.success) {
            resolve(true);
          } else {
            sounds.error();
            addToast(res.error || 'Illegal move', 'error');
            resolve(false);
          }
        });
      });
    },
    [socket, addToast]
  );

  const drawCard = useCallback(async (): Promise<boolean> => {
    if (!socket) return false;
    return new Promise((resolve) => {
      socket.emit('game:draw_card', (res: any) => {
        if (res.success) {
          sounds.drawCard();
          if (res.canPlay) {
            addToast('You drew a playable card!', 'info');
          } else {
            addToast('Card drawn. You can pass if unplayable.', 'info');
          }
          resolve(true);
        } else {
          sounds.error();
          addToast(res.error || 'Cannot draw right now', 'error');
          resolve(false);
        }
      });
    });
  }, [socket, addToast]);

  const passTurn = useCallback(async (): Promise<boolean> => {
    if (!socket) return false;
    return new Promise((resolve) => {
      socket.emit('game:pass_turn', (res: any) => {
        if (res.success) {
          resolve(true);
        } else {
          sounds.error();
          addToast(res.error || 'Cannot pass', 'error');
          resolve(false);
        }
      });
    });
  }, [socket, addToast]);

  const callUno = useCallback(async (): Promise<boolean> => {
    if (!socket) return false;
    sounds.uno();
    return new Promise((resolve) => {
      socket.emit('game:call_uno', (res: any) => {
        if (res.success) {
          addToast('UNO declared!', 'success');
          resolve(true);
        } else {
          sounds.error();
          addToast(res.error || 'Cannot call UNO', 'error');
          resolve(false);
        }
      });
    });
  }, [socket, addToast]);

  const challengeUno = useCallback(
    async (targetId: string): Promise<boolean> => {
      if (!socket) return false;
      return new Promise((resolve) => {
        socket.emit('game:challenge_uno', targetId, (res: any) => {
          if (res.success) {
            sounds.uno();
            addToast('UNO Challenge successful! Opponent penalized +2 cards!', 'success');
            resolve(true);
          } else {
            sounds.error();
            addToast(res.error || 'Challenge failed', 'warning');
            resolve(false);
          }
        });
      });
    },
    [socket, addToast]
  );

  const rematch = useCallback(() => {
    if (socket) socket.emit('game:rematch');
  }, [socket]);

  return (
    <GameContext.Provider
      value={{
        socket,
        isConnected,
        playerName,
        playerAvatar,
        sessionToken,
        playerId,
        setPlayerIdentity,
        publicState,
        hand,
        validPlayCardIds,
        toasts,
        addToast,
        removeToast,
        isMuted,
        toggleMute,
        createRoom,
        joinRoom,
        leaveRoom,
        toggleReady,
        updateSettings,
        kickPlayer,
        startGame,
        playCard,
        drawCard,
        passTurn,
        callUno,
        challengeUno,
        rematch,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}
