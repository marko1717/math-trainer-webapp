/* ===================================
   MATH QUEST - FUNCTION PROPERTIES
   Trainer for function properties
   =================================== */

// Function data with all properties
const FUNCTIONS = [
    {
        formula: 'y = x²',
        latex: 'y = x^2',
        domain: 'ℝ (всі дійсні)',
        range: '[0; +∞)',
        parity: 'парна',
        zeros: 'x = 0',
        yIntercept: '0',
        increasing: '(0; +∞)',
        decreasing: '(-∞; 0)',
        draw: (ctx, w, h) => drawParabola(ctx, w, h)
    },
    {
        formula: 'y = x³',
        latex: 'y = x^3',
        domain: 'ℝ (всі дійсні)',
        range: 'ℝ (всі дійсні)',
        parity: 'непарна',
        zeros: 'x = 0',
        yIntercept: '0',
        increasing: 'ℝ (всюди)',
        decreasing: 'ніде',
        draw: (ctx, w, h) => drawCubic(ctx, w, h)
    },
    {
        formula: 'y = √x',
        latex: 'y = \\sqrt{x}',
        domain: '[0; +∞)',
        range: '[0; +∞)',
        parity: 'ні парна, ні непарна',
        zeros: 'x = 0',
        yIntercept: '0',
        increasing: '[0; +∞)',
        decreasing: 'ніде',
        draw: (ctx, w, h) => drawSqrt(ctx, w, h)
    },
    {
        formula: 'y = |x|',
        latex: 'y = |x|',
        domain: 'ℝ (всі дійсні)',
        range: '[0; +∞)',
        parity: 'парна',
        zeros: 'x = 0',
        yIntercept: '0',
        increasing: '(0; +∞)',
        decreasing: '(-∞; 0)',
        draw: (ctx, w, h) => drawAbs(ctx, w, h)
    },
    {
        formula: 'y = 1/x',
        latex: 'y = \\frac{1}{x}',
        domain: 'ℝ \\ {0}',
        range: 'ℝ \\ {0}',
        parity: 'непарна',
        zeros: 'немає',
        yIntercept: 'не існує',
        increasing: 'ніде',
        decreasing: '(-∞; 0) ∪ (0; +∞)',
        draw: (ctx, w, h) => drawHyperbola(ctx, w, h)
    },
    {
        formula: 'y = x',
        latex: 'y = x',
        domain: 'ℝ (всі дійсні)',
        range: 'ℝ (всі дійсні)',
        parity: 'непарна',
        zeros: 'x = 0',
        yIntercept: '0',
        increasing: 'ℝ (всюди)',
        decreasing: 'ніде',
        draw: (ctx, w, h) => drawLinear(ctx, w, h)
    },
    {
        formula: 'y = sin(x)',
        latex: 'y = \\sin(x)',
        domain: 'ℝ (всі дійсні)',
        range: '[-1; 1]',
        parity: 'непарна',
        zeros: 'x = πn, n ∈ ℤ',
        yIntercept: '0',
        increasing: 'періодично',
        decreasing: 'періодично',
        draw: (ctx, w, h) => drawSin(ctx, w, h)
    },
    {
        formula: 'y = cos(x)',
        latex: 'y = \\cos(x)',
        domain: 'ℝ (всі дійсні)',
        range: '[-1; 1]',
        parity: 'парна',
        zeros: 'x = π/2 + πn, n ∈ ℤ',
        yIntercept: '1',
        increasing: 'періодично',
        decreasing: 'періодично',
        draw: (ctx, w, h) => drawCos(ctx, w, h)
    },
    {
        formula: 'y = 2ˣ',
        latex: 'y = 2^x',
        domain: 'ℝ (всі дійсні)',
        range: '(0; +∞)',
        parity: 'ні парна, ні непарна',
        zeros: 'немає',
        yIntercept: '1',
        increasing: 'ℝ (всюди)',
        decreasing: 'ніде',
        draw: (ctx, w, h) => drawExp(ctx, w, h)
    },
    {
        formula: 'y = log₂(x)',
        latex: 'y = \\log_2(x)',
        domain: '(0; +∞)',
        range: 'ℝ (всі дійсні)',
        parity: 'ні парна, ні непарна',
        zeros: 'x = 1',
        yIntercept: 'не існує',
        increasing: '(0; +∞)',
        decreasing: 'ніде',
        draw: (ctx, w, h) => drawLog(ctx, w, h)
    },
    {
        formula: 'y = -x²',
        latex: 'y = -x^2',
        domain: 'ℝ (всі дійсні)',
        range: '(-∞; 0]',
        parity: 'парна',
        zeros: 'x = 0',
        yIntercept: '0',
        increasing: '(-∞; 0)',
        decreasing: '(0; +∞)',
        draw: (ctx, w, h) => drawNegParabola(ctx, w, h)
    },
    {
        formula: 'y = x² - 4',
        latex: 'y = x^2 - 4',
        domain: 'ℝ (всі дійсні)',
        range: '[-4; +∞)',
        parity: 'парна',
        zeros: 'x = -2; x = 2',
        yIntercept: '-4',
        increasing: '(0; +∞)',
        decreasing: '(-∞; 0)',
        draw: (ctx, w, h) => drawParabolaShifted(ctx, w, h)
    }
];

// Question templates by topic
const QUESTION_TEMPLATES = {
    domain: {
        question: 'Яка область визначення функції?',
        property: 'domain',
        generateWrong: (correct) => {
            const options = ['ℝ (всі дійсні)', '[0; +∞)', '(-∞; 0]', 'ℝ \\ {0}', '(0; +∞)', '[-1; 1]', '[0; 1]'];
            return options.filter(o => o !== correct);
        }
    },
    range: {
        question: 'Яка область значень функції?',
        property: 'range',
        generateWrong: (correct) => {
            const options = ['ℝ (всі дійсні)', '[0; +∞)', '(-∞; 0]', 'ℝ \\ {0}', '(0; +∞)', '[-1; 1]', '[-4; +∞)'];
            return options.filter(o => o !== correct);
        }
    },
    parity: {
        question: 'Яка парність функції?',
        property: 'parity',
        generateWrong: (correct) => {
            const options = ['парна', 'непарна', 'ні парна, ні непарна'];
            return options.filter(o => o !== correct);
        }
    },
    zeros: {
        question: 'Де функція перетинає вісь OX (нулі функції)?',
        property: 'zeros',
        generateWrong: (correct) => {
            const options = ['x = 0', 'x = 1', 'x = -1', 'немає', 'x = -2; x = 2', 'x = πn, n ∈ ℤ', 'x = π/2 + πn, n ∈ ℤ'];
            return options.filter(o => o !== correct);
        }
    },
    monotonicity: {
        question: 'На якому проміжку функція зростає?',
        property: 'increasing',
        generateWrong: (correct) => {
            const options = ['ℝ (всюди)', '(0; +∞)', '(-∞; 0)', '[0; +∞)', 'ніде', 'періодично', '(-∞; 0) ∪ (0; +∞)'];
            return options.filter(o => o !== correct);
        }
    }
};

// Drawing functions
function drawGrid(ctx, w, h) {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Grid lines
    const step = w / 8;
    for (let i = 0; i <= 8; i++) {
        ctx.beginPath();
        ctx.moveTo(i * step, 0);
        ctx.lineTo(i * step, h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * step);
        ctx.lineTo(w, i * step);
        ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
}

function drawParabola(ctx, w, h) {
    drawGrid(ctx, w, h);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
        const x = (px - w / 2) / (w / 8);
        const y = x * x;
        const py = h / 2 - y * (h / 8);
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
}

function drawNegParabola(ctx, w, h) {
    drawGrid(ctx, w, h);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
        const x = (px - w / 2) / (w / 8);
        const y = -x * x;
        const py = h / 2 - y * (h / 8);
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
}

function drawParabolaShifted(ctx, w, h) {
    drawGrid(ctx, w, h);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
        const x = (px - w / 2) / (w / 8);
        const y = x * x - 4;
        const py = h / 2 - y * (h / 16);
        if (py >= 0 && py <= h) {
            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
    }
    ctx.stroke();
}

function drawCubic(ctx, w, h) {
    drawGrid(ctx, w, h);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
        const x = (px - w / 2) / (w / 8);
        const y = x * x * x / 4;
        const py = h / 2 - y * (h / 8);
        if (py >= -10 && py <= h + 10) {
            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
    }
    ctx.stroke();
}

function drawSqrt(ctx, w, h) {
    drawGrid(ctx, w, h);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = w / 2; px < w; px++) {
        const x = (px - w / 2) / (w / 8);
        const y = Math.sqrt(x);
        const py = h / 2 - y * (h / 8);
        if (px === w / 2) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
}

function drawAbs(ctx, w, h) {
    drawGrid(ctx, w, h);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w / 2, h / 2);
    ctx.lineTo(w, 0);
    ctx.stroke();
}

function drawHyperbola(ctx, w, h) {
    drawGrid(ctx, w, h);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;

    // Right branch
    ctx.beginPath();
    for (let px = w / 2 + 10; px < w; px++) {
        const x = (px - w / 2) / (w / 8);
        const y = 1 / x;
        const py = h / 2 - y * (h / 8);
        if (py >= 0 && py <= h) {
            if (px === w / 2 + 10) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
    }
    ctx.stroke();

    // Left branch
    ctx.beginPath();
    for (let px = w / 2 - 10; px > 0; px--) {
        const x = (px - w / 2) / (w / 8);
        const y = 1 / x;
        const py = h / 2 - y * (h / 8);
        if (py >= 0 && py <= h) {
            if (px === w / 2 - 10) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
    }
    ctx.stroke();
}

function drawLinear(ctx, w, h) {
    drawGrid(ctx, w, h);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(w, 0);
    ctx.stroke();
}

function drawSin(ctx, w, h) {
    drawGrid(ctx, w, h);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
        const x = (px - w / 2) / (w / 8) * Math.PI / 2;
        const y = Math.sin(x);
        const py = h / 2 - y * (h / 4);
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
}

function drawCos(ctx, w, h) {
    drawGrid(ctx, w, h);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
        const x = (px - w / 2) / (w / 8) * Math.PI / 2;
        const y = Math.cos(x);
        const py = h / 2 - y * (h / 4);
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
}

function drawExp(ctx, w, h) {
    drawGrid(ctx, w, h);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
        const x = (px - w / 2) / (w / 8);
        const y = Math.pow(2, x);
        const py = h / 2 - y * (h / 16);
        if (py >= 0 && py <= h) {
            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
    }
    ctx.stroke();
}

function drawLog(ctx, w, h) {
    drawGrid(ctx, w, h);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = w / 2 + 2; px < w; px++) {
        const x = (px - w / 2) / (w / 8);
        if (x > 0) {
            const y = Math.log2(x);
            const py = h / 2 - y * (h / 8);
            if (py >= 0 && py <= h) {
                if (px === w / 2 + 2) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
        }
    }
    ctx.stroke();
}

// Game state
let state = {
    currentQuestion: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    totalQuestions: 10,
    questions: [],
    topic: 'mixed',
    answered: false,
    startTime: null
};

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    quiz: document.getElementById('quizScreen'),
    results: document.getElementById('resultsScreen')
};

// Shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Show screen
function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.add('active');
}

// Generate questions
function generateQuestions() {
    const questions = [];
    const topics = state.topic === 'mixed'
        ? Object.keys(QUESTION_TEMPLATES)
        : [state.topic];

    for (let i = 0; i < state.totalQuestions; i++) {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const template = QUESTION_TEMPLATES[topic];
        const func = FUNCTIONS[Math.floor(Math.random() * FUNCTIONS.length)];
        const correct = func[template.property];
        const wrongOptions = template.generateWrong(correct);

        // Get 3 random wrong options
        const shuffledWrong = shuffleArray(wrongOptions).slice(0, 3);
        const options = shuffleArray([correct, ...shuffledWrong]);

        questions.push({
            func,
            question: template.question,
            correct,
            options,
            topic
        });
    }

    return questions;
}

// Draw function graph
function drawFunction(func) {
    const canvas = document.getElementById('functionGraph');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);
    func.draw(ctx, w, h);
}

// Render KaTeX formula
function renderFormula(formula) {
    const container = document.getElementById('functionFormula');
    try {
        katex.render(formula, container, {
            throwOnError: false,
            displayMode: false
        });
    } catch (e) {
        container.textContent = formula;
    }
}

// Initialize game
function initGame() {
    state.currentQuestion = 0;
    state.score = 0;
    state.streak = 0;
    state.maxStreak = 0;
    state.answered = false;
    state.startTime = Date.now();

    state.questions = generateQuestions();

    document.getElementById('progressContainer').style.display = 'block';
    document.getElementById('totalCount').textContent = state.totalQuestions;

    showScreen('quiz');
    showQuestion();
}

// Show current question
function showQuestion() {
    const q = state.questions[state.currentQuestion];

    document.getElementById('questionNumber').textContent =
        `Питання ${state.currentQuestion + 1} / ${state.totalQuestions}`;

    renderFormula(q.func.latex);
    drawFunction(q.func);

    document.getElementById('questionText').textContent = q.question;

    // Generate answer options
    const optionsContainer = document.getElementById('answerOptions');
    optionsContainer.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-option';
        btn.innerHTML = `
            <span class="option-letter">${letters[index]}</span>
            <span class="option-text">${option}</span>
        `;
        btn.addEventListener('click', () => handleAnswer(option, btn));
        optionsContainer.appendChild(btn);
    });

    // Hide feedback and next button
    document.getElementById('feedbackContainer').classList.add('hidden');
    document.getElementById('nextBtn').classList.add('hidden');

    // Update progress
    const progress = (state.currentQuestion / state.totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('correctCount').textContent = state.score;
    document.getElementById('streakNumber').textContent = state.streak;

    state.answered = false;
}

// Handle answer selection
function handleAnswer(selected, btnElement) {
    if (state.answered) return;
    state.answered = true;

    const q = state.questions[state.currentQuestion];
    const isCorrect = selected === q.correct;

    // Disable all buttons and show correct/incorrect
    const allBtns = document.querySelectorAll('.answer-option');
    allBtns.forEach(btn => {
        btn.disabled = true;
        const text = btn.querySelector('.option-text').textContent;
        if (text === q.correct) {
            btn.classList.add('correct');
        } else if (btn === btnElement && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    // Update score and streak
    if (isCorrect) {
        state.score++;
        state.streak++;
        if (state.streak > state.maxStreak) {
            state.maxStreak = state.streak;
        }
    } else {
        state.streak = 0;
    }

    // Show feedback
    const feedback = document.getElementById('feedbackContainer');
    const feedbackText = document.getElementById('feedbackText');
    const explanation = document.getElementById('feedbackExplanation');

    feedback.classList.remove('hidden', 'correct', 'incorrect');
    feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
    feedbackText.textContent = isCorrect ? '✅ Правильно!' : '❌ Неправильно';

    if (!isCorrect) {
        explanation.textContent = `Правильна відповідь: ${q.correct}`;
    } else {
        explanation.textContent = '';
    }

    // Show next button
    document.getElementById('nextBtn').classList.remove('hidden');

    // Update displays
    document.getElementById('correctCount').textContent = state.score;
    document.getElementById('streakNumber').textContent = state.streak;
}

// Next question
function nextQuestion() {
    state.currentQuestion++;

    if (state.currentQuestion >= state.totalQuestions) {
        showResults();
    } else {
        showQuestion();
    }
}

// Show results
function showResults() {
    const accuracy = Math.round((state.score / state.totalQuestions) * 100);
    const timeSpent = Math.round((Date.now() - state.startTime) / 1000);

    document.getElementById('resultCorrect').textContent = state.score + '/' + state.totalQuestions;
    document.getElementById('resultAccuracy').textContent = accuracy + '%';
    document.getElementById('resultStreak').textContent = state.maxStreak;

    const icon = document.getElementById('resultsIcon');
    const title = document.getElementById('resultsTitle');

    if (accuracy >= 90) {
        icon.textContent = '🏆';
        title.textContent = 'Відмінно!';
    } else if (accuracy >= 70) {
        icon.textContent = '🎉';
        title.textContent = 'Чудова робота!';
    } else if (accuracy >= 50) {
        icon.textContent = '👍';
        title.textContent = 'Непогано!';
    } else {
        icon.textContent = '💪';
        title.textContent = 'Продовжуй вчитися!';
    }

    document.getElementById('progressContainer').style.display = 'none';

    // Save to Firebase
    if (window.MathQuestFirebase && window.MathQuestFirebase.getCurrentUser()) {
        window.MathQuestFirebase.saveTrainerSession({
            trainerId: 'function-properties',
            trainerName: 'Властивості функцій',
            score: state.score,
            totalQuestions: state.totalQuestions,
            timeSpent,
            difficulty: state.topic
        });
    }

    showScreen('results');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Topic selection
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.topic = btn.dataset.topic;
        });
    });

    // Start button
    document.getElementById('startBtn').addEventListener('click', initGame);

    // Next button
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);

    // Restart button
    document.getElementById('restartBtn').addEventListener('click', initGame);

    // Change topic button
    document.getElementById('changeTopicBtn').addEventListener('click', () => {
        showScreen('start');
    });

    // Set default topic
    document.querySelector('.topic-btn[data-topic="mixed"]').classList.add('active');
});

console.log('📈 Function Properties trainer loaded');
