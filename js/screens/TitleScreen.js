// TitleScreen.js - Main title screen with play button
import { SCREENS } from '../core/GameConstants.js';

export class TitleScreen {
    constructor(screenManager) {
        this.screenManager = screenManager;
        this.container = null;
    }

    create() {
        this.container = document.createElement('div');
        this.container.className = 'title-screen';
        this.container.innerHTML = `
            <div class="title-content">
                <div class="game-logo">
                    <h1 class="game-title">NFL CARD BATTLE</h1>
                    <p class="game-subtitle">Conquer the NFL with your ultimate team</p>
                </div>
                
                <div class="title-menu">
                    <button class="menu-button play-button" id="playButton">
                        <span class="button-text">PLAY</span>
                        <span class="button-icon">🏈</span>
                    </button>
                </div>
                
                <div class="title-footer">
                    <p class="version-text">Build and battle your way to the Super Bowl!</p>
                </div>
            </div>
        `;

        this.setupEventListeners();
        return this.container;
    }

    setupEventListeners() {
        const playButton = this.container.querySelector('#playButton');
        playButton.addEventListener('click', () => {
            this.onPlayClicked();
        });
    }

    onPlayClicked() {
        // Show team selection modal
        this.screenManager.showTeamSelectionModal();
    }

    show() {
        if (this.container) {
            this.container.style.display = 'flex';
            // Add entrance animation
            setTimeout(() => {
                this.container.classList.add('screen-enter');
            }, 50);
        }
    }

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
            this.container.classList.remove('screen-enter');
        }
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
    }
}