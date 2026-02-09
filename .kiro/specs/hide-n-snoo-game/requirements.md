# Requirements Document

## Introduction

Hide N' Snoo is a 2D casual hidden-object game for Reddit's Devvit platform where players must find a hidden character called Snoo within generated images before time or lives run out. The game follows a strict screen flow with specific UI design requirements and gameplay mechanics.

## Glossary

- **Snoo**: The hidden character that players must find and click
- **Homescreen**: The initial screen with Play Game button
- **Guidelines_Screen**: Instruction screen with popup overlay
- **Game_Screen**: Main gameplay area where players search for Snoo
- **Try_Again_Screen**: Game over screen displayed when player loses
- **Congratulations_Screen**: Victory screen showing results and leaderboard
- **Lives_System**: Mechanism tracking player attempts (reduced on incorrect clicks)
- **Timer_System**: Countdown timer that ends the game when it reaches zero
- **Image_Generator**: System that creates random background images
- **Snoo_Placement**: Random positioning system for hiding Snoo in images
- **UI_Color_System**: Strict color palette for consistent visual design

## Requirements

### Requirement 1: Homescreen Display

**User Story:** As a player, I want to see a clear homescreen with a Play Game button, so that I can start playing Hide N' Snoo.

#### Acceptance Criteria

1. WHEN the game loads, THE Homescreen SHALL display with a white (#FFFFFF) background
2. WHEN the homescreen is shown, THE UI_Color_System SHALL use orangered (#FF4500) for the Play Game button
3. WHEN the Play Game button is displayed, THE button SHALL be clearly visible and interactive
4. WHEN a player clicks Play Game, THE system SHALL navigate to the Guidelines Screen
5. WHEN the homescreen is active, THE system SHALL not display any other game elements

### Requirement 2: Guidelines Screen and Popup

**User Story:** As a player, I want to read game instructions before playing, so that I understand how to find Snoo.

#### Acceptance Criteria

1. WHEN the Guidelines Screen loads, THE system SHALL automatically display a Guidelines Popup
2. WHEN the Guidelines Popup is shown, THE popup SHALL block all interaction behind it
3. WHEN the popup displays instructions, THE background SHALL use black (#000000) for contrast
4. WHEN a player clicks Close on the popup, THE popup SHALL close and allow game continuation
5. WHEN a player does not click Close, THE popup SHALL remain active and block progression

### Requirement 3: Game Screen Initialization

**User Story:** As a player, I want the game to generate a random image with hidden Snoo, so that each playthrough is unique.

#### Acceptance Criteria

1. WHEN entering the Game Screen, THE Image_Generator SHALL create a random background image
2. WHEN the image is generated, THE Snoo_Placement SHALL randomly position Snoo within the image
3. WHEN the game initializes, THE Lives_System SHALL set lives to a fixed number (3 lives)
4. WHEN the game starts, THE Timer_System SHALL begin countdown from a fixed time (60 seconds)
5. WHEN all initialization is complete, THE game SHALL display the image with UI elements

### Requirement 4: Gameplay Mechanics and Click Detection

**User Story:** As a player, I want my clicks to be detected accurately, so that I can find Snoo or receive feedback for incorrect clicks.

#### Acceptance Criteria

1. WHEN a player clicks/taps the image, THE system SHALL detect the click coordinates
2. WHEN a click is incorrect, THE Lives_System SHALL reduce lives by one
3. WHEN lives are reduced, THE UI_Color_System SHALL use portage (#9494FF) for negative feedback
4. WHEN a correct click occurs, THE system SHALL use crusta (#FF8B60) for positive feedback
5. WHEN all conditions are met, THE system SHALL check win/lose states in real time

### Requirement 5: Timer and Life Loss Conditions

**User Story:** As a player, I want clear feedback when I'm running out of time or lives, so that I understand the game state.

#### Acceptance Criteria

1. WHEN the timer counts down, THE Timer_System SHALL continuously update the display
2. WHEN lives reach zero, THE system SHALL immediately display the Try Again Screen
3. WHEN time runs out, THE system SHALL immediately display the Try Again Screen
4. WHEN either condition occurs, THE system SHALL use black (#000000) background for the popup
5. WHEN the Try Again Screen is shown, THE system SHALL block all interaction behind it

### Requirement 6: Try Again Screen Logic

**User Story:** As a player, I want to restart the game when I lose, so that I can try again to find Snoo.

#### Acceptance Criteria

1. WHEN the Try Again Screen displays, THE system SHALL show a Try Again button using orangered (#FF4500)
2. WHEN the Try Again button is clicked, THE system SHALL return to the Homescreen
3. WHEN the Try Again button is not clicked, THE popup SHALL remain active
4. WHEN returning to Homescreen, THE system SHALL reset all game state
5. WHEN the screen is active, THE system SHALL prevent interaction with game elements behind it

### Requirement 7: Win Condition and Congratulations Screen

**User Story:** As a player, I want to see my results and ranking when I win, so that I can track my performance.

#### Acceptance Criteria

1. WHEN Snoo is found, THE system SHALL immediately display the Congratulations Screen
2. WHEN the Congratulations Screen shows, THE system SHALL display time finished, leaderboard, and player ranking
3. WHEN results are shown, THE system SHALL use crusta (#FF8B60) for positive elements
4. WHEN the congratulations display completes, THE system SHALL proceed to End Game
5. WHEN End Game occurs, THE system SHALL require restart from Homescreen to play again

### Requirement 8: UI Color System Compliance

**User Story:** As a player, I want consistent visual feedback, so that I can understand game states through color coding.

#### Acceptance Criteria

1. WHEN any primary button is displayed, THE UI_Color_System SHALL use orangered (#FF4500)
2. WHEN positive feedback is needed, THE system SHALL use crusta (#FF8B60)
3. WHEN negative feedback is needed, THE system SHALL use portage (#9494FF)
4. WHEN main UI is displayed, THE system SHALL use white (#FFFFFF) backgrounds
5. WHEN popups or overlays are shown, THE system SHALL use black (#000000) backgrounds
