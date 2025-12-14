/* ===================================
   MATH QUEST - PARITY TRAINER
   Full unified version with Help Panel & Firebase
   =================================== */

const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
}

// State
let state = {
    level: 1,
    correct: 0,
    wrong: 0,
    streak: 0,
    maxStreak: 0,
    questionsAnswered: 0,
    totalQuestions: 10,
    currentQuestion: null,
    hintUsed: false,
    startTime: null
};

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    quiz: document.getElementById('quizScreen'),
    results: document.getElementById('resultsScreen'),
    theory: document.getElementById('theoryScreen')
};

// Common functions database
const FUNCTIONS = {
    even: [
        { formula: 'x^2', display: 'x²', name: 'парабола' },
        { formula: 'x^4', display: 'x⁴', name: 'степінь 4' },
        { formula: '|x|', display: '|x|', name: 'модуль' },
        { formula: 'x^2 + 1', display: 'x² + 1', name: 'парабола + 1' },
        { formula: 'cos(x)', display: 'cos x', name: 'косинус' },
        { formula: 'x^6', display: 'x⁶', name: 'степінь 6' },
        { formula: 'x^2 - 4', display: 'x² − 4', name: 'парабола − 4' },
        { formula: '1/(x^2)', display: '1/x²', name: 'обернена квадр.' },
        { formula: 'x^4 - x^2', display: 'x⁴ − x²', name: 'різниця степенів' },
        { formula: 'cos(2x)', display: 'cos 2x', name: 'косинус 2x' }
    ],
    odd: [
        { formula: 'x', display: 'x', name: 'пряма' },
        { formula: 'x^3', display: 'x³', name: 'кубічна' },
        { formula: 'x^5', display: 'x⁵', name: 'степінь 5' },
        { formula: 'sin(x)', display: 'sin x', name: 'синус' },
        { formula: '1/x', display: '1/x', name: 'гіпербола' },
        { formula: 'x^3 - x', display: 'x³ − x', name: 'кубічна − x' },
        { formula: 'tan(x)', display: 'tg x', name: 'тангенс' },
        { formula: 'x^7', display: 'x⁷', name: 'степінь 7' },
        { formula: 'sin(x) + x', display: 'sin x + x', name: 'синус + x' },
        { formula: 'x^3 + x', display: 'x³ + x', name: 'кубічна + x' }
    ],
    neither: [
        { formula: 'x^2 + x', display: 'x² + x', name: 'квадр. + лін.' },
        { formula: 'e^x', display: 'eˣ', name: 'експонента' },
        { formula: 'x^3 + 1', display: 'x³ + 1', name: 'кубічна + 1' },
        { formula: 'ln(x)', display: 'ln x', name: 'логарифм' },
        { formula: '2^x', display: '2ˣ', name: 'показникова' },
        { formula: 'x^2 + 2x + 1', display: 'x² + 2x + 1', name: '(x+1)²' },
        { formula: 'sqrt(x)', display: '√x', name: 'корінь' },
        { formula: 'x^3 - x^2', display: 'x³ − x²', name: 'різниця степ.' },
        { formula: 'x + 1', display: 'x + 1', name: 'пряма + 1' },
        { formula: 'cos(x) + 1', display: 'cos x + 1', name: 'косинус + 1' }
    ]
};

// Properties for level 3
const PROPERTIES = [
    { question: 'Сума двох парних функцій є:', answer: 'even', explanation: 'f(-x) + g(-x) = f(x) + g(x) → парна' },
    { question: 'Сума двох непарних функцій є:', answer: 'odd', explanation: 'f(-x) + g(-x) = -f(x) - g(x) = -(f(x) + g(x)) → непарна' },
    { question: 'Добуток двох парних функцій є:', answer: 'even', explanation: 'f(-x) · g(-x) = f(x) · g(x) → парна' },
    { question: 'Добуток двох непарних функцій є:', answer: 'even', explanation: '(-f(x)) · (-g(x)) = f(x) · g(x) → парна!' },
    { question: 'Добуток парної та непарної функції є:', answer: 'odd', explanation: 'f(-x) · g(-x) = f(x) · (-g(x)) = -f(x)g(x) → непарна' },
    { question: 'Якщо f(x) парна, то f(x²) є:', answer: 'even', explanation: 'f((-x)²) = f(x²) → парна' },
    { question: 'Якщо f(x) непарна, то [f(x)]² є:', answer: 'even', explanation: '[f(-x)]² = [-f(x)]² = [f(x)]² → парна' }
];

// Composites for level 3
const COMPOSITES = [
    { display: 'sin(x²)', answer: 'even', hint: 'sin((-x)²) = sin(x²) — аргумент парний' },
    { display: 'x · cos(x)', answer: 'odd', hint: '(-x)·cos(-x) = -x·cos(x)' },
    { display: 'x² · sin(x)', answer: 'odd', hint: '(-x)²·sin(-x) = x²·(-sin(x)) = -x²·sin(x)' },
    { display: 'cos(x³)', answer: 'even', hint: 'cos((-x)³) = cos(-x³) = cos(x³)' },
    { display: 'sin(x) · cos(x)', answer: 'odd', hint: 'sin(-x)·cos(-x) = -sin(x)·cos(x)' },
    { display: 'x + sin(x)', answer: 'odd', hint: '-x + sin(-x) = -(x + sin(x))' },
    { display: 'x² + cos(x)', answer: 'even', hint: '(-x)² + cos(-x) = x² + cos(x)' },
    { display: '|x| · x', answer: 'odd', hint: '|-x|·(-x) = |x|·(-x) = -|x|·x' }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // Level buttons
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.level = parseInt(btn.dataset.level);
            startGame();
        });
    });

    // Next button
    document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);

    // Help Panel buttons
    document.getElementById('hintBtn')?.addEventListener('click', showHint);
    document.getElementById('aiHelpBtn')?.addEventListener('click', showAIHelp);
    document.getElementById('formulaBtn')?.addEventListener('click', showFormulaHelp);

    // AI Modal close
    document.getElementById('aiCloseBtn')?.addEventListener('click', closeAIModal);
    document.getElementById('aiHelperModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'aiHelperModal') closeAIModal();
    });

    // Result buttons
    document.getElementById('nextLevelBtn')?.addEventListener('click', () => {
        if (state.level < 3) state.level++;
        startGame();
    });
    document.getElementById('restartBtn')?.addEventListener('click', startGame);
    document.getElementById('theoryBtn')?.addEventListener('click', () => showScreen('theory'));
    document.getElementById('backToQuizBtn')?.addEventListener('click', () => showScreen('results'));
}

function showScreen(name) {
    Object.values(screens).forEach(s => s?.classList.remove('active'));
    screens[name]?.classList.add('active');

    // Show/hide progress container
    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
        progressContainer.style.display = (name === 'quiz') ? 'block' : 'none';
    }
}

function updateDifficultyIndicator() {
    const dots = document.querySelectorAll('.difficulty-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i < state.level);
    });
}

function startGame() {
    state = {
        ...state,
        correct: 0,
        wrong: 0,
        streak: 0,
        maxStreak: 0,
        questionsAnswered: 0,
        hintUsed: false,
        startTime: Date.now()
    };

    document.getElementById('correctCount').textContent = '0';
    document.getElementById('streakNumber').textContent = '0';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('totalCount').textContent = state.totalQuestions;

    updateDifficultyIndicator();
    showScreen('quiz');
    nextQuestion();
}

function nextQuestion() {
    if (state.questionsAnswered >= state.totalQuestions) {
        showResults();
        return;
    }

    state.hintUsed = false;

    // Reset UI
    const feedback = document.getElementById('feedbackContainer');
    if (feedback) {
        feedback.style.display = 'none';
        document.getElementById('feedbackIcon').textContent = '';
        document.getElementById('feedbackText').textContent = '';
        document.getElementById('feedbackExplanation').textContent = '';
    }

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.style.display = 'none';

    // Hide graph by default
    const graphContainer = document.getElementById('graphContainer');
    if (graphContainer) graphContainer.style.display = 'none';

    const questionType = getQuestionType();
    state.currentQuestion = generateQuestion(questionType);

    displayQuestion();
}

function getQuestionType() {
    const types = {
        1: ['identify', 'identify', 'identify'],
        2: ['identify', 'graph', 'graph'],
        3: ['identify', 'graph', 'property', 'composite']
    };

    const available = types[state.level];
    return available[Math.floor(Math.random() * available.length)];
}

function generateQuestion(type) {
    switch (type) {
        case 'identify': return generateIdentifyQuestion();
        case 'graph': return generateGraphQuestion();
        case 'property': return generatePropertyQuestion();
        case 'composite': return generateCompositeQuestion();
        default: return generateIdentifyQuestion();
    }
}

function generateIdentifyQuestion() {
    const types = ['even', 'odd', 'neither'];
    const type = types[Math.floor(Math.random() * types.length)];
    const funcs = FUNCTIONS[type];
    const func = funcs[Math.floor(Math.random() * funcs.length)];

    return {
        type: 'identify',
        questionType: 'Визнач тип функції',
        questionHtml: `f(x) = ${func.display}`,
        formula: func.formula,
        answer: type,
        hint: getHintForFunction(func, type)
    };
}

function generateGraphQuestion() {
    const types = ['even', 'odd'];
    const type = types[Math.floor(Math.random() * types.length)];

    const graphFunctions = {
        even: [
            { display: 'x²', points: x => x * x },
            { display: '|x|', points: x => Math.abs(x) },
            { display: 'cos x', points: x => Math.cos(x) },
            { display: 'x⁴', points: x => Math.pow(x, 4) }
        ],
        odd: [
            { display: 'x', points: x => x },
            { display: 'x³', points: x => Math.pow(x, 3) },
            { display: 'sin x', points: x => Math.sin(x) },
            { display: '1/x', points: x => x === 0 ? null : 1/x }
        ]
    };

    const funcs = graphFunctions[type];
    const func = funcs[Math.floor(Math.random() * funcs.length)];

    return {
        type: 'graph',
        questionType: 'Визнач за графіком',
        questionHtml: 'Яка це функція — парна чи непарна?',
        graphFunc: func.points,
        answer: type,
        showGraph: true,
        hint: type === 'even'
            ? 'Парна: симетрична відносно осі OY'
            : 'Непарна: симетрична відносно початку координат'
    };
}

function generatePropertyQuestion() {
    const prop = PROPERTIES[Math.floor(Math.random() * PROPERTIES.length)];

    return {
        type: 'property',
        questionType: 'Властивості',
        questionHtml: prop.question,
        answer: prop.answer,
        hint: prop.explanation
    };
}

function generateCompositeQuestion() {
    const comp = COMPOSITES[Math.floor(Math.random() * COMPOSITES.length)];

    return {
        type: 'composite',
        questionType: 'Композиція функцій',
        questionHtml: `f(x) = ${comp.display}`,
        answer: comp.answer,
        hint: comp.hint
    };
}

function getHintForFunction(func, type) {
    const hints = {
        even: `Підстав -x: f(-x) = ${func.display.replace(/x/g, '(-x)')} = f(x) ✓`,
        odd: `Підстав -x: f(-x) = ${func.display.replace(/x/g, '(-x)')} = -f(x) ✓`,
        neither: `Підстав -x та порівняй з f(x) і -f(x) — не співпадає з жодним`
    };
    return hints[type];
}

function displayQuestion() {
    const q = state.currentQuestion;

    document.getElementById('topicBadge').textContent = q.questionType;
    document.getElementById('questionNumber').textContent = `Питання ${state.questionsAnswered + 1}`;
    document.getElementById('questionText').innerHTML = q.questionHtml;

    // Handle graph display
    const graphContainer = document.getElementById('graphContainer');
    if (q.showGraph) {
        graphContainer.style.display = 'flex';
        drawGraph(q.graphFunc);
    } else {
        graphContainer.style.display = 'none';
    }

    // Display answer buttons
    const answersDiv = document.getElementById('answersContainer');
    answersDiv.innerHTML = '';

    // For graph questions, only show even/odd
    const options = q.type === 'graph'
        ? [
            { value: 'even', label: '↔️ Парна' },
            { value: 'odd', label: '↩️ Непарна' }
          ]
        : [
            { value: 'even', label: '↔️ Парна' },
            { value: 'odd', label: '↩️ Непарна' },
            { value: 'neither', label: '❌ Жодна' }
          ];

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerHTML = opt.label;
        btn.dataset.value = opt.value;
        btn.onclick = () => checkAnswer(opt.value);
        answersDiv.appendChild(btn);
    });
}

function drawGraph(func) {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Get theme colors
    const computedStyle = getComputedStyle(document.documentElement);
    const bgColor = computedStyle.getPropertyValue('--bg-secondary').trim() || '#ffffff';
    const gridColor = computedStyle.getPropertyValue('--border').trim() || '#e5e7eb';
    const axisColor = computedStyle.getPropertyValue('--text-secondary').trim() || '#6b7280';
    const graphColor = computedStyle.getPropertyValue('--primary').trim() || '#7c3aed';

    // Clear
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 30;

    // Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    for (let x = centerX % scale; x < width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    for (let y = centerY % scale; y < height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Arrow heads
    ctx.fillStyle = axisColor;
    ctx.beginPath();
    ctx.moveTo(width - 10, centerY - 5);
    ctx.lineTo(width, centerY);
    ctx.lineTo(width - 10, centerY + 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX - 5, 10);
    ctx.lineTo(centerX, 0);
    ctx.lineTo(centerX + 5, 10);
    ctx.fill();

    // Labels
    ctx.fillStyle = axisColor;
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('x', width - 15, centerY - 10);
    ctx.fillText('y', centerX + 10, 15);
    ctx.fillText('O', centerX + 5, centerY + 15);

    // Draw function
    ctx.strokeStyle = graphColor;
    ctx.lineWidth = 3;
    ctx.beginPath();

    let firstPoint = true;
    for (let px = 0; px < width; px++) {
        const x = (px - centerX) / scale;
        const y = func(x);

        if (y === null || Math.abs(y) > 10) {
            firstPoint = true;
            continue;
        }

        const py = centerY - y * scale;

        if (py < -50 || py > height + 50) {
            firstPoint = true;
            continue;
        }

        if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.stroke();
}

function checkAnswer(answer) {
    const q = state.currentQuestion;
    const isCorrect = answer === q.answer;

    // Disable all buttons and highlight
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.value === q.answer) {
            btn.classList.add('correct');
        } else if (btn.dataset.value === answer && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    // Update stats
    if (isCorrect) {
        state.correct++;
        state.streak++;
        if (state.streak > state.maxStreak) state.maxStreak = state.streak;
    } else {
        state.wrong++;
        state.streak = 0;
    }

    document.getElementById('correctCount').textContent = state.correct;
    document.getElementById('streakNumber').textContent = state.streak;

    state.questionsAnswered++;
    const progress = (state.questionsAnswered / state.totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    // Show feedback
    showFeedback(isCorrect, q);

    // Show next button
    document.getElementById('nextBtn').style.display = 'block';
}

function showFeedback(isCorrect, question) {
    const container = document.getElementById('feedbackContainer');
    const icon = document.getElementById('feedbackIcon');
    const text = document.getElementById('feedbackText');
    const explanation = document.getElementById('feedbackExplanation');

    container.style.display = 'block';

    if (isCorrect) {
        const messages = ['Правильно!', 'Чудово!', 'Так тримати!', 'Вірно!'];
        icon.textContent = '✅';
        text.textContent = messages[Math.floor(Math.random() * messages.length)];
        text.style.color = 'var(--success)';
        explanation.textContent = '';
    } else {
        const typeNames = { even: 'парна', odd: 'непарна', neither: 'ні парна, ні непарна' };
        icon.textContent = '❌';
        text.textContent = `Правильна відповідь: ${typeNames[question.answer]}`;
        text.style.color = 'var(--error)';
        explanation.textContent = question.hint || '';
    }
}

// ========== HELP PANEL FUNCTIONS ==========

function showHint() {
    if (state.hintUsed) return;
    state.hintUsed = true;

    const modal = document.getElementById('aiHelperModal');
    const loading = document.getElementById('aiLoading');
    const response = document.getElementById('aiResponse');

    modal.classList.remove('hidden');
    loading.style.display = 'flex';
    response.style.display = 'none';

    setTimeout(() => {
        loading.style.display = 'none';
        response.style.display = 'block';
        response.innerHTML = `
            <div class="ai-hint-content">
                <h4>💡 Підказка</h4>
                <p>${state.currentQuestion.hint}</p>
            </div>
        `;
    }, 500);
}

function showAIHelp() {
    const modal = document.getElementById('aiHelperModal');
    const loading = document.getElementById('aiLoading');
    const response = document.getElementById('aiResponse');

    modal.classList.remove('hidden');
    loading.style.display = 'flex';
    response.style.display = 'none';

    setTimeout(() => {
        loading.style.display = 'none';
        response.style.display = 'block';

        const q = state.currentQuestion;
        let explanation = '';

        if (q.type === 'graph') {
            explanation = `<p><strong>Як визначити за графіком:</strong></p>
                <p>• <strong>Парна функція:</strong> графік симетричний відносно осі OY (вертикальна симетрія)</p>
                <p>• <strong>Непарна функція:</strong> графік симетричний відносно початку координат (точка O)</p>`;
        } else {
            explanation = `<p><strong>Як перевірити парність:</strong></p>
                <p>1. Підстав (-x) замість x у формулу</p>
                <p>2. Спрости вираз f(-x)</p>
                <p>3. Порівняй:</p>
                <ul style="margin-left: 1rem;">
                    <li>Якщо f(-x) = f(x) → <strong>парна</strong></li>
                    <li>Якщо f(-x) = -f(x) → <strong>непарна</strong></li>
                    <li>Інакше → <strong>ні парна, ні непарна</strong></li>
                </ul>`;
        }

        response.innerHTML = `
            <div class="ai-help-content">
                <h4>🤖 Допомога</h4>
                ${explanation}
            </div>
        `;
    }, 600);
}

function showFormulaHelp() {
    const modal = document.getElementById('aiHelperModal');
    const loading = document.getElementById('aiLoading');
    const response = document.getElementById('aiResponse');

    modal.classList.remove('hidden');
    loading.style.display = 'none';
    response.style.display = 'block';

    response.innerHTML = `
        <div class="ai-formula-content">
            <h4>📐 Формули парності</h4>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">f(-x) = f(x)</div>
                <div class="formula-note">Парна функція</div>
            </div>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">f(-x) = -f(x)</div>
                <div class="formula-note">Непарна функція</div>
            </div>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">Парні: x², x⁴, |x|, cos x</div>
            </div>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">Непарні: x, x³, sin x, tg x, 1/x</div>
            </div>
        </div>
    `;
}

function closeAIModal() {
    document.getElementById('aiHelperModal').classList.add('hidden');
}

// ========== RESULTS ==========

async function showResults() {
    const accuracy = state.correct + state.wrong > 0
        ? Math.round((state.correct / (state.correct + state.wrong)) * 100)
        : 0;

    const timeSpent = Math.round((Date.now() - state.startTime) / 1000);

    document.getElementById('resultCorrect').textContent = state.correct;
    document.getElementById('resultAccuracy').textContent = `${accuracy}%`;
    document.getElementById('resultLevel').textContent = state.level;

    const title = document.getElementById('resultsTitle');
    const icon = document.getElementById('resultsIcon');

    if (accuracy >= 90) {
        title.textContent = 'Бездоганно!';
        icon.textContent = '🏆';
    } else if (accuracy >= 70) {
        title.textContent = 'Чудова робота!';
        icon.textContent = '🎉';
    } else if (accuracy >= 50) {
        title.textContent = 'Непогано!';
        icon.textContent = '👍';
    } else {
        title.textContent = 'Потрібно повторити';
        icon.textContent = '📚';
    }

    // Hide next level button on level 3
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    if (nextLevelBtn) {
        nextLevelBtn.style.display = state.level < 3 ? 'block' : 'none';
    }

    // Save to Firebase
    await saveToFirebase(accuracy, timeSpent);

    showScreen('results');
}

async function saveToFirebase(accuracy, timeSpent) {
    if (window.MathQuestFirebase) {
        try {
            await window.MathQuestFirebase.saveTrainerSession({
                trainerId: 'parity',
                trainerName: 'Парність функцій',
                score: state.correct,
                totalQuestions: state.totalQuestions,
                difficulty: state.level,
                accuracy: accuracy,
                maxStreak: state.maxStreak,
                timeSpent: timeSpent
            });
            console.log('Session saved to Firebase');
        } catch (error) {
            console.error('Error saving to Firebase:', error);
        }
    }
}
