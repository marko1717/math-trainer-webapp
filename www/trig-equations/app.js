// Trigonometric Equations Trainer

// ========== CONSTANTS ==========
const TOTAL_QUESTIONS = 10;

const TOPIC_NAMES = {
    sin: 'sin x = a',
    cos: 'cos x = a',
    tan: 'tg x = a',
    special: 'Часткові випадки',
    roots: 'Кількість коренів',
    mixed: 'Змішаний режим'
};

// Special trig values
const SPECIAL_VALUES = {
    sin: {
        '0': '0',
        '1/2': '\\frac{\\pi}{6}',
        '\\frac{\\sqrt{2}}{2}': '\\frac{\\pi}{4}',
        '\\frac{\\sqrt{3}}{2}': '\\frac{\\pi}{3}',
        '1': '\\frac{\\pi}{2}',
        '-1/2': '-\\frac{\\pi}{6}',
        '-\\frac{\\sqrt{2}}{2}': '-\\frac{\\pi}{4}',
        '-\\frac{\\sqrt{3}}{2}': '-\\frac{\\pi}{3}',
        '-1': '-\\frac{\\pi}{2}'
    },
    cos: {
        '1': '0',
        '\\frac{\\sqrt{3}}{2}': '\\frac{\\pi}{6}',
        '\\frac{\\sqrt{2}}{2}': '\\frac{\\pi}{4}',
        '1/2': '\\frac{\\pi}{3}',
        '0': '\\frac{\\pi}{2}',
        '-1/2': '\\frac{2\\pi}{3}',
        '-\\frac{\\sqrt{2}}{2}': '\\frac{3\\pi}{4}',
        '-\\frac{\\sqrt{3}}{2}': '\\frac{5\\pi}{6}',
        '-1': '\\pi'
    }
};

// ========== STATE ==========
let currentTopic = 'mixed';
let currentQuestion = 0;
let correctCount = 0;
let wrongCount = 0;
let answered = false;

// ========== DOM ELEMENTS ==========
const screens = {
    welcome: document.getElementById('welcomeScreen'),
    question: document.getElementById('questionScreen'),
    results: document.getElementById('resultsScreen')
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // Topic buttons
    document.querySelectorAll('.btn-topic').forEach(btn => {
        btn.addEventListener('click', () => {
            currentTopic = btn.dataset.topic;
            startTraining();
        });
    });

    // Navigation
    document.getElementById('backBtn').addEventListener('click', () => showScreen('welcome'));
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('restartBtn').addEventListener('click', startTraining);
    document.getElementById('menuBtn').addEventListener('click', () => showScreen('welcome'));
}

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
}

// ========== GAME LOGIC ==========
function startTraining() {
    currentQuestion = 0;
    correctCount = 0;
    wrongCount = 0;

    document.getElementById('correctCount').textContent = '0';
    document.getElementById('wrongCount').textContent = '0';
    document.getElementById('topicTitle').textContent = TOPIC_NAMES[currentTopic];

    showScreen('question');
    generateQuestion();
}

function generateQuestion() {
    answered = false;
    currentQuestion++;

    document.getElementById('questionNumber').textContent = `Питання ${currentQuestion} / ${TOTAL_QUESTIONS}`;
    document.getElementById('progressFill').style.width = `${((currentQuestion - 1) / TOTAL_QUESTIONS) * 100}%`;
    document.getElementById('feedbackContainer').classList.remove('show', 'correct', 'incorrect');
    document.getElementById('nextBtn').classList.add('hidden');

    let topic = currentTopic;
    if (topic === 'mixed') {
        const topics = ['sin', 'cos', 'tan', 'special', 'roots'];
        topic = topics[Math.floor(Math.random() * topics.length)];
    }

    let question;
    switch (topic) {
        case 'sin':
            question = generateSinEquation();
            break;
        case 'cos':
            question = generateCosEquation();
            break;
        case 'tan':
            question = generateTanEquation();
            break;
        case 'special':
            question = generateSpecialCase();
            break;
        case 'roots':
            question = generateRootsCount();
            break;
        default:
            question = generateSinEquation();
    }

    displayQuestion(question);
}

function generateSinEquation() {
    const values = [
        { a: '0', arcsin: '0', answer: 'x = \\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '1', arcsin: '\\frac{\\pi}{2}', answer: 'x = \\frac{\\pi}{2} + 2\\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '-1', arcsin: '-\\frac{\\pi}{2}', answer: 'x = -\\frac{\\pi}{2} + 2\\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '\\frac{1}{2}', arcsin: '\\frac{\\pi}{6}', answer: 'x = (-1)^n \\frac{\\pi}{6} + \\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '-\\frac{1}{2}', arcsin: '-\\frac{\\pi}{6}', answer: 'x = (-1)^n \\left(-\\frac{\\pi}{6}\\right) + \\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '\\frac{\\sqrt{2}}{2}', arcsin: '\\frac{\\pi}{4}', answer: 'x = (-1)^n \\frac{\\pi}{4} + \\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '\\frac{\\sqrt{3}}{2}', arcsin: '\\frac{\\pi}{3}', answer: 'x = (-1)^n \\frac{\\pi}{3} + \\pi n, \\, n \\in \\mathbb{Z}' }
    ];

    const selected = values[Math.floor(Math.random() * values.length)];
    const wrongAnswers = generateWrongAnswers(selected.answer, 'sin');

    return {
        question: `\\sin x = ${selected.a}`,
        correctAnswer: selected.answer,
        answers: shuffleArray([selected.answer, ...wrongAnswers]),
        explanation: `\\arcsin(${selected.a}) = ${selected.arcsin}`
    };
}

function generateCosEquation() {
    const values = [
        { a: '0', arccos: '\\frac{\\pi}{2}', answer: 'x = \\frac{\\pi}{2} + \\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '1', arccos: '0', answer: 'x = 2\\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '-1', arccos: '\\pi', answer: 'x = \\pi + 2\\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '\\frac{1}{2}', arccos: '\\frac{\\pi}{3}', answer: 'x = \\pm\\frac{\\pi}{3} + 2\\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '-\\frac{1}{2}', arccos: '\\frac{2\\pi}{3}', answer: 'x = \\pm\\frac{2\\pi}{3} + 2\\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '\\frac{\\sqrt{2}}{2}', arccos: '\\frac{\\pi}{4}', answer: 'x = \\pm\\frac{\\pi}{4} + 2\\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '\\frac{\\sqrt{3}}{2}', arccos: '\\frac{\\pi}{6}', answer: 'x = \\pm\\frac{\\pi}{6} + 2\\pi n, \\, n \\in \\mathbb{Z}' }
    ];

    const selected = values[Math.floor(Math.random() * values.length)];
    const wrongAnswers = generateWrongAnswers(selected.answer, 'cos');

    return {
        question: `\\cos x = ${selected.a}`,
        correctAnswer: selected.answer,
        answers: shuffleArray([selected.answer, ...wrongAnswers]),
        explanation: `\\arccos(${selected.a}) = ${selected.arccos}`
    };
}

function generateTanEquation() {
    const values = [
        { a: '0', arctan: '0', answer: 'x = \\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '1', arctan: '\\frac{\\pi}{4}', answer: 'x = \\frac{\\pi}{4} + \\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '-1', arctan: '-\\frac{\\pi}{4}', answer: 'x = -\\frac{\\pi}{4} + \\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '\\sqrt{3}', arctan: '\\frac{\\pi}{3}', answer: 'x = \\frac{\\pi}{3} + \\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '-\\sqrt{3}', arctan: '-\\frac{\\pi}{3}', answer: 'x = -\\frac{\\pi}{3} + \\pi n, \\, n \\in \\mathbb{Z}' },
        { a: '\\frac{\\sqrt{3}}{3}', arctan: '\\frac{\\pi}{6}', answer: 'x = \\frac{\\pi}{6} + \\pi n, \\, n \\in \\mathbb{Z}' }
    ];

    const selected = values[Math.floor(Math.random() * values.length)];
    const wrongAnswers = generateWrongAnswers(selected.answer, 'tan');

    return {
        question: `\\mathrm{tg}\\, x = ${selected.a}`,
        correctAnswer: selected.answer,
        answers: shuffleArray([selected.answer, ...wrongAnswers]),
        explanation: `\\mathrm{arctg}(${selected.a}) = ${selected.arctan}`
    };
}

function generateSpecialCase() {
    const cases = [
        {
            question: '\\sin x = 0',
            answer: 'x = \\pi n',
            wrong: ['x = \\frac{\\pi}{2} + \\pi n', 'x = 2\\pi n', 'x = \\frac{\\pi n}{2}'],
            explanation: 'Синус дорівнює 0 в точках 0, \\pi, 2\\pi, ...'
        },
        {
            question: '\\cos x = 0',
            answer: 'x = \\frac{\\pi}{2} + \\pi n',
            wrong: ['x = \\pi n', 'x = 2\\pi n', 'x = \\frac{\\pi}{4} + \\pi n'],
            explanation: 'Косинус дорівнює 0 в точках \\frac{\\pi}{2}, \\frac{3\\pi}{2}, ...'
        },
        {
            question: '\\sin x = 1',
            answer: 'x = \\frac{\\pi}{2} + 2\\pi n',
            wrong: ['x = \\pi n', 'x = \\frac{\\pi}{2} + \\pi n', 'x = 2\\pi n'],
            explanation: 'Синус дорівнює 1 тільки в точці \\frac{\\pi}{2}'
        },
        {
            question: '\\cos x = 1',
            answer: 'x = 2\\pi n',
            wrong: ['x = \\pi n', 'x = \\frac{\\pi}{2} + 2\\pi n', 'x = \\pi + 2\\pi n'],
            explanation: 'Косинус дорівнює 1 тільки в точці 0'
        },
        {
            question: '\\sin x = -1',
            answer: 'x = -\\frac{\\pi}{2} + 2\\pi n',
            wrong: ['x = \\frac{\\pi}{2} + 2\\pi n', 'x = \\pi + 2\\pi n', 'x = -\\pi n'],
            explanation: 'Синус дорівнює -1 тільки в точці -\\frac{\\pi}{2}'
        },
        {
            question: '\\cos x = -1',
            answer: 'x = \\pi + 2\\pi n',
            wrong: ['x = 2\\pi n', 'x = -\\pi n', 'x = \\frac{\\pi}{2} + \\pi n'],
            explanation: 'Косинус дорівнює -1 тільки в точці \\pi'
        }
    ];

    const selected = cases[Math.floor(Math.random() * cases.length)];

    return {
        question: selected.question,
        correctAnswer: selected.answer,
        answers: shuffleArray([selected.answer, ...selected.wrong]),
        explanation: selected.explanation
    };
}

function generateRootsCount() {
    const problems = [
        {
            question: '\\text{Скільки коренів має рівняння } \\sin x = \\frac{1}{2} \\text{ на } [0; 2\\pi]?',
            answer: '2',
            wrong: ['1', '3', '4'],
            explanation: 'x = \\frac{\\pi}{6} \\text{ і } x = \\frac{5\\pi}{6}'
        },
        {
            question: '\\text{Скільки коренів має рівняння } \\cos x = 0 \\text{ на } [0; 2\\pi]?',
            answer: '2',
            wrong: ['1', '3', '4'],
            explanation: 'x = \\frac{\\pi}{2} \\text{ і } x = \\frac{3\\pi}{2}'
        },
        {
            question: '\\text{Скільки коренів має рівняння } \\sin x = 0 \\text{ на } [0; 2\\pi]?',
            answer: '3',
            wrong: ['1', '2', '4'],
            explanation: 'x = 0, \\pi, 2\\pi'
        },
        {
            question: '\\text{Скільки коренів має рівняння } \\cos x = 1 \\text{ на } [0; 2\\pi]?',
            answer: '2',
            wrong: ['1', '3', '0'],
            explanation: 'x = 0 \\text{ і } x = 2\\pi'
        },
        {
            question: '\\text{Скільки коренів має рівняння } \\sin x = 1 \\text{ на } [0; 2\\pi]?',
            answer: '1',
            wrong: ['2', '3', '0'],
            explanation: 'x = \\frac{\\pi}{2}'
        },
        {
            question: '\\text{Скільки коренів має рівняння } \\mathrm{tg}\\, x = 1 \\text{ на } [0; 2\\pi]?',
            answer: '2',
            wrong: ['1', '3', '4'],
            explanation: 'x = \\frac{\\pi}{4} \\text{ і } x = \\frac{5\\pi}{4}'
        },
        {
            question: '\\text{Скільки коренів має рівняння } \\cos x = -\\frac{1}{2} \\text{ на } [0; 2\\pi]?',
            answer: '2',
            wrong: ['1', '3', '4'],
            explanation: 'x = \\frac{2\\pi}{3} \\text{ і } x = \\frac{4\\pi}{3}'
        },
        {
            question: '\\text{Скільки коренів має рівняння } \\sin x = 2 \\text{ на } [0; 2\\pi]?',
            answer: '0',
            wrong: ['1', '2', '4'],
            explanation: '|\\sin x| \\leq 1, \\text{ тому розв\'язків немає}'
        }
    ];

    const selected = problems[Math.floor(Math.random() * problems.length)];

    return {
        question: selected.question,
        correctAnswer: selected.answer,
        answers: shuffleArray([selected.answer, ...selected.wrong]),
        explanation: selected.explanation
    };
}

function generateWrongAnswers(correct, type) {
    const wrongPool = {
        sin: [
            'x = \\pi n, \\, n \\in \\mathbb{Z}',
            'x = \\frac{\\pi}{2} + \\pi n, \\, n \\in \\mathbb{Z}',
            'x = (-1)^n \\frac{\\pi}{4} + \\pi n, \\, n \\in \\mathbb{Z}',
            'x = (-1)^n \\frac{\\pi}{3} + \\pi n, \\, n \\in \\mathbb{Z}',
            'x = (-1)^n \\frac{\\pi}{6} + \\pi n, \\, n \\in \\mathbb{Z}',
            'x = \\frac{\\pi}{4} + 2\\pi n, \\, n \\in \\mathbb{Z}',
            'x = \\pm\\frac{\\pi}{3} + 2\\pi n, \\, n \\in \\mathbb{Z}'
        ],
        cos: [
            'x = 2\\pi n, \\, n \\in \\mathbb{Z}',
            'x = \\frac{\\pi}{2} + \\pi n, \\, n \\in \\mathbb{Z}',
            'x = \\pm\\frac{\\pi}{4} + 2\\pi n, \\, n \\in \\mathbb{Z}',
            'x = \\pm\\frac{\\pi}{3} + 2\\pi n, \\, n \\in \\mathbb{Z}',
            'x = \\pm\\frac{\\pi}{6} + 2\\pi n, \\, n \\in \\mathbb{Z}',
            'x = \\pi + 2\\pi n, \\, n \\in \\mathbb{Z}',
            'x = (-1)^n \\frac{\\pi}{4} + \\pi n, \\, n \\in \\mathbb{Z}'
        ],
        tan: [
            'x = \\pi n, \\, n \\in \\mathbb{Z}',
            'x = \\frac{\\pi}{4} + \\pi n, \\, n \\in \\mathbb{Z}',
            'x = \\frac{\\pi}{3} + \\pi n, \\, n \\in \\mathbb{Z}',
            'x = \\frac{\\pi}{6} + \\pi n, \\, n \\in \\mathbb{Z}',
            'x = -\\frac{\\pi}{4} + \\pi n, \\, n \\in \\mathbb{Z}',
            'x = \\frac{\\pi}{2} + \\pi n, \\, n \\in \\mathbb{Z}',
            'x = \\pm\\frac{\\pi}{4} + 2\\pi n, \\, n \\in \\mathbb{Z}'
        ]
    };

    const pool = wrongPool[type] || wrongPool.sin;
    const filtered = pool.filter(w => w !== correct);
    return shuffleArray(filtered).slice(0, 3);
}

function displayQuestion(q) {
    // Render question
    const questionEl = document.getElementById('questionText');
    katex.render(q.question, questionEl, { throwOnError: false, displayMode: true });

    // Render answers
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';

    const letters = ['А', 'Б', 'В', 'Г'];
    q.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.dataset.answer = answer;
        btn.dataset.correct = (answer === q.correctAnswer).toString();

        btn.innerHTML = `
            <span class="answer-letter">${letters[index]}</span>
            <span class="answer-text"></span>
        `;

        const answerText = btn.querySelector('.answer-text');
        katex.render(answer, answerText, { throwOnError: false });

        btn.addEventListener('click', () => handleAnswer(btn, q));
        container.appendChild(btn);
    });
}

function handleAnswer(btn, question) {
    if (answered) return;
    answered = true;

    const isCorrect = btn.dataset.correct === 'true';

    // Disable all buttons
    document.querySelectorAll('.answer-btn').forEach(b => {
        b.classList.add('disabled');
        if (b.dataset.correct === 'true') {
            b.classList.add('correct');
        }
    });

    if (!isCorrect) {
        btn.classList.add('incorrect');
        wrongCount++;
    } else {
        correctCount++;
    }

    // Update stats
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('wrongCount').textContent = wrongCount;

    // Show feedback
    const feedbackContainer = document.getElementById('feedbackContainer');
    feedbackContainer.classList.add('show');
    feedbackContainer.classList.add(isCorrect ? 'correct' : 'incorrect');

    document.getElementById('feedbackIcon').textContent = isCorrect ? '✅' : '❌';
    document.getElementById('feedbackText').textContent = isCorrect ? 'Правильно!' : 'Неправильно';

    const explanationEl = document.getElementById('feedbackExplanation');
    if (question.explanation) {
        katex.render(question.explanation, explanationEl, { throwOnError: false });
    } else {
        explanationEl.textContent = '';
    }

    // Show next button
    document.getElementById('nextBtn').classList.remove('hidden');
}

function nextQuestion() {
    if (currentQuestion >= TOTAL_QUESTIONS) {
        showResults();
    } else {
        generateQuestion();
    }
}

function showResults() {
    const accuracy = Math.round((correctCount / TOTAL_QUESTIONS) * 100);

    document.getElementById('finalCorrect').textContent = correctCount;
    document.getElementById('finalWrong').textContent = wrongCount;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';

    // Set emoji based on score
    let emoji = '😢';
    let title = 'Потрібно ще попрактикуватись';
    if (accuracy >= 90) {
        emoji = '🏆';
        title = 'Відмінно!';
    } else if (accuracy >= 70) {
        emoji = '🎉';
        title = 'Молодець!';
    } else if (accuracy >= 50) {
        emoji = '👍';
        title = 'Непогано!';
    }

    document.getElementById('resultsIcon').textContent = emoji;
    document.getElementById('resultsTitle').textContent = title;

    showScreen('results');
}

// ========== HELPERS ==========
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
