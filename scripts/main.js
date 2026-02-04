// Main application logic

// DOM Elements
const textDisplay = document.getElementById("text-display");
const typingInput = document.getElementById("typing-input");
const startButton = document.getElementById("start-button");
const tryAgainButton = document.getElementById("try-again-button");

// Initialize the application
async function init() {
  if (typeof timer !== "undefined" && timer) {
    timer.updateDisplay();
  }

  try {
    await textGenerator.initialize();
  } catch (err) {
    console.error("Failed to load paragraphs:", err);
    if (textDisplay) {
      textDisplay.textContent =
        "Error: Could not load paragraphs. Please refresh the page.";
    }
    setupEventListeners();
    return;
  }

  if (typeof typingTest !== "undefined" && typingTest) {
    typingTest.init({ textDisplay, typingInput, startButton, tryAgainButton });
  }

  loadNewParagraph();
  setupEventListeners();
}

/**
 * Load a new random paragraph and display it
 */
function loadNewParagraph() {
  const paragraph = textGenerator.getRandomParagraph();

  if (paragraph) {
    if (typeof typingTest !== "undefined" && typingTest) {
      typingTest.setParagraph(paragraph);
    } else if (textDisplay) {
      textDisplay.textContent = paragraph;
    }
  } else if (textDisplay) {
    textDisplay.textContent =
      "Error: Could not load paragraph. Please refresh the page.";
  }
}

/**
 * Start a new run (same as clicking Start). Used by button and Ctrl+Enter.
 */
function startRun() {
  if (typeof typingTest !== "undefined" && typingTest) {
    typingTest.start();
  } else if (typingInput) {
    typingInput.focus();
  }
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  if (startButton) {
    startButton.addEventListener("click", startRun);
  }

  if (tryAgainButton) {
    tryAgainButton.addEventListener("click", () => {
      resetGame();
      loadNewParagraph();
    });
  }

  // Ctrl+Enter: start a new run when Start button is visible
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || !e.ctrlKey) return;
    const startVisible =
      startButton && window.getComputedStyle(startButton).display !== "none";
    if (!startVisible) return;
    e.preventDefault();
    startRun();
  });
}

/**
 * Reset the game state
 */
function resetGame() {
  if (typeof typingTest !== "undefined" && typingTest) {
    typingTest.reset();
  } else {
    if (typingInput) {
      typingInput.value = "";
      typingInput.disabled = false;
    }
    if (startButton) startButton.style.display = "inline-block";
    if (tryAgainButton) tryAgainButton.style.display = "none";
    if (typeof timer !== "undefined" && timer) timer.reset();
  }
}

// Initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
