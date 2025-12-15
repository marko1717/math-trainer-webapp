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

function setTextWithMath(element, text) {
    element.innerHTML = text;
    renderMath(element);
}

// === Operation Types ===
const OPERATIONS = {
    addition: {
        name: 'Додавання',
        difficulty: 1
    },
    subtraction: {
        name: 'Віднімання',
        difficulty: 1
    },
    monomialMult: {
        name: 'Множення на одночлен',
        difficulty: 2
    },
    polynomialMult: {
        name: 'Множення многочленів',
        difficulty: 2
    },
    combined: {
        name: 'Комбіновані',
        difficulty: 3
    }
};

// === Question Generators ===
const questionGenerators = {
    // Level 1: Addition of polynomials
    addition: (difficulty) => {
        const vars = ['x', 'y', 'a'];
        const v = vars[Math.floor(Math.random() * vars.length)];

        // Generate coefficients
        const a1 = randomInt(1, 5);
        const b1 = randomInt(-5, 5);
        const c1 = randomInt(-5, 5);

        const a2 = randomInt(1, 4);
        const b2 = randomInt(-4, 4);
        const c2 = randomInt(-4, 4);

        // Result
        const aR = a1 + a2;
        const bR = b1 + b2;
        const cR = c1 + c2;

        const poly1 = formatPoly(a1, b1, c1, v);
        const poly2 = formatPoly(a2, b2, c2, v);
        const result = formatPoly(aR, bR, cR, v);

        return {
            question: `Спростіть: (${poly1}) + (${poly2})`,
            correct: result,
            formula: 'addition',
            explanation: `Зводимо подібні члени:\n${v}²: ${a1} + ${a2} = ${aR}\n${v}: ${b1} + ${b2} = ${bR}\nВільний: ${c1} + ${c2} = ${cR}`,
            wrongAnswers: generateWrongAnswers(aR, bR, cR, v)
        };
    },

    // Level 1: Subtraction of polynomials
    subtraction: (difficulty) => {
        const vars = ['x', 'y', 'a'];
        const v = vars[Math.floor(Math.random() * vars.length)];

        const a1 = randomInt(2, 6);
        const b1 = randomInt(-4, 4);
        const c1 = randomInt(-5, 5);

        const a2 = randomInt(1, 4);
        const b2 = randomInt(-3, 3);
        const c2 = randomInt(-4, 4);

        const aR = a1 - a2;
        const bR = b1 - b2;
        const cR = c1 - c2;

        const poly1 = formatPoly(a1, b1, c1, v);
        const poly2 = formatPoly(a2, b2, c2, v);
        const result = formatPoly(aR, bR, cR, v);

        return {
            question: `Спростіть: (${poly1}) - (${poly2})`,
            correct: result,
            formula: 'subtraction',
            explanation: `Змінюємо знаки у від'ємника:\n(${poly1}) - (${poly2}) = ${poly1} ${formatTerms(-a2, -b2, -c2, v)}\nЗводимо подібні: ${result}`,
            wrongAnswers: generateWrongAnswers(aR, bR, cR, v)
        };
    },

    // Level 2: Multiplication by monomial
    monomialMult: (difficulty) => {
        const vars = ['x', 'y'];
        const v = vars[Math.floor(Math.random() * vars.length)];

        // Monomial coefficient
        const m = randomInt(2, 4);

        // Polynomial coefficients (no x² term for simplicity)
        const b = randomInt(1, 5);
        const c = randomInt(-4, 4);

        // Result: m*x * (bx + c) = m*b*x² + m*c*x
        const aR = m * b;
        const bR = m * c;

        const poly = `${b}${v} ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`;
        const result = formatPolyNoConst(aR, bR, v);

        return {
            question: `Спростіть: ${m}${v} · (${poly})`,
            correct: result,
            formula: 'monomialMult',
            explanation: `Множимо ${m}${v} на кожен член:\n${m}${v} · ${b}${v} = ${aR}${v}²\n${m}${v} · (${c}) = ${bR}${v}\nРезультат: ${result}`,
            wrongAnswers: generateWrongAnswersNoConst(aR, bR, v)
        };
    },

    // Level 2: Polynomial multiplication (binomials)
    polynomialMult: (difficulty) => {
        const v = 'x';

        // (x + a)(x + b) = x² + (a+b)x + ab
        const a = randomInt(-5, 5);
        const b = randomInt(-5, 5);

        if (a === 0) a = 1;
        if (b === 0) b = -1;

        const bR = a + b;
        const cR = a * b;

        const term1 = a >= 0 ? `${v} + ${a}` : `${v} - ${Math.abs(a)}`;
        const term2 = b >= 0 ? `${v} + ${b}` : `${v} - ${Math.abs(b)}`;

        const result = formatPoly(1, bR, cR, v);

        return {
            question: `Розкрийте дужки: (${term1})(${term2})`,
            correct: result,
            formula: 'polynomialMult',
            explanation: `Кожен член першого множимо на кожен член другого:\n${v} · ${v} = ${v}²\n${v} · (${b}) = ${b}${v}\n(${a}) · ${v} = ${a}${v}\n(${a}) · (${b}) = ${cR}\nЗводимо: ${v}² ${formatSign(bR)}${v} ${formatSign(cR)}`,
            wrongAnswers: generateWrongAnswers(1, bR, cR, v)
        };
    },

    // Level 3: Combined operations
    combined: (difficulty) => {
        const v = 'x';

        // 2(x + a) + 3(x + b) = 2x + 2a + 3x + 3b = 5x + (2a + 3b)
        const k1 = randomInt(2, 4);
        const k2 = randomInt(2, 4);
        const a = randomInt(-3, 3);
        const b = randomInt(-3, 3);

        const bR = k1 + k2;
        const cR = k1 * a + k2 * b;

        const term1 = a >= 0 ? `${v} + ${a}` : `${v} - ${Math.abs(a)}`;
        const term2 = b >= 0 ? `${v} + ${b}` : `${v} - ${Math.abs(b)}`;

        const result = `${bR}${v} ${cR >= 0 ? '+' : '-'} ${Math.abs(cR)}`;

        return {
            question: `Спростіть: ${k1}(${term1}) + ${k2}(${term2})`,
            correct: result,
            formula: 'combined',
            explanation: `Розкриваємо дужки:\n${k1}(${term1}) = ${k1}${v} ${k1*a >= 0 ? '+' : '-'} ${Math.abs(k1*a)}\n${k2}(${term2}) = ${k2}${v} ${k2*b >= 0 ? '+' : '-'} ${Math.abs(k2*b)}\nЗводимо: ${result}`,
            wrongAnswers: generateSimpleWrong(bR, cR, v)
        };
    }
};

// === Helper Functions ===
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatPoly(a, b, c, v) {
    let result = '';

    // x² term
    if (a !== 0) {
        result = a === 1 ? `${v}²` : a === -1 ? `-${v}²` : `${a}${v}²`;
    }

    // x term
    if (b !== 0) {
        if (result) {
            result += b > 0 ? ` + ${b === 1 ? '' : b}${v}` : ` - ${b === -1 ? '' : Math.abs(b)}${v}`;
        } else {
            result = b === 1 ? v : b === -1 ? `-${v}` : `${b}${v}`;
        }
    }

    // constant term
    if (c !== 0) {
        if (result) {
            result += c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;
        } else {
            result = `${c}`;
        }
    }

    return result || '0';
}

function formatPolyNoConst(a, b, v) {
    let result = '';

    if (a !== 0) {
        result = a === 1 ? `${v}²` : a === -1 ? `-${v}²` : `${a}${v}²`;
    }

    if (b !== 0) {
        if (result) {
            result += b > 0 ? ` + ${b === 1 ? '' : b}${v}` : ` - ${b === -1 ? '' : Math.abs(b)}${v}`;
        } else {
            result = b === 1 ? v : b === -1 ? `-${v}` : `${b}${v}`;
        }
    }

    return result || '0';
}

function formatTerms(a, b, c, v) {
    let result = '';
    if (a !== 0) result += `${a >= 0 ? '+' : '-'} ${Math.abs(a)}${v}² `;
    if (b !== 0) result += `${b >= 0 ? '+' : '-'} ${Math.abs(b)}${v} `;
    if (c !== 0) result += `${c >= 0 ? '+' : '-'} ${Math.abs(c)}`;
    return result;
}

function formatSign(n) {
    return n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
}

function generateWrongAnswers(a, b, c, v) {
    const wrong = [];

    // Common mistakes
    wrong.push(formatPoly(a, b + 1, c, v));
    wrong.push(formatPoly(a, b - 1, c, v));
    wrong.push(formatPoly(a, b, c + 2, v));
    wrong.push(formatPoly(a + 1, b, c, v));
    wrong.push(formatPoly(a, -b, c, v)); // Sign error

    // Filter out correct answer and duplicates
    const correct = formatPoly(a, b, c, v);
    return [...new Set(wrong.filter(w => w !== correct))].slice(0, 4);
}

function generateWrongAnswersNoConst(a, b, v) {
    const wrong = [];

    wrong.push(formatPolyNoConst(a + 1, b, v));
    wrong.push(formatPolyNoConst(a, b + 1, v));
    wrong.push(formatPolyNoConst(a - 1, b, v));
    wrong.push(formatPolyNoConst(a, -b, v));
    wrong.push(formatPolyNoConst(a * 2, b, v));

    const correct = formatPolyNoConst(a, b, v);
    return [...new Set(wrong.filter(w => w !== correct))].slice(0, 4);
}

function generateSimpleWrong(b, c, v) {
    const wrong = [];
    const format = (bb, cc) => `${bb}${v} ${cc >= 0 ? '+' : '-'} ${Math.abs(cc)}`;

    wrong.push(format(b + 1, c));
    wrong.push(format(b - 1, c));
    wrong.push(format(b, c + 1));
    wrong.push(format(b, c - 1));
    wrong.push(format(b, -c));

    const correct = format(b, c);
    return [...new Set(wrong.filter(w => w !== correct))].slice(0, 4);
}

// === Adaptive AI Engine ===
class AdaptiveAI {
    constructor() {
        this.loadState();
    }

    loadState() {
        const saved = localStorage.getItem('polynomialsTrainerState');
        if (saved) {
            const state = JSON.parse(saved);
            this.level = state.level || 1;
            this.streak = state.streak || 0;
            this.totalCorrect = state.totalCorrect || 0;
            this.totalQuestions = state.totalQuestions || 0;
            this.operationStats = state.operationStats || {};
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
        this.operationStats = {};
        this.sessionHistory = [];

        Object.keys(OPERATIONS).forEach(key => {
            this.operationStats[key] = {
                attempts: 0,
                correct: 0,
                lastSeen: null,
                confidence: 0.5
            };
        });
    }

    saveState() {
        localStorage.setItem('polynomialsTrainerState', JSON.stringify({
            level: this.level,
            streak: this.streak,
            totalCorrect: this.totalCorrect,
            totalQuestions: this.totalQuestions,
            operationStats: this.operationStats
        }));
    }

    getAvailableTypes() {
        const types = [];

        if (this.level >= 1) {
            types.push('addition', 'subtraction');
        }

        if (this.level >= 2) {
            types.push('monomialMult', 'polynomialMult');
        }

        if (this.level >= 3) {
            types.push('combined');
        }

        return types;
    }

    selectNextQuestion() {
        const available = this.getAvailableTypes();

        // Find weak areas
        const weakAreas = available.filter(type => {
            const stats = this.operationStats[type];
            return stats.confidence < 0.6 && stats.attempts > 0;
        });

        // 40% chance to focus on weak areas
        if (weakAreas.length > 0 && Math.random() < 0.4) {
            const type = weakAreas[Math.floor(Math.random() * weakAreas.length)];
            return questionGenerators[type](this.level);
        }

        const type = available[Math.floor(Math.random() * available.length)];
        return questionGenerators[type](this.level);
    }

    processAnswer(operationType, isCorrect, responseTime) {
        const stats = this.operationStats[operationType];
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
        this.sessionHistory.push({ operationType, isCorrect, responseTime });
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

        const weakAreas = Object.entries(this.operationStats)
            .filter(([_, stats]) => stats.attempts > 0 && stats.confidence < 0.5)
            .map(([key, _]) => OPERATIONS[key].name);

        let message = '';

        if (accuracy >= 90) {
            message = `Відмінний результат! Точність ${accuracy}% - ти майстер многочленів! `;
        } else if (accuracy >= 70) {
            message = `Гарна робота! ${accuracy}% правильних. `;
        } else if (accuracy >= 50) {
            message = `Непогано! ${accuracy}% - продовжуй тренуватися. `;
        } else {
            message = `Потрібно більше практики. Переглянь правила та спробуй ще раз. `;
        }

        if (this.streak >= 5) {
            message += `Чудова серія з ${this.streak} правильних підряд! `;
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

        const operation = OPERATIONS[this.currentQuestion.formula];
        let hint = '';

        switch (this.currentQuestion.formula) {
            case 'addition':
                hint = '💡 При додаванні зводь подібні члени: складай коефіцієнти біля однакових степенів змінної.';
                break;
            case 'subtraction':
                hint = '💡 При відніманні спочатку зміни знаки у від\'ємника (в других дужках), потім зведи подібні.';
                break;
            case 'monomialMult':
                hint = '💡 Множення на одночлен: помнож одночлен на кожен член многочлена окремо.';
                break;
            case 'polynomialMult':
                hint = '💡 Кожен член першого многочлена помнож на кожен член другого. Не забудь звести подібні!';
                break;
            case 'combined':
                hint = '💡 Спочатку розкрий дужки (помнож коефіцієнт на кожен член), потім зведи подібні.';
                break;
            default:
                hint = '💡 Уважно прочитай умову та застосуй відповідне правило.';
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
            <h3 style="color: var(--accent); margin-bottom: 1rem;">📐 Правила дій з многочленами</h3>
            <div style="margin-bottom: 1rem;">
                <p><strong>Додавання:</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Зводь подібні члени (з однаковими степенями)</p>
            </div>
            <div style="margin-bottom: 1rem;">
                <p><strong>Віднімання:</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Зміни знаки у від'ємника, потім зведи</p>
            </div>
            <div style="margin-bottom: 1rem;">
                <p><strong>Множення на одночлен:</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Кожен член многочлена множ на одночлен</p>
            </div>
            <div>
                <p><strong>Множення многочленів:</strong></p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Кожен з кожним, потім зведи подібні</p>
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
            this.feedbackExplanation.innerHTML = `Правильна відповідь: <strong>${this.currentQuestion.correct}</strong><br><br>${this.currentQuestion.explanation}`;
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
                    trainerId: 'polynomials',
                    trainerName: 'Многочлени',
                    score: this.correctInSession,
                    totalQuestions: this.questionsPerSession,
                    difficulty: this.ai.level,
                    timeSpent: 0
                });
                if (result) {
                    console.log('Polynomials session saved to Firebase');
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
