import { Card, CardColor, CardValue } from '@/types/game';

const COLORS: ('red' | 'blue' | 'green' | 'yellow')[] = ['red', 'blue', 'green', 'yellow'];

/**
 * Creates a standard 108-card Classic UNO deck.
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  let instanceCount = 0;

  // 1. Color cards (Red, Blue, Green, Yellow)
  for (const color of COLORS) {
    // One '0' per color
    deck.push({
      id: `c_${color}_0_${++instanceCount}`,
      color,
      value: '0',
      score: 0,
    });

    // Two of '1' through '9' per color
    for (let num = 1; num <= 9; num++) {
      const val = num.toString() as CardValue;
      deck.push({
        id: `c_${color}_${val}_${++instanceCount}`,
        color,
        value: val,
        score: num,
      });
      deck.push({
        id: `c_${color}_${val}_${++instanceCount}`,
        color,
        value: val,
        score: num,
      });
    }

    // Two of each action card per color: Skip, Reverse, Draw Two
    const actions: CardValue[] = ['skip', 'reverse', 'draw2'];
    for (const act of actions) {
      deck.push({
        id: `c_${color}_${act}_${++instanceCount}`,
        color,
        value: act,
        score: 20,
      });
      deck.push({
        id: `c_${color}_${act}_${++instanceCount}`,
        color,
        value: act,
        score: 20,
      });
    }
  }

  // 2. Wild cards (4 Wild, 4 Wild Draw Four)
  for (let i = 0; i < 4; i++) {
    deck.push({
      id: `c_wild_${++instanceCount}`,
      color: 'wild',
      value: 'wild',
      score: 50,
    });
    deck.push({
      id: `c_wild_draw4_${++instanceCount}`,
      color: 'wild',
      value: 'wild_draw4',
      score: 50,
    });
  }

  return deck;
}

/**
 * Modern Fisher-Yates shuffle.
 */
export function shuffleDeck(cards: Card[]): Card[] {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
