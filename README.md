# Football Card Strategy Game - Gameplay Summary

## **Game Setup**
- Each player has a **15-card deck** with NFL players (different cards for player vs enemy)
- Each card has **cost, rarity, position** stats that determine power
- Goal: Reach **100 yards** first to win
- Player starts at **10 yards**, enemy starts at **0 yards**

## **Round Flow**
- **Enemy goes first**: Draws 6 cards and immediately plays all 6 cards on the field
- **Player sees enemy cards**: Can view enemy's played cards and total power before making decisions
- **Player draws 6 cards**: Gets their hand after seeing enemy's move
- **Player can discard once per round**: Optional strategic discard + redraw
- **Player plays cards**: Selects cards to play, remaining cards auto-discarded
- **Round resolves**: Yard gains calculated based on power difference

## **Card Management**
- **6 cards drawn per round** by each player
- **All cards played/discarded** go to respective discard piles at round end
- **Deck counter shows remaining cards** in draw pile only (starts 15/15, becomes 9/15 after first draw)
- **Auto-reshuffle**: When draw pile empty, discard pile shuffles back into deck

## **Power & Scoring**
- **Card power = cost + rarity** (both stats visible on cards)
- **Yard gain = max(0, (your_power - enemy_power) / 2)** rounded down
- **Enemy plays all 6 cards every round** for maximum power
- **Strategic decisions**: Counter weak enemy rounds, go all-out vs strong rounds

## **UI Elements**
- **Field shows played cards** from both players until round ends
- **Enemy deck counter**: "Enemy: X/15" 
- **Player deck counter**: "Available X/15"
- **Yard progress**: "Your Yards X/100" and "Enemy Yards X/100"
- **Discard button disabled** after one use per round

## **Key Strategic Elements**
- **Information advantage**: See enemy cards before choosing your strategy
- **Resource management**: Balance when to use powerful cards vs save them
- **Discard timing**: One strategic discard per round to improve hand
- **Deck cycling**: Plan for when powerful cards return via reshuffle