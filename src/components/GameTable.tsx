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

  // Active color styling (clean solid fills, zero gradients)
  const activeColorBadge = {
    red: { bg: 'bg-[#D32F2F]', border: 'border-[#B71C1C]', label: 'RED' },
    blue: { bg: 'bg-[#1976D2]', border: 'border-[#0D47A1]', label: 'BLUE' },
    green: { bg: 'bg-[#2E7D32]', border: 'border-[#1B5E20]', label: 'GREEN' },
    yellow: { bg: 'bg-[#F57F17]', border: 'border-[#E65100]', label: 'YELLOW' },
    wild: { bg: 'bg-[#2C2C2C]', border: 'border-[#444444]', label: 'WILD' },
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
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col justify-between bg-[#141414] select-none p-3 sm:p-5 overflow-hidden">
      {/* 1. TOP HEADER BAR: Table Info & Turn Status */}
      <div className="flex items-center justify-between z-20 max-w-6xl mx-auto w-full pb-2">
        <div className="flex items-center gap-2.5">
          <div className="px-2.5 py-1 rounded bg-[#1C1C1C] border border-[#2E2E2E]">
            <span className="text-[10px] font-mono text-[#777570] block leading-none mb-0.5">ROOM</span>
            <span className="text-xs font-mono font-bold text-[#F2F0EB] tracking-wider">
              {publicState.roomCode}
            </span>
          </div>

          {/* Turn indicator */}
          <div
            className={`px-3 py-1 rounded border flex items-center gap-2 text-xs font-bold tracking-wide ${
              isMyTurn
                ? 'border-[#D6FF62] bg-[#1E2314] text-[#D6FF62]'
                : 'border-[#2E2E2E] bg-[#1C1C1C] text-[#A5A39E]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isMyTurn ? 'bg-[#D6FF62]' : 'bg-[#777570]'
              }`}
            />
            <span>{isMyTurn ? 'YOUR TURN' : `${currentTurnPlayer?.name || 'Opponent'}'s Turn`}</span>
          </div>
        </div>

        {/* Audio Mute */}
        <button
          onClick={toggleMute}
          className="p-1.5 rounded border border-[#2E2E2E] bg-[#1C1C1C] text-[#A5A39E] hover:text-[#F2F0EB] transition cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 2. TOP TABLE SIDE: Opponents Seated Along Top */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 z-10 py-1">
        {opponents.map((opp) => {
          const isOppTurn = opp.id === publicState.currentTurnPlayerId;
          return (
            <div
              key={opp.id}
              className={`flex flex-col items-center p-2.5 rounded border transition-all ${
                isOppTurn
                  ? 'border-[#F2F0EB] bg-[#222222]'
                  : 'border-[#282828] bg-[#1A1A1A]'
              }`}
            >
              <div className="relative mb-1">
                <Avatar avatarId={opp.avatar} size="sm" />
                {opp.hasCalledUno && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-xs bg-[#D32F2F] text-[8px] font-black text-white">
                    UNO!
                  </span>
                )}
                {!opp.isConnected && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#D32F2F]" />
                )}
              </div>

              <p className="text-xs font-semibold text-[#F2F0EB] truncate max-w-[90px] text-center">
                {opp.name}
              </p>

              <div className="flex items-center gap-1 mt-1 bg-[#121212] px-2 py-0.5 rounded border border-[#2A2A2A]">
                <div className="w-2.5 h-3.5 rounded-xs bg-[#D32F2F]" />
                <span className="text-[11px] font-mono font-bold text-[#F2F0EB]">
                  {opp.cardCount}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. CENTER ARENA: Deck of Cards on Left Side, Discard Pile on Right Side */}
      <div className="relative flex flex-col items-center justify-center my-auto py-4 z-10">
        <div className="w-full max-w-xl bg-[#1A1A1A] border border-[#2C2C2C] rounded-lg p-6 sm:p-8 flex flex-col items-center shadow-lg">
          <div className="w-full flex items-center justify-around gap-6 sm:gap-10">
            {/* === LEFT SIDE: DRAW DECK === */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#777570] mb-2 font-semibold">
                Draw Pile
              </span>

              <button
                onClick={() => {
                  if (isMyTurn && !publicState.hasDrawnCardThisTurn) {
                    drawCard();
                  }
                }}
                disabled={!isMyTurn || publicState.hasDrawnCardThisTurn}
                className={`relative transition-transform ${
                  isMyTurn && !publicState.hasDrawnCardThisTurn
                    ? 'cursor-pointer hover:-translate-y-1'
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
                {/* Physical card stacking effect */}
                <div className="absolute -top-1 -left-1 w-full h-full rounded-md bg-[#252525] border border-[#333333] pointer-events-none" />
                <div className="absolute -top-2 -left-2 w-full h-full rounded-md bg-[#1F1F1F] border border-[#2C2C2C] pointer-events-none" />

                <CardView isBack size="md" />

                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#101010] border border-[#333333] text-[10px] font-mono text-[#F2F0EB] whitespace-nowrap">
                  {publicState.drawPileCount} left
                </div>
              </button>
            </div>

            {/* === CENTER: Active Color & Direction === */}
            <div className="flex flex-col items-center justify-center gap-3">
              {/* Solid Active Color Swatch */}
              <div
                className={`px-3 py-1.5 rounded border text-center ${activeColorBadge.bg} ${activeColorBadge.border} text-white shadow-sm`}
              >
                <span className="text-[9px] font-mono uppercase block opacity-85 leading-none mb-0.5 font-bold">
                  Color
                </span>
                <span className="text-xs font-black tracking-wider">
                  {activeColorBadge.label}
                </span>
              </div>

              {/* Minimal Direction Tag */}
              <div className="flex items-center gap-1.5 text-[#A5A39E] bg-[#121212] px-2.5 py-1 rounded border border-[#2E2E2E]">
                <span className="text-[10px] font-mono uppercase">
                  {publicState.direction === 1 ? 'CW' : 'CCW'}
                </span>
                <ArrowRight
                  className={`w-3 h-3 transform ${
                    publicState.direction === 1 ? 'rotate-0' : 'rotate-180'
                  }`}
                />
              </div>
            </div>

            {/* === RIGHT SIDE: DISCARD PILE === */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#777570] mb-2 font-semibold">
                Discard Pile
              </span>

              <div className="relative">
                {publicState.topDiscardCard ? (
                  <CardView card={publicState.topDiscardCard} size="md" rotation={-2} />
                ) : (
                  <CardView isBack size="md" />
                )}
              </div>
            </div>
          </div>

          {/* Understated Action Feed */}
          {publicState.logs.length > 0 && (
            <div className="mt-5 px-3 py-1 rounded bg-[#121212] border border-[#282828] text-xs text-[#A5A39E] flex items-center gap-2 max-w-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A5A39E] shrink-0" />
              <span className="truncate">{publicState.logs[0].message}</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. BOTTOM TABLE SIDE: Player's Seat & Hand Shelf */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center z-20 pt-1">
        {/* Action Controls Bar */}
        <div className="flex items-center gap-2.5 mb-2.5 flex-wrap justify-center">
          {/* Draw Card Action */}
          {isMyTurn && !publicState.hasDrawnCardThisTurn && (
            <button
              onClick={drawCard}
              className="px-4 py-2 rounded bg-[#202020] hover:bg-[#282828] border border-[#333333] text-xs font-bold text-[#F2F0EB] transition cursor-pointer"
            >
              Draw Card
            </button>
          )}

          {/* Pass Turn Action */}
          {isMyTurn && publicState.hasDrawnCardThisTurn && (
            <button
              onClick={passTurn}
              className="px-5 py-2 rounded bg-[#D6FF62] hover:bg-[#C4F04D] text-[#101010] text-xs font-bold transition cursor-pointer"
            >
              Pass Turn →
            </button>
          )}

          {/* Solid Red Mechanical UNO Button */}
          {hand.length <= 2 && (
            <button
              onClick={callUno}
              className="px-6 py-2 rounded bg-[#D32F2F] hover:bg-[#B71C1C] border border-white text-white font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Flame className="w-3.5 h-3.5 fill-white" />
              CALL UNO!
            </button>
          )}

          {/* Catch UNO Challenge */}
          {challengeableOpponent && (
            <button
              onClick={() => challengeUno(challengeableOpponent.id)}
              className="px-3.5 py-2 rounded bg-[#F57F17] hover:bg-[#E65100] text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Catch {challengeableOpponent.name} (UNO!)
            </button>
          )}
        </div>

        {/* Player Identity Tag */}
        <div className="flex items-center gap-2 mb-2 px-3 py-1 rounded bg-[#181818] border border-[#282828] text-xs text-[#A5A39E]">
          <Avatar avatarId={me?.avatar || 'geom-1'} size="sm" />
          <span className="font-bold text-[#F2F0EB]">{myDisplayName}</span>
          <span>({hand.length} cards)</span>
          {me?.hasCalledUno && (
            <span className="px-1.5 py-0.2 rounded bg-[#D32F2F] text-[9px] font-black text-white">
              UNO CALLED
            </span>
          )}
        </div>

        {/* Player Hand Tray */}
        <div className="w-full overflow-x-auto pb-2 pt-3 px-2 flex items-center justify-center">
          <div className="flex items-end -space-x-4 sm:-space-x-6 hover:-space-x-3 transition-all duration-150 px-2 min-w-max">
            {hand.map((card) => {
              const isPlayable = isMyTurn && validPlayCardIds.includes(card.id);
              return (
                <div key={card.id} className="transition-transform duration-100">
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
