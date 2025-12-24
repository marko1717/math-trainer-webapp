// Trig Formulas Trainer - Addition formulas and double angle

const QUESTIONS_PER_ROUND = 10;

// Question generators for each topic
const questionGenerators = {
    addition: [
        // sin(α + β)
        () => {
            const formula = 'sin(\\alpha + \\beta)';
            return {
                question: `Чому дорівнює ${formula}?`,
                answers: [
                    'sin\\alpha \\cdot cos\\beta + cos\\alpha \\cdot sin\\beta',
                    'sin\\alpha \\cdot cos\\beta - cos\\alpha \\cdot sin\\beta',
                    'cos\\alpha \\cdot cos\\beta - sin\\alpha \\cdot sin\\beta',
                    'cos\\alpha \\cdot cos\\beta + sin\\alpha \\cdot sin\\beta'
                ],
                correct: 0,
                explanation: 'Формула синуса суми: sin(α+β) = sinα·cosβ + cosα·sinβ',
                formula: 'sin(\\alpha + \\beta) = sin\\alpha \\cdot cos\\beta + cos\\alpha \\cdot sin\\beta',
                topic: 'Формули додавання'
            };
        },
        // sin(α - β)
        () => {
            const formula = 'sin(\\alpha - \\beta)';
            return {
                question: `Чому дорівнює ${formula}?`,
                answers: [
                    'sin\\alpha \\cdot cos\\beta - cos\\alpha \\cdot sin\\beta',
                    'sin\\alpha \\cdot cos\\beta + cos\\alpha \\cdot sin\\beta',
                    'cos\\alpha \\cdot cos\\beta + sin\\alpha \\cdot sin\\beta',
                    'cos\\alpha \\cdot cos\\beta - sin\\alpha \\cdot sin\\beta'
                ],
                correct: 0,
                explanation: 'Формула синуса різниці: sin(α-β) = sinα·cosβ - cosα·sinβ',
                formula: 'sin(\\alpha - \\beta) = sin\\alpha \\cdot cos\\beta - cos\\alpha \\cdot sin\\beta',
                topic: 'Формули додавання'
            };
        },
        // cos(α + β)
        () => {
            const formula = 'cos(\\alpha + \\beta)';
            return {
                question: `Чому дорівнює ${formula}?`,
                answers: [
                    'cos\\alpha \\cdot cos\\beta - sin\\alpha \\cdot sin\\beta',
                    'cos\\alpha \\cdot cos\\beta + sin\\alpha \\cdot sin\\beta',
                    'sin\\alpha \\cdot cos\\beta + cos\\alpha \\cdot sin\\beta',
                    'sin\\alpha \\cdot cos\\beta - cos\\alpha \\cdot sin\\beta'
                ],
                correct: 0,
                explanation: 'Формула косинуса суми: cos(α+β) = cosα·cosβ - sinα·sinβ',
                formula: 'cos(\\alpha + \\beta) = cos\\alpha \\cdot cos\\beta - sin\\alpha \\cdot sin\\beta',
                topic: 'Формули додавання'
            };
        },
        // cos(α - β)
        () => {
            const formula = 'cos(\\alpha - \\beta)';
            return {
                question: `Чому дорівнює ${formula}?`,
                answers: [
                    'cos\\alpha \\cdot cos\\beta + sin\\alpha \\cdot sin\\beta',
                    'cos\\alpha \\cdot cos\\beta - sin\\alpha \\cdot sin\\beta',
                    'sin\\alpha \\cdot cos\\beta - cos\\alpha \\cdot sin\\beta',
                    'sin\\alpha \\cdot cos\\beta + cos\\alpha \\cdot sin\\beta'
                ],
                correct: 0,
                explanation: 'Формула косинуса різниці: cos(α-β) = cosα·cosβ + sinα·sinβ',
                formula: 'cos(\\alpha - \\beta) = cos\\alpha \\cdot cos\\beta + sin\\alpha \\cdot sin\\beta',
                topic: 'Формули додавання'
            };
        },
        // sin(α+β) reverse - find the sum
        () => ({
            question: 'Який вираз дорівнює sin α · cos β + cos α · sin β?',
            answers: [
                'sin(\\alpha + \\beta)',
                'sin(\\alpha - \\beta)',
                'cos(\\alpha + \\beta)',
                'cos(\\alpha - \\beta)'
            ],
            correct: 0,
            explanation: 'sinα·cosβ + cosα·sinβ = sin(α+β)',
            formula: 'sin\\alpha \\cdot cos\\beta + cos\\alpha \\cdot sin\\beta = sin(\\alpha + \\beta)',
            topic: 'Формули додавання'
        }),
        // cos(α+β) reverse - find the sum
        () => ({
            question: 'Який вираз дорівнює cos α · cos β - sin α · sin β?',
            answers: [
                'cos(\\alpha + \\beta)',
                'cos(\\alpha - \\beta)',
                'sin(\\alpha + \\beta)',
                'sin(\\alpha - \\beta)'
            ],
            correct: 0,
            explanation: 'cosα·cosβ - sinα·sinβ = cos(α+β)',
            formula: 'cos\\alpha \\cdot cos\\beta - sin\\alpha \\cdot sin\\beta = cos(\\alpha + \\beta)',
            topic: 'Формули додавання'
        }),
        // sin(α-β) reverse
        () => ({
            question: 'Який вираз дорівнює sin α · cos β - cos α · sin β?',
            answers: [
                'sin(\\alpha - \\beta)',
                'sin(\\alpha + \\beta)',
                'cos(\\alpha - \\beta)',
                'cos(\\alpha + \\beta)'
            ],
            correct: 0,
            explanation: 'sinα·cosβ - cosα·sinβ = sin(α-β)',
            formula: 'sin\\alpha \\cdot cos\\beta - cos\\alpha \\cdot sin\\beta = sin(\\alpha - \\beta)',
            topic: 'Формули додавання'
        }),
        // cos(α-β) reverse
        () => ({
            question: 'Який вираз дорівнює cos α · cos β + sin α · sin β?',
            answers: [
                'cos(\\alpha - \\beta)',
                'cos(\\alpha + \\beta)',
                'sin(\\alpha - \\beta)',
                'sin(\\alpha + \\beta)'
            ],
            correct: 0,
            explanation: 'cosα·cosβ + sinα·sinβ = cos(α-β)',
            formula: 'cos\\alpha \\cdot cos\\beta + sin\\alpha \\cdot sin\\beta = cos(\\alpha - \\beta)',
            topic: 'Формули додавання'
        })
    ],
    double: [
        // sin 2α
        () => ({
            question: 'Чому дорівнює sin 2α?',
            answers: [
                '2 sin\\alpha \\cdot cos\\alpha',
                'sin^2\\alpha + cos^2\\alpha',
                'cos^2\\alpha - sin^2\\alpha',
                '2 sin^2\\alpha'
            ],
            correct: 0,
            explanation: 'Формула синуса подвійного кута: sin 2α = 2 sinα · cosα',
            formula: 'sin 2\\alpha = 2 sin\\alpha \\cdot cos\\alpha',
            topic: 'Подвійний кут'
        }),
        // cos 2α (main)
        () => ({
            question: 'Яка основна формула cos 2α?',
            answers: [
                'cos^2\\alpha - sin^2\\alpha',
                '2 cos^2\\alpha - 1',
                '1 - 2 sin^2\\alpha',
                '2 sin\\alpha \\cdot cos\\alpha'
            ],
            correct: 0,
            explanation: 'Основна формула косинуса подвійного кута: cos 2α = cos²α - sin²α',
            formula: 'cos 2\\alpha = cos^2\\alpha - sin^2\\alpha',
            topic: 'Подвійний кут'
        }),
        // cos 2α through cos
        () => ({
            question: 'Виразіть cos 2α через cos α:',
            answers: [
                '2 cos^2\\alpha - 1',
                'cos^2\\alpha - sin^2\\alpha',
                '1 - 2 cos^2\\alpha',
                '2 cos\\alpha - 1'
            ],
            correct: 0,
            explanation: 'cos 2α = cos²α - sin²α = cos²α - (1 - cos²α) = 2cos²α - 1',
            formula: 'cos 2\\alpha = 2 cos^2\\alpha - 1',
            topic: 'Подвійний кут'
        }),
        // cos 2α through sin
        () => ({
            question: 'Виразіть cos 2α через sin α:',
            answers: [
                '1 - 2 sin^2\\alpha',
                '2 sin^2\\alpha - 1',
                'cos^2\\alpha - sin^2\\alpha',
                '1 - sin^2\\alpha'
            ],
            correct: 0,
            explanation: 'cos 2α = cos²α - sin²α = (1 - sin²α) - sin²α = 1 - 2sin²α',
            formula: 'cos 2\\alpha = 1 - 2 sin^2\\alpha',
            topic: 'Подвійний кут'
        }),
        // sin 2α reverse
        () => ({
            question: 'Який вираз дорівнює 2 sin α · cos α?',
            answers: [
                'sin 2\\alpha',
                'cos 2\\alpha',
                'sin^2\\alpha',
                'cos^2\\alpha'
            ],
            correct: 0,
            explanation: '2sinα·cosα = sin 2α',
            formula: '2 sin\\alpha \\cdot cos\\alpha = sin 2\\alpha',
            topic: 'Подвійний кут'
        }),
        // cos 2α reverse (cos²-sin²)
        () => ({
            question: 'Який вираз дорівнює cos²α - sin²α?',
            answers: [
                'cos 2\\alpha',
                'sin 2\\alpha',
                '1',
                '0'
            ],
            correct: 0,
            explanation: 'cos²α - sin²α = cos 2α',
            formula: 'cos^2\\alpha - sin^2\\alpha = cos 2\\alpha',
            topic: 'Подвійний кут'
        }),
        // Express sin²α through cos 2α
        () => ({
            question: 'Виразіть sin²α через cos 2α:',
            answers: [
                '\\frac{1 - cos 2\\alpha}{2}',
                '\\frac{1 + cos 2\\alpha}{2}',
                '\\frac{cos 2\\alpha - 1}{2}',
                '1 - cos 2\\alpha'
            ],
            correct: 0,
            explanation: 'З формули cos 2α = 1 - 2sin²α випливає: sin²α = (1 - cos 2α)/2',
            formula: 'sin^2\\alpha = \\frac{1 - cos 2\\alpha}{2}',
            topic: 'Подвійний кут'
        }),
        // Express cos²α through cos 2α
        () => ({
            question: 'Виразіть cos²α через cos 2α:',
            answers: [
                '\\frac{1 + cos 2\\alpha}{2}',
                '\\frac{1 - cos 2\\alpha}{2}',
                '\\frac{cos 2\\alpha + 1}{4}',
                'cos 2\\alpha - 1'
            ],
            correct: 0,
            explanation: 'З формули cos 2α = 2cos²α - 1 випливає: cos²α = (1 + cos 2α)/2',
            formula: 'cos^2\\alpha = \\frac{1 + cos 2\\alpha}{2}',
            topic: 'Подвійний кут'
        })
    ],
    reduction: [
        // sin(90° - α)
        () => ({
            question: 'Чому дорівнює sin(90° - α)?',
            answers: [
                'cos\\alpha',
                'sin\\alpha',
                '-cos\\alpha',
                '-sin\\alpha'
            ],
            correct: 0,
            explanation: 'sin(90° - α) = cosα — функція змінюється на кофункцію',
            formula: 'sin(90° - \\alpha) = cos\\alpha',
            topic: 'Формули зведення'
        }),
        // cos(90° - α)
        () => ({
            question: 'Чому дорівнює cos(90° - α)?',
            answers: [
                'sin\\alpha',
                'cos\\alpha',
                '-sin\\alpha',
                '-cos\\alpha'
            ],
            correct: 0,
            explanation: 'cos(90° - α) = sinα — функція змінюється на кофункцію',
            formula: 'cos(90° - \\alpha) = sin\\alpha',
            topic: 'Формули зведення'
        }),
        // sin(90° + α)
        () => ({
            question: 'Чому дорівнює sin(90° + α)?',
            answers: [
                'cos\\alpha',
                '-cos\\alpha',
                'sin\\alpha',
                '-sin\\alpha'
            ],
            correct: 0,
            explanation: 'sin(90° + α) = cosα — функція змінюється, знак зберігається (I чверть)',
            formula: 'sin(90° + \\alpha) = cos\\alpha',
            topic: 'Формули зведення'
        }),
        // cos(90° + α)
        () => ({
            question: 'Чому дорівнює cos(90° + α)?',
            answers: [
                '-sin\\alpha',
                'sin\\alpha',
                'cos\\alpha',
                '-cos\\alpha'
            ],
            correct: 0,
            explanation: 'cos(90° + α) = -sinα — функція змінюється, знак змінюється (II чверть для cos)',
            formula: 'cos(90° + \\alpha) = -sin\\alpha',
            topic: 'Формули зведення'
        }),
        // sin(180° - α)
        () => ({
            question: 'Чому дорівнює sin(180° - α)?',
            answers: [
                'sin\\alpha',
                '-sin\\alpha',
                'cos\\alpha',
                '-cos\\alpha'
            ],
            correct: 0,
            explanation: 'sin(180° - α) = sinα — функція не змінюється, знак зберігається (II чверть)',
            formula: 'sin(180° - \\alpha) = sin\\alpha',
            topic: 'Формули зведення'
        }),
        // cos(180° - α)
        () => ({
            question: 'Чому дорівнює cos(180° - α)?',
            answers: [
                '-cos\\alpha',
                'cos\\alpha',
                'sin\\alpha',
                '-sin\\alpha'
            ],
            correct: 0,
            explanation: 'cos(180° - α) = -cosα — функція не змінюється, знак змінюється (II чверть)',
            formula: 'cos(180° - \\alpha) = -cos\\alpha',
            topic: 'Формули зведення'
        }),
        // sin(180° + α)
        () => ({
            question: 'Чому дорівнює sin(180° + α)?',
            answers: [
                '-sin\\alpha',
                'sin\\alpha',
                '-cos\\alpha',
                'cos\\alpha'
            ],
            correct: 0,
            explanation: 'sin(180° + α) = -sinα — функція не змінюється, знак змінюється (III чверть)',
            formula: 'sin(180° + \\alpha) = -sin\\alpha',
            topic: 'Формули зведення'
        }),
        // cos(180° + α)
        () => ({
            question: 'Чому дорівнює cos(180° + α)?',
            answers: [
                '-cos\\alpha',
                'cos\\alpha',
                '-sin\\alpha',
                'sin\\alpha'
            ],
            correct: 0,
            explanation: 'cos(180° + α) = -cosα — функція не змінюється, знак змінюється (III чверть)',
            formula: 'cos(180° + \\alpha) = -cos\\alpha',
            topic: 'Формули зведення'
        }),
        // sin(270° - α)
        () => ({
            question: 'Чому дорівнює sin(270° - α)?',
            answers: [
                '-cos\\alpha',
                'cos\\alpha',
                '-sin\\alpha',
                'sin\\alpha'
            ],
            correct: 0,
            explanation: 'sin(270° - α) = -cosα — функція змінюється, знак змінюється (III чверть)',
            formula: 'sin(270° - \\alpha) = -cos\\alpha',
            topic: 'Формули зведення'
        }),
        // cos(270° - α)
        () => ({
            question: 'Чому дорівнює cos(270° - α)?',
            answers: [
                '-sin\\alpha',
                'sin\\alpha',
                '-cos\\alpha',
                'cos\\alpha'
            ],
            correct: 0,
            explanation: 'cos(270° - α) = -sinα — функція змінюється, знак змінюється (III чверть)',
            formula: 'cos(270° - \\alpha) = -sin\\alpha',
            topic: 'Формули зведення'
        }),
        // sin(360° - α)
        () => ({
            question: 'Чому дорівнює sin(360° - α)?',
            answers: [
                '-sin\\alpha',
                'sin\\alpha',
                'cos\\alpha',
                '-cos\\alpha'
            ],
            correct: 0,
            explanation: 'sin(360° - α) = -sinα — функція не змінюється, знак змінюється (IV чверть)',
            formula: 'sin(360° - \\alpha) = -sin\\alpha',
            topic: 'Формули зведення'
        }),
        // cos(360° - α)
        () => ({
            question: 'Чому дорівнює cos(360° - α)?',
            answers: [
                'cos\\alpha',
                '-cos\\alpha',
                'sin\\alpha',
                '-sin\\alpha'
            ],
            correct: 0,
            explanation: 'cos(360° - α) = cosα — функція не змінюється, знак зберігається (IV чверть)',
            formula: 'cos(360° - \\alpha) = cos\\alpha',
            topic: 'Формули зведення'
        })
    ]
};

// State
let currentTopic = 'addition';
let questions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let answered = false;

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    result: document.getElementById('resultScreen')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    renderFormulas();
});

function initEventListeners() {
    // Topic selection
    document.querySelectorAll('.btn-topic').forEach(btn => {
        btn.addEventListener('click', () => {
            currentTopic = btn.dataset.topic;
            startGame();
        });
    });

    // Back button
    document.getElementById('backBtn').addEventListener('click', () => {
        showScreen('start');
    });

    // Next button
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);

    // Hint button
    document.getElementById('hintBtn').addEventListener('click', showHint);

    // Formula button
    document.getElementById('formulaBtn').addEventListener('click', () => {
        document.getElementById('formulaModal').classList.remove('hidden');
    });

    // Formula modal close
    document.getElementById('formulaCloseBtn').addEventListener('click', () => {
        document.getElementById('formulaModal').classList.add('hidden');
    });

    // AI Help button
    document.getElementById('aiHelpBtn').addEventListener('click', showAIHelp);
    document.getElementById('aiCloseBtn').addEventListener('click', () => {
        document.getElementById('aiHelperModal').classList.add('hidden');
    });

    // Result buttons
    document.getElementById('restartBtn').addEventListener('click', () => {
        startGame();
    });

    document.getElementById('menuBtn').addEventListener('click', () => {
        showScreen('start');
    });

    document.getElementById('resultBackBtn').addEventListener('click', () => {
        showScreen('start');
    });
}

function renderFormulas() {
    const formulas = [
        ['f1', 'sin(\\alpha + \\beta) = sin\\alpha \\cdot cos\\beta + cos\\alpha \\cdot sin\\beta'],
        ['f2', 'sin(\\alpha - \\beta) = sin\\alpha \\cdot cos\\beta - cos\\alpha \\cdot sin\\beta'],
        ['f3', 'cos(\\alpha + \\beta) = cos\\alpha \\cdot cos\\beta - sin\\alpha \\cdot sin\\beta'],
        ['f4', 'cos(\\alpha - \\beta) = cos\\alpha \\cdot cos\\beta + sin\\alpha \\cdot sin\\beta'],
        ['f5', 'sin 2\\alpha = 2 sin\\alpha \\cdot cos\\alpha'],
        ['f6', 'cos 2\\alpha = cos^2\\alpha - sin^2\\alpha'],
        ['f7', 'cos 2\\alpha = 2cos^2\\alpha - 1 = 1 - 2sin^2\\alpha'],
        ['f8', 'sin(90° - \\alpha) = cos\\alpha'],
        ['f9', 'cos(90° - \\alpha) = sin\\alpha'],
        ['f10', 'sin(180° - \\alpha) = sin\\alpha'],
        ['f11', 'cos(180° - \\alpha) = -cos\\alpha']
    ];

    formulas.forEach(([id, formula]) => {
        const el = document.getElementById(id);
        if (el) {
            katex.render(formula, el, { throwOnError: false });
        }
    });
}

function startGame() {
    // Reset state
    currentQuestionIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    answered = false;

    // Generate questions
    questions = generateQuestions(currentTopic);

    // Update UI
    updateTopicTitle();
    document.getElementById('correct').textContent = '0';
    document.getElementById('wrong').textContent = '0';

    showScreen('game');
    loadQuestion();
}

function generateQuestions(topic) {
    let generators = [];

    if (topic === 'mixed') {
        generators = [
            ...questionGenerators.addition,
            ...questionGenerators.double,
            ...questionGenerators.reduction
        ];
    } else {
        generators = questionGenerators[topic] || [];
    }

    // Shuffle and pick
    const shuffled = [...generators].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, QUESTIONS_PER_ROUND);

    return selected.map(gen => gen());
}

function updateTopicTitle() {
    const titles = {
        addition: 'Формули додавання',
        double: 'Подвійний кут',
        reduction: 'Формули зведення',
        mixed: 'Всі формули'
    };
    document.getElementById('topicTitle').textContent = titles[currentTopic] || 'Формули';
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    answered = false;

    // Update progress
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('questionNumber').textContent = `Питання ${currentQuestionIndex + 1} / ${questions.length}`;
    document.getElementById('questionType').textContent = question.topic;

    // Render question with KaTeX
    const questionText = document.getElementById('questionText');
    questionText.innerHTML = question.question;
    renderMath(questionText);

    // Generate shuffled answers
    const answerIndices = question.answers.map((_, i) => i);
    shuffleArray(answerIndices);

    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    const letters = ['А', 'Б', 'В', 'Г'];
    answerIndices.forEach((originalIndex, displayIndex) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.dataset.index = originalIndex;
        btn.innerHTML = `
            <span class="answer-letter">${letters[displayIndex]}</span>
            <span class="answer-text"></span>
        `;
        answersContainer.appendChild(btn);

        const answerTextEl = btn.querySelector('.answer-text');
        katex.render(question.answers[originalIndex], answerTextEl, { throwOnError: false });

        btn.addEventListener('click', () => selectAnswer(originalIndex));
    });

    // Hide feedback and next button
    document.getElementById('feedback').classList.remove('show', 'correct', 'incorrect');
    document.getElementById('nextBtn').style.display = 'none';
}

function selectAnswer(index) {
    if (answered) return;
    answered = true;

    const question = questions[currentQuestionIndex];
    const isCorrect = index === question.correct;

    if (isCorrect) {
        correctCount++;
        document.getElementById('correct').textContent = correctCount;
    } else {
        wrongCount++;
        document.getElementById('wrong').textContent = wrongCount;
    }

    // Highlight answers
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
        btn.classList.add('disabled');
        const btnIndex = parseInt(btn.dataset.index);
        if (btnIndex === question.correct) {
            btn.classList.add('correct');
        } else if (btnIndex === index) {
            btn.classList.add('incorrect');
        }
    });

    // Show feedback
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = `
        <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
        <div class="feedback-text">${isCorrect ? 'Правильно!' : 'Неправильно'}</div>
        <div class="feedback-explanation">${question.explanation}</div>
        <div class="feedback-formula" id="feedbackFormula"></div>
    `;
    feedback.classList.add('show', isCorrect ? 'correct' : 'incorrect');

    katex.render(question.formula, document.getElementById('feedbackFormula'), {
        throwOnError: false,
        displayMode: true
    });

    // Show next button
    document.getElementById('nextBtn').style.display = 'block';
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
        showResults();
    } else {
        loadQuestion();
    }
}

function showHint() {
    const question = questions[currentQuestionIndex];
    const hints = {
        addition: 'Запамʼятай: sin(α±β) - різні знаки в результаті, cos(α±β) - однакові!',
        double: 'sin 2α = 2sinα·cosα, а для cos 2α є три форми!',
        reduction: '90° або 270° — функція змінюється (sin↔cos). 180° або 360° — функція не змінюється. Знак визначаємо за чвертю!'
    };

    const topicKey = question.topic.includes('додавання') ? 'addition' :
                     question.topic.includes('Подвійний') ? 'double' : 'reduction';

    alert(hints[topicKey] || 'Подивись на формули!');
}

function showResults() {
    const total = questions.length;
    const accuracy = Math.round((correctCount / total) * 100);

    document.getElementById('finalCorrect').textContent = correctCount;
    document.getElementById('finalWrong').textContent = wrongCount;
    document.getElementById('finalAccuracy').textContent = `${accuracy}%`;

    let icon, title;
    if (accuracy >= 90) {
        icon = '🏆';
        title = 'Відмінно!';
    } else if (accuracy >= 70) {
        icon = '🎉';
        title = 'Чудова робота!';
    } else if (accuracy >= 50) {
        icon = '📚';
        title = 'Потрібна практика';
    } else {
        icon = '💪';
        title = 'Не здавайся!';
    }

    document.getElementById('resultIcon').textContent = icon;
    document.getElementById('resultTitle').textContent = title;

    showScreen('result');
}

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
}

function renderMath(element) {
    const text = element.innerHTML;
    if (text.includes('\\') || text.includes('$')) {
        try {
            katex.render(text.replace(/\$/g, ''), element, { throwOnError: false });
        } catch (e) {
            // Keep original text
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// AI Help function
function showAIHelp() {
    const modal = document.getElementById('aiHelperModal');
    const loading = document.getElementById('aiLoading');
    const response = document.getElementById('aiResponse');

    modal.classList.remove('hidden');
    loading.style.display = 'block';
    response.style.display = 'none';

    const question = questions[currentQuestionIndex];

    // Generate contextual help based on topic
    setTimeout(() => {
        loading.style.display = 'none';
        response.style.display = 'block';

        const hints = {
            'Формули додавання': `
                <p><strong>Формули додавання</strong> — це основні формули для обчислення синуса та косинуса суми/різниці кутів.</p>
                <p>🔑 <strong>Ключ до запам'ятовування:</strong></p>
                <p>• <em>sin(α±β)</em> — завжди sinα·cosβ ± cosα·sinβ (різні функції!)</p>
                <p>• <em>cos(α±β)</em> — завжди cosα·cosβ ∓ sinα·sinβ (однакові функції!)</p>
                <p>💡 Для косинуса знак протилежний: cos(α+β) має мінус, cos(α-β) має плюс!</p>
            `,
            'Подвійний кут': `
                <p><strong>Подвійний кут</strong> — формули для sin 2α та cos 2α.</p>
                <p>🔑 <strong>Основні формули:</strong></p>
                <p>• sin 2α = 2·sinα·cosα</p>
                <p>• cos 2α = cos²α - sin²α = 2cos²α - 1 = 1 - 2sin²α</p>
                <p>💡 Три форми для cos 2α зручні для різних задач — вибирай ту, де менше невідомих!</p>
            `,
            'Формули зведення': `
                <p><strong>Формули зведення</strong> — дозволяють звести функцію будь-якого кута до функції гострого кута.</p>
                <p>🔑 <strong>Два правила:</strong></p>
                <p>1. <em>90° або 270°</em> — функція ЗМІНЮЄТЬСЯ (sin↔cos)</p>
                <p>2. <em>180° або 360°</em> — функція НЕ змінюється</p>
                <p>💡 <strong>Знак</strong> визначаємо так: уявляємо, що α — гострий кут, і дивимося, в якій чверті буде аргумент. Який знак має початкова функція в тій чверті — такий і буде!</p>
            `
        };

        response.innerHTML = hints[question.topic] || `
            <p>Ця задача про <strong>${question.topic}</strong>.</p>
            <p>Порада: уважно подивись на формулу та згадай основні властивості.</p>
        `;
    }, 800);
}
