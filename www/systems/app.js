// === Telegram Web App Integration ===
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();

    if (tg.colorScheme === 'light') {
        document.body.classList.add('tg-theme-light');
    }
}

// === API Configuration ===
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

// === System Types ===
const SYSTEM_TYPES = {
    substitutionSimple: {
        name: 'Підстановка (прості)',
        difficulty: 1,
        method: 'substitution'
    },
    additionSimple: {
        name: 'Додавання (прості)',
        difficulty: 1,
        method: 'addition'
    },
    substitutionMedium: {
        name: 'Підстановка (середні)',
        difficulty: 2,
        method: 'substitution'
    },
    additionMedium: {
        name: 'Додавання (середні)',
        difficulty: 2,
        method: 'addition'
    },
    complex: {
        name: 'Складні системи',
        difficulty: 3,
        method: 'mixed'
    }
};

// === Question Generators ===
const questionGenerators = {
    // Level 1: Simple substitution (coefficient = 1)
    substitutionSimple: () => {
        const x = randomInt(-5, 5);
        const y = randomInt(-5, 5);

        // First equation: x + ay = b  (where a is small)
        const a1 = randomInt(-2, 2);
        const b1 = x + a1 * y;

        // Second equation: cx + y = d
        const c2 = randomInt(2, 4);
        const d2 = c2 * x + y;

        const eq1 = formatEquation(1, a1, b1);
        const eq2 = formatEquation(c2, 1, d2);

        return {
            question: 'Розв\'яжіть систему рівнянь',
            system: [eq1, eq2],
            correct: `x = ${x}, y = ${y}`,
            formula: 'substitutionSimple',
            method: 'substitution',
            steps: generateSubstitutionSteps(1, a1, b1, c2, 1, d2, x, y),
            explanation: `Метод підстановки:\n1) З 1-го рівняння: x = ${b1} ${a1 >= 0 ? '-' : '+'} ${Math.abs(a1)}y\n2) Підставляємо у 2-ге: ${c2}(${b1} ${a1 >= 0 ? '-' : '+'} ${Math.abs(a1)}y) + y = ${d2}\n3) Розв'язуємо: y = ${y}\n4) Знаходимо x = ${x}`,
            wrongAnswers: generateWrongAnswers(x, y)
        };
    },

    // Level 1: Simple addition (opposite coefficients)
    additionSimple: () => {
        const x = randomInt(-5, 5);
        const y = randomInt(-5, 5);

        // First equation: x + y = b1
        const b1 = x + y;

        // Second equation: x - y = b2
        const b2 = x - y;

        const eq1 = `x + y = ${b1}`;
        const eq2 = `x - y = ${b2}`;

        return {
            question: 'Розв\'яжіть систему рівнянь',
            system: [eq1, eq2],
            correct: `x = ${x}, y = ${y}`,
            formula: 'additionSimple',
            method: 'addition',
            steps: [
                { title: 'Складаємо рівняння', content: `(x + y) + (x - y) = ${b1} + ${b2}` },
                { title: 'Спрощуємо', content: `2x = ${b1 + b2}` },
                { title: 'Знаходимо x', content: `x = ${(b1 + b2) / 2} = ${x}` },
                { title: 'Знаходимо y', content: `y = ${b1} - ${x} = ${y}` }
            ],
            explanation: `Метод додавання:\n1) Складаємо рівняння: 2x = ${b1 + b2}\n2) x = ${x}\n3) Підставляємо: y = ${b1} - ${x} = ${y}`,
            wrongAnswers: generateWrongAnswers(x, y)
        };
    },

    // Level 2: Medium substitution
    substitutionMedium: () => {
        const x = randomInt(-4, 4);
        const y = randomInt(-4, 4);

        const a1 = randomInt(2, 3);
        const b1 = randomInt(-2, 2);
        const c1 = a1 * x + b1 * y;

        const a2 = 1;
        const b2 = randomInt(2, 4);
        const c2 = a2 * x + b2 * y;

        const eq1 = formatEquation(a1, b1, c1);
        const eq2 = formatEquation(a2, b2, c2);

        return {
            question: 'Розв\'яжіть систему рівнянь',
            system: [eq1, eq2],
            correct: `x = ${x}, y = ${y}`,
            formula: 'substitutionMedium',
            method: 'substitution',
            steps: generateSubstitutionSteps(a1, b1, c1, a2, b2, c2, x, y),
            explanation: `Метод підстановки:\n1) З 2-го рівняння: x = ${c2} - ${b2}y\n2) Підставляємо в 1-ше\n3) Розв'язуємо: y = ${y}\n4) x = ${x}`,
            wrongAnswers: generateWrongAnswers(x, y)
        };
    },

    // Level 2: Medium addition (need to multiply)
    additionMedium: () => {
        const x = randomInt(-4, 4);
        const y = randomInt(-4, 4);

        const a1 = randomInt(2, 4);
        const b1 = randomInt(1, 3);
        const c1 = a1 * x + b1 * y;

        const a2 = randomInt(1, 3);
        const b2 = b1; // Same coefficient for y
        const c2 = a2 * x + b2 * y;

        const eq1 = formatEquation(a1, b1, c1);
        const eq2 = formatEquation(a2, b2, c2);

        return {
            question: 'Розв\'яжіть систему рівнянь',
            system: [eq1, eq2],
            correct: `x = ${x}, y = ${y}`,
            formula: 'additionMedium',
            method: 'addition',
            steps: [
                { title: 'Віднімаємо рівняння', content: `(${a1}x + ${b1}y) - (${a2}x + ${b2}y) = ${c1} - ${c2}` },
                { title: 'Спрощуємо', content: `${a1 - a2}x = ${c1 - c2}` },
                { title: 'Знаходимо x', content: `x = ${c1 - c2} / ${a1 - a2} = ${x}` },
                { title: 'Знаходимо y', content: `${b1}y = ${c1} - ${a1}·${x} = ${c1 - a1 * x}, y = ${y}` }
            ],
            explanation: `Метод додавання:\n1) Віднімаємо: ${a1 - a2}x = ${c1 - c2}\n2) x = ${x}\n3) Підставляємо: y = ${y}`,
            wrongAnswers: generateWrongAnswers(x, y)
        };
    },

    // Level 3: Complex systems
    complex: () => {
        const x = randomInt(-3, 3);
        const y = randomInt(-3, 3);

        const a1 = randomInt(2, 4);
        const b1 = randomInt(2, 4);
        const c1 = a1 * x + b1 * y;

        const a2 = randomInt(3, 5);
        const b2 = randomInt(2, 4);
        const c2 = a2 * x + b2 * y;

        const eq1 = formatEquation(a1, b1, c1);
        const eq2 = formatEquation(a2, b2, c2);

        // Use addition method with multiplication
        const mult1 = b2;
        const mult2 = b1;

        return {
            question: 'Розв\'яжіть систему рівнянь',
            system: [eq1, eq2],
            correct: `x = ${x}, y = ${y}`,
            formula: 'complex',
            method: 'addition',
            steps: [
                { title: 'Множимо рівняння', content: `1-ше на ${mult1}, 2-ге на ${mult2}` },
                { title: 'Отримуємо', content: `${a1 * mult1}x + ${b1 * mult1}y = ${c1 * mult1}\n${a2 * mult2}x + ${b2 * mult2}y = ${c2 * mult2}` },
                { title: 'Віднімаємо', content: `${a1 * mult1 - a2 * mult2}x = ${c1 * mult1 - c2 * mult2}` },
                { title: 'Розв\'язок', content: `x = ${x}, y = ${y}` }
            ],
            explanation: `Метод додавання з множенням:\n1) Множимо 1-ше на ${mult1}, 2-ге на ${mult2}\n2) Віднімаємо рівняння\n3) x = ${x}, y = ${y}`,
            wrongAnswers: generateWrongAnswers(x, y)
        };
    }
};

// === Helper Functions ===
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatEquation(a, b, c) {
    let eq = '';

    // x term
    if (a === 1) eq = 'x';
    else if (a === -1) eq = '-x';
    else if (a !== 0) eq = `${a}x`;

    // y term
    if (b !== 0) {
        if (eq) {
            if (b === 1) eq += ' + y';
            else if (b === -1) eq += ' - y';
            else if (b > 0) eq += ` + ${b}y`;
            else eq += ` - ${Math.abs(b)}y`;
        } else {
            if (b === 1) eq = 'y';
            else if (b === -1) eq = '-y';
            else eq = `${b}y`;
        }
    }

    return `${eq} = ${c}`;
}

function generateSubstitutionSteps(a1, b1, c1, a2, b2, c2, x, y) {
    // Find which equation has coefficient 1
    let steps = [];

    if (a2 === 1) {
        steps = [
            { title: 'Виражаємо x з 2-го рівняння', content: `x = ${c2} ${b2 >= 0 ? '-' : '+'} ${Math.abs(b2)}y` },
            { title: 'Підставляємо в 1-ше', content: `${a1}(${c2} ${b2 >= 0 ? '-' : '+'} ${Math.abs(b2)}y) ${b1 >= 0 ? '+' : '-'} ${Math.abs(b1)}y = ${c1}` },
            { title: 'Розв\'язуємо відносно y', content: `y = ${y}` },
            { title: 'Знаходимо x', content: `x = ${c2} ${b2 >= 0 ? '-' : '+'} ${Math.abs(b2)}·(${y}) = ${x}` }
        ];
    } else if (a1 === 1) {
        steps = [
            { title: 'Виражаємо x з 1-го рівняння', content: `x = ${c1} ${b1 >= 0 ? '-' : '+'} ${Math.abs(b1)}y` },
            { title: 'Підставляємо в 2-ге', content: `${a2}(${c1} ${b1 >= 0 ? '-' : '+'} ${Math.abs(b1)}y) ${b2 >= 0 ? '+' : '-'} ${Math.abs(b2)}y = ${c2}` },
            { title: 'Розв\'язуємо відносно y', content: `y = ${y}` },
            { title: 'Знаходимо x', content: `x = ${x}` }
        ];
    } else {
        steps = [
            { title: 'Виражаємо x', content: 'Виберіть рівняння з найменшим коефіцієнтом' },
            { title: 'Підставляємо', content: 'Підставте у друге рівняння' },
            { title: 'Знаходимо y', content: `y = ${y}` },
            { title: 'Знаходимо x', content: `x = ${x}` }
        ];
    }

    return steps;
}

function generateWrongAnswers(x, y) {
    const wrong = [];
    wrong.push(`x = ${x + 1}, y = ${y}`);
    wrong.push(`x = ${x}, y = ${y + 1}`);
    wrong.push(`x = ${y}, y = ${x}`); // Swapped
    wrong.push(`x = ${-x}, y = ${-y}`); // Negated
    wrong.push(`x = ${x - 1}, y = ${y - 1}`);

    return [...new Set(wrong.filter(w => w !== `x = ${x}, y = ${y}`))].slice(0, 4);
}

// === Adaptive AI Engine ===
class AdaptiveAI {
    constructor() {
        this.loadState();
    }

    loadState() {
        const saved = localStorage.getItem('systemsTrainerState');
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

        Object.keys(SYSTEM_TYPES).forEach(key => {
            this.typeStats[key] = {
                attempts: 0,
                correct: 0,
                lastSeen: null,
                confidence: 0.5
            };
        });
    }

    saveState() {
        localStorage.setItem('systemsTrainerState', JSON.stringify({
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
            types.push('substitutionSimple', 'additionSimple');
        }

        if (this.level >= 2) {
            types.push('substitutionMedium', 'additionMedium');
        }

        if (this.level >= 3) {
            types.push('complex');
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

    processAnswer(systemType, isCorrect, responseTime) {
        const stats = this.typeStats[systemType];
        stats.attempts++;
        stats.lastSeen = Date.now();

        if (isCorrect) {
            stats.correct++;
            this.streak++;
            this.totalCorrect++;
            const speedBonus = responseTime < 10000 ? 0.1 : 0.05;
            stats.confidence = Math.min(1, stats.confidence + 0.15 + speedBonus);
        } else {
            this.streak = 0;
            stats.confidence = Math.max(0, stats.confidence - 0.2);
        }

        this.totalQuestions++;
        this.sessionHistory.push({ systemType, isCorrect, responseTime });
        this.adjustLevel();
        this.saveState();
    }

    adjustLevel() {
        if (this.streak >= 4) {
            this.level = Math.min(3, this.level + 1);
            return;
        }

        const recent = this.sessionHistory.slice(-8);
        if (recent.length >= 4) {
            const recentAccuracy = recent.filter(q => q.isCorrect).length / recent.length;

            if (recentAccuracy >= 0.75 && this.level < 3) {
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
            .map(([key, _]) => SYSTEM_TYPES[key].name);

        let message = '';

        if (accuracy >= 90) {
            message = `Блискуче! ${accuracy}% - ти майстер систем рівнянь! `;
        } else if (accuracy >= 70) {
            message = `Гарний результат! ${accuracy}% правильних. `;
        } else if (accuracy >= 50) {
            message = `Непогано! ${accuracy}% - продовжуй практикуватися. `;
        } else {
            message = `Потрібно ще потренуватися. Переглянь методи розв'язання. `;
        }

        if (this.streak >= 4) {
            message += `Серія з ${this.streak} правильних! `;
        }

        if (this.level === 3) {
            message += 'Максимальний рівень досягнуто!';
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
        this.questionsPerSession = 8;

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
        this.systemDisplay = document.getElementById('systemDisplay');
        this.stepsContainer = document.getElementById('stepsContainer');
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

    async showHint() {
        if (!this.currentQuestion) return;

        const modal = document.getElementById('aiHelperModal');
        const loading = document.getElementById('aiLoading');
        const response = document.getElementById('aiResponse');

        modal.classList.remove('hidden');
        loading.style.display = 'flex';
        response.style.display = 'none';

        // Try to get AI hint
        try {
            const apiResponse = await fetch(`${API_BASE}/api/hint`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: 'systems',
                    question: this.currentQuestion.question + ': ' + this.currentQuestion.system?.join(', '),
                    level: this.ai.level,
                    context: {
                        method: this.currentQuestion.method,
                        systemType: this.currentQuestion.formula,
                        typeName: SYSTEM_TYPES[this.currentQuestion.formula]?.name
                    }
                })
            });

            const data = await apiResponse.json();

            loading.style.display = 'none';
            response.style.display = 'block';

            if (data.hint) {
                response.innerHTML = `<p><strong>💡 Підказка від ШІ:</strong></p><p>${data.hint}</p>`;
            } else {
                throw new Error('No hint');
            }
        } catch (e) {
            // Fallback to local hints
            loading.style.display = 'none';
            response.style.display = 'block';

            const method = this.currentQuestion.method;
            let hint = '';

            if (method === 'substitution') {
                hint = `<strong>Метод підстановки:</strong><br><br>
                    1. Знайди рівняння з коефіцієнтом 1 при x або y<br>
                    2. Вирази цю змінну через іншу<br>
                    3. Підстав у друге рівняння<br>
                    4. Знайди обидві змінні`;
            } else {
                hint = `<strong>Метод додавання:</strong><br><br>
                    1. Якщо коефіцієнти при одній змінній рівні або протилежні - склади/відніми<br>
                    2. Інакше - помнож рівняння, щоб зрівняти коефіцієнти<br>
                    3. Склади або відніми рівняння<br>
                    4. Розв'яжи та знайди другу змінну`;
            }

            response.innerHTML = `<p><strong>💡 Підказка:</strong></p><p>${hint}</p>`;
        }
    }

    showFormulaHelp() {
        const modal = document.getElementById('aiHelperModal');
        const loading = document.getElementById('aiLoading');
        const response = document.getElementById('aiResponse');

        modal.classList.remove('hidden');
        loading.style.display = 'none';
        response.style.display = 'block';

        response.innerHTML = `
            <h3 style="color: var(--accent); margin-bottom: 1rem;">🔗 Методи розв'язання</h3>
            <div style="margin-bottom: 1rem;">
                <p><strong>🔄 Підстановка:</strong></p>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">
                    Використовуй, коли коефіцієнт при змінній = 1
                </p>
            </div>
            <div style="margin-bottom: 1rem;">
                <p><strong>➕ Додавання:</strong></p>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">
                    Використовуй, коли коефіцієнти рівні або протилежні
                </p>
            </div>
            <div>
                <p><strong>✖ Множення + Додавання:</strong></p>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">
                    Помнож рівняння, щоб зрівняти коефіцієнти
                </p>
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

        // Display system
        this.systemDisplay.innerHTML = this.currentQuestion.system
            .map(eq => `<div class="equation">${eq}</div>`)
            .join('');

        // Hide steps initially - show only on incorrect answer
        this.stepsContainer.innerHTML = '';
        this.stepsContainer.style.display = 'none';

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

            // Show steps only on incorrect answer
            this.stepsContainer.style.display = 'block';
            this.stepsContainer.innerHTML = this.currentQuestion.steps
                .map((step, i) => `
                    <div class="step-card completed">
                        <div class="step-header">
                            <span class="step-number">Крок ${i + 1}</span>
                            <span class="step-title">${step.title}</span>
                        </div>
                        <div class="step-content">${step.content}</div>
                    </div>
                `).join('');
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
                    trainerId: 'systems',
                    trainerName: 'Системи рівнянь',
                    score: this.correctInSession,
                    totalQuestions: this.questionsPerSession,
                    difficulty: this.ai.level,
                    timeSpent: 0
                });
                if (result) {
                    console.log('Systems session saved to Firebase');
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
