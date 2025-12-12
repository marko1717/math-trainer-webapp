// === Telegram Web App Integration ===
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();

    // Apply Telegram theme
    if (tg.colorScheme === 'light') {
        document.body.classList.add('tg-theme-light');
    }
}

// === GPT API Configuration ===
const API_BASE = 'https://marko17.pythonanywhere.com';

// === LaTeX Rendering ===
function renderMath(element) {
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(element, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    }
}

function setTextWithMath(element, text) {
    element.innerHTML = text;
    renderMath(element);
}

// === GPT API Functions ===
async function getGPTExplanation(question, correct, userAnswer, formulaType) {
    try {
        const response = await fetch(`${API_BASE}/api/explain`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question,
                correct,
                userAnswer,
                formulaType
            })
        });
        const data = await response.json();
        return data.success ? data.explanation : null;
    } catch (e) {
        console.error('GPT explain error:', e);
        return null;
    }
}

async function getGPTFeedback(correct, total, level, weakAreas, streak) {
    try {
        const response = await fetch(`${API_BASE}/api/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correct,
                total,
                level,
                weakAreas,
                streak
            })
        });
        const data = await response.json();
        return data.success ? data.feedback : null;
    } catch (e) {
        console.error('GPT feedback error:', e);
        return null;
    }
}

async function getGPTHint(question, formulaType) {
    try {
        const response = await fetch(`${API_BASE}/api/hint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, formulaType })
        });
        const data = await response.json();
        return data.success ? data.hint : null;
    } catch (e) {
        console.error('GPT hint error:', e);
        return null;
    }
}

// === Formula Database ===
// 5 основних формул для НМТ (без кубів суми/різниці)
const FORMULAS = {
    squareSum: {
        name: 'Квадрат суми',
        formula: '(a + b)² = a² + 2ab + b²',
        difficulty: 1
    },
    squareDiff: {
        name: 'Квадрат різниці',
        formula: '(a - b)² = a² - 2ab + b²',
        difficulty: 1
    },
    diffSquares: {
        name: 'Різниця квадратів',
        formula: 'a² - b² = (a - b)(a + b)',
        difficulty: 1
    },
    sumCubes: {
        name: 'Сума кубів',
        formula: 'a³ + b³ = (a + b)(a² - ab + b²)',
        difficulty: 2
    },
    diffCubes: {
        name: 'Різниця кубів',
        formula: 'a³ - b³ = (a - b)(a² + ab + b²)',
        difficulty: 2
    }
};

// === Question Generators ===
const questionGenerators = {
    // Level 1: Basic squares
    squareSum: (difficulty) => {
        const vars = difficulty === 1 ? ['x', 'y', 'a', 'b'] : ['x', 'y', 'a', 'b', 'm', 'n'];
        const v = vars[Math.floor(Math.random() * vars.length)];
        const nums = difficulty === 1 ? [1, 2, 3, 4, 5] : [2, 3, 4, 5, 6, 7];
        const n = nums[Math.floor(Math.random() * nums.length)];

        return {
            question: `Розкрийте дужки: (${v} + ${n})²`,
            correct: `${v}² + ${2*n}${v} + ${n*n}`,
            formula: 'squareSum',
            explanation: `(${v} + ${n})² = ${v}² + 2·${v}·${n} + ${n}² = ${v}² + ${2*n}${v} + ${n*n}`,
            wrongAnswers: [
                `${v}² + ${n}${v} + ${n*n}`,
                `${v}² + ${2*n}${v} + ${n}`,
                `${v}² - ${2*n}${v} + ${n*n}`,
                `${v}² + ${n*n}`
            ]
        };
    },

    squareDiff: (difficulty) => {
        const vars = ['x', 'y', 'a', 'b', 'm'];
        const v = vars[Math.floor(Math.random() * vars.length)];
        const nums = difficulty === 1 ? [1, 2, 3, 4] : [2, 3, 4, 5, 6];
        const n = nums[Math.floor(Math.random() * nums.length)];

        return {
            question: `Розкрийте дужки: (${v} - ${n})²`,
            correct: `${v}² - ${2*n}${v} + ${n*n}`,
            formula: 'squareDiff',
            explanation: `(${v} - ${n})² = ${v}² - 2·${v}·${n} + ${n}² = ${v}² - ${2*n}${v} + ${n*n}`,
            wrongAnswers: [
                `${v}² + ${2*n}${v} + ${n*n}`,
                `${v}² - ${n}${v} + ${n*n}`,
                `${v}² - ${2*n}${v} - ${n*n}`,
                `${v}² - ${n*n}`
            ]
        };
    },

    diffSquares: (difficulty) => {
        const vars = ['x', 'y', 'a', 'b'];
        const v = vars[Math.floor(Math.random() * vars.length)];
        const squares = [4, 9, 16, 25, 36, 49];
        const sq = squares[Math.floor(Math.random() * (difficulty === 1 ? 3 : squares.length))];
        const n = Math.sqrt(sq);

        return {
            question: `Розкладіть на множники: ${v}² - ${sq}`,
            correct: `(${v} - ${n})(${v} + ${n})`,
            formula: 'diffSquares',
            explanation: `${v}² - ${sq} = ${v}² - ${n}² = (${v} - ${n})(${v} + ${n})`,
            wrongAnswers: [
                `(${v} - ${n})²`,
                `(${v} + ${n})²`,
                `(${v} - ${sq})(${v} + ${sq})`,
                `(${v} - ${n})(${v} - ${n})`
            ]
        };
    },

    // Level 2: Sum/Diff of cubes
    sumCubes: (difficulty) => {
        const vars = ['x', 'y', 'a'];
        const v = vars[Math.floor(Math.random() * vars.length)];
        const cubes = [8, 27, 64];
        const cube = cubes[Math.floor(Math.random() * cubes.length)];
        const n = Math.round(Math.pow(cube, 1/3));

        return {
            question: `Розкладіть на множники: ${v}³ + ${cube}`,
            correct: `(${v} + ${n})(${v}² - ${n}${v} + ${n*n})`,
            formula: 'sumCubes',
            explanation: `${v}³ + ${cube} = ${v}³ + ${n}³ = (${v} + ${n})(${v}² - ${v}·${n} + ${n}²)`,
            wrongAnswers: [
                `(${v} + ${n})(${v}² + ${n}${v} + ${n*n})`,
                `(${v} - ${n})(${v}² + ${n}${v} + ${n*n})`,
                `(${v} + ${n})³`,
                `(${v} + ${n})(${v}² - ${n*n})`
            ]
        };
    },

    diffCubes: (difficulty) => {
        const vars = ['x', 'y', 'a'];
        const v = vars[Math.floor(Math.random() * vars.length)];
        const cubes = [8, 27, 64];
        const cube = cubes[Math.floor(Math.random() * cubes.length)];
        const n = Math.round(Math.pow(cube, 1/3));

        return {
            question: `Розкладіть на множники: ${v}³ - ${cube}`,
            correct: `(${v} - ${n})(${v}² + ${n}${v} + ${n*n})`,
            formula: 'diffCubes',
            explanation: `${v}³ - ${cube} = ${v}³ - ${n}³ = (${v} - ${n})(${v}² + ${v}·${n} + ${n}²)`,
            wrongAnswers: [
                `(${v} - ${n})(${v}² - ${n}${v} + ${n*n})`,
                `(${v} + ${n})(${v}² - ${n}${v} + ${n*n})`,
                `(${v} - ${n})³`,
                `(${v} - ${n})(${v}² + ${n*n})`
            ]
        };
    }
};

// === Adaptive AI Engine ===
class AdaptiveAI {
    constructor() {
        this.loadState();
    }

    loadState() {
        const saved = localStorage.getItem('mathTrainerState');
        if (saved) {
            const state = JSON.parse(saved);
            this.level = state.level || 1;
            this.streak = state.streak || 0;
            this.totalCorrect = state.totalCorrect || 0;
            this.totalQuestions = state.totalQuestions || 0;
            this.formulaStats = state.formulaStats || {};
            this.sessionHistory = [];
        } else {
            this.reset();
        }
    }

    reset() {
        this.level = 1;
        this.streak = 0;
        this.totalCorrect = 0;
        this.totalQuestions = 0;
        this.formulaStats = {};
        this.sessionHistory = [];

        // Initialize stats for all formulas
        Object.keys(FORMULAS).forEach(key => {
            this.formulaStats[key] = {
                attempts: 0,
                correct: 0,
                lastSeen: null,
                confidence: 0.5 // 0 to 1
            };
        });
    }

    saveState() {
        localStorage.setItem('mathTrainerState', JSON.stringify({
            level: this.level,
            streak: this.streak,
            totalCorrect: this.totalCorrect,
            totalQuestions: this.totalQuestions,
            formulaStats: this.formulaStats
        }));
    }

    // Get available question types based on current level
    getAvailableTypes() {
        const types = [];

        // Level 1: Basic squares
        if (this.level >= 1) {
            types.push('squareSum', 'squareDiff', 'diffSquares');
        }

        // Level 2: Sum/Diff of cubes
        if (this.level >= 2) {
            types.push('sumCubes', 'diffCubes');
        }

        return types;
    }

    // Smart question selection based on performance
    selectNextQuestion() {
        const available = this.getAvailableTypes();

        // Find weak areas (low confidence)
        const weakAreas = available.filter(type => {
            const stats = this.formulaStats[type];
            return stats.confidence < 0.6 && stats.attempts > 0;
        });

        // 40% chance to focus on weak areas if they exist
        if (weakAreas.length > 0 && Math.random() < 0.4) {
            const type = weakAreas[Math.floor(Math.random() * weakAreas.length)];
            return questionGenerators[type](this.level);
        }

        // Otherwise, random from available
        const type = available[Math.floor(Math.random() * available.length)];
        return questionGenerators[type](this.level);
    }

    // Process answer and update stats
    processAnswer(formulaType, isCorrect, responseTime) {
        const stats = this.formulaStats[formulaType];
        stats.attempts++;
        stats.lastSeen = Date.now();

        if (isCorrect) {
            stats.correct++;
            this.streak++;
            this.totalCorrect++;

            // Increase confidence (weighted by speed)
            const speedBonus = responseTime < 5000 ? 0.1 : 0.05;
            stats.confidence = Math.min(1, stats.confidence + 0.15 + speedBonus);
        } else {
            this.streak = 0;

            // Decrease confidence
            stats.confidence = Math.max(0, stats.confidence - 0.2);
        }

        this.totalQuestions++;
        this.sessionHistory.push({ formulaType, isCorrect, responseTime });

        // Level adjustment
        this.adjustLevel();
        this.saveState();
    }

    adjustLevel() {
        // Level up: 5+ streak or high accuracy
        if (this.streak >= 5) {
            this.level = Math.min(2, this.level + 1);
            return;
        }

        // Check session performance
        const recent = this.sessionHistory.slice(-10);
        if (recent.length >= 5) {
            const recentAccuracy = recent.filter(q => q.isCorrect).length / recent.length;

            if (recentAccuracy >= 0.8 && this.level < 2) {
                this.level++;
            } else if (recentAccuracy < 0.4 && this.level > 1) {
                this.level--;
            }
        }
    }

    // Get AI feedback message
    getFeedback() {
        const accuracy = this.totalQuestions > 0
            ? Math.round((this.totalCorrect / this.totalQuestions) * 100)
            : 0;

        // Find weak areas
        const weakAreas = Object.entries(this.formulaStats)
            .filter(([_, stats]) => stats.attempts > 0 && stats.confidence < 0.5)
            .map(([key, _]) => FORMULAS[key].name);

        let message = '';

        if (accuracy >= 90) {
            message = `Відмінний результат! Твоя точність ${accuracy}% показує глибоке розуміння формул. `;
        } else if (accuracy >= 70) {
            message = `Гарна робота! ${accuracy}% правильних відповідей — це солідний результат. `;
        } else if (accuracy >= 50) {
            message = `Непогано для початку! ${accuracy}% — є куди рости. `;
        } else {
            message = `Потрібно більше практики. Рекомендую переглянути формули та спробувати ще раз. `;
        }

        if (this.streak >= 5) {
            message += `Вражаюча серія з ${this.streak} правильних відповідей підряд! `;
        }

        if (this.level === 2) {
            message += 'Ти на максимальному рівні — справжній профі!';
        } else {
            message += 'Ще трохи — і перейдеш на найвищий рівень!';
        }

        return { message, weakAreas };
    }
}

// === Game Controller ===
class GameController {
    constructor() {
        this.ai = new AdaptiveAI();
        this.currentQuestion = null;
        this.questionStartTime = null;
        this.questionsInSession = 0;
        this.correctInSession = 0;
        this.questionsPerSession = 10;

        this.initElements();
        this.bindEvents();
        this.updateUI();
    }

    initElements() {
        // Screens
        this.startScreen = document.getElementById('startScreen');
        this.quizScreen = document.getElementById('quizScreen');
        this.resultsScreen = document.getElementById('resultsScreen');
        this.formulasScreen = document.getElementById('formulasScreen');

        // UI elements
        this.levelBadge = document.getElementById('levelBadge');
        this.streakNumber = document.getElementById('streakNumber');
        this.progressBar = document.getElementById('progressBar');
        this.correctCount = document.getElementById('correctCount');
        this.totalCount = document.getElementById('totalCount');
        this.questionNumber = document.getElementById('questionNumber');
        this.questionText = document.getElementById('questionText');
        this.answersContainer = document.getElementById('answersContainer');
        this.feedbackContainer = document.getElementById('feedbackContainer');
        this.feedbackIcon = document.getElementById('feedbackIcon');
        this.feedbackText = document.getElementById('feedbackText');
        this.feedbackExplanation = document.getElementById('feedbackExplanation');
        this.nextBtn = document.getElementById('nextBtn');
        this.difficultyIndicator = document.getElementById('difficultyIndicator');
    }

    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('restartBtn').addEventListener('click', () => this.startGame());
        document.getElementById('reviewBtn').addEventListener('click', () => this.showFormulas());
        document.getElementById('backToQuizBtn').addEventListener('click', () => this.showResults());

        // Help panel buttons
        document.getElementById('hintBtn')?.addEventListener('click', () => this.showHint());
        document.getElementById('aiHelpBtn')?.addEventListener('click', () => this.showAIHelp());
        document.getElementById('formulaBtn')?.addEventListener('click', () => this.showFormulaHelp());

        // AI modal close
        document.getElementById('aiCloseBtn')?.addEventListener('click', () => this.closeAIModal());
        document.getElementById('aiHelperModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'aiHelperModal') this.closeAIModal();
        });
    }

    // Help panel methods
    async showHint() {
        if (!this.currentQuestion) return;

        const modal = document.getElementById('aiHelperModal');
        const loading = document.getElementById('aiLoading');
        const response = document.getElementById('aiResponse');

        modal.classList.remove('hidden');
        loading.style.display = 'flex';
        response.style.display = 'none';

        const hint = await getGPTHint(
            this.currentQuestion.question,
            FORMULAS[this.currentQuestion.formula]?.name || ''
        );

        loading.style.display = 'none';
        response.style.display = 'block';

        if (hint) {
            response.innerHTML = `<p><strong>💡 Підказка:</strong></p><p>${hint}</p>`;
        } else {
            // Fallback hint
            const formula = FORMULAS[this.currentQuestion.formula];
            response.innerHTML = `
                <p><strong>💡 Підказка:</strong></p>
                <p>Пригадай формулу: <strong>${formula?.formula || ''}</strong></p>
                <p>${formula?.name || 'Формули скороченого множення'}</p>
            `;
        }
    }

    async showAIHelp() {
        this.showHint(); // Same as hint for now
    }

    showFormulaHelp() {
        const modal = document.getElementById('aiHelperModal');
        const loading = document.getElementById('aiLoading');
        const response = document.getElementById('aiResponse');

        modal.classList.remove('hidden');
        loading.style.display = 'none';
        response.style.display = 'block';

        response.innerHTML = `
            <h3 style="color: var(--accent); margin-bottom: 1rem;">📐 Формули скороченого множення</h3>
            <div style="margin-bottom: 1rem;">
                <p><strong>(a + b)² = a² + 2ab + b²</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Квадрат суми</p>
            </div>
            <div style="margin-bottom: 1rem;">
                <p><strong>(a - b)² = a² - 2ab + b²</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Квадрат різниці</p>
            </div>
            <div style="margin-bottom: 1rem;">
                <p><strong>a² - b² = (a-b)(a+b)</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Різниця квадратів</p>
            </div>
            <div style="margin-bottom: 1rem;">
                <p><strong>a³ + b³ = (a+b)(a²-ab+b²)</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Сума кубів</p>
            </div>
            <div>
                <p><strong>a³ - b³ = (a-b)(a²+ab+b²)</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Різниця кубів</p>
            </div>
        `;
    }

    closeAIModal() {
        document.getElementById('aiHelperModal')?.classList.add('hidden');
    }

    showScreen(screen) {
        [this.startScreen, this.quizScreen, this.resultsScreen, this.formulasScreen]
            .forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    updateUI() {
        this.levelBadge.textContent = `Рівень ${this.ai.level}`;
        this.streakNumber.textContent = this.ai.streak;

        // Update difficulty dots
        const dots = this.difficultyIndicator.querySelectorAll('.difficulty-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i < this.ai.level);
        });
    }

    startGame() {
        this.questionsInSession = 0;
        this.correctInSession = 0;
        this.ai.sessionHistory = [];
        this.showScreen(this.quizScreen);
        this.nextQuestion();
    }

    nextQuestion() {
        if (this.questionsInSession >= this.questionsPerSession) {
            this.showResults();
            return;
        }

        this.questionsInSession++;
        this.currentQuestion = this.ai.selectNextQuestion();
        this.questionStartTime = Date.now();

        this.renderQuestion();
        this.updateUI();

        // Update progress
        const progress = (this.questionsInSession - 1) / this.questionsPerSession * 100;
        this.progressBar.style.setProperty('--progress', `${progress}%`);
        this.correctCount.textContent = this.correctInSession;
        this.totalCount.textContent = this.questionsInSession - 1;
    }

    renderQuestion() {
        this.questionNumber.textContent = `Питання ${this.questionsInSession}`;
        this.questionText.textContent = this.currentQuestion.question;

        // Generate answers
        const answers = this.shuffleAnswers([
            { text: this.currentQuestion.correct, isCorrect: true },
            ...this.currentQuestion.wrongAnswers.slice(0, 3).map(text => ({ text, isCorrect: false }))
        ]);

        const letters = ['A', 'B', 'C', 'D'];
        this.answersContainer.innerHTML = answers.map((answer, i) => `
            <button class="answer-btn" data-correct="${answer.isCorrect}">
                <span class="answer-letter">${letters[i]}</span>
                <span class="answer-text">${answer.text}</span>
            </button>
        `).join('');

        // Bind answer clicks
        this.answersContainer.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleAnswer(btn));
        });

        // Hide feedback and next button
        this.feedbackContainer.classList.remove('show', 'correct', 'incorrect');
        this.nextBtn.style.display = 'none';
    }

    shuffleAnswers(answers) {
        for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        return answers;
    }

    handleAnswer(btn) {
        const isCorrect = btn.dataset.correct === 'true';
        const responseTime = Date.now() - this.questionStartTime;

        // Disable all buttons
        this.answersContainer.querySelectorAll('.answer-btn').forEach(b => {
            b.classList.add('disabled');
            if (b.dataset.correct === 'true') {
                b.classList.add('correct');
            }
        });

        // Mark selected answer
        if (!isCorrect) {
            btn.classList.add('incorrect');
            btn.classList.add('animate-shake');
        } else {
            btn.classList.add('animate-pulse');
        }

        // Update stats
        this.ai.processAnswer(this.currentQuestion.formula, isCorrect, responseTime);
        if (isCorrect) this.correctInSession++;

        // Show feedback with user's answer
        const userAnswerText = btn.querySelector('.answer-text')?.textContent || '';
        this.showFeedback(isCorrect, userAnswerText);

        // Update UI
        this.updateUI();
        this.correctCount.textContent = this.correctInSession;
        this.totalCount.textContent = this.questionsInSession;

        // Haptic feedback if available
        if (tg?.HapticFeedback) {
            if (isCorrect) {
                tg.HapticFeedback.notificationOccurred('success');
            } else {
                tg.HapticFeedback.notificationOccurred('error');
            }
        }
    }

    async showFeedback(isCorrect, userAnswer = '') {
        this.feedbackContainer.classList.add('show');
        this.feedbackContainer.classList.add(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            this.feedbackIcon.textContent = '✅';
            this.feedbackText.textContent = this.getPositiveFeedback();
            this.feedbackExplanation.textContent = this.currentQuestion.explanation;
        } else {
            this.feedbackIcon.textContent = '❌';
            this.feedbackText.textContent = 'Неправильно';
            this.feedbackExplanation.textContent = '🤖 Завантажую пояснення від ШІ...';

            // Get GPT explanation for wrong answer
            const gptExplanation = await getGPTExplanation(
                this.currentQuestion.question,
                this.currentQuestion.correct,
                userAnswer,
                FORMULAS[this.currentQuestion.formula]?.name || ''
            );

            if (gptExplanation) {
                setTextWithMath(this.feedbackExplanation, '🤖 ' + gptExplanation);
            } else {
                this.feedbackExplanation.textContent = this.currentQuestion.explanation;
            }
        }

        this.nextBtn.style.display = 'block';
    }

    getPositiveFeedback() {
        const messages = ['Правильно!', 'Чудово!', 'Так тримати!', 'Молодець!', 'Бінго!'];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    async showResults() {
        this.showScreen(this.resultsScreen);

        const accuracy = Math.round((this.correctInSession / this.questionsPerSession) * 100);

        // Update result stats
        document.getElementById('resultCorrect').textContent = this.correctInSession;
        document.getElementById('resultAccuracy').textContent = `${accuracy}%`;
        document.getElementById('resultLevel').textContent = this.ai.level;

        // Set result icon and title based on performance
        const resultsIcon = document.getElementById('resultsIcon');
        const resultsTitle = document.getElementById('resultsTitle');

        if (accuracy >= 90) {
            resultsIcon.textContent = '🏆';
            resultsTitle.textContent = 'Неймовірно!';
        } else if (accuracy >= 70) {
            resultsIcon.textContent = '🎉';
            resultsTitle.textContent = 'Чудова робота!';
        } else if (accuracy >= 50) {
            resultsIcon.textContent = '👍';
            resultsTitle.textContent = 'Непогано!';
        } else {
            resultsIcon.textContent = '💪';
            resultsTitle.textContent = 'Потрібна практика';
        }

        // Get weak areas
        const { message, weakAreas } = this.ai.getFeedback();

        // Show loading state for AI feedback
        const aiTextEl = document.getElementById('aiText');
        aiTextEl.textContent = '🤖 Аналізую результати...';

        // Get GPT personalized feedback
        const gptFeedback = await getGPTFeedback(
            this.correctInSession,
            this.questionsPerSession,
            this.ai.level,
            weakAreas,
            this.ai.streak
        );

        if (gptFeedback) {
            setTextWithMath(aiTextEl, gptFeedback);
        } else {
            aiTextEl.textContent = message;
        }

        // Show weak areas if any
        const weakTopicsDiv = document.getElementById('weakTopics');
        const weakList = document.getElementById('weakList');

        if (weakAreas.length > 0) {
            weakTopicsDiv.style.display = 'block';
            weakList.innerHTML = weakAreas.map(area =>
                `<span class="weak-tag">${area}</span>`
            ).join('');
        } else {
            weakTopicsDiv.style.display = 'none';
        }

        // Update progress bar to 100%
        this.progressBar.style.setProperty('--progress', '100%');

        // Save to Firebase
        this.saveToFirebase();
    }

    async saveToFirebase() {
        if (window.MathQuestFirebase) {
            try {
                const result = await window.MathQuestFirebase.saveTrainerSession({
                    trainerId: 'fsm',
                    trainerName: 'Формули скороч. множення',
                    score: this.correctInSession,
                    totalQuestions: this.questionsPerSession,
                    difficulty: this.ai.level,
                    timeSpent: 0
                });
                if (result) {
                    console.log('✅ FSM session saved to Firebase');
                }
            } catch (error) {
                console.log('Could not save to Firebase:', error);
            }
        }
    }

    showFormulas() {
        this.showScreen(this.formulasScreen);
    }
}

// === Initialize App ===
document.addEventListener('DOMContentLoaded', () => {
    new GameController();
});
