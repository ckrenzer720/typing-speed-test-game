// Core typing test functionality
// Coordinates: paragraph rendering, input checking, timer + metrics.

/**
 * Compute correct character count and mistake count (typed vs target).
 * Used by _onInput and by runTypingTestTests().
 * @param {string} typed - User input
 * @param {string} target - Expected text
 * @returns {{ correct: number, mistakes: number }}
 */
function computeCorrectness(typed, target) {
  const t = String(typed);
  const ref = String(target || "");
  let correct = 0;
  let mistakes = 0;
  for (let i = 0; i < t.length; i++) {
    if (t[i] === (ref[i] ?? "")) correct++;
    else mistakes++;
  }
  return { correct, mistakes };
}

class TypingTest {
  constructor() {
    this.textDisplay = null;
    this.typingInput = null;
    this.startButton = null;
    this.tryAgainButton = null;

    this.paragraph = "";
    this.isActive = false; // game started (after Start click)
    this._renderScheduled = false;

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
    const { correct, mistakes } = computeCorrectness(typed, target);

    if (typeof metricsCalculator !== "undefined" && metricsCalculator) {
      metricsCalculator.update(typed.length, correct, mistakes);
      if (typeof timer !== "undefined" && timer) {
        metricsCalculator.updateWithElapsedTime(timer.getElapsedTime());
      }
    }

    this.scheduleRender();

    // End early if completed perfectly (length + mistakes avoids full string compare)
    if (typed.length === target.length && mistakes === 0) {
      this.end("completed");
    }
  }

  /**
   * Schedule a single render on the next animation frame (throttles rapid input).
   */
  scheduleRender() {
    if (this._renderScheduled) return;
    this._renderScheduled = true;
    const self = this;
    requestAnimationFrame(() => {
      self._renderScheduled = false;
      self.render();
    });
  }

  /**
   * Render the paragraph with per-character highlighting.
   */
  render() {
    if (!this.textDisplay) return;

    const target = this.paragraph || "";
    const typed = this.typingInput ? this.typingInput.value : "";

    if (!target) {
      this.textDisplay.textContent = "Click Start to begin.";
      return;
    }

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

/**
 * Run tests on typingTest logic and (in browser) DOM wiring.
 * Call from console: runTypingTestTests()
 * @returns {{ passed: number, failed: number, results: Array }}
 */
function runTypingTestTests() {
  const results = [];
  let passed = 0;
  let failed = 0;

  function assert(name, condition, expected, actual) {
    if (condition) {
      results.push({ test: name, status: "PASS", expected, actual });
      passed++;
    } else {
      results.push({ test: name, status: "FAIL", expected, actual });
      failed++;
    }
  }

  // --- computeCorrectness(typed, target) ---
  let r = computeCorrectness("", "abc");
  assert("Empty typed: 0 correct", r.correct === 0, 0, r.correct);
  assert("Empty typed: 0 mistakes", r.mistakes === 0, 0, r.mistakes);

  r = computeCorrectness("abc", "abc");
  assert("Exact match: 3 correct", r.correct === 3, 3, r.correct);
  assert("Exact match: 0 mistakes", r.mistakes === 0, 0, r.mistakes);

  r = computeCorrectness("axc", "abc");
  assert("One wrong char: 2 correct", r.correct === 2, 2, r.correct);
  assert("One wrong char: 1 mistake", r.mistakes === 1, 1, r.mistakes);

  r = computeCorrectness("abcd", "abc");
  assert("Extra char: 3 correct", r.correct === 3, 3, r.correct);
  assert("Extra char: 1 mistake", r.mistakes === 1, 1, r.mistakes);

  r = computeCorrectness("ab", "abc");
  assert("Short typed: 2 correct", r.correct === 2, 2, r.correct);
  assert("Short typed: 0 mistakes", r.mistakes === 0, 0, r.mistakes);

  r = computeCorrectness("hello world", "hello world");
  assert("Words exact: 11 correct", r.correct === 11, 11, r.correct);
  assert("Words exact: 0 mistakes", r.mistakes === 0, 0, r.mistakes);

  // --- DOM / global instance (only when in browser with full page) ---
  if (
    typeof document !== "undefined" &&
    document.getElementById("text-display") &&
    document.getElementById("typing-input")
  ) {
    assert(
      "typingTest exists",
      typeof typingTest !== "undefined" && typingTest !== null,
      true,
      !!typingTest,
    );
    assert(
      "text-display present",
      !!document.getElementById("text-display"),
      true,
      !!document.getElementById("text-display"),
    );
    assert(
      "typing-input present",
      !!document.getElementById("typing-input"),
      true,
      !!document.getElementById("typing-input"),
    );
    assert(
      "start-button present",
      !!document.getElementById("start-button"),
      true,
      !!document.getElementById("start-button"),
    );
    assert(
      "timer element present",
      !!document.getElementById("timer"),
      true,
      !!document.getElementById("timer"),
    );
  }

  console.log(
    "%c--- typingTest.js Test Results ---",
    "font-weight: bold; font-size: 14px",
  );
  results.forEach((r) => {
    const style = r.status === "PASS" ? "color: green" : "color: red";
    const extra =
      r.expected !== undefined
        ? ` (expected: ${r.expected}, got: ${r.actual})`
        : "";
    console.log(`%c${r.status} ${r.test}${extra}`, style);
  });
  console.log(
    `%cTotal: ${passed} passed, ${failed} failed`,
    "font-weight: bold",
    passed + failed,
    "tests",
  );
  return { passed, failed, results };
}
