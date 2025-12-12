// === Quadratic Equations Trainer ===
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

// === Topic Types ===
const TOPICS = {
    incomplete: {
        name: 'Неповні рівняння',
        description: 'ax² + c = 0 або ax² + bx = 0',
        difficulty: 1
    },
    discriminant: {
        name: 'Дискримінант',
        description: 'D = b² - 4ac',
        difficulty: 1
    },
    vieta: {
        name: 'Теорема Вієта',
        description: 'x₁ + x₂ = -p, x₁·x₂ = q',
        difficulty: 2
    },
    factorization: {
        name: 'Розклад на множники',
        description: 'ax² + bx + c = a(x - x₁)(x - x₂)',
        difficulty: 2
    },
    findCoefficients: {
        name: 'Знайти коефіцієнти',
        description: 'За коренями знайти a, b, c',
        difficulty: 3
    }
};

// === State Management ===
let state = {
    currentQuestion: 0,
    totalQuestions: 10,
    correctCount: 0,
    streak: 0,
    maxStreak: 0,
    level: 1,
    maxLevel: 3,
    currentQuestionData: null,
    answered: false,
    history: [],
    weakAreas: {},
    selectedTopic: 'mixed' // Track selected topic
};

// Load saved progress
function loadProgress() {
    const saved = localStorage.getItem('quadraticProgress');
    if (saved) {
        const data = JSON.parse(saved);
        state.level = data.level || 1;
        state.maxStreak = data.maxStreak || 0;
        state.weakAreas = data.weakAreas || {};
    }
}

// Save progress
function saveProgress() {
    localStorage.setItem('quadraticProgress', JSON.stringify({
        level: state.level,
        maxStreak: state.maxStreak,
        weakAreas: state.weakAreas
    }));
}

// === Question Generators ===

// Helper: generate nice integer roots
function generateRoots(difficulty) {
    const simpleRoots = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
    const mediumRoots = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];

    const pool = difficulty <= 1 ? simpleRoots : mediumRoots;
    const x1 = pool[Math.floor(Math.random() * pool.length)];
    let x2 = pool[Math.floor(Math.random() * pool.length)];

    // Avoid same roots for variety
    while (x2 === x1 && Math.random() > 0.3) {
        x2 = pool[Math.floor(Math.random() * pool.length)];
    }

    return [x1, x2].sort((a, b) => a - b);
}

// Type 1: Incomplete quadratic equations (ax² + c = 0 or ax² + bx = 0)
function generateIncomplete() {
    const type = Math.random() < 0.5 ? 'noB' : 'noC';

    if (type === 'noB') {
        // ax² + c = 0 → x² = -c/a
        const perfectSquares = [1, 4, 9, 16, 25, 36];
        const square = perfectSquares[Math.floor(Math.random() * perfectSquares.length)];
        const root = Math.sqrt(square);
        const a = 1;
        const c = -square;

        const equation = c < 0 ? `x² - ${Math.abs(c)} = 0` : `x² + ${c} = 0`;

        return {
            topic: 'incomplete',
            question: `Розв'яжіть рівняння: ${equation}`,
            correctAnswer: `x = ±${root}`,
            answers: [
                `x = ±${root}`,
                `x = ${root}`,
                `x = -${root}`,
                `x = ±${root + 1}`
            ],
            explanation: `${equation}\nx² = ${square}\nx = ±√${square} = ±${root}`,
            coefficients: { a, b: 0, c }
        };
    } else {
        // ax² + bx = 0 → x(ax + b) = 0
        const a = 1;
        const bValues = [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6];
        const b = bValues[Math.floor(Math.random() * bValues.length)];
        const x2 = -b / a;

        const bSign = b > 0 ? '+' : '-';
        const equation = `x² ${bSign} ${Math.abs(b)}x = 0`;

        return {
            topic: 'incomplete',
            question: `Розв'яжіть рівняння: ${equation}`,
            correctAnswer: `x = 0; x = ${x2}`,
            answers: [
                `x = 0; x = ${x2}`,
                `x = ${x2}`,
                `x = 0; x = ${-x2}`,
                `x = 0`
            ],
            explanation: `${equation}\nx(x ${bSign} ${Math.abs(b)}) = 0\nx = 0 або x = ${x2}`,
            coefficients: { a, b, c: 0 }
        };
    }
}

// Type 2: Discriminant problems
function generateDiscriminant() {
    const [x1, x2] = generateRoots(state.level);
    const a = 1;
    const b = -(x1 + x2);
    const c = x1 * x2;
    const D = b * b - 4 * a * c;

    const questionTypes = ['findRoots', 'findD', 'howManyRoots'];
    const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    // Format equation
    let equation = 'x²';
    if (b !== 0) equation += b > 0 ? ` + ${b}x` : ` - ${Math.abs(b)}x`;
    if (c !== 0) equation += c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;
    equation += ' = 0';

    if (qType === 'findRoots') {
        const rootsStr = x1 === x2 ? `x = ${x1}` : `x₁ = ${x1}; x₂ = ${x2}`;
        return {
            topic: 'discriminant',
            question: `Знайдіть корені рівняння: ${equation}`,
            correctAnswer: rootsStr,
            answers: shuffleArray([
                rootsStr,
                `x₁ = ${x1 + 1}; x₂ = ${x2 - 1}`,
                `x₁ = ${-x1}; x₂ = ${-x2}`,
                x1 === x2 ? `x₁ = ${x1 - 1}; x₂ = ${x2 + 1}` : `x = ${x1}`
            ]),
            explanation: `D = ${b}² - 4·1·${c} = ${b*b} - ${4*c} = ${D}\nx = (-${b} ± √${D}) / 2`,
            coefficients: { a, b, c }
        };
    } else if (qType === 'findD') {
        return {
            topic: 'discriminant',
            question: `Знайдіть дискримінант: ${equation}`,
            correctAnswer: `D = ${D}`,
            answers: shuffleArray([
                `D = ${D}`,
                `D = ${D + 4}`,
                `D = ${Math.abs(D - 4)}`,
                `D = ${b * b}`
            ]),
            explanation: `a = ${a}, b = ${b}, c = ${c}\nD = b² - 4ac = ${b}² - 4·${a}·${c} = ${D}`,
            coefficients: { a, b, c }
        };
    } else {
        // How many roots
        const rootCount = D > 0 ? 'два корені' : (D === 0 ? 'один корінь' : 'коренів немає');
        return {
            topic: 'discriminant',
            question: `Скільки коренів має рівняння: ${equation}?`,
            correctAnswer: rootCount,
            answers: shuffleArray([
                'два корені',
                'один корінь',
                'коренів немає',
                'безліч коренів'
            ]),
            explanation: `D = ${b}² - 4·${a}·${c} = ${D}\n${D > 0 ? 'D > 0 → два корені' : (D === 0 ? 'D = 0 → один корінь' : 'D < 0 → коренів немає')}`,
            coefficients: { a, b, c }
        };
    }
}

// Type 3: Vieta's theorem
function generateVieta() {
    const [x1, x2] = generateRoots(state.level);
    const sum = x1 + x2;
    const product = x1 * x2;

    const qTypes = ['findSum', 'findProduct', 'findRootsByVieta'];
    const qType = qTypes[Math.floor(Math.random() * qTypes.length)];

    // For reduced form x² + px + q = 0
    const p = -sum;
    const q = product;

    let equation = 'x²';
    if (p !== 0) equation += p > 0 ? ` + ${p}x` : ` - ${Math.abs(p)}x`;
    if (q !== 0) equation += q > 0 ? ` + ${q}` : ` - ${Math.abs(q)}`;
    equation += ' = 0';

    if (qType === 'findSum') {
        return {
            topic: 'vieta',
            question: `Знайдіть суму коренів: ${equation}`,
            correctAnswer: `x₁ + x₂ = ${sum}`,
            answers: shuffleArray([
                `x₁ + x₂ = ${sum}`,
                `x₁ + x₂ = ${-sum}`,
                `x₁ + x₂ = ${product}`,
                `x₁ + x₂ = ${sum + 2}`
            ]),
            explanation: `За теоремою Вієта:\nx₁ + x₂ = -p = -${p} = ${sum}`,
            coefficients: { a: 1, b: p, c: q }
        };
    } else if (qType === 'findProduct') {
        return {
            topic: 'vieta',
            question: `Знайдіть добуток коренів: ${equation}`,
            correctAnswer: `x₁ · x₂ = ${product}`,
            answers: shuffleArray([
                `x₁ · x₂ = ${product}`,
                `x₁ · x₂ = ${-product}`,
                `x₁ · x₂ = ${sum}`,
                `x₁ · x₂ = ${product + 2}`
            ]),
            explanation: `За теоремою Вієта:\nx₁ · x₂ = q = ${q}`,
            coefficients: { a: 1, b: p, c: q }
        };
    } else {
        // Given sum and product, find roots
        return {
            topic: 'vieta',
            question: `Корені рівняння мають суму ${sum} і добуток ${product}. Знайдіть корені:`,
            correctAnswer: `x₁ = ${x1}; x₂ = ${x2}`,
            answers: shuffleArray([
                `x₁ = ${x1}; x₂ = ${x2}`,
                `x₁ = ${x1 + 1}; x₂ = ${x2 - 1}`,
                `x₁ = ${-x1}; x₂ = ${-x2}`,
                `x₁ = ${sum}; x₂ = ${product}`
            ]),
            explanation: `x₁ + x₂ = ${sum}, x₁ · x₂ = ${product}\nПідбираємо: ${x1} + ${x2} = ${sum}, ${x1} · ${x2} = ${product}`,
            coefficients: { a: 1, b: p, c: q }
        };
    }
}

// Type 4: Factorization
function generateFactorization() {
    const [x1, x2] = generateRoots(state.level);
    const a = 1;
    const b = -(x1 + x2);
    const c = x1 * x2;

    let equation = 'x²';
    if (b !== 0) equation += b > 0 ? ` + ${b}x` : ` - ${Math.abs(b)}x`;
    if (c !== 0) equation += c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`;

    // Format factors
    const factor1 = x1 >= 0 ? `(x - ${x1})` : `(x + ${Math.abs(x1)})`;
    const factor2 = x2 >= 0 ? `(x - ${x2})` : `(x + ${Math.abs(x2)})`;
    const correctFactors = x1 === x2 ? `${factor1}²` : `${factor1}${factor2}`;

    // Generate wrong answers
    const wrongFactor1 = x1 >= 0 ? `(x + ${x1})` : `(x - ${Math.abs(x1)})`;
    const wrongFactor2 = x2 >= 0 ? `(x + ${x2})` : `(x - ${Math.abs(x2)})`;

    return {
        topic: 'factorization',
        question: `Розкладіть на множники: ${equation}`,
        correctAnswer: correctFactors,
        answers: shuffleArray([
            correctFactors,
            `${wrongFactor1}${wrongFactor2}`,
            `${factor1}${wrongFactor2}`,
            `${wrongFactor1}${factor2}`
        ]),
        explanation: `Корені: x₁ = ${x1}, x₂ = ${x2}\n${equation} = ${correctFactors}`,
        coefficients: { a, b, c }
    };
}

// Type 5: Find coefficients (advanced)
function generateFindCoefficients() {
    const [x1, x2] = generateRoots(2);
    const sum = x1 + x2;
    const product = x1 * x2;

    const qTypes = ['findB', 'findC'];
    const qType = qTypes[Math.floor(Math.random() * qTypes.length)];

    if (qType === 'findB') {
        return {
            topic: 'findCoefficients',
            question: `Рівняння x² + bx + ${product} = 0 має корені ${x1} і ${x2}. Знайдіть b:`,
            correctAnswer: `b = ${-sum}`,
            answers: shuffleArray([
                `b = ${-sum}`,
                `b = ${sum}`,
                `b = ${product}`,
                `b = ${-product}`
            ]),
            explanation: `За Вієтою: x₁ + x₂ = -b\n${x1} + ${x2} = ${sum} = -b\nb = ${-sum}`,
            coefficients: { a: 1, b: -sum, c: product }
        };
    } else {
        return {
            topic: 'findCoefficients',
            question: `Рівняння x² + ${-sum}x + c = 0 має корені ${x1} і ${x2}. Знайдіть c:`,
            correctAnswer: `c = ${product}`,
            answers: shuffleArray([
                `c = ${product}`,
                `c = ${-product}`,
                `c = ${sum}`,
                `c = ${-sum}`
            ]),
            explanation: `За Вієтою: x₁ · x₂ = c\n${x1} · ${x2} = ${product} = c`,
            coefficients: { a: 1, b: -sum, c: product }
        };
    }
}

// === Question Selection ===
function generateQuestion() {
    let topicToGenerate;

    // If specific topic selected, use that
    if (state.selectedTopic && state.selectedTopic !== 'mixed') {
        topicToGenerate = state.selectedTopic;
    } else {
        // Mixed mode - use level-based topic selection
        const availableTopics = [];

        // Level 1: Incomplete + Discriminant
        if (state.level >= 1) {
            availableTopics.push('incomplete', 'discriminant');
        }

        // Level 2: Add Vieta + Factorization
        if (state.level >= 2) {
            availableTopics.push('vieta', 'factorization');
        }

        // Level 3: Add Find Coefficients
        if (state.level >= 3) {
            availableTopics.push('findCoefficients');
        }

        // Prefer weak areas (40% chance)
        const weakTopics = availableTopics.filter(t => state.weakAreas[t] > 0);

        if (weakTopics.length > 0 && Math.random() < 0.4) {
            topicToGenerate = weakTopics[Math.floor(Math.random() * weakTopics.length)];
        } else {
            topicToGenerate = availableTopics[Math.floor(Math.random() * availableTopics.length)];
        }
    }

    // Generate question based on topic
    switch (topicToGenerate) {
        case 'incomplete':
            return generateIncomplete();
        case 'discriminant':
            return generateDiscriminant();
        case 'vieta':
            return generateVieta();
        case 'factorization':
            return generateFactorization();
        case 'findCoefficients':
            return generateFindCoefficients();
        default:
            return generateIncomplete();
    }
}

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// === UI Updates ===
function updateUI() {
    const levelBadge = document.getElementById('levelBadge');
    if (levelBadge) levelBadge.textContent = `Рівень ${state.level}`;

    const streakEl = document.getElementById('streakNumber');
    if (streakEl) streakEl.textContent = state.streak;

    const progress = (state.correctCount / state.totalQuestions) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.setProperty('--progress', `${progress}%`);

    const correctEl = document.getElementById('correctCount');
    if (correctEl) correctEl.textContent = state.correctCount;

    const totalEl = document.getElementById('totalCount');
    if (totalEl) totalEl.textContent = state.currentQuestion;

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

    document.getElementById('questionNumber').textContent = `Питання ${state.currentQuestion + 1}`;
    document.getElementById('topicBadge').textContent = TOPICS[state.currentQuestionData.topic].name;

    const questionText = document.getElementById('questionText');
    questionText.textContent = state.currentQuestionData.question;
    renderMath(questionText);

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

    document.getElementById('feedbackContainer').classList.remove('show', 'correct', 'incorrect');
    document.getElementById('nextBtn').style.display = 'none';

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

        // Level up
        if (state.streak >= 5 && state.level < state.maxLevel) {
            state.level++;
            state.streak = 0;
        }
    } else {
        state.streak = 0;
        const topic = state.currentQuestionData.topic;
        state.weakAreas[topic] = (state.weakAreas[topic] || 0) + 1;

        // Level down
        if (state.level > 1) {
            const recentWrong = state.history.slice(-5).filter(h => !h.correct).length;
            if (recentWrong >= 3) {
                state.level--;
            }
        }
    }

    state.history.push({
        correct: isCorrect,
        topic: state.currentQuestionData.topic
    });

    showFeedback(isCorrect, answer);
    document.getElementById('nextBtn').style.display = 'block';

    saveProgress();
    updateUI();
}

async function showFeedback(isCorrect, userAnswer) {
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
        feedbackExplanation.textContent = state.currentQuestionData.explanation;

        // Get GPT explanation
        getGPTExplanation(userAnswer);
    }
}

function getCorrectMessage() {
    const messages = ['Правильно!', 'Чудово!', 'Так тримати!', 'Відмінно!', 'Молодець!'];
    return messages[Math.floor(Math.random() * messages.length)];
}

async function getGPTExplanation(userAnswer) {
    try {
        const response = await fetch(`${API_URL}/api/explain`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: state.currentQuestionData.question,
                correct: state.currentQuestionData.correctAnswer,
                userAnswer: userAnswer,
                formulaType: `Квадратні рівняння: ${TOPICS[state.currentQuestionData.topic].name}`
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

// === Results Screen ===
function showResults() {
    showScreen('resultsScreen');

    const accuracy = Math.round((state.correctCount / state.totalQuestions) * 100);

    document.getElementById('resultCorrect').textContent = state.correctCount;
    document.getElementById('resultAccuracy').textContent = `${accuracy}%`;
    document.getElementById('resultLevel').textContent = state.level;

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

    displayWeakAreas();
    getGPTFeedback();

    // Save to Firebase if available
    saveToFirebase();
}

// Save session to Firebase
async function saveToFirebase() {
    if (window.MathQuestFirebase) {
        try {
            const result = await window.MathQuestFirebase.saveTrainerSession({
                trainerId: 'quadratic',
                trainerName: 'Квадратні рівняння',
                score: state.correctCount,
                totalQuestions: state.totalQuestions,
                difficulty: state.level,
                timeSpent: 0 // TODO: track time
            });
            if (result) {
                console.log('✅ Session saved to Firebase');
            }
        } catch (error) {
            console.log('Could not save to Firebase:', error);
        }
    }
}

function displayWeakAreas() {
    const weakTopicsDiv = document.getElementById('weakTopics');
    const weakListDiv = document.getElementById('weakList');

    const significantWeak = Object.entries(state.weakAreas)
        .filter(([_, count]) => count >= 2)
        .map(([topic]) => TOPICS[topic]?.name || topic);

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
            .map(([topic]) => TOPICS[topic]?.name || topic);

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
        return 'Відмінний результат! Ти чудово розумієш квадратні рівняння. Готовий до складніших завдань!';
    } else if (accuracy >= 70) {
        return 'Хороший результат! Продовжуй практикуватись, особливо теорему Вієта та розклад на множники.';
    } else if (accuracy >= 50) {
        return 'Непоганий початок! Рекомендую повторити формулу дискримінанта та теорему Вієта.';
    } else {
        return 'Не засмучуйся! Квадратні рівняння потребують практики. Перегляни теорію та спробуй ще раз.';
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

    // Start button -> Topic selection
    document.getElementById('startBtn').addEventListener('click', () => {
        showScreen('topicScreen');
    });

    // Back to start from topic selection
    document.getElementById('backToStartBtn').addEventListener('click', () => {
        showScreen('startScreen');
    });

    // Topic selection buttons
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.dataset.topic;
            state.selectedTopic = topic;
            state.currentQuestion = 0;
            state.correctCount = 0;
            state.streak = 0;
            state.history = [];
            state.weakAreas = {};

            showScreen('quizScreen');
            displayQuestion();
        });
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        state.currentQuestion++;

        if (state.currentQuestion >= state.totalQuestions) {
            showResults();
        } else {
            displayQuestion();
        }
    });

    document.getElementById('restartBtn').addEventListener('click', () => {
        state.currentQuestion = 0;
        state.correctCount = 0;
        state.streak = 0;
        state.history = [];

        showScreen('topicScreen');
    });

    document.getElementById('reviewBtn').addEventListener('click', () => {
        showScreen('theoryScreen');
    });

    document.getElementById('backToQuizBtn').addEventListener('click', () => {
        showScreen('resultsScreen');
    });

    // Help panel buttons
    document.getElementById('hintBtn')?.addEventListener('click', showHint);
    document.getElementById('aiHelpBtn')?.addEventListener('click', showAIHelp);
    document.getElementById('formulaBtn')?.addEventListener('click', showFormulaHelp);

    // AI modal close
    document.getElementById('aiCloseBtn')?.addEventListener('click', closeAIModal);
    document.getElementById('aiHelperModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'aiHelperModal') closeAIModal();
    });

    // Render math when KaTeX is loaded
    if (typeof renderMathInElement !== 'undefined') {
        renderMath(document.body);
    } else {
        setTimeout(() => renderMath(document.body), 100);
    }
});

// === Help Panel Functions ===
function showHint() {
    const modal = document.getElementById('aiHelperModal');
    const loading = document.getElementById('aiLoading');
    const response = document.getElementById('aiResponse');

    modal.classList.remove('hidden');
    loading.style.display = 'none';
    response.style.display = 'block';

    const topicHints = {
        incomplete: 'Винеси x за дужки або перенеси c на іншу сторону та візьми корінь.',
        discriminant: 'Обчисли D = b² - 4ac, потім використай формулу коренів.',
        vieta: 'Сума коренів = -b/a, Добуток коренів = c/a',
        factorization: 'Розклад: a(x - x₁)(x - x₂), де x₁, x₂ - корені',
        findCoefficients: 'Використай теорему Вієта: b = -a(x₁+x₂), c = a·x₁·x₂'
    };

    const hint = topicHints[state.selectedTopic] || 'Пригадай формули для квадратних рівнянь.';

    response.innerHTML = `
        <p><strong>💡 Підказка:</strong></p>
        <p>${hint}</p>
    `;
}

function showAIHelp() {
    showHint();
}

function showFormulaHelp() {
    const modal = document.getElementById('aiHelperModal');
    const loading = document.getElementById('aiLoading');
    const response = document.getElementById('aiResponse');

    modal.classList.remove('hidden');
    loading.style.display = 'none';
    response.style.display = 'block';

    response.innerHTML = `
        <h3 style="color: var(--accent); margin-bottom: 1rem;">📐 Квадратні рівняння</h3>
        <div style="margin-bottom: 1rem;">
            <p><strong>ax² + bx + c = 0</strong></p>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Загальний вигляд</p>
        </div>
        <div style="margin-bottom: 1rem;">
            <p><strong>D = b² - 4ac</strong></p>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Дискримінант</p>
        </div>
        <div style="margin-bottom: 1rem;">
            <p><strong>x = (-b ± √D) / 2a</strong></p>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Формула коренів</p>
        </div>
        <div style="margin-bottom: 1rem;">
            <p><strong>x₁ + x₂ = -b/a</strong></p>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Сума коренів (Вієта)</p>
        </div>
        <div>
            <p><strong>x₁ · x₂ = c/a</strong></p>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Добуток коренів (Вієта)</p>
        </div>
    `;
}

function closeAIModal() {
    document.getElementById('aiHelperModal')?.classList.add('hidden');
}
