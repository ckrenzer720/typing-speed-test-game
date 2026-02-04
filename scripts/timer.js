// Timer management (30s countdown)

class Timer {
  constructor(maxTime = 30) {
    this.maxTime = maxTime; // Maximum time in seconds (30 seconds)
    this.timeRemaining = maxTime;
    this.isRunning = false;
    this.isPaused = false;
    this.intervalId = null;
    this.startTime = null;
    this.elapsedTime = 0;
    this.callbacks = {
      onTick: null,
      onComplete: null,
      onStart: null,
    };
  }

  /**
   * Format time in MM:SS format
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string (MM:SS)
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  /**
   * Update the timer display
   */
  updateDisplay() {
    const timerElement = document.getElementById("timer");
    const timeMetricElement = document.getElementById("time-metric");

    if (timerElement) {
      timerElement.textContent = this.formatTime(this.timeRemaining);
    }

    if (timeMetricElement) {
      const elapsed = this.maxTime - this.timeRemaining;
      timeMetricElement.textContent = `${elapsed}s`;
    }
  }

  /**
   * Start the timer countdown
   */
  start() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.isPaused = false;
    this.startTime = Date.now() - this.elapsedTime * 1000;

    // Call onStart callback
    if (this.callbacks.onStart) {
      this.callbacks.onStart();
    }

    this.intervalId = setInterval(() => {
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
      this.timeRemaining = Math.max(0, this.maxTime - this.elapsedTime);

      // Update display
      this.updateDisplay();

      // Call onTick callback
      if (this.callbacks.onTick) {
        this.callbacks.onTick(this.timeRemaining, this.elapsedTime);
      }

      // Check if time is up
      if (this.timeRemaining <= 0) {
        this.stop();
        if (this.callbacks.onComplete) {
          this.callbacks.onComplete();
        }
      }
    }, 100); // Update every 100ms for smooth display
  }

  /**
   * Stop the timer
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.updateDisplay();
  }

  /**
   * Pause the timer
   */
  pause() {
    if (this.isRunning && !this.isPaused) {
      this.stop();
      this.isPaused = true;
    }
  }

  /**
   * Resume the timer
   */
  resume() {
    if (this.isPaused) {
      this.start();
    }
  }

  /**
   * Reset the timer to initial state
   */
  reset() {
    this.stop();
    this.timeRemaining = this.maxTime;
    this.elapsedTime = 0;
    this.isPaused = false;
    this.startTime = null;
    this.updateDisplay();
  }

  /**
   * Get current time remaining in seconds
   * @returns {number} Time remaining in seconds
   */
  getTimeRemaining() {
    return this.timeRemaining;
  }

  /**
   * Get elapsed time in seconds
   * @returns {number} Elapsed time in seconds
   */
  getElapsedTime() {
    return this.elapsedTime;
  }

  /**
   * Check if timer is running
   * @returns {boolean}
   */
  getIsRunning() {
    return this.isRunning;
  }

  /**
   * Check if timer has expired
   * @returns {boolean}
   */
  isExpired() {
    return this.timeRemaining <= 0;
  }

  /**
   * Set callback for timer tick
   * @param {Function} callback - Function to call on each tick
   */
  onTick(callback) {
    this.callbacks.onTick = callback;
  }

  /**
   * Set callback for timer completion
   * @param {Function} callback - Function to call when timer completes
   */
  onComplete(callback) {
    this.callbacks.onComplete = callback;
  }

  /**
   * Set callback for timer start
   * @param {Function} callback - Function to call when timer starts
   */
  onStart(callback) {
    this.callbacks.onStart = callback;
  }
}

// Create a global timer instance
const timer = new Timer(30);
