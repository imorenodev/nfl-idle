// GameConstants.js - Configuration values and game constants

export const POSITION_LIMITS = {
    QB: 1,
    RB: 2,
    WR: 3,
    TE: 2,
    DE: 2,
    DT: 2,
    LB: 3,
    CB: 3,
    S: 2
};

export const GAME_CONFIG = {
    CARDS_PER_HAND: 6,
    DECK_SIZE: 25,
    CARDS_PER_ROUND: 6,
    MAX_YARDS: 100,
    STARTING_PLAYER_YARDS: 20,
    STARTING_ENEMY_YARDS: 20,
    MAX_SELECTED_CARDS: 6,
    DISCARDS_PER_ROUND: 1
};

export const ANIMATION_TIMINGS = {
    CARD_ENTER_DELAY: 100,
    CARD_SELECTION_DURATION: 600,
    FIELD_PLACEMENT_DELAY: 150,
    CARD_REMOVAL_DURATION: 300,
    MESSAGE_DISPLAY_DURATION: 3000,
    ROUND_END_DELAY: 3500,
    HEALTH_BAR_INIT_DELAY: 100
};

export const UI_CONFIG = {
    CARD_FLOATING_ANIMATION_DELAY: 0.2, // seconds
    MESSAGE_FADE_DURATION: 3, // seconds
    VIEWPORT_HEIGHT_UPDATE_DELAY: 100 // ms for orientation change
};

export const SCREENS = {
    TITLE: 'title',
    TEAM_DRAFT: 'team-draft',
    GENERAL_DRAFT: 'general-draft',
    GAME_MAP: 'game-map',
    BATTLE: 'battle',
    SHOP: 'shop',
    SETTINGS: 'settings'
};

export const CARD_POWER_CALCULATION = {
    // Card power = cost + rarity
    COST_WEIGHT: 1,
    RARITY_WEIGHT: 1
};

export const COMBAT_CALCULATION = {
    // Yard gain = max(rushDiff, passDiff) when positive
    // Requires QB to gain offensive yards
    REQUIRES_QB_FOR_OFFENSE: true,
    YARD_BOUNDS: {
        MIN: 0,  // Safety occurs at 0 yards or below
        MAX: 100 // Touchdown occurs at 100 yards or above
    }
};

export const GAME_MESSAGES = {
    SELECT_CARDS: "Select cards to play!",
    TOO_MANY_CARDS: "You can only play up to 6 cards!",
    TOO_MANY_QB: "Only 1 QB allowed!",
    TOO_MANY_RB: "Only 2 RBs allowed!",
    TOO_MANY_WR: "Only 3 WRs allowed!",
    TOO_MANY_TE: "Only 2 TEs allowed!",
    TOO_MANY_DE: "Only 2 DEs allowed!",
    TOO_MANY_DT: "Only 2 DTs allowed!",
    TOO_MANY_LB: "Only 3 LBs allowed!",
    TOO_MANY_CB: "Only 3 CBs allowed!",
    TOO_MANY_S: "Only 2 Safeties allowed!",
    NEED_QB: "You must play a QB to gain yards!",
    DISCARD_ONCE: "You can only discard once per round!",
    SELECT_TO_DISCARD: "Select cards to discard!",
    DECK_RESHUFFLED: "🔄 Deck reshuffled from discard pile!",
    ENEMY_DECK_RESHUFFLED: "🔄 Enemy deck reshuffled!",
    FIELD_CLEARED: "⚡ Field cleared! Cards added to discard piles"
};

export const GAME_OVER_MESSAGES = {
    PLAYER_TOUCHDOWN: "🏆 TOUCHDOWN! YOU WIN!",
    PLAYER_TOUCHDOWN_DESC: "You reached 100 yards and scored! Victory is yours!",
    ENEMY_TOUCHDOWN: "💀 ENEMY TOUCHDOWN! YOU LOSE!",
    ENEMY_TOUCHDOWN_DESC: "The enemy reached 100 yards first. Better luck next time!",
    PLAYER_SAFETY: "🛡️ SAFETY! YOU WIN!",
    PLAYER_SAFETY_DESC: "You forced the enemy back to 0 yards! Defensive victory!",
    ENEMY_SAFETY: "⚠️ SAFETY AGAINST YOU! YOU LOSE!",
    ENEMY_SAFETY_DESC: "You were pushed back to 0 yards. The enemy wins by safety!",
    GAME_OVER_TITLE: "Game Over"
};

export const GAME_OVER_CONDITIONS = {
    PLAYER_TOUCHDOWN: 'player_touchdown',
    ENEMY_TOUCHDOWN: 'enemy_touchdown', 
    PLAYER_SAFETY: 'player_safety',
    ENEMY_SAFETY: 'enemy_safety'
};

export const CSS_CLASSES = {
    CARD_SELECTED: 'selected',
    CARD_ENTER: 'card-enter',
    FIELD_PLACEMENT: 'field-placement',
    FLOATING_ANIMATION: 'floating-animation',
    GAME_MESSAGE: 'game-message',
    DEAD: 'dead',
    FADEOUT: 'fadeout'
};