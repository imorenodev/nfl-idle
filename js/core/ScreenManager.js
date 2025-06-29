// ScreenManager.js - Handles navigation between different screens

import { SCREENS } from './GameConstants.js';
import { NFLTeams } from '../data/NFLTeams.js';

/**
 * ScreenManager handles navigation and screen state management
 */
export class ScreenManager {
    constructor() {
        this.currentScreen = null;
        this.screens = new Map();
        this.screenHistory = [];
        this.onScreenChange = null;
        this.playerTeam = null;
        this.currentBattle = null;
        this.draftedCards = [];  // Cards selected from favorite team (3 cards)
        this.draftedDeck = [];   // Complete drafted deck (25 cards)
        this.gameProgress = {
            wins: 0,
            losses: 0,
            currentSeason: 1
        };
    }

    /**
     * Register a screen with the manager
     * @param {string} screenId - Unique identifier for the screen
     * @param {Object} screenInstance - Screen instance with show/hide methods
     */
    registerScreen(screenId, screenInstance) {
        if (!screenInstance.show || !screenInstance.hide) {
            throw new Error(`Screen ${screenId} must have show() and hide() methods`);
        }
        this.screens.set(screenId, screenInstance);
    }

    /**
     * Navigate to a specific screen
     * @param {string} screenId - Screen to navigate to
     * @param {Object} data - Optional data to pass to the screen
     * @param {boolean} addToHistory - Whether to add to navigation history
     */
    async navigateTo(screenId, data = null, addToHistory = true) {
        if (!this.screens.has(screenId)) {
            throw new Error(`Screen ${screenId} is not registered`);
        }

        const previousScreen = this.currentScreen;
        const targetScreen = this.screens.get(screenId);

        // Hide current screen if exists
        if (previousScreen && this.screens.has(previousScreen)) {
            await this.screens.get(previousScreen).hide();
        }

        // Add to history
        if (addToHistory && previousScreen) {
            this.screenHistory.push(previousScreen);
        }

        // Show new screen
        this.currentScreen = screenId;
        await targetScreen.show(data);

        // Fire screen change event
        if (this.onScreenChange) {
            this.onScreenChange(screenId, previousScreen, data);
        }

        console.log(`Navigated to screen: ${screenId}`);
    }

    /**
     * Go back to the previous screen
     */
    async goBack() {
        if (this.screenHistory.length === 0) {
            console.warn('No screen history to go back to');
            return;
        }

        const previousScreen = this.screenHistory.pop();
        await this.navigateTo(previousScreen, null, false);
    }

    /**
     * Clear navigation history
     */
    clearHistory() {
        this.screenHistory = [];
    }

    /**
     * Get current screen ID
     * @returns {string|null} Current screen ID
     */
    getCurrentScreen() {
        return this.currentScreen;
    }

    /**
     * Check if a screen is registered
     * @param {string} screenId - Screen ID to check
     * @returns {boolean} True if screen is registered
     */
    hasScreen(screenId) {
        return this.screens.has(screenId);
    }

    /**
     * Get all registered screen IDs
     * @returns {Array} Array of screen IDs
     */
    getAllScreenIds() {
        return Array.from(this.screens.keys());
    }

    /**
     * Set screen change callback
     * @param {Function} callback - Callback function (newScreen, oldScreen, data) => void
     */
    setOnScreenChange(callback) {
        this.onScreenChange = callback;
    }

    /**
     * Initialize the screen manager with a starting screen
     * @param {string} startingScreen - Initial screen to show
     * @param {Object} data - Optional data for initial screen
     */
    async initialize(startingScreen = SCREENS.TITLE, data = null) {
        if (!this.screens.has(startingScreen)) {
            throw new Error(`Starting screen ${startingScreen} is not registered`);
        }

        this.currentScreen = startingScreen;
        await this.screens.get(startingScreen).show(data);
        
        console.log(`ScreenManager initialized with screen: ${startingScreen}`);
    }

    /**
     * Preload screens (useful for heavy screens)
     * @param {Array} screenIds - Array of screen IDs to preload
     */
    async preloadScreens(screenIds) {
        for (const screenId of screenIds) {
            if (this.screens.has(screenId)) {
                const screen = this.screens.get(screenId);
                if (screen.preload) {
                    await screen.preload();
                }
            }
        }
    }

    /**
     * Hide all screens
     */
    async hideAllScreens() {
        for (const [screenId, screen] of this.screens) {
            if (screen.isVisible && screen.isVisible()) {
                await screen.hide();
            }
        }
        this.currentScreen = null;
    }

    /**
     * Show team selection modal
     */
    showTeamSelectionModal() {
        const modal = this.createTeamSelectionModal();
        document.body.appendChild(modal);
    }

    /**
     * Create team selection modal
     */
    createTeamSelectionModal() {
        const modal = document.createElement('div');
        modal.className = 'team-selection-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Choose Your NFL Team</h2>
                    <button class="close-modal" id="closeTeamModal">×</button>
                </div>
                <div class="modal-body">
                    <div class="conference-tabs">
                        <button class="tab-button active" data-conference="AFC">AFC</button>
                        <button class="tab-button" data-conference="NFC">NFC</button>
                    </div>
                    <div class="teams-grid" id="teamsGrid">
                        <!-- Teams will be populated here -->
                    </div>
                </div>
            </div>
        `;

        this.setupTeamModalEvents(modal);
        this.populateTeams(modal, 'AFC');
        return modal;
    }

    /**
     * Setup team selection modal events
     */
    setupTeamModalEvents(modal) {
        // Close modal
        const closeBtn = modal.querySelector('#closeTeamModal');
        const overlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', () => this.closeTeamModal(modal));
        overlay.addEventListener('click', () => this.closeTeamModal(modal));

        // Conference tabs
        const tabs = modal.querySelectorAll('.tab-button');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.populateTeams(modal, tab.dataset.conference);
            });
        });
    }

    /**
     * Populate teams in the modal
     */
    populateTeams(modal, conference) {
        const grid = modal.querySelector('#teamsGrid');
        const teams = NFLTeams.getTeamsByConference(conference);
        
        grid.innerHTML = teams.map(team => `
            <div class="team-card" data-team-id="${team.id}">
                <div class="team-logo" style="background-color: ${team.primaryColor}">
                    ${team.abbreviation}
                </div>
                <div class="team-name">${team.name}</div>
            </div>
        `).join('');

        // Add click handlers
        grid.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('click', () => {
                const teamId = card.dataset.teamId;
                this.selectTeam(teamId);
                this.closeTeamModal(modal);
            });
        });
    }

    /**
     * Select a team and proceed to team draft
     */
    selectTeam(teamId) {
        this.playerTeam = NFLTeams.getTeamById(teamId);
        this.navigateTo(SCREENS.TEAM_DRAFT);
        
        // Pass team data to team draft screen
        if (this.screens.has(SCREENS.TEAM_DRAFT)) {
            this.screens.get(SCREENS.TEAM_DRAFT).setSelectedTeam(this.playerTeam);
        }
    }

    /**
     * Close team selection modal
     */
    closeTeamModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }

    /**
     * Set current battle context
     */
    setCurrentBattle(battle) {
        this.currentBattle = battle;
    }

    /**
     * Get current battle
     */
    getCurrentBattle() {
        return this.currentBattle;
    }

    /**
     * Get player team
     */
    getPlayerTeam() {
        return this.playerTeam;
    }

    /**
     * Update game progress
     */
    updateProgress(won) {
        if (won) {
            this.gameProgress.wins++;
        } else {
            this.gameProgress.losses++;
        }
    }

    /**
     * Get game progress
     */
    getProgress() {
        return { ...this.gameProgress };
    }

    /**
     * Set drafted cards from team selection
     */
    setDraftedCards(cards) {
        this.draftedCards = [...cards];
        console.log('Team draft cards set:', this.draftedCards.map(c => c.name));
    }

    /**
     * Get drafted team cards
     */
    getDraftedCards() {
        return [...this.draftedCards];
    }

    /**
     * Set complete drafted deck
     */
    setDraftedDeck(deck) {
        this.draftedDeck = [...deck];
        console.log('Complete drafted deck set:', this.draftedDeck.length, 'cards');
    }

    /**
     * Get complete drafted deck
     */
    getDraftedDeck() {
        return [...this.draftedDeck];
    }

    /**
     * Clear draft data (for new season)
     */
    clearDraftData() {
        this.draftedCards = [];
        this.draftedDeck = [];
        this.playerTeam = null;
    }

    /**
     * Show screen with simplified interface
     */
    showScreen(screenId, data = null) {
        this.navigateTo(screenId, data);
    }
}

/**
 * Base Screen class that all screens should extend
 */
export class BaseScreen {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = null;
        this.isShown = false;
    }

    /**
     * Initialize the screen (called once)
     */
    async init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            throw new Error(`Container with ID ${this.containerId} not found`);
        }
    }

    /**
     * Show the screen
     * @param {Object} data - Optional data passed from navigation
     */
    async show(data = null) {
        if (!this.container) {
            await this.init();
        }
        
        this.container.style.display = 'block';
        this.isShown = true;
        
        if (this.onShow) {
            await this.onShow(data);
        }
    }

    /**
     * Hide the screen
     */
    async hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
        this.isShown = false;
        
        if (this.onHide) {
            await this.onHide();
        }
    }

    /**
     * Check if screen is currently visible
     * @returns {boolean}
     */
    isVisible() {
        return this.isShown;
    }

    /**
     * Cleanup screen resources
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.isShown = false;
    }

    // Override these methods in subclasses
    async onShow(data) {
        // Override in subclass
    }

    async onHide() {
        // Override in subclass
    }

    async preload() {
        // Override in subclass if needed
    }
}

// Global screen manager instance
export const screenManager = new ScreenManager();