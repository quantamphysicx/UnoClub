import { describe, it, expect } from 'vitest';
import { createDeck, shuffleDeck } from '../src/lib/game-engine/deck';
import { canPlayCard } from '../src/lib/game-engine/rules';
import { UnoGameEngine } from '../src/lib/game-engine/engine';
import { Card, Player } from '../src/types/game';

describe('UNO Deck & Rules Engine', () => {
  it('creates an exact 108-card classic UNO deck', () => {
    const deck = createDeck();
    expect(deck.length).toBe(108);

    const redCards = deck.filter((c) => c.color === 'red');
    const blueCards = deck.filter((c) => c.color === 'blue');
    const greenCards = deck.filter((c) => c.color === 'green');
    const yellowCards = deck.filter((c) => c.color === 'yellow');
    const wildCards = deck.filter((c) => c.color === 'wild');

    // 19 cards per color + 2 skip + 2 reverse + 2 draw2 = 25 per color = 100 color cards
    expect(redCards.length).toBe(25);
    expect(blueCards.length).toBe(25);
    expect(greenCards.length).toBe(25);
    expect(yellowCards.length).toBe(25);
    // 4 wild + 4 wild_draw4 = 8
    expect(wildCards.length).toBe(8);
  });

  it('correctly evaluates legal moves', () => {
    const topCard: Card = { id: 'top', color: 'red', value: '5', score: 5 };

    // Same color
    expect(canPlayCard({ id: '1', color: 'red', value: '8', score: 8 }, topCard, 'red')).toBe(true);
    // Same number
    expect(canPlayCard({ id: '2', color: 'blue', value: '5', score: 5 }, topCard, 'red')).toBe(true);
    // Wild card
    expect(canPlayCard({ id: '3', color: 'wild', value: 'wild', score: 50 }, topCard, 'red')).toBe(true);
    expect(canPlayCard({ id: '4', color: 'wild', value: 'wild_draw4', score: 50 }, topCard, 'red')).toBe(true);

    // Mismatched color and number
    expect(canPlayCard({ id: '5', color: 'blue', value: '9', score: 9 }, topCard, 'red')).toBe(false);
  });

  it('runs a multiplayer game with deal, turn progression, and reverse behavior', () => {
    const players: Player[] = [
      { id: 'p1', name: 'Alice', avatar: 'geom-1', isHost: true, isReady: true, isConnected: true, cardCount: 0, hasCalledUno: false },
      { id: 'p2', name: 'Bob', avatar: 'geom-2', isHost: false, isReady: true, isConnected: true, cardCount: 0, hasCalledUno: false },
      { id: 'p3', name: 'Charlie', avatar: 'geom-3', isHost: false, isReady: true, isConnected: true, cardCount: 0, hasCalledUno: false },
    ];

    const engine = new UnoGameEngine('room-1', 'AB12CD', 'p1', players);
    const started = engine.startMatch();
    expect(started).toBe(true);
    expect(engine.phase).toBe('in_game');

    // Each player got 7 cards
    expect(engine.getPlayerHand('p1').length).toBe(7);
    expect(engine.getPlayerHand('p2').length).toBe(7);
    expect(engine.getPlayerHand('p3').length).toBe(7);

    // Check top discard card exists
    const top = engine.getTopDiscard();
    expect(top).not.toBeNull();
  });

  it('handles 2-player reverse as a skip according to official rules', () => {
    const players: Player[] = [
      { id: 'p1', name: 'Alice', avatar: 'geom-1', isHost: true, isReady: true, isConnected: true, cardCount: 0, hasCalledUno: false },
      { id: 'p2', name: 'Bob', avatar: 'geom-2', isHost: false, isReady: true, isConnected: true, cardCount: 0, hasCalledUno: false },
    ];

    const engine = new UnoGameEngine('room-2', 'XY99ZZ', 'p1', players);
    engine.startMatch();

    const top = engine.getTopDiscard()!;
    const revCard: Card = { id: 'test_rev', color: top.color, value: 'reverse', score: 20 };
    engine['playerHands'].set('p1', [revCard]);
    engine.activeColor = revCard.color;
    engine.currentTurnIndex = 0; // p1's turn

    const res = engine.playCard('p1', 'test_rev');
    expect(res.success).toBe(true);

    // In 2 player, reverse acts as a skip and returns turn to p1
    expect(engine.getCurrentPlayer().id).toBe('p1');
  });

  it('validates UNO calling and penalizes if challenged without calling', () => {
    const players: Player[] = [
      { id: 'p1', name: 'Alice', avatar: 'geom-1', isHost: true, isReady: true, isConnected: true, cardCount: 0, hasCalledUno: false },
      { id: 'p2', name: 'Bob', avatar: 'geom-2', isHost: false, isReady: true, isConnected: true, cardCount: 0, hasCalledUno: false },
    ];

    const engine = new UnoGameEngine('room-3', 'UN0001', 'p1', players);
    engine.startMatch();

    const top = engine.getTopDiscard()!;
    const card1: Card = { id: 'c1', color: top.color, value: '7', score: 7 };
    const card2: Card = { id: 'c2', color: 'yellow', value: '3', score: 3 };
    engine['playerHands'].set('p1', [card1, card2]);
    engine.activeColor = card1.color;
    engine.currentTurnIndex = 0;

    // p1 plays card1 WITHOUT calling UNO
    const playRes = engine.playCard('p1', 'c1');
    expect(playRes.success).toBe(true);
    expect(engine.getPlayerHand('p1').length).toBe(1);

    // p2 challenges p1
    const challengeRes = engine.challengeUno('p2', 'p1');
    expect(challengeRes.success).toBe(true);
    expect(challengeRes.penaltyApplied).toBe(true);
    // p1 penalized with 2 cards: now has 1 + 2 = 3 cards!
    expect(engine.getPlayerHand('p1').length).toBe(3);
  });

  it('handles Wild Draw 4 penalties and color changes', () => {
    const players: Player[] = [
      { id: 'p1', name: 'Alice', avatar: 'geom-1', isHost: true, isReady: true, isConnected: true, cardCount: 0, hasCalledUno: false },
      { id: 'p2', name: 'Bob', avatar: 'geom-2', isHost: false, isReady: true, isConnected: true, cardCount: 0, hasCalledUno: false },
      { id: 'p3', name: 'Charlie', avatar: 'geom-3', isHost: false, isReady: true, isConnected: true, cardCount: 0, hasCalledUno: false },
    ];

    const engine = new UnoGameEngine('room-4', 'WILD04', 'p1', players);
    engine.startMatch();

    const wildDraw4: Card = { id: 'wd4', color: 'wild', value: 'wild_draw4', score: 50 };
    engine['playerHands'].set('p1', [wildDraw4, { id: 'extra', color: 'red', value: '1', score: 1 }]);
    engine.currentTurnIndex = 0; // p1's turn

    const p2InitialCount = engine.getPlayerHand('p2').length; // 7 cards

    const res = engine.playCard('p1', 'wd4', 'green');
    expect(res.success).toBe(true);
    expect(engine.activeColor).toBe('green');

    // p2 drew 4 cards (7 + 4 = 11)
    expect(engine.getPlayerHand('p2').length).toBe(p2InitialCount + 4);

    // p2 is skipped! Turn goes to p3 (Charlie)
    expect(engine.getCurrentPlayer().id).toBe('p3');
  });

  it('triggers win condition when final card is played', () => {
    const players: Player[] = [
      { id: 'p1', name: 'Alice', avatar: 'geom-1', isHost: true, isReady: true, isConnected: true, cardCount: 0, hasCalledUno: false },
      { id: 'p2', name: 'Bob', avatar: 'geom-2', isHost: false, isReady: true, isConnected: true, cardCount: 0, hasCalledUno: false },
    ];

    const engine = new UnoGameEngine('room-5', 'WIN001', 'p1', players);
    engine.startMatch();

    const top = engine.getTopDiscard()!;
    const lastCard: Card = { id: 'win_card', color: top.color, value: '9', score: 9 };
    engine['playerHands'].set('p1', [lastCard]);
    engine.activeColor = top.color;
    engine.currentTurnIndex = 0;

    const res = engine.playCard('p1', 'win_card');
    expect(res.success).toBe(true);
    expect(engine.phase).toBe('round_over');
    expect(engine.winnerId).toBe('p1');
  });

  it('reshuffles discard pile when draw pile is exhausted', () => {
    const players: Player[] = [
      { id: 'p1', name: 'Alice', avatar: 'geom-1', isHost: true, isReady: true, isConnected: true, cardCount: 0, hasCalledUno: false },
      { id: 'p2', name: 'Bob', avatar: 'geom-2', isHost: false, isReady: true, isConnected: true, cardCount: 0, hasCalledUno: false },
    ];

    const engine = new UnoGameEngine('room-6', 'SHUFF1', 'p1', players);
    engine.startMatch();

    // Empty draw pile and put cards in discard pile
    engine.drawPile = [];
    const topCard = engine.getTopDiscard()!;
    engine.discardPile = [
      { id: 'old1', color: 'blue', value: '1', score: 1 },
      { id: 'old2', color: 'blue', value: '2', score: 2 },
      { id: 'old3', color: 'blue', value: '3', score: 3 },
      topCard,
    ];

    // Player draws a card
    const drawn = engine.drawCardsForPlayer('p1', 1);
    expect(drawn.length).toBe(1);
    // Draw pile was replenished from the 3 discard cards (excluding topCard)
    expect(engine.getTopDiscard()?.id).toBe(topCard.id);
  });
});
