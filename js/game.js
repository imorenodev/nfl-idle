// Import game over functionality
import { CombatEngine } from './core/CombatEngine.js';
import { gameOverManager } from './core/GameOverManager.js';
import { CardDataProvider } from './data/CardDataProvider.js';

export class GameState {
    constructor(draftedDeck = null) {
        this.selectedCards = new Set();
        this.playerYards = 20;
        this.enemyYards = 20;

        // Health bar instances
        this.playerYardsBar = null;
        this.enemyYardsBar = null;

        // Store drafted deck for resets
        this.draftedDeck = draftedDeck;
        
        // Use drafted deck if provided, otherwise use default
        this.playerDeck = draftedDeck ? 
            CardDataProvider.getDraftedPlayerDeck(draftedDeck) : 
            CardDataProvider.getPlayerDeck();
        this.playerHand = [];
        this.playerDrawPile = [];
        this.playerDiscardPile = [];

        this.fieldCards = {
            player: [],
            enemy: []
        };
        this.hasDiscardedThisRound = false;
        this.round = 1;
        
        this.enemyDeck = CardDataProvider.getEnemyDeck();

        this.enemyHand = [];
        this.enemyDrawPile = [];
        this.enemyDiscardPile = [];

        this.gameLog = [];
        this.lastRoundResult = null;
        this.onGameComplete = null;
        this.gameOverManager = gameOverManager;
    }

    initializeHealthBars() {
        // Initialize player yards bar
        this.playerYardsBar = new HealthBarComponent('#player-yards-bar', {
            name: 'Your Yards',
            initialValue: this.playerYards
        });

        // Initialize enemy yards bar  
        this.enemyYardsBar = new HealthBarComponent('#enemy-yards-bar', {
            name: 'Enemy Yards',
            initialValue: this.enemyYards
        });
    }

    init() {
        this.generateInitialHand();
        this.generateEnemyDeck();
        this.setupEventListeners();
        this.setupGameOverManager();
        
        // Initialize health bars after DOM is ready
        setTimeout(() => {
            this.initializeHealthBars();
        }, 100);
        
        this.startNewRound();
        this.updateUI();
    }

    setupGameOverManager() {
        // GameOverManager callbacks will be set up by the app
        // This method is kept for compatibility but does nothing
    }

    checkGameOverConditions() {
        return CombatEngine.checkGameOver(this.playerYards, this.enemyYards);
    }

    handleGameOver(gameOverResult) {
        const gameState = {
            round: this.round,
            playerYards: this.playerYards,
            enemyYards: this.enemyYards
        };
        
        gameOverManager.handleGameOver(gameOverResult, gameState);
        
        // Game over is now handled entirely by GameOverManager
        // No need to call onGameComplete callback
    }

    setOnGameComplete(callback) {
        this.onGameComplete = callback;
    }

    setupForNewBattle() {
        // Reset for a new battle while keeping core setup
        this.restartGame();
    }

    restartGame() {
        // Reset all game state
        this.selectedCards = new Set();
        this.playerYards = 20;
        this.enemyYards = 20;
        this.round = 1;
        this.hasDiscardedThisRound = false;
        this.gameLog = [];
        this.lastRoundResult = null;
        
        // Clear field
        this.fieldCards = {
            player: [],
            enemy: []
        };
        
        // Reset decks (keep drafted deck if it exists)
        if (!this.draftedDeck) {
            this.playerDeck = CardDataProvider.getPlayerDeck();
        } else {
            this.playerDeck = CardDataProvider.getDraftedPlayerDeck(this.draftedDeck);
        }
        this.enemyDeck = CardDataProvider.getEnemyDeck();
        this.generateInitialHand();
        this.generateEnemyDeck();
        
        // Reset UI
        this.playerYardsBar.setHealth(this.playerYards);
        this.enemyYardsBar.setHealth(this.enemyYards);
        
        // Hide last round outcome
        document.getElementById('lastRoundOutcome').style.display = 'none';
        
        // Start new game
        this.startNewRound();
        this.updateUI();
    }

    exitToMainMenu() {
        // For now, just restart the game
        // In the future, this would navigate to the title screen
        this.restartGame();
    }

    generateInitialHand() {
        const shuffledPlayers = [...this.playerDeck].sort(() => Math.random() - 0.5);
        
        this.playerDrawPile = shuffledPlayers.map((player, index) => ({
            ...player,
            id: `deck-${index}`,
            element: null
        }));
    }

    generateEnemyDeck() {
        const shuffledEnemyPlayers = [...this.enemyDeck].sort(() => Math.random() - 0.5);
        
        this.enemyDrawPile = shuffledEnemyPlayers.map((player, index) => ({
            ...player,
            id: `enemy-deck-${index}`
        }));
    }

    generateEnemyHand() {
    }

    playEnemyCards() {
        if (this.enemyHand.length === 0) return false;

        // Enemy AI: try to play a valid combination
        const enemySelection = [];
        const positionCounts = { QB: 0, RB: 0, WR: 0, TE: 0, DE: 0, DT: 0, LB: 0, CB: 0, S: 0 };
        let hasQB = false;

        // First, try to find a QB (only one allowed, but not required)
        const qbCard = this.enemyHand.find(card => card.position === 'QB');
        if (qbCard) {
            enemySelection.push(qbCard);
            hasQB = true;
            positionCounts.QB = 1;
        }

        // Then add other cards respecting limits
        for (const card of this.enemyHand) {
            if (enemySelection.length >= 6) break;
            if (card === qbCard) continue;
            
            // Skip other QBs since we can only have one
            if (card.position === 'QB') continue;

            let canAdd = true;
            if (card.position === 'RB' && positionCounts.RB >= 2) canAdd = false;
            else if (card.position === 'WR' && positionCounts.WR >= 3) canAdd = false;
            else if (card.position === 'TE' && positionCounts.TE >= 2) canAdd = false;
            else if (card.position === 'DE' && positionCounts.DE >= 2) canAdd = false;
            else if (card.position === 'DT' && positionCounts.DT >= 2) canAdd = false;
            else if (card.position === 'LB' && positionCounts.LB >= 3) canAdd = false;
            else if (card.position === 'CB' && positionCounts.CB >= 3) canAdd = false;
            else if (card.position === 'S' && positionCounts.S >= 2) canAdd = false;

            if (canAdd) {
                enemySelection.push(card);
                if (card.position in positionCounts) {
                    positionCounts[card.position]++;
                }
            }
        }

        // Rest of the method remains the same...
        enemySelection.forEach(card => {
            this.fieldCards.enemy.push({
                name: card.name,
                position: card.position,
                cost: card.cost,
                rarity: card.rarity,
                rushOffense: card.rushOffense,
                rushDefense: card.rushDefense,
                passOffense: card.passOffense,
                passDefense: card.passDefense,
                id: `enemy-field-${Date.now()}-${Math.random()}`,
                element: null
            });
        });

        // Remove played cards from enemy hand
        this.enemyHand = this.enemyHand.filter(card => !enemySelection.includes(card));
        
        return hasQB;  // Return whether enemy played a QB
    }

    drawEnemyCards(count) {
        const cardsToDraw = count;
        
        for (let i = 0; i < cardsToDraw; i++) {
            const newCard = this.enemyDrawPile.shift();
            if (newCard) {
                newCard.id = `enemy-hand-${Date.now()}-${Math.random()}`;
                this.enemyHand.push(newCard);
            }

            if (this.getNumberOfCardsInEnemyDrawPile() === 0 && this.getNumberOfCardsInEnemyDiscardPile() > 0) {
                this.shuffleEnemyDiscardIntoDeck();
            }
        }
        
        this.enemyCardsRemaining = this.getNumberOfCardsInEnemyDrawPile();
    }

    shuffleEnemyDiscardIntoDeck() {
        const shuffled = [...this.enemyDiscardPile].sort(() => Math.random() - 0.5);
        this.enemyDrawPile.push(...shuffled);
        this.enemyDiscardPile = [];
        this.showMessage("🔄 Enemy deck reshuffled!");
    }

    renderHand() {
        const handContainer = document.getElementById('handCards');
        handContainer.innerHTML = '';

        this.playerHand.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            handContainer.appendChild(cardElement);
            card.element = cardElement;
            
            setTimeout(() => {
                cardElement.classList.add('card-enter');
            }, index * 100);
        });
    }

    createCardElement(card, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card floating-animation';
        cardDiv.style.animationDelay = `${index * 0.2}s`;
        cardDiv.dataset.cardId = card.id;
        
        cardDiv.innerHTML = `
            <div class="card-header">
                <div class="card-cost">${card.cost}</div>
                <div class="position-badge">${card.position}</div>
                <div class="card-rarity">${card.rarity}</div>
            </div>
            <div class="card-image">
                <img src="${this.getPositionImagePath(card.position)}" 
                     alt="${card.name} (${card.position})" 
                     class="card-photo"
                     loading="lazy"
                     onerror="this.src='./assets/images/mahomes-profile.png'; this.onerror=null;">
            </div>
            <div class="card-name">${card.name}</div>
        `;

        cardDiv.addEventListener('click', () => this.toggleCardSelection(card.id));
        return cardDiv;
    }

    renderFieldCards() {
        const enemyZone = document.getElementById('enemyZone');
        const playerZone = document.getElementById('playerZone');
        
        enemyZone.innerHTML = '';
        playerZone.innerHTML = '';

        this.fieldCards.enemy.forEach((card, index) => {
            const fieldCard = this.createFieldCard(card, 'enemy');
            enemyZone.appendChild(fieldCard);
            
            setTimeout(() => {
                fieldCard.classList.add('field-placement');
            }, index * 150);
        });

        this.fieldCards.player.forEach((card, index) => {
            const fieldCard = this.createFieldCard(card, 'player');
            playerZone.appendChild(fieldCard);
            
            setTimeout(() => {
                fieldCard.classList.add('field-placement');
            }, index * 150);
        });
    }

    createFieldCard(card, type) {
        const fieldCard = document.createElement('div');
        fieldCard.className = `field-card ${type}`;
        fieldCard.dataset.cardId = card.id;
        fieldCard.innerHTML = `
            <div class="field-card-header">
                <div class="field-card-cost">${card.cost}</div>
                <div class="field-position-badge">${card.position}</div>
                <div class="field-card-rarity">${card.rarity}</div>
            </div>
            <div class="field-card-image">
                <img src="${this.getPositionImagePath(card.position)}" 
                     alt="${card.name} (${card.position})" 
                     class="field-card-photo"
                     loading="lazy"
                     onerror="this.src='./assets/images/mahomes-profile.png'; this.onerror=null;">
            </div>
            <div class="field-card-name">${card.name}</div>
        `;
        return fieldCard;
    }

    toggleCardSelection(cardId) {
        const card = this.playerHand.find(c => c.id === cardId);
        if (!card || !card.element) return;

        if (this.selectedCards.has(cardId)) {
            this.selectedCards.delete(cardId);
            card.element.classList.remove('selected');
        } else {
            this.selectedCards.add(cardId);
            card.element.classList.add('selected');
            
            this.addSelectionEffect(card.element);
        }
    }

    addSelectionEffect(element) {
        element.style.transform = 'translateY(-12px) scale(1.05) rotateY(360deg)';
        setTimeout(() => {
            element.style.transform = 'translateY(-12px) scale(1.05)';
        }, 600);
    }

    playSelectedCards() {
        if (this.selectedCards.size === 0) {
            this.showMessage("Select cards to play!");
            return;
        }

        if (this.selectedCards.size > 6) {
            this.showMessage("You can only play up to 6 cards!");
            return;
        }

        // Validate position limits using the new CombatEngine
        const selectedCardObjects = Array.from(this.selectedCards).map(cardId => 
            this.playerHand.find(c => c.id === cardId)
        ).filter(card => card);

        const validation = CombatEngine.validateCardSelection(selectedCardObjects);
        if (!validation.isValid) {
            this.showMessage(validation.details || validation.error);
            return;
        }

        // Disable buttons during animation
        const playBtn = document.getElementById('playBtn');
        const discardBtn = document.getElementById('discardBtn');
        playBtn.disabled = true;
        discardBtn.disabled = true;
        playBtn.style.opacity = '0.5';
        discardBtn.style.opacity = '0.5';

        // Show message about what's happening
        const playCount = this.selectedCards.size;
        const discardCount = this.playerHand.length - this.selectedCards.size;
        this.showMessage(`🏈 SNAP! Playing ${playCount} card${playCount !== 1 ? 's' : ''}, discarding ${discardCount} card${discardCount !== 1 ? 's' : ''}`);

        // Step 1: Immediately distinguish selected vs unselected cards visually
        this.highlightCardChoices();

        // Step 2: Animate unselected cards being discarded (after brief delay to show the distinction)
        setTimeout(() => {
            this.animateUnselectedCardsDiscard();
        }, 500);

        // Step 3: Animate selected cards moving to field (after discard animation)
        setTimeout(() => {
            this.animateSelectedCardsToField();
        }, 1000);

        // Step 4: Process the round (after all animations)
        setTimeout(async () => {
            await this.processPlayedCards();
        }, 1500);
    }

    highlightCardChoices() {
        this.playerHand.forEach(card => {
            if (card.element) {
                // Remove existing state classes
                card.element.classList.remove('to-be-played', 'to-be-discarded', 'selected');
                
                if (this.selectedCards.has(card.id)) {
                    // Highlight selected cards (to be played)
                    card.element.classList.add('to-be-played');
                } else {
                    // Highlight unselected cards (to be discarded)
                    card.element.classList.add('to-be-discarded');
                }
            }
        });
    }

    animateUnselectedCardsDiscard() {
        const unselectedCards = this.playerHand.filter(card => !this.selectedCards.has(card.id));
        
        unselectedCards.forEach((card, index) => {
            if (card.element) {
                setTimeout(() => {
                    card.element.classList.remove('to-be-discarded');
                    card.element.classList.add('being-discarded');
                }, index * 50); // Stagger the animations
            }
        });

        // Add unselected cards to discard pile
        unselectedCards.forEach(card => {
            this.playerDiscardPile.push({
                name: card.name,
                cost: card.cost,
                rarity: card.rarity,
                position: card.position,
                rushOffense: card.rushOffense,
                rushDefense: card.rushDefense,
                passOffense: card.passOffense,
                passDefense: card.passDefense
            });
        });
    }

    animateSelectedCardsToField() {
        const selectedCardObjects = Array.from(this.selectedCards).map(cardId => 
            this.playerHand.find(c => c.id === cardId)
        ).filter(card => card);

        selectedCardObjects.forEach((card, index) => {
            if (card.element) {
                setTimeout(() => {
                    card.element.classList.remove('to-be-played');
                    card.element.classList.add('moving-to-field');
                }, index * 100);
            }

            // Add to field cards
            this.fieldCards.player.push({
                name: card.name,
                position: card.position,
                cost: card.cost,
                rarity: card.rarity,
                rushOffense: card.rushOffense,
                rushDefense: card.rushDefense,
                passOffense: card.passOffense,
                passDefense: card.passDefense,
                id: `field-${Date.now()}-${Math.random()}`,
                element: null
            });
        });
    }

    async processPlayedCards() {
        // Remove all cards from hand (both played and discarded)
        this.playerHand = [];
        
        // Clear selections
        this.selectedCards.clear();
        
        // Re-enable buttons
        const playBtn = document.getElementById('playBtn');
        const discardBtn = document.getElementById('discardBtn');
        playBtn.disabled = false;
        discardBtn.disabled = false;
        playBtn.style.opacity = '1';
        discardBtn.style.opacity = '1';
        
        // Render field with new cards
        this.renderFieldCards();
        
        // Process the round
        await this.endRound(0); // totalPower parameter is not used in new CombatEngine
    }

    discardSelected() {
        if (this.selectedCards.size === 0) {
            this.showMessage("Select cards to discard!");
            return;
        }

        if (this.hasDiscardedThisRound) {
            this.showMessage("You can only discard once per round!");
            return;
        }

        const discardCount = this.selectedCards.size;
        const cardsToDiscard = [];

        this.selectedCards.forEach(cardId => {
            const cardIndex = this.playerHand.findIndex(c => c.id === cardId);
            if (cardIndex !== -1) {
                const card = this.playerHand[cardIndex];
                this.playerDiscardPile.push({
                    name: card.name,
                    cost: card.cost,
                    rarity: card.rarity,
                    position: card.position,
                    rushOffense: card.rushOffense,
                    rushDefense: card.rushDefense,
                    passOffense: card.passOffense,
                    passDefense: card.passDefense
                });
                cardsToDiscard.push(cardIndex);
            }
        });

        cardsToDiscard.sort((a, b) => b - a);

        cardsToDiscard.forEach((cardIndex, i) => {
            const card = this.playerHand[cardIndex];
            if (card.element) {
                card.element.style.transform = 'translateX(-200px) rotate(-90deg)';
                card.element.style.opacity = '0';
                
                setTimeout(() => {
                    this.playerHand.splice(cardIndex, 1);
                    
                    if (i === cardsToDiscard.length - 1) {
                        this.drawPlayerCards(discardCount);
                        this.renderHand();
                    }
                }, 300);
            }
        });

        this.selectedCards.clear();
        this.hasDiscardedThisRound = true;
        this.updateUI();
        this.showMessage(`Discarded ${discardCount} cards, drew ${Math.min(discardCount, this.getNumberOfCardsInPlayerDrawPile())} new cards`);
    }

    clearField() {
        this.fieldCards.player.forEach(card => {
            this.playerDiscardPile.push({
                name: card.name,
                cost: card.cost,
                rarity: card.rarity,
                position: card.position,
                rushOffense: card.rushOffense,
                rushDefense: card.rushDefense,
                passOffense: card.passOffense,
                passDefense: card.passDefense
            });
        });

        this.fieldCards.enemy.forEach(card => {
            this.enemyDiscardPile.push({
                name: card.name,
                cost: card.cost,
                rarity: card.rarity,
                position: card.position,
                rushOffense: card.rushOffense,
                rushDefense: card.rushDefense,
                passOffense: card.passOffense,
                passDefense: card.passDefense
            });
        });
        
        this.fieldCards.player = [];
        this.fieldCards.enemy = [];
        
        this.renderFieldCards();
        
        this.showMessage("⚡ Field cleared! Cards added to discard piles");
    }

    getCardCostByName(name) {
        const cardData = {
            'MAHOMES': 8, 'ALLEN': 7, 'BURROW': 6, 'HURTS': 5, 'LAMAR': 6,
            'MCCAFFREY': 8, 'HENRY': 7, 'CHUBB': 5, 'COOK': 4,
            'JEFFERSON': 7, 'KUPP': 6, 'ADAMS': 6, 'DIGGS': 5,
            'KELCE': 7, 'WATT': 8
        };
        return cardData[name] || 5;
    }

    getCardRarityByName(name) {
        const cardData = {
            'MAHOMES': 6, 'ALLEN': 6, 'BURROW': 5, 'HURTS': 4, 'LAMAR': 5,
            'MCCAFFREY': 6, 'HENRY': 5, 'CHUBB': 4, 'COOK': 3,
            'JEFFERSON': 6, 'KUPP': 5, 'ADAMS': 5, 'DIGGS': 4,
            'KELCE': 6, 'WATT': 6
        };
        return cardData[name] || 4;
    }

    getEnemyCardCostByName(name) {
        const cardData = {
            'RODGERS': 7, 'WILSON': 6, 'PRESCOTT': 5, 'STAFFORD': 5, 'JONES': 4,
            'BARKLEY': 7, 'JONES II': 6, 'MIXON': 5, 'HARRIS': 4,
            'HILL': 7, 'CHASE': 6, 'HOPKINS': 5, 'EVANS': 5,
            'KITTLE': 6, 'DONALD': 8
        };
        return cardData[name] || 5;
    }

    getEnemyCardRarityByName(name) {
        const cardData = {
            'RODGERS': 5, 'WILSON': 4, 'PRESCOTT': 4, 'STAFFORD': 3, 'JONES': 3,
            'BARKLEY': 5, 'JONES II': 4, 'MIXON': 4, 'HARRIS': 3,
            'HILL': 6, 'CHASE': 5, 'HOPKINS': 4, 'EVANS': 4,
            'KITTLE': 5, 'DONALD': 6
        };
        return cardData[name] || 4;
    }

    discardRemainingHand() {
        this.playerHand.forEach(card => {
            this.playerDiscardPile.push({
                name: card.name,
                cost: card.cost,
                rarity: card.rarity,
                position: card.position,
                rushOffense: card.rushOffense,
                rushDefense: card.rushDefense,
                passOffense: card.passOffense,
                passDefense: card.passDefense
            });
        });
        
        this.playerHand = [];
    }

    drawPlayerCards(count) {
        const cardsToDraw = count;
        
        for (let i = 0; i < cardsToDraw; i++) {
            const newCard = this.playerDrawPile.shift();
            if (newCard) {
                newCard.id = `hand-${Date.now()}-${Math.random()}`;
                this.playerHand.push(newCard);
            }

            if (this.getNumberOfCardsInPlayerDrawPile() === 0 && this.getNumberOfCardsInPlayerDiscardPile() > 0) {
                this.shuffleDiscardIntoDeck();
            }
        }
        
        this.cardsRemaining = this.getNumberOfCardsInPlayerDrawPile();
        this.updateUI();
    }

    shuffleDiscardIntoDeck() {
        const shuffled = [...this.playerDiscardPile].sort(() => Math.random() - 0.5);
        this.playerDrawPile.push(...shuffled);
        this.playerDiscardPile = [];
        this.showMessage("🔄 Deck reshuffled from discard pile!");
    }

    getNumberOfCardsInPlayerDrawPile() {
        return this.playerDrawPile.length;
    }

    getNumberOfCardsInPlayerDiscardPile() {
        return this.playerDiscardPile.length;
    }

    getNumberOfCardsInEnemyDrawPile() {
        return this.enemyDrawPile.length;
    }

    getNumberOfCardsInEnemyDiscardPile() {
        return this.enemyDiscardPile.length;
    }

    async endRound(playerPower) {
        const statsDisplay = document.getElementById('stats-display');

        // 1. Show Enemy Defense
        const enemyStats = CombatEngine.calculateTeamStats(this.fieldCards.enemy);
        statsDisplay.innerHTML = `Enemy Defense<br>Rush: ${enemyStats.rushDefense} | Pass: ${enemyStats.passDefense}`;
        statsDisplay.style.display = 'block';
        this.highlightDefensiveCards(this.fieldCards.enemy, true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.highlightDefensiveCards(this.fieldCards.enemy, false);

        // 2. Show Player Offense
        const playerStats = CombatEngine.calculateTeamStats(this.fieldCards.player);
        statsDisplay.innerHTML = `Your Offense<br>Rush: ${playerStats.rushOffense} | Pass: ${playerStats.passOffense}`;
        this.highlightOffensiveCards(this.fieldCards.player, true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.highlightOffensiveCards(this.fieldCards.player, false);

        // 3. Show Player Defense
        statsDisplay.innerHTML = `Your Defense<br>Rush: ${playerStats.rushDefense} | Pass: ${playerStats.passDefense}`;
        this.highlightDefensiveCards(this.fieldCards.player, true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.highlightDefensiveCards(this.fieldCards.player, false);

        // 4. Show Enemy Offense
        statsDisplay.innerHTML = `Enemy Offense<br>Rush: ${enemyStats.rushOffense} | Pass: ${enemyStats.passOffense}`;
        this.highlightOffensiveCards(this.fieldCards.enemy, true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.highlightOffensiveCards(this.fieldCards.enemy, false);

        statsDisplay.style.display = 'none';

        // Use the new CombatEngine for all combat calculations
        const combatResult = CombatEngine.processCombatRound(
            this.fieldCards.player,
            this.fieldCards.enemy,
            this.playerYards,
            this.enemyYards,
            this.round
        );

        // Update game state with new yard values
        this.playerYards = combatResult.newPlayerYards;
        this.enemyYards = combatResult.newEnemyYards;

        // Update health bars with the actual change
        if (this.playerYardsBar) {
            this.playerYardsBar.add(combatResult.actualPlayerChange);
        }
        if (this.enemyYardsBar) {
            this.enemyYardsBar.add(combatResult.actualEnemyChange);
        }
        
        this.updateUI();
        
        // Show combat message
        this.showMessage(combatResult.message);
        
        const roundData = {
            round: this.round,
            playerGain: combatResult.playerGain,
            enemyGain: combatResult.enemyGain,
            playerYards: this.playerYards,
            enemyYards: this.enemyYards,
            playerOffenseType: combatResult.playerOffenseType,
            enemyOffenseType: combatResult.enemyOffenseType,
            playerBreakdown: combatResult.playerBreakdown,
            enemyBreakdown: combatResult.enemyBreakdown
        };

        this.addToGameLog(roundData);
        this.updateLastRoundOutcome(roundData);

        // Always check for game over conditions after updating yards
        // This ensures we catch any safety conditions that might have been missed
        const gameOverCheck = CombatEngine.checkGameOver(this.playerYards, this.enemyYards);
        
        // Debug logging for yard tracking
        console.log(`Round ${this.round} complete: Player ${this.playerYards}/100, Enemy ${this.enemyYards}/100`);
        console.log(`Combat result isGameOver: ${combatResult.isGameOver}, Manual check isGameOver: ${gameOverCheck.isGameOver}`);
        
        if (combatResult.isGameOver || gameOverCheck.isGameOver) {
            // Use the more complete result (combat result includes more context)
            const finalGameOverResult = combatResult.isGameOver ? combatResult : gameOverCheck;
            
            console.log(`Game Over detected! Type: ${finalGameOverResult.type}, Winner: ${finalGameOverResult.winner}, Condition: ${finalGameOverResult.condition}`);
            
            // Handle game over - don't start new round
            setTimeout(() => {
                this.handleGameOver(finalGameOverResult);
            }, 3000);
        } else {
            // Continue game - start new round
            setTimeout(() => {
                this.clearField();
                
                this.hasDiscardedThisRound = false;
                this.round++;
                
                this.startNewRound();
            }, 3500);
        }
    }

    startNewRound() {
        // Check if game is over before starting new round
        if (gameOverManager.getIsGameOver()) {
            return;
        }
        
        this.drawPlayerCards(6);
        this.drawEnemyCards(6);
        
        const enemyHasQB = this.playEnemyCards();
        
        this.renderFieldCards();
        
        this.renderHand();
        this.updateUI();
        
        const playerHasQB = this.fieldCards.player.some(card => card.position === 'QB');

        let roundMessage = `Round ${this.round} starts! `;
        if (enemyHasQB) {
            roundMessage += "Enemy has a QB and can gain offensive yards. ";
        } else {
            roundMessage += "Enemy has no QB - they can only gain defensive yards! ";
        }
        roundMessage += "Your turn!";

        this.showMessage(roundMessage);
    }

    showMessage(text) {
        const message = document.createElement('div');
        message.className = 'game-message';
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
            z-index: 1000;
            animation: messageFloat 3s ease-out forwards;
            font-size: clamp(12px, 3vw, 16px);
            max-width: 90vw;
            text-align: center;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
    }

    getPositionImagePath(position) {
        // Map card positions to their corresponding image files
        const positionImages = {
            'QB': 'qb.png',
            'RB': 'rb.png', 
            'WR': 'wr.png',
            'TE': 'te.png',
            'DE': 'de.png',
            'DT': 'dt.png',
            'LB': 'lb.png',
            'CB': 'cb.png',
            'S': 's.png'
        };
        
        // Normalize position to uppercase to handle any case variations
        const normalizedPosition = position ? position.toString().toUpperCase() : '';
        const imageFile = positionImages[normalizedPosition];
        
        if (imageFile) {
            return `./assets/images/${imageFile}`;
        }
        
        // Fallback to mahomes image if position not found
        console.warn(`Position image not found for: ${position}, using fallback`);
        return './assets/images/mahomes-profile.png';
    }

    highlightCards(cards, highlight, positionFilter = null) {
        cards.forEach(card => {
            // Filter by position if specified
            if (positionFilter && !positionFilter.includes(card.position)) {
                return;
            }
            
            const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
            if (cardElement) {
                if (highlight) {
                    cardElement.classList.add('highlighted');
                } else {
                    cardElement.classList.remove('highlighted');
                }
            }
        });
    }

    highlightDefensiveCards(cards, highlight) {
        const defensivePositions = ['S', 'CB', 'DT', 'DE', 'LB'];
        this.highlightCards(cards, highlight, defensivePositions);
    }

    highlightOffensiveCards(cards, highlight) {
        const offensivePositions = ['QB', 'WR', 'RB', 'TE'];
        this.highlightCards(cards, highlight, offensivePositions);
    }

    updateUI() {
        document.querySelector('.cards-remaining').textContent = `Draw Pile: ${this.getNumberOfCardsInPlayerDrawPile()}/${this.playerDeck.length} 🂡`;

        document.getElementById('enemyDeckInfo').textContent = `Enemy: ${this.getNumberOfCardsInEnemyDrawPile()}/${this.enemyDeck.length} 🂡`;
        
        if (this.enemyYardsBar) {
            //this.enemyYardsBar.add(10);
        }

        if (this.playerYardsBar) {
            //this.playerYardsBar.add(10);
        }

        const discardBtn = document.getElementById('discardBtn');
        if (this.hasDiscardedThisRound) {
            discardBtn.style.opacity = '0.5';
            discardBtn.style.cursor = 'not-allowed';
        } else {
            discardBtn.style.opacity = '1';
            discardBtn.style.cursor = 'pointer';
        }
    }

    addToGameLog(roundData) {
        this.gameLog.push({
            round: roundData.round,
            playerGain: roundData.playerGain,
            enemyGain: roundData.enemyGain,
            playerYards: roundData.playerYards,
            enemyYards: roundData.enemyYards,
            playerOffenseType: roundData.playerOffenseType,
            enemyOffenseType: roundData.enemyOffenseType,
            playerBreakdown: roundData.playerBreakdown,
            enemyBreakdown: roundData.enemyBreakdown,
            timestamp: new Date().toLocaleTimeString()
        });
    }

    updateLastRoundOutcome(roundData) {
        const outcomeElement = document.getElementById('lastRoundOutcome');
        
        if (roundData.playerGain > roundData.enemyGain) {
            outcomeElement.innerHTML = `<div class="outcome-text">📝 Last Play: You +${roundData.playerGain}, Enemy +${roundData.enemyGain}</div>`;
            outcomeElement.style.borderColor = '#FFFFFF';
        } else if (roundData.enemyGain > roundData.playerGain) {
            outcomeElement.innerHTML = `<div class="outcome-text">📝 Last Play: You +${roundData.playerGain}, Enemy +${roundData.enemyGain}</div>`;
            outcomeElement.style.borderColor = '#f44336';
        } else {
            outcomeElement.innerHTML = `<div class="outcome-text">📝 Last Play: Tie +${roundData.playerGain} each</div>`;
            outcomeElement.style.borderColor = '#ff9800';
        }
        
        outcomeElement.style.display = 'block';
        this.lastRoundResult = roundData;
    }

    showGameLogModal() {
        const modal = document.getElementById('gameLogModal');
        const content = document.getElementById('gameLogContent');
        
        if (this.gameLog.length === 0) {
            content.innerHTML = '<p>No rounds completed yet.</p>';
        } else {
            content.innerHTML = this.gameLog.map(entry => {
                let entryClass = 'tie';
                if (entry.playerGain > entry.enemyGain) entryClass = 'player-win';
                else if (entry.enemyGain > entry.playerGain) entryClass = 'enemy-win';
                
                const playerBreakdown = entry.playerBreakdown;
                const enemyBreakdown = entry.enemyBreakdown;
                
                return `
                    <div class="log-entry ${entryClass}">
                        <div class="log-round">Round ${entry.round} - ${entry.timestamp}</div>
                        <div class="log-details">
                            <div class="team-result">
                                <strong>You: ${entry.playerOffenseType} attack (+${entry.playerGain} yards) - Total: ${entry.playerYards}</strong>
                                ${playerBreakdown ? `
                                <div class="power-breakdown">
                                    ${playerBreakdown.hasQB ? `
                                    <div class="breakdown-row">
                                        📊 Rush: ${playerBreakdown.rushOffense} offense - ${playerBreakdown.enemyRushDefense} defense = ${playerBreakdown.rushDiff > 0 ? '+' : ''}${playerBreakdown.rushDiff}
                                    </div>
                                    <div class="breakdown-row">
                                        📊 Pass: ${playerBreakdown.passOffense} offense - ${playerBreakdown.enemyPassDefense} defense = ${playerBreakdown.passDiff > 0 ? '+' : ''}${playerBreakdown.passDiff}
                                    </div>
                                    ${playerBreakdown.defensiveDominance && playerBreakdown.defensiveDominance.isDominant ? `
                                    <div class="defensive-dominance">
                                        🛡️ <strong>Defensive Dominance!</strong> Enemy ${playerBreakdown.defensiveDominance.dominanceType} overpowers your offense
                                        <div class="dominance-details">
                                            Enemy Rush Def: ${playerBreakdown.enemyRushDefense} > Your Rush Off: ${playerBreakdown.rushOffense} (+${playerBreakdown.defensiveDominance.rushDominance})
                                        </div>
                                        <div class="dominance-details">
                                            Enemy Pass Def: ${playerBreakdown.enemyPassDefense} > Your Pass Off: ${playerBreakdown.passOffense} (+${playerBreakdown.defensiveDominance.passDominance})
                                        </div>
                                        <div class="dominance-penalty">
                                            💀 Forced yard loss: ${playerBreakdown.defensiveDominance.yardLoss} yards
                                        </div>
                                    </div>
                                    ` : ''}
                                    <div class="breakdown-result">
                                        ⚡ Final result: ${entry.playerOffenseType} (${entry.playerGain > 0 ? '+' : ''}${entry.playerGain} yards)
                                    </div>
                                    ` : `
                                    <div class="breakdown-result">❌ No QB - Defense only</div>
                                    `}
                                </div>
                                ` : ''}
                            </div>
                            <hr class="log-divider">
                            <div class="team-result">
                                <strong>Enemy: ${entry.enemyOffenseType} attack (+${entry.enemyGain} yards) - Total: ${entry.enemyYards}</strong>
                                ${enemyBreakdown ? `
                                <div class="power-breakdown">
                                    ${enemyBreakdown.hasQB ? `
                                    <div class="breakdown-row">
                                        📊 Rush: ${enemyBreakdown.rushOffense} offense - ${enemyBreakdown.playerRushDefense} defense = ${enemyBreakdown.rushDiff > 0 ? '+' : ''}${enemyBreakdown.rushDiff}
                                    </div>
                                    <div class="breakdown-row">
                                        📊 Pass: ${enemyBreakdown.passOffense} offense - ${enemyBreakdown.playerPassDefense} defense = ${enemyBreakdown.passDiff > 0 ? '+' : ''}${enemyBreakdown.passDiff}
                                    </div>
                                    ${enemyBreakdown.defensiveDominance && enemyBreakdown.defensiveDominance.isDominant ? `
                                    <div class="defensive-dominance">
                                        🛡️ <strong>Defensive Dominance!</strong> Your ${enemyBreakdown.defensiveDominance.dominanceType} overpowers enemy offense
                                        <div class="dominance-details">
                                            Your Rush Def: ${enemyBreakdown.playerRushDefense} > Enemy Rush Off: ${enemyBreakdown.rushOffense} (+${enemyBreakdown.defensiveDominance.rushDominance})
                                        </div>
                                        <div class="dominance-details">
                                            Your Pass Def: ${enemyBreakdown.playerPassDefense} > Enemy Pass Off: ${enemyBreakdown.passOffense} (+${enemyBreakdown.defensiveDominance.passDominance})
                                        </div>
                                        <div class="dominance-penalty">
                                            💀 Forced yard loss: ${enemyBreakdown.defensiveDominance.yardLoss} yards
                                        </div>
                                    </div>
                                    ` : ''}
                                    <div class="breakdown-result">
                                        ⚡ Final result: ${entry.enemyOffenseType} (${entry.enemyGain > 0 ? '+' : ''}${entry.enemyGain} yards)
                                    </div>
                                    ` : `
                                    <div class="breakdown-result">❌ No QB - Defense only</div>
                                    `}
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).reverse().join('');
        }
        
        modal.style.display = 'flex';
    }

    hideGameLogModal() {
        document.getElementById('gameLogModal').style.display = 'none';
    }

    setupEventListeners() {
        document.getElementById('playBtn').addEventListener('click', () => {
            this.playSelectedCards();
        });

        document.getElementById('discardBtn').addEventListener('click', () => {
            this.discardSelected();
        });

        document.getElementById('lastRoundOutcome').addEventListener('click', () => {
            this.showGameLogModal();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideGameLogModal();
        });

        document.getElementById('gameLogModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('gameLogModal')) {
                this.hideGameLogModal();
            }
        });
    }
}

// Game initialization is now handled by app.js

document.addEventListener('DOMContentLoaded', () => {
    const fieldSection = document.querySelector('.field-section');
    
    fieldSection.addEventListener('mousemove', (e) => {
        const rect = fieldSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        fieldSection.style.background = `
            radial-gradient(circle at ${x}px ${y}px, 
                rgba(255,255,255,0.1) 0%, 
                transparent 51%), 
            linear-gradient(180deg, #4CAF50 0%, #45a049 100%)
        `;
    });
    
    fieldSection.addEventListener('mouseleave', () => {
        fieldSection.style.background = 'linear-gradient(180deg, #4CAF50 0%, #45a049 100%)';
    });
});