// === Graph Transformations Trainer ===
// Adaptive AI-powered trainer for NMT preparation

// Telegram Web App integration
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    if (tg.colorScheme === 'light') {
        document.body.classList.add('tg-theme-light');
    }
}

// API URL for GPT explanations
const API_URL = 'https://marko17.pythonanywhere.com';

// === Transformation Types ===
const TRANSFORMATIONS = {
    shiftRight: {
        name: 'Зсув вправо',
        description: 'f(x - a)',
        difficulty: 1
    },
    shiftLeft: {
        name: 'Зсув вліво',
        description: 'f(x + a)',
        difficulty: 1
    },
    shiftUp: {
        name: 'Зсув вгору',
        description: 'f(x) + b',
        difficulty: 1
    },
    shiftDown: {
        name: 'Зсув вниз',
        description: 'f(x) - b',
        difficulty: 1
    },
    reflectX: {
        name: 'Відображення відносно OX',
        description: '-f(x)',
        difficulty: 1
    },
    combined: {
        name: 'Комбіновані трансформації',
        description: 'Декілька трансформацій',
        difficulty: 2
    }
};

// Base functions for transformations
const BASE_FUNCTIONS = [
    { name: 'x²', fn: (x) => x * x, latex: 'x^2' },
    { name: '|x|', fn: (x) => Math.abs(x), latex: '|x|' },
    { name: 'x³', fn: (x) => x * x * x, latex: 'x^3' }
];

// === State Management ===
let state = {
    currentQuestion: 0,
    totalQuestions: 10,
    correctCount: 0,
    streak: 0,
    maxStreak: 0,
    level: 1,
    maxLevel: 2,
    currentQuestionData: null,
    answered: false,
    hintUsed: false,
    history: [],
    weakAreas: {},
    startTime: null
};

// Load saved progress
function loadProgress() {
    const saved = localStorage.getItem('graphTransformProgress');
    if (saved) {
        const data = JSON.parse(saved);
        state.level = data.level || 1;
        state.maxStreak = data.maxStreak || 0;
        state.weakAreas = data.weakAreas || {};
    }
}

// Save progress
function saveProgress() {
    localStorage.setItem('graphTransformProgress', JSON.stringify({
        level: state.level,
        maxStreak: state.maxStreak,
        weakAreas: state.weakAreas
    }));
}

// === Question Generation ===
function generateQuestion() {
    const baseFunction = BASE_FUNCTIONS[Math.floor(Math.random() * BASE_FUNCTIONS.length)];

    let transformationType;
    let transformParams = {};

    if (state.level === 1) {
        // Level 1: Single transformations only
        const singleTypes = ['shiftRight', 'shiftLeft', 'shiftUp', 'shiftDown', 'reflectX'];

        // Prefer weak areas
        const weakTypes = singleTypes.filter(t => state.weakAreas[t] > 0);
        if (weakTypes.length > 0 && Math.random() < 0.4) {
            transformationType = weakTypes[Math.floor(Math.random() * weakTypes.length)];
        } else {
            transformationType = singleTypes[Math.floor(Math.random() * singleTypes.length)];
        }
    } else {
        // Level 2: Include combined transformations
        if (Math.random() < 0.4) {
            transformationType = 'combined';
        } else {
            const singleTypes = ['shiftRight', 'shiftLeft', 'shiftUp', 'shiftDown', 'reflectX'];
            transformationType = singleTypes[Math.floor(Math.random() * singleTypes.length)];
        }
    }

    // Generate transformation parameters
    const shiftValues = [1, 2, 3];
    const shift = shiftValues[Math.floor(Math.random() * shiftValues.length)];

    switch (transformationType) {
        case 'shiftRight':
            transformParams = { h: shift, v: 0, reflect: false };
            break;
        case 'shiftLeft':
            transformParams = { h: -shift, v: 0, reflect: false };
            break;
        case 'shiftUp':
            transformParams = { h: 0, v: shift, reflect: false };
            break;
        case 'shiftDown':
            transformParams = { h: 0, v: -shift, reflect: false };
            break;
        case 'reflectX':
            transformParams = { h: 0, v: 0, reflect: true };
            break;
        case 'combined':
            // Combine horizontal shift with vertical or reflection
            const combos = [
                { h: shift, v: shiftValues[Math.floor(Math.random() * shiftValues.length)], reflect: false },
                { h: -shift, v: shiftValues[Math.floor(Math.random() * shiftValues.length)], reflect: false },
                { h: shift, v: 0, reflect: true },
                { h: 0, v: shift, reflect: true }
            ];
            transformParams = combos[Math.floor(Math.random() * combos.length)];
            break;
    }

    // Generate correct answer equation
    const correctEquation = generateEquation(baseFunction, transformParams);

    // Generate wrong answers
    const wrongAnswers = generateWrongAnswers(baseFunction, transformParams, correctEquation);

    // Create answer options
    const answers = [correctEquation, ...wrongAnswers];
    shuffleArray(answers);

    return {
        baseFunction,
        transformationType,
        transformParams,
        correctAnswer: correctEquation,
        answers,
        questionText: 'Яке рівняння описує зелений графік?'
    };
}

function generateEquation(baseFunction, params) {
    let equation = '';
    const { h, v, reflect } = params;

    // Build the equation string
    if (reflect) {
        equation = '-';
    }

    // Handle the argument (x - h) or (x + h)
    let arg = 'x';
    if (h !== 0) {
        if (h > 0) {
            arg = `(x - ${h})`;
        } else {
            arg = `(x + ${Math.abs(h)})`;
        }
    }

    // Build function with argument
    if (baseFunction.name === 'x²') {
        if (h !== 0) {
            equation += `${arg}²`;
        } else {
            equation += 'x²';
        }
    } else if (baseFunction.name === '|x|') {
        equation += `|${arg === 'x' ? 'x' : arg.replace(/[()]/g, '')}|`;
        if (h !== 0) {
            // Adjust for |x - h| format
            if (h > 0) {
                equation = reflect ? '-|x - ' + h + '|' : '|x - ' + h + '|';
            } else {
                equation = reflect ? '-|x + ' + Math.abs(h) + '|' : '|x + ' + Math.abs(h) + '|';
            }
        } else {
            equation = reflect ? '-|x|' : '|x|';
        }
    } else if (baseFunction.name === 'x³') {
        if (h !== 0) {
            equation += `${arg}³`;
        } else {
            equation += 'x³';
        }
    }

    // Add vertical shift
    if (v !== 0) {
        if (v > 0) {
            equation += ` + ${v}`;
        } else {
            equation += ` - ${Math.abs(v)}`;
        }
    }

    return 'g(x) = ' + equation;
}

function generateWrongAnswers(baseFunction, correctParams, correctEquation) {
    const wrongAnswers = [];
    const { h, v, reflect } = correctParams;

    // Generate variations
    const variations = [];

    // Wrong horizontal direction
    if (h !== 0) {
        variations.push({ h: -h, v, reflect });
    }

    // Wrong vertical direction
    if (v !== 0) {
        variations.push({ h, v: -v, reflect });
    }

    // Missing reflection or extra reflection
    variations.push({ h, v, reflect: !reflect });

    // Wrong shift values
    const wrongShifts = [1, 2, 3, 4].filter(s => s !== Math.abs(h) && s !== Math.abs(v));
    if (wrongShifts.length > 0) {
        const wrongShift = wrongShifts[0];
        if (h !== 0) {
            variations.push({ h: h > 0 ? wrongShift : -wrongShift, v, reflect });
        }
        if (v !== 0) {
            variations.push({ h, v: v > 0 ? wrongShift : -wrongShift, reflect });
        }
    }

    // Combined wrong
    if (h === 0 && v === 0 && reflect) {
        variations.push({ h: 2, v: 0, reflect: false });
        variations.push({ h: 0, v: 2, reflect: false });
    }

    // Generate equations for variations
    for (const params of variations) {
        const equation = generateEquation(baseFunction, params);
        if (equation !== correctEquation && !wrongAnswers.includes(equation)) {
            wrongAnswers.push(equation);
        }
        if (wrongAnswers.length >= 3) break;
    }

    // Fill remaining slots if needed
    while (wrongAnswers.length < 3) {
        const randomParams = {
            h: Math.floor(Math.random() * 7) - 3,
            v: Math.floor(Math.random() * 7) - 3,
            reflect: Math.random() < 0.3
        };
        const equation = generateEquation(baseFunction, randomParams);
        if (equation !== correctEquation && !wrongAnswers.includes(equation)) {
            wrongAnswers.push(equation);
        }
    }

    return wrongAnswers.slice(0, 3);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// === Graph Drawing ===
function drawGraph(canvas, baseFunction, transformParams) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get CSS colors
    const style = getComputedStyle(document.body);
    const gridColor = style.getPropertyValue('--graph-grid').trim() || '#3D3D5C';
    const axisColor = style.getPropertyValue('--graph-axis').trim() || '#6B6B80';
    const originalColor = style.getPropertyValue('--graph-original').trim() || '#A29BFE';
    const transformedColor = style.getPropertyValue('--graph-transformed').trim() || '#00B894';

    // Scale and offset for coordinate system
    const scale = width / 10; // -5 to 5 range
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;

    for (let i = -5; i <= 5; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(centerX + i * scale, 0);
        ctx.lineTo(centerX + i * scale, height);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, centerY + i * scale);
        ctx.lineTo(width, centerY + i * scale);
        ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = axisColor;
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

    // Draw axis labels
    ctx.fillStyle = axisColor;
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('x', width - 15, centerY - 5);
    ctx.fillText('y', centerX + 5, 15);

    // Draw original function (dashed)
    ctx.strokeStyle = originalColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    let firstPoint = true;
    for (let px = 0; px < width; px++) {
        const x = (px - centerX) / scale;
        const y = baseFunction.fn(x);
        const py = centerY - y * scale;

        if (py >= -50 && py <= height + 50) {
            if (firstPoint) {
                ctx.moveTo(px, py);
                firstPoint = false;
            } else {
                ctx.lineTo(px, py);
            }
        } else {
            firstPoint = true;
        }
    }
    ctx.stroke();

    // Draw transformed function (solid)
    ctx.strokeStyle = transformedColor;
    ctx.lineWidth = 3;
    ctx.setLineDash([]);

    const { h, v, reflect } = transformParams;

    ctx.beginPath();
    firstPoint = true;
    for (let px = 0; px < width; px++) {
        const x = (px - centerX) / scale;
        // Apply horizontal shift: f(x - h) means shift right by h
        const xTransformed = x - h;
        let y = baseFunction.fn(xTransformed);
        // Apply reflection
        if (reflect) {
            y = -y;
        }
        // Apply vertical shift
        y = y + v;

        const py = centerY - y * scale;

        if (py >= -50 && py <= height + 50) {
            if (firstPoint) {
                ctx.moveTo(px, py);
                firstPoint = false;
            } else {
                ctx.lineTo(px, py);
            }
        } else {
            firstPoint = true;
        }
    }
    ctx.stroke();
}

// === UI Updates ===
function updateUI() {
    // Update streak
    document.getElementById('streakNumber').textContent = state.streak;

    // Update progress
    const progress = (state.correctCount / state.totalQuestions) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('correctCount').textContent = state.correctCount;
    document.getElementById('totalCount').textContent = state.totalQuestions;

    // Update difficulty indicator
    const dots = document.querySelectorAll('.difficulty-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index < state.level);
    });
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function displayQuestion() {
    state.currentQuestionData = generateQuestion();
    state.answered = false;
    state.hintUsed = false;

    // Update question number
    document.getElementById('questionNumber').textContent = `Питання ${state.currentQuestion + 1}`;
    document.getElementById('questionText').textContent = state.currentQuestionData.questionText;

    // Update topic badge
    const transformName = TRANSFORMATIONS[state.currentQuestionData.transformationType]?.name || 'Трансформація';
    document.getElementById('topicBadge').textContent = transformName;

    // Update equations display
    document.getElementById('originalEquation').textContent = `f(x) = ${state.currentQuestionData.baseFunction.name}`;
    document.getElementById('transformedEquation').textContent = 'g(x) = ?';

    // Draw the graph
    const canvas = document.getElementById('graphCanvas');
    drawGraph(canvas, state.currentQuestionData.baseFunction, state.currentQuestionData.transformParams);

    // Display answers
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';

    const letters = ['А', 'Б', 'В', 'Г'];
    state.currentQuestionData.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerHTML = `
            <span class="answer-letter">${letters[index]}</span>
            <span class="answer-text">${answer}</span>
        `;
        btn.addEventListener('click', () => handleAnswer(answer, btn));
        answersContainer.appendChild(btn);
    });

    // Hide feedback and next button, show help panel
    document.getElementById('feedbackContainer').classList.remove('show', 'correct', 'incorrect');
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('helpPanel').style.display = 'flex';

    updateUI();
}

async function handleAnswer(answer, btn) {
    if (state.answered) return;
    state.answered = true;

    const isCorrect = answer === state.currentQuestionData.correctAnswer;

    // Disable all buttons
    document.querySelectorAll('.answer-btn').forEach(b => {
        b.classList.add('disabled');
        if (b.querySelector('.answer-text').textContent === state.currentQuestionData.correctAnswer) {
            b.classList.add('correct');
        }
    });

    // Mark selected answer
    if (!isCorrect) {
        btn.classList.add('incorrect');
    }

    // Update state
    if (isCorrect) {
        state.correctCount++;
        state.streak++;
        if (state.streak > state.maxStreak) {
            state.maxStreak = state.streak;
        }

        // Level up logic
        if (state.streak >= 5 && state.level < state.maxLevel) {
            state.level++;
            state.streak = 0;
        }
    } else {
        state.streak = 0;

        // Track weak areas
        const type = state.currentQuestionData.transformationType;
        state.weakAreas[type] = (state.weakAreas[type] || 0) + 1;

        // Level down logic
        if (state.level > 1) {
            const recentWrong = state.history.slice(-5).filter(h => !h.correct).length;
            if (recentWrong >= 3) {
                state.level--;
            }
        }
    }

    // Record history
    state.history.push({
        correct: isCorrect,
        type: state.currentQuestionData.transformationType
    });

    // Show feedback
    showFeedback(isCorrect);

    // Update transformed equation
    document.getElementById('transformedEquation').textContent = state.currentQuestionData.correctAnswer;

    // Get GPT explanation if wrong
    if (!isCorrect) {
        getGPTExplanation();
    }

    // Show next button, hide help panel
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('helpPanel').style.display = 'none';

    saveProgress();
    updateUI();
}

function showFeedback(isCorrect) {
    const feedbackContainer = document.getElementById('feedbackContainer');
    const feedbackIcon = document.getElementById('feedbackIcon');
    const feedbackText = document.getElementById('feedbackText');
    const feedbackExplanation = document.getElementById('feedbackExplanation');

    feedbackContainer.classList.remove('correct', 'incorrect');
    feedbackContainer.classList.add('show', isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
        feedbackIcon.textContent = '✅';
        feedbackText.textContent = getCorrectMessage();
        feedbackExplanation.textContent = '';
    } else {
        feedbackIcon.textContent = '❌';
        feedbackText.textContent = 'Не зовсім так';
        feedbackExplanation.textContent = getTransformationHint();
    }
}

function getCorrectMessage() {
    const messages = [
        'Правильно!',
        'Чудово!',
        'Так тримати!',
        'Відмінно!',
        'Молодець!'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function getTransformationHint() {
    const params = state.currentQuestionData.transformParams;
    const hints = [];

    if (params.h > 0) {
        hints.push(`Графік зсунуто вправо на ${params.h} (x - ${params.h} в аргументі)`);
    } else if (params.h < 0) {
        hints.push(`Графік зсунуто вліво на ${Math.abs(params.h)} (x + ${Math.abs(params.h)} в аргументі)`);
    }

    if (params.v > 0) {
        hints.push(`Графік зсунуто вгору на ${params.v} (+ ${params.v} в кінці)`);
    } else if (params.v < 0) {
        hints.push(`Графік зсунуто вниз на ${Math.abs(params.v)} (- ${Math.abs(params.v)} в кінці)`);
    }

    if (params.reflect) {
        hints.push('Графік відображено відносно осі X (мінус перед функцією)');
    }

    return hints.join('. ');
}

async function getGPTExplanation() {
    try {
        const response = await fetch(`${API_URL}/api/explain`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: state.currentQuestionData.questionText,
                correct: state.currentQuestionData.correctAnswer,
                userAnswer: document.querySelector('.answer-btn.incorrect .answer-text')?.textContent || '',
                formulaType: `Трансформація: ${TRANSFORMATIONS[state.currentQuestionData.transformationType].name}`
            })
        });

        const data = await response.json();
        if (data.success && data.explanation) {
            const feedbackExplanation = document.getElementById('feedbackExplanation');
            setTextWithMath(feedbackExplanation, data.explanation);
        }
    } catch (error) {
        console.error('GPT API error:', error);
    }
}

// === Help Panel Functions ===
function showHint() {
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
                <p>${getTransformationHint()}</p>
            </div>
        `;
    }, 400);
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

        response.innerHTML = `
            <div class="ai-help-content">
                <h4>🤖 Допомога</h4>
                <p><strong>Як визначити трансформацію:</strong></p>
                <p>1. Подивись, чи графік зсунутий вліво/вправо</p>
                <p>2. Подивись, чи графік зсунутий вгору/вниз</p>
                <p>3. Перевір, чи графік відображений (перевернутий)</p>
                <p><strong>Правила:</strong></p>
                <p>• f(x - a) → зсув вправо на a</p>
                <p>• f(x + a) → зсув вліво на a</p>
                <p>• f(x) + b → зсув вгору на b</p>
                <p>• -f(x) → відображення відносно OX</p>
            </div>
        `;
    }, 500);
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
            <h4>📐 Правила трансформацій</h4>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">f(x - a) → вправо на a</div>
                <div class="formula-main">f(x + a) → вліво на a</div>
            </div>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">f(x) + b → вгору на b</div>
                <div class="formula-main">f(x) - b → вниз на b</div>
            </div>
            <div class="theory-card">
                <div class="formula-main">-f(x) → відображення</div>
                <div class="formula-note">Відносно осі OX</div>
            </div>
        </div>
    `;
}

function closeAIModal() {
    document.getElementById('aiHelperModal').classList.add('hidden');
}

// === Results Screen ===
async function showResults() {
    showScreen('resultsScreen');
    document.getElementById('progressContainer').style.display = 'none';

    const accuracy = Math.round((state.correctCount / state.totalQuestions) * 100);
    const endTime = Date.now();
    const timeSpent = Math.round((endTime - state.startTime) / 1000);

    // Update results stats
    document.getElementById('resultCorrect').textContent = state.correctCount;
    document.getElementById('resultAccuracy').textContent = `${accuracy}%`;
    document.getElementById('resultLevel').textContent = state.level;

    // Update results icon and title
    const resultsIcon = document.getElementById('resultsIcon');
    const resultsTitle = document.getElementById('resultsTitle');

    if (accuracy >= 80) {
        resultsIcon.textContent = '🎉';
        resultsTitle.textContent = 'Чудова робота!';
    } else if (accuracy >= 60) {
        resultsIcon.textContent = '👍';
        resultsTitle.textContent = 'Непогано!';
    } else {
        resultsIcon.textContent = '💪';
        resultsTitle.textContent = 'Продовжуй тренуватись!';
    }

    // Save to Firebase
    await saveToFirebase(accuracy, timeSpent);
}

async function saveToFirebase(accuracy, timeSpent) {
    if (window.MathQuestFirebase) {
        try {
            await window.MathQuestFirebase.saveTrainerSession({
                trainerId: 'graphs',
                trainerName: 'Трансформації графіків',
                score: state.correctCount,
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

function displayWeakAreas() {
    const weakTopicsDiv = document.getElementById('weakTopics');
    const weakListDiv = document.getElementById('weakList');

    const significantWeak = Object.entries(state.weakAreas)
        .filter(([_, count]) => count >= 2)
        .map(([type]) => TRANSFORMATIONS[type]?.name || type);

    if (significantWeak.length > 0) {
        weakTopicsDiv.style.display = 'block';
        weakListDiv.innerHTML = significantWeak
            .map(topic => `<span class="weak-tag">${topic}</span>`)
            .join('');
    } else {
        weakTopicsDiv.style.display = 'none';
    }
}

async function getGPTFeedback() {
    const aiTextDiv = document.getElementById('aiText');
    aiTextDiv.textContent = 'Аналізую твої результати...';

    try {
        const weakAreaNames = Object.entries(state.weakAreas)
            .filter(([_, count]) => count >= 2)
            .map(([type]) => TRANSFORMATIONS[type]?.name || type);

        const response = await fetch(`${API_URL}/api/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correct: state.correctCount,
                total: state.totalQuestions,
                level: state.level,
                weakAreas: weakAreaNames,
                streak: state.maxStreak
            })
        });

        const data = await response.json();
        if (data.success && data.feedback) {
            setTextWithMath(aiTextDiv, data.feedback);
        } else {
            aiTextDiv.textContent = generateLocalFeedback();
        }
    } catch (error) {
        console.error('GPT feedback error:', error);
        aiTextDiv.textContent = generateLocalFeedback();
    }
}

function generateLocalFeedback() {
    const accuracy = Math.round((state.correctCount / state.totalQuestions) * 100);

    if (accuracy >= 90) {
        return 'Відмінний результат! Ти добре розумієш трансформації графіків. Спробуй підвищити рівень для більшої складності!';
    } else if (accuracy >= 70) {
        return 'Хороший результат! Продовжуй практикуватись, щоб закріпити знання про зсуви та відображення.';
    } else if (accuracy >= 50) {
        return 'Непоганий початок! Рекомендую повторити правила трансформацій. Пам\'ятай: f(x-a) - зсув вправо, f(x)+b - зсув вгору.';
    } else {
        return 'Не засмучуйся! Трансформації графіків потребують практики. Перегляни правила та спробуй ще раз.';
    }
}

// === Math Rendering ===
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

// === Event Listeners ===
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    updateUI();

    // Start button
    document.getElementById('startBtn').addEventListener('click', () => {
        state.currentQuestion = 0;
        state.correctCount = 0;
        state.streak = 0;
        state.history = [];
        state.weakAreas = {};
        state.startTime = Date.now();

        document.getElementById('progressContainer').style.display = 'block';
        showScreen('quizScreen');
        displayQuestion();
    });

    // Next button
    document.getElementById('nextBtn').addEventListener('click', () => {
        state.currentQuestion++;

        if (state.currentQuestion >= state.totalQuestions) {
            showResults();
        } else {
            displayQuestion();
        }
    });

    // Help panel buttons
    document.getElementById('hintBtn').addEventListener('click', showHint);
    document.getElementById('aiHelpBtn').addEventListener('click', showAIHelp);
    document.getElementById('formulaBtn').addEventListener('click', showFormulaHelp);

    // AI Modal close
    document.getElementById('aiCloseBtn')?.addEventListener('click', closeAIModal);
    document.getElementById('aiHelperModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'aiHelperModal') closeAIModal();
    });

    // Restart button
    document.getElementById('restartBtn').addEventListener('click', () => {
        state.currentQuestion = 0;
        state.correctCount = 0;
        state.streak = 0;
        state.history = [];
        state.startTime = Date.now();

        document.getElementById('progressContainer').style.display = 'block';
        showScreen('quizScreen');
        displayQuestion();
    });

    // Review rules button
    document.getElementById('reviewBtn').addEventListener('click', () => {
        showScreen('rulesScreen');
    });

    // Back to quiz button
    document.getElementById('backToQuizBtn').addEventListener('click', () => {
        showScreen('resultsScreen');
    });

    // Render math when KaTeX is loaded
    if (typeof renderMathInElement !== 'undefined') {
        renderMath(document.body);
    } else {
        setTimeout(() => renderMath(document.body), 100);
    }
});

// Resize canvas on window resize
window.addEventListener('resize', () => {
    if (state.currentQuestionData) {
        const canvas = document.getElementById('graphCanvas');
        drawGraph(canvas, state.currentQuestionData.baseFunction, state.currentQuestionData.transformParams);
    }
});
