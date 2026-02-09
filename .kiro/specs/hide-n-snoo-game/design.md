# Design Document - Hide N' Snoo

## Game Architecture

### Screen Flow System
```
Homescreen → Guidelines Screen → Game Screen → [Win/Lose] → End Game
     ↑                                           ↓
     ←←←←←←←←←←←←← Try Again Screen ←←←←←←←←←←←←←←←
```

### Core Components

#### 1. Screen Manager
- **Purpose**: Controls navigation between game screens
- **States**: `homescreen`, `guidelines`, `game`, `try-again`, `congratulations`, `end-game`
- **Transitions**: Strict flow enforcement with no screen skipping

#### 2. UI Color System (STRICT)
```typescript
const COLORS = {
  PRIMARY_BRAND: '#FF4500',      // Orangered - Primary buttons, logo
  POSITIVE_FEEDBACK: '#FF8B60',   // Crusta - Success, correct actions
  NEGATIVE_FEEDBACK: '#9494FF',   // Portage - Errors, life loss
  BACKGROUND_MAIN: '#FFFFFF',     // White - Main UI clarity
  BACKGROUND_POPUP: '#000000'     // Black - Popups, overlays, contrast
};
```

#### 3. Game State Manager
```typescript
interface GameState {
  screen: 'homescreen' | 'guidelines' | 'game' | 'try-again' | 'congratulations' | 'end-game';
  lives: number;
  timeLeft: number;
  backgroundImage: string;
  snooPosition: { x: number; y: number };
  gameId: string;
  showGuidelinesPopup: boolean;
}
```

## Screen Specifications

### 1. Homescreen
- **Background**: White (#FFFFFF)
- **Elements**: 
  - Game title/logo
  - Play Game button (Orangered #FF4500)
- **Behavior**: Click Play Game → Navigate to Guidelines Screen

### 2. Guidelines Screen
- **Background**: White (#FFFFFF)
- **Auto-popup**: Guidelines Popup (Black #000000 background)
- **Popup Elements**:
  - Instructions text
  - Close button
- **Behavior**: 
  - Popup blocks all interaction
  - Close button → Hide popup, continue to Game Screen
  - No close click → Popup remains active

### 3. Game Screen
- **Background**: Generated random image
- **UI Elements**:
  - Lives counter (Portage #9494FF when low)
  - Timer display (Portage #9494FF when low)
  - Hidden Snoo at random position
- **Behavior**:
  - Continuous timer countdown
  - Click detection on image
  - Real-time condition checking

### 4. Try Again Screen
- **Background**: Black (#000000) popup overlay
- **Elements**:
  - "Game Over" message
  - Try Again button (Orangered #FF4500)
- **Behavior**:
  - Blocks interaction behind popup
  - Try Again → Return to Homescreen
  - No click → Remain on screen

### 5. Congratulations Screen
- **Background**: Black (#000000) popup overlay
- **Elements**:
  - Congratulatory message (Crusta #FF8B60)
  - Time finished display
  - Leaderboard
  - Player ranking
- **Behavior**:
  - Auto-proceed to End Game after display
  - Show results with positive color feedback

## Technical Implementation

### Image Generation System
```typescript
// Generate random colorful patterns as data URLs
const BACKGROUND_PATTERNS = [
  // Geometric patterns
  // Abstract shapes
  // Colorful designs
];

function generateRandomImage(): string {
  return BACKGROUND_PATTERNS[Math.floor(Math.random() * BACKGROUND_PATTERNS.length)];
}
```

### Snoo Placement System
```typescript
function generateSnooPosition(): { x: number; y: number } {
  return {
    x: Math.random() * 80 + 10, // 10-90% to avoid edges
    y: Math.random() * 80 + 10  // 10-90% to avoid edges
  };
}
```

### Click Detection System
```typescript
function isClickNearSnoo(clickX: number, clickY: number, snooX: number, snooY: number): boolean {
  const distance = Math.sqrt(Math.pow(clickX - snooX, 2) + Math.pow(clickY - snooY, 2));
  return distance <= 6; // 6% radius for Snoo hit area
}
```

### Timer System
```typescript
// Continuous countdown from 60 seconds
// Real-time updates every second
// Auto-trigger lose condition at 0
```

### Lives System
```typescript
// Start with 3 lives
// Reduce by 1 on incorrect click
// Auto-trigger lose condition at 0
```

## API Endpoints

### Game Initialization
- **Endpoint**: `POST /api/game/init`
- **Response**: Game ID, background image, Snoo position

### Click Processing
- **Endpoint**: `POST /api/game/click`
- **Payload**: Game ID, click coordinates
- **Response**: Hit status, remaining lives

### Game Completion
- **Endpoint**: `POST /api/game/complete`
- **Payload**: Game ID, win status, time finished
- **Response**: Final results, leaderboard, player rank

## Mobile Responsiveness

### Touch Interactions
- Large touch targets for buttons
- Responsive image scaling
- Touch-friendly UI elements

### Screen Adaptations
- Flexible layouts for different screen sizes
- Readable text on mobile devices
- Optimized button sizes for touch

## Error Handling

### Network Failures
- Graceful degradation
- Retry mechanisms
- User-friendly error messages

### Invalid States
- State validation
- Fallback behaviors
- Recovery mechanisms

## Performance Requirements

### Response Times
- Click detection: < 100ms
- Screen transitions: < 200ms
- Image loading: < 500ms

### Resource Management
- Efficient image generation
- Memory cleanup
- Optimized rendering
