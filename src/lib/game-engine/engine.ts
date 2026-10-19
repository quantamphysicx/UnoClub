import {
  Card,
  CardColor,
  GameLogEntry,
  Player,
  PublicGameState,
  PrivateGameState,
  RoomPhase,
  RoomSettings,
  TurnDirection,
} from '@/types/game';
import { createDeck, shuffleDeck } from './deck';
import { canPlayCard, isValidWildChoice } from './rules';

export class UnoGameEngine {
  public roomId: string;
  public roomCode: string;
  public hostId: string;
  public settings: RoomSettings;
  public phase: RoomPhase;

  public players: Player[];
  private playerHands: Map<string, Card[]>;

  public drawPile: Card[];
  public discardPile: Card[];

  public currentTurnIndex: number;
  public direction: TurnDirection;
  public activeColor: CardColor | null;
  public winnerId: string | null;
  public hasDrawnCardThisTurn: boolean;
  public logs: GameLogEntry[];

  constructor(
    roomId: string,
    roomCode: string,
    hostId: string,
    players: Player[],
    settings?: Partial<RoomSettings>
  ) {
    this.roomId = roomId;
    this.roomCode = roomCode;
    this.hostId = hostId;
    this.phase = 'lobby';

    this.settings = {
      maxPlayers: 8,
      startingCards: 7,
      turnTimerSeconds: 0,
      drawUntilMatch: false,
      ...settings,
    };

    this.players = [...players];
    this.playerHands = new Map();
    this.drawPile = [];
    this.discardPile = [];
    this.currentTurnIndex = 0;
    this.direction = 1;
    this.activeColor = null;
    this.winnerId = null;
    this.hasDrawnCardThisTurn = false;
    this.logs = [];

    // Initialize empty hands
    for (const p of this.players) {
      this.playerHands.set(p.id, []);
      p.cardCount = 0;
      p.hasCalledUno = false;
      p.unoChallengeableUntil = null;
    }
  }

  public addLog(message: string, type: GameLogEntry['type']) {
    const entry: GameLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      message,
      type,
    };
    this.logs.unshift(entry);
    if (this.logs.length > 50) {
      this.logs.pop();
    }
  }

  /**
   * Resets and starts a fresh match.
   */
  public startMatch(): boolean {
    if (this.players.length < 2) {
      return false;
    }

    this.phase = 'in_game';
    this.winnerId = null;
    this.direction = 1;
    this.currentTurnIndex = 0;
    this.hasDrawnCardThisTurn = false;
    this.logs = [];

    // 1. Create and shuffle complete 108 deck
    this.drawPile = shuffleDeck(createDeck());
    this.discardPile = [];

    // 2. Deal starting cards to each player
    const count = this.settings.startingCards || 7;
    for (const player of this.players) {
      const hand: Card[] = [];
      for (let i = 0; i < count; i++) {
        const c = this.drawPile.pop();
        if (c) hand.push(c);
      }
      this.playerHands.set(player.id, hand);
      player.cardCount = hand.length;
      player.hasCalledUno = false;
      player.unoChallengeableUntil = null;
    }

    // 3. Draw initial top card (ensure standard number card for fair start)
    let topCard = this.drawPile.pop()!;
    while (topCard.color === 'wild' || isNaN(parseInt(topCard.value, 10))) {
      this.drawPile.unshift(topCard);
      this.drawPile = shuffleDeck(this.drawPile);
      topCard = this.drawPile.pop()!;
    }

    this.discardPile.push(topCard);
    this.activeColor = topCard.color;

    this.addLog(`Match started! Opening card is ${topCard.color.toUpperCase()} ${topCard.value.toUpperCase()}.`, 'system');

    return true;
  }

  public getTopDiscard(): Card | null {
    if (this.discardPile.length === 0) return null;
    return this.discardPile[this.discardPile.length - 1];
  }

  public getCurrentPlayer(): Player {
    return this.players[this.currentTurnIndex];
  }

  private advanceTurn(steps: number = 1) {
    const n = this.players.length;
    // Step in current direction
    const rawIndex = this.currentTurnIndex + steps * this.direction;
    this.currentTurnIndex = ((rawIndex % n) + n) % n;
    this.hasDrawnCardThisTurn = false;
  }

  /**
   * Reshuffles discard pile into draw pile if draw pile is low.
   */
  private ensureDrawPile(neededCount: number = 1) {
    if (this.drawPile.length >= neededCount) return;

    if (this.discardPile.length <= 1) {
      // No more cards available
      return;
    }

    // Keep top card on discard pile
    const topCard = this.discardPile.pop()!;
    const cardsToShuffle = shuffleDeck(this.discardPile);
    this.drawPile = [...cardsToShuffle, ...this.drawPile];
    this.discardPile = [topCard];
    this.addLog(`Discard pile reshuffled into the draw pile!`, 'system');
  }

  public drawCardsForPlayer(playerId: string, count: number): Card[] {
    this.ensureDrawPile(count);
    const hand = this.playerHands.get(playerId) || [];
    const drawn: Card[] = [];

    for (let i = 0; i < count; i++) {
      if (this.drawPile.length === 0) {
        this.ensureDrawPile(1);
      }
      const card = this.drawPile.pop();
      if (card) {
        hand.push(card);
        drawn.push(card);
      }
    }

    this.playerHands.set(playerId, hand);
    const player = this.players.find((p) => p.id === playerId);
    if (player) {
      player.cardCount = hand.length;
      if (hand.length > 1) {
        player.hasCalledUno = false;
        player.unoChallengeableUntil = null;
      }
    }

    return drawn;
  }

  /**
   * Plays a card from current player's hand.
   */
  public playCard(
    playerId: string,
    cardId: string,
    chosenColor?: CardColor
  ): { success: boolean; error?: string } {
    if (this.phase !== 'in_game') {
      return { success: false, error: 'Game is not currently active.' };
    }

    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.id !== playerId) {
      return { success: false, error: 'It is not your turn.' };
    }

    const hand = this.playerHands.get(playerId) || [];
    const cardIndex = hand.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) {
      return { success: false, error: 'You do not hold this card.' };
    }

    const card = hand[cardIndex];
    const topDiscard = this.getTopDiscard();

    if (!canPlayCard(card, topDiscard, this.activeColor)) {
      return { success: false, error: 'Illegal move: Card does not match color or value.' };
    }

    if (card.color === 'wild') {
      if (!chosenColor || !isValidWildChoice(chosenColor)) {
        return { success: false, error: 'Must choose a valid color (red, blue, green, yellow).' };
      }
    }

    // 1. Remove card from player hand and place on discard pile
    hand.splice(cardIndex, 1);
    this.playerHands.set(playerId, hand);
    currentPlayer.cardCount = hand.length;
    this.discardPile.push(card);

    // 2. Set active color
    if (card.color === 'wild') {
      this.activeColor = chosenColor!;
    } else {
      this.activeColor = card.color;
    }

    // 3. Log card play
    const colorNotice = card.color === 'wild' ? ` (chose ${chosenColor!.toUpperCase()})` : '';
    this.addLog(`${currentPlayer.name} played ${card.color.toUpperCase()} ${card.value.toUpperCase()}${colorNotice}.`, 'play');

    // 4. Check UNO state
    if (hand.length === 1) {
      if (!currentPlayer.hasCalledUno) {
        // Player failed to pre-call UNO, open a 5-second challenge window!
        currentPlayer.unoChallengeableUntil = Date.now() + 5000;
        this.addLog(`${currentPlayer.name} has only 1 card left! (UNO not called!)`, 'uno');
      } else {
        this.addLog(`${currentPlayer.name} called UNO!`, 'uno');
      }
    } else if (hand.length > 1) {
      currentPlayer.hasCalledUno = false;
      currentPlayer.unoChallengeableUntil = null;
    }

    // 5. Check WIN condition
    if (hand.length === 0) {
      this.phase = 'round_over';
      this.winnerId = currentPlayer.id;
      this.addLog(`🏆 ${currentPlayer.name} won the match!`, 'win');
      return { success: true };
    }

    // 6. Handle action cards & turn progression
    if (card.value === 'skip') {
      const skippedPlayer = this.getNextPlayer(1);
      this.addLog(`${skippedPlayer.name} was skipped!`, 'turn');
      this.advanceTurn(2);
    } else if (card.value === 'reverse') {
      if (this.players.length === 2) {
        // In 2 player, reverse acts as a skip!
        this.addLog(`Reverse in 2-player acts as a Skip! ${currentPlayer.name} goes again!`, 'turn');
        this.advanceTurn(2);
      } else {
        this.direction = (this.direction * -1) as TurnDirection;
        this.addLog(`Direction reversed!`, 'turn');
        this.advanceTurn(1);
      }
    } else if (card.value === 'draw2') {
      const victim = this.getNextPlayer(1);
      this.drawCardsForPlayer(victim.id, 2);
      this.addLog(`${victim.name} drew 2 cards and was skipped!`, 'draw');
      this.advanceTurn(2);
    } else if (card.value === 'wild_draw4') {
      const victim = this.getNextPlayer(1);
      this.drawCardsForPlayer(victim.id, 4);
      this.addLog(`${victim.name} drew 4 cards and was skipped!`, 'draw');
      this.advanceTurn(2);
    } else {
      // Normal card or standard wild
      this.advanceTurn(1);
    }

    return { success: true };
  }

  /**
   * Helper to get relative next player without advancing.
   */
  public getNextPlayer(steps: number = 1): Player {
    const n = this.players.length;
    const raw = this.currentTurnIndex + steps * this.direction;
    const idx = ((raw % n) + n) % n;
    return this.players[idx];
  }

  /**
   * Player draws 1 card from the deck during their turn.
   */
  public drawCard(playerId: string): {
    success: boolean;
    cardDrawn?: Card;
    canPlay?: boolean;
    error?: string;
  } {
    if (this.phase !== 'in_game') {
      return { success: false, error: 'Game is not active.' };
    }

    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.id !== playerId) {
      return { success: false, error: 'It is not your turn.' };
    }

    if (this.hasDrawnCardThisTurn) {
      return { success: false, error: 'You have already drawn a card this turn. Play it or pass.' };
    }

    const drawn = this.drawCardsForPlayer(playerId, 1);
    if (drawn.length === 0) {
      return { success: false, error: 'No cards available to draw.' };
    }

    const drawnCard = drawn[0];
    this.hasDrawnCardThisTurn = true;
    this.addLog(`${currentPlayer.name} drew a card.`, 'draw');

    const topDiscard = this.getTopDiscard();
    const canPlay = canPlayCard(drawnCard, topDiscard, this.activeColor);

    return {
      success: true,
      cardDrawn: drawnCard,
      canPlay,
    };
  }

  /**
   * Player passes their turn after drawing.
   */
  public passTurn(playerId: string): { success: boolean; error?: string } {
    if (this.phase !== 'in_game') {
      return { success: false, error: 'Game is not active.' };
    }

    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.id !== playerId) {
      return { success: false, error: 'It is not your turn.' };
    }

    if (!this.hasDrawnCardThisTurn) {
      return { success: false, error: 'You must draw a card before passing.' };
    }

    this.addLog(`${currentPlayer.name} passed their turn.`, 'turn');
    this.advanceTurn(1);
    return { success: true };
  }

  /**
   * Player declares UNO.
   */
  public callUno(playerId: string): { success: boolean; error?: string } {
    const player = this.players.find((p) => p.id === playerId);
    if (!player) return { success: false, error: 'Player not found.' };

    const hand = this.playerHands.get(playerId) || [];
    // Can call UNO when holding 1 or 2 cards
    if (hand.length > 2) {
      return { success: false, error: 'You can only call UNO when you have 1 or 2 cards remaining!' };
    }

    player.hasCalledUno = true;
    player.unoChallengeableUntil = null;
    this.addLog(`🚨 ${player.name} called UNO!`, 'uno');
    return { success: true };
  }

  /**
   * An opponent challenges a player who failed to call UNO.
   */
  public challengeUno(
    challengerId: string,
    targetPlayerId: string
  ): { success: boolean; penaltyApplied?: boolean; error?: string } {
    const challenger = this.players.find((p) => p.id === challengerId);
    const target = this.players.find((p) => p.id === targetPlayerId);

    if (!challenger || !target) {
      return { success: false, error: 'Player not found.' };
    }

    const targetHand = this.playerHands.get(targetPlayerId) || [];
    if (targetHand.length === 1 && !target.hasCalledUno) {
      // Penalty: Draw 2 cards!
      this.drawCardsForPlayer(targetPlayerId, 2);
      target.hasCalledUno = false;
      target.unoChallengeableUntil = null;
      this.addLog(`⚠️ ${challenger.name} challenged ${target.name} for not calling UNO! ${target.name} draws 2 penalty cards!`, 'challenge');
      return { success: true, penaltyApplied: true };
    }

    return { success: false, error: 'Invalid challenge: Player has already called UNO or does not have 1 card.' };
  }

  /**
   * Gets the legal playable card IDs for a given player.
   */
  public getPlayableCardIds(playerId: string): string[] {
    if (this.phase !== 'in_game') return [];
    if (this.getCurrentPlayer()?.id !== playerId) return [];

    const hand = this.playerHands.get(playerId) || [];
    const topDiscard = this.getTopDiscard();
    return hand
      .filter((card) => canPlayCard(card, topDiscard, this.activeColor))
      .map((c) => c.id);
  }

  /**
   * Returns authoritative public state.
   */
  public getPublicState(): PublicGameState {
    // Check expired UNO challenge windows
    const now = Date.now();
    for (const p of this.players) {
      if (p.unoChallengeableUntil && p.unoChallengeableUntil < now) {
        p.unoChallengeableUntil = null;
      }
    }

    return {
      roomId: this.roomId,
      roomCode: this.roomCode,
      phase: this.phase,
      hostId: this.hostId,
      settings: this.settings,
      players: this.players.map((p) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isHost: p.isHost,
        isReady: p.isReady,
        isConnected: p.isConnected,
        cardCount: p.cardCount,
        hasCalledUno: p.hasCalledUno,
        unoChallengeableUntil: p.unoChallengeableUntil,
      })),
      currentTurnPlayerId: this.phase === 'in_game' ? this.getCurrentPlayer()?.id || null : null,
      direction: this.direction,
      topDiscardCard: this.getTopDiscard(),
      activeColor: this.activeColor,
      drawPileCount: this.drawPile.length,
      discardPileCount: this.discardPile.length,
      winnerId: this.winnerId,
      turnTimeRemaining: null,
      hasDrawnCardThisTurn: this.hasDrawnCardThisTurn,
      logs: this.logs,
    };
  }

  /**
   * Returns private state for a specific player (their hand + legal plays).
   */
  public getPrivateState(playerId: string): PrivateGameState {
    const publicState = this.getPublicState();
    const hand = this.playerHands.get(playerId) || [];
    const isCurrentTurn = publicState.currentTurnPlayerId === playerId;
    const validPlayCardIds = isCurrentTurn ? this.getPlayableCardIds(playerId) : [];

    // Check if player can challenge anyone
    const canChallengeUno = this.players.some(
      (p) => p.id !== playerId && p.cardCount === 1 && !p.hasCalledUno && (p.unoChallengeableUntil || 0) > Date.now()
    );

    return {
      publicState,
      hand,
      validPlayCardIds,
      canDraw: isCurrentTurn && !this.hasDrawnCardThisTurn,
      canPass: isCurrentTurn && this.hasDrawnCardThisTurn,
      canCallUno: hand.length <= 2,
      canChallengeUno,
    };
  }

  public getPlayerHand(playerId: string): Card[] {
    return this.playerHands.get(playerId) || [];
  }
}
