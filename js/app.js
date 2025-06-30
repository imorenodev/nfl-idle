// app.js - Main application entry point with screen management
import { TitleScreen } from './screens/TitleScreen.js';
import { TeamDeckDraftScreen } from './screens/TeamDeckDraftScreen.js';
import { GeneralDraftScreen } from './screens/GeneralDraftScreen.js';
import { GameMapScreen } from './screens/GameMapScreen.js';
import { ScreenManager } from './core/ScreenManager.js';
import { SCREENS } from './core/GameConstants.js';

// Set CSS custom property for viewport height to handle mobile browser bars
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initial set
setVH();

// Re-calculate on resize
window.addEventListener('resize', setVH);

// Re-calculate on orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 100);
});

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

        // Create team deck draft screen
        const teamDraftScreen = new TeamDeckDraftScreen(this.screenManager);
        const teamDraftContainer = teamDraftScreen.create();
        document.body.appendChild(teamDraftContainer);
        this.screenManager.registerScreen(SCREENS.TEAM_DRAFT, teamDraftScreen);

        // Create general draft screen
        const generalDraftScreen = new GeneralDraftScreen(this.screenManager);
        const generalDraftContainer = generalDraftScreen.create();
        document.body.appendChild(generalDraftContainer);
        this.screenManager.registerScreen(SCREENS.GENERAL_DRAFT, generalDraftScreen);

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
        
        // Get drafted deck if available
        const draftedDeck = this.screenManager.getDraftedDeck();
        this.gameState = new GameState(draftedDeck.length > 0 ? draftedDeck : null);
        
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
        console.log(`🎮 handlePlayAgain called with playerWon: ${playerWon}`);
        
        const mapScreen = this.screenManager.screens.get(SCREENS.GAME_MAP);
        const currentBattle = this.screenManager.getCurrentBattle();
        
        console.log(`🎮 Map screen found:`, !!mapScreen);
        console.log(`🎮 Current battle:`, currentBattle);
        
        if (mapScreen && currentBattle) {
            if (playerWon) {
                // Check if this was the Super Bowl (final battle)
                const isFinalBattle = currentBattle.id === 'superbowl';
                console.log(`🎮 Is final battle (Super Bowl):`, isFinalBattle);
                
                if (isFinalBattle) {
                    // Player won Super Bowl - show celebration then reset for new season
                    console.log(`🏆 Calling mapScreen.onBattleCompleted for Super Bowl victory`);
                    mapScreen.onBattleCompleted(currentBattle.id, true); // This shows celebration
                    setTimeout(() => {
                        console.log(`🏆 Resetting progression after Super Bowl celebration`);
                        mapScreen.resetProgression(); // Reset after brief celebration
                    }, 2000);
                    console.log(`Player won Super Bowl - championship celebration then new season`);
                } else {
                    // Regular battle win - advance to next battle
                    console.log(`✅ Calling mapScreen.onBattleCompleted for regular battle victory: ${currentBattle.id}`);
                    mapScreen.onBattleCompleted(currentBattle.id, true);
                    console.log(`Player won battle ${currentBattle.id} - next battle should be unlocked`);
                }
            } else {
                // Player lost - reset progression back to game 1
                console.log(`❌ Calling mapScreen.resetProgression for loss`);
                mapScreen.resetProgression();
                console.log(`Player lost battle ${currentBattle.id} - progression reset to game 1`);
            }
        } else {
            console.error(`🚨 Missing required objects: mapScreen=${!!mapScreen}, currentBattle=${!!currentBattle}`);
        }
        
        // Return to game map
        console.log(`🎮 Returning to game map screen`);
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
        } else if (newScreen === SCREENS.GAME_MAP) {
            // Setup game map with player team data
            const playerTeam = this.screenManager.getPlayerTeam();
            const gameMapScreen = this.screenManager.screens.get(SCREENS.GAME_MAP);
            
            if (playerTeam && gameMapScreen) {
                // Only initialize if the team hasn't been set yet or if it's a different team
                if (!gameMapScreen.playerTeam || gameMapScreen.playerTeam.id !== playerTeam.id) {
                    gameMapScreen.setPlayerTeam(playerTeam);
                    console.log(`Game map initialized for team: ${playerTeam.name}`);
                } else {
                    console.log(`Game map already initialized for team: ${playerTeam.name}, preserving progress`);
                }
            } else {
                console.warn('Missing player team data or game map screen for initialization');
            }
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