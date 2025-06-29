// GeneralDraftScreen.js - General draft screen for picking remaining 22 cards from all teams

import { SCREENS } from '../core/GameConstants.js';
import { getRandomDraftChoices } from '../data/NFLRosters.js';

export class GeneralDraftScreen {
    constructor(screenManager) {
        this.screenManager = screenManager;
        this.container = null;
        this.draftedCards = [];
        this.currentChoices = [];
        this.targetDeckSize = 25;
        this.currentRound = 1;
        this.maxRounds = 22; // 25 total - 3 team cards = 22 rounds
    }

    create() {
        this.container = document.createElement('div');
        this.container.className = 'general-draft-screen';
        this.container.innerHTML = `
            <div class="draft-header">
                <div class="draft-title">
                    <h1>General Draft</h1>
                    <p class="draft-subtitle">Build your 25-card deck</p>
                </div>
                
                <div class="draft-progress">
                    <div class="deck-status">
                        <span class="deck-count" id="deckCount">${this.draftedCards.length}/${this.targetDeckSize}</span>
                        <span class="round-info">Round <span id="currentRound">${this.currentRound}</span>/${this.maxRounds}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                </div>
            </div>

            <div class="draft-instruction" id="draftInstruction">
                Choose 1 card from the 3 options below:
            </div>

            <div class="draft-choices" id="draftChoices">
                <!-- Draft choices will be rendered here -->
            </div>

            <div class="drafted-deck-preview">
                <h3>Your Deck Preview</h3>
                <div class="deck-summary" id="deckSummary">
                    <!-- Deck composition summary -->
                </div>
            </div>

            <div class="draft-footer">
                <div class="draft-options" id="draftOptions">
                    <button class="draft-button auto-draft-button" id="autoDraftButton">
                        🎲 Auto-Draft Remaining
                    </button>
                    <button class="draft-button manual-draft-button" id="manualDraftButton">
                        ✋ Continue Manual Draft
                    </button>
                </div>
                <button class="draft-button complete-button" id="completeDraftButton" style="display: none;">
                    Complete Draft & Start Season →
                </button>
                <button class="draft-button back-button" id="backButton">
                    ← Back to Team Draft
                </button>
            </div>
        `;

        this.setupEventListeners();
        return this.container;
    }

    setupEventListeners() {
        const backButton = this.container.querySelector('#backButton');
        const completeDraftButton = this.container.querySelector('#completeDraftButton');
        const autoDraftButton = this.container.querySelector('#autoDraftButton');
        const manualDraftButton = this.container.querySelector('#manualDraftButton');

        backButton.addEventListener('click', () => {
            this.screenManager.showScreen(SCREENS.TEAM_DRAFT);
        });

        completeDraftButton.addEventListener('click', () => {
            this.completeDraft();
        });

        autoDraftButton.addEventListener('click', () => {
            this.autoDraftRemaining();
        });

        manualDraftButton.addEventListener('click', () => {
            this.hideDraftOptions();
            this.startNextRound();
        });
    }

    initializeDraft(existingDraftedCards = []) {
        this.draftedCards = [...existingDraftedCards];
        this.currentRound = this.draftedCards.length - 2; // -3 for team cards, +1 for 1-based indexing
        
        if (this.currentRound < 1) this.currentRound = 1;
        if (this.currentRound > this.maxRounds) this.currentRound = this.maxRounds;
        
        this.updateProgress();
        this.updateDeckSummary();
        
        if (this.draftedCards.length < this.targetDeckSize) {
            this.showDraftOptions();
        } else {
            this.showDraftComplete();
        }
    }

    startNextRound() {
        if (this.draftedCards.length >= this.targetDeckSize) {
            this.showDraftComplete();
            return;
        }

        // Get 3 random choices excluding already drafted cards
        const excludeIds = this.draftedCards.map(card => card.id);
        this.currentChoices = getRandomDraftChoices(excludeIds);
        
        this.renderDraftChoices();
        this.updateProgress();
    }

    renderDraftChoices() {
        const choicesContainer = this.container.querySelector('#draftChoices');
        choicesContainer.innerHTML = '';

        this.currentChoices.forEach((player, index) => {
            const choiceCard = this.createChoiceCard(player, index);
            choicesContainer.appendChild(choiceCard);
        });
    }

    createChoiceCard(player, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'draft-choice-card';
        cardElement.dataset.playerId = player.id;
        cardElement.dataset.choiceIndex = index;

        // Get position and team colors
        const positionColor = this.getPositionColor(player.position);
        const teamColor = this.getTeamColor(player.team);

        cardElement.innerHTML = `
            <div class="choice-card-header">
                <div class="player-cost">${player.cost}</div>
                <div class="player-position" style="background-color: ${positionColor}">${player.position}</div>
                <div class="player-rarity">${player.rarity}</div>
            </div>
            
            <div class="player-team" style="background-color: ${teamColor}">
                ${player.team}
            </div>
            
            <div class="player-image">
                <img src="./assets/images/${player.position.toLowerCase()}.png" 
                     alt="${player.name} (${player.position})" 
                     class="player-photo"
                     loading="lazy"
                     onerror="this.src='./assets/images/mahomes-profile.png'; this.onerror=null;">
            </div>
            
            <div class="player-name">${player.name}</div>
            <div class="team-name">${player.teamName}</div>
            
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
            
            <div class="choice-overlay">
                <div class="choice-number">${index + 1}</div>
            </div>
        `;

        cardElement.addEventListener('click', () => {
            this.selectChoice(player);
        });

        return cardElement;
    }

    selectChoice(selectedPlayer) {
        // Check if deck is already full
        if (this.draftedCards.length >= this.targetDeckSize) {
            console.warn('Draft already complete, ignoring selection');
            return;
        }
        
        // Add to drafted cards
        this.draftedCards.push(selectedPlayer);
        this.currentRound++;
        
        // Update displays
        this.updateProgress();
        this.updateDeckSummary();
        
        // Show selection feedback
        this.showChoiceSelected(selectedPlayer);
        
        console.log(`Drafted: ${selectedPlayer.name} (${selectedPlayer.position}) - Deck: ${this.draftedCards.length}/${this.targetDeckSize}`);
        
        // Check if draft is complete
        if (this.draftedCards.length >= this.targetDeckSize) {
            setTimeout(() => {
                this.showDraftComplete();
            }, 1500);
        } else {
            // Start next round after brief delay
            setTimeout(() => {
                this.startNextRound();
            }, 1500);
        }
    }

    showChoiceSelected(player) {
        const instruction = this.container.querySelector('#draftInstruction');
        instruction.innerHTML = `<span style="color: #4CAF50;">✓ Selected: ${player.name} (${player.position})</span>`;
        
        // Clear choices temporarily and disable click handlers
        const choicesContainer = this.container.querySelector('#draftChoices');
        Array.from(choicesContainer.children).forEach(card => {
            // Remove click handlers to prevent multiple selections
            card.style.pointerEvents = 'none';
            
            if (card.dataset.playerId === player.id) {
                card.classList.add('selected-choice');
            } else {
                card.style.opacity = '0.3';
            }
        });
    }

    updateProgress() {
        const deckCount = this.container.querySelector('#deckCount');
        const currentRoundSpan = this.container.querySelector('#currentRound');
        const progressFill = this.container.querySelector('#progressFill');
        const instruction = this.container.querySelector('#draftInstruction');
        
        deckCount.textContent = `${this.draftedCards.length}/${this.targetDeckSize}`;
        currentRoundSpan.textContent = this.currentRound;
        
        const progressPercent = (this.draftedCards.length / this.targetDeckSize) * 100;
        progressFill.style.width = `${progressPercent}%`;
        
        // Update instruction
        if (this.draftedCards.length < this.targetDeckSize) {
            instruction.textContent = 'Choose 1 card from the 3 options below:';
        }
    }

    updateDeckSummary() {
        const deckSummary = this.container.querySelector('#deckSummary');
        
        // Group by position
        const positionCounts = {};
        this.draftedCards.forEach(card => {
            positionCounts[card.position] = (positionCounts[card.position] || 0) + 1;
        });
        
        // Create summary HTML
        const positions = ['QB', 'RB', 'WR', 'TE', 'DE', 'DT', 'LB', 'S', 'CB'];
        const summaryHTML = positions.map(pos => {
            const count = positionCounts[pos] || 0;
            const color = this.getPositionColor(pos);
            return `<div class="position-count" style="border-left: 3px solid ${color};">
                        ${pos}: ${count}
                    </div>`;
        }).join('');
        
        deckSummary.innerHTML = summaryHTML;
    }

    showDraftComplete() {
        const instruction = this.container.querySelector('#draftInstruction');
        const choicesContainer = this.container.querySelector('#draftChoices');
        const completeDraftButton = this.container.querySelector('#completeDraftButton');
        const backButton = this.container.querySelector('#backButton');
        
        instruction.innerHTML = '<span style="color: #4CAF50; font-size: 1.2em;">🎉 Draft Complete! Review your 25-card deck below:</span>';
        
        // Show all drafted cards in the choices container
        this.renderDraftedDeck(choicesContainer);
        
        completeDraftButton.style.display = 'block';
        backButton.style.display = 'none';
    }

    completeDraft() {
        if (this.draftedCards.length < this.targetDeckSize) {
            console.warn(`Draft not complete - only ${this.draftedCards.length}/${this.targetDeckSize} cards`);
            return;
        }
        
        // Ensure we have exactly 25 cards (trim excess if any)
        if (this.draftedCards.length > this.targetDeckSize) {
            console.warn(`Too many cards (${this.draftedCards.length}), trimming to ${this.targetDeckSize}`);
            this.draftedCards = this.draftedCards.slice(0, this.targetDeckSize);
        }
        
        // Store the complete drafted deck
        this.screenManager.setDraftedDeck(this.draftedCards);
        
        // Proceed to game map
        this.screenManager.showScreen(SCREENS.GAME_MAP);
        
        console.log('Draft completed! Final deck:', this.draftedCards);
    }

    showDraftOptions() {
        const draftOptions = this.container.querySelector('#draftOptions');
        const instruction = this.container.querySelector('#draftInstruction');
        const choicesContainer = this.container.querySelector('#draftChoices');
        
        draftOptions.style.display = 'flex';
        instruction.innerHTML = `
            <div style="text-align: center;">
                <p>You have ${this.draftedCards.length}/${this.targetDeckSize} cards in your deck.</p>
                <p>Choose how to draft the remaining ${this.targetDeckSize - this.draftedCards.length} cards:</p>
            </div>
        `;
        choicesContainer.innerHTML = '';
    }

    hideDraftOptions() {
        const draftOptions = this.container.querySelector('#draftOptions');
        draftOptions.style.display = 'none';
    }

    autoDraftRemaining() {
        const remainingCards = this.targetDeckSize - this.draftedCards.length;
        
        for (let i = 0; i < remainingCards; i++) {
            // Get 3 random choices excluding already drafted cards
            const excludeIds = this.draftedCards.map(card => card.id);
            const choices = getRandomDraftChoices(excludeIds);
            
            // Pick the first choice (random selection)
            const selectedCard = choices[0];
            this.draftedCards.push(selectedCard);
            
            console.log(`Auto-drafted: ${selectedCard.name} (${selectedCard.position}) - Deck: ${this.draftedCards.length}/${this.targetDeckSize}`);
        }
        
        this.hideDraftOptions();
        this.updateProgress();
        this.updateDeckSummary();
        this.showDraftComplete();
    }

    renderDraftedDeck(container) {
        container.innerHTML = '';
        container.style.maxHeight = '60vh';
        container.style.overflowY = 'auto';
        
        // Group cards by source (team vs general draft)
        const teamCards = this.draftedCards.slice(0, 3); // First 3 are team cards
        const generalCards = this.draftedCards.slice(3); // Rest are general draft
        
        // Create a wrapper with proper structure
        const deckWrapper = document.createElement('div');
        deckWrapper.className = 'deck-review-wrapper';
        
        // Create team cards section
        if (teamCards.length > 0) {
            const teamSection = document.createElement('div');
            teamSection.className = 'deck-section';
            teamSection.innerHTML = `
                <h4 class="deck-section-header">
                    🏈 Your Team Players (${teamCards.length})
                </h4>
                <div class="deck-cards-grid" id="teamCardsGrid"></div>
            `;
            deckWrapper.appendChild(teamSection);
            
            const teamGrid = teamSection.querySelector('#teamCardsGrid');
            teamCards.forEach((card, index) => {
                const cardElement = this.createDeckReviewCard(card, `team-${index}`);
                teamGrid.appendChild(cardElement);
            });
        }
        
        // Create general draft section
        if (generalCards.length > 0) {
            const generalSection = document.createElement('div');
            generalSection.className = 'deck-section';
            generalSection.innerHTML = `
                <h4 class="deck-section-header">
                    🌟 General Draft Players (${generalCards.length})
                </h4>
                <div class="deck-cards-grid" id="generalCardsGrid"></div>
            `;
            deckWrapper.appendChild(generalSection);
            
            const generalGrid = generalSection.querySelector('#generalCardsGrid');
            generalCards.forEach((card, index) => {
                const cardElement = this.createDeckReviewCard(card, `general-${index}`);
                generalGrid.appendChild(cardElement);
            });
        }
        
        container.appendChild(deckWrapper);
    }

    createDeckReviewCard(player, cardId) {
        const cardElement = document.createElement('div');
        cardElement.className = 'draft-choice-card deck-review-card';
        cardElement.dataset.playerId = cardId;

        cardElement.innerHTML = `
            <div class="choice-card-header">
                <div class="player-cost">${player.cost}</div>
                <div class="player-position" style="background-color: ${this.getPositionColor(player.position)}">${player.position}</div>
                <div class="player-rarity">${player.rarity}</div>
            </div>
            
            <div class="player-image">
                <div style="color: white; font-weight: bold; font-size: clamp(8px, 2vw, 12px);">
                    ${player.name}
                </div>
            </div>
            
            <div class="player-name">${player.name}</div>
            
            <div class="team-name" style="background-color: ${this.getTeamColor(player.team)}">
                ${player.team || 'NFL'}
            </div>
            
            <div class="player-stats">
                <div class="stat-row">
                    <span class="stat-label">Rush O:</span>
                    <span class="stat-value">${player.rushOffense}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Pass O:</span>
                    <span class="stat-value">${player.passOffense}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Rush D:</span>
                    <span class="stat-value">${player.rushDefense}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Pass D:</span>
                    <span class="stat-value">${player.passDefense}</span>
                </div>
            </div>
        `;

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

    getTeamColor(teamAbbr) {
        // Basic team colors - could be expanded
        const teamColors = {
            'KC': '#E31837', 'LV': '#000000', 'LAC': '#0080C6', 'DEN': '#FB4F14',
            'BUF': '#00338D', 'MIA': '#008E97', 'NE': '#002244', 'NYJ': '#125740',
            'BAL': '#241773', 'CIN': '#FB4F14', 'CLE': '#311D00', 'PIT': '#FFB612',
            'HOU': '#03202F', 'IND': '#002C5F', 'JAX': '#006778', 'TEN': '#0C2340',
            'DAL': '#003594', 'NYG': '#0B2265', 'PHI': '#004C54', 'WAS': '#5A1414',
            'CHI': '#0B162A', 'DET': '#0076B6', 'GB': '#203731', 'MIN': '#4F2683',
            'ATL': '#A71930', 'CAR': '#0085CA', 'NO': '#D3BC8D', 'TB': '#D50A0A',
            'ARI': '#97233F', 'LAR': '#003594', 'SF': '#AA0000', 'SEA': '#002244'
        };
        return teamColors[teamAbbr] || '#666';
    }

    show() {
        if (this.container) {
            this.container.style.display = 'flex';
            setTimeout(() => {
                this.container.classList.add('screen-enter');
            }, 50);
            
            // Initialize draft with team cards
            const draftedCards = this.screenManager.getDraftedCards();
            this.initializeDraft(draftedCards);
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