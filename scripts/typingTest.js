// Core typing test functionality
// Coordinates: paragraph rendering, input checking, timer + metrics.

class TypingTest {
  constructor() {
    this.textDisplay = null;
    this.typingInput = null;
    this.startButton = null;
    this.tryAgainButton = null;

    this.paragraph = "";
    this.isActive = false; // game started (after Start click)

    this._boundOnInput = this._onInput.bind(this);
  }

  /**
   * Initialize with DOM elements (or auto-find by id).
   */
  init({
    textDisplay = document.getElementById("text-display"),
    typingInput = document.getElementById("typing-input"),
    startButton = document.getElementById("start-button"),
    tryAgainButton = document.getElementById("try-again-button"),
  } = {}) {
    this.textDisplay = textDisplay;
    this.typingInput = typingInput;
    this.startButton = startButton;
    this.tryAgainButton = tryAgainButton;

    if (!this.textDisplay || !this.typingInput) {
      console.error("TypingTest: missing required DOM elements");
      return;
    }

    // Initial state: waiting for Start
    this.typingInput.disabled = true;
    this.typingInput.value = "";
    if (this.startButton) this.startButton.style.display = "inline-block";
    if (this.tryAgainButton) this.tryAgainButton.style.display = "none";

    // Input listener
    this.typingInput.removeEventListener("input", this._boundOnInput);
    this.typingInput.addEventListener("input", this._boundOnInput);

    // Timer → metrics sync + completion
    if (typeof timer !== "undefined" && timer) {
      timer.onTick((timeRemaining, elapsedSeconds) => {
        if (!this.isActive) return;
        if (typeof metricsCalculator !== "undefined" && metricsCalculator) {
          metricsCalculator.updateWithElapsedTime(elapsedSeconds);
        }
      });

      timer.onComplete(() => {
        if (!this.isActive) return;
        this.end("timeout");
      });
    }

    // Initialize UI
    if (typeof metricsCalculator !== "undefined" && metricsCalculator) {
      metricsCalculator.reset();
    }
    if (typeof timer !== "undefined" && timer) {
      timer.reset();
    }
    this.render();
  }

  /**
   * Set the paragraph and re-render the display.
   */
  setParagraph(paragraph) {
    this.paragraph = String(paragraph || "");
    this.render();
  }

  /**
   * Start a new round (resets timer/metrics/input).
   */
  start() {
    this.isActive = true;

    if (typeof timer !== "undefined" && timer) {
      timer.reset();
    }
    if (typeof metricsCalculator !== "undefined" && metricsCalculator) {
      metricsCalculator.reset();
    }

    if (this.typingInput) {
      this.typingInput.disabled = false;
      this.typingInput.value = "";
      this.typingInput.focus();
    }

    if (this.startButton) this.startButton.style.display = "none";
    if (this.tryAgainButton) this.tryAgainButton.style.display = "none";

    this.render();
  }

  /**
   * Reset to the pre-start state (used by Try Again).
   */
  reset() {
    this.isActive = false;

    if (typeof timer !== "undefined" && timer) {
      timer.reset();
    }
    if (typeof metricsCalculator !== "undefined" && metricsCalculator) {
      metricsCalculator.reset();
    }

    if (this.typingInput) {
      this.typingInput.value = "";
      this.typingInput.disabled = true;
    }

    if (this.startButton) this.startButton.style.display = "inline-block";
    if (this.tryAgainButton) this.tryAgainButton.style.display = "none";

    this.render();
  }

  /**
   * End the current round (time up or completed).
   */
  end(reason = "timeout") {
    this.isActive = false;

    if (typeof timer !== "undefined" && timer) {
      timer.stop();
    }

    if (this.typingInput) {
      this.typingInput.disabled = true;
    }

    if (this.startButton) this.startButton.style.display = "none";
    if (this.tryAgainButton) this.tryAgainButton.style.display = "inline-block";

    // One last render so the caret doesn't keep blinking
    this.render();
    console.log(`TypingTest ended: ${reason}`);
  }

  _onInput() {
    if (!this.isActive) return;
    if (!this.typingInput) return;

    const typed = this.typingInput.value;

    // Start timer on first character typed
    if (
      typeof timer !== "undefined" &&
      timer &&
      !timer.getIsRunning() &&
      typed.length > 0
    ) {
      timer.start();
    }

    // Compute correctness
    const target = this.paragraph || "";
    let correct = 0;
    let mistakes = 0;

    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === (target[i] ?? "")) {
        correct++;
      } else {
        mistakes++;
      }
    }

    if (typeof metricsCalculator !== "undefined" && metricsCalculator) {
      metricsCalculator.update(typed.length, correct, mistakes);
      if (typeof timer !== "undefined" && timer) {
        metricsCalculator.updateWithElapsedTime(timer.getElapsedTime());
      }
    }

    this.render();

    // End early if completed perfectly
    if (typed.length >= target.length && mistakes === 0 && typed === target) {
      this.end("completed");
    }
  }

  /**
   * Render the paragraph with per-character highlighting.
   */
  render() {
    if (!this.textDisplay) return;

    const target = this.paragraph || "";
    const typed = this.typingInput ? this.typingInput.value : "";

    // Fast path: if no target, just show message
    if (!target) {
      this.textDisplay.textContent = "Click Start to begin.";
      return;
    }

    // Build spans safely (no innerHTML)
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < target.length; i++) {
      const span = document.createElement("span");
      const expectedChar = target[i];

      const isTyped = i < typed.length;
      const isCorrect = isTyped && typed[i] === expectedChar;
      const isIncorrect = isTyped && !isCorrect;
      const isCurrent =
        this.isActive && i === typed.length && typed.length < target.length;

      span.textContent = expectedChar;

      if (isTyped) span.classList.add("char-typed");
      if (isCorrect) span.classList.add("char-correct");
      if (isIncorrect) span.classList.add("char-incorrect");
      if (isCurrent) span.classList.add("char-current");

      fragment.appendChild(span);
    }

    this.textDisplay.textContent = "";
    this.textDisplay.appendChild(fragment);
  }
}

// Global instance (referenced by main.js)
const typingTest = new TypingTest();
