// GameMapScreen.js - Game map showing NFL team battles progression
import { SCREENS } from '../core/GameConstants.js';
import { NFLTeams } from '../data/NFLTeams.js';

export class GameMapScreen {
    constructor(screenManager) {
        this.screenManager = screenManager;
        this.container = null;
        this.playerTeam = null;
        this.currentBattleIndex = 0;
        this.battles = [];
    }

    create() {
        this.container = document.createElement('div');
        this.container.className = 'game-map-screen';
        this.container.innerHTML = `
            <div class="map-header">
                <div class="player-team-info">
                    <div class="team-logo" id="playerTeamLogo"></div>
                    <div class="team-details">
                        <h2 id="playerTeamName">Your Team</h2>
                        <p class="team-record" id="teamRecord">0-0</p>
                    </div>
                </div>
                
                <div class="map-title">
                    <h1>ROAD TO THE SUPER BOWL</h1>
                    <p class="season-progress" id="seasonProgress">Regular Season</p>
                </div>
            </div>

            <div class="battle-path">
                <div class="battles-container" id="battlesContainer">
                    <!-- Battle nodes will be generated here -->
                </div>
            </div>

            <div class="map-footer">
                <button class="map-button back-button" id="backButton">
                    ← Back to Menu
                </button>
                <div class="map-stats">
                    <span class="stat">Wins: <span id="winsCount">0</span></span>
                    <span class="stat">Losses: <span id="lossesCount">0</span></span>
                </div>
            </div>
        `;

        this.setupEventListeners();
        return this.container;
    }

    setupEventListeners() {
        const backButton = this.container.querySelector('#backButton');
        backButton.addEventListener('click', () => {
            this.screenManager.showScreen(SCREENS.TITLE);
        });
    }

    setPlayerTeam(teamData) {
        console.log('GameMapScreen.setPlayerTeam called with:', teamData);
        this.playerTeam = teamData;
        this.generateBattleSequence();
        this.updatePlayerTeamDisplay();
        this.renderBattles();
    }

    generateBattleSequence() {
        console.log('Generating battle sequence for player team:', this.playerTeam);
        // Generate a sequence of NFL teams to battle (excluding player's team)
        const allTeams = NFLTeams.getAllTeams();
        console.log('All teams loaded:', allTeams.length);
        const enemyTeams = allTeams.filter(team => team.id !== this.playerTeam.id);
        console.log('Enemy teams after filtering:', enemyTeams.length);
        
        // Shuffle and select teams for the season
        const shuffled = [...enemyTeams].sort(() => Math.random() - 0.5);
        
        this.battles = [
            // Regular season battles (8 games)
            ...shuffled.slice(0, 8).map((team, index) => ({
                id: `regular-${index}`,
                type: 'regular',
                team: team,
                status: index === 0 ? 'available' : 'locked',
                completed: false
            })),
            
            // Playoffs
            {
                id: 'wildcard',
                type: 'playoff',
                team: shuffled[8],
                status: 'locked',
                completed: false,
                title: 'Wild Card'
            },
            {
                id: 'divisional',
                type: 'playoff', 
                team: shuffled[9],
                status: 'locked',
                completed: false,
                title: 'Divisional Round'
            },
            {
                id: 'conference',
                type: 'playoff',
                team: shuffled[10],
                status: 'locked',
                completed: false,
                title: 'Conference Championship'
            },
            {
                id: 'superbowl',
                type: 'superbowl',
                team: shuffled[11],
                status: 'locked',
                completed: false,
                title: 'Super Bowl'
            }
        ];
    }

    updatePlayerTeamDisplay() {
        if (!this.playerTeam) return;
        
        const logoElement = this.container.querySelector('#playerTeamLogo');
        const nameElement = this.container.querySelector('#playerTeamName');
        
        logoElement.style.backgroundColor = this.playerTeam.primaryColor;
        logoElement.textContent = this.playerTeam.abbreviation;
        nameElement.textContent = this.playerTeam.name;
    }

    renderBattles() {
        console.log('Rendering battles:', this.battles.length);
        const container = this.container.querySelector('#battlesContainer');
        container.innerHTML = '';

        this.battles.forEach((battle, index) => {
            const battleNode = document.createElement('div');
            battleNode.className = `battle-node ${battle.status} ${battle.type}`;
            battleNode.dataset.battleId = battle.id;

            battleNode.innerHTML = `
                <div class="battle-number">${index + 1}</div>
                <div class="enemy-team">
                    <div class="enemy-logo" style="background-color: ${battle.team.primaryColor}">
                        ${battle.team.abbreviation}
                    </div>
                    <div class="enemy-name">${battle.team.name}</div>
                </div>
                <div class="battle-status">
                    ${battle.completed ? '✓' : (battle.status === 'available' ? '🏈' : '🔒')}
                </div>
                ${battle.title ? `<div class="battle-title">${battle.title}</div>` : ''}
            `;

            if (battle.status === 'available') {
                battleNode.addEventListener('click', () => {
                    this.startBattle(battle);
                });
            }

            container.appendChild(battleNode);
        });
    }

    startBattle(battle) {
        // Store the battle context and start the game
        this.screenManager.setCurrentBattle(battle);
        this.screenManager.showScreen(SCREENS.BATTLE);
    }

    onBattleCompleted(battleId, won) {
        const battle = this.battles.find(b => b.id === battleId);
        if (!battle) return;

        battle.completed = true;
        battle.won = won;

        if (won) {
            // Unlock next battle
            const currentIndex = this.battles.findIndex(b => b.id === battleId);
            if (currentIndex < this.battles.length - 1) {
                this.battles[currentIndex + 1].status = 'available';
                console.log(`Battle ${battleId} won - unlocked next battle: ${this.battles[currentIndex + 1].id}`);
            } else {
                // Player won the final battle (Super Bowl)
                console.log('🏆 SUPER BOWL CHAMPION! Player completed all battles!');
                this.showChampionshipCelebration();
            }
        } else {
            // Player lost - lock all future battles
            this.lockAllBattlesAfter(battleId);
            console.log(`Battle ${battleId} lost - locked all future battles`);
        }

        this.updateStats();
        this.renderBattles();
    }

    updateStats() {
        const wins = this.battles.filter(b => b.completed && b.won).length;
        const losses = this.battles.filter(b => b.completed && !b.won).length;
        
        this.container.querySelector('#winsCount').textContent = wins;
        this.container.querySelector('#lossesCount').textContent = losses;
        this.container.querySelector('#teamRecord').textContent = `${wins}-${losses}`;
    }

    lockAllBattlesAfter(battleId) {
        const battleIndex = this.battles.findIndex(b => b.id === battleId);
        if (battleIndex === -1) return;
        
        // Lock all battles after the current one
        for (let i = battleIndex + 1; i < this.battles.length; i++) {
            this.battles[i].status = 'locked';
            this.battles[i].completed = false;
            this.battles[i].won = undefined;
        }
    }

    showChampionshipCelebration() {
        // Simple championship message - could be enhanced with modal later
        const seasonProgress = this.container.querySelector('#seasonProgress');
        if (seasonProgress) {
            seasonProgress.innerHTML = '🏆 <strong>SUPER BOWL CHAMPIONS!</strong> 🏆';
            seasonProgress.style.color = '#FFD700';
            seasonProgress.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        }
        
        // Could add more celebration effects here
        console.log('🎉 Championship celebration displayed!');
    }

    resetProgression() {
        // Reset all battles to start over from game 1
        this.currentBattleIndex = 0;
        
        // Reset all battle statuses
        this.battles.forEach((battle, index) => {
            battle.completed = false;
            battle.won = undefined;
            battle.status = index === 0 ? 'available' : 'locked';
        });
        
        // Reset championship status
        const seasonProgress = this.container.querySelector('#seasonProgress');
        if (seasonProgress) {
            seasonProgress.innerHTML = 'Regular Season';
            seasonProgress.style.color = '';
            seasonProgress.style.textShadow = '';
        }
        
        // Re-render the battles and update stats
        this.renderBattles();
        this.updateStats();
        
        console.log('Game map progression reset - back to game 1');
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