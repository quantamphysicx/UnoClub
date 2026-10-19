import { Card, CardColor } from '@/types/game';

/**
 * Checks whether a card can be legally played onto the current discard pile.
 */
export function canPlayCard(
  card: Card,
  topDiscard: Card | null,
  activeColor: CardColor | null
): boolean {
  if (!topDiscard) return true;

  // Wild cards can always be played
  if (card.color === 'wild' || card.value === 'wild' || card.value === 'wild_draw4') {
    return true;
  }

  // Active color takes precedence (especially if topDiscard was a Wild)
  const currentActiveColor = activeColor || topDiscard.color;
  if (card.color === currentActiveColor) {
    return true;
  }

  // Value/Symbol match (e.g. Red 5 on Blue 5, or Yellow Skip on Green Skip)
  if (card.value === topDiscard.value) {
    return true;
  }

  return false;
}

/**
 * Get the score value of a card according to classic UNO rules.
 */
export function getCardScore(card: Card): number {
  if (card.value === 'wild' || card.value === 'wild_draw4') {
    return 50;
  }
  if (card.value === 'skip' || card.value === 'reverse' || card.value === 'draw2') {
    return 20;
  }
  const parsed = parseInt(card.value, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Validates if the selected color for a Wild card is a valid playable color.
 */
export function isValidWildChoice(color?: string): color is 'red' | 'blue' | 'green' | 'yellow' {
  return color === 'red' || color === 'blue' || color === 'green' || color === 'yellow';
}
