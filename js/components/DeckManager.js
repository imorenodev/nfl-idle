// DeckManager.js - Handles deck operations and card management

import { GAME_CONFIG, GAME_MESSAGES } from '../core/GameConstants.js';
import { CardDataProvider } from '../data/CardDataProvider.js';

/**
 * DeckManager handles all deck-related operations for player and enemy
 */
export class DeckManager {
    constructor(isEnemy = false) {
        this.isEnemy = isEnemy;
        this.drawPile = [];
        this.hand = [];
        this.discardPile = [];
        this.shuffleCallback = null;
    }

    /**
     * Initialize deck with card data
     */
    initializeDeck() {
        const deckData = this.isEnemy ? 
            CardDataProvider.getEnemyDeck() : 
            CardDataProvider.getPlayerDeck();
        
        this.drawPile = this.shuffleDeck([...deckData]);
        this.hand = [];
        this.discardPile = [];
    }

    /**
     * Shuffle an array of cards
     * @param {Array} cards - Cards to shuffle
     * @returns {Array} Shuffled cards
     */
    shuffleDeck(cards) {
        return [...cards].sort(() => Math.random() - 0.5);
    }

    /**
     * Draw cards from the deck
     * @param {number} count - Number of cards to draw
     * @returns {Array} Drawn cards
     */
    drawCards(count = GAME_CONFIG.CARDS_PER_HAND) {
        const drawnCards = [];
        
        for (let i = 0; i < count; i++) {
            // Check if we need to reshuffle
            if (this.drawPile.length === 0 && this.discardPile.length > 0) {
                this.reshuffleDiscardPile();
            }

            // Draw card if available
            const card = this.drawPile.shift();
            if (card) {
                // Generate unique ID for this instance
                card.id = `${this.isEnemy ? 'enemy-' : ''}hand-${Date.now()}-${Math.random()}`;
                this.hand.push(card);
                drawnCards.push(card);
            }
        }

        return drawnCards;
    }

    /**
     * Reshuffle discard pile back into draw pile
     */
    reshuffleDiscardPile() {
        if (this.discardPile.length === 0) return;

        this.drawPile = this.shuffleDeck([...this.discardPile]);
        this.discardPile = [];

        // Trigger callback if set
        if (this.shuffleCallback) {
            this.shuffleCallback(this.isEnemy ? GAME_MESSAGES.ENEMY_DECK_RESHUFFLED : GAME_MESSAGES.DECK_RESHUFFLED);
        }
    }

    /**
     * Discard cards from hand
     * @param {Array} cardIds - Array of card IDs to discard
     * @returns {Array} Discarded cards
     */
    discardCards(cardIds) {
        const discardedCards = [];
        
        cardIds.forEach(cardId => {
            const cardIndex = this.hand.findIndex(card => card.id === cardId);
            if (cardIndex !== -1) {
                const [discardedCard] = this.hand.splice(cardIndex, 1);
                
                // Create clean copy for discard pile (remove instance-specific data)
                const cleanCard = {
                    name: discardedCard.name,
                    cost: discardedCard.cost,
                    rarity: discardedCard.rarity,
                    position: discardedCard.position,
                    rushOffense: discardedCard.rushOffense,
                    rushDefense: discardedCard.rushDefense,
                    passOffense: discardedCard.passOffense,
                    passDefense: discardedCard.passDefense
                };
                
                this.discardPile.push(cleanCard);
                discardedCards.push(discardedCard);
            }
        });

        return discardedCards;
    }

    /**
     * Discard all cards from hand
     */
    discardAllHandCards() {
        const cardIds = this.hand.map(card => card.id);
        return this.discardCards(cardIds);
    }

    /**
     * Play cards (move from hand to field, then to discard)
     * @param {Array} cardIds - Array of card IDs to play
     * @returns {Array} Played cards
     */
    playCards(cardIds) {
        const playedCards = [];
        
        cardIds.forEach(cardId => {
            const cardIndex = this.hand.findIndex(card => card.id === cardId);
            if (cardIndex !== -1) {
                const [playedCard] = this.hand.splice(cardIndex, 1);
                playedCards.push(playedCard);
            }
        });

        return playedCards;
    }

    /**
     * Add played cards to discard pile
     * @param {Array} playedCards - Cards that were played this round
     */
    addPlayedCardsToDiscard(playedCards) {
        playedCards.forEach(card => {
            const cleanCard = {
                name: card.name,
                cost: card.cost,
                rarity: card.rarity,
                position: card.position,
                rushOffense: card.rushOffense,
                rushDefense: card.rushDefense,
                passOffense: card.passOffense,
                passDefense: card.passDefense
            };
            this.discardPile.push(cleanCard);
        });
    }

    /**
     * Get cards by IDs from hand
     * @param {Array} cardIds - Array of card IDs
     * @returns {Array} Array of card objects
     */
    getCardsByIds(cardIds) {
        return this.hand.filter(card => cardIds.includes(card.id));
    }

    /**
     * Get hand as array
     * @returns {Array} Current hand cards
     */
    getHand() {
        return [...this.hand];
    }

    /**
     * Get draw pile count
     * @returns {number} Number of cards in draw pile
     */
    getDrawPileCount() {
        return this.drawPile.length;
    }

    /**
     * Get discard pile count
     * @returns {number} Number of cards in discard pile
     */
    getDiscardPileCount() {
        return this.discardPile.length;
    }

    /**
     * Get hand count
     * @returns {number} Number of cards in hand
     */
    getHandCount() {
        return this.hand.length;
    }

    /**
     * Get total deck size (draw + discard)
     * @returns {number} Total deck size
     */
    getTotalDeckSize() {
        return this.drawPile.length + this.discardPile.length;
    }

    /**
     * Set callback for shuffle events
     * @param {Function} callback - Callback function to call when deck is reshuffled
     */
    setShuffleCallback(callback) {
        this.shuffleCallback = callback;
    }

    /**
     * Clear all piles (for game reset)
     */
    clearAll() {
        this.drawPile = [];
        this.hand = [];
        this.discardPile = [];
    }

    /**
     * Get deck statistics
     * @returns {Object} Deck statistics
     */
    getDeckStats() {
        return {
            drawPile: this.drawPile.length,
            hand: this.hand.length,
            discardPile: this.discardPile.length,
            total: this.getTotalDeckSize() + this.hand.length
        };
    }

    /**
     * Validate deck state
     * @returns {boolean} True if deck state is valid
     */
    validateDeckState() {
        const totalCards = this.drawPile.length + this.hand.length + this.discardPile.length;
        return totalCards === GAME_CONFIG.DECK_SIZE;
    }

    /**
     * Debug: Get all cards in all piles
     * @returns {Object} All cards organized by pile
     */
    getAllCards() {
        return {
            drawPile: [...this.drawPile],
            hand: [...this.hand],
            discardPile: [...this.discardPile]
        };
    }
}

/**
 * EnemyDeckManager with AI card selection logic
 */
export class EnemyDeckManager extends DeckManager {
    constructor() {
        super(true); // isEnemy = true
    }

    /**
     * AI card selection - selects cards following position limits
     * @returns {Array} Selected card IDs
     */
    selectCardsToPlay() {
        if (this.hand.length === 0) return [];

        const selectedCards = [];
        const positionCounts = { QB: 0, RB: 0, WR: 0, TE: 0 };
        let hasQB = false;

        // First, try to find a QB (only one allowed)
        const qbCard = this.hand.find(card => card.position === 'QB');
        if (qbCard) {
            selectedCards.push(qbCard.id);
            hasQB = true;
            positionCounts.QB = 1;
        }

        // Then add other cards respecting limits
        for (const card of this.hand) {
            if (selectedCards.length >= GAME_CONFIG.CARDS_PER_HAND) break;
            if (selectedCards.includes(card.id)) continue;
            
            // Skip other QBs since we can only have one
            if (card.position === 'QB') continue;

            let canAdd = true;
            if (card.position === 'RB' && positionCounts.RB >= 2) canAdd = false;
            else if (card.position === 'WR' && positionCounts.WR >= 3) canAdd = false;
            else if (card.position === 'TE' && positionCounts.TE >= 2) canAdd = false;

            if (canAdd) {
                selectedCards.push(card.id);
                if (card.position in positionCounts) {
                    positionCounts[card.position]++;
                }
            }
        }

        return selectedCards;
    }

    /**
     * AI plays all selected cards automatically
     * @returns {Object} Result with played cards and whether QB was played
     */
    playCardsAI() {
        const selectedCardIds = this.selectCardsToPlay();
        const playedCards = this.playCards(selectedCardIds);
        const hasQB = playedCards.some(card => card.position === 'QB');

        return {
            playedCards,
            hasQB,
            cardIds: selectedCardIds
        };
    }
}