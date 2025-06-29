// app.js - Main application entry point with screen management
import { TitleScreen } from './screens/TitleScreen.js';
import { GameMapScreen } from './screens/GameMapScreen.js';
import { ScreenManager } from './core/ScreenManager.js';
import { SCREENS } from './core/GameConstants.js';

class NFLCardBattleApp {
    constructor() {
        this.screenManager = new ScreenManager();
        this.gameContainer = null;
        this.gameState = null;
    }

    async init() {
        console.log('Initializing NFL Card Battle App...');
        
        // Get the game container and hide it initially
        this.gameContainer = document.querySelector('.game-container');
        if (this.gameContainer) {
            this.gameContainer.style.display = 'none';
        }

        // Create and register screens
        await this.setupScreens();
        
        // Set up screen change handler
        this.screenManager.setOnScreenChange((newScreen, oldScreen) => {
            this.handleScreenChange(newScreen, oldScreen);
        });

        // Start with title screen
        await this.screenManager.initialize(SCREENS.TITLE);
        
        console.log('App initialized successfully');
    }

    async setupScreens() {
        // Create title screen
        const titleScreen = new TitleScreen(this.screenManager);
        const titleContainer = titleScreen.create();
        document.body.appendChild(titleContainer);
        this.screenManager.registerScreen(SCREENS.TITLE, titleScreen);

        // Create game map screen
        const gameMapScreen = new GameMapScreen(this.screenManager);
        const mapContainer = gameMapScreen.create();
        document.body.appendChild(mapContainer);
        this.screenManager.registerScreen(SCREENS.GAME_MAP, gameMapScreen);

        // The battle screen will be the existing game container
        const battleScreen = {
            show: () => this.showBattleScreen(),
            hide: () => this.hideBattleScreen()
        };
        this.screenManager.registerScreen(SCREENS.BATTLE, battleScreen);
    }

    async showBattleScreen() {
        // Hide other screens
        const titleScreen = this.screenManager.screens.get(SCREENS.TITLE);
        const mapScreen = this.screenManager.screens.get(SCREENS.GAME_MAP);
        
        if (titleScreen) titleScreen.hide();
        if (mapScreen) mapScreen.hide();

        // Show game container
        if (this.gameContainer) {
            this.gameContainer.style.display = 'flex';
        }

        // Initialize the game if not already done
        if (!this.gameState) {
            await this.initializeGame();
        } else {
            // Reset for new battle
            this.gameState.setupForNewBattle();
        }
    }

    async hideBattleScreen() {
        if (this.gameContainer) {
            this.gameContainer.style.display = 'none';
        }
    }

    async initializeGame() {
        // Dynamically import the game when needed
        const { GameState } = await import('./game.js');
        this.gameState = new GameState();
        
        // Initialize the game first
        this.gameState.init();
        
        // Then set up game over manager callbacks
        this.setupGameOverCallbacks();
    }

    setupGameOverCallbacks() {
        // Set up callbacks for game over manager (accessed through GameState)
        if (this.gameState && this.gameState.gameOverManager) {
            this.gameState.gameOverManager.setOnGameRestart((playerWon) => {
                this.handlePlayAgain(playerWon);
            });
            
            this.gameState.gameOverManager.setOnGameExit(() => {
                this.handleReturnToMenu();
            });
            
            console.log('Game over callbacks set up successfully');
        } else {
            console.warn('Could not set up game over callbacks - gameOverManager not found');
        }
    }

    handlePlayAgain(playerWon) {
        const mapScreen = this.screenManager.screens.get(SCREENS.GAME_MAP);
        const currentBattle = this.screenManager.getCurrentBattle();
        
        if (mapScreen && currentBattle) {
            if (playerWon) {
                // Check if this was the Super Bowl (final battle)
                const isFinalBattle = currentBattle.id === 'superbowl';
                
                if (isFinalBattle) {
                    // Player won Super Bowl - show celebration then reset for new season
                    mapScreen.onBattleCompleted(currentBattle.id, true); // This shows celebration
                    setTimeout(() => {
                        mapScreen.resetProgression(); // Reset after brief celebration
                    }, 2000);
                    console.log(`Player won Super Bowl - championship celebration then new season`);
                } else {
                    // Regular battle win - advance to next battle
                    mapScreen.onBattleCompleted(currentBattle.id, true);
                    console.log(`Player won battle ${currentBattle.id} - next battle unlocked`);
                }
            } else {
                // Player lost - reset progression back to game 1
                mapScreen.resetProgression();
                console.log(`Player lost battle ${currentBattle.id} - progression reset to game 1`);
            }
        }
        
        // Return to game map
        this.screenManager.showScreen(SCREENS.GAME_MAP);
        console.log('Player chose to play again - returning to game map');
    }

    handleReturnToMenu() {
        // Clear all game state and return to title screen
        this.gameState = null;
        this.screenManager.showScreen(SCREENS.TITLE);
        console.log('Player chose main menu - returning to title screen');
    }

    handleBattleComplete(won) {
        // This method is no longer used - game over is now handled by GameOverManager
        // But keeping it for any edge cases where direct completion is needed
        console.log('Battle completed directly:', won ? 'Won' : 'Lost');
    }

    handleScreenChange(newScreen, oldScreen) {
        console.log(`Screen changed: ${oldScreen} -> ${newScreen}`);
        
        // Handle any screen-specific logic here
        if (newScreen === SCREENS.BATTLE) {
            // Prepare for battle
            const playerTeam = this.screenManager.getPlayerTeam();
            const currentBattle = this.screenManager.getCurrentBattle();
            console.log(`Starting battle: ${playerTeam?.name} vs ${currentBattle?.team?.name}`);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const app = new NFLCardBattleApp();
    await app.init();
    
    // Make app globally accessible for debugging
    window.nflApp = app;
});