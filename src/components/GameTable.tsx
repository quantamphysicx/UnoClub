'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Card, CardColor } from '@/types/game';
import { CardView } from './CardView';
import { Avatar } from './Avatar';
import { WildColorPickerModal } from './modals/WildColorPickerModal';
import { VictoryModal } from './modals/VictoryModal';
import {
  ShieldAlert,
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export function GameTable() {
  const {
    publicState,
    hand,
    validPlayCardIds,
    playerId,
    playerName,
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

  // Local player reference
  const me = publicState.players.find((p) => p.id === playerId);
  const myDisplayName = me?.name || playerName || 'You';
  const isMyTurn = publicState.currentTurnPlayerId === playerId;
  const currentTurnPlayer = publicState.players.find(
    (p) => p.id === publicState.currentTurnPlayerId
  );

  // Opponents ordered starting from the player to the left
  const myIndex = publicState.players.findIndex((p) => p.id === playerId);
  const numPlayers = publicState.players.length;
  const opponents = [];
  if (myIndex !== -1) {
    for (let i = 1; i < numPlayers; i++) {
      const idx = (myIndex + i) % numPlayers;
      opponents.push(publicState.players[idx]);
    }
  } else {
    opponents.push(...publicState.players.filter((p) => p.id !== playerId));
  }

  // Active color styling (clean solid colors, no AI gradients)
  const activeColorBadge = {
    red: { bg: 'bg-[#D32F2F]', text: 'text-white', border: 'border-[#EF5350]', label: 'RED' },
    blue: { bg: 'bg-[#1976D2]', text: 'text-white', border: 'border-[#42A5F5]', label: 'BLUE' },
    green: { bg: 'bg-[#2E7D32]', text: 'text-white', border: 'border-[#66BB6A]', label: 'GREEN' },
    yellow: { bg: 'bg-[#F57F17]', text: 'text-white', border: 'border-[#FFCA28]', label: 'YELLOW' },
    wild: { bg: 'bg-[#262B3A]', text: 'text-gray-200', border: 'border-[#3D455C]', label: 'WILD' },
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

  // Find opponent who failed to declare UNO
  const challengeableOpponent = publicState.players.find(
    (p) =>
      p.id !== playerId &&
      p.cardCount === 1 &&
      !p.hasCalledUno &&
      (p.unoChallengeableUntil || 0) > Date.now()
  );

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between game-table-felt select-none p-3 sm:p-5 overflow-hidden">
      {/* 1. TOP HEADER BAR: Table Info & Turn Status */}
      <div className="flex items-center justify-between z-20 max-w-7xl mx-auto w-full pb-2">
        {/* Room Code Badge */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-[#151822] border border-[#262B3A] shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Table Code
            </span>
            <span className="text-sm font-mono font-black text-white tracking-wider">
              {publicState.roomCode}
            </span>
          </div>

          {/* Current Turn Status Banner */}
          <div
            className={`px-4 py-1.5 rounded-xl border flex items-center gap-2.5 transition-all ${
              isMyTurn
                ? 'border-emerald-500/80 bg-emerald-950/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'border-[#262B3A] bg-[#151822] text-gray-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isMyTurn ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
              }`}
            />
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              {isMyTurn ? 'YOUR TURN' : `${currentTurnPlayer?.name || 'Opponent'}'s Turn`}
            </span>
          </div>
        </div>

        {/* Audio Mute Control */}
        <button
          onClick={toggleMute}
          className="p-2 rounded-xl bg-[#151822] border border-[#262B3A] text-gray-400 hover:text-white transition"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. TOP TABLE SIDE: Opponents Seated Along Top */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 z-10 py-1">
        {opponents.map((opp) => {
          const isOppTurn = opp.id === publicState.currentTurnPlayerId;
          return (
            <div
              key={opp.id}
              className={`flex flex-col items-center p-2.5 sm:p-3 rounded-2xl border transition-all ${
                isOppTurn
                  ? 'border-amber-400 bg-[#1C202E] shadow-md scale-105'
                  : 'border-[#232734] bg-[#141620]'
              }`}
            >
              {/* Avatar + Connection + UNO badge */}
              <div className="relative mb-1.5">
                <Avatar avatarId={opp.avatar} size="md" />
                {opp.hasCalledUno && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-md bg-[#D32F2F] text-[9px] font-black text-white border border-white shadow">
                    UNO!
                  </span>
                )}
                {!opp.isConnected && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border border-[#141620]" />
                )}
              </div>

              {/* Opponent Display Name */}
              <p className="text-xs font-bold text-gray-200 truncate max-w-[110px] text-center">
                {opp.name}
              </p>

              {/* Opponent Card Backs Display */}
              <div className="flex items-center gap-1.5 mt-1.5 bg-[#0E1017] px-2.5 py-1 rounded-lg border border-[#262B3A]">
                <div className="w-3.5 h-5 rounded-xs bg-[#D32F2F] border border-white/40 shadow-xs" />
                <span className="text-xs font-mono font-bold text-white">
                  {opp.cardCount} cards
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. CENTER ARENA: Deck of Cards on Left Side, Discard Pile on Right Side */}
      <div className="relative flex flex-col items-center justify-center my-auto py-4 z-10">
        <div className="w-full max-w-2xl bg-[#141722]/90 border border-[#262B3A] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center relative">
          {/* Main 2-Side Layout: Deck on Left, Discard on Right */}
          <div className="w-full flex items-center justify-around gap-6 sm:gap-12 relative">
            {/* === LEFT SIDE: DRAW PILE === */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Draw Deck
              </span>

              <button
                onClick={() => {
                  if (isMyTurn && !publicState.hasDrawnCardThisTurn) {
                    drawCard();
                  }
                }}
                disabled={!isMyTurn || publicState.hasDrawnCardThisTurn}
                className={`relative group transition-transform ${
                  isMyTurn && !publicState.hasDrawnCardThisTurn
                    ? 'cursor-pointer hover:scale-105 active:scale-95'
                    : 'cursor-default opacity-85'
                }`}
                title={
                  isMyTurn
                    ? publicState.hasDrawnCardThisTurn
                      ? 'Already drew this turn'
                      : 'Click to draw card'
                    : 'Waiting for your turn'
                }
              >
                {/* 3D stacked deck effect */}
                <div className="absolute -top-1.5 -left-1.5 w-full h-full rounded-2xl bg-[#181B26] border border-[#2D3346] pointer-events-none" />
                <div className="absolute -top-3 -left-3 w-full h-full rounded-2xl bg-[#12141C] border border-[#262A38] pointer-events-none" />

                <CardView isBack size="md" />

                {/* Remaining Card Badge */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#1A1D28] border border-[#353C4F] text-[10px] font-mono font-bold text-gray-200 shadow-md whitespace-nowrap">
                  {publicState.drawPileCount} Cards
                </div>
              </button>
            </div>

            {/* === CENTER DIVIDER: Active Color & Turn Direction === */}
            <div className="flex flex-col items-center justify-center gap-3">
              {/* Active Color Badge */}
              <div
                className={`px-3 py-1.5 rounded-xl border ${activeColorBadge.bg} ${activeColorBadge.border} ${activeColorBadge.text} text-center shadow-md`}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider block opacity-90 leading-none mb-0.5">
                  Color
                </span>
                <span className="text-xs font-black tracking-wide">
                  {activeColorBadge.label}
                </span>
              </div>

              {/* Turn Direction Chevrons */}
              <div className="flex items-center gap-1 text-gray-400 bg-[#181B26] px-2.5 py-1 rounded-lg border border-[#262B3A]">
                <span className="text-[10px] font-bold uppercase">
                  {publicState.direction === 1 ? 'Clockwise' : 'Counter'}
                </span>
                <ArrowRight
                  className={`w-3.5 h-3.5 transform ${
                    publicState.direction === 1 ? 'rotate-0' : 'rotate-180'
                  }`}
                />
              </div>
            </div>

            {/* === RIGHT SIDE: DISCARD PILE === */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Discard Pile
              </span>

              <div className="relative">
                {publicState.topDiscardCard ? (
                  <CardView card={publicState.topDiscardCard} size="md" rotation={-3} />
                ) : (
                  <CardView isBack size="md" />
                )}
              </div>
            </div>
          </div>

          {/* Table Battle Log / Last Move Pill */}
          {publicState.logs.length > 0 && (
            <div className="mt-6 px-4 py-1.5 rounded-full bg-[#1A1D28] border border-[#2B3042] text-xs text-gray-300 flex items-center gap-2 max-w-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
              <span className="font-medium truncate">{publicState.logs[0].message}</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. BOTTOM TABLE SIDE: Local Player's Seat & Hand Shelf */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center z-20 pt-2">
        {/* Action Buttons Bar: Draw, Pass, UNO!, Challenge */}
        <div className="flex items-center gap-3 mb-3 flex-wrap justify-center">
          {/* Draw Button */}
          {isMyTurn && !publicState.hasDrawnCardThisTurn && (
            <button
              onClick={drawCard}
              className="px-5 py-2.5 rounded-xl bg-[#1C202C] hover:bg-[#252A3A] border border-[#30374A] text-xs font-bold text-white transition active:scale-95 shadow-sm"
            >
              Draw Card
            </button>
          )}

          {/* Pass Turn Button (Available after drawing a card) */}
          {isMyTurn && publicState.hasDrawnCardThisTurn && (
            <button
              onClick={passTurn}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition active:scale-95 shadow-md flex items-center gap-1.5"
            >
              Pass Turn →
            </button>
          )}

          {/* Mechanical Bold UNO Button */}
          {hand.length <= 2 && (
            <button
              onClick={callUno}
              className="px-7 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] border-2 border-white text-white font-black text-sm tracking-wider uppercase shadow-xl transition active:scale-95 flex items-center gap-2"
            >
              <Flame className="w-4 h-4 fill-white" />
              CALL UNO!
            </button>
          )}

          {/* Catch Opponent UNO Challenge Button */}
          {challengeableOpponent && (
            <button
              onClick={() => challengeUno(challengeableOpponent.id)}
              className="px-4 py-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500 text-amber-300 font-bold text-xs tracking-wide shadow-md transition active:scale-95 flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              Catch {challengeableOpponent.name} (UNO!)
            </button>
          )}
        </div>

        {/* Player Identity Shelf Label */}
        <div className="flex items-center gap-2.5 mb-2 px-3.5 py-1 rounded-full bg-[#141722] border border-[#262B3A] text-xs text-gray-300 shadow-sm">
          <Avatar avatarId={me?.avatar || 'geom-1'} size="sm" />
          <span className="font-extrabold text-white">{myDisplayName}</span>
          <span className="text-gray-400">({hand.length} cards in hand)</span>
          {me?.hasCalledUno && (
            <span className="px-2 py-0.2 rounded-full bg-[#D32F2F] text-[10px] font-black text-white">
              UNO
            </span>
          )}
        </div>

        {/* Player's Hand Tray (Cards Shelf) */}
        <div className="w-full overflow-x-auto pb-3 pt-4 px-4 flex items-center justify-center">
          <div className="flex items-end -space-x-4 sm:-space-x-6 hover:-space-x-3 transition-all duration-200 px-4 min-w-max">
            {hand.map((card, idx) => {
              const isPlayable = isMyTurn && validPlayCardIds.includes(card.id);
              return (
                <div key={card.id} className="transform transition-transform duration-150">
                  <CardView
                    card={card}
                    size="md"
                    isPlayable={isPlayable}
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
