// GameOverManager.js - Handles game over states and UI

import { GAME_OVER_MESSAGES, GAME_OVER_CONDITIONS } from './GameConstants.js';
import { modalManager } from '../utils/ModalManager.js';
import { messageSystem } from '../utils/MessageSystem.js';

/**
 * GameOverManager handles game over detection, UI, and actions
 */
export class GameOverManager {
    constructor() {
        this.isGameOver = false;
        this.gameOverData = null;
        this.onGameRestart = null;
        this.onGameExit = null;
    }

    /**
     * Handle game over state
     * @param {Object} gameOverResult - Result from CombatEngine.checkGameOver()
     * @param {Object} gameState - Current game state (yards, round, etc.)
     */
    async handleGameOver(gameOverResult, gameState = {}) {
        if (!gameOverResult.isGameOver || this.isGameOver) {
            return;
        }

        this.isGameOver = true;
        this.gameOverData = {
            ...gameOverResult,
            round: gameState.round || 0,
            playerYards: gameState.playerYards || 0,
            enemyYards: gameState.enemyYards || 0,
            timestamp: new Date().toLocaleString()
        };

        // Show immediate message
        this.showImmediateMessage(gameOverResult);

        // Wait a moment then show detailed modal
        setTimeout(() => {
            this.showGameOverModal();
        }, 2000);
    }

    /**
     * Show immediate game over message
     * @param {Object} gameOverResult - Game over result
     */
    showImmediateMessage(gameOverResult) {
        const messageConfig = this.getMessageConfig(gameOverResult.condition);
        
        messageSystem.showMessage(messageConfig.message, {
            type: messageConfig.type,
            duration: 2000,
            position: 'center',
            fontSize: 'clamp(16px, 4vw, 24px)'
        });
    }

    /**
     * Get message configuration for game over condition
     * @param {string} condition - Game over condition
     * @returns {Object} Message configuration
     */
    getMessageConfig(condition) {
        const configs = {
            [GAME_OVER_CONDITIONS.PLAYER_TOUCHDOWN]: {
                message: GAME_OVER_MESSAGES.PLAYER_TOUCHDOWN,
                type: 'success'
            },
            [GAME_OVER_CONDITIONS.ENEMY_TOUCHDOWN]: {
                message: GAME_OVER_MESSAGES.ENEMY_TOUCHDOWN,
                type: 'error'
            },
            [GAME_OVER_CONDITIONS.PLAYER_SAFETY]: {
                message: GAME_OVER_MESSAGES.PLAYER_SAFETY,
                type: 'success'
            },
            [GAME_OVER_CONDITIONS.ENEMY_SAFETY]: {
                message: GAME_OVER_MESSAGES.ENEMY_SAFETY,
                type: 'error'
            }
        };

        return configs[condition] || { message: 'Game Over', type: 'info' };
    }

    /**
     * Show detailed game over modal
     */
    async showGameOverModal() {
        const { condition, winner, type } = this.gameOverData;
        
        const modalContent = this.createGameOverContent();
        
        // Determine button text based on win/loss and battle context
        const playerWon = winner === 'player';
        let continueButtonText;
        
        if (playerWon) {
            // Check if this was the final battle (Super Bowl)
            const currentBattle = window.nflApp?.screenManager?.getCurrentBattle();
            const isFinalBattle = currentBattle?.id === 'superbowl';
            
            if (isFinalBattle) {
                continueButtonText = '🏆 Start New Season';
            } else {
                continueButtonText = '➡️ Continue Season';
            }
        } else {
            continueButtonText = '🔄 Restart Season';
        }
        
        await modalManager.createModal('gameOverModal', {
            title: GAME_OVER_MESSAGES.GAME_OVER_TITLE,
            content: modalContent,
            showCloseButton: false,
            closeOnBackdrop: false,
            closeOnEscape: false,
            cssClass: `game-over-modal ${winner === 'player' ? 'victory' : 'defeat'}`,
            width: 'min(400px, 90vw)',
            buttons: [
                {
                    text: continueButtonText,
                    primary: true,
                    onClick: () => this.restartGame()
                },
                {
                    text: '🏠 Main Menu',
                    onClick: () => this.exitToMainMenu()
                }
            ]
        });

        await modalManager.showModal('gameOverModal');
    }

    /**
     * Create game over modal content
     * @returns {HTMLElement} Modal content element
     */
    createGameOverContent() {
        const { condition, winner, type, round, playerYards, enemyYards } = this.gameOverData;
        
        const container = document.createElement('div');
        container.className = 'game-over-content';
        
        // Get appropriate messages
        const titleMessage = this.getTitleMessage(condition);
        const descMessage = this.getDescriptionMessage(condition);
        
        container.innerHTML = `
            <div class="game-over-header">
                <div class="game-over-icon ${winner === 'player' ? 'victory-icon' : 'defeat-icon'}">
                    ${this.getGameOverIcon(condition)}
                </div>
                <h3 class="game-over-title">${titleMessage}</h3>
                <p class="game-over-description">${descMessage}</p>
            </div>
            
            <div class="game-over-stats">
                <div class="stat-row">
                    <span class="stat-label">Final Score:</span>
                    <span class="stat-value">You: ${playerYards}/100 - Enemy: ${enemyYards}/100</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Rounds Played:</span>
                    <span class="stat-value">${round}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Victory Type:</span>
                    <span class="stat-value">${type === 'touchdown' ? 'Touchdown' : 'Safety'}</span>
                </div>
            </div>
        `;

        // Add styling
        container.style.cssText = `
            text-align: center;
            padding: 20px 0;
        `;

        return container;
    }

    /**
     * Get game over icon based on condition
     * @param {string} condition - Game over condition
     * @returns {string} Icon emoji
     */
    getGameOverIcon(condition) {
        const icons = {
            [GAME_OVER_CONDITIONS.PLAYER_TOUCHDOWN]: '🏆',
            [GAME_OVER_CONDITIONS.ENEMY_TOUCHDOWN]: '💀',
            [GAME_OVER_CONDITIONS.PLAYER_SAFETY]: '🛡️',
            [GAME_OVER_CONDITIONS.ENEMY_SAFETY]: '⚠️'
        };
        return icons[condition] || '🎮';
    }

    /**
     * Get title message for condition
     * @param {string} condition - Game over condition
     * @returns {string} Title message
     */
    getTitleMessage(condition) {
        const messages = {
            [GAME_OVER_CONDITIONS.PLAYER_TOUCHDOWN]: GAME_OVER_MESSAGES.PLAYER_TOUCHDOWN,
            [GAME_OVER_CONDITIONS.ENEMY_TOUCHDOWN]: GAME_OVER_MESSAGES.ENEMY_TOUCHDOWN,
            [GAME_OVER_CONDITIONS.PLAYER_SAFETY]: GAME_OVER_MESSAGES.PLAYER_SAFETY,
            [GAME_OVER_CONDITIONS.ENEMY_SAFETY]: GAME_OVER_MESSAGES.ENEMY_SAFETY
        };
        return messages[condition] || 'Game Over';
    }

    /**
     * Get description message for condition
     * @param {string} condition - Game over condition
     * @returns {string} Description message
     */
    getDescriptionMessage(condition) {
        const messages = {
            [GAME_OVER_CONDITIONS.PLAYER_TOUCHDOWN]: GAME_OVER_MESSAGES.PLAYER_TOUCHDOWN_DESC,
            [GAME_OVER_CONDITIONS.ENEMY_TOUCHDOWN]: GAME_OVER_MESSAGES.ENEMY_TOUCHDOWN_DESC,
            [GAME_OVER_CONDITIONS.PLAYER_SAFETY]: GAME_OVER_MESSAGES.PLAYER_SAFETY_DESC,
            [GAME_OVER_CONDITIONS.ENEMY_SAFETY]: GAME_OVER_MESSAGES.ENEMY_SAFETY_DESC
        };
        return messages[condition] || 'The game has ended.';
    }

    /**
     * Restart the game
     */
    async restartGame() {
        await modalManager.hideModal('gameOverModal');
        modalManager.destroyModal('gameOverModal');
        
        // Pass the battle result to the restart handler
        const playerWon = this.gameOverData.winner === 'player';
        
        if (this.onGameRestart) {
            this.onGameRestart(playerWon);
        }
        
        this.resetGameOverState();
        
        // Show contextual message based on win/loss and battle context
        let message;
        if (playerWon) {
            const currentBattle = window.nflApp?.screenManager?.getCurrentBattle();
            const isFinalBattle = currentBattle?.id === 'superbowl';
            message = isFinalBattle ? 'New season started!' : 'Next battle awaits!';
        } else {
            message = 'Season restarted!';
        }
        messageSystem.showSuccess(message, { duration: 1500 });
    }

    /**
     * Exit to main menu
     */
    async exitToMainMenu() {
        await modalManager.hideModal('gameOverModal');
        modalManager.destroyModal('gameOverModal');
        
        this.resetGameOverState();
        
        if (this.onGameExit) {
            this.onGameExit();
        }
    }

    /**
     * Reset game over state
     */
    resetGameOverState() {
        this.isGameOver = false;
        this.gameOverData = null;
    }

    /**
     * Set game restart callback
     * @param {Function} callback - Callback function for game restart
     */
    setOnGameRestart(callback) {
        this.onGameRestart = callback;
    }

    /**
     * Set game exit callback
     * @param {Function} callback - Callback function for exiting to main menu
     */
    setOnGameExit(callback) {
        this.onGameExit = callback;
    }

    /**
     * Check if game is currently over
     * @returns {boolean} True if game is over
     */
    getIsGameOver() {
        return this.isGameOver;
    }

    /**
     * Get current game over data
     * @returns {Object|null} Game over data or null
     */
    getGameOverData() {
        return this.gameOverData;
    }

    /**
     * Force end game (for testing or special conditions)
     * @param {string} condition - Game over condition
     * @param {Object} gameState - Current game state
     */
    forceGameOver(condition, gameState = {}) {
        const winner = condition.includes('player') && !condition.includes('enemy_safety') ? 'player' : 'enemy';
        const type = condition.includes('touchdown') ? 'touchdown' : 'safety';
        
        const gameOverResult = {
            isGameOver: true,
            winner,
            condition,
            type
        };
        
        this.handleGameOver(gameOverResult, gameState);
    }
}

// Global game over manager instance
export const gameOverManager = new GameOverManager();

// Add CSS for game over modal styling
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .game-over-modal.victory .modal-content {
            border: 3px solid #4CAF50;
            box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
        }

        .game-over-modal.defeat .modal-content {
            border: 3px solid #f44336;
            box-shadow: 0 0 20px rgba(244, 67, 54, 0.3);
        }

        .game-over-header {
            margin-bottom: 20px;
        }

        .game-over-icon {
            font-size: 3rem;
            margin-bottom: 10px;
        }

        .victory-icon {
            animation: victoryBounce 1s ease-in-out infinite alternate;
        }

        .defeat-icon {
            animation: defeatShake 0.5s ease-in-out;
        }

        .game-over-title {
            margin: 10px 0;
            font-size: 1.5rem;
            font-weight: bold;
        }

        .game-over-description {
            color: #666;
            margin: 0;
            font-size: 1rem;
        }

        .game-over-stats {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }

        .stat-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
        }

        .stat-row:last-child {
            border-bottom: none;
        }

        .stat-label {
            font-weight: bold;
            color: #333;
        }

        .stat-value {
            color: #666;
        }

        @keyframes victoryBounce {
            from { transform: scale(1); }
            to { transform: scale(1.1); }
        }

        @keyframes defeatShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(styleSheet);
}