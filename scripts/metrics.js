// WPM, CPM, Accuracy calculations

class MetricsCalculator {
  constructor() {
    this.totalCharacters = 0;
    this.correctCharacters = 0;
    this.mistakes = 0;
    this.startTime = null;
    this.isActive = false;
    this._displayEls = null; // cache: { wpm, cpm, accuracy, mistakes }
  }

  /**
   * Start tracking metrics
   */
  start() {
    this.isActive = true;
    this.startTime = Date.now();
  }

  /**
   * Reset all metrics to initial state
   */
  reset() {
    this.totalCharacters = 0;
    this.correctCharacters = 0;
    this.mistakes = 0;
    this.startTime = null;
    this.isActive = false;
    this.updateDisplay();
  }

  /**
   * Set character counts without updating the display (use with updateWithElapsedTime to update once)
   * @param {number} totalChars - Total characters typed
   * @param {number} correctChars - Correct characters typed
   * @param {number} mistakesCount - Total mistakes made
   */
  setCounts(totalChars, correctChars, mistakesCount) {
    if (!this.isActive && totalChars > 0) {
      this.start();
    }
    this.totalCharacters = totalChars;
    this.correctCharacters = correctChars;
    this.mistakes = mistakesCount;
  }

  /**
   * Update metrics based on typing data
   * @param {number} totalChars - Total characters typed
   * @param {number} correctChars - Correct characters typed
   * @param {number} mistakesCount - Total mistakes made
   */
  update(totalChars, correctChars, mistakesCount) {
    this.setCounts(totalChars, correctChars, mistakesCount);
    this.calculateAndUpdate();
  }

  /**
   * Calculate all metrics and update the display
   */
  calculateAndUpdate() {
    const elapsedTime = this.getElapsedTimeInMinutes();

    // Calculate metrics
    const wpm = this.calculateWPM(elapsedTime);
    const cpm = this.calculateCPM(elapsedTime);
    const accuracy = this.calculateAccuracy();

    // Update DOM
    this.updateDisplay(wpm, cpm, accuracy);
  }

  /**
   * Calculate Words Per Minute (WPM)
   * Standard: 5 characters = 1 word
   * @param {number} timeInMinutes - Elapsed time in minutes
   * @returns {number} WPM value
   */
  calculateWPM(timeInMinutes) {
    if (timeInMinutes <= 0 || this.totalCharacters === 0) {
      return 0;
    }

    // Standard: 5 characters (including spaces) = 1 word
    const words = this.correctCharacters / 5;
    const wpm = words / timeInMinutes;

    return Math.round(wpm);
  }

  /**
   * Calculate Characters Per Minute (CPM)
   * @param {number} timeInMinutes - Elapsed time in minutes
   * @returns {number} CPM value
   */
  calculateCPM(timeInMinutes) {
    if (timeInMinutes <= 0 || this.totalCharacters === 0) {
      return 0;
    }

    const cpm = this.totalCharacters / timeInMinutes;
    return Math.round(cpm);
  }

  /**
   * Calculate typing accuracy percentage
   * @returns {number} Accuracy percentage (0-100)
   */
  calculateAccuracy() {
    if (this.totalCharacters === 0) {
      return 0;
    }

    const accuracy = (this.correctCharacters / this.totalCharacters) * 100;
    return Math.round(accuracy * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Get elapsed time in minutes
   * @returns {number} Elapsed time in minutes
   */
  getElapsedTimeInMinutes() {
    if (!this.startTime) {
      return 0;
    }

    const elapsedMs = Date.now() - this.startTime;
    const elapsedMinutes = elapsedMs / (1000 * 60);

    return elapsedMinutes;
  }

  /**
   * Get elapsed time in seconds
   * @returns {number} Elapsed time in seconds
   */
  getElapsedTimeInSeconds() {
    if (!this.startTime) {
      return 0;
    }

    const elapsedMs = Date.now() - this.startTime;
    return Math.floor(elapsedMs / 1000);
  }

  /**
   * Update the display with calculated metrics (caches DOM refs after first use)
   * @param {number} wpm - Words Per Minute
   * @param {number} cpm - Characters Per Minute
   * @param {number} accuracy - Accuracy percentage
   */
  updateDisplay(wpm = 0, cpm = 0, accuracy = 0) {
    if (!this._displayEls) {
      this._displayEls = {
        wpm: document.getElementById("wpm-metric"),
        cpm: document.getElementById("cpm-metric"),
        accuracy: document.getElementById("accuracy-metric"),
        mistakes: document.getElementById("mistakes-metric"),
      };
    }
    const el = this._displayEls;
    if (el.wpm) el.wpm.textContent = wpm;
    if (el.cpm) el.cpm.textContent = cpm;
    if (el.accuracy) el.accuracy.textContent = `${accuracy}%`;
    if (el.mistakes) el.mistakes.textContent = this.mistakes;
  }

  /**
   * Get current metrics as an object
   * @returns {Object} Object containing all current metrics
   */
  getMetrics() {
    const elapsedTime = this.getElapsedTimeInMinutes();

    return {
      wpm: this.calculateWPM(elapsedTime),
      cpm: this.calculateCPM(elapsedTime),
      accuracy: this.calculateAccuracy(),
      mistakes: this.mistakes,
      totalCharacters: this.totalCharacters,
      correctCharacters: this.correctCharacters,
      elapsedTime: this.getElapsedTimeInSeconds(),
    };
  }

  /**
   * Update metrics using elapsed time from timer
   * Useful when timer is managing time separately
   * @param {number} elapsedSeconds - Elapsed time in seconds from timer
   */
  updateWithElapsedTime(elapsedSeconds) {
    if (elapsedSeconds <= 0 || this.totalCharacters === 0) {
      this.updateDisplay();
      return;
    }

    const elapsedMinutes = elapsedSeconds / 60;
    const wpm = this.calculateWPM(elapsedMinutes);
    const cpm = this.calculateCPM(elapsedMinutes);
    const accuracy = this.calculateAccuracy();

    this.updateDisplay(wpm, cpm, accuracy);
  }

  /**
   * Update metrics with a fixed elapsed time (for testing)
   * Sets counts and calculates WPM/CPM/Accuracy using the given time
   * @param {number} totalChars - Total characters typed
   * @param {number} correctChars - Correct characters typed
   * @param {number} mistakesCount - Total mistakes
   * @param {number} elapsedSeconds - Elapsed time in seconds
   */
  updateForTest(totalChars, correctChars, mistakesCount, elapsedSeconds) {
    this.totalCharacters = totalChars;
    this.correctCharacters = correctChars;
    this.mistakes = mistakesCount;

    if (elapsedSeconds <= 0 || totalChars === 0) {
      this.updateDisplay();
      return;
    }

    const elapsedMinutes = elapsedSeconds / 60;
    const wpm = this.calculateWPM(elapsedMinutes);
    const cpm = this.calculateCPM(elapsedMinutes);
    const accuracy = this.calculateAccuracy();
    this.updateDisplay(wpm, cpm, accuracy);
  }
}

// Create a global metrics calculator instance
const metricsCalculator = new MetricsCalculator();

/**
 * Run tests on the metrics calculator and log results
 * Call from console: runMetricsTests()
 * @returns {Object} { passed: number, failed: number, results: Array }
 */
function runMetricsTests() {
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

  // Test 1: Reset displays zeros
  metricsCalculator.reset();
  const wpmEl = document.getElementById("wpm-metric");
  const cpmEl = document.getElementById("cpm-metric");
  const accEl = document.getElementById("accuracy-metric");
  const misEl = document.getElementById("mistakes-metric");

  assert(
    "Reset: WPM is 0",
    wpmEl && wpmEl.textContent === "0",
    0,
    wpmEl?.textContent
  );
  assert(
    "Reset: CPM is 0",
    cpmEl && cpmEl.textContent === "0",
    0,
    cpmEl?.textContent
  );
  assert(
    "Reset: Accuracy is 0%",
    accEl && accEl.textContent === "0%",
    "0%",
    accEl?.textContent
  );
  assert(
    "Reset: Mistakes is 0",
    misEl && misEl.textContent === "0",
    0,
    misEl?.textContent
  );

  // Test 2: 60 chars, 60 correct, 0 mistakes, 60 seconds -> CPM=60, WPM=12, Accuracy=100%
  metricsCalculator.updateForTest(60, 60, 0, 60);
  const wpm2 = metricsCalculator.calculateWPM(1); // 1 minute
  const cpm2 = metricsCalculator.calculateCPM(1);
  const acc2 = metricsCalculator.calculateAccuracy();
  assert("60 chars/60s: CPM=60", cpm2 === 60, 60, cpm2);
  assert("60 correct/60s: WPM=12", wpm2 === 12, 12, wpm2);
  assert("60/60 correct: Accuracy=100%", acc2 === 100, 100, acc2);

  // Test 3: 100 chars, 90 correct, 10 mistakes, 60 seconds -> CPM=100, WPM=18, Accuracy=90%
  metricsCalculator.totalCharacters = 100;
  metricsCalculator.correctCharacters = 90;
  metricsCalculator.mistakes = 10;
  const wpm3 = metricsCalculator.calculateWPM(1);
  const cpm3 = metricsCalculator.calculateCPM(1);
  const acc3 = metricsCalculator.calculateAccuracy();
  assert("100 chars/60s: CPM=100", cpm3 === 100, 100, cpm3);
  assert("90 correct/60s: WPM=18", wpm3 === 18, 18, wpm3);
  assert("90/100: Accuracy=90%", acc3 === 90, 90, acc3);

  // Test 4: Zero characters -> all zeros
  metricsCalculator.updateForTest(0, 0, 0, 60);
  const wpm4 = metricsCalculator.calculateWPM(1);
  const cpm4 = metricsCalculator.calculateCPM(1);
  const acc4 = metricsCalculator.calculateAccuracy();
  assert("0 chars: WPM=0", wpm4 === 0, 0, wpm4);
  assert("0 chars: CPM=0", cpm4 === 0, 0, cpm4);
  assert("0 chars: Accuracy=0", acc4 === 0, 0, acc4);

  // Test 5: 50 chars in 30 seconds -> CPM=100, WPM=20
  metricsCalculator.updateForTest(50, 50, 0, 30);
  const wpm5 = metricsCalculator.calculateWPM(0.5); // 30 sec = 0.5 min
  const cpm5 = metricsCalculator.calculateCPM(0.5);
  assert("50 chars/30s: CPM=100", cpm5 === 100, 100, cpm5);
  assert("50 correct/30s: WPM=20", wpm5 === 20, 20, wpm5);

  // Test 6: getMetrics() returns correct shape (uses internal state; elapsed from timer in real use)
  metricsCalculator.updateForTest(25, 24, 1, 15);
  metricsCalculator.start(); // start timer so getElapsedTimeInMinutes works
  const metrics = metricsCalculator.getMetrics();
  const hasShape =
    typeof metrics.wpm === "number" &&
    typeof metrics.cpm === "number" &&
    typeof metrics.accuracy === "number" &&
    typeof metrics.mistakes === "number" &&
    typeof metrics.totalCharacters === "number" &&
    typeof metrics.correctCharacters === "number";
  assert(
    "getMetrics() returns valid object with all fields",
    hasShape,
    true,
    hasShape
  );
  assert(
    "getMetrics() mistakes count",
    metrics.mistakes === 1,
    1,
    metrics.mistakes
  );

  // Reset for normal use
  metricsCalculator.reset();

  // Log summary
  console.log(
    "%c--- Metrics.js Test Results ---",
    "font-weight: bold; font-size: 14px"
  );
  results.forEach((r) => {
    const style = r.status === "PASS" ? "color: green" : "color: red";
    console.log(
      `%c${r.status} ${r.test}`,
      style,
      r.expected !== undefined
        ? `(expected: ${r.expected}, got: ${r.actual})`
        : ""
    );
  });
  console.log(
    `%cTotal: ${passed} passed, ${failed} failed`,
    "font-weight: bold",
    passed + failed,
    "tests"
  );
  return { passed, failed, results };
}
