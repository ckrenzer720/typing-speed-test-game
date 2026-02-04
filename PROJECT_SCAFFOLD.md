# Typing Speed Test Game - Project Scaffold

## Project Overview

A web-based typing speed test game that measures typing performance with real-time metrics including WPM, CPM, accuracy, and mistake tracking. Maximum test duration is 30 seconds.

## Technology Stack Recommendations

- **Frontend Framework**: HTML5, CSS3, JavaScript (Vanilla or React/Vue)
- **Styling**: CSS (or CSS-in-JS if using a framework)
- **Build Tool**: (Optional) Vite, Webpack, or Parcel if using a framework

## Project Structure

```
typing-speed-test-game/
│
├── index.html                 # Main HTML entry point
├── styles/
│   ├── main.css              # Main stylesheet
│   └── components.css        # Component-specific styles
│
├── scripts/
│   ├── main.js               # Main application logic
│   ├── typingTest.js         # Core typing test functionality
│   ├── timer.js              # Timer management (30s countdown)
│   ├── metrics.js            # WPM, CPM, Accuracy calculations
│   └── textGenerator.js      # Paragraph/text generation/loading
│
├── data/
│   └── paragraphs.json       # Collection of test paragraphs
│
├── assets/
│   └── (images, icons if needed)
│
└── README.md                  # Project documentation
```

## Core Features Breakdown

### 1. **Text Display Area**

- Shows the paragraph to be typed
- Highlights current character/word
- Visual feedback for correct/incorrect characters
- Scrollable if paragraph is long

### 2. **Input Area**

- Text input field (or contenteditable div)
- Handles character-by-character comparison
- Backspace functionality for corrections
- Prevents typing after timer ends

### 3. **Timer System**

- 30-second maximum countdown
- Starts when first character is typed
- Stops when time expires or all text is completed
- Real-time display

### 4. **Metrics Display Panel**

- **Time**: Remaining/elapsed time
- **Mistakes**: Total incorrect characters
- **WPM**: Words Per Minute calculation
- **CPM**: Characters Per Minute calculation
- **Accuracy**: Percentage of correct characters

### 5. **Control Buttons**

- **Start/Try Again Button**:
  - Resets all metrics
  - Loads new paragraph
  - Resets timer
  - Clears input

## Key Functionalities to Implement

### Timer Logic

- Initialize at 30 seconds
- Start on first keystroke
- Countdown or count up (depending on UX preference)
- Stop when time expires or test completes
- Disable input when timer reaches 0

### Character Comparison

- Compare typed character with expected character at current position
- Track correct vs incorrect characters
- Handle backspace to move cursor backward
- Update visual indicators (green for correct, red for incorrect)

### Metrics Calculations

- **WPM**: (Total words typed / time in minutes) - adjusted for mistakes
- **CPM**: (Total characters typed / time in minutes)
- **Accuracy**: (Correct characters / Total characters) × 100
- **Mistakes**: Count of incorrect characters (before backspace corrections)

### Text Management

- Load paragraphs from data source
- Random selection or sequential
- Handle paragraph completion
- Reset for new test

### State Management

- Test state (idle, active, completed)
- Current position in text
- Typed characters array
- Timer state
- Metrics state

## User Flow

1. **Initial State** (on load; set by `main.init()` → `typingTest.init()` → `loadNewParagraph()`):

   - Paragraph displayed (random from `data/paragraphs.json`)
   - Input field empty and disabled until Start
   - Timer at **00:30** (30 seconds in MM:SS)
   - Metrics at 0 (Time 0s, Mistakes 0, WPM 0, CPM 0, Accuracy 0%)
   - "Start" button visible; "Try Again" hidden

2. **Active State** (after first keystroke):

   - Timer starts counting down
   - Real-time character comparison
   - Metrics update continuously
   - Visual feedback on each keystroke

3. **Completion State** (time expires OR all text typed):

   - Timer stops
   - Final metrics displayed
   - Input disabled
   - "Try Again" button appears

4. **Reset State** (after clicking Try Again):
   - New paragraph loaded
   - All metrics reset
   - Timer reset to 00:30 (30 seconds)
   - Input cleared and disabled
   - Return to Initial State (Start visible, Try Again hidden)

## UI/UX Considerations

- Clean, distraction-free interface
- Large, readable font for text
- Clear visual distinction between correct/incorrect characters
- Prominent metrics display
- Responsive design for different screen sizes
- Keyboard-only navigation support
- Focus management for accessibility

## Data Requirements

- Collection of diverse paragraphs (various lengths and difficulty)
- Each paragraph should be substantial enough for 30-second tests
- Mix of common words and some challenging vocabulary

## Future Enhancements (Optional)

- Difficulty levels (Easy, Medium, Hard)
- Different time limits (30s, 60s, 120s)
- Statistics/history tracking
- Leaderboard
- Custom text input
- Sound effects for correct/incorrect keystrokes
- Themes/dark mode
