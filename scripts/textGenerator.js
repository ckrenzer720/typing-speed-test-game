// Paragraph/text generation/loading

class TextGenerator {
  constructor() {
    this.paragraphs = [];
    this.currentParagraph = "";
    this.loaded = false;
  }

  /**
   * Load paragraphs from the JSON file
   * @returns {Promise<void>}
   */
  async loadParagraphs() {
    try {
      const response = await fetch("data/paragraphs.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.paragraphs = data.paragraphs || [];
      this.loaded = true;

      if (this.paragraphs.length === 0) {
        console.warn("No paragraphs found in JSON file");
      }
    } catch (error) {
      console.error("Error loading paragraphs:", error);
      // Fallback paragraph if loading fails
      this.paragraphs = [
        "The quick brown fox jumps over the lazy dog. This is a sample paragraph for typing practice.",
      ];
      this.loaded = true;
    }
  }

  /**
   * Get a random paragraph from the loaded paragraphs
   * @returns {string} A random paragraph
   */
  getRandomParagraph() {
    if (!this.loaded || this.paragraphs.length === 0) {
      console.error("Paragraphs not loaded yet");
      this.currentParagraph = "";
      return "";
    }

    const randomIndex = Math.floor(Math.random() * this.paragraphs.length);
    this.currentParagraph = this.paragraphs[randomIndex];
    return this.currentParagraph;
  }

  /**
   * Get the current paragraph
   * @returns {string} The current paragraph
   */
  getCurrentParagraph() {
    return this.currentParagraph;
  }

  /**
   * Check if paragraphs are loaded
   * @returns {boolean}
   */
  isLoaded() {
    return this.loaded;
  }

  /**
   * Initialize and load paragraphs
   * @returns {Promise<void>}
   */
  async initialize() {
    await this.loadParagraphs();
  }
}

// Export for use in other scripts
const textGenerator = new TextGenerator();
