// Parity Functions Trainer
// Types: even, odd, neither

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
    questionsAnswered: 0,
    totalQuestions: 10,
    currentQuestion: null,
    hintUsed: false
};

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    result: document.getElementById('resultScreen'),
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
        { formula: 'cos(2x)', display: 'cos 2x', name: 'косинус 2x' },
        { formula: 'x^2 * cos(x)', display: 'x² · cos x', name: 'добуток' }
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
    {
        question: 'Сума двох парних функцій є:',
        answer: 'even',
        explanation: 'f(-x) + g(-x) = f(x) + g(x) → парна'
    },
    {
        question: 'Сума двох непарних функцій є:',
        answer: 'odd',
        explanation: 'f(-x) + g(-x) = -f(x) - g(x) = -(f(x) + g(x)) → непарна'
    },
    {
        question: 'Добуток двох парних функцій є:',
        answer: 'even',
        explanation: 'f(-x) · g(-x) = f(x) · g(x) → парна'
    },
    {
        question: 'Добуток двох непарних функцій є:',
        answer: 'even',
        explanation: '(-f(x)) · (-g(x)) = f(x) · g(x) → парна!'
    },
    {
        question: 'Добуток парної та непарної функції є:',
        answer: 'odd',
        explanation: 'f(-x) · g(-x) = f(x) · (-g(x)) = -f(x)g(x) → непарна'
    },
    {
        question: 'Якщо f(x) парна, то f(x²) є:',
        answer: 'even',
        explanation: 'f((-x)²) = f(x²) → парна'
    },
    {
        question: 'Якщо f(x) непарна, то [f(x)]² є:',
        answer: 'even',
        explanation: '[f(-x)]² = [-f(x)]² = [f(x)]² → парна'
    },
    {
        question: 'Сума парної та непарної (не тотожний 0) є:',
        answer: 'neither',
        explanation: 'f(-x) + g(-x) = f(x) - g(x) ≠ ±(f(x) + g(x))'
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheory();
    setupEventListeners();
});

function initTheory() {
    // Render definitions with KaTeX
    katex.render('f(-x) = f(x)', document.getElementById('evenDef'));
    katex.render('f(-x) = -f(x)', document.getElementById('oddDef'));

    // Fill theory lists
    const evenList = document.getElementById('evenList');
    const oddList = document.getElementById('oddList');
    const neitherList = document.getElementById('neitherList');

    FUNCTIONS.even.slice(0, 6).forEach(f => {
        const li = document.createElement('li');
        li.textContent = `f(x) = ${f.display}`;
        evenList.appendChild(li);
    });

    FUNCTIONS.odd.slice(0, 6).forEach(f => {
        const li = document.createElement('li');
        li.textContent = `f(x) = ${f.display}`;
        oddList.appendChild(li);
    });

    FUNCTIONS.neither.slice(0, 6).forEach(f => {
        const li = document.createElement('li');
        li.textContent = `f(x) = ${f.display}`;
        neitherList.appendChild(li);
    });

    // Properties
    const propList = document.getElementById('propertiesList');
    propList.innerHTML = `
        <p>• парна + парна = парна</p>
        <p>• непарна + непарна = непарна</p>
        <p>• парна × парна = парна</p>
        <p>• непарна × непарна = парна!</p>
        <p>• парна × непарна = непарна</p>
    `;
}

function setupEventListeners() {
    // Level buttons
    document.querySelectorAll('.btn-level').forEach(btn => {
        btn.addEventListener('click', () => {
            state.level = parseInt(btn.dataset.level);
            startGame();
        });
    });

    // Hint button
    document.getElementById('hintBtn').addEventListener('click', showHint);

    // Result buttons
    document.getElementById('restartBtn').addEventListener('click', () => {
        startGame();
    });

    document.getElementById('menuBtn').addEventListener('click', () => {
        showScreen('start');
    });

    // Theory back button
    document.getElementById('backFromTheory').addEventListener('click', () => {
        showScreen('start');
    });
}

function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function startGame() {
    state = {
        ...state,
        correct: 0,
        wrong: 0,
        streak: 0,
        questionsAnswered: 0,
        currentQuestion: null,
        hintUsed: false
    };

    document.getElementById('correct').textContent = '0';
    document.getElementById('wrong').textContent = '0';
    document.getElementById('streak').textContent = '0';
    document.getElementById('currentLevel').textContent = state.level;
    document.getElementById('progressFill').style.width = '0%';

    showScreen('game');
    nextQuestion();
}

function nextQuestion() {
    if (state.questionsAnswered >= state.totalQuestions) {
        showResults();
        return;
    }

    state.hintUsed = false;
    document.getElementById('hintBtn').disabled = false;
    document.getElementById('hintContainer').style.display = 'none';
    document.getElementById('feedback').classList.remove('show');

    const questionType = getQuestionType();
    state.currentQuestion = generateQuestion(questionType);

    displayQuestion();
}

function getQuestionType() {
    const types = {
        1: ['identify', 'typical'],
        2: ['identify', 'graph', 'typical'],
        3: ['identify', 'graph', 'property', 'composite']
    };

    const available = types[state.level];
    return available[Math.floor(Math.random() * available.length)];
}

function generateQuestion(type) {
    switch (type) {
        case 'identify':
            return generateIdentifyQuestion();
        case 'typical':
            return generateTypicalQuestion();
        case 'graph':
            return generateGraphQuestion();
        case 'property':
            return generatePropertyQuestion();
        case 'composite':
            return generateCompositeQuestion();
        default:
            return generateIdentifyQuestion();
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

function generateTypicalQuestion() {
    const questions = [
        { q: 'Яка з цих функцій є парною?', correct: 'even' },
        { q: 'Яка з цих функцій є непарною?', correct: 'odd' },
        { q: 'Яка з цих функцій не є ні парною, ні непарною?', correct: 'neither' }
    ];

    const question = questions[Math.floor(Math.random() * questions.length)];
    const options = [];

    // Add correct answer
    const correctFunc = FUNCTIONS[question.correct][Math.floor(Math.random() * FUNCTIONS[question.correct].length)];
    options.push({ ...correctFunc, type: question.correct });

    // Add other types
    const otherTypes = ['even', 'odd', 'neither'].filter(t => t !== question.correct);
    otherTypes.forEach(t => {
        const func = FUNCTIONS[t][Math.floor(Math.random() * FUNCTIONS[t].length)];
        options.push({ ...func, type: t });
    });

    // Shuffle
    shuffleArray(options);

    return {
        type: 'choice',
        questionType: 'Обери правильну',
        questionHtml: question.q,
        options: options,
        answer: question.correct,
        hint: `Згадай: парна f(-x)=f(x), непарна f(-x)=-f(x)`
    };
}

function generateGraphQuestion() {
    const types = ['even', 'odd'];
    const type = types[Math.floor(Math.random() * types.length)];

    // Select function for graph
    const graphFunctions = {
        even: [
            { formula: 'x^2', display: 'x²', points: x => x * x },
            { formula: '|x|', display: '|x|', points: x => Math.abs(x) },
            { formula: 'cos(x)', display: 'cos x', points: x => Math.cos(x) },
            { formula: 'x^4', display: 'x⁴', points: x => Math.pow(x, 4) }
        ],
        odd: [
            { formula: 'x', display: 'x', points: x => x },
            { formula: 'x^3', display: 'x³', points: x => Math.pow(x, 3) },
            { formula: 'sin(x)', display: 'sin x', points: x => Math.sin(x) },
            { formula: '1/x', display: '1/x', points: x => x === 0 ? null : 1/x }
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
            ? 'Парна: симетрична відносно осі OY (вертикальна симетрія)'
            : 'Непарна: симетрична відносно початку координат (центральна симетрія)'
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
    const composites = [
        {
            display: 'sin(x²)',
            answer: 'even',
            hint: 'sin((-x)²) = sin(x²) — аргумент парний, результат парний'
        },
        {
            display: 'x · cos(x)',
            answer: 'odd',
            hint: '(-x)·cos(-x) = -x·cos(x) — добуток непарної та парної'
        },
        {
            display: 'x² · sin(x)',
            answer: 'odd',
            hint: '(-x)²·sin(-x) = x²·(-sin(x)) = -x²·sin(x) — добуток парної та непарної'
        },
        {
            display: 'cos(x³)',
            answer: 'even',
            hint: 'cos((-x)³) = cos(-x³) = cos(x³) — косинус парний!'
        },
        {
            display: 'sin(x) · cos(x)',
            answer: 'odd',
            hint: 'sin(-x)·cos(-x) = -sin(x)·cos(x) — непарна × парна = непарна'
        },
        {
            display: 'x + sin(x)',
            answer: 'odd',
            hint: '-x + sin(-x) = -x - sin(x) = -(x + sin(x)) — сума непарних'
        },
        {
            display: 'x² + cos(x)',
            answer: 'even',
            hint: '(-x)² + cos(-x) = x² + cos(x) — сума парних'
        },
        {
            display: '|x| · x',
            answer: 'odd',
            hint: '|-x|·(-x) = |x|·(-x) = -|x|·x — парна × непарна = непарна'
        }
    ];

    const comp = composites[Math.floor(Math.random() * composites.length)];

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
        even: `Підстав -x: f(-x) = ${func.display.replace(/x/g, '(-x)')} = ${func.display} = f(x) ✓`,
        odd: `Підстав -x: f(-x) = ${func.display.replace(/x/g, '(-x)')} = -f(x) ✓`,
        neither: `Підстав -x та порівняй з f(x) і -f(x) — не співпадає з жодним`
    };
    return hints[type];
}

function displayQuestion() {
    const q = state.currentQuestion;

    document.getElementById('questionType').textContent = q.questionType;
    document.getElementById('question').innerHTML = q.questionHtml;

    // Handle graph display
    const graphContainer = document.getElementById('graphContainer');
    if (q.showGraph) {
        graphContainer.style.display = 'flex';
        drawGraph(q.graphFunc);
    } else {
        graphContainer.style.display = 'none';
    }

    // Display answers
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    answersDiv.classList.add('three-options');

    if (q.type === 'choice') {
        // Multiple choice with function options
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'btn-answer';
            btn.innerHTML = `f(x) = ${opt.display}`;
            btn.onclick = () => checkAnswer(opt.type);
            answersDiv.appendChild(btn);
        });
    } else {
        // Standard parity choice
        const options = [
            { value: 'even', label: '↔️ Парна', class: 'even' },
            { value: 'odd', label: '↩️ Непарна', class: 'odd' },
            { value: 'neither', label: '❌ Ні парна, ні непарна', class: 'neither' }
        ];

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = `btn-answer ${opt.class}`;
            btn.innerHTML = opt.label;
            btn.onclick = () => checkAnswer(opt.value);
            answersDiv.appendChild(btn);
        });
    }
}

function drawGraph(func) {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#1f2847';
    ctx.fillRect(0, 0, width, height);

    // Grid
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 30;

    ctx.strokeStyle = '#2d3a5e';
    ctx.lineWidth = 1;

    // Vertical grid lines
    for (let x = centerX % scale; x < width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = centerY % scale; y < height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#4a5a8a';
    ctx.lineWidth = 2;

    // X axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Arrow heads
    ctx.fillStyle = '#4a5a8a';
    // X arrow
    ctx.beginPath();
    ctx.moveTo(width - 10, centerY - 5);
    ctx.lineTo(width, centerY);
    ctx.lineTo(width - 10, centerY + 5);
    ctx.fill();
    // Y arrow
    ctx.beginPath();
    ctx.moveTo(centerX - 5, 10);
    ctx.lineTo(centerX, 0);
    ctx.lineTo(centerX + 5, 10);
    ctx.fill();

    // Labels
    ctx.fillStyle = '#8a9ab8';
    ctx.font = '14px sans-serif';
    ctx.fillText('x', width - 15, centerY - 10);
    ctx.fillText('y', centerX + 10, 15);
    ctx.fillText('O', centerX + 5, centerY + 15);

    // Draw function
    ctx.strokeStyle = '#6c5ce7';
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

    // Draw symmetry helpers (subtle)
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(108, 92, 231, 0.3)';
    ctx.lineWidth = 1;

    // Vertical line of symmetry hint for even
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    ctx.setLineDash([]);
}

function checkAnswer(answer) {
    const q = state.currentQuestion;
    const isCorrect = answer === q.answer;

    // Disable all buttons
    document.querySelectorAll('.btn-answer').forEach(btn => {
        btn.disabled = true;

        // Highlight correct/wrong for choice type
        if (q.type === 'choice') {
            const opt = q.options.find(o => btn.textContent.includes(o.display));
            if (opt && opt.type === q.answer) {
                btn.classList.add('correct');
            } else if (btn.textContent.includes(answer) || opt?.type === answer) {
                if (!isCorrect) btn.classList.add('wrong');
            }
        } else {
            // Standard parity buttons
            if (btn.classList.contains(q.answer)) {
                btn.classList.add('correct');
            } else if (btn.classList.contains(answer) && !isCorrect) {
                btn.classList.add('wrong');
            }
        }
    });

    // Update stats
    if (isCorrect) {
        state.correct++;
        state.streak++;
        document.getElementById('correct').textContent = state.correct;
        document.getElementById('streak').textContent = state.streak;
    } else {
        state.wrong++;
        state.streak = 0;
        document.getElementById('wrong').textContent = state.wrong;
        document.getElementById('streak').textContent = state.streak;
    }

    state.questionsAnswered++;

    // Update progress
    const progress = (state.questionsAnswered / state.totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    // Show feedback
    showFeedback(isCorrect, q);

    // Next question after delay
    setTimeout(nextQuestion, isCorrect ? 1200 : 2000);
}

function showFeedback(isCorrect, question) {
    const feedback = document.getElementById('feedback');

    if (isCorrect) {
        const messages = ['Правильно! 🎉', 'Чудово! ✨', 'Так тримати! 💪', 'Вірно! ✅'];
        feedback.textContent = messages[Math.floor(Math.random() * messages.length)];
        feedback.className = 'feedback show correct';
    } else {
        const typeNames = { even: 'парна', odd: 'непарна', neither: 'ні парна, ні непарна' };
        feedback.textContent = `Правильна відповідь: ${typeNames[question.answer]}`;
        feedback.className = 'feedback show wrong';
    }
}

async function showHint() {
    if (state.hintUsed) return;
    state.hintUsed = true;

    const hintBtn = document.getElementById('hintBtn');
    const hintContainer = document.getElementById('hintContainer');
    const hintText = document.getElementById('hintText');

    hintBtn.disabled = true;
    hintText.textContent = 'Думаю...';
    hintContainer.style.display = 'block';

    // Use local hint first
    if (state.currentQuestion.hint) {
        hintText.textContent = state.currentQuestion.hint;
        return;
    }

    // Try AI hint for complex questions
    try {
        const response = await fetch('https://marko17.pythonanywhere.com/api/hint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: 'parity',
                question: state.currentQuestion.questionHtml,
                level: state.level
            })
        });

        if (response.ok) {
            const data = await response.json();
            hintText.textContent = data.hint;
        } else {
            hintText.textContent = state.currentQuestion.hint || 'Перевір визначення парної/непарної функції';
        }
    } catch (e) {
        hintText.textContent = state.currentQuestion.hint || 'Підстав -x замість x і порівняй з f(x)';
    }
}

function showResults() {
    const accuracy = state.correct + state.wrong > 0
        ? Math.round((state.correct / (state.correct + state.wrong)) * 100)
        : 0;

    document.getElementById('finalCorrect').textContent = state.correct;
    document.getElementById('finalWrong').textContent = state.wrong;
    document.getElementById('finalAccuracy').textContent = `${accuracy}%`;

    const title = document.getElementById('resultTitle');
    if (accuracy >= 90) {
        title.textContent = '🏆 Бездоганно!';
    } else if (accuracy >= 70) {
        title.textContent = '🎉 Чудово!';
    } else if (accuracy >= 50) {
        title.textContent = '👍 Непогано!';
    } else {
        title.textContent = '📚 Потрібно повторити';
    }

    showScreen('result');
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
