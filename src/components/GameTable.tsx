'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Card, CardColor } from '@/types/game';
import { CardView } from './CardView';
import { Avatar } from './Avatar';
import { WildColorPickerModal } from './modals/WildColorPickerModal';
import { VictoryModal } from './modals/VictoryModal';
import {
  RotateCcw,
  RotateCw,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';

export function GameTable() {
  const {
    publicState,
    hand,
    validPlayCardIds,
    playerId,
    playCard,
    drawCard,
    passTurn,
    callUno,
    challengeUno,
    isMuted,
    toggleMute,
  } = useGame();

  const [selectedWildCard, setSelectedWildCard] = useState<Card | null>(null);

  if (!publicState) return null;

  const me = publicState.players.find((p) => p.id === playerId);
  const isMyTurn = publicState.currentTurnPlayerId === playerId;
  const currentTurnPlayer = publicState.players.find(
    (p) => p.id === publicState.currentTurnPlayerId
  );

  // Opponents ordered clockwise starting after local player
  const myIndex = publicState.players.findIndex((p) => p.id === playerId);
  const numPlayers = publicState.players.length;
  const opponents = [];
  if (myIndex !== -1) {
    for (let i = 1; i < numPlayers; i++) {
      const idx = (myIndex + i) % numPlayers;
      opponents.push(publicState.players[idx]);
    }
  } else {
    opponents.push(...publicState.players);
  }

  // Active color glow styling
  const activeColorGlow = {
    red: 'shadow-[0_0_50px_rgba(239,68,68,0.4)] border-red-500/80',
    blue: 'shadow-[0_0_50px_rgba(59,130,246,0.4)] border-blue-500/80',
    green: 'shadow-[0_0_50px_rgba(16,185,129,0.4)] border-emerald-500/80',
    yellow: 'shadow-[0_0_50px_rgba(245,158,11,0.4)] border-amber-400/80',
    wild: 'shadow-[0_0_50px_rgba(139,92,246,0.4)] border-violet-500/80',
  }[publicState.activeColor || 'wild'];

  const handleCardClick = (card: Card) => {
    if (!isMyTurn) return;
    if (!validPlayCardIds.includes(card.id)) return;

    if (card.color === 'wild' || card.value === 'wild' || card.value === 'wild_draw4') {
      setSelectedWildCard(card);
    } else {
      playCard(card.id);
    }
  };

  const handleWildColorSelect = (chosenColor: CardColor) => {
    if (selectedWildCard) {
      playCard(selectedWildCard.id, chosenColor);
      setSelectedWildCard(null);
    }
  };

  // Find any opponent who can be challenged for uncalled UNO
  const challengeableOpponent = publicState.players.find(
    (p) =>
      p.id !== playerId &&
      p.cardCount === 1 &&
      !p.hasCalledUno &&
      (p.unoChallengeableUntil || 0) > Date.now()
  );

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden game-table-felt select-none p-3 sm:p-6">
      {/* 1. TOP BAR: Match Header & Status */}
      <div className="flex items-center justify-between z-20 max-w-6xl mx-auto w-full">
        {/* Match info */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-xl bg-[#141721]/90 border border-[#232733] backdrop-blur-md">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Room Code
            </span>
            <span className="text-sm font-mono font-bold text-white tracking-wider">
              {publicState.roomCode}
            </span>
          </div>

          {/* Turn status indicator */}
          <div
            className={`px-4 py-1.5 rounded-xl border backdrop-blur-md flex items-center gap-2 ${
              isMyTurn
                ? 'border-violet-500 bg-violet-600/20 text-violet-200 shadow-[0_0_15px_rgba(124,58,237,0.3)] animate-pulse'
                : 'border-[#232733] bg-[#141721]/80 text-gray-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isMyTurn ? 'bg-violet-400 shadow-[0_0_8px_#A78BFA]' : 'bg-gray-500'
              }`}
            />
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              {isMyTurn ? 'YOUR TURN' : `${currentTurnPlayer?.name}'s Turn`}
            </span>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleMute}
          className="p-2 rounded-xl bg-[#141721] border border-[#232733] text-gray-400 hover:text-white transition"
          title="Sound"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. OPPONENTS SECTION: Arranged around the top/sides of table */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap my-2 z-10">
        {opponents.map((opp) => {
          const isOppTurn = opp.id === publicState.currentTurnPlayerId;
          return (
            <div
              key={opp.id}
              className={`flex flex-col items-center p-2 sm:p-3 rounded-2xl border transition-all duration-300 ${
                isOppTurn
                  ? 'border-violet-500/80 bg-violet-950/20 shadow-[0_0_20px_rgba(124,58,237,0.3)] scale-105'
                  : 'border-[#232733]/70 bg-[#12141D]/60'
              }`}
            >
              {/* Avatar + Turn indicator */}
              <div className="relative mb-1.5">
                <Avatar avatarId={opp.avatar} size="md" glow={isOppTurn} />
                {opp.hasCalledUno && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-red-600 text-[9px] font-black text-white border border-red-400 shadow animate-bounce">
                    UNO!
                  </span>
                )}
                {!opp.isConnected && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border border-black" />
                )}
              </div>

              {/* Opponent Name */}
              <p className="text-xs font-bold text-gray-200 truncate max-w-[90px] text-center">
                {opp.name}
              </p>

              {/* Opponent Cards Remaining Backs */}
              <div className="flex items-center gap-1.5 mt-1 bg-black/40 px-2 py-0.5 rounded-lg border border-white/5">
                <div className="w-3.5 h-5 rounded-xs bg-gradient-to-br from-violet-600 to-indigo-800 border border-white/20" />
                <span className="text-xs font-bold font-mono text-white">
                  {opp.cardCount}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. CENTER TABLE: Draw Pile, Discard Pile, Active Color Ring, Direction Chevrons */}
      <div className="relative flex flex-col items-center justify-center my-auto py-4 z-10">
        {/* Direction Indicator & Active Color Ambient Glow */}
        <div
          className={`relative p-8 sm:p-12 rounded-full border-2 transition-all duration-500 ${activeColorGlow} bg-[#11131C]/80 backdrop-blur-sm`}
        >
          {/* Animated Direction Arrows Chevrons */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`w-full h-full rounded-full border border-dashed border-white/20 flex items-center justify-between px-2 text-white/40 ${
                publicState.direction === 1 ? 'animate-spin' : 'animate-spin'
              }`}
              style={{
                animationDuration: '14s',
                animationDirection: publicState.direction === 1 ? 'normal' : 'reverse',
              }}
            >
              <ArrowRight className="w-4 h-4 transform -rotate-45" />
              <ArrowRight className="w-4 h-4 transform rotate-135" />
            </div>
          </div>

          {/* Cards Area: Draw Deck + Discard Pile */}
          <div className="flex items-center gap-6 sm:gap-10 relative z-10">
            {/* Draw Pile (Clickable on turn) */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  if (isMyTurn && !publicState.hasDrawnCardThisTurn) {
                    drawCard();
                  }
                }}
                disabled={!isMyTurn || publicState.hasDrawnCardThisTurn}
                className={`relative group transition-all duration-200 ${
                  isMyTurn && !publicState.hasDrawnCardThisTurn
                    ? 'cursor-pointer hover:scale-105 active:scale-95'
                    : 'cursor-default opacity-80'
                }`}
                title={
                  isMyTurn
                    ? publicState.hasDrawnCardThisTurn
                      ? 'Already drawn this turn'
                      : 'Draw a card'
                    : 'Not your turn'
                }
              >
                {/* 3D Stacked Deck Effect */}
                <div className="absolute -top-1 -left-1 w-full h-full rounded-xl bg-[#1C202C] border border-[#2D3344] pointer-events-none" />
                <div className="absolute -top-2 -left-2 w-full h-full rounded-xl bg-[#171B26] border border-[#2D3344] pointer-events-none" />
                <CardView isBack size="md" />

                {/* Remaining Draw Count Badge */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#11131A] border border-[#2B3040] text-[10px] font-mono font-bold text-gray-300 shadow">
                  {publicState.drawPileCount} left
                </div>
              </button>
            </div>

            {/* Discard Pile (Top Played Card) */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {publicState.topDiscardCard ? (
                  <CardView card={publicState.topDiscardCard} size="md" />
                ) : (
                  <CardView isBack size="md" />
                )}

                {/* Active Color Tag */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/90 border border-white/20 text-[10px] font-black uppercase tracking-wider text-white shadow-lg whitespace-nowrap">
                  Color: {publicState.activeColor?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Action / Battle Log Notification Pill */}
        {publicState.logs.length > 0 && (
          <div className="mt-4 px-4 py-1.5 rounded-full bg-[#141721]/90 border border-[#232733] backdrop-blur-md text-xs text-gray-300 flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
            <span className="font-medium truncate max-w-xs sm:max-w-md">
              {publicState.logs[0].message}
            </span>
          </div>
        )}
      </div>

      {/* 4. BOTTOM AREA: Local Player Hand & In-Game Controls */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center z-20">
        {/* Action Controls Bar (Draw, Pass, UNO, Challenge) */}
        <div className="flex items-center gap-3 mb-3 flex-wrap justify-center">
          {/* Draw Button */}
          {isMyTurn && !publicState.hasDrawnCardThisTurn && (
            <button
              onClick={drawCard}
              className="px-4 py-2 rounded-xl bg-[#171A24] hover:bg-[#1E2230] border border-[#2D3344] text-xs font-bold text-gray-200 hover:text-white transition shadow-sm active:scale-95"
            >
              Draw Card
            </button>
          )}

          {/* Pass Turn Button (Available only after drawing) */}
          {isMyTurn && publicState.hasDrawnCardThisTurn && (
            <button
              onClick={passTurn}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] transition active:scale-95 animate-pulse"
            >
              Pass Turn →
            </button>
          )}

          {/* UNO Button: High Impact urgency button when holding 1 or 2 cards */}
          {hand.length <= 2 && (
            <button
              onClick={callUno}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-black text-xs sm:text-sm tracking-wider uppercase uno-urgent shadow-[0_0_30px_rgba(239,68,68,0.7)] transition active:scale-95 flex items-center gap-2"
            >
              <Flame className="w-4 h-4 fill-white" />
              CALL UNO!
            </button>
          )}

          {/* UNO Challenge Button: Catch opponent who failed to declare UNO */}
          {challengeableOpponent && (
            <button
              onClick={() => challengeUno(challengeableOpponent.id)}
              className="px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/50 text-amber-300 font-bold text-xs tracking-wide shadow-md transition active:scale-95 flex items-center gap-1.5 animate-bounce"
            >
              <ShieldAlert className="w-4 h-4" />
              Catch {challengeableOpponent.name} (UNO!)
            </button>
          )}
        </div>

        {/* Local Player Identity Tag */}
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
          <Avatar avatarId={me?.avatar || 'geom-1'} size="sm" />
          <span className="font-bold text-white">{me?.name || 'You'}</span>
          <span className="text-gray-500">({hand.length} cards)</span>
          {me?.hasCalledUno && (
            <span className="px-2 py-0.2 rounded-full bg-red-600 text-[10px] font-black text-white">
              UNO CALLED
            </span>
          )}
        </div>

        {/* Local Player Hand Fan / Scroll Container */}
        <div className="w-full overflow-x-auto pb-4 pt-6 px-4 flex items-center justify-center">
          <div className="flex items-end -space-x-5 sm:-space-x-7 hover:-space-x-4 transition-all duration-300 px-6 min-w-max">
            {hand.map((card, idx) => {
              const isPlayable = isMyTurn && validPlayCardIds.includes(card.id);
              // Slight fan rotation based on position in hand
              const mid = (hand.length - 1) / 2;
              const rotation = Math.max(-12, Math.min(12, (idx - mid) * 2.5));

              return (
                <div key={card.id} className="transform transition-transform duration-200">
                  <CardView
                    card={card}
                    size="md"
                    isPlayable={isPlayable}
                    rotation={rotation}
                    onClick={() => handleCardClick(card)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Wild Color Selection Modal */}
      <WildColorPickerModal
        isOpen={!!selectedWildCard}
        onSelectColor={handleWildColorSelect}
      />

      {/* Victory Celebration Modal */}
      {publicState.phase === 'round_over' && publicState.winnerId && (
        <VictoryModal winnerId={publicState.winnerId} />
      )}
    </div>
  );
}
