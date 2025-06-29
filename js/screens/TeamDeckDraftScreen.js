// TeamDeckDraftScreen.js - Team-specific draft screen for picking 3 favorite team cards

import { SCREENS } from '../core/GameConstants.js';
import { getTeamPlayers } from '../data/NFLRosters.js';

export class TeamDeckDraftScreen {
    constructor(screenManager) {
        this.screenManager = screenManager;
        this.container = null;
        this.selectedTeam = null;
        this.teamPlayers = [];
        this.selectedCards = [];
        this.maxSelections = 3;
    }

    create() {
        this.container = document.createElement('div');
        this.container.className = 'team-draft-screen';
        this.container.innerHTML = `
            <div class="draft-content-scrollable">
                <div class="draft-header">
                    <div class="team-info" id="teamInfo">
                        <div class="team-logo" id="teamLogo"></div>
                        <div class="team-details">
                            <h1 id="teamName">Team Draft</h1>
                            <p class="draft-instructions">Choose 3 players from your favorite team</p>
                        </div>
                    </div>
                    
                    <div class="draft-progress">
                        <span class="progress-text">
                            Selected: <span id="selectedCount">0</span>/${this.maxSelections}
                        </span>
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill"></div>
                        </div>
                    </div>
                </div>

                <div class="team-players-grid" id="teamPlayersGrid">
                    <!-- Team players will be rendered here -->
                </div>

                <div class="draft-footer">
                    <button class="draft-button confirm-button" id="confirmButton" disabled>
                        Continue to General Draft →
                    </button>
                    <button class="draft-button back-button" id="backButton">
                        ← Back
                    </button>
                </div>
            </div>
        `;

        this.setupEventListeners();
        return this.container;
    }

    setupEventListeners() {
        const backButton = this.container.querySelector('#backButton');
        const confirmButton = this.container.querySelector('#confirmButton');

        backButton.addEventListener('click', () => {
            this.screenManager.showScreen(SCREENS.TITLE);
        });

        confirmButton.addEventListener('click', () => {
            if (this.selectedCards.length === this.maxSelections) {
                this.confirmTeamSelection();
            }
        });
    }

    setSelectedTeam(teamData) {
        this.selectedTeam = teamData;
        this.teamPlayers = getTeamPlayers(teamData.abbreviation);
        this.selectedCards = [];
        
        this.updateTeamDisplay();
        this.renderTeamPlayers();
        this.updateProgress();
    }

    updateTeamDisplay() {
        if (!this.selectedTeam) return;
        
        const teamLogo = this.container.querySelector('#teamLogo');
        const teamName = this.container.querySelector('#teamName');
        
        teamLogo.style.backgroundColor = this.selectedTeam.primaryColor;
        teamLogo.textContent = this.selectedTeam.abbreviation;
        teamName.textContent = `${this.selectedTeam.name} Draft`;
    }

    renderTeamPlayers() {
        const grid = this.container.querySelector('#teamPlayersGrid');
        grid.innerHTML = '';

        this.teamPlayers.forEach(player => {
            const playerCard = this.createPlayerCard(player);
            grid.appendChild(playerCard);
        });
    }

    createPlayerCard(player) {
        const cardElement = document.createElement('div');
        cardElement.className = 'draft-player-card';
        cardElement.dataset.playerId = player.id;

        // Get position color for styling
        const positionColor = this.getPositionColor(player.position);

        cardElement.innerHTML = `
            <div class="player-card-header">
                <div class="player-cost">${player.cost}</div>
                <div class="player-position" style="background-color: ${positionColor}">${player.position}</div>
                <div class="player-rarity">${player.rarity}</div>
            </div>
            
            <div class="player-image">
                <img src="./assets/images/${player.position.toLowerCase()}.png" 
                     alt="${player.name} (${player.position})" 
                     class="player-photo"
                     loading="lazy"
                     onerror="this.src='./assets/images/mahomes-profile.png'; this.onerror=null;">
            </div>
            
            <div class="player-name">${player.name}</div>
            
            <div class="player-stats">
                <div class="stat-row">
                    <span class="stat-label">Rush:</span>
                    <span class="stat-value">${player.rushOffense}/${player.rushDefense}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Pass:</span>
                    <span class="stat-value">${player.passOffense}/${player.passDefense}</span>
                </div>
            </div>
            
            <div class="selection-overlay">
                <div class="selection-check">✓</div>
            </div>
        `;

        cardElement.addEventListener('click', () => {
            this.togglePlayerSelection(player, cardElement);
        });

        return cardElement;
    }

    getPositionColor(position) {
        const positionColors = {
            'QB': '#FF6B6B',  // Red
            'RB': '#4ECDC4',  // Teal 
            'WR': '#45B7D1',  // Blue
            'TE': '#96CEB4',  // Green
            'DE': '#FECA57',  // Yellow
            'DT': '#FF9FF3',  // Pink
            'LB': '#F38BA8',  // Light Pink
            'S': '#A8DADC',   // Light Blue
            'CB': '#457B9D'   // Dark Blue
        };
        return positionColors[position] || '#888';
    }

    togglePlayerSelection(player, cardElement) {
        const isSelected = this.selectedCards.some(card => card.id === player.id);
        
        if (isSelected) {
            // Deselect
            this.selectedCards = this.selectedCards.filter(card => card.id !== player.id);
            cardElement.classList.remove('selected');
        } else {
            // Select (if under limit)
            if (this.selectedCards.length < this.maxSelections) {
                this.selectedCards.push(player);
                cardElement.classList.add('selected');
            } else {
                this.showMessage('You can only select 3 players from your team!');
                return;
            }
        }
        
        this.updateProgress();
    }

    updateProgress() {
        const selectedCount = this.container.querySelector('#selectedCount');
        const progressFill = this.container.querySelector('#progressFill');
        const confirmButton = this.container.querySelector('#confirmButton');
        
        selectedCount.textContent = this.selectedCards.length;
        
        const progressPercent = (this.selectedCards.length / this.maxSelections) * 100;
        progressFill.style.width = `${progressPercent}%`;
        
        // Enable confirm button when exactly 3 cards selected
        const canConfirm = this.selectedCards.length === this.maxSelections;
        confirmButton.disabled = !canConfirm;
        confirmButton.classList.toggle('enabled', canConfirm);
    }

    confirmTeamSelection() {
        if (this.selectedCards.length !== this.maxSelections) return;
        
        // Store the selected team cards for the general draft
        this.screenManager.setDraftedCards(this.selectedCards);
        
        // Proceed to general draft
        this.screenManager.showScreen(SCREENS.GENERAL_DRAFT);
        
        console.log('Team draft completed:', this.selectedCards.map(c => c.name));
    }

    showMessage(text) {
        // Simple message display - could be enhanced with modal system
        const message = document.createElement('div');
        message.className = 'draft-message';
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: bold;
            z-index: 2000;
            font-size: clamp(12px, 3vw, 16px);
            max-width: 90vw;
            text-align: center;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 2000);
    }

    show() {
        if (this.container) {
            this.container.style.display = 'flex';
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