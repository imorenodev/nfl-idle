// ScreenManager.js - Handles navigation between different screens

import { SCREENS } from './GameConstants.js';

/**
 * ScreenManager handles navigation and screen state management
 */
export class ScreenManager {
    constructor() {
        this.currentScreen = null;
        this.screens = new Map();
        this.screenHistory = [];
        this.onScreenChange = null;
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