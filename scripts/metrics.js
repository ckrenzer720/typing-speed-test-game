// WPM, CPM, Accuracy calculations

class MetricsCalculator {
    constructor() {
        this.totalCharacters = 0;
        this.correctCharacters = 0;
        this.mistakes = 0;
        this.startTime = null;
        this.isActive = false;
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
     * Update metrics based on typing data
     * @param {number} totalChars - Total characters typed
     * @param {number} correctChars - Correct characters typed
     * @param {number} mistakesCount - Total mistakes made
     */
    update(totalChars, correctChars, mistakesCount) {
        if (!this.isActive && totalChars > 0) {
            this.start();
        }

        this.totalCharacters = totalChars;
        this.correctCharacters = correctChars;
        this.mistakes = mistakesCount;
        
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
     * Update the display with calculated metrics
     * @param {number} wpm - Words Per Minute
     * @param {number} cpm - Characters Per Minute
     * @param {number} accuracy - Accuracy percentage
     */
    updateDisplay(wpm = 0, cpm = 0, accuracy = 0) {
        // Update WPM
        const wpmElement = document.getElementById('wpm-metric');
        if (wpmElement) {
            wpmElement.textContent = wpm;
        }

        // Update CPM
        const cpmElement = document.getElementById('cpm-metric');
        if (cpmElement) {
            cpmElement.textContent = cpm;
        }

        // Update Accuracy
        const accuracyElement = document.getElementById('accuracy-metric');
        if (accuracyElement) {
            accuracyElement.textContent = `${accuracy}%`;
        }

        // Update Mistakes
        const mistakesElement = document.getElementById('mistakes-metric');
        if (mistakesElement) {
            mistakesElement.textContent = this.mistakes;
        }
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
            elapsedTime: this.getElapsedTimeInSeconds()
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
}

// Create a global metrics calculator instance
const metricsCalculator = new MetricsCalculator();
