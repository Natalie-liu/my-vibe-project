/**
 * ui.js
 * Handles all UI rendering, interactive state management, Text-to-Speech (TTS),
 * card flip animations, and the interactive SAT multiple-choice quiz and timed exam engines.
 * Also integrates the client-side Gemini AI parsing engine.
 */

const UI = {
  // Speech Synthesis state
  ttsVoice: null,
  ttsRate: 1.0,

  // Current session states
  learnSession: {
    words: [],
    currentIndex: 0,
    isGeneralStudy: false // Track if studying due/starred/all or daily 50
  },
  
  quizSession: {
    questions: [],
    currentIndex: 0,
    score: 0,
    wrongAnswers: [],
    sourceDeck: 'due'
  },

  examSession: {
    questions: [],
    currentIndex: 0,
    answers: [], // Array of user answers (string for spelling, index for MCQs)
    startTime: null,
    timerInterval: null,
    secondsElapsed: 0
  },

  // Library Pagination state
  library: {
    currentPage: 1,
    pageSize: 9
  },

  init() {
    this.initTTS();
  },

  /* ==========================================
     TEXT-TO-SPEECH (TTS) SYSTEM
     ========================================== */
  initTTS() {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const voiceSelect = document.getElementById('settings-voice');
        if (!voiceSelect) return;

        voiceSelect.innerHTML = '';
        const enVoices = voices.filter(v => v.lang.startsWith('en'));
        const displayVoices = enVoices.length > 0 ? enVoices : voices;
        
        displayVoices.forEach(voice => {
          const option = document.createElement('option');
          option.value = voice.name;
          option.textContent = `${voice.name} (${voice.lang})`;
          if (voice.default || voice.name.includes('Google US English') || voice.name.includes('Natural')) {
            option.selected = true;
            this.ttsVoice = voice;
          }
          voiceSelect.appendChild(option);
        });

        if (!this.ttsVoice && displayVoices.length > 0) {
          this.ttsVoice = displayVoices[0];
        }
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  },

  speak(text) {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const speedSlider = document.getElementById('settings-speed');
      const voiceSelect = document.getElementById('settings-voice');
      
      if (speedSlider) this.ttsRate = parseFloat(speedSlider.value);
      if (voiceSelect) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.name === voiceSelect.value);
        if (selectedVoice) this.ttsVoice = selectedVoice;
      }

      if (this.ttsVoice) utterance.voice = this.ttsVoice;
      utterance.rate = this.ttsRate;
      window.speechSynthesis.speak(utterance);
    }
  },

  /* ==========================================
     1. DASHBOARD RENDERER
     ========================================== */
  renderDashboard() {
    const progress = SRS.getDailyProgress();
    const queues = SRS.getQueues();
    const streak = SRS.getStreak();
    const allWords = SRS.getWords();

    // 1. Update Streak & Statistics
    document.getElementById('sidebar-streak-value').textContent = streak.current;
    document.getElementById('stat-words-today').textContent = progress.learned;
    document.getElementById('stat-starred-count').textContent = queues.starred.length;
    document.getElementById('stat-total-mastered').textContent = queues.mastered.length;
    
    // 2. Update Daily Progress Circle
    const pct = Math.min(100, Math.round((progress.learned / progress.limit) * 100));
    document.getElementById('dash-progress-percent').textContent = `${pct}%`;
    
    const circle = document.getElementById('dash-progress-circle');
    if (circle) {
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (pct / 100) * circumference;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = offset;
    }

    // 3. Update Hero Button counts
    document.getElementById('dash-review-count').textContent = queues.due.length;
    
    // Update badge review count in sidebar
    const revBadge = document.getElementById('badge-review-count');
    if (queues.due.length > 0) {
      revBadge.textContent = queues.due.length;
      revBadge.classList.remove('hidden');
    } else {
      revBadge.classList.add('hidden');
    }

    // Update learn count in sidebar
    const learnBadge = document.getElementById('badge-learn-count');
    const learnSessionWords = SRS.getLearnSessionWords();
    if (learnSessionWords.length > 0) {
      learnBadge.textContent = learnSessionWords.length;
      learnBadge.classList.remove('hidden');
    } else {
      learnBadge.classList.add('hidden');
    }

    // 4. Update Next Review date text
    const nextReviewText = document.getElementById('stat-next-review-date');
    if (queues.due.length > 0) {
      nextReviewText.textContent = "NOW DUE";
      nextReviewText.style.color = "var(--danger)";
    } else {
      const studied = allWords.filter(w => w.nextReview);
      if (studied.length > 0) {
        const sorted = studied.sort((a, b) => a.nextReview - b.nextReview);
        const earliest = new Date(sorted[0].nextReview);
        nextReviewText.textContent = earliest.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        nextReviewText.style.color = "var(--text-primary)";
      } else {
        nextReviewText.textContent = "No reviews scheduled";
        nextReviewText.style.color = "var(--text-muted)";
      }
    }

    // 5. Update Vocabulary distribution chart
    const totalCount = allWords.length || 1;
    const countNew = queues.new.length;
    const countLearning = queues.learning.length;
    const countFamiliar = queues.familiar.length;
    const countMastered = queues.mastered.length;

    document.getElementById('chart-new-count').textContent = countNew;
    document.getElementById('chart-learning-count').textContent = countLearning;
    document.getElementById('chart-familiar-count').textContent = countFamiliar;
    document.getElementById('chart-mastered-count').textContent = countMastered;

    document.getElementById('chart-new-width').style.width = `${(countNew / totalCount) * 100}%`;
    document.getElementById('chart-learning-width').style.width = `${(countLearning / totalCount) * 100}%`;
    document.getElementById('chart-familiar-width').style.width = `${(countFamiliar / totalCount) * 100}%`;
    document.getElementById('chart-mastered-width').style.width = `${(countMastered / totalCount) * 100}%`;

    // 6. Timeline Forecast Chart (Next 5 Days)
    this.renderTimelineForecast(allWords, queues.due.length);

    // Update counts on flashcard selector subpage
    const dueCountEl = document.getElementById('deck-due-count');
    const starredCountEl = document.getElementById('deck-starred-count');
    const allCountEl = document.getElementById('deck-all-count');
    if (dueCountEl) dueCountEl.textContent = queues.due.length;
    if (starredCountEl) starredCountEl.textContent = queues.starred.length;
    if (allCountEl) allCountEl.textContent = allWords.length;
  },

  renderTimelineForecast(allWords, dueCountToday) {
    const forecastContainer = document.getElementById('review-forecast-container');
    if (!forecastContainer) return;

    forecastContainer.innerHTML = '';
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const buckets = [0, 0, 0, 0, 0];
    buckets[0] = dueCountToday;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    allWords.forEach(w => {
      if (w.lastStudied && w.nextReview && w.nextReview > Date.now()) {
        const reviewDate = new Date(w.nextReview);
        const diffTime = reviewDate.getTime() - startOfToday.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 1 && diffDays <= 4) {
          buckets[diffDays] += 1;
        }
      }
    });

    for (let i = 0; i < 5; i++) {
      const forecastDay = new Date();
      forecastDay.setDate(now.getDate() + i);
      const dayName = i === 0 ? "Today" : daysOfWeek[forecastDay.getDay()];
      
      const dayCard = document.createElement('div');
      dayCard.className = `forecast-day ${i === 0 ? 'today' : ''}`;
      
      const dueCount = buckets[i];
      const activeClass = dueCount > 0 ? 'due-active' : '';

      dayCard.innerHTML = `
        <span class="day-name">${dayName}</span>
        <span class="day-val ${activeClass}">${dueCount}</span>
        <span class="day-label">words due</span>
      `;
      forecastContainer.appendChild(dayCard);
    }
  },

  /* ==========================================
     2. DAILY STUDY & FLASHCARDS CONTROLLER
     ========================================== */
  startLearnSession() {
    const sessionWords = SRS.getLearnSessionWords();
    if (sessionWords.length === 0) {
      alert("You have already reached your learning limit of 50 words for today. Go to Flashcards or Quizzes to study more!");
      window.location.hash = "#dashboard";
      return;
    }

    this.learnSession.words = sessionWords;
    this.learnSession.currentIndex = 0;
    this.learnSession.isGeneralStudy = false;

    document.getElementById('learn-total-cards').textContent = sessionWords.length;
    this.showLearnCard(0);
  },

  startGeneralFlashcardSession(wordsArray) {
    if (wordsArray.length === 0) {
      alert("No words available in the selected subcategory.");
      return;
    }

    this.learnSession.words = wordsArray;
    this.learnSession.currentIndex = 0;
    this.learnSession.isGeneralStudy = true;

    document.getElementById('learn-total-cards').textContent = wordsArray.length;
    window.location.hash = "#learn";
    this.showLearnCard(0);
  },

  showLearnCard(index) {
    if (index < 0 || index >= this.learnSession.words.length) return;

    this.learnSession.currentIndex = index;
    const word = this.learnSession.words[index];
    
    // Update progress numbers
    document.getElementById('learn-current-index').textContent = index + 1;
    const progressPercent = ((index) / this.learnSession.words.length) * 100;
    document.getElementById('learn-session-progress').style.width = `${progressPercent}%`;

    // Reset card orientation & translation blur
    const cardElement = document.getElementById('flashcard');
    cardElement.classList.remove('flipped');
    
    const ratingControls = document.getElementById('rating-controls');
    ratingControls.classList.remove('visible');

    const chiText = document.getElementById('card-chinese');
    chiText.classList.add('blurred');
    
    const revealBtn = document.getElementById('btn-reveal-translation');
    revealBtn.classList.remove('hidden');

    // Populate Card Front details
    document.getElementById('card-pos').textContent = word.pos;
    document.getElementById('card-word-text').textContent = word.word;
    
    // Speak word on load
    this.speak(word.word);

    // Star state
    const starBtnFront = document.getElementById('card-star');
    const starBtnBack = document.getElementById('card-star-back');
    if (word.starred) {
      starBtnFront.classList.add('starred');
      starBtnBack.classList.add('starred');
    } else {
      starBtnFront.classList.remove('starred');
      starBtnBack.classList.remove('starred');
    }

    // Populate Card Back details
    document.getElementById('card-word-text-back').textContent = word.word;
    document.getElementById('card-pos-back').textContent = word.pos;
    document.getElementById('card-definition').textContent = word.definition;
    
    // Translation text
    chiText.textContent = word.chinese || "无中文翻译 (No translation available)";

    // Synonyms
    const synonymsBox = document.getElementById('card-synonyms-container');
    const synonymsList = document.getElementById('card-synonyms');
    synonymsList.innerHTML = '';
    if (word.synonyms && word.synonyms.length > 0) {
      synonymsBox.classList.remove('hidden');
      word.synonyms.forEach(syn => {
        const tag = document.createElement('span');
        tag.className = 'synonym-tag';
        tag.textContent = syn;
        synonymsList.appendChild(tag);
      });
    } else {
      synonymsBox.classList.add('hidden');
    }

    // Example
    document.getElementById('card-example').textContent = word.example ? `"${word.example}"` : "No sentence available.";
  },

  handleFamiliarityClick(level) {
    const word = this.learnSession.words[this.learnSession.currentIndex];
    
    // Process Review
    SRS.setFamiliarity(word.word, level);

    // Advance card index or complete session
    const nextIdx = this.learnSession.currentIndex + 1;
    if (nextIdx < this.learnSession.words.length) {
      this.showLearnCard(nextIdx);
    } else {
      document.getElementById('learn-session-progress').style.width = `100%`;
      setTimeout(() => {
        alert("🎉 Congratulations! You have completed studying this deck!");
        this.renderDashboard();
        window.location.hash = "#dashboard";
      }, 500);
    }
  },

  toggleCardStar() {
    const word = this.learnSession.words[this.learnSession.currentIndex];
    const isStarred = SRS.toggleStar(word.word);
    
    const starBtnFront = document.getElementById('card-star');
    const starBtnBack = document.getElementById('card-star-back');
    
    if (isStarred) {
      starBtnFront.classList.add('starred');
      starBtnBack.classList.add('starred');
      word.starred = true;
    } else {
      starBtnFront.classList.remove('starred');
      starBtnBack.classList.remove('starred');
      word.starred = false;
    }
  },

  /* ==========================================
     3. CASUAL PRACTICE QUIZ SANDBOX
     ========================================== */
  startCasualQuiz() {
    const deckSource = document.getElementById('quiz-setup-deck').value;
    const limit = parseInt(document.getElementById('quiz-setup-size').value);
    
    const allWords = SRS.getWords();
    const queues = SRS.getQueues();
    
    let pool = [];
    if (deckSource === 'due') {
      pool = [...queues.due];
    } else if (deckSource === 'starred') {
      pool = [...queues.starred];
    } else {
      pool = [...allWords];
    }

    if (pool.length === 0) {
      alert(`The selected deck (${deckSource}) is empty. Please add words first.`);
      return;
    }

    // Shuffle and pick limit
    pool = this.shuffleArray(pool).slice(0, limit);

    // Formats enabled
    const formats = {
      engDef: document.getElementById('quiz-opt-def-eng').checked,
      chiDef: document.getElementById('quiz-opt-def-chi').checked,
      sentence: document.getElementById('quiz-opt-sentence').checked
    };

    if (!formats.engDef && !formats.chiDef && !formats.sentence) {
      alert("Please select at least one question format format.");
      return;
    }

    // Map to active question list
    this.quizSession.questions = pool.map(wordObj => {
      return this.generateCustomQuestion(wordObj, allWords, formats);
    });

    this.quizSession.currentIndex = 0;
    this.quizSession.score = 0;
    this.quizSession.wrongAnswers = [];

    // Switch view sections
    document.getElementById('quiz-setup-panel').classList.add('hidden');
    document.getElementById('quiz-results').classList.add('hidden');
    document.getElementById('quiz-runner-box').classList.remove('hidden');

    document.getElementById('quiz-q-total').textContent = this.quizSession.questions.length;
    this.showQuizQuestion(0);
  },

  generateCustomQuestion(targetWord, allWords, formats) {
    // Collect possible formats
    const allowedTypes = [];
    if (formats.engDef) allowedTypes.push(0, 1); // Word->Eng, Eng->Word
    if (formats.chiDef) allowedTypes.push(3, 4); // Word->Chi, Chi->Word
    if (formats.sentence && targetWord.example) allowedTypes.push(2); // Sentence Completion

    // Fallback if none (e.g. no sentence example)
    if (allowedTypes.length === 0) {
      if (formats.engDef) allowedTypes.push(0);
      else if (formats.chiDef) allowedTypes.push(3);
      else allowedTypes.push(0);
    }

    const type = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];

    const q = {
      word: targetWord.word,
      pos: targetWord.pos,
      definition: targetWord.definition,
      chinese: targetWord.chinese || "无中文翻译",
      example: targetWord.example,
      type: type,
      text: "",
      options: [],
      correctIndex: -1
    };

    let pool = allWords.filter(w => w.word.toLowerCase() !== targetWord.word.toLowerCase());
    pool = this.shuffleArray(pool);
    const distractors = pool.slice(0, 3);

    if (type === 0) {
      // Word to English Definition
      q.text = `What is the correct English definition of the word "${targetWord.word}"?`;
      const options = [targetWord.definition, ...distractors.map(d => d.definition || "No definition available.")];
      const shuffled = this.shuffleOptions(options, 0);
      q.options = shuffled.list;
      q.correctIndex = shuffled.correctIndex;
      q.typeText = "Word to English Definition";
    } 
    else if (type === 1) {
      // English Definition to Word
      q.text = `Which word matches the English definition:\n"${targetWord.definition}"?`;
      const options = [targetWord.word, ...distractors.map(d => d.word)];
      const shuffled = this.shuffleOptions(options, 0);
      q.options = shuffled.list;
      q.correctIndex = shuffled.correctIndex;
      q.typeText = "English Definition to Word";
    } 
    else if (type === 2) {
      // Sentence Completion
      const regex = new RegExp(`\\b${targetWord.word}\\b`, 'gi');
      const blankSentence = targetWord.example.replace(regex, '__________');
      q.text = `Complete the SAT-style sentence:\n\n"${blankSentence}"`;
      
      const options = [targetWord.word, ...distractors.map(d => d.word)];
      const shuffled = this.shuffleOptions(options, 0);
      q.options = shuffled.list;
      q.correctIndex = shuffled.correctIndex;
      q.typeText = "SAT Sentence Completion";
    }
    else if (type === 3) {
      // Word to Chinese Translation
      q.text = `Which is the correct Chinese translation (中文翻译) of "${targetWord.word}"?`;
      const options = [targetWord.chinese || "无", ...distractors.map(d => d.chinese || "无中文翻译")];
      const shuffled = this.shuffleOptions(options, 0);
      q.options = shuffled.list;
      q.correctIndex = shuffled.correctIndex;
      q.typeText = "Word to Chinese Match";
    }
    else {
      // Chinese to Word
      q.text = `Which English word translates to: "${targetWord.chinese || "无"}"?`;
      const options = [targetWord.word, ...distractors.map(d => d.word)];
      const shuffled = this.shuffleOptions(options, 0);
      q.options = shuffled.list;
      q.correctIndex = shuffled.correctIndex;
      q.typeText = "Chinese Match to Word";
    }

    return q;
  },

  showQuizQuestion(index) {
    if (index < 0 || index >= this.quizSession.questions.length) return;

    this.quizSession.currentIndex = index;
    const q = this.quizSession.questions[index];

    // Reset UI states
    document.getElementById('quiz-q-index').textContent = index + 1;
    document.getElementById('quiz-score-val').textContent = this.quizSession.score;
    document.getElementById('quiz-type-tag').textContent = q.typeText;
    document.getElementById('quiz-question-text').textContent = q.text;

    document.getElementById('quiz-explanation').classList.add('hidden');

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    q.options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span>${optText}</span>
        <i data-lucide="circle" class="option-icon"></i>
      `;
      btn.onclick = () => this.handleQuizOptionSelection(optIdx, btn);
      optionsContainer.appendChild(btn);
    });
    
    lucide.createIcons();
  },

  handleQuizOptionSelection(selectedIdx, btnElement) {
    const q = this.quizSession.questions[this.quizSession.currentIndex];
    const optionsContainer = document.getElementById('quiz-options');
    const optionButtons = optionsContainer.querySelectorAll('.quiz-option-btn');

    optionButtons.forEach(btn => btn.disabled = true);

    const isCorrect = (selectedIdx === q.correctIndex);
    const chosenText = q.options[selectedIdx];

    if (isCorrect) {
      this.quizSession.score++;
      btnElement.classList.add('selected-correct');
      btnElement.querySelector('i').setAttribute('data-lucide', 'check-circle-2');
      
      // Correct: process review (5: perfect)
      SRS.processReview(q.word, 5);
    } else {
      btnElement.classList.add('selected-incorrect');
      btnElement.querySelector('i').setAttribute('data-lucide', 'x-circle');
      
      optionButtons[q.correctIndex].classList.add('selected-correct');
      optionButtons[q.correctIndex].querySelector('i').setAttribute('data-lucide', 'check-circle-2');
      
      this.quizSession.wrongAnswers.push({
        word: q.word,
        correctDef: q.definition,
        yourAnswer: chosenText
      });

      // Wrong: reset interval (1: incorrect)
      SRS.processReview(q.word, 1);
    }

    lucide.createIcons();

    // Populate Explanation details
    document.getElementById('exp-word').textContent = q.word;
    document.getElementById('exp-pos').textContent = q.pos;
    document.getElementById('exp-chinese').textContent = `Chinese: ${q.chinese}`;
    document.getElementById('exp-definition').textContent = q.definition;
    document.getElementById('exp-example').textContent = q.example ? `"${q.example}"` : "No sentence available.";

    const expTextEl = document.getElementById('exp-status-text');
    const expIconEl = document.getElementById('exp-status-icon');
    
    if (isCorrect) {
      expTextEl.textContent = "Correct Answer!";
      expTextEl.className = "exp-status-text success";
      expIconEl.className = "exp-status-icon success";
      expIconEl.innerHTML = `<i data-lucide="check-circle-2"></i>`;
    } else {
      expTextEl.textContent = "Incorrect Answer";
      expTextEl.className = "exp-status-text error";
      expIconEl.className = "exp-status-icon error";
      expIconEl.innerHTML = `<i data-lucide="alert-circle"></i>`;
    }

    lucide.createIcons();
    document.getElementById('quiz-explanation').classList.remove('hidden');
    
    this.speak(q.word);
  },

  advanceQuiz() {
    const nextIndex = this.quizSession.currentIndex + 1;
    if (nextIndex < this.quizSession.questions.length) {
      this.showQuizQuestion(nextIndex);
    } else {
      // Complete casual quiz
      document.getElementById('quiz-runner-box').classList.add('hidden');
      
      const resultsPanel = document.getElementById('quiz-results');
      resultsPanel.classList.remove('hidden');

      const total = this.quizSession.questions.length;
      const score = this.quizSession.score;
      const pct = Math.round((score / total) * 100);

      document.getElementById('results-score').textContent = `${score}/${total}`;
      document.getElementById('results-percent').textContent = `${pct}%`;

      let feedback = "";
      if (pct === 100) feedback = "🏆 Flawless! Vintage study habits yield modern results. Spaced interval updated.";
      else if (pct >= 80) feedback = "🌟 Splendid work! Your recall accuracy is highly polished.";
      else if (pct >= 50) feedback = "👍 Steady progress. Missed words will recycle back sooner.";
      else feedback = "📚 Active review recommended. The words you missed have been rescheduled to tomorrow.";
      document.getElementById('results-feedback').textContent = feedback;

      // Render corrections list
      const wrongWordsContainer = document.getElementById('wrong-words-container');
      const wrongList = document.getElementById('wrong-words-list');
      wrongList.innerHTML = '';

      if (this.quizSession.wrongAnswers.length > 0) {
        wrongWordsContainer.classList.remove('hidden');
        this.quizSession.wrongAnswers.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `
            <strong>${item.word}</strong> 
            <span>- ${item.correctDef}</span>
          `;
          wrongList.appendChild(li);
        });
      } else {
        wrongWordsContainer.classList.add('hidden');
      }

      this.renderDashboard();
    }
  },

  /* ==========================================
     4. TIMED EXAM TEST CONTROLLER
     ========================================== */
  startExam() {
    const deckSource = document.getElementById('test-setup-deck').value;
    const limit = parseInt(document.getElementById('test-setup-size').value);
    
    const allWords = SRS.getWords();
    const queues = SRS.getQueues();
    
    let pool = [];
    if (deckSource === 'due') {
      pool = [...queues.due];
    } else if (deckSource === 'starred') {
      pool = [...queues.starred];
    } else {
      pool = [...allWords];
    }

    if (pool.length === 0) {
      alert(`The selected deck pool (${deckSource}) is empty.`);
      return;
    }

    // Grab MCQ and Spelling settings
    const includeMCQ = document.getElementById('test-opt-mcq').checked;
    const includeSpelling = document.getElementById('test-opt-spelling').checked;

    if (!includeMCQ && !includeSpelling) {
      alert("Please select at least one format format (MCQs or Spelling typing).");
      return;
    }

    // Slice shuffled pool
    pool = this.shuffleArray(pool).slice(0, limit);

    // Formulate questions list
    this.examSession.questions = pool.map(wordObj => {
      // Pick format:
      // If spelling only -> force type 5 (Spelling typing)
      // If MCQ only -> pick MCQ formats (0, 1, 2, 3)
      // If both -> random
      let allowedTypes = [];
      if (includeMCQ) allowedTypes.push(0, 1, 2, 3); // MCQ types
      if (includeSpelling) allowedTypes.push(5);      // Spelling type
      
      const chosenType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
      return this.generateExamQuestion(wordObj, allWords, chosenType);
    });

    this.examSession.currentIndex = 0;
    this.examSession.answers = Array(this.examSession.questions.length).fill(null);
    this.examSession.secondsElapsed = 0;
    this.examSession.startTime = Date.now();

    // Reset setup screens
    document.getElementById('test-setup-panel').classList.add('hidden');
    document.getElementById('test-results').classList.add('hidden');
    document.getElementById('test-runner-box').classList.remove('hidden');

    document.getElementById('test-q-total').textContent = this.examSession.questions.length;

    // Start exam stopwatch timer
    clearInterval(this.examSession.timerInterval);
    this.examSession.timerInterval = setInterval(() => {
      this.examSession.secondsElapsed++;
      const mins = String(Math.floor(this.examSession.secondsElapsed / 60)).padStart(2, '0');
      const secs = String(this.examSession.secondsElapsed % 60).padStart(2, '0');
      document.getElementById('test-timer-val').textContent = `${mins}:${secs}`;
    }, 1000);

    this.showExamQuestion(0);
  },

  generateExamQuestion(targetWord, allWords, type) {
    const q = {
      word: targetWord.word,
      pos: targetWord.pos,
      definition: targetWord.definition,
      chinese: targetWord.chinese || "无中文翻译",
      example: targetWord.example,
      type: type, // 0: Word->Def, 1: Def->Word, 2: Sentence blank, 3: Word->Chinese, 5: Spelling typing
      text: "",
      options: [],
      correctIndex: -1
    };

    let pool = allWords.filter(w => w.word.toLowerCase() !== targetWord.word.toLowerCase());
    pool = this.shuffleArray(pool);
    const distractors = pool.slice(0, 3);

    if (type === 5) {
      // Spelling check typing question
      q.text = `Spelling: Type the word that fits this definition:\n\n"${targetWord.definition}"\n[Part of Speech: ${targetWord.pos} | 中文: ${targetWord.chinese}]`;
      q.typeText = "Spelling Typing Check";
    }
    else if (type === 0) {
      q.text = `Select the English definition of the vocabulary word: "${targetWord.word}"`;
      const options = [targetWord.definition, ...distractors.map(d => d.definition)];
      const shuffled = this.shuffleOptions(options, 0);
      q.options = shuffled.list;
      q.correctIndex = shuffled.correctIndex;
      q.typeText = "Multiple Choice - Definition";
    }
    else if (type === 1) {
      q.text = `Which word is defined as: "${targetWord.definition}"?`;
      const options = [targetWord.word, ...distractors.map(d => d.word)];
      const shuffled = this.shuffleOptions(options, 0);
      q.options = shuffled.list;
      q.correctIndex = shuffled.correctIndex;
      q.typeText = "Multiple Choice - Word Match";
    }
    else if (type === 2 && targetWord.example) {
      const regex = new RegExp(`\\b${targetWord.word}\\b`, 'gi');
      const blankSentence = targetWord.example.replace(regex, '__________');
      q.text = `Complete the SAT sentence context:\n\n"${blankSentence}"`;
      
      const options = [targetWord.word, ...distractors.map(d => d.word)];
      const shuffled = this.shuffleOptions(options, 0);
      q.options = shuffled.list;
      q.correctIndex = shuffled.correctIndex;
      q.typeText = "Multiple Choice - SAT Sentence";
    }
    else {
      // Word to Chinese
      q.text = `What is the Chinese translation for the English word: "${targetWord.word}"?`;
      const options = [targetWord.chinese || "无", ...distractors.map(d => d.chinese || "无中文")];
      const shuffled = this.shuffleOptions(options, 0);
      q.options = shuffled.list;
      q.correctIndex = shuffled.correctIndex;
      q.typeText = "Multiple Choice - Chinese Match";
    }

    return q;
  },

  showExamQuestion(index) {
    if (index < 0 || index >= this.examSession.questions.length) return;

    this.examSession.currentIndex = index;
    const q = this.examSession.questions[index];

    // Progress
    document.getElementById('test-q-index').textContent = index + 1;
    document.getElementById('test-type-tag').textContent = q.typeText;
    document.getElementById('test-question-text').textContent = q.text;

    // Elements
    const optionsContainer = document.getElementById('test-options');
    const spellingBox = document.getElementById('test-spelling-box');
    const spellingInput = document.getElementById('test-spelling-input');

    // Reset input fields
    spellingInput.value = '';

    if (q.type === 5) {
      // Spelling Check (Typing)
      optionsContainer.classList.add('hidden');
      spellingBox.classList.remove('hidden');
      spellingInput.focus();
      
      // Restore answer if already entered
      if (this.examSession.answers[index] !== null) {
        spellingInput.value = this.examSession.answers[index];
      }
    } else {
      // MCQ
      spellingBox.classList.add('hidden');
      optionsContainer.classList.remove('hidden');
      optionsContainer.innerHTML = '';

      q.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        
        // Restore marked selection if already saved
        const isSelected = (this.examSession.answers[index] === optIdx);
        const selectedClass = isSelected ? 'selected-marked' : '';
        const iconAttr = isSelected ? 'check-circle' : 'circle';

        btn.className = `quiz-option-btn ${selectedClass}`;
        btn.innerHTML = `
          <span>${optText}</span>
          <i data-lucide="${iconAttr}" class="option-icon"></i>
        `;
        
        btn.onclick = () => {
          // Save selected option index
          this.examSession.answers[index] = optIdx;
          
          // Toggle marked styles
          const siblingBtns = optionsContainer.querySelectorAll('.quiz-option-btn');
          siblingBtns.forEach((b, idx) => {
            b.classList.remove('selected-marked');
            b.querySelector('i').setAttribute('data-lucide', 'circle');
          });
          btn.classList.add('selected-marked');
          btn.querySelector('i').setAttribute('data-lucide', 'check-circle');
          lucide.createIcons();
        };

        optionsContainer.appendChild(btn);
      });
      lucide.createIcons();
    }

    // Change button text on final question
    const nextBtn = document.getElementById('test-next-btn');
    if (index === this.examSession.questions.length - 1) {
      nextBtn.innerHTML = `Finish Exam <i data-lucide="check-square"></i>`;
    } else {
      nextBtn.innerHTML = `Next Question <i data-lucide="arrow-right"></i>`;
    }
    lucide.createIcons();
  },

  handleExamNextClick() {
    const q = this.examSession.questions[this.examSession.currentIndex];
    
    // If spelling question, save typed value
    if (q.type === 5) {
      const typedVal = document.getElementById('test-spelling-input').value.trim();
      this.examSession.answers[this.examSession.currentIndex] = typedVal;
    }

    // Navigate or compile score
    const nextIdx = this.examSession.currentIndex + 1;
    if (nextIdx < this.examSession.questions.length) {
      this.showExamQuestion(nextIdx);
    } else {
      this.finishExam();
    }
  },

  finishExam() {
    // Clear timer
    clearInterval(this.examSession.timerInterval);

    // Calculate score card
    let correctCount = 0;
    const tableBody = document.getElementById('test-results-table-body');
    tableBody.innerHTML = '';

    this.examSession.questions.forEach((q, idx) => {
      const userAnswer = this.examSession.answers[idx];
      let isCorrect = false;
      let displayUserAnswer = "";
      let displayCorrectAnswer = "";

      if (q.type === 5) {
        // Spelling Check
        displayUserAnswer = userAnswer ? userAnswer : "(Blank)";
        displayCorrectAnswer = q.word;
        isCorrect = (userAnswer && userAnswer.toLowerCase().trim() === q.word.toLowerCase());
      } else {
        // MCQ
        displayUserAnswer = (userAnswer !== null) ? q.options[userAnswer] : "(No selection)";
        displayCorrectAnswer = q.options[q.correctIndex];
        isCorrect = (userAnswer === q.correctIndex);
      }

      if (isCorrect) correctCount++;

      // Update Database Spaced Repetition logs based on exam grade
      // Correct -> 5 (perfect recall). Wrong -> 1 (forgot/wrong interval reset)
      SRS.processReview(q.word, isCorrect ? 5 : 1);

      // Create results row
      const row = document.createElement('tr');
      const statusPill = isCorrect 
        ? `<span class="status-pill mastered">Correct</span>` 
        : `<span class="status-pill learning">Wrong</span>`;
      
      const statusClass = isCorrect ? 'text-green' : 'text-danger';

      row.innerHTML = `
        <td><strong>${q.word}</strong> <span class="pos-tag">${q.pos}</span></td>
        <td>${q.chinese}</td>
        <td class="${statusClass}">${displayUserAnswer}</td>
        <td style="font-weight:600;">${displayCorrectAnswer}</td>
        <td>${statusPill}</td>
      `;
      tableBody.appendChild(row);
    });

    // Populate scorecard metadata
    const totalQ = this.examSession.questions.length;
    const accuracy = Math.round((correctCount / totalQ) * 100);

    document.getElementById('test-score-val').textContent = `${correctCount} / ${totalQ}`;
    document.getElementById('test-accuracy-val').textContent = `${accuracy}%`;

    const mins = String(Math.floor(this.examSession.secondsElapsed / 60)).padStart(2, '0');
    const secs = String(this.examSession.secondsElapsed % 60).padStart(2, '0');
    document.getElementById('test-time-val').textContent = `${mins}:${secs}`;

    // Switch views
    document.getElementById('test-runner-box').classList.add('hidden');
    document.getElementById('test-results').classList.remove('hidden');

    this.renderDashboard();
  },

  /* ==========================================
     5. WORD LIBRARY & DIALOGS
     ========================================== */
  renderLibrary() {
    const searchInput = document.getElementById('lib-search').value.toLowerCase().trim();
    const filterStatus = document.getElementById('lib-filter-status').value;
    const allWords = SRS.getWords();
    const queues = SRS.getQueues();
    
    let filtered = allWords;

    if (filterStatus === 'starred') {
      filtered = queues.starred;
    } else if (filterStatus === 'due') {
      filtered = queues.due;
    } else if (filterStatus !== 'all') {
      filtered = allWords.filter(w => w.status === filterStatus);
    }

    if (searchInput) {
      filtered = filtered.filter(w => 
        w.word.toLowerCase().includes(searchInput) ||
        w.definition.toLowerCase().includes(searchInput) ||
        (w.chinese && w.chinese.toLowerCase().includes(searchInput)) ||
        w.pos.toLowerCase().includes(searchInput)
      );
    }

    const totalWords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalWords / this.library.pageSize));
    
    if (this.library.currentPage > totalPages) {
      this.library.currentPage = totalPages;
    }
    if (this.library.currentPage < 1) {
      this.library.currentPage = 1;
    }

    document.getElementById('pagination-info-text').textContent = `Page ${this.library.currentPage} of ${totalPages}`;
    
    document.getElementById('pagination-prev').disabled = (this.library.currentPage === 1);
    document.getElementById('pagination-next').disabled = (this.library.currentPage === totalPages);

    const startIdx = (this.library.currentPage - 1) * this.library.pageSize;
    const endIdx = startIdx + this.library.pageSize;
    const pageWords = filtered.slice(startIdx, endIdx);

    const gridContainer = document.getElementById('library-grid-container');
    gridContainer.innerHTML = '';

    if (pageWords.length === 0) {
      gridContainer.innerHTML = `
        <div class="glass-panel" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
          <i data-lucide="help-circle" style="width: 40px; height: 40px; margin-bottom: 12px; color: var(--text-muted);"></i>
          <h3>No vocabulary words match your search filters.</h3>
          <p style="font-size: 13px; margin-top: 6px;">Try clearing search fields or add new words manually!</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    pageWords.forEach(wordObj => {
      const card = document.createElement('div');
      card.className = 'library-card glass-panel';
      
      const starClass = wordObj.starred ? 'starred' : '';
      const isDue = queues.due.some(w => w.word.toLowerCase() === wordObj.word.toLowerCase());
      const dueBadgeHtml = isDue ? `<span class="status-pill learning" style="background-color:rgba(201, 101, 101, 0.1); color: var(--danger); border: 1px solid var(--danger);">DUE</span>` : '';

      card.innerHTML = `
        <div class="lib-card-header">
          <span class="lib-card-word-title">
            ${wordObj.word}
            <i data-lucide="star" class="lib-star-icon ${starClass}" onclick="UI.toggleLibraryWordStar('${wordObj.word}')"></i>
          </span>
          <span class="lib-card-pos">${wordObj.pos}</span>
        </div>
        <p class="lib-card-def">${wordObj.definition}</p>
        <p class="lib-card-chinese">${wordObj.chinese || "无中文翻译"}</p>
        <div class="lib-card-footer">
          <div style="display:flex; gap: 4px; align-items:center;">
            <span class="status-pill ${wordObj.status}">${wordObj.status}</span>
            ${dueBadgeHtml}
          </div>
          <div class="lib-card-actions">
            <button class="icon-btn edit-btn" onclick="UI.openEditModal('${wordObj.word}')" title="Edit word">
              <i data-lucide="edit-3"></i>
            </button>
            <button class="icon-btn delete-btn" onclick="UI.handleDeleteWord('${wordObj.word}')" title="Delete word">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      `;
      gridContainer.appendChild(card);
    });

    lucide.createIcons();
  },

  toggleLibraryWordStar(wordText) {
    SRS.toggleStar(wordText);
    this.renderLibrary();
    this.renderDashboard();
  },

  openEditModal(wordText) {
    const allWords = SRS.getWords();
    const wordObj = allWords.find(w => w.word.toLowerCase() === wordText.toLowerCase());
    
    if (!wordObj) return;

    document.getElementById('modal-title').textContent = "Edit Word Details";
    document.getElementById('edit-original-word').value = wordObj.word;
    
    const wordInput = document.getElementById('form-word');
    wordInput.value = wordObj.word;
    wordInput.disabled = true;

    document.getElementById('form-pos').value = wordObj.pos;
    document.getElementById('form-definition').value = wordObj.definition;
    document.getElementById('form-chinese').value = wordObj.chinese || '';
    document.getElementById('form-synonyms').value = (wordObj.synonyms || []).join(', ');
    document.getElementById('form-example').value = wordObj.example || '';

    document.getElementById('word-modal').classList.add('active');
  },

  openAddModal() {
    document.getElementById('modal-title').textContent = "Add Custom Word";
    document.getElementById('edit-original-word').value = "";
    
    const wordInput = document.getElementById('form-word');
    wordInput.value = "";
    wordInput.disabled = false;

    document.getElementById('form-pos').value = "noun";
    document.getElementById('form-definition').value = "";
    document.getElementById('form-chinese').value = "";
    document.getElementById('form-synonyms').value = "";
    document.getElementById('form-example').value = "";

    document.getElementById('word-modal').classList.add('active');
  },

  handleDeleteWord(wordText) {
    if (confirm(`Are you sure you want to delete "${wordText}"? This cannot be undone.`)) {
      SRS.deleteWord(wordText);
      this.renderLibrary();
      this.renderDashboard();
    }
  },

  /* ==========================================
     6. GEMINI AI CLIENT-SIDE SMART IMPORTER
     ========================================== */
  async handleAISmartImport() {
    const rawText = document.getElementById('import-ai-text').value.trim();
    const apiKey = document.getElementById('ai-api-key').value.trim();

    if (!rawText) {
      alert("Please paste your unstructured notes or document text before analyzing.");
      return;
    }

    if (!apiKey) {
      alert("Please enter a Google Gemini API Key first. You can get one for free on Google AI Studio.");
      return;
    }

    // Save key to local settings
    localStorage.setItem('sat_vocab_api_key', apiKey);

    // Toggle loader UI
    const loader = document.getElementById('ai-loading-indicator');
    const resultsPanel = document.getElementById('import-ai-results-panel');
    const importBtn = document.getElementById('import-ai-submit');

    loader.classList.remove('hidden');
    resultsPanel.classList.add('hidden');
    importBtn.disabled = true;

    try {
      // Gemini API Endpoint (Gemini 2.5 Flash model)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const systemPrompt = `You are a professional SAT Vocabulary Teacher. Your task is to analyze the provided study notes, book excerpts, or lists and extract vocabulary terms. Output ONLY a valid JSON array of objects. Do not write markdown blocks (no \`\`\`json wrappers), do not write backticks, and do not add conversational text. The JSON array must look like this:
[
  {
    "word": "English vocabulary word spelled correctly",
    "pos": "one of: 'noun', 'verb', 'adjective', 'adverb'",
    "definition": "A clear, concise SAT level English definition",
    "chinese": "Concise Chinese translations/meanings separated by commas",
    "example": "A high-quality illustrative SAT context sentence containing the word"
  }
]
If the input document misses pos, definition, chinese, or example sentence, compose a high-quality SAT appropriate version yourself. Always ensure vocabulary words are single terms and definitions are precise.`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nInput Document:\n${rawText}`
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "HTTP Error connecting to Gemini API.");
      }

      const responseData = await response.json();
      const responseText = responseData.candidates[0].content.parts[0].text;
      
      // Parse structured JSON returned by Gemini
      const parsedWords = JSON.parse(responseText.trim());
      
      if (!Array.isArray(parsedWords)) {
        throw new Error("Gemini API did not return a valid array of vocabulary words.");
      }

      // Import to database
      const report = SRS.importStructuredJSON(parsedWords);

      // Render results
      document.getElementById('import-ai-success-count').textContent = report.importedCount;
      document.getElementById('import-ai-fail-count').textContent = report.skippedCount;
      resultsPanel.classList.remove('hidden');
      
      // Clear input on success
      document.getElementById('import-ai-text').value = '';
      this.renderDashboard();

    } catch (err) {
      console.error(err);
      alert(`AI Import failed: ${err.message}\n\nPlease verify that your API Key is correct and that your computer is connected to the internet.`);
    } finally {
      loader.classList.add('hidden');
      importBtn.disabled = false;
    }
  },

  /* ==========================================
     HELPER MATH & SHUFFLE UTILITIES
     ========================================== */
  shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },

  shuffleOptions(optionsArray, correctIdx) {
    const correctValue = optionsArray[correctIdx];
    const shuffled = this.shuffleArray(optionsArray);
    const newCorrectIdx = shuffled.indexOf(correctValue);
    
    return {
      list: shuffled,
      correctIndex: newCorrectIdx
    };
  }
};

// Bind to window context
if (typeof window !== 'undefined') {
  window.UI = window.UI || UI;
}
