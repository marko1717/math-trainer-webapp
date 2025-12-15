// === Telegram Web App Integration ===
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();

    if (tg.colorScheme === 'light') {
        document.body.classList.add('tg-theme-light');
    }
}

// === Trig Types ===
const TRIG_TYPES = {
    degToRad: {
        name: 'Градуси → радіани',
        difficulty: 1
    },
    radToDeg: {
        name: 'Радіани → градуси',
        difficulty: 1
    },
    tableValues: {
        name: 'Табличні значення',
        difficulty: 1
    },
    parity: {
        name: 'Парність функцій',
        difficulty: 2
    },
    identity: {
        name: 'Тотожності',
        difficulty: 2
    },
    reductionFormulas: {
        name: 'Формули зведення',
        difficulty: 3
    }
};

// === Conversion Data ===
const ANGLE_CONVERSIONS = [
    { deg: 0, rad: '0' },
    { deg: 30, rad: 'π/6' },
    { deg: 45, rad: 'π/4' },
    { deg: 60, rad: 'π/3' },
    { deg: 90, rad: 'π/2' },
    { deg: 120, rad: '2π/3' },
    { deg: 135, rad: '3π/4' },
    { deg: 150, rad: '5π/6' },
    { deg: 180, rad: 'π' },
    { deg: 210, rad: '7π/6' },
    { deg: 225, rad: '5π/4' },
    { deg: 240, rad: '4π/3' },
    { deg: 270, rad: '3π/2' },
    { deg: 300, rad: '5π/3' },
    { deg: 315, rad: '7π/4' },
    { deg: 330, rad: '11π/6' },
    { deg: 360, rad: '2π' }
];

// === Table Values ===
const TABLE_VALUES = {
    0: { sin: '0', cos: '1', tg: '0' },
    30: { sin: '1/2', cos: '√3/2', tg: '√3/3' },
    45: { sin: '√2/2', cos: '√2/2', tg: '1' },
    60: { sin: '√3/2', cos: '1/2', tg: '√3' },
    90: { sin: '1', cos: '0', tg: '—' }
};

// === Question Generators ===
const questionGenerators = {
    // Level 1: Degrees to radians
    degToRad: () => {
        const angle = ANGLE_CONVERSIONS[Math.floor(Math.random() * ANGLE_CONVERSIONS.length)];

        const wrongRads = ANGLE_CONVERSIONS
            .filter(a => a.rad !== angle.rad)
            .map(a => a.rad)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);

        return {
            question: `Переведіть ${angle.deg}° в радіани`,
            correct: angle.rad,
            formula: 'degToRad',
            explanation: `${angle.deg}° = ${angle.deg} · π/180 = ${angle.rad}`,
            wrongAnswers: wrongRads
        };
    },

    // Level 1: Radians to degrees
    radToDeg: () => {
        const angle = ANGLE_CONVERSIONS[Math.floor(Math.random() * ANGLE_CONVERSIONS.length)];

        const wrongDegs = ANGLE_CONVERSIONS
            .filter(a => a.deg !== angle.deg)
            .map(a => `${a.deg}°`)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);

        return {
            question: `Переведіть ${angle.rad} в градуси`,
            correct: `${angle.deg}°`,
            formula: 'radToDeg',
            explanation: `${angle.rad} = ${angle.rad} · 180/π = ${angle.deg}°`,
            wrongAnswers: wrongDegs
        };
    },

    // Level 1: Table values
    tableValues: () => {
        const angles = [0, 30, 45, 60, 90];
        const angle = angles[Math.floor(Math.random() * angles.length)];
        const funcs = ['sin', 'cos'];
        if (angle !== 90) funcs.push('tg');
        const func = funcs[Math.floor(Math.random() * funcs.length)];

        const value = TABLE_VALUES[angle][func];

        // Generate wrong answers
        const allValues = ['0', '1', '1/2', '√2/2', '√3/2', '√3/3', '√3', '-1/2', '-√2/2'];
        const wrongValues = allValues
            .filter(v => v !== value)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);

        return {
            question: `Знайдіть ${func}(${angle}°)`,
            correct: value,
            formula: 'tableValues',
            explanation: `${func}(${angle}°) = ${value} (табличне значення)`,
            wrongAnswers: wrongValues
        };
    },

    // Level 2: Parity of functions
    parity: () => {
        const questions = [
            {
                q: 'sin(-30°) = ?',
                correct: '-sin(30°)',
                explanation: 'sin(-α) = -sin(α) (синус — непарна функція)',
                wrong: ['sin(30°)', '-cos(30°)', 'cos(30°)']
            },
            {
                q: 'cos(-60°) = ?',
                correct: 'cos(60°)',
                explanation: 'cos(-α) = cos(α) (косинус — парна функція)',
                wrong: ['-cos(60°)', 'sin(60°)', '-sin(60°)']
            },
            {
                q: 'tg(-45°) = ?',
                correct: '-tg(45°)',
                explanation: 'tg(-α) = -tg(α) (тангенс — непарна функція)',
                wrong: ['tg(45°)', '-ctg(45°)', 'ctg(45°)']
            },
            {
                q: 'sin(-π/4) = ?',
                correct: '-sin(π/4)',
                explanation: 'sin(-α) = -sin(α) (синус — непарна функція)',
                wrong: ['sin(π/4)', '-cos(π/4)', 'cos(π/4)']
            },
            {
                q: 'cos(-π/3) = ?',
                correct: 'cos(π/3)',
                explanation: 'cos(-α) = cos(α) (косинус — парна функція)',
                wrong: ['-cos(π/3)', 'sin(π/3)', '-sin(π/3)']
            },
            {
                q: 'Яка функція є парною?',
                correct: 'cos(x)',
                explanation: 'cos(-x) = cos(x), тому косинус — парна функція',
                wrong: ['sin(x)', 'tg(x)', 'ctg(x)']
            },
            {
                q: 'Яка функція є непарною?',
                correct: 'sin(x)',
                explanation: 'sin(-x) = -sin(x), тому синус — непарна функція',
                wrong: ['cos(x)', 'cos²(x)', '|cos(x)|']
            }
        ];

        const q = questions[Math.floor(Math.random() * questions.length)];

        return {
            question: q.q,
            correct: q.correct,
            formula: 'parity',
            explanation: q.explanation,
            wrongAnswers: q.wrong
        };
    },

    // Level 2: Identities
    identity: () => {
        const questions = [
            {
                q: 'sin²α + cos²α = ?',
                correct: '1',
                explanation: 'Основна тригонометрична тотожність: sin²α + cos²α = 1',
                wrong: ['0', '2', 'sin(2α)']
            },
            {
                q: 'Якщо sin(α) = 0.6, то cos²(α) = ?',
                correct: '0.64',
                explanation: 'cos²α = 1 - sin²α = 1 - 0.36 = 0.64',
                wrong: ['0.36', '0.8', '0.4']
            },
            {
                q: 'Якщо cos(α) = 0.8, то sin²(α) = ?',
                correct: '0.36',
                explanation: 'sin²α = 1 - cos²α = 1 - 0.64 = 0.36',
                wrong: ['0.64', '0.6', '0.2']
            },
            {
                q: '1 + tg²α = ?',
                correct: '1/cos²α',
                explanation: '1 + tg²α = 1/cos²α (наслідок основної тотожності)',
                wrong: ['1/sin²α', 'tg²α', 'cos²α']
            },
            {
                q: '1 + ctg²α = ?',
                correct: '1/sin²α',
                explanation: '1 + ctg²α = 1/sin²α (наслідок основної тотожності)',
                wrong: ['1/cos²α', 'ctg²α', 'sin²α']
            },
            {
                q: 'tgα · ctgα = ?',
                correct: '1',
                explanation: 'tgα · ctgα = (sinα/cosα) · (cosα/sinα) = 1',
                wrong: ['0', 'tgα', 'sinα · cosα']
            }
        ];

        const q = questions[Math.floor(Math.random() * questions.length)];

        return {
            question: q.q,
            correct: q.correct,
            formula: 'identity',
            explanation: q.explanation,
            wrongAnswers: q.wrong
        };
    },

    // Level 3: Reduction formulas
    reductionFormulas: () => {
        const questions = [
            {
                q: 'sin(90° - α) = ?',
                correct: 'cos(α)',
                explanation: 'sin(90° - α) = cos(α) (синус доповняльного кута)',
                wrong: ['sin(α)', '-cos(α)', '-sin(α)']
            },
            {
                q: 'cos(90° - α) = ?',
                correct: 'sin(α)',
                explanation: 'cos(90° - α) = sin(α) (косинус доповняльного кута)',
                wrong: ['cos(α)', '-sin(α)', '-cos(α)']
            },
            {
                q: 'sin(180° - α) = ?',
                correct: 'sin(α)',
                explanation: 'sin(180° - α) = sin(α) (II чверть, синус +)',
                wrong: ['-sin(α)', 'cos(α)', '-cos(α)']
            },
            {
                q: 'cos(180° - α) = ?',
                correct: '-cos(α)',
                explanation: 'cos(180° - α) = -cos(α) (II чверть, косинус -)',
                wrong: ['cos(α)', 'sin(α)', '-sin(α)']
            },
            {
                q: 'sin(180° + α) = ?',
                correct: '-sin(α)',
                explanation: 'sin(180° + α) = -sin(α) (III чверть, синус -)',
                wrong: ['sin(α)', 'cos(α)', '-cos(α)']
            },
            {
                q: 'cos(180° + α) = ?',
                correct: '-cos(α)',
                explanation: 'cos(180° + α) = -cos(α) (III чверть, косинус -)',
                wrong: ['cos(α)', '-sin(α)', 'sin(α)']
            },
            {
                q: 'sin(360° - α) = ?',
                correct: '-sin(α)',
                explanation: 'sin(360° - α) = -sin(α) (IV чверть, синус -)',
                wrong: ['sin(α)', 'cos(α)', '-cos(α)']
            },
            {
                q: 'cos(360° - α) = ?',
                correct: 'cos(α)',
                explanation: 'cos(360° - α) = cos(α) (IV чверть, косинус +)',
                wrong: ['-cos(α)', 'sin(α)', '-sin(α)']
            }
        ];

        const q = questions[Math.floor(Math.random() * questions.length)];

        return {
            question: q.q,
            correct: q.correct,
            formula: 'reductionFormulas',
            explanation: q.explanation,
            wrongAnswers: q.wrong
        };
    }
};

// === Adaptive AI Engine ===
class AdaptiveAI {
    constructor() {
        this.loadState();
    }

    loadState() {
        const saved = localStorage.getItem('trigTrainerState');
        if (saved) {
            const state = JSON.parse(saved);
            this.level = state.level || 1;
            this.streak = state.streak || 0;
            this.totalCorrect = state.totalCorrect || 0;
            this.totalQuestions = state.totalQuestions || 0;
            this.typeStats = state.typeStats || {};
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
        this.typeStats = {};
        this.sessionHistory = [];

        Object.keys(TRIG_TYPES).forEach(key => {
            this.typeStats[key] = {
                attempts: 0,
                correct: 0,
                lastSeen: null,
                confidence: 0.5
            };
        });
    }

    saveState() {
        localStorage.setItem('trigTrainerState', JSON.stringify({
            level: this.level,
            streak: this.streak,
            totalCorrect: this.totalCorrect,
            totalQuestions: this.totalQuestions,
            typeStats: this.typeStats
        }));
    }

    getAvailableTypes() {
        const types = [];

        if (this.level >= 1) {
            types.push('degToRad', 'radToDeg', 'tableValues');
        }

        if (this.level >= 2) {
            types.push('parity', 'identity');
        }

        if (this.level >= 3) {
            types.push('reductionFormulas');
        }

        return types;
    }

    selectNextQuestion() {
        const available = this.getAvailableTypes();

        const weakAreas = available.filter(type => {
            const stats = this.typeStats[type];
            return stats.confidence < 0.6 && stats.attempts > 0;
        });

        if (weakAreas.length > 0 && Math.random() < 0.4) {
            const type = weakAreas[Math.floor(Math.random() * weakAreas.length)];
            return questionGenerators[type]();
        }

        const type = available[Math.floor(Math.random() * available.length)];
        return questionGenerators[type]();
    }

    processAnswer(trigType, isCorrect, responseTime) {
        const stats = this.typeStats[trigType];
        stats.attempts++;
        stats.lastSeen = Date.now();

        if (isCorrect) {
            stats.correct++;
            this.streak++;
            this.totalCorrect++;
            const speedBonus = responseTime < 5000 ? 0.1 : 0.05;
            stats.confidence = Math.min(1, stats.confidence + 0.15 + speedBonus);
        } else {
            this.streak = 0;
            stats.confidence = Math.max(0, stats.confidence - 0.2);
        }

        this.totalQuestions++;
        this.sessionHistory.push({ trigType, isCorrect, responseTime });
        this.adjustLevel();
        this.saveState();
    }

    adjustLevel() {
        if (this.streak >= 5) {
            this.level = Math.min(3, this.level + 1);
            return;
        }

        const recent = this.sessionHistory.slice(-10);
        if (recent.length >= 5) {
            const recentAccuracy = recent.filter(q => q.isCorrect).length / recent.length;

            if (recentAccuracy >= 0.8 && this.level < 3) {
                this.level++;
            } else if (recentAccuracy < 0.4 && this.level > 1) {
                this.level--;
            }
        }
    }

    getFeedback() {
        const accuracy = this.totalQuestions > 0
            ? Math.round((this.totalCorrect / this.totalQuestions) * 100)
            : 0;

        const weakAreas = Object.entries(this.typeStats)
            .filter(([_, stats]) => stats.attempts > 0 && stats.confidence < 0.5)
            .map(([key, _]) => TRIG_TYPES[key].name);

        let message = '';

        if (accuracy >= 90) {
            message = `Блискуче! ${accuracy}% - ти майстер тригонометрії! `;
        } else if (accuracy >= 70) {
            message = `Гарний результат! ${accuracy}% правильних. `;
        } else if (accuracy >= 50) {
            message = `Непогано! ${accuracy}% - продовжуй тренуватися. `;
        } else {
            message = `Потрібно ще потренуватися. Вивчи табличні значення! `;
        }

        if (this.streak >= 5) {
            message += `Серія з ${this.streak} правильних! `;
        }

        if (this.level === 3) {
            message += 'Максимальний рівень!';
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
        this.startScreen = document.getElementById('startScreen');
        this.quizScreen = document.getElementById('quizScreen');
        this.resultsScreen = document.getElementById('resultsScreen');
        this.formulasScreen = document.getElementById('formulasScreen');

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

        document.getElementById('hintBtn')?.addEventListener('click', () => this.showHint());
        document.getElementById('formulaBtn')?.addEventListener('click', () => this.showFormulaHelp());

        document.getElementById('aiCloseBtn')?.addEventListener('click', () => this.closeAIModal());
        document.getElementById('aiHelperModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'aiHelperModal') this.closeAIModal();
        });
    }

    showHint() {
        if (!this.currentQuestion) return;

        const modal = document.getElementById('aiHelperModal');
        const loading = document.getElementById('aiLoading');
        const response = document.getElementById('aiResponse');

        modal.classList.remove('hidden');
        loading.style.display = 'none';
        response.style.display = 'block';

        let hint = '';

        switch (this.currentQuestion.formula) {
            case 'degToRad':
                hint = '💡 Щоб перевести градуси в радіани: помнож на π/180';
                break;
            case 'radToDeg':
                hint = '💡 Щоб перевести радіани в градуси: помнож на 180/π';
                break;
            case 'tableValues':
                hint = '💡 Пригадай таблицю: sin(30°)=1/2, sin(45°)=√2/2, sin(60°)=√3/2';
                break;
            case 'parity':
                hint = '💡 sin, tg, ctg — непарні (знак змінюється); cos — парна';
                break;
            case 'identity':
                hint = '💡 Основна тотожність: sin²α + cos²α = 1';
                break;
            case 'reductionFormulas':
                hint = '💡 Для 90°±α функція змінюється (sin↔cos). Для 180°, 360° — ні.';
                break;
            default:
                hint = '💡 Пригадай основні тригонометричні формули.';
        }

        response.innerHTML = `<p>${hint}</p>`;
    }

    showFormulaHelp() {
        const modal = document.getElementById('aiHelperModal');
        const loading = document.getElementById('aiLoading');
        const response = document.getElementById('aiResponse');

        modal.classList.remove('hidden');
        loading.style.display = 'none';
        response.style.display = 'block';

        response.innerHTML = `
            <h3 style="color: var(--accent); margin-bottom: 1rem;">📐 Основні формули</h3>
            <div style="margin-bottom: 0.75rem;">
                <p style="font-family: monospace;">π рад = 180°</p>
            </div>
            <div style="margin-bottom: 0.75rem;">
                <p style="font-family: monospace;">sin²α + cos²α = 1</p>
            </div>
            <div style="margin-bottom: 0.75rem;">
                <p style="font-family: monospace;">sin(-α) = -sin(α)</p>
            </div>
            <div style="margin-bottom: 0.75rem;">
                <p style="font-family: monospace;">cos(-α) = cos(α)</p>
            </div>
            <div>
                <p style="font-family: monospace;">tg = sin/cos</p>
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

        const progress = (this.questionsInSession - 1) / this.questionsPerSession * 100;
        this.progressBar.style.width = `${progress}%`;
        this.correctCount.textContent = this.correctInSession;
        this.totalCount.textContent = this.questionsInSession - 1;
    }

    renderQuestion() {
        this.questionNumber.textContent = `Питання ${this.questionsInSession}`;
        this.questionText.textContent = this.currentQuestion.question;

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

        this.answersContainer.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleAnswer(btn));
        });

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

        this.answersContainer.querySelectorAll('.answer-btn').forEach(b => {
            b.classList.add('disabled');
            if (b.dataset.correct === 'true') {
                b.classList.add('correct');
            }
        });

        if (!isCorrect) {
            btn.classList.add('incorrect');
            btn.classList.add('animate-shake');
        } else {
            btn.classList.add('animate-pulse');
        }

        this.ai.processAnswer(this.currentQuestion.formula, isCorrect, responseTime);
        if (isCorrect) this.correctInSession++;

        this.showFeedback(isCorrect);
        this.updateUI();
        this.correctCount.textContent = this.correctInSession;
        this.totalCount.textContent = this.questionsInSession;

        if (tg?.HapticFeedback) {
            if (isCorrect) {
                tg.HapticFeedback.notificationOccurred('success');
            } else {
                tg.HapticFeedback.notificationOccurred('error');
            }
        }
    }

    showFeedback(isCorrect) {
        this.feedbackContainer.classList.add('show');
        this.feedbackContainer.classList.add(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            this.feedbackIcon.textContent = '✅';
            this.feedbackText.textContent = this.getPositiveFeedback();
            this.feedbackExplanation.textContent = this.currentQuestion.explanation;
        } else {
            this.feedbackIcon.textContent = '❌';
            this.feedbackText.textContent = 'Неправильно';
            this.feedbackExplanation.innerHTML = `Правильна відповідь: <strong>${this.currentQuestion.correct}</strong>\n\n${this.currentQuestion.explanation}`;
        }

        this.nextBtn.style.display = 'block';
    }

    getPositiveFeedback() {
        const messages = ['Правильно!', 'Чудово!', 'Так тримати!', 'Молодець!', 'Бінго!'];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    showResults() {
        this.showScreen(this.resultsScreen);

        const accuracy = Math.round((this.correctInSession / this.questionsPerSession) * 100);

        document.getElementById('resultCorrect').textContent = this.correctInSession;
        document.getElementById('resultAccuracy').textContent = `${accuracy}%`;
        document.getElementById('resultLevel').textContent = this.ai.level;

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

        const { message, weakAreas } = this.ai.getFeedback();
        document.getElementById('aiText').textContent = message;

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

        this.progressBar.style.width = '100%';
        this.saveToFirebase();
    }

    async saveToFirebase() {
        if (window.MathQuestFirebase) {
            try {
                const result = await window.MathQuestFirebase.saveTrainerSession({
                    trainerId: 'trigonometry',
                    trainerName: 'Тригонометрія',
                    score: this.correctInSession,
                    totalQuestions: this.questionsPerSession,
                    difficulty: this.ai.level,
                    timeSpent: 0
                });
                if (result) {
                    console.log('Trigonometry session saved to Firebase');
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
