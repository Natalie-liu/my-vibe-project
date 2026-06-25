document.addEventListener('DOMContentLoaded', () => {
  // Initialize Database
  SRS.initDatabase(window.DEFAULT_WORDS || []);
  UI.init();
  UI.renderDashboard();

  // Reset Today Button Event
  const resetTodayBtn = document.getElementById('settings-reset-today-btn');
  if (resetTodayBtn) {
    resetTodayBtn.onclick = () => {
      if (confirm("Reset today's progress? This will 'unlearn' everything you studied today.")) {
        const count = SRS.resetTodayProgress();
        alert(`Success! ${count} words were reset.`);
        window.location.hash = "#dashboard";
        window.location.reload();
      }
    };
  }

  // Routing Logic
  function router() {
    const hash = window.location.hash.substring(1) || 'dashboard';
    document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
    const activeView = document.getElementById(`${hash}-view`);
    if (activeView) activeView.classList.add('active');

    if (hash === 'learn') UI.startLearnSession();
    if (hash === 'dashboard') UI.renderDashboard();
  }

  window.addEventListener('hashchange', router);
  router();
});

    // Update Header Title Text
    document.getElementById('page-title-text').textContent = activeRoute.title;

    // Trigger View-Specific Setup
    if (hash === 'dashboard') {
      UI.renderDashboard();
    } 
    else if (hash === 'learn') {
      // Direct clicks on Learn sidebar menu item defaults to learning today's 50 words
      if (!UI.learnSession.isGeneralStudy) {
        UI.startLearnSession();
      }
    }
    else if (hash === 'flashcards') {
      UI.renderDashboard(); // Updates deck counts
    }
    else if (hash === 'quiz') {
      // Reset casual quiz panel
      document.getElementById('quiz-setup-panel').classList.remove('hidden');
      document.getElementById('quiz-runner-box').classList.add('hidden');
      document.getElementById('quiz-results').classList.add('hidden');
    }
    else if (hash === 'test') {
      // Reset exam panel
      document.getElementById('test-setup-panel').classList.remove('hidden');
      document.getElementById('test-runner-box').classList.add('hidden');
      document.getElementById('test-results').classList.add('hidden');
      clearInterval(UI.examSession.timerInterval);
    }
    else if (hash === 'library') {
      UI.library.currentPage = 1;
      UI.renderLibrary();
    }
  }

  window.addEventListener('hashchange', router);
  router(); // Run on initial load

  /* ==========================================
     GLOBAL UI INTERACTION EVENTS
     ========================================== */

  // 1. Theme Toggle (Dark mahogany / Light Parchment)
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('sat_vocab_theme') || 'light-theme';
  document.body.className = savedTheme;

  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem('sat_vocab_theme', 'light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('sat_vocab_theme', 'dark-theme');
    }
  });

  // 2. Dashboard Quick Launch Buttons
  document.getElementById('dash-start-learn').addEventListener('click', () => {
    UI.learnSession.isGeneralStudy = false; // Study daily 50
    window.location.hash = "#learn";
  });
  document.getElementById('dash-start-review').addEventListener('click', () => {
    window.location.hash = "#quiz";
  });

  // 3. Flashcards (Flip / Star / Audio speak / Reveal translation)
  const flashcard = document.getElementById('flashcard');
  const ratingControls = document.getElementById('rating-controls');

  flashcard.addEventListener('click', (e) => {
    if (e.target.closest('#card-star') || 
        e.target.closest('#card-star-back') || 
        e.target.closest('#card-speak-btn') ||
        e.target.closest('#btn-reveal-translation')) {
      return;
    }
    
    flashcard.classList.toggle('flipped');
    
    if (flashcard.classList.contains('flipped')) {
      ratingControls.classList.add('visible');
    } else {
      ratingControls.classList.remove('visible');
    }
  });

  // Speech Pronunciation button
  document.getElementById('card-speak-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const currentWord = UI.learnSession.words[UI.learnSession.currentIndex];
    if (currentWord) {
      UI.speak(currentWord.word);
    }
  });

  // Reveal Chinese Translation button on flashcard back
  document.getElementById('btn-reveal-translation').addEventListener('click', (e) => {
    e.stopPropagation();
    const chiText = document.getElementById('card-chinese');
    const revealBtn = document.getElementById('btn-reveal-translation');
    
    chiText.classList.remove('blurred');
    revealBtn.classList.add('hidden');
  });

  // Star word toggles
  document.getElementById('card-star').addEventListener('click', (e) => {
    e.stopPropagation();
    UI.toggleCardStar();
  });
  document.getElementById('card-star-back').addEventListener('click', (e) => {
    e.stopPropagation();
    UI.toggleCardStar();
  });

  // 4. Rating familiarity selections
  const ratingButtons = document.querySelectorAll('.rating-btn');
  ratingButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const level = btn.getAttribute('data-rating');
      UI.handleFamiliarityClick(level);
    });
  });

  // Exit Learn screen
  document.getElementById('quit-learn-session').addEventListener('click', () => {
    if (confirm("Are you sure you want to end this study session? Your progress is saved.")) {
      window.location.hash = "#dashboard";
    }
  });

  // 5. Flashcards Setup Deck Selectors
  document.getElementById('deck-btn-due').addEventListener('click', () => {
    const queues = SRS.getQueues();
    UI.startGeneralFlashcardSession(queues.due);
  });

  document.getElementById('deck-btn-starred').addEventListener('click', () => {
    const queues = SRS.getQueues();
    UI.startGeneralFlashcardSession(queues.starred);
  });

  document.getElementById('deck-btn-all').addEventListener('click', () => {
    const allWords = SRS.getWords();
    UI.startGeneralFlashcardSession(allWords);
  });

  // 6. Casual Quiz runners
  document.getElementById('quiz-start-session-btn').addEventListener('click', () => {
    UI.startCasualQuiz();
  });

  document.getElementById('quiz-next-btn').addEventListener('click', () => {
    UI.advanceQuiz();
  });

  document.getElementById('results-finish-btn').addEventListener('click', () => {
    window.location.hash = "#dashboard";
  });
  document.getElementById('results-retry-btn').addEventListener('click', () => {
    // Return to setup
    window.location.hash = "#quiz";
  });

  // 7. Timed Test runners
  document.getElementById('test-start-btn').addEventListener('click', () => {
    UI.startExam();
  });

  document.getElementById('test-next-btn').addEventListener('click', () => {
    UI.handleExamNextClick();
  });

  // Spelling Input keypress (Enter checks next question)
  document.getElementById('test-spelling-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      UI.handleExamNextClick();
    }
  });

  document.getElementById('test-finish-btn').addEventListener('click', () => {
    window.location.hash = "#dashboard";
  });
  document.getElementById('test-retry-btn').addEventListener('click', () => {
    window.location.hash = "#test";
  });

  /* ==========================================
     WORD LIBRARY ACTIONS & FORMS
     ========================================== */
  
  // Search and filter triggers
  document.getElementById('lib-search').addEventListener('input', () => {
    UI.library.currentPage = 1;
    UI.renderLibrary();
  });

  document.getElementById('lib-filter-status').addEventListener('change', () => {
    UI.library.currentPage = 1;
    UI.renderLibrary();
  });

  // Pagination navigation
  document.getElementById('pagination-prev').addEventListener('click', () => {
    if (UI.library.currentPage > 1) {
      UI.library.currentPage--;
      UI.renderLibrary();
    }
  });

  document.getElementById('pagination-next').addEventListener('click', () => {
    UI.library.currentPage++;
    UI.renderLibrary();
  });

  // Library Word editor modal
  const wordModal = document.getElementById('word-modal');
  document.getElementById('lib-add-word-btn').addEventListener('click', () => {
    UI.openAddModal();
  });

  const closeModal = () => {
    wordModal.classList.remove('active');
  };

  document.getElementById('word-modal-close').addEventListener('click', closeModal);
  document.getElementById('word-form-cancel').addEventListener('click', closeModal);

  // Submit word save
  document.getElementById('word-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const word = document.getElementById('form-word').value.trim();
    const pos = document.getElementById('form-pos').value;
    const definition = document.getElementById('form-definition').value.trim();
    const chinese = document.getElementById('form-chinese').value.trim();
    const synonymsInput = document.getElementById('form-synonyms').value;
    const example = document.getElementById('form-example').value.trim();

    const originalWord = document.getElementById('edit-original-word').value;

    if (originalWord) {
      SRS.updateWord(originalWord, pos, definition, chinese, synonymsInput, example);
    } else {
      const res = SRS.addWord({ word, pos, definition, chinese, synonyms: synonymsInput, example });
      if (!res.success) {
        alert(res.message);
        return;
      }
    }

    closeModal();
    UI.renderLibrary();
    UI.renderDashboard();
  });

  /* ==========================================
     IMPORTER TABS & CONTROLLERS
     ========================================== */
  
  // Importer Tab switcher
  const tabBtnStandard = document.getElementById('tab-btn-standard');
  const tabBtnAI = document.getElementById('tab-btn-ai');
  const tabStandard = document.getElementById('import-tab-standard');
  const tabAI = document.getElementById('import-tab-ai');

  tabBtnStandard.addEventListener('click', () => {
    tabBtnStandard.classList.add('active');
    tabBtnAI.classList.remove('active');
    tabStandard.classList.remove('hidden');
    tabAI.classList.add('hidden');
  });

  tabBtnAI.addEventListener('click', () => {
    tabBtnAI.classList.add('active');
    tabBtnStandard.classList.remove('active');
    tabAI.classList.remove('hidden');
    tabStandard.classList.add('hidden');
  });

  // Standard File Bulk Importer
  const importText = document.getElementById('import-text');
  const importResultsPanel = document.getElementById('import-results-panel');
  const errorLogPanel = document.getElementById('import-errors-log');
  const errorList = document.getElementById('import-errors-list');

  document.getElementById('import-clear').addEventListener('click', () => {
    importText.value = '';
    importResultsPanel.classList.add('hidden');
    errorLogPanel.classList.add('hidden');
  });

  document.getElementById('import-submit').addEventListener('click', () => {
    const rawData = importText.value;
    if (!rawData.trim()) {
      alert("Please paste vocabulary records before submitting.");
      return;
    }

    const report = SRS.importWords(rawData);

    document.getElementById('import-success-count').textContent = report.importedCount;
    document.getElementById('import-fail-count').textContent = report.skippedCount;
    importResultsPanel.classList.remove('hidden');

    errorList.innerHTML = '';
    if (report.errors.length > 0) {
      errorLogPanel.classList.remove('hidden');
      report.errors.forEach(err => {
        const li = document.createElement('li');
        li.textContent = err;
        errorList.appendChild(li);
      });
    } else {
      errorLogPanel.classList.add('hidden');
    }

    // Refresh dashboard values
    UI.renderDashboard();
  });

  // Gemini AI Smart Importer
  const aiKeyBtn = document.getElementById('save-api-key-btn');
  const aiText = document.getElementById('import-ai-text');

  // Save API key
  aiKeyBtn.addEventListener('click', () => {
    const val = apiKeyInput.value.trim();
    if (val) {
      localStorage.setItem('sat_vocab_api_key', val);
      alert("API Key saved securely in browser storage!");
    } else {
      alert("Please enter a key before saving.");
    }
  });

  document.getElementById('import-ai-clear').addEventListener('click', () => {
    aiText.value = '';
    document.getElementById('import-ai-results-panel').classList.add('hidden');
    document.getElementById('ai-loading-indicator').classList.add('hidden');
  });

  document.getElementById('import-ai-submit').addEventListener('click', () => {
    UI.handleAISmartImport();
  });

  /* ==========================================
     SETTINGS & BACKUP SYSTEMS
     ========================================== */

  // Voice speed indicator
  const speedSlider = document.getElementById('settings-speed');
  const speedValEl = document.getElementById('settings-speed-val');
  if (speedSlider && speedValEl) {
    speedSlider.addEventListener('input', () => {
      speedValEl.textContent = parseFloat(speedSlider.value).toFixed(1);
    });
  }

  // Database Factory Reset
  document.getElementById('settings-reset-btn').addEventListener('click', () => {
    if (confirm("🚨 WARNING: This will completely delete all of your vocabulary logs, starred lists, and streak count. Continue?")) {
      if (confirm("Are you absolutely sure you want to perform a factory reset? All progress will be lost.")) {
        SRS.resetAll();
        alert("Database cleared successfully. Reloading...");
        window.location.hash = "#dashboard";
        window.location.reload();
      }
    }
  });

  // Export Backup
  document.getElementById('settings-export-btn').addEventListener('click', () => {
    const backupData = {
      words: localStorage.getItem('sat_vocab_words'),
      progress: localStorage.getItem('sat_vocab_progress'),
      streak: localStorage.getItem('sat_vocab_streak'),
      settings: localStorage.getItem('sat_vocab_settings'),
      theme: localStorage.getItem('sat_vocab_theme'),
      apiKey: localStorage.getItem('sat_vocab_api_key')
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const dateStr = SRS.getTodayDateString();
    const a = document.createElement('a');
    a.href = url;
    a.download = `sat_vocab_srs_backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Restore Backup
  const importTrigger = document.getElementById('settings-import-trigger');
  const importFileInput = document.getElementById('settings-import-file');

  importTrigger.addEventListener('click', () => {
    importFileInput.click();
  });

  importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const backup = JSON.parse(evt.target.result);
        
        if (!backup.words || !backup.progress) {
          alert("Invalid backup file format. Import failed.");
          return;
        }

        if (backup.words) localStorage.setItem('sat_vocab_words', backup.words);
        if (backup.progress) localStorage.setItem('sat_vocab_progress', backup.progress);
        if (backup.streak) localStorage.setItem('sat_vocab_streak', backup.streak);
        if (backup.settings) localStorage.setItem('sat_vocab_settings', backup.settings);
        if (backup.theme) localStorage.setItem('sat_vocab_theme', backup.theme);
        if (backup.apiKey) localStorage.setItem('sat_vocab_api_key', backup.apiKey);

        alert("🎉 Backup restored successfully! Reloading data...");
        window.location.hash = "#dashboard";
        window.location.reload();

      } catch (err) {
        console.error(err);
        alert("Error parsing backup JSON file. Make sure it is a valid backup file.");
      }
    };
    reader.readAsText(file);
  });

});
