// CardComponent.js - Card rendering and interaction handling

import { CSS_CLASSES, ANIMATION_TIMINGS } from '../core/GameConstants.js';

/**
 * CardComponent handles individual card rendering and interactions
 */
export class CardComponent {
    constructor(card, index = 0, onSelectionChange = null) {
        this.card = card;
        this.index = index;
        this.onSelectionChange = onSelectionChange;
        this.element = null;
        this.isSelected = false;
    }

    /**
     * Create and return the card DOM element
     * @returns {HTMLElement} Card element
     */
    createElement() {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${CSS_CLASSES.FLOATING_ANIMATION}`;
        cardDiv.style.animationDelay = `${this.index * 0.2}s`;
        cardDiv.dataset.cardId = this.card.id;
        
        cardDiv.innerHTML = `
            <div class="card-header">
                <div class="card-cost">${this.card.cost}</div>
                <div class="card-rarity">${this.card.rarity}</div>
            </div>
            <div class="card-image">
                <div class="position-badge">${this.card.position}</div>
                ${this.card.name}
            </div>
            <div class="card-name">${this.card.name}</div>
        `;

        // Add click handler
        cardDiv.addEventListener('click', () => this.toggleSelection());
        
        this.element = cardDiv;
        return cardDiv;
    }

    /**
     * Toggle card selection state
     */
    toggleSelection() {
        if (!this.element) return;

        this.isSelected = !this.isSelected;
        
        if (this.isSelected) {
            this.element.classList.add(CSS_CLASSES.CARD_SELECTED);
            this.addSelectionEffect();
        } else {
            this.element.classList.remove(CSS_CLASSES.CARD_SELECTED);
        }

        // Notify parent component
        if (this.onSelectionChange) {
            this.onSelectionChange(this.card.id, this.isSelected);
        }
    }

    /**
     * Set selection state without triggering events
     * @param {boolean} selected - Selection state
     */
    setSelected(selected) {
        if (!this.element) return;

        this.isSelected = selected;
        
        if (selected) {
            this.element.classList.add(CSS_CLASSES.CARD_SELECTED);
        } else {
            this.element.classList.remove(CSS_CLASSES.CARD_SELECTED);
        }
    }

    /**
     * Add visual selection effect
     */
    addSelectionEffect() {
        if (!this.element) return;

        this.element.style.transform = 'translateY(-12px) scale(1.05) rotateY(360deg)';
        setTimeout(() => {
            if (this.element) {
                this.element.style.transform = 'translateY(-12px) scale(1.05)';
            }
        }, ANIMATION_TIMINGS.CARD_SELECTION_DURATION);
    }

    /**
     * Animate card entrance
     */
    animateEntrance() {
        if (!this.element) return;

        setTimeout(() => {
            if (this.element) {
                this.element.classList.add(CSS_CLASSES.CARD_ENTER);
            }
        }, this.index * ANIMATION_TIMINGS.CARD_ENTER_DELAY);
    }

    /**
     * Animate card removal
     * @param {string} direction - Animation direction ('scale', 'slide-left', 'slide-right')
     * @returns {Promise} Promise that resolves when animation completes
     */
    animateRemoval(direction = 'scale') {
        return new Promise((resolve) => {
            if (!this.element) {
                resolve();
                return;
            }

            switch (direction) {
                case 'slide-left':
                    this.element.style.transform = 'translateX(-200px) rotate(-90deg)';
                    break;
                case 'slide-right':
                    this.element.style.transform = 'translateX(200px) rotate(90deg)';
                    break;
                case 'scale':
                default:
                    this.element.style.transform = 'scale(0) rotate(180deg)';
                    break;
            }
            
            this.element.style.opacity = '0';

            setTimeout(() => {
                resolve();
            }, ANIMATION_TIMINGS.CARD_REMOVAL_DURATION);
        });
    }

    /**
     * Update card data and re-render
     * @param {Object} newCardData - New card data
     */
    updateCard(newCardData) {
        this.card = { ...this.card, ...newCardData };
        if (this.element) {
            this.element.dataset.cardId = this.card.id;
            // Update card content if needed
            this.refreshContent();
        }
    }

    /**
     * Refresh card content display
     */
    refreshContent() {
        if (!this.element) return;

        const costElement = this.element.querySelector('.card-cost');
        const rarityElement = this.element.querySelector('.card-rarity');
        const nameElement = this.element.querySelector('.card-name');
        const positionElement = this.element.querySelector('.position-badge');
        const imageElement = this.element.querySelector('.card-image');

        if (costElement) costElement.textContent = this.card.cost;
        if (rarityElement) rarityElement.textContent = this.card.rarity;
        if (nameElement) nameElement.textContent = this.card.name;
        if (positionElement) positionElement.textContent = this.card.position;
        if (imageElement) {
            // Update the name inside the image area (keeping position badge)
            const positionBadgeHtml = positionElement ? positionElement.outerHTML : '';
            imageElement.innerHTML = `${positionBadgeHtml}${this.card.name}`;
        }
    }

    /**
     * Get card power (cost + rarity)
     * @returns {number} Card power
     */
    getPower() {
        return (this.card.cost || 0) + (this.card.rarity || 0);
    }

    /**
     * Check if card is of specific position
     * @param {string} position - Position to check
     * @returns {boolean} True if card matches position
     */
    isPosition(position) {
        return this.card.position === position;
    }

    /**
     * Destroy the card component
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
        this.onSelectionChange = null;
    }
}

/**
 * FieldCardComponent for cards displayed on the field
 */
export class FieldCardComponent {
    constructor(card, type = 'player') {
        this.card = card;
        this.type = type; // 'player' or 'enemy'
        this.element = null;
    }

    /**
     * Create field card element
     * @returns {HTMLElement} Field card element
     */
    createElement() {
        const fieldCard = document.createElement('div');
        fieldCard.className = `field-card ${this.type}`;
        fieldCard.innerHTML = `
            <div style="font-size: clamp(6px, 1.5vw, 8px); margin-bottom: 2px;">${this.card.position || ''}</div>
            <div>${this.card.name}</div>
        `;
        
        this.element = fieldCard;
        return fieldCard;
    }

    /**
     * Animate field card placement
     * @param {number} delay - Animation delay in ms
     */
    animatePlacement(delay = 0) {
        if (!this.element) return;

        setTimeout(() => {
            if (this.element) {
                this.element.classList.add(CSS_CLASSES.FIELD_PLACEMENT);
            }
        }, delay);
    }

    /**
     * Destroy the field card component
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}

/**
 * HandComponent manages a collection of cards in hand
 */
export class HandComponent {
    constructor(containerId, onSelectionChange = null) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.cards = [];
        this.selectedCards = new Set();
        this.onSelectionChange = onSelectionChange;
    }

    /**
     * Render cards in hand
     * @param {Array} cardData - Array of card objects
     */
    renderCards(cardData) {
        this.clear();
        
        cardData.forEach((cardInfo, index) => {
            const cardComponent = new CardComponent(
                cardInfo, 
                index, 
                (cardId, selected) => this.handleCardSelection(cardId, selected)
            );
            
            const cardElement = cardComponent.createElement();
            this.container.appendChild(cardElement);
            
            // Store reference
            this.cards.push(cardComponent);
            cardInfo.element = cardElement;
            
            // Animate entrance
            cardComponent.animateEntrance();
        });
    }

    /**
     * Handle individual card selection
     * @param {string} cardId - ID of selected card
     * @param {boolean} selected - Selection state
     */
    handleCardSelection(cardId, selected) {
        if (selected) {
            this.selectedCards.add(cardId);
        } else {
            this.selectedCards.delete(cardId);
        }

        // Notify parent
        if (this.onSelectionChange) {
            this.onSelectionChange(Array.from(this.selectedCards));
        }
    }

    /**
     * Get selected card IDs
     * @returns {Array} Array of selected card IDs
     */
    getSelectedCardIds() {
        return Array.from(this.selectedCards);
    }

    /**
     * Clear all selections
     */
    clearSelections() {
        this.cards.forEach(card => card.setSelected(false));
        this.selectedCards.clear();
    }

    /**
     * Remove selected cards with animation
     * @param {string} animationType - Type of removal animation
     * @returns {Promise} Promise that resolves when animation completes
     */
    async removeSelectedCards(animationType = 'scale') {
        const cardsToRemove = this.cards.filter(card => 
            this.selectedCards.has(card.card.id)
        );

        // Animate removal
        const removePromises = cardsToRemove.map(card => 
            card.animateRemoval(animationType)
        );

        await Promise.all(removePromises);

        // Remove from arrays
        this.cards = this.cards.filter(card => 
            !this.selectedCards.has(card.card.id)
        );

        // Clean up selected cards set
        this.selectedCards.clear();
    }

    /**
     * Clear all cards
     */
    clear() {
        this.cards.forEach(card => card.destroy());
        this.cards = [];
        this.selectedCards.clear();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    /**
     * Get card components
     * @returns {Array} Array of CardComponent instances
     */
    getCards() {
        return this.cards;
    }
}

/**
 * FieldComponent manages cards displayed on the field
 */
export class FieldComponent {
    constructor(playerZoneId, enemyZoneId) {
        this.playerZone = document.getElementById(playerZoneId);
        this.enemyZone = document.getElementById(enemyZoneId);
        this.playerCards = [];
        this.enemyCards = [];
    }

    /**
     * Render cards on the field
     * @param {Array} playerCards - Player field cards
     * @param {Array} enemyCards - Enemy field cards
     */
    renderField(playerCards, enemyCards) {
        this.clearField();

        // Render enemy cards
        enemyCards.forEach((card, index) => {
            const fieldCard = new FieldCardComponent(card, 'enemy');
            const element = fieldCard.createElement();
            this.enemyZone.appendChild(element);
            this.enemyCards.push(fieldCard);
            
            fieldCard.animatePlacement(index * ANIMATION_TIMINGS.FIELD_PLACEMENT_DELAY);
        });

        // Render player cards
        playerCards.forEach((card, index) => {
            const fieldCard = new FieldCardComponent(card, 'player');
            const element = fieldCard.createElement();
            this.playerZone.appendChild(element);
            this.playerCards.push(fieldCard);
            
            fieldCard.animatePlacement(index * ANIMATION_TIMINGS.FIELD_PLACEMENT_DELAY);
        });
    }

    /**
     * Clear the field
     */
    clearField() {
        // Clean up player cards
        this.playerCards.forEach(card => card.destroy());
        this.playerCards = [];
        
        // Clean up enemy cards
        this.enemyCards.forEach(card => card.destroy());
        this.enemyCards = [];

        // Clear containers
        if (this.playerZone) this.playerZone.innerHTML = '';
        if (this.enemyZone) this.enemyZone.innerHTML = '';
    }
}