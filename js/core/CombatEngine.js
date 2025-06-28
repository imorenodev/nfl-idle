// CombatEngine.js - Handles combat calculations and game logic

import { POSITION_LIMITS, COMBAT_CALCULATION, GAME_OVER_CONDITIONS } from './GameConstants.js';

/**
 * CombatEngine handles all combat-related calculations and validations
 */
export class CombatEngine {
    /**
     * Validate selected cards against position limits and rules
     * @param {Array} selectedCards - Array of selected card objects
     * @returns {Object} Validation result with isValid flag and error message
     */
    static validateCardSelection(selectedCards) {
        if (selectedCards.length === 0) {
            return { isValid: false, error: "SELECT_CARDS" };
        }

        if (selectedCards.length > 6) {
            return { isValid: false, error: "TOO_MANY_CARDS" };
        }

        const positionCounts = { QB: 0, RB: 0, WR: 0, TE: 0, DE: 0, DT: 0 };
        let hasQB = false;

        selectedCards.forEach(card => {
            if (card.position === 'QB') {
                positionCounts.QB++;
                hasQB = true;
            } else if (card.position in positionCounts) {
                positionCounts[card.position]++;
            }
        });

        // Check position limits
        for (const [position, count] of Object.entries(positionCounts)) {
            if (count > POSITION_LIMITS[position]) {
                return { 
                    isValid: false, 
                    error: `TOO_MANY_${position}`,
                    details: `Only ${POSITION_LIMITS[position]} ${position}${POSITION_LIMITS[position] > 1 ? 's' : ''} allowed!`
                };
            }
        }

        if (!hasQB) {
            return { isValid: false, error: "NEED_QB" };
        }

        return { isValid: true, hasQB, positionCounts };
    }

    /**
     * Calculate team statistics from played cards
     * @param {Array} cards - Array of card objects
     * @returns {Object} Team stats object
     */
    static calculateTeamStats(cards) {
        const stats = {
            rushOffense: 0,
            rushDefense: 0,
            passOffense: 0,
            passDefense: 0,
            hasQB: false,
            totalPower: 0
        };

        cards.forEach(card => {
            stats.rushOffense += card.rushOffense || 0;
            stats.rushDefense += card.rushDefense || 0;
            stats.passOffense += card.passOffense || 0;
            stats.passDefense += card.passDefense || 0;
            stats.totalPower += (card.cost || 0) + (card.rarity || 0);
            
            if (card.position === 'QB') {
                stats.hasQB = true;
            }
        });

        return stats;
    }

    /**
     * Calculate yards gained/lost based on team matchup
     * @param {Object} playerStats - Player team statistics
     * @param {Object} enemyStats - Enemy team statistics
     * @returns {Object} Combat result with yard gains
     */
    static calculateCombatResult(playerStats, enemyStats) {
        let playerGain = 0;
        let enemyGain = 0;
        let playerOffenseType = 'None';
        let enemyOffenseType = 'None';

        // Player yards calculation - can only gain offensive yards with QB
        if (playerStats.hasQB) {
            const rushDiff = playerStats.rushOffense - enemyStats.rushDefense;
            const passDiff = playerStats.passOffense - enemyStats.passDefense;
            
            // Take the better of the two offensive approaches
            if (rushDiff >= passDiff) {
                playerGain = rushDiff;
                playerOffenseType = 'Rush';
            } else {
                playerGain = passDiff;
                playerOffenseType = 'Pass';
            }
        }

        // Enemy yards calculation - same rules apply
        if (enemyStats.hasQB) {
            const rushDiff = enemyStats.rushOffense - playerStats.rushDefense;
            const passDiff = enemyStats.passOffense - playerStats.passDefense;
            
            // Take the better of the two offensive approaches
            if (rushDiff >= passDiff) {
                enemyGain = rushDiff;
                enemyOffenseType = 'Rush';
            } else {
                enemyGain = passDiff;
                enemyOffenseType = 'Pass';
            }
        }

        return {
            playerGain,
            enemyGain,
            playerOffenseType,
            enemyOffenseType,
            playerStats,
            enemyStats
        };
    }

    /**
     * Apply yard changes with bounds checking
     * @param {number} currentPlayerYards - Current player yards
     * @param {number} currentEnemyYards - Current enemy yards
     * @param {number} playerGain - Yards player gained/lost
     * @param {number} enemyGain - Yards enemy gained/lost
     * @returns {Object} New yard values and actual changes
     */
    static applyYardChanges(currentPlayerYards, currentEnemyYards, playerGain, enemyGain) {
        const { MIN, MAX } = COMBAT_CALCULATION.YARD_BOUNDS;
        
        // Calculate what the new yards would be
        const newPlayerYards = currentPlayerYards + playerGain;
        const newEnemyYards = currentEnemyYards + enemyGain;

        // Clamp to bounds
        const clampedPlayerYards = Math.max(MIN, Math.min(MAX, newPlayerYards));
        const clampedEnemyYards = Math.max(MIN, Math.min(MAX, newEnemyYards));

        // Calculate the actual change that occurred (accounting for clamping)
        const actualPlayerChange = clampedPlayerYards - currentPlayerYards;
        const actualEnemyChange = clampedEnemyYards - currentEnemyYards;

        return {
            newPlayerYards: clampedPlayerYards,
            newEnemyYards: clampedEnemyYards,
            actualPlayerChange,
            actualEnemyChange,
            wasPlayerClamped: newPlayerYards !== clampedPlayerYards,
            wasEnemyClamped: newEnemyYards !== clampedEnemyYards
        };
    }

    /**
     * Check if game is over based on all win/lose conditions
     * @param {number} playerYards - Player's current yards
     * @param {number} enemyYards - Enemy's current yards
     * @returns {Object} Game over status
     */
    static checkGameOver(playerYards, enemyYards) {
        const { MIN, MAX } = COMBAT_CALCULATION.YARD_BOUNDS;
        
        // Player reaches 100 yards - Player wins by touchdown
        if (playerYards >= MAX) {
            return { 
                isGameOver: true, 
                winner: 'player', 
                condition: GAME_OVER_CONDITIONS.PLAYER_TOUCHDOWN,
                type: 'touchdown'
            };
        }
        
        // Enemy reaches 100 yards - Player loses (enemy touchdown)
        if (enemyYards >= MAX) {
            return { 
                isGameOver: true, 
                winner: 'enemy', 
                condition: GAME_OVER_CONDITIONS.ENEMY_TOUCHDOWN,
                type: 'touchdown'
            };
        }
        
        // Player reaches 0 yards - Player loses by safety
        if (playerYards <= MIN) {
            return { 
                isGameOver: true, 
                winner: 'enemy', 
                condition: GAME_OVER_CONDITIONS.ENEMY_SAFETY,
                type: 'safety'
            };
        }
        
        // Enemy reaches 0 yards - Player wins by safety
        if (enemyYards <= MIN) {
            return { 
                isGameOver: true, 
                winner: 'player', 
                condition: GAME_OVER_CONDITIONS.PLAYER_SAFETY,
                type: 'safety'
            };
        }
        
        return { isGameOver: false, winner: null, condition: null, type: null };
    }

    /**
     * Generate combat result message
     * @param {Object} combatResult - Result from calculateCombatResult
     * @param {number} round - Current round number
     * @returns {string} Formatted message
     */
    static generateCombatMessage(combatResult, round) {
        const { playerGain, enemyGain, playerOffenseType, enemyOffenseType, playerStats, enemyStats } = combatResult;
        
        let message = `Round ${round} Complete!\n`;

        if (playerStats.hasQB) {
            message += `You: ${playerOffenseType} attack (${playerGain > 0 ? '+' : ''}${playerGain} yards)\n`;
        } else {
            message += `You: No QB - No offensive yards (Defense only)\n`;
        }

        if (enemyStats.hasQB) {
            message += `Enemy: ${enemyOffenseType} attack (${enemyGain > 0 ? '+' : ''}${enemyGain} yards)`;
        } else {
            message += `Enemy: No QB - No offensive yards (Defense only)`;
        }

        return message;
    }

    /**
     * Complete combat sequence for a round
     * @param {Array} playerCards - Player's played cards
     * @param {Array} enemyCards - Enemy's played cards
     * @param {number} currentPlayerYards - Current player yards
     * @param {number} currentEnemyYards - Current enemy yards
     * @param {number} round - Current round number
     * @returns {Object} Complete combat result
     */
    static processCombatRound(playerCards, enemyCards, currentPlayerYards, currentEnemyYards, round) {
        // Calculate team stats
        const playerStats = this.calculateTeamStats(playerCards);
        const enemyStats = this.calculateTeamStats(enemyCards);

        // Calculate combat result
        const combatResult = this.calculateCombatResult(playerStats, enemyStats);

        // Apply yard changes
        const yardResult = this.applyYardChanges(
            currentPlayerYards,
            currentEnemyYards,
            combatResult.playerGain,
            combatResult.enemyGain
        );

        // Check game over
        const gameStatus = this.checkGameOver(yardResult.newPlayerYards, yardResult.newEnemyYards);

        // Generate message
        const message = this.generateCombatMessage(combatResult, round);

        return {
            ...combatResult,
            ...yardResult,
            ...gameStatus,
            message,
            round,
            playerStats,
            enemyStats
        };
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
     * Get position limit for a given position
     * @param {string} position - Position name
     * @returns {number} Maximum allowed cards of this position
     */
    static getPositionLimit(position) {
        return POSITION_LIMITS[position] || 0;
    }

    /**
     * Validate a single card's data structure
     * @param {Object} card - Card to validate
     * @returns {boolean} True if card is valid
     */
    static validateCardData(card) {
        const requiredFields = ['name', 'cost', 'rarity', 'position', 'rushOffense', 'rushDefense', 'passOffense', 'passDefense'];
        return requiredFields.every(field => 
            card.hasOwnProperty(field) && 
            typeof card[field] !== 'undefined' &&
            (typeof card[field] === 'string' || typeof card[field] === 'number')
        );
    }
}