/**
 * srs.js
 * Handles the Spaced Repetition System logic and Database interactions.
 */

const SRS = {
  // Get all words from local storage
  getWords: function() {
    const data = localStorage.getItem('sat_vocab_words');
    return data ? JSON.parse(data) : [];
  },

  // Save words to local storage
  saveWords: function(words) {
    localStorage.setItem('sat_vocab_words', JSON.stringify(words));
  },

  // Initial database setup
  initDatabase: function(defaultWords) {
    if (!localStorage.getItem('sat_vocab_words')) {
      this.saveWords(defaultWords);
    }
  },

  // Logic to "Unlearn" everything studied today
  resetTodayProgress: function() {
    const words = this.getWords();
    const today = new Date().toISOString().split('T')[0];
    let count = 0;

    const updatedWords = words.map(word => {
      if (word.lastStudied === today) {
        count++;
        return {
          ...word,
          status: 'new',
          interval: 0,
          nextReview: Date.now(),
          lastStudied: null,
          timesReviewed: 0,
          ease: 2.5
        };
      }
      return word;
    });

    this.saveWords(updatedWords);
    
    // Reset daily progress counter
    let progress = JSON.parse(localStorage.getItem('sat_vocab_progress') || '{}');
    progress[today] = 0;
    localStorage.setItem('sat_vocab_progress', JSON.stringify(progress));
    
    return count;
  },

  // Update a word after a study session
  updateWordProgress: function(wordText, rating) {
    const words = this.getWords();
    const today = new Date().toISOString().split('T')[0];
    const idx = words.findIndex(w => w.word === wordText);

    if (idx === -1) return;

    let word = words[idx];
    word.lastStudied = today;
    word.timesReviewed = (word.timesReviewed || 0) + 1;

    // Simple SRS Algorithm
    if (rating === 'mastered') {
      word.interval = word.interval === 0 ? 4 : word.interval * 2;
      word.status = 'mastered';
    } else if (rating === 'somewhat') {
      word.interval = 2;
      word.status = 'learning';
    } else {
      word.interval = 0;
      word.status = 'new';
    }

    word.nextReview = Date.now() + (word.interval * 24 * 60 * 60 * 1000);
    words[idx] = word;
    this.saveWords(words);

    // Update Daily Counter
    let progress = JSON.parse(localStorage.getItem('sat_vocab_progress') || '{}');
    progress[today] = (progress[today] || 0) + 1;
    localStorage.setItem('sat_vocab_progress', JSON.stringify(progress));
  }
};
  // Helper to get today's date string
  getTodayDateString: function() {
    return new Date().toISOString().split('T')[0];
  }
    }

    this.saveWords(words);
    this.initStreak();
    this.updateStreak();
  },

  // Set default SRS parameters for a word
  initializeWordState(wordObj) {
    return {
      word: wordObj.word.trim(),
      pos: wordObj.pos || 'noun',
      definition: wordObj.definition || '',
      chinese: wordObj.chinese || '', // Added Chinese Translation
      synonyms: wordObj.synonyms || [],
      example: wordObj.example || '',
      // SRS State
      status: 'new',          // 'new', 'learning', 'familiar', 'mastered'
      interval: 0,            // current review interval in days
      ease: 2.5,              // ease factor for interval calculation
      repetitions: 0,        // consecutive successful recalls
      nextReview: null,       // timestamp for next due review
      lastStudied: null,      // timestamp of last study/review
      starred: false,         // starred/bookmarked status
      history: []             // review history: { date, quality, responseTime }
    };
  },

  getWords() {
    const data = localStorage.getItem(STORAGE_KEYS.WORDS);
    return data ? JSON.parse(data) : [];
  },

  saveWords(words) {
    localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
  },

  // Adds a single new word to the vocabulary list
  addWord(wordObj) {
    const words = this.getWords();
    const cleanWord = wordObj.word.trim().toLowerCase();
    
    if (words.some(w => w.word.toLowerCase() === cleanWord)) {
      // If it exists but is marked deleted or we want to merge:
      return { success: false, message: `"${wordObj.word}" already exists in your list.` };
    }

    const newWord = this.initializeWordState(wordObj);
    words.push(newWord);
    this.saveWords(words);
    return { success: true, word: newWord };
  },

  // Updates a word's metadata (not SRS state)
  updateWord(word, pos, definition, chinese, synonyms, example) {
    const words = this.getWords();
    const idx = words.findIndex(w => w.word.toLowerCase() === word.toLowerCase());
    if (idx !== -1) {
      words[idx].pos = pos;
      words[idx].definition = definition;
      words[idx].chinese = chinese; // Save updated Chinese translation
      words[idx].synonyms = typeof synonyms === 'string' ? synonyms.split(',').map(s => s.trim()).filter(Boolean) : synonyms;
      words[idx].example = example;
      this.saveWords(words);
      return true;
    }
    return false;
  },

  // Delete a word
  deleteWord(word) {
    let words = this.getWords();
    words = words.filter(w => w.word.toLowerCase() !== word.toLowerCase());
    this.saveWords(words);
  },

  // Toggles the starred status
  toggleStar(word) {
    const words = this.getWords();
    const idx = words.findIndex(w => w.word.toLowerCase() === word.toLowerCase());
    if (idx !== -1) {
      words[idx].starred = !words[idx].starred;
      this.saveWords(words);
      return words[idx].starred;
    }
    return false;
  },

  // Main SM-2 spaced repetition calculation
  processReview(wordText, q) {
    const words = this.getWords();
    const idx = words.findIndex(w => w.word.toLowerCase() === wordText.toLowerCase());
    if (idx === -1) return null;

    const word = words[idx];
    const now = Date.now();
    
    // Ensure SRS values exist
    word.repetitions = word.repetitions || 0;
    word.ease = word.ease || 2.5;
    word.interval = word.interval || 0;

    // 1. Calculate repetitions and interval based on SM-2 rules
    if (q >= 3) {
      if (word.repetitions === 0) {
        word.interval = 1; // 1 day
      } else if (word.repetitions === 1) {
        word.interval = 2; // 2 days
      } else if (word.repetitions === 2) {
        word.interval = 4; // 4 days
      } else {
        word.interval = Math.ceil(word.interval * word.ease);
      }
      word.repetitions += 1;
    } else {
      // Reset repetitions on failure, interval goes back to 1 day
      word.repetitions = 0;
      word.interval = 1;
    }

    // 2. Adjust Ease Factor (EF)
    word.ease = word.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (word.ease < 1.3) word.ease = 1.3; // Min ease factor is 1.3

    // 3. Set Status based on intervals/repetitions
    if (q < 3) {
      word.status = 'learning';
    } else if (word.repetitions >= 4) {
      word.status = 'mastered';
    } else if (word.repetitions >= 2) {
      word.status = 'familiar';
    } else {
      word.status = 'learning';
    }

    // 4. Update dates
    word.lastStudied = now;
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Next midnight
    word.nextReview = midnight.getTime() + (word.interval - 1) * 24 * 60 * 60 * 1000;

    // Add to history
    word.history = word.history || [];
    word.history.push({
      date: now,
      quality: q,
      interval: word.interval
    });

    words[idx] = word;
    this.saveWords(words);

    // Track daily review count
    this.incrementDailyProgress('reviews');

    return word;
  },

  // Force set a familiarity level manually (e.g. from flashcard buttons)
  setFamiliarity(wordText, familiarityLevel) {
    let q = 3;
    if (familiarityLevel === 'not-familiar') q = 1;
    else if (familiarityLevel === 'somewhat') q = 3;
    else if (familiarityLevel === 'mastered') q = 5;

    const result = this.processReview(wordText, q);
    
    // If it was a 'new' word just being studied, count it towards daily words learned
    if (result && result.history.length === 1) {
      this.incrementDailyProgress('learned');
    }
    return result;
  },

  // Daily Progress Log Functions
  getDailyProgress() {
    const todayStr = this.getTodayDateString();
    const progress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    let log = {};

    if (progress) {
      try {
        log = JSON.parse(progress);
      } catch (e) {
        log = {};
      }
    }

    if (!log[todayStr]) {
      log[todayStr] = {
        learned: 0,    // New words learned today
        reviews: 0,    // Reviews completed today
        limit: 50      // Default learning limit
      };
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(log));
    }

    return log[todayStr];
  },

  incrementDailyProgress(type) {
    const todayStr = this.getTodayDateString();
    const progress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    let log = progress ? JSON.parse(progress) : {};
    
    if (!log[todayStr]) {
      log[todayStr] = { learned: 0, reviews: 0, limit: 50 };
    }

    log[todayStr][type]++;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(log));
    this.updateStreak();
  },

  getTodayDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  // Streak Tracker logic
  initStreak() {
    let streak = localStorage.getItem(STORAGE_KEYS.STREAK);
    if (!streak) {
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify({
        current: 0,
        longest: 0,
        lastActiveDate: null
      }));
    }
  },

  getStreak() {
    const data = localStorage.getItem(STORAGE_KEYS.STREAK);
    return data ? JSON.parse(data) : { current: 0, longest: 0, lastActiveDate: null };
  },

  updateStreak() {
    const streak = this.getStreak();
    const todayStr = this.getTodayDateString();
    
    // If already active today, do nothing to streak count
    if (streak.lastActiveDate === todayStr) return;

    const progress = this.getDailyProgress();
    if (progress.learned > 0 || progress.reviews > 0) {
      if (streak.lastActiveDate) {
        const lastDate = new Date(streak.lastActiveDate);
        const today = new Date(todayStr);
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          streak.current += 1;
        } else if (diffDays > 1) {
          streak.current = 1;
        }
      } else {
        streak.current = 1;
      }

      if (streak.current > streak.longest) {
        streak.longest = streak.current;
      }
      
      streak.lastActiveDate = todayStr;
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
    }
  },

  checkStreakFreeze() {
    const streak = this.getStreak();
    if (!streak.lastActiveDate) return;

    const today = new Date(this.getTodayDateString());
    const lastActive = new Date(streak.lastActiveDate);
    const diffTime = Math.abs(today - lastActive);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      streak.current = 0; // Reset streak
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
    }
  },

  // Returns word collections based on status
  getQueues() {
    const words = this.getWords();
    const now = Date.now();

    const queues = {
      new: [],
      learning: [],
      familiar: [],
      mastered: [],
      due: [],
      starred: []
    };

    words.forEach(w => {
      if (w.starred) queues.starred.push(w);

      if (w.status === 'new' || !w.lastStudied) {
        queues.new.push(w);
      } else {
        queues[w.status].push(w);
      }

      if (w.lastStudied && w.nextReview && w.nextReview <= now) {
        queues.due.push(w);
      }
    });

    return queues;
  },

  getLearnSessionWords(limit = 50) {
    const queues = this.getQueues();
    const progress = this.getDailyProgress();
    
    const remainingCount = Math.max(0, limit - progress.learned);
    if (remainingCount === 0) return [];

    let selectionPool = [...queues.new, ...queues.learning.filter(w => !queues.due.includes(w))];
    return selectionPool.slice(0, remainingCount);
  },

  // Bulk import words from text or CSV/TSV
  // Formats supported:
  // 1. Tab separated (TSV): word [TAB] pos [TAB] definition [TAB] chinese [TAB] sentence
  // 2. Colon-Pipe format: word: definition | chinese | example
  // 3. Simple CSV format
  importWords(textInput) {
    const lines = textInput.split('\n');
    let importedCount = 0;
    let skippedCount = 0;
    const errors = [];

    lines.forEach((line, index) => {
      line = line.trim();
      if (!line) return;

      let word = "";
      let definition = "";
      let chinese = "";
      let pos = "noun";
      let synonyms = [];
      let example = "";

      // Format A: TSV (Excel copy-pasted)
      if (line.includes('\t')) {
        const parts = line.split('\t').map(p => p.trim());
        word = parts[0];
        
        if (parts.length === 2) {
          definition = parts[1];
        } else if (parts.length === 3) {
          definition = parts[1];
          chinese = parts[2];
        } else if (parts.length === 4) {
          pos = parts[1];
          definition = parts[2];
          chinese = parts[3];
        } else if (parts.length >= 5) {
          pos = parts[1];
          definition = parts[2];
          chinese = parts[3];
          example = parts[4];
        }
      } 
      // Format B: Colon and Pipes (word: definition | chinese | example)
      else if (line.includes(':') && line.includes('|')) {
        const colonParts = line.split(':');
        word = colonParts[0].trim();
        const details = colonParts.slice(1).join(':').split('|').map(p => p.trim());
        
        definition = details[0] || "";
        chinese = details[1] || "";
        example = details[2] || "";
      }
      // Format C: Standard Comma CSV
      else if (line.includes(',') && (line.match(/,/g) || []).length >= 2) {
        const parts = line.split(',').map(p => p.trim());
        word = parts[0];
        pos = parts[1] || "noun";
        definition = parts[2] || "";
        chinese = parts[3] || "";
        example = parts[4] || "";
      } 
      // Format D: Quick Line Format (word: definition)
      else if (line.includes(':')) {
        const parts = line.split(':');
        word = parts[0].trim();
        const details = parts.slice(1).join(':').trim();
        
        // Check if Chinese translation is placed inside square brackets, e.g. "definition [中文]"
        const bracketMatch = details.match(/(.*)\[(.*)\]/);
        if (bracketMatch) {
          definition = bracketMatch[1].trim();
          chinese = bracketMatch[2].trim();
        } else {
          definition = details;
        }
      } 
      // Fallback
      else {
        word = line;
        definition = "Definition needed.";
      }

      if (!word) {
        skippedCount++;
        return;
      }

      // Validate word
      if (word.length > 50 || /[^a-zA-Z\s-]/.test(word)) {
        errors.push(`Line ${index + 1}: Invalid characters in word "${word}"`);
        skippedCount++;
        return;
      }

      const res = this.addWord({ word, pos, definition, chinese, synonyms, example });
      if (res.success) {
        importedCount++;
      } else {
        skippedCount++;
      }
    });

    return { importedCount, skippedCount, errors };
  },

  // Structured import from Gemini JSON parser
  importStructuredJSON(wordsArray) {
    let importedCount = 0;
    let skippedCount = 0;
    
    wordsArray.forEach(item => {
      if (!item.word) {
        skippedCount++;
        return;
      }
      const res = this.addWord({
        word: item.word,
        pos: item.pos || 'noun',
        definition: item.definition || '',
        chinese: item.chinese || '',
        synonyms: item.synonyms || [],
        example: item.example || ''
      });
      
      if (res.success) {
        importedCount++;
      } else {
        skippedCount++;
      }
    });
    
    return { importedCount, skippedCount };
  },

  // Reset database state completely
  resetAll() {
    localStorage.removeItem(STORAGE_KEYS.WORDS);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.STREAK);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
};

// Export to window context
if (typeof window !== 'undefined') {
  window.SRS = window.SRS || SRS;
}
