// Main application logic

// DOM Elements
const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');
const startButton = document.getElementById('start-button');
const tryAgainButton = document.getElementById('try-again-button');

// Initialize the application
async function init() {
    // Initialize timer display
    timer.updateDisplay();
    
    // Load paragraphs from JSON
    await textGenerator.initialize();
    
    // Load and display initial paragraph
    loadNewParagraph();
    
    // Set up event listeners
    setupEventListeners();
}

/**
 * Load a new random paragraph and display it
 */
function loadNewParagraph() {
    const paragraph = textGenerator.getRandomParagraph();
    
    if (paragraph) {
        // Display the paragraph in the text display area
        textDisplay.textContent = paragraph;
    } else {
        textDisplay.textContent = 'Error: Could not load paragraph. Please refresh the page.';
    }
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Start button click
    startButton.addEventListener('click', () => {
        // Focus on the input field when starting
        typingInput.focus();
    });

    // Try again button click
    tryAgainButton.addEventListener('click', () => {
        // Reset and load new paragraph
        resetGame();
        loadNewParagraph();
    });
}

/**
 * Reset the game state
 */
function resetGame() {
    typingInput.value = '';
    typingInput.disabled = false;
    startButton.style.display = 'inline-block';
    tryAgainButton.style.display = 'none';
    timer.reset();
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
