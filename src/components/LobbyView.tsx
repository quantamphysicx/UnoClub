'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Avatar } from './Avatar';
import {
  Copy,
  Check,
  Share2,
  Crown,
  Play,
  LogOut,
  Users,
  Clock,
  Shield,
  UserX,
} from 'lucide-react';

interface LobbyViewProps {
  roomCode: string;
}

export function LobbyView({ roomCode }: LobbyViewProps) {
  const {
    publicState,
    playerId,
    toggleReady,
    startGame,
    leaveRoom,
    kickPlayer,
    addToast,
  } = useGame();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!publicState) return null;

  const me = publicState.players.find((p) => p.id === playerId);
  const isHost = me?.isHost || publicState.hostId === playerId;
  const canStart = isHost && publicState.players.length >= 2;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopiedCode(true);
      addToast('Room code copied', 'success');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      addToast('Failed to copy code', 'error');
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/room/${roomCode}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      addToast('Invite link copied', 'success');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      addToast('Failed to copy link', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my UNO CLUB room',
          text: `Join my private UNO CLUB match! Room Code: ${roomCode}`,
          url: `${window.location.origin}/room/${roomCode}`,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner: Room Code Card */}
      <div className="bg-[#181818] border border-[#2E2E2E] rounded p-6 sm:p-7 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A5A39E] font-bold">
                Private Table
              </span>
              <span className="text-xs text-[#777570]">· Classic Rules</span>
            </div>
            <p className="text-xs text-[#777570] mb-1">Share this code with your friends:</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-[#F2F0EB]">
                {roomCode}
              </span>
            </div>
          </div>

          {/* Copy Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#222222] hover:bg-[#2A2A2A] border border-[#333333] text-xs font-semibold text-[#F2F0EB] transition cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-[#1EA245]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? 'Copied' : 'Copy Code'}
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#222222] hover:bg-[#2A2A2A] border border-[#333333] text-xs font-semibold text-[#F2F0EB] transition cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#1EA245]" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'Link Copied' : 'Copy Link'}
            </button>

            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                onClick={handleNativeShare}
                className="p-2 rounded bg-[#222222] hover:bg-[#2A2A2A] border border-[#333333] text-[#F2F0EB] transition cursor-pointer"
                title="Share"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Room Settings Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-[#262626] text-xs text-[#A5A39E]">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#777570]" />
            <span>
              Players: <strong className="text-[#F2F0EB]">{publicState.players.length}</strong> / {publicState.settings.maxPlayers}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#777570]" />
            <span>
              Turn Timer: <strong className="text-[#F2F0EB]">{publicState.settings.turnTimerSeconds ? `${publicState.settings.turnTimerSeconds}s` : 'None'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#777570]" />
            <span>
              Host: <strong className="text-[#F2F0EB]">{publicState.players.find((p) => p.isHost)?.name || 'Host'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Players Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#F2F0EB] uppercase tracking-wide">
            Connected Players ({publicState.players.length})
          </h3>
          <span className="text-xs text-[#777570]">
            {publicState.players.length < 2
              ? 'Waiting for 1 more player to join...'
              : 'Table ready to start'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {publicState.players.map((player) => {
            const isCurrentMe = player.id === playerId;
            return (
              <div
                key={player.id}
                className={`p-3.5 rounded border flex items-center justify-between ${
                  isCurrentMe
                    ? 'border-[#444444] bg-[#202020]'
                    : 'border-[#282828] bg-[#181818]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <Avatar avatarId={player.avatar} size="md" />
                    {player.isHost && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F57F17] flex items-center justify-center rounded-xs shadow">
                        <Crown className="w-2.5 h-2.5 text-black" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-[#F2F0EB] truncate max-w-[120px]">
                        {player.name}
                      </p>
                      {isCurrentMe && (
                        <span className="text-[10px] font-mono text-[#D6FF62] bg-[#242C15] px-1 py-0.2 rounded border border-[#3E4A22]">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          player.isConnected ? 'bg-[#1EA245]' : 'bg-[#D32F2F]'
                        }`}
                      />
                      <span className="text-[10px] font-mono text-[#777570]">
                        {player.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {player.isHost ? (
                    <span className="px-2 py-0.5 rounded bg-[#242424] border border-[#383838] text-[10px] font-mono text-[#A5A39E] font-bold">
                      HOST
                    </span>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${
                        player.isReady
                          ? 'border-[#1EA245] bg-[#142318] text-[#1EA245]'
                          : 'border-[#333333] bg-[#202020] text-[#777570]'
                      }`}
                    >
                      {player.isReady ? 'READY' : 'WAITING'}
                    </span>
                  )}

                  {isHost && !player.isHost && (
                    <button
                      onClick={() => kickPlayer(player.id)}
                      className="p-1 text-[#777570] hover:text-[#D32F2F] rounded hover:bg-[#252525] transition cursor-pointer"
                      title={`Remove ${player.name}`}
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lobby Bottom Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded bg-[#181818] border border-[#282828]">
        <button
          onClick={() => {
            leaveRoom();
            window.location.href = '/';
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded border border-[#333333] hover:border-[#D32F2F] text-xs font-medium text-[#A5A39E] hover:text-[#D32F2F] transition w-full sm:w-auto justify-center cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Leave Room
        </button>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {!isHost && (
            <button
              onClick={toggleReady}
              className={`flex-1 sm:flex-none px-5 py-2 rounded text-xs font-bold border transition cursor-pointer ${
                me?.isReady
                  ? 'border-[#1EA245] bg-[#16291C] text-[#1EA245]'
                  : 'border-[#333333] bg-[#222222] text-[#F2F0EB] hover:bg-[#282828]'
              }`}
            >
              {me?.isReady ? 'I Am Ready ✓' : 'Mark as Ready'}
            </button>
          )}

          {isHost && (
            <button
              onClick={startGame}
              disabled={!canStart}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-[#D6FF62] hover:bg-[#C4F04D] disabled:opacity-40 disabled:hover:bg-[#D6FF62] text-xs font-bold text-[#101010] uppercase tracking-wider transition active:scale-98 cursor-pointer disabled:cursor-not-allowed shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-[#101010]" />
              {publicState.players.length < 2 ? 'Need 2+ Players' : 'Start Match'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
