// Set CSS custom property for viewport height
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

class GameState {
    constructor() {
        this.selectedCards = new Set();
        this.playerYards = 10;
        this.enemyYards = 0;

        // Health bar instances
        this.playerYardsBar = null;
        this.enemyYardsBar = null;

        this.playerDeck = [
            { name: 'MAHOMES', cost: 8, rarity: 6, position: 'QB' },
            { name: 'ALLEN', cost: 7, rarity: 6, position: 'QB' },
            { name: 'BURROW', cost: 6, rarity: 5, position: 'QB' },
            { name: 'HURTS', cost: 5, rarity: 4, position: 'QB' },
            { name: 'LAMAR', cost: 6, rarity: 5, position: 'QB' },
            { name: 'HENRY', cost: 7, rarity: 5, position: 'RB' },
            { name: 'MCCAFFREY', cost: 8, rarity: 6, position: 'RB' },
            { name: 'CHUBB', cost: 5, rarity: 4, position: 'RB' },
            { name: 'COOK', cost: 4, rarity: 3, position: 'RB' },
            { name: 'KUPP', cost: 6, rarity: 5, position: 'WR' },
            { name: 'JEFFERSON', cost: 7, rarity: 6, position: 'WR' },
            { name: 'DIGGS', cost: 5, rarity: 4, position: 'WR' },
            { name: 'ADAMS', cost: 6, rarity: 5, position: 'WR' },
            { name: 'KELCE', cost: 7, rarity: 6, position: 'TE' },
            { name: 'WATT', cost: 8, rarity: 6, position: 'DE' }
        ];
        this.playerHand = [];
        this.playerDrawPile = [];
        this.playerDiscardPile = [];

        this.fieldCards = {
            player: [],
            enemy: []
        };
        this.hasDiscardedThisRound = false;
        this.round = 1;
        
        this.enemyDeck = [
            { name: 'RODGERS', cost: 7, rarity: 5, position: 'QB' },
            { name: 'WILSON', cost: 6, rarity: 4, position: 'QB' },
            { name: 'PRESCOTT', cost: 5, rarity: 4, position: 'QB' },
            { name: 'STAFFORD', cost: 5, rarity: 3, position: 'QB' },
            { name: 'JONES', cost: 4, rarity: 3, position: 'QB' },
            { name: 'BARKLEY', cost: 7, rarity: 5, position: 'RB' },
            { name: 'JONES II', cost: 6, rarity: 4, position: 'RB' },
            { name: 'MIXON', cost: 5, rarity: 4, position: 'RB' },
            { name: 'HARRIS', cost: 4, rarity: 3, position: 'RB' },
            { name: 'HILL', cost: 7, rarity: 6, position: 'WR' },
            { name: 'CHASE', cost: 6, rarity: 5, position: 'WR' },
            { name: 'HOPKINS', cost: 5, rarity: 4, position: 'WR' },
            { name: 'EVANS', cost: 5, rarity: 4, position: 'WR' },
            { name: 'KITTLE', cost: 6, rarity: 5, position: 'TE' },
            { name: 'DONALD', cost: 8, rarity: 6, position: 'DT' }
        ];

        this.enemyHand = [];
        this.enemyDrawPile = [];
        this.enemyDiscardPile = [];
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
        
        // Initialize health bars after DOM is ready
        setTimeout(() => {
            this.initializeHealthBars();
        }, 100);
        
        this.startNewRound();
        this.updateUI();
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
        if (this.enemyHand.length === 0) return 0;

        const cardsToPlay = this.enemyHand.length;
        let totalEnemyPower = 0;

        this.enemyHand.forEach(card => {
            totalEnemyPower += card.cost + card.rarity;
            
            this.fieldCards.enemy.push({
                name: card.name,
                position: card.position,
                cost: card.cost,
                rarity: card.rarity,
                id: `enemy-field-${Date.now()}-${Math.random()}`,
                element: null
            });
        });

        this.enemyHand = [];
        return totalEnemyPower;
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
                <div class="card-rarity">${card.rarity}</div>
            </div>
            <div class="card-image">
                <div class="position-badge">${card.position}</div>
                ${card.name}
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
        fieldCard.innerHTML = `
            <div style="font-size: clamp(6px, 1.5vw, 8px); margin-bottom: 2px;">${card.position || ''}</div>
            <div>${card.name}</div>
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

        let totalPower = 0;
        const playedCards = [];

        this.selectedCards.forEach(cardId => {
            const cardIndex = this.playerHand.findIndex(c => c.id === cardId);
            if (cardIndex !== -1) {
                const card = this.playerHand[cardIndex];
                playedCards.push(cardIndex);
                
                totalPower += card.cost + card.rarity;

                this.fieldCards.player.push({
                    name: card.name,
                    position: card.position,
                    cost: card.cost,
                    rarity: card.rarity,
                    id: `field-${Date.now()}-${Math.random()}`,
                    element: null
                });
                
                if (card.element) {
                    card.element.style.transform = 'scale(0) rotate(180deg)';
                    card.element.style.opacity = '0';
                }
            }
        });

        playedCards.sort((a, b) => b - a);
        
        setTimeout(() => {
            playedCards.forEach(cardIndex => {
                this.playerHand.splice(cardIndex, 1);
            });
            
            this.discardRemainingHand();
            
            this.renderFieldCards();
            this.endRound(totalPower);
        }, 300);

        this.selectedCards.clear();
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
                    position: card.position
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
                position: card.position
            });
        });

        this.fieldCards.enemy.forEach(card => {
            this.enemyDiscardPile.push({
                name: card.name,
                cost: card.cost,
                rarity: card.rarity,
                position: card.position
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
                position: card.position
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

    endRound(playerPower) {
        let enemyPower = 0;
        this.fieldCards.enemy.forEach(card => {
            enemyPower += (card.cost || 0) + (card.rarity || 0);
        });
        
        const playerGain = Math.max(0, Math.floor((playerPower - enemyPower) / 2));
        const enemyGain = Math.max(0, Math.floor((enemyPower - playerPower) / 2));
        
        const prevPlayerYards = this.playerYards;
        const prevEnemyYards = this.enemyYards;

        // Update yards and health bars
        this.playerYards += playerGain;
        this.enemyYards += enemyGain;
        
        this.playerYards = Math.min(100, this.playerYards);
        this.enemyYards = Math.min(100, this.enemyYards);
        
        const playerYardsToAdd = this.playerYards - prevPlayerYards;
        const enemyYardsToAdd = this.enemyYards - prevEnemyYards;

        // Update health bars if they exist
        if (this.playerYardsBar) {
            this.playerYardsBar.add(playerYardsToAdd);
        }
        if (this.enemyYardsBar) {
            this.enemyYardsBar.add(enemyYardsToAdd);
        }
        
        this.updateUI();
        this.showMessage(`Round ${this.round} Complete! You: ${playerPower} power (+${playerGain} yards), Enemy: ${enemyPower} power (+${enemyGain} yards)`);
        
        setTimeout(() => {
            this.clearField();
            
            this.hasDiscardedThisRound = false;
            this.round++;
            
            this.startNewRound();
        }, 3500);
        
        if (this.playerYards >= 100) {
            setTimeout(() => this.showMessage("🏆 YOU WIN! Touchdown!"), 3000);
        } else if (this.enemyYards >= 100) {
            setTimeout(() => this.showMessage("💀 YOU LOSE! Enemy scored!"), 3000);
        }
    }

    startNewRound() {
        this.drawPlayerCards(6);
        this.drawEnemyCards(6);
        
        const enemyPower = this.playEnemyCards();
        
        this.renderFieldCards();
        
        this.renderHand();
        this.updateUI();
        
        this.showMessage(`Round ${this.round} starts! Enemy played cards for ${enemyPower} power. Your turn!`);
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

    setupEventListeners() {
        document.getElementById('playBtn').addEventListener('click', () => {
            this.playSelectedCards();
        });

        document.getElementById('discardBtn').addEventListener('click', () => {
            this.discardSelected();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new GameState();
    game.init();
});

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