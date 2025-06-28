# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a pure client-side application with no build process or package manager. To develop:

- **Serve locally**: Use any local web server (e.g., `python -m http.server 8000` or VS Code Live Server extension)
- **Testing**: Manual testing in browser - no automated test framework
- **No linting/formatting**: No configured tools - follow existing code style

## Architecture Overview

### Core Structure
- **Single-page application**: All game logic runs in the browser
- **Vanilla JavaScript**: No frameworks or build tools - pure ES6+ classes and modules
- **Component-based**: Modular design with reusable components and clear separation of concerns
- **Screen-based navigation**: ScreenManager handles navigation between title, game, map, and shop screens
- **Event-driven**: DOM manipulation with custom event listeners and message system

### Modular Structure
```
js/
├── components/          # Reusable UI components
│   ├── CardComponent.js     # Card rendering and interaction
│   └── DeckManager.js       # Deck operations and AI
├── core/               # Core game systems
│   ├── GameConstants.js     # Configuration values
│   ├── ScreenManager.js     # Screen navigation
│   ├── CombatEngine.js      # Game logic calculations
│   └── GameOverManager.js   # Game over detection and UI
├── data/               # Data providers
│   └── CardDataProvider.js  # Card data and lookups
├── screens/            # Screen implementations (planned)
│   ├── TitleScreen.js       # Login/title screen
│   ├── BattleScreen.js      # Combat gameplay
│   ├── GameMapScreen.js     # Map navigation
│   └── ShopScreen.js        # Card purchasing
├── utils/              # Utility systems
│   ├── MessageSystem.js     # Floating messages
│   └── ModalManager.js      # Modal dialogs
└── game.js            # Main entry point (to be refactored)
```

### Key Components
- **ScreenManager**: Handles navigation between different game screens with history support
- **CombatEngine**: Pure logic for combat calculations, card validation, and game rules
- **GameOverManager**: Detects win/lose conditions and displays game over UI with restart functionality
- **CardDataProvider**: Centralized card data with lookup methods and validation
- **DeckManager/EnemyDeckManager**: Deck operations, shuffling, and AI card selection
- **CardComponent/HandComponent/FieldComponent**: UI components for card rendering and interaction
- **MessageSystem**: Floating message notifications with different types and queuing
- **ModalManager**: Reusable modal system for dialogs and overlays

### Game Flow Architecture
- **Turn-based rounds**: Enemy plays first (all 6 cards), then player chooses strategy
- **Card system**: 15-card decks with NFL players, each having cost/rarity stats and position-based gameplay
- **Combat calculation**: Yard gains based on rush/pass offense vs defense stats, requires QB to gain yards
- **Win/lose conditions**: 
  - Player wins: Reach 100 yards (touchdown) OR push enemy to 0 yards (safety)
  - Player loses: Enemy reaches 100 yards (touchdown) OR player pushed to 0 yards (safety)
- **Game over handling**: Animated modals with detailed stats and restart/exit options
- **Deck management**: Auto-shuffle from discard pile when draw pile empty via DeckManager
- **Screen transitions**: ScreenManager handles navigation between title, battle, map, and shop screens

### Mobile-First Design
- CSS custom properties (`--vh`) for viewport height handling
- Touch-friendly card selection with visual feedback
- Responsive sizing using `clamp()` and viewport units
- iOS safe area support
- Component-based CSS organization in `styles/components/` and `styles/screens/`

### State Management
- **Modular state**: Each component manages its own state (DeckManager, CardComponent, etc.)
- **Screen state**: ScreenManager maintains navigation state and screen history
- **Message state**: MessageSystem handles notification queuing and display
- **Combat state**: CombatEngine provides pure functions for game logic calculations

## Development Patterns

### Component Creation
- Extend `BaseScreen` for new screens (title, map, shop)
- Use `CardComponent` class for any card rendering needs
- Leverage `ModalManager` for dialog boxes and overlays
- Use `MessageSystem` for user feedback and notifications

### Data Management
- Import card data from `CardDataProvider` - never hardcode card stats
- Use `GameConstants` for all configuration values
- Validate cards with `CombatEngine.validateCard()` and `CombatEngine.validateCardSelection()`

### Screen Development
1. Create new screen class extending `BaseScreen`
2. Register with `ScreenManager` using `registerScreen()`
3. Implement `onShow()` and `onHide()` lifecycle methods
4. Use `screenManager.navigateTo()` for transitions

### Coding Conventions
- **ES6+ Modules**: Always use import/export for new files
- **Component Classes**: Use class-based architecture following existing patterns
- **Pure Functions**: CombatEngine methods should be static and pure
- **Event Handling**: Use arrow functions for event listeners to maintain `this` context
- **Constants**: Import from GameConstants.js rather than hardcoding values
- **Error Handling**: Use descriptive error messages and validate inputs