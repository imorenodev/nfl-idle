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

        const positionCounts = { QB: 0, RB: 0, WR: 0, TE: 0, DE: 0, DT: 0, LB: 0, CB: 0, S: 0 };
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

        console.log(`=== CALCULATING TEAM STATS ===`);
        console.log(`Cards count: ${cards.length}`);
        
        // Check if we have null cards or cards with missing stats
        if (cards.length === 0) {
            console.warn('WARNING: Empty cards array passed to calculateTeamStats!');
        }
        
        cards.forEach((card, index) => {
            // Validate card data
            if (!card) {
                console.error(`Card ${index + 1} is null/undefined!`);
                return;
            }
            
            const rushOff = card.rushOffense || 0;
            const rushDef = card.rushDefense || 0;
            const passOff = card.passOffense || 0;
            const passDef = card.passDefense || 0;
            
            console.log(`Card ${index + 1}: ${card.name} (${card.position}) - Rush Off: ${rushOff}, Rush Def: ${rushDef}, Pass Off: ${passOff}, Pass Def: ${passDef}`);
            
            // Check for invalid numbers
            if (isNaN(rushOff) || isNaN(rushDef) || isNaN(passOff) || isNaN(passDef)) {
                console.error(`Invalid stats detected for card: ${card.name}`);
            }
            
            stats.rushOffense += rushOff;
            stats.rushDefense += rushDef;
            stats.passOffense += passOff;
            stats.passDefense += passDef;
            stats.totalPower += (card.cost || 0) + (card.rarity || 0);
            
            if (card.position === 'QB') {
                stats.hasQB = true;
            }
        });

        console.log(`Final Team Stats: Rush Off ${stats.rushOffense}, Rush Def ${stats.rushDefense}, Pass Off ${stats.passOffense}, Pass Def ${stats.passDefense}, Has QB: ${stats.hasQB}`);
        return stats;
    }

    /**
     * Calculate yards gained/lost based on team matchup
     * @param {Object} playerStats - Player team statistics
     * @param {Object} enemyStats - Enemy team statistics
     * @returns {Object} Combat result with yard gains and detailed breakdowns
     */
    static calculateCombatResult(playerStats, enemyStats) {
        let playerGain = 0;
        let enemyGain = 0;
        let playerOffenseType = 'None';
        let enemyOffenseType = 'None';

        // Calculate detailed breakdowns for player
        const playerRushDiff = playerStats.rushOffense - enemyStats.rushDefense;
        const playerPassDiff = playerStats.passOffense - enemyStats.passDefense;
        
        const playerBreakdown = {
            rushOffense: playerStats.rushOffense,
            passOffense: playerStats.passOffense,
            enemyRushDefense: enemyStats.rushDefense,
            enemyPassDefense: enemyStats.passDefense,
            rushDiff: playerRushDiff,
            passDiff: playerPassDiff,
            hasQB: playerStats.hasQB
        };

        // Calculate detailed breakdowns for enemy
        const enemyRushDiff = enemyStats.rushOffense - playerStats.rushDefense;
        const enemyPassDiff = enemyStats.passOffense - playerStats.passDefense;
        
        const enemyBreakdown = {
            rushOffense: enemyStats.rushOffense,
            passOffense: enemyStats.passOffense,
            playerRushDefense: playerStats.rushDefense,
            playerPassDefense: playerStats.passDefense,
            rushDiff: enemyRushDiff,
            passDiff: enemyPassDiff,
            hasQB: enemyStats.hasQB
        };

        // Player yards calculation - can only gain offensive yards with QB
        if (playerStats.hasQB) {
            // Take the better of the two offensive approaches
            if (playerRushDiff >= playerPassDiff) {
                playerGain = playerRushDiff;
                playerOffenseType = 'Rush';
            } else {
                playerGain = playerPassDiff;
                playerOffenseType = 'Pass';
            }
            console.log(`Player has QB: ${playerOffenseType} = ${playerGain} yards`);
        } else {
            console.log(`Player has NO QB: Defense only, playerGain = ${playerGain}`);
        }

        // Enemy yards calculation - same rules apply
        if (enemyStats.hasQB) {
            // Take the better of the two offensive approaches
            if (enemyRushDiff >= enemyPassDiff) {
                enemyGain = enemyRushDiff;
                enemyOffenseType = 'Rush';
            } else {
                enemyGain = enemyPassDiff;
                enemyOffenseType = 'Pass';
            }
            console.log(`Enemy has QB: ${enemyOffenseType} = ${enemyGain} yards`);
        } else {
            console.log(`Enemy has NO QB: Defense only, enemyGain = ${enemyGain}`);
        }

        // Check for defensive dominance scenarios
        const playerDefensiveDominance = this.checkDefensiveDominance(playerStats, enemyStats);
        const enemyDefensiveDominance = this.checkDefensiveDominance(enemyStats, playerStats);

        // Apply defensive dominance penalties
        if (playerDefensiveDominance.isDominant) {
            // Player defense dominates enemy offense
            enemyGain = playerDefensiveDominance.yardLoss; // Force the yard loss
            enemyOffenseType = 'Defensive Loss';
            console.log(`Player defensive dominance: Enemy forced to ${playerDefensiveDominance.yardLoss} yards`);
        }

        if (enemyDefensiveDominance.isDominant) {
            // Enemy defense dominates player offense  
            playerGain = enemyDefensiveDominance.yardLoss; // Force the yard loss
            playerOffenseType = 'Defensive Loss';
            console.log(`Enemy defensive dominance: Player forced to ${enemyDefensiveDominance.yardLoss} yards`);
        }

        // Update breakdowns with defensive dominance info
        playerBreakdown.defensiveDominance = enemyDefensiveDominance;
        enemyBreakdown.defensiveDominance = playerDefensiveDominance;

        // Final debug logging
        console.log(`=== FINAL COMBAT RESULT ===`);
        console.log(`Player: ${playerOffenseType} = ${playerGain} yards`);
        console.log(`Enemy: ${enemyOffenseType} = ${enemyGain} yards`);
        console.log(`Player Stats: Rush Off ${playerStats.rushOffense}, Pass Off ${playerStats.passOffense}, Rush Def ${playerStats.rushDefense}, Pass Def ${playerStats.passDefense}`);
        console.log(`Enemy Stats: Rush Off ${enemyStats.rushOffense}, Pass Off ${enemyStats.passOffense}, Rush Def ${enemyStats.rushDefense}, Pass Def ${enemyStats.passDefense}`);
        
        // Check for potential tie condition (both teams gain same yards)
        if (playerGain === enemyGain) {
            console.warn(`⚠️ POTENTIAL TIE DETECTED: Both teams gaining ${playerGain} yards`);
            if (playerGain === 0) {
                console.warn(`🚫 ZERO GAIN TIE: Both teams gaining 0 yards - this may cause infinite stalemate!`);
            }
        }
        
        return {
            playerGain,
            enemyGain,
            playerOffenseType,
            enemyOffenseType,
            playerStats,
            enemyStats,
            playerBreakdown,
            enemyBreakdown
        };
    }

    /**
     * Check if a team has defensive dominance over the opponent
     * @param {Object} defensiveTeamStats - Stats of the defending team
     * @param {Object} offensiveTeamStats - Stats of the offensive team
     * @returns {Object} Defensive dominance result
     */
    static checkDefensiveDominance(defensiveTeamStats, offensiveTeamStats) {
        const defRush = defensiveTeamStats.rushDefense;
        const defPass = defensiveTeamStats.passDefense;
        const offRush = offensiveTeamStats.rushOffense;
        const offPass = offensiveTeamStats.passOffense;

        console.log(`Checking defensive dominance: Def Rush ${defRush} vs Off Rush ${offRush}, Def Pass ${defPass} vs Off Pass ${offPass}`);

        // Check if defense dominates BOTH rush and pass offense
        const rushDominance = defRush > offRush;
        const passDominance = defPass > offPass;

        if (rushDominance && passDominance) {
            // Calculate yard loss based on the greater defensive advantage
            const rushDefensiveAdvantage = defRush - offRush;
            const passDefensiveAdvantage = defPass - offPass;
            const maxDefensiveAdvantage = Math.max(rushDefensiveAdvantage, passDefensiveAdvantage);
            
            console.log(`DEFENSIVE DOMINANCE: Rush advantage ${rushDefensiveAdvantage}, Pass advantage ${passDefensiveAdvantage}, Max ${maxDefensiveAdvantage}`);
            
            return {
                isDominant: true,
                yardLoss: -maxDefensiveAdvantage,
                rushDominance: rushDefensiveAdvantage,
                passDominance: passDefensiveAdvantage,
                maxAdvantage: maxDefensiveAdvantage,
                dominanceType: rushDefensiveAdvantage >= passDefensiveAdvantage ? 'Rush Defense' : 'Pass Defense'
            };
        }

        console.log(`No defensive dominance: Rush dom ${rushDominance}, Pass dom ${passDominance}`);
        return {
            isDominant: false,
            yardLoss: 0,
            rushDominance: defRush - offRush,
            passDominance: defPass - offPass,
            maxAdvantage: 0,
            dominanceType: null
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
        
        console.log(`=== APPLYING YARD CHANGES ===`);
        console.log(`Current: Player ${currentPlayerYards}, Enemy ${currentEnemyYards}`);
        console.log(`Gains: Player ${playerGain}, Enemy ${enemyGain}`);
        
        // Calculate what the new yards would be
        const newPlayerYards = currentPlayerYards + playerGain;
        const newEnemyYards = currentEnemyYards + enemyGain;
        
        console.log(`Calculated new yards: Player ${newPlayerYards}, Enemy ${newEnemyYards}`);

        // Check for game over conditions BEFORE clamping
        const gameOverCheck = this.checkGameOver(newPlayerYards, newEnemyYards);
        if (gameOverCheck.isGameOver) {
            console.log(`🚨 GAME OVER DETECTED BEFORE CLAMPING: ${gameOverCheck.type} - ${gameOverCheck.winner} wins! (Player: ${newPlayerYards}, Enemy: ${newEnemyYards})`);
            console.log(`🎯 Game Over Details:`, gameOverCheck);
        } else {
            console.log(`✅ No game over detected with yards: Player: ${newPlayerYards}, Enemy: ${newEnemyYards}`);
        }
        
        // Clamp to bounds (but game over should have been detected above)
        const clampedPlayerYards = Math.max(MIN, Math.min(MAX, newPlayerYards));
        const clampedEnemyYards = Math.max(MIN, Math.min(MAX, newEnemyYards));
        
        console.log(`Clamped yards: Player ${clampedPlayerYards}, Enemy ${clampedEnemyYards}`);
        
        // Additional safety check - if game is over but wasn't detected, this is a bug
        if (!gameOverCheck.isGameOver) {
            const postClampGameOver = this.checkGameOver(clampedPlayerYards, clampedEnemyYards);
            if (postClampGameOver.isGameOver) {
                console.error(`🐛 BUG DETECTED: Game over only detected AFTER clamping!`);
                console.error(`Pre-clamp: Player ${newPlayerYards}, Enemy ${newEnemyYards}`);
                console.error(`Post-clamp: Player ${clampedPlayerYards}, Enemy ${clampedEnemyYards}`);
                console.error(`This should not happen - game over should be detected before clamping!`);
            }
        }

        // Calculate the actual change that occurred (accounting for clamping)
        const actualPlayerChange = clampedPlayerYards - currentPlayerYards;
        const actualEnemyChange = clampedEnemyYards - currentEnemyYards;
        
        console.log(`Actual changes: Player ${actualPlayerChange}, Enemy ${actualEnemyChange}`);

        return {
            newPlayerYards: clampedPlayerYards,
            newEnemyYards: clampedEnemyYards,
            actualPlayerChange,
            actualEnemyChange,
            wasPlayerClamped: newPlayerYards !== clampedPlayerYards,
            wasEnemyClamped: newEnemyYards !== clampedEnemyYards,
            gameOverResult: gameOverCheck  // Include game over check result
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
        
        // Debug logging
        console.log(`CombatEngine.checkGameOver: Player=${playerYards}, Enemy=${enemyYards}, MIN=${MIN}, MAX=${MAX}`);
        
        // Player reaches 100 yards - Player wins by touchdown
        if (playerYards >= MAX) {
            console.log('Game Over: Player Touchdown');
            return { 
                isGameOver: true, 
                winner: 'player', 
                condition: GAME_OVER_CONDITIONS.PLAYER_TOUCHDOWN,
                type: 'touchdown'
            };
        }
        
        // Enemy reaches 100 yards - Player loses (enemy touchdown)
        if (enemyYards >= MAX) {
            console.log('Game Over: Enemy Touchdown');
            return { 
                isGameOver: true, 
                winner: 'enemy', 
                condition: GAME_OVER_CONDITIONS.ENEMY_TOUCHDOWN,
                type: 'touchdown'
            };
        }
        
        // Player reaches 0 yards or below - Player loses by safety
        if (playerYards <= MIN) {
            console.log(`Game Over: Player Safety (Enemy wins) - Player yards: ${playerYards}`);
            return { 
                isGameOver: true, 
                winner: 'enemy', 
                condition: GAME_OVER_CONDITIONS.ENEMY_SAFETY,
                type: 'safety'
            };
        }
        
        // Enemy reaches 0 yards or below - Player wins by safety
        if (enemyYards <= MIN) {
            console.log(`Game Over: Enemy Safety (Player wins) - Enemy yards: ${enemyYards}`);
            return { 
                isGameOver: true, 
                winner: 'player', 
                condition: GAME_OVER_CONDITIONS.PLAYER_SAFETY,
                type: 'safety'
            };
        }
        
        console.log('Game continues - no game over conditions met');
        return { isGameOver: false, winner: null, condition: null, type: null };
    }

    /**
     * Generate combat result message
     * @param {Object} combatResult - Result from calculateCombatResult
     * @param {number} round - Current round number
     * @returns {string} Formatted message
     */
    static generateCombatMessage(combatResult, round) {
        const { playerGain, enemyGain, playerOffenseType, enemyOffenseType, playerStats, enemyStats, playerBreakdown, enemyBreakdown } = combatResult;
        
        let message = `Round ${round} Complete!\n`;

        if (playerStats.hasQB) {
            message += `You: ${playerOffenseType} attack (${playerGain > 0 ? '+' : ''}${playerGain} yards)`;
            if (playerBreakdown.defensiveDominance && playerBreakdown.defensiveDominance.isDominant) {
                message += ` [Defensive Dominance!]`;
            }
            message += `\n`;
        } else {
            message += `You: No QB - Defense only (${playerGain > 0 ? '+' : ''}${playerGain} yards)\n`;
        }

        if (enemyStats.hasQB) {
            message += `Enemy: ${enemyOffenseType} attack (${enemyGain > 0 ? '+' : ''}${enemyGain} yards)`;
            if (enemyBreakdown.defensiveDominance && enemyBreakdown.defensiveDominance.isDominant) {
                message += ` [Defensive Dominance!]`;
            }
        } else {
            message += `Enemy: No QB - Defense only (${enemyGain > 0 ? '+' : ''}${enemyGain} yards)`;
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
        console.log(`\n🏈 ===== ROUND ${round} COMBAT PROCESSING =====`);
        console.log(`Starting yards: Player ${currentPlayerYards}, Enemy ${currentEnemyYards}`);
        
        // SPECIAL DEBUGGING FOR ROUNDS 6-7
        if (round >= 6 && round <= 7) {
            console.log(`🔍 ROUND ${round} DEEP DEBUG - INVESTIGATING TIE BUG:`);
            console.log(`Player cards:`, playerCards.map(c => `${c.name}(${c.position})`));
            console.log(`Enemy cards:`, enemyCards.map(c => `${c.name}(${c.position})`));
        }
        
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

        // Use game over result from applyYardChanges (checked before clamping)
        const gameStatus = yardResult.gameOverResult;

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