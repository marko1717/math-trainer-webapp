// Graph Builder Trainer
// Interactive graph construction for various function types

const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
}

// Canvas & Drawing State
let canvas, ctx;
let userPoints = [];
let isDrawingLine = false;
let drawMode = 'point'; // 'point' or 'line'
let lastPoint = null;

// Game State
let state = {
    topic: 'linear',
    topicName: 'Лінійна функція',
    correct: 0,
    wrong: 0,
    questionsAnswered: 0,
    totalQuestions: 5,
    currentQuestion: null,
    hintUsed: false,
    startTime: null
};

const TOPIC_NAMES = {
    linear: 'Лінійна функція',
    quadratic: 'Квадратична функція',
    hyperbola: 'Обернена пропорційність',
    modulus: 'Модуль',
    sqrt: 'Корінь',
    mixed: 'Змішаний режим'
};

// Canvas settings
const CANVAS_SIZE = 320;
const GRID_SIZE = 32; // pixels per unit
const GRID_UNITS = 5; // -5 to 5
const CENTER = CANVAS_SIZE / 2;

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    result: document.getElementById('resultScreen')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('graphCanvas');
    ctx = canvas.getContext('2d');

    setupEventListeners();
    setupCanvasEvents();
});

function setupEventListeners() {
    // Topic buttons
    document.querySelectorAll('.btn-topic').forEach(btn => {
        btn.addEventListener('click', () => {
            state.topic = btn.dataset.topic;
            state.topicName = TOPIC_NAMES[btn.dataset.topic] || 'Графіки';
            startGame();
        });
    });

    // Control buttons
    document.getElementById('undoBtn').addEventListener('click', undoLastAction);
    document.getElementById('clearBtn').addEventListener('click', clearCanvas);
    document.getElementById('pointMode').addEventListener('click', () => setDrawMode('point'));
    document.getElementById('lineMode').addEventListener('click', () => setDrawMode('line'));

    // Game buttons
    document.getElementById('hintBtn').addEventListener('click', showHint);
    document.getElementById('checkBtn').addEventListener('click', checkAnswer);
    document.getElementById('backBtn').addEventListener('click', () => showScreen('start'));

    // Result buttons
    document.getElementById('restartBtn').addEventListener('click', startGame);
    document.getElementById('menuBtn').addEventListener('click', () => showScreen('start'));
    document.getElementById('resultBackBtn')?.addEventListener('click', () => showScreen('start'));
}

function setupCanvasEvents() {
    // Mouse events
    canvas.addEventListener('mousedown', handleCanvasStart);
    canvas.addEventListener('mousemove', handleCanvasMove);
    canvas.addEventListener('mouseup', handleCanvasEnd);
    canvas.addEventListener('mouseleave', handleCanvasEnd);

    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleCanvasEnd);
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    handleCanvasStart({
        offsetX: (touch.clientX - rect.left) * scaleX,
        offsetY: (touch.clientY - rect.top) * scaleY
    });
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    handleCanvasMove({
        offsetX: (touch.clientX - rect.left) * scaleX,
        offsetY: (touch.clientY - rect.top) * scaleY
    });
}

function handleCanvasStart(e) {
    const gridPos = pixelToGrid(e.offsetX, e.offsetY);

    if (drawMode === 'point') {
        addPoint(gridPos.x, gridPos.y);
    } else {
        isDrawingLine = true;
        lastPoint = gridPos;
    }
}

function handleCanvasMove(e) {
    if (!isDrawingLine) return;

    const gridPos = pixelToGrid(e.offsetX, e.offsetY);

    // Draw preview line
    redrawCanvas();
    if (lastPoint) {
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        const start = gridToPixel(lastPoint.x, lastPoint.y);
        const end = gridToPixel(gridPos.x, gridPos.y);
        ctx.moveTo(start.px, start.py);
        ctx.lineTo(end.px, end.py);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function handleCanvasEnd(e) {
    if (isDrawingLine && lastPoint) {
        const rect = canvas.getBoundingClientRect();
        let endPos;

        if (e.offsetX !== undefined) {
            endPos = pixelToGrid(e.offsetX, e.offsetY);
        } else {
            endPos = lastPoint;
        }

        // Add line segment as series of points
        addLineSegment(lastPoint, endPos);
    }

    isDrawingLine = false;
    lastPoint = null;
    redrawCanvas();
}

function pixelToGrid(px, py) {
    const x = Math.round((px - CENTER) / GRID_SIZE);
    const y = Math.round((CENTER - py) / GRID_SIZE);
    return { x: clamp(x, -GRID_UNITS, GRID_UNITS), y: clamp(y, -GRID_UNITS, GRID_UNITS) };
}

function gridToPixel(gx, gy) {
    return {
        px: CENTER + gx * GRID_SIZE,
        py: CENTER - gy * GRID_SIZE
    };
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function addPoint(x, y) {
    // Check if point already exists
    const exists = userPoints.some(p => p.x === x && p.y === y && p.type === 'point');
    if (!exists) {
        userPoints.push({ x, y, type: 'point' });
        redrawCanvas();
    }
}

function addLineSegment(start, end) {
    userPoints.push({
        type: 'line',
        x1: start.x, y1: start.y,
        x2: end.x, y2: end.y
    });
    redrawCanvas();
}

function undoLastAction() {
    if (userPoints.length > 0) {
        userPoints.pop();
        redrawCanvas();
    }
}

function clearCanvas() {
    userPoints = [];
    redrawCanvas();
}

function setDrawMode(mode) {
    drawMode = mode;
    document.getElementById('pointMode').classList.toggle('active', mode === 'point');
    document.getElementById('lineMode').classList.toggle('active', mode === 'line');
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
        questionsAnswered: 0,
        hintUsed: false,
        startTime: Date.now()
    };

    document.getElementById('correct').textContent = '0';
    document.getElementById('wrong').textContent = '0';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('topicTitle').textContent = state.topicName;

    showScreen('game');
    nextQuestion();
}

function nextQuestion() {
    if (state.questionsAnswered >= state.totalQuestions) {
        showResults();
        return;
    }

    clearCanvas();
    state.hintUsed = false;
    document.getElementById('hintBtn').disabled = false;
    document.getElementById('hintBox').style.display = 'none';
    document.getElementById('feedback').classList.remove('show');
    document.getElementById('checkBtn').disabled = false;

    state.currentQuestion = generateQuestion(state.topic);
    displayQuestion();
    redrawCanvas();
}

function generateQuestion(topic) {
    if (topic === 'mixed') {
        const topics = ['linear', 'quadratic', 'hyperbola', 'modulus', 'sqrt'];
        topic = topics[Math.floor(Math.random() * topics.length)];
    }

    switch (topic) {
        case 'linear': return generateLinear();
        case 'quadratic': return generateQuadratic();
        case 'hyperbola': return generateHyperbola();
        case 'modulus': return generateModulus();
        case 'sqrt': return generateSqrt();
        default: return generateLinear();
    }
}

function generateLinear() {
    const k = randomChoice([-2, -1, -0.5, 0.5, 1, 2]);
    const b = randomInt(-3, 3);

    let display = 'y = ';
    if (k === 1) display += 'x';
    else if (k === -1) display += '-x';
    else if (k === 0.5) display += '½x';
    else if (k === -0.5) display += '-½x';
    else display += k + 'x';

    if (b > 0) display += ' + ' + b;
    else if (b < 0) display += ' − ' + Math.abs(b);

    return {
        type: 'linear',
        func: x => k * x + b,
        display,
        k, b,
        hint: `Лінійна функція y = kx + b\nk = ${k} (нахил), b = ${b} (перетин з OY)\nПройди через точку (0, ${b}) з нахилом ${k}`,
        keyPoints: [
            { x: 0, y: b },
            { x: 1, y: k + b },
            { x: -1, y: -k + b }
        ]
    };
}

function generateQuadratic() {
    const a = randomChoice([-1, 1]);
    const variants = [
        { p: 0, q: 0 },
        { p: randomChoice([-2, -1, 1, 2]), q: 0 },
        { p: 0, q: randomInt(-3, 3) },
        { p: randomChoice([-1, 1]), q: randomChoice([-2, -1, 1, 2]) }
    ];
    const { p, q } = randomChoice(variants);

    // y = a(x - p)² + q
    const func = x => a * Math.pow(x - p, 2) + q;

    let display = 'y = ';
    if (a === -1) display += '-';
    if (p === 0) {
        display += 'x²';
    } else {
        display += `(x ${p > 0 ? '− ' + p : '+ ' + Math.abs(p)})²`;
    }
    if (q > 0) display += ' + ' + q;
    else if (q < 0) display += ' − ' + Math.abs(q);

    const vertex = { x: p, y: q };
    const direction = a > 0 ? 'вгору' : 'вниз';

    return {
        type: 'quadratic',
        func,
        display,
        a, p, q,
        hint: `Парабола з вершиною (${p}, ${q})\nВітки направлені ${direction}\nПройди через вершину та точки x = ${p-1} і x = ${p+1}`,
        keyPoints: [
            vertex,
            { x: p - 1, y: func(p - 1) },
            { x: p + 1, y: func(p + 1) },
            { x: p - 2, y: func(p - 2) },
            { x: p + 2, y: func(p + 2) }
        ].filter(pt => Math.abs(pt.y) <= GRID_UNITS)
    };
}

function generateHyperbola() {
    const k = randomChoice([-2, -1, 1, 2]);

    let display = 'y = ';
    if (k === 1) display += '1/x';
    else if (k === -1) display += '-1/x';
    else display += k + '/x';

    return {
        type: 'hyperbola',
        func: x => x === 0 ? null : k / x,
        display,
        k,
        hint: `Гіпербола y = ${k}/x\nПройди через точки (1, ${k}), (-1, ${-k}), (${k}, 1), (${-k}, -1)\nДві гілки у ${k > 0 ? 'I та III' : 'II та IV'} чвертях`,
        keyPoints: [
            { x: 1, y: k },
            { x: -1, y: -k },
            { x: 2, y: k / 2 },
            { x: -2, y: -k / 2 }
        ].filter(pt => Math.abs(pt.y) <= GRID_UNITS)
    };
}

function generateModulus() {
    const a = randomChoice([0, -2, -1, 1, 2]);
    const b = randomChoice([0, -2, -1, 1, 2]);

    const func = x => Math.abs(x - a) + b;

    let display = 'y = |x';
    if (a > 0) display += ' − ' + a;
    else if (a < 0) display += ' + ' + Math.abs(a);
    display += '|';
    if (b > 0) display += ' + ' + b;
    else if (b < 0) display += ' − ' + Math.abs(b);

    return {
        type: 'modulus',
        func,
        display,
        a, b,
        hint: `Модуль з вершиною в (${a}, ${b})\nV-подібний графік\nЛіворуч від x=${a} спадає, праворуч зростає`,
        keyPoints: [
            { x: a, y: b },
            { x: a - 1, y: b + 1 },
            { x: a + 1, y: b + 1 },
            { x: a - 2, y: b + 2 },
            { x: a + 2, y: b + 2 }
        ].filter(pt => Math.abs(pt.x) <= GRID_UNITS && Math.abs(pt.y) <= GRID_UNITS)
    };
}

function generateSqrt() {
    const a = randomChoice([0, 1, 2, -1, -2]);
    const b = randomChoice([0, 1, -1, 2, -2]);

    const func = x => {
        const inner = x - a;
        if (inner < 0) return null;
        return Math.sqrt(inner) + b;
    };

    let display = 'y = √';
    if (a === 0) {
        display += 'x';
    } else if (a > 0) {
        display += `(x − ${a})`;
    } else {
        display += `(x + ${Math.abs(a)})`;
    }
    if (b > 0) display += ' + ' + b;
    else if (b < 0) display += ' − ' + Math.abs(b);

    const keyPoints = [];
    for (let x = a; x <= GRID_UNITS; x++) {
        const y = func(x);
        if (y !== null && Math.abs(y) <= GRID_UNITS) {
            keyPoints.push({ x, y: Math.round(y * 10) / 10 });
        }
    }

    return {
        type: 'sqrt',
        func,
        display,
        a, b,
        hint: `Корінь починається з точки (${a}, ${b})\nГрафік існує тільки при x ≥ ${a}\nЗростає праворуч`,
        keyPoints: keyPoints.slice(0, 5)
    };
}

function displayQuestion() {
    document.getElementById('functionDisplay').textContent = state.currentQuestion.display;
}

function redrawCanvas() {
    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    drawGrid();
    drawAxes();
    drawUserElements();
}

function drawGrid() {
    ctx.strokeStyle = '#2a2a4a';
    ctx.lineWidth = 1;

    for (let i = -GRID_UNITS; i <= GRID_UNITS; i++) {
        const pos = CENTER + i * GRID_SIZE;

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, CANVAS_SIZE);
        ctx.stroke();

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(CANVAS_SIZE, pos);
        ctx.stroke();
    }
}

function drawAxes() {
    ctx.strokeStyle = '#6a6a9a';
    ctx.lineWidth = 2;

    // X axis
    ctx.beginPath();
    ctx.moveTo(0, CENTER);
    ctx.lineTo(CANVAS_SIZE, CENTER);
    ctx.stroke();

    // Y axis
    ctx.beginPath();
    ctx.moveTo(CENTER, 0);
    ctx.lineTo(CENTER, CANVAS_SIZE);
    ctx.stroke();

    // Arrow heads
    ctx.fillStyle = '#6a6a9a';
    // X arrow
    ctx.beginPath();
    ctx.moveTo(CANVAS_SIZE - 10, CENTER - 5);
    ctx.lineTo(CANVAS_SIZE, CENTER);
    ctx.lineTo(CANVAS_SIZE - 10, CENTER + 5);
    ctx.fill();
    // Y arrow
    ctx.beginPath();
    ctx.moveTo(CENTER - 5, 10);
    ctx.lineTo(CENTER, 0);
    ctx.lineTo(CENTER + 5, 10);
    ctx.fill();

    // Labels
    ctx.fillStyle = '#8a8aba';
    ctx.font = '14px sans-serif';
    ctx.fillText('x', CANVAS_SIZE - 15, CENTER - 8);
    ctx.fillText('y', CENTER + 8, 15);

    // Number labels
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#6a6a8a';
    for (let i = -GRID_UNITS; i <= GRID_UNITS; i++) {
        if (i === 0) continue;
        const xPos = CENTER + i * GRID_SIZE;
        const yPos = CENTER - i * GRID_SIZE;
        ctx.fillText(i.toString(), xPos - 4, CENTER + 14);
        ctx.fillText(i.toString(), CENTER + 5, yPos + 4);
    }
    ctx.fillText('0', CENTER + 5, CENTER + 14);
}

function drawUserElements() {
    // Draw lines
    userPoints.filter(p => p.type === 'line').forEach(line => {
        const start = gridToPixel(line.x1, line.y1);
        const end = gridToPixel(line.x2, line.y2);

        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(start.px, start.py);
        ctx.lineTo(end.px, end.py);
        ctx.stroke();
    });

    // Draw points
    userPoints.filter(p => p.type === 'point').forEach(point => {
        const { px, py } = gridToPixel(point.x, point.y);

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawCorrectGraph() {
    const q = state.currentQuestion;
    if (!q) return;

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let firstPoint = true;

    for (let px = 0; px < CANVAS_SIZE; px++) {
        const x = (px - CENTER) / GRID_SIZE;
        const y = q.func(x);

        if (y === null || Math.abs(y) > GRID_UNITS + 1) {
            firstPoint = true;
            continue;
        }

        const py = CENTER - y * GRID_SIZE;

        if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.stroke();

    // Draw key points
    q.keyPoints.forEach(pt => {
        const { px, py } = gridToPixel(pt.x, pt.y);
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
    });
}

function checkAnswer() {
    const q = state.currentQuestion;
    const points = userPoints.filter(p => p.type === 'point');

    if (points.length < 2) {
        showFeedbackMessage('Постав хоча б 2 точки!', false);
        return;
    }

    document.getElementById('checkBtn').disabled = true;

    // Check if user points match the function
    let correctPoints = 0;
    let totalChecked = 0;

    points.forEach(point => {
        const expectedY = q.func(point.x);
        if (expectedY !== null) {
            totalChecked++;
            // Allow small tolerance for non-integer results
            if (Math.abs(point.y - expectedY) < 0.6) {
                correctPoints++;
            }
        }
    });

    // Also check if key points are included
    let keyPointsHit = 0;
    q.keyPoints.forEach(kp => {
        const hit = points.some(p =>
            Math.abs(p.x - kp.x) < 0.5 && Math.abs(p.y - kp.y) < 0.6
        );
        if (hit) keyPointsHit++;
    });

    const accuracy = totalChecked > 0 ? correctPoints / totalChecked : 0;
    const keyAccuracy = q.keyPoints.length > 0 ? keyPointsHit / Math.min(3, q.keyPoints.length) : 1;

    const isCorrect = accuracy >= 0.7 && keyAccuracy >= 0.5;

    // Draw correct graph
    drawCorrectGraph();

    if (isCorrect) {
        state.correct++;
        document.getElementById('correct').textContent = state.correct;
        showFeedbackMessage('Правильно! 🎉', true);
    } else {
        state.wrong++;
        document.getElementById('wrong').textContent = state.wrong;
        showFeedbackMessage(`Подивись на правильний графік`, false);
    }

    state.questionsAnswered++;
    const progress = (state.questionsAnswered / state.totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    setTimeout(nextQuestion, isCorrect ? 1500 : 2500);
}

function showFeedbackMessage(message, isCorrect) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback show ${isCorrect ? 'correct' : 'wrong'}`;
}

function showHint() {
    if (state.hintUsed) return;
    state.hintUsed = true;

    document.getElementById('hintBtn').disabled = true;
    document.getElementById('hintBox').style.display = 'block';
    document.getElementById('hintText').textContent = state.currentQuestion.hint;

    // Also highlight key points
    const q = state.currentQuestion;
    q.keyPoints.slice(0, 3).forEach(pt => {
        const { px, py } = gridToPixel(pt.x, pt.y);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    });
}

async function showResults() {
    const accuracy = state.correct + state.wrong > 0
        ? Math.round((state.correct / (state.correct + state.wrong)) * 100)
        : 0;

    document.getElementById('finalCorrect').textContent = state.correct;
    document.getElementById('finalWrong').textContent = state.wrong;
    document.getElementById('finalAccuracy').textContent = `${accuracy}%`;

    const title = document.getElementById('resultTitle');
    const icon = document.getElementById('resultIcon');

    if (accuracy >= 90) {
        title.textContent = 'Бездоганно!';
        icon.textContent = '🏆';
    } else if (accuracy >= 70) {
        title.textContent = 'Чудово!';
        icon.textContent = '🎉';
    } else if (accuracy >= 50) {
        title.textContent = 'Непогано!';
        icon.textContent = '👍';
    } else {
        title.textContent = 'Потрібно повторити';
        icon.textContent = '📚';
    }

    showScreen('result');

    // Save to Firebase
    await saveToFirebase(accuracy);
}

async function saveToFirebase(accuracy) {
    if (window.MathQuestFirebase) {
        const endTime = Date.now();
        const timeSpent = Math.round((endTime - state.startTime) / 1000);

        try {
            await window.MathQuestFirebase.saveTrainerSession({
                trainerId: `graph-builder-${state.topic}`,
                trainerName: `Побудова графіків: ${state.topicName}`,
                score: state.correct,
                totalQuestions: state.totalQuestions,
                difficulty: 1,
                accuracy: accuracy,
                maxStreak: state.correct,
                timeSpent: timeSpent
            });
            console.log('Session saved to Firebase');
        } catch (error) {
            console.error('Error saving to Firebase:', error);
        }
    }
}

// Helpers
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
