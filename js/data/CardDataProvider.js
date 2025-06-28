// CardDataProvider.js - All card data and lookup methods

export const PLAYER_DECK_DATA = [
    { name: 'MAHOMES', cost: 8, rarity: 6, position: 'QB', rushOffense: 8, rushDefense: 1, passOffense: 10, passDefense: 1 },
    { name: 'ALLEN', cost: 7, rarity: 6, position: 'QB', rushOffense: 9, rushDefense: 1, passOffense: 9, passDefense: 1 },
    { name: 'BURROW', cost: 6, rarity: 5, position: 'QB', rushOffense: 3, rushDefense: 1, passOffense: 9, passDefense: 1 },
    { name: 'HURTS', cost: 5, rarity: 4, position: 'QB', rushOffense: 10, rushDefense: 1, passOffense: 7, passDefense: 1 },
    { name: 'LAMAR', cost: 6, rarity: 5, position: 'QB', rushOffense: 10, rushDefense: 1, passOffense: 8, passDefense: 1 },
    { name: 'HENRY', cost: 7, rarity: 5, position: 'RB', rushOffense: 10, rushDefense: 1, passOffense: 2, passDefense: 1 },
    { name: 'MCCAFFREY', cost: 8, rarity: 6, position: 'RB', rushOffense: 9, rushDefense: 1, passOffense: 9, passDefense: 1 },
    { name: 'CHUBB', cost: 5, rarity: 4, position: 'RB', rushOffense: 9, rushDefense: 1, passOffense: 3, passDefense: 1 },
    { name: 'COOK', cost: 4, rarity: 3, position: 'RB', rushOffense: 7, rushDefense: 1, passOffense: 6, passDefense: 1 },
    { name: 'KUPP', cost: 6, rarity: 5, position: 'WR', rushOffense: 2, rushDefense: 1, passOffense: 9, passDefense: 1 },
    { name: 'JEFFERSON', cost: 7, rarity: 6, position: 'WR', rushOffense: 2, rushDefense: 1, passOffense: 10, passDefense: 1 },
    { name: 'DIGGS', cost: 5, rarity: 4, position: 'WR', rushOffense: 1, rushDefense: 1, passOffense: 8, passDefense: 1 },
    { name: 'ADAMS', cost: 6, rarity: 5, position: 'WR', rushOffense: 1, rushDefense: 1, passOffense: 9, passDefense: 1 },
    { name: 'KELCE', cost: 7, rarity: 6, position: 'TE', rushOffense: 3, rushDefense: 1, passOffense: 9, passDefense: 1 },
    { name: 'WATT', cost: 8, rarity: 6, position: 'DE', rushOffense: 1, rushDefense: 10, passOffense: 1, passDefense: 5 }
];

export const ENEMY_DECK_DATA = [
    { name: 'RODGERS', cost: 7, rarity: 5, position: 'QB', rushOffense: 4, rushDefense: 1, passOffense: 9, passDefense: 1 },
    { name: 'WILSON', cost: 6, rarity: 4, position: 'QB', rushOffense: 7, rushDefense: 1, passOffense: 8, passDefense: 1 },
    { name: 'PRESCOTT', cost: 5, rarity: 4, position: 'QB', rushOffense: 6, rushDefense: 1, passOffense: 7, passDefense: 1 },
    { name: 'STAFFORD', cost: 5, rarity: 3, position: 'QB', rushOffense: 2, rushDefense: 1, passOffense: 8, passDefense: 1 },
    { name: 'JONES', cost: 4, rarity: 3, position: 'QB', rushOffense: 8, rushDefense: 1, passOffense: 6, passDefense: 1 },
    { name: 'BARKLEY', cost: 7, rarity: 5, position: 'RB', rushOffense: 9, rushDefense: 1, passOffense: 8, passDefense: 1 },
    { name: 'JONES II', cost: 6, rarity: 4, position: 'RB', rushOffense: 8, rushDefense: 1, passOffense: 4, passDefense: 1 },
    { name: 'MIXON', cost: 5, rarity: 4, position: 'RB', rushOffense: 7, rushDefense: 1, passOffense: 6, passDefense: 1 },
    { name: 'HARRIS', cost: 4, rarity: 3, position: 'RB', rushOffense: 7, rushDefense: 1, passOffense: 3, passDefense: 1 },
    { name: 'HILL', cost: 7, rarity: 6, position: 'WR', rushOffense: 3, rushDefense: 1, passOffense: 10, passDefense: 1 },
    { name: 'CHASE', cost: 6, rarity: 5, position: 'WR', rushOffense: 1, rushDefense: 1, passOffense: 9, passDefense: 1 },
    { name: 'HOPKINS', cost: 5, rarity: 4, position: 'WR', rushOffense: 1, rushDefense: 1, passOffense: 8, passDefense: 1 },
    { name: 'EVANS', cost: 5, rarity: 4, position: 'WR', rushOffense: 1, rushDefense: 1, passOffense: 8, passDefense: 1 },
    { name: 'KITTLE', cost: 6, rarity: 5, position: 'TE', rushOffense: 4, rushDefense: 1, passOffense: 8, passDefense: 1 },
    { name: 'DONALD', cost: 8, rarity: 6, position: 'DT', rushOffense: 1, rushDefense: 10, passOffense: 1, passDefense: 5 }
];

// Legacy lookup maps for backward compatibility
const PLAYER_CARD_COSTS = {
    'MAHOMES': 8, 'ALLEN': 7, 'BURROW': 6, 'HURTS': 5, 'LAMAR': 6,
    'MCCAFFREY': 8, 'HENRY': 7, 'CHUBB': 5, 'COOK': 4,
    'JEFFERSON': 7, 'KUPP': 6, 'ADAMS': 6, 'DIGGS': 5,
    'KELCE': 7, 'WATT': 8
};

const PLAYER_CARD_RARITIES = {
    'MAHOMES': 6, 'ALLEN': 6, 'BURROW': 5, 'HURTS': 4, 'LAMAR': 5,
    'MCCAFFREY': 6, 'HENRY': 5, 'CHUBB': 4, 'COOK': 3,
    'JEFFERSON': 6, 'KUPP': 5, 'ADAMS': 5, 'DIGGS': 4,
    'KELCE': 6, 'WATT': 6
};

const ENEMY_CARD_COSTS = {
    'RODGERS': 7, 'WILSON': 6, 'PRESCOTT': 5, 'STAFFORD': 5, 'JONES': 4,
    'BARKLEY': 7, 'JONES II': 6, 'MIXON': 5, 'HARRIS': 4,
    'HILL': 7, 'CHASE': 6, 'HOPKINS': 5, 'EVANS': 5,
    'KITTLE': 6, 'DONALD': 8
};

const ENEMY_CARD_RARITIES = {
    'RODGERS': 5, 'WILSON': 4, 'PRESCOTT': 4, 'STAFFORD': 3, 'JONES': 3,
    'BARKLEY': 5, 'JONES II': 4, 'MIXON': 4, 'HARRIS': 3,
    'HILL': 6, 'CHASE': 5, 'HOPKINS': 4, 'EVANS': 4,
    'KITTLE': 5, 'DONALD': 6
};

/**
 * CardDataProvider class for managing card data and lookups
 */
export class CardDataProvider {
    /**
     * Get a fresh copy of player deck data
     * @returns {Array} Array of player card objects
     */
    static getPlayerDeck() {
        return PLAYER_DECK_DATA.map((card, index) => ({
            ...card,
            id: `deck-${index}`,
            element: null
        }));
    }

    /**
     * Get a fresh copy of enemy deck data
     * @returns {Array} Array of enemy card objects
     */
    static getEnemyDeck() {
        return ENEMY_DECK_DATA.map((card, index) => ({
            ...card,
            id: `enemy-deck-${index}`
        }));
    }

    /**
     * Get card cost by name (legacy method for backward compatibility)
     * @param {string} name - Card name
     * @returns {number} Card cost
     */
    static getCardCostByName(name) {
        return PLAYER_CARD_COSTS[name] || 5;
    }

    /**
     * Get card rarity by name (legacy method for backward compatibility)
     * @param {string} name - Card name
     * @returns {number} Card rarity
     */
    static getCardRarityByName(name) {
        return PLAYER_CARD_RARITIES[name] || 4;
    }

    /**
     * Get enemy card cost by name (legacy method for backward compatibility)
     * @param {string} name - Card name
     * @returns {number} Card cost
     */
    static getEnemyCardCostByName(name) {
        return ENEMY_CARD_COSTS[name] || 5;
    }

    /**
     * Get enemy card rarity by name (legacy method for backward compatibility)
     * @param {string} name - Card name
     * @returns {number} Card rarity
     */
    static getEnemyCardRarityByName(name) {
        return ENEMY_CARD_RARITIES[name] || 4;
    }

    /**
     * Get card data by name from player deck
     * @param {string} name - Card name
     * @returns {Object|null} Card object or null if not found
     */
    static getPlayerCardByName(name) {
        return PLAYER_DECK_DATA.find(card => card.name === name) || null;
    }

    /**
     * Get card data by name from enemy deck
     * @param {string} name - Card name
     * @returns {Object|null} Card object or null if not found
     */
    static getEnemyCardByName(name) {
        return ENEMY_DECK_DATA.find(card => card.name === name) || null;
    }

    /**
     * Calculate card power (cost + rarity)
     * @param {Object} card - Card object
     * @returns {number} Card power
     */
    static calculateCardPower(card) {
        return (card.cost || 0) + (card.rarity || 0);
    }

    /**
     * Validate card data structure
     * @param {Object} card - Card object to validate
     * @returns {boolean} True if valid
     */
    static validateCard(card) {
        const requiredFields = ['name', 'cost', 'rarity', 'position', 'rushOffense', 'rushDefense', 'passOffense', 'passDefense'];
        return requiredFields.every(field => card.hasOwnProperty(field) && card[field] !== undefined);
    }

    /**
     * Get all unique positions from player deck
     * @returns {Array} Array of position strings
     */
    static getPlayerPositions() {
        return [...new Set(PLAYER_DECK_DATA.map(card => card.position))];
    }

    /**
     * Get all unique positions from enemy deck
     * @returns {Array} Array of position strings
     */
    static getEnemyPositions() {
        return [...new Set(ENEMY_DECK_DATA.map(card => card.position))];
    }

    /**
     * Get cards by position from player deck
     * @param {string} position - Position to filter by
     * @returns {Array} Array of card objects
     */
    static getPlayerCardsByPosition(position) {
        return PLAYER_DECK_DATA.filter(card => card.position === position);
    }

    /**
     * Get cards by position from enemy deck
     * @param {string} position - Position to filter by
     * @returns {Array} Array of card objects
     */
    static getEnemyCardsByPosition(position) {
        return ENEMY_DECK_DATA.filter(card => card.position === position);
    }
}