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
  Settings,
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
    updateSettings,
  } = useGame();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!publicState) return null;

  const me = publicState.players.find((p) => p.id === playerId);
  const isHost = me?.isHost || publicState.hostId === playerId;
  const readyCount = publicState.players.filter((p) => p.isReady || p.isHost).length;
  const canStart = isHost && publicState.players.length >= 2;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopiedCode(true);
      addToast('Room code copied to clipboard!', 'success');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      addToast('Failed to copy code.', 'error');
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/room/${roomCode}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      addToast('Invite link copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      addToast('Failed to copy link.', 'error');
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
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      {/* Top Banner: Room Code Card */}
      <div className="bg-[#13151E] border border-[#262B3A] rounded-2xl p-6 sm:p-7 shadow-xl mb-6 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-[11px] font-bold text-violet-300 uppercase tracking-wider">
                Private Lobby
              </span>
              <span className="text-xs text-gray-400 font-medium">Classic 7-Card Rules</span>
            </div>
            <p className="text-xs text-gray-400">Share this code with friends to join your table:</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-white selection:bg-violet-500">
                {roomCode}
              </span>
            </div>
          </div>

          {/* Copy Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D212F] hover:bg-[#252A3C] border border-[#2F354A] text-xs font-bold text-gray-200 hover:text-white transition active:scale-95 shadow-sm"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? 'Copied!' : 'Copy Code'}
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D212F] hover:bg-[#252A3C] border border-[#2F354A] text-xs font-bold text-gray-200 hover:text-white transition active:scale-95 shadow-sm"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'Link Copied!' : 'Copy Link'}
            </button>

            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                onClick={handleNativeShare}
                className="p-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 hover:text-white transition active:scale-95"
                title="Share directly"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Room Settings Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#232733]/80 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-violet-400" />
            <span>
              Players: <strong className="text-white">{publicState.players.length}</strong> / {publicState.settings.maxPlayers}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-violet-400" />
            <span>
              Turn Timer: <strong className="text-white">{publicState.settings.turnTimerSeconds ? `${publicState.settings.turnTimerSeconds}s` : 'Unlimited'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Host: <strong className="text-white">{publicState.players.find((p) => p.isHost)?.name || 'Host'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Players Grid Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Connected Players
            <span className="px-2 py-0.5 rounded-full bg-[#1E222D] text-xs font-semibold text-gray-400 border border-[#2B3040]">
              {publicState.players.length}
            </span>
          </h3>
          <span className="text-xs text-gray-400">
            {publicState.players.length < 2
              ? 'Waiting for at least 1 more friend to join...'
              : 'Ready to play!'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {publicState.players.map((player) => {
            const isCurrentMe = player.id === playerId;
            return (
              <div
                key={player.id}
                className={`relative p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                  isCurrentMe
                    ? 'border-violet-500/50 bg-[#161824] shadow-[0_0_20px_rgba(124,58,237,0.15)]'
                    : 'border-[#232733] bg-[#12141C] hover:border-[#2D3344]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <Avatar avatarId={player.avatar} size="md" />
                    {player.isHost && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 border border-[#11131A] flex items-center justify-center shadow">
                        <Crown className="w-3 h-3 text-black fill-black" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-white truncate max-w-[120px]">
                        {player.name}
                      </p>
                      {isCurrentMe && (
                        <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/10 px-1.5 py-0.2 rounded border border-violet-500/20">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          player.isConnected ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                      />
                      <span className="text-[11px] text-gray-400">
                        {player.isConnected ? 'Connected' : 'Reconnecting...'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Host badge or Kick control */}
                <div className="flex items-center gap-2">
                  {player.isHost ? (
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400">
                      Host
                    </span>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${
                        player.isReady
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-gray-700 bg-gray-800 text-gray-400'
                      }`}
                    >
                      {player.isReady ? 'Ready' : 'Waiting'}
                    </span>
                  )}

                  {isHost && !player.isHost && (
                    <button
                      onClick={() => kickPlayer(player.id)}
                      className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition"
                      title={`Remove ${player.name}`}
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Empty Slots visualization */}
          {Array.from({
            length: Math.max(0, Math.min(4, publicState.settings.maxPlayers - publicState.players.length)),
          }).map((_, i) => (
            <div
              key={`empty_${i}`}
              className="p-4 rounded-2xl border border-dashed border-[#232733] bg-[#0E1015]/40 flex items-center gap-3 opacity-60"
            >
              <div className="w-11 h-11 rounded-xl border border-dashed border-gray-700 flex items-center justify-center text-gray-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">Open Slot</p>
                <p className="text-[10px] text-gray-600">Waiting for player...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lobby Bottom Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#141721] border border-[#232733]">
        <button
          onClick={() => {
            leaveRoom();
            window.location.href = '/';
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2A2F40] hover:border-red-500/40 text-xs font-semibold text-gray-400 hover:text-red-300 hover:bg-red-500/5 transition w-full sm:w-auto justify-center"
        >
          <LogOut className="w-4 h-4" />
          Leave Room
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Non-host Ready Toggle */}
          {!isHost && (
            <button
              onClick={toggleReady}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold border transition ${
                me?.isReady
                  ? 'border-emerald-500 bg-emerald-600/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'border-violet-500 bg-violet-600/20 text-violet-300 hover:bg-violet-600/30'
              }`}
            >
              {me?.isReady ? 'I Am Ready ✓' : 'Mark as Ready'}
            </button>
          )}

          {/* Host Start Game Button */}
          {isHost && (
            <button
              onClick={startGame}
              disabled={!canStart}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 text-xs sm:text-sm font-extrabold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 fill-white" />
              {publicState.players.length < 2 ? 'Need 2+ Players to Start' : 'Start Match Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
