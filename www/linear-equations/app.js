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

// === Equation Types ===
const EQUATION_TYPES = {
    simple: {
        name: 'Прості рівняння',
        difficulty: 1
    },
    withCoefficient: {
        name: 'З коефіцієнтом',
        difficulty: 1
    },
    twoSides: {
        name: 'Змінна з двох сторін',
        difficulty: 2
    },
    withBrackets: {
        name: 'Зі дужками',
        difficulty: 2
    },
    complex: {
        name: 'Складні рівняння',
        difficulty: 3
    },
    expressVariable: {
        name: 'Вираження змінної',
        difficulty: 3
    }
};

// === Question Generators ===
const questionGenerators = {
    // Level 1: Simple equations x + a = b
    simple: () => {
        const a = randomInt(-10, 10);
        const x = randomInt(-10, 10);
        const b = x + a;

        const sign = a >= 0 ? '+' : '-';
        const question = `x ${sign} ${Math.abs(a)} = ${b}`;

        return {
            question: `Розв'яжіть рівняння: ${question}`,
            correct: `x = ${x}`,
            formula: 'simple',
            explanation: `${question}\nx = ${b} ${a >= 0 ? '-' : '+'} ${Math.abs(a)}\nx = ${x}`,
            wrongAnswers: generateWrongX(x)
        };
    },

    // Level 1: Equations with coefficient ax = b
    withCoefficient: () => {
        const a = randomInt(2, 6);
        const x = randomInt(-8, 8);
        if (x === 0) x = randomInt(1, 5);
        const b = a * x;

        const question = `${a}x = ${b}`;

        return {
            question: `Розв'яжіть рівняння: ${question}`,
            correct: `x = ${x}`,
            formula: 'withCoefficient',
            explanation: `${question}\nx = ${b} ÷ ${a}\nx = ${x}`,
            wrongAnswers: generateWrongX(x)
        };
    },

    // Level 2: Variable on both sides ax + b = cx + d
    twoSides: () => {
        const a = randomInt(3, 7);
        const c = randomInt(1, a - 1);
        const x = randomInt(-5, 5);
        if (x === 0) x = randomInt(1, 4);

        const b = randomInt(-8, 8);
        const d = a * x + b - c * x;

        const leftSign = b >= 0 ? '+' : '-';
        const rightSign = d >= 0 ? '+' : '-';

        const question = `${a}x ${leftSign} ${Math.abs(b)} = ${c}x ${rightSign} ${Math.abs(d)}`;

        return {
            question: `Розв'яжіть рівняння: ${question}`,
            correct: `x = ${x}`,
            formula: 'twoSides',
            explanation: `${question}\n${a}x - ${c}x = ${d} ${b >= 0 ? '-' : '+'} ${Math.abs(b)}\n${a - c}x = ${d - b}\nx = ${x}`,
            wrongAnswers: generateWrongX(x)
        };
    },

    // Level 2: Equations with brackets a(x + b) = c
    withBrackets: () => {
        const a = randomInt(2, 5);
        const b = randomInt(-5, 5);
        const x = randomInt(-6, 6);
        if (x === 0) x = randomInt(1, 4);

        const c = a * (x + b);

        const sign = b >= 0 ? '+' : '-';
        const question = `${a}(x ${sign} ${Math.abs(b)}) = ${c}`;

        return {
            question: `Розв'яжіть рівняння: ${question}`,
            correct: `x = ${x}`,
            formula: 'withBrackets',
            explanation: `${question}\n${a}x ${sign} ${Math.abs(a * b)} = ${c}\n${a}x = ${c} ${b >= 0 ? '-' : '+'} ${Math.abs(a * b)}\n${a}x = ${a * x}\nx = ${x}`,
            wrongAnswers: generateWrongX(x)
        };
    },

    // Level 3: Complex equations with brackets on both sides
    complex: () => {
        const a = randomInt(2, 4);
        const b = randomInt(2, 4);
        const x = randomInt(-4, 4);
        if (x === 0) x = randomInt(1, 3);

        const c1 = randomInt(-3, 3);
        const c2 = randomInt(-3, 3);

        const left = a * (x + c1);
        const right = b * (x + c2);
        const d = right - left;

        const sign1 = c1 >= 0 ? '+' : '-';
        const sign2 = c2 >= 0 ? '+' : '-';
        const signD = d >= 0 ? '+' : '-';

        const question = `${a}(x ${sign1} ${Math.abs(c1)}) ${signD} ${Math.abs(d)} = ${b}(x ${sign2} ${Math.abs(c2)})`;

        return {
            question: `Розв'яжіть рівняння: ${question}`,
            correct: `x = ${x}`,
            formula: 'complex',
            explanation: `Розкриваємо дужки:\n${a}x ${sign1} ${Math.abs(a * c1)} ${signD} ${Math.abs(d)} = ${b}x ${sign2} ${Math.abs(b * c2)}\nПереносимо x вліво, числа вправо:\n${a}x - ${b}x = ${b * c2} ${a * c1 >= 0 ? '-' : '+'} ${Math.abs(a * c1)} ${d >= 0 ? '-' : '+'} ${Math.abs(d)}\n${a - b}x = ${(a - b) * x}\nx = ${x}`,
            wrongAnswers: generateWrongX(x)
        };
    },

    // Level 3: Express variable from formula
    expressVariable: () => {
        const formulas = [
            {
                formula: 'S = vt',
                find: 'v',
                correct: 'v = S/t',
                explanation: 'S = vt\nДілимо обидві частини на t:\nv = S/t',
                wrong: ['v = St', 'v = S - t', 'v = t/S']
            },
            {
                formula: 'S = vt',
                find: 't',
                correct: 't = S/v',
                explanation: 'S = vt\nДілимо обидві частини на v:\nt = S/v',
                wrong: ['t = Sv', 't = S - v', 't = v/S']
            },
            {
                formula: 'P = 2(a + b)',
                find: 'a',
                correct: 'a = P/2 - b',
                explanation: 'P = 2(a + b)\nP/2 = a + b\na = P/2 - b',
                wrong: ['a = P - 2b', 'a = P/2 + b', 'a = (P - b)/2']
            },
            {
                formula: 'S = ab',
                find: 'b',
                correct: 'b = S/a',
                explanation: 'S = ab\nДілимо обидві частини на a:\nb = S/a',
                wrong: ['b = Sa', 'b = S - a', 'b = a/S']
            },
            {
                formula: 'V = Sh',
                find: 'h',
                correct: 'h = V/S',
                explanation: 'V = Sh\nДілимо обидві частини на S:\nh = V/S',
                wrong: ['h = VS', 'h = V - S', 'h = S/V']
            },
            {
                formula: 'F = ma',
                find: 'm',
                correct: 'm = F/a',
                explanation: 'F = ma\nДілимо обидві частини на a:\nm = F/a',
                wrong: ['m = Fa', 'm = F - a', 'm = a/F']
            },
            {
                formula: 'C = 2πr',
                find: 'r',
                correct: 'r = C/(2π)',
                explanation: 'C = 2πr\nДілимо обидві частини на 2π:\nr = C/(2π)',
                wrong: ['r = C·2π', 'r = C - 2π', 'r = 2π/C']
            }
        ];

        const f = formulas[Math.floor(Math.random() * formulas.length)];

        return {
            question: `З формули ${f.formula} виразіть ${f.find}`,
            correct: f.correct,
            formula: 'expressVariable',
            explanation: f.explanation,
            wrongAnswers: f.wrong
        };
    }
};

// === Helper Functions ===
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateWrongX(x) {
    const wrong = [];
    wrong.push(`x = ${x + 1}`);
    wrong.push(`x = ${x - 1}`);
    wrong.push(`x = ${-x}`);
    wrong.push(`x = ${x + 2}`);
    wrong.push(`x = ${x * 2}`);

    return [...new Set(wrong.filter(w => w !== `x = ${x}`))].slice(0, 4);
}

// === Adaptive AI Engine ===
class AdaptiveAI {
    constructor() {
        this.loadState();
    }

    loadState() {
        const saved = localStorage.getItem('linearEquationsState');
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

        Object.keys(EQUATION_TYPES).forEach(key => {
            this.typeStats[key] = {
                attempts: 0,
                correct: 0,
                lastSeen: null,
                confidence: 0.5
            };
        });
    }

    saveState() {
        localStorage.setItem('linearEquationsState', JSON.stringify({
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
            types.push('simple', 'withCoefficient');
        }

        if (this.level >= 2) {
            types.push('twoSides', 'withBrackets');
        }

        if (this.level >= 3) {
            types.push('complex', 'expressVariable');
        }

        return types;
    }

    selectNextQuestion() {
        const available = this.getAvailableTypes();

        // Find weak areas
        const weakAreas = available.filter(type => {
            const stats = this.typeStats[type];
            return stats.confidence < 0.6 && stats.attempts > 0;
        });

        // 40% chance to focus on weak areas
        if (weakAreas.length > 0 && Math.random() < 0.4) {
            const type = weakAreas[Math.floor(Math.random() * weakAreas.length)];
            return questionGenerators[type]();
        }

        const type = available[Math.floor(Math.random() * available.length)];
        return questionGenerators[type]();
    }

    processAnswer(equationType, isCorrect, responseTime) {
        const stats = this.typeStats[equationType];
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
        this.sessionHistory.push({ equationType, isCorrect, responseTime });
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
            .map(([key, _]) => EQUATION_TYPES[key].name);

        let message = '';

        if (accuracy >= 90) {
            message = `Відмінний результат! ${accuracy}% - ти майстер рівнянь! `;
        } else if (accuracy >= 70) {
            message = `Гарна робота! ${accuracy}% правильних. `;
        } else if (accuracy >= 50) {
            message = `Непогано! ${accuracy}% - продовжуй тренуватися. `;
        } else {
            message = `Потрібно більше практики. Переглянь правила. `;
        }

        if (this.streak >= 5) {
            message += `Серія з ${this.streak} правильних підряд! `;
        }

        if (this.level === 3) {
            message += 'Ти на максимальному рівні!';
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
        document.getElementById('aiHelpBtn')?.addEventListener('click', () => this.showAIHelp());
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
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');

        modal.classList.remove('hidden');
        loading.style.display = 'none';
        response.style.display = 'block';

        // Update modal header
        if (modalIcon) modalIcon.textContent = '💡';
        if (modalTitle) modalTitle.textContent = 'Підказка';

        // Local hints based on equation type
        let hint = '';
        switch (this.currentQuestion.formula) {
            case 'simple':
                hint = 'Перенеси число на праву сторону зі зміною знака.';
                break;
            case 'withCoefficient':
                hint = 'Поділи обидві частини рівняння на коефіцієнт при x.';
                break;
            case 'twoSides':
                hint = 'Перенеси всі члени з x вліво, числа — вправо. Не забудь змінити знаки!';
                break;
            case 'withBrackets':
                hint = 'Спочатку розкрий дужки (помнож кожен член на число перед дужками).';
                break;
            case 'complex':
                hint = 'Розкрий дужки з обох сторін, потім перенеси x вліво, числа вправо.';
                break;
            case 'expressVariable':
                hint = 'Ізолюй потрібну змінну: перенеси інші члени, поділи на коефіцієнт.';
                break;
            default:
                hint = 'Перенеси члени зі зміною знака, потім поділи на коефіцієнт.';
        }
        response.innerHTML = `<p style="color: var(--primary); font-size: 1.1rem;">${hint}</p>`;
    }

    async showAIHelp() {
        if (!this.currentQuestion) return;

        const modal = document.getElementById('aiHelperModal');
        const loading = document.getElementById('aiLoading');
        const response = document.getElementById('aiResponse');
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');

        modal.classList.remove('hidden');
        loading.style.display = 'flex';
        response.style.display = 'none';

        // Update modal header
        if (modalIcon) modalIcon.textContent = '🤖';
        if (modalTitle) modalTitle.textContent = 'Допомога ШІ';

        // Try to get AI hint
        try {
            const apiResponse = await fetch(`${API_BASE}/api/hint`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: 'linear_equations',
                    question: this.currentQuestion.question,
                    level: this.ai.level,
                    context: {
                        equationType: this.currentQuestion.formula,
                        typeName: EQUATION_TYPES[this.currentQuestion.formula]?.name
                    }
                })
            });

            const data = await apiResponse.json();

            loading.style.display = 'none';
            response.style.display = 'block';

            if (data.hint) {
                response.innerHTML = `<p>${data.hint}</p>`;
                renderMath(response);
            } else {
                throw new Error('No hint');
            }
        } catch (e) {
            // Fallback - show detailed explanation
            loading.style.display = 'none';
            response.style.display = 'block';

            const typeName = EQUATION_TYPES[this.currentQuestion.formula]?.name || 'Рівняння';
            response.innerHTML = `
                <p><strong>Тип:</strong> ${typeName}</p>
                <p style="margin-top: 0.5rem;"><strong>Хід розв'язку:</strong></p>
                <p style="white-space: pre-line; margin-top: 0.5rem;">${this.currentQuestion.explanation}</p>
            `;
        }
    }

    showFormulaHelp() {
        const modal = document.getElementById('aiHelperModal');
        const loading = document.getElementById('aiLoading');
        const response = document.getElementById('aiResponse');
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');

        modal.classList.remove('hidden');
        loading.style.display = 'none';
        response.style.display = 'block';

        // Update modal header
        if (modalIcon) modalIcon.textContent = '📐';
        if (modalTitle) modalTitle.textContent = 'Формули';

        response.innerHTML = `
            <h3 style="color: var(--accent); margin-bottom: 1rem;">⚖️ Лінійні рівняння</h3>
            <div style="margin-bottom: 1rem;">
                <p><strong>ax + b = c → x = (c - b) / a</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Загальний вигляд лінійного рівняння</p>
            </div>
            <div style="margin-bottom: 1rem;">
                <p><strong>x + a = b → x = b - a</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Перенос з протилежним знаком</p>
            </div>
            <div style="margin-bottom: 1rem;">
                <p><strong>ax = b → x = b / a</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Ділення на коефіцієнт</p>
            </div>
            <div style="margin-bottom: 1rem;">
                <p><strong>a(x + b) = c → ax + ab = c</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Розкриття дужок</p>
            </div>
            <div style="margin-bottom: 1rem;">
                <p><strong>ax + b = cx + d → (a-c)x = d - b</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Зведення подібних членів</p>
            </div>
            <div>
                <p><strong>S = vt → v = S/t, t = S/v</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Вираження змінної з формули</p>
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
                    trainerId: 'linear-equations',
                    trainerName: 'Лінійні рівняння',
                    score: this.correctInSession,
                    totalQuestions: this.questionsPerSession,
                    difficulty: this.ai.level,
                    timeSpent: 0
                });
                if (result) {
                    console.log('Linear equations session saved to Firebase');
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
