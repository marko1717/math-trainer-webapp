// Circle Radius Trainer - Inscribed and Circumscribed circles

const QUESTIONS_PER_ROUND = 10;

// Question generators for each topic
const questionGenerators = {
    circumscribed: [
        // General formula for R
        () => ({
            question: 'Загальна формула радіуса описаного кола через площу та сторони трикутника:',
            answers: [
                'R = \\frac{abc}{4S}',
                'R = \\frac{S}{p}',
                'R = \\frac{abc}{2S}',
                'R = \\frac{4S}{abc}'
            ],
            correct: 0,
            explanation: 'Радіус описаного кола R = abc/4S, де a, b, c — сторони, S — площа',
            formula: 'R = \\frac{abc}{4S}',
            topic: 'Описане коло'
        }),
        // Sine theorem
        () => ({
            question: 'За узагальненою теоремою синусів R дорівнює:',
            answers: [
                'R = \\frac{a}{2\\sin A}',
                'R = \\frac{a}{\\sin A}',
                'R = \\frac{2a}{\\sin A}',
                'R = a \\cdot \\sin A'
            ],
            correct: 0,
            explanation: 'Теорема синусів: a/sinA = b/sinB = c/sinC = 2R',
            formula: '\\frac{a}{\\sin A} = 2R',
            topic: 'Описане коло'
        }),
        // Right triangle
        () => ({
            question: 'Радіус описаного кола навколо прямокутного трикутника з гіпотенузою c:',
            answers: [
                'R = \\frac{c}{2}',
                'R = c',
                'R = \\frac{c}{4}',
                'R = 2c'
            ],
            correct: 0,
            explanation: 'Для прямокутного трикутника R = c/2, де c — гіпотенуза. Центр описаного кола — середина гіпотенузи.',
            formula: 'R = \\frac{c}{2}',
            topic: 'Описане коло'
        }),
        // Equilateral triangle
        () => ({
            question: 'Радіус описаного кола навколо рівностороннього трикутника зі стороною a:',
            answers: [
                'R = \\frac{a\\sqrt{3}}{3}',
                'R = \\frac{a}{2}',
                'R = \\frac{a\\sqrt{3}}{2}',
                'R = a\\sqrt{3}'
            ],
            correct: 0,
            explanation: 'Для рівностороннього трикутника R = a√3/3 = a/(√3) ≈ 0.577a',
            formula: 'R = \\frac{a\\sqrt{3}}{3} = \\frac{a}{\\sqrt{3}}',
            topic: 'Описане коло'
        }),
        // Square
        () => ({
            question: 'Радіус описаного кола навколо квадрата зі стороною a:',
            answers: [
                'R = \\frac{a\\sqrt{2}}{2}',
                'R = \\frac{a}{2}',
                'R = a\\sqrt{2}',
                'R = a'
            ],
            correct: 0,
            explanation: 'Діагональ квадрата d = a√2, радіус описаного кола R = d/2 = a√2/2',
            formula: 'R = \\frac{a\\sqrt{2}}{2} = \\frac{d}{2}',
            topic: 'Описане коло'
        }),
        // Rectangle
        () => ({
            question: 'Радіус описаного кола навколо прямокутника зі сторонами a і b:',
            answers: [
                'R = \\frac{\\sqrt{a^2 + b^2}}{2}',
                'R = \\frac{a + b}{2}',
                'R = \\sqrt{a^2 + b^2}',
                'R = \\frac{ab}{2}'
            ],
            correct: 0,
            explanation: 'Діагональ прямокутника d = √(a² + b²), радіус R = d/2',
            formula: 'R = \\frac{\\sqrt{a^2 + b^2}}{2}',
            topic: 'Описане коло'
        }),
        // Practical: right triangle
        () => ({
            question: 'Прямокутний трикутник з катетами 6 і 8. Знайдіть R:',
            answers: [
                '5',
                '10',
                '7',
                '4'
            ],
            correct: 0,
            explanation: 'Гіпотенуза c = √(36+64) = 10, R = c/2 = 5',
            formula: 'R = \\frac{c}{2} = \\frac{10}{2} = 5',
            topic: 'Описане коло'
        })
    ],
    inscribed: [
        // General formula for r
        () => ({
            question: 'Загальна формула радіуса вписаного кола:',
            answers: [
                'r = \\frac{S}{p}',
                'r = \\frac{abc}{4S}',
                'r = \\frac{p}{S}',
                'r = \\frac{2S}{p}'
            ],
            correct: 0,
            explanation: 'Радіус вписаного кола r = S/p, де S — площа, p — півпериметр',
            formula: 'r = \\frac{S}{p}',
            topic: 'Вписане коло'
        }),
        // Right triangle
        () => ({
            question: 'Радіус вписаного кола в прямокутний трикутник з катетами a, b і гіпотенузою c:',
            answers: [
                'r = \\frac{a + b - c}{2}',
                'r = \\frac{c}{2}',
                'r = \\frac{a + b}{2}',
                'r = \\frac{ab}{c}'
            ],
            correct: 0,
            explanation: 'Для прямокутного трикутника r = (a + b - c)/2',
            formula: 'r = \\frac{a + b - c}{2}',
            topic: 'Вписане коло'
        }),
        // Equilateral triangle
        () => ({
            question: 'Радіус вписаного кола в рівносторонній трикутник зі стороною a:',
            answers: [
                'r = \\frac{a\\sqrt{3}}{6}',
                'r = \\frac{a\\sqrt{3}}{3}',
                'r = \\frac{a}{2}',
                'r = \\frac{a}{6}'
            ],
            correct: 0,
            explanation: 'Для рівностороннього трикутника r = a√3/6 = R/2',
            formula: 'r = \\frac{a\\sqrt{3}}{6} = \\frac{a}{2\\sqrt{3}}',
            topic: 'Вписане коло'
        }),
        // Square
        () => ({
            question: 'Радіус вписаного кола в квадрат зі стороною a:',
            answers: [
                'r = \\frac{a}{2}',
                'r = \\frac{a\\sqrt{2}}{2}',
                'r = a',
                'r = \\frac{a}{4}'
            ],
            correct: 0,
            explanation: 'Вписане коло в квадрат має r = a/2 (половина сторони)',
            formula: 'r = \\frac{a}{2}',
            topic: 'Вписане коло'
        }),
        // Rhombus
        () => ({
            question: 'Радіус вписаного кола в ромб через діагоналі d₁ і d₂:',
            answers: [
                'r = \\frac{d_1 d_2}{2\\sqrt{d_1^2 + d_2^2}}',
                'r = \\frac{d_1 + d_2}{2}',
                'r = \\frac{d_1 d_2}{4}',
                'r = \\sqrt{d_1^2 + d_2^2}'
            ],
            correct: 0,
            explanation: 'Для ромба r = d₁d₂ / (2√(d₁² + d₂²)) = S/(2a), де a — сторона',
            formula: 'r = \\frac{d_1 \\cdot d_2}{2\\sqrt{d_1^2 + d_2^2}}',
            topic: 'Вписане коло'
        }),
        // Practical: calculate r
        () => ({
            question: 'Трикутник з площею 12 і периметром 16. Знайдіть r:',
            answers: [
                '1.5',
                '3',
                '0.75',
                '6'
            ],
            correct: 0,
            explanation: 'p = 16/2 = 8, r = S/p = 12/8 = 1.5',
            formula: 'r = \\frac{S}{p} = \\frac{12}{8} = 1.5',
            topic: 'Вписане коло'
        }),
        // Practical: right triangle
        () => ({
            question: 'Прямокутний трикутник з катетами 3 і 4. Знайдіть r:',
            answers: [
                '1',
                '2',
                '2.5',
                '1.5'
            ],
            correct: 0,
            explanation: 'c = 5, r = (a + b - c)/2 = (3 + 4 - 5)/2 = 1',
            formula: 'r = \\frac{3 + 4 - 5}{2} = 1',
            topic: 'Вписане коло'
        })
    ],
    special: [
        // Trapezoid inscribed
        () => ({
            question: 'Радіус вписаного кола в рівнобічну трапецію через висоту h:',
            answers: [
                'r = \\frac{h}{2}',
                'r = h',
                'r = \\frac{h}{4}',
                'r = 2h'
            ],
            correct: 0,
            explanation: 'Для рівнобічної трапеції з вписаним колом r = h/2 (половина висоти)',
            formula: 'r = \\frac{h}{2}',
            topic: 'Особливі фігури'
        }),
        // Rhombus through height
        () => ({
            question: 'Радіус вписаного кола в ромб через висоту h:',
            answers: [
                'r = \\frac{h}{2}',
                'r = h',
                'r = \\frac{h}{4}',
                'r = 2h'
            ],
            correct: 0,
            explanation: 'Для ромба r = h/2, де h — висота ромба',
            formula: 'r = \\frac{h}{2}',
            topic: 'Особливі фігури'
        }),
        // Ratio R/r for equilateral
        () => ({
            question: 'Співвідношення R/r для рівностороннього трикутника:',
            answers: [
                '2',
                '3',
                '\\sqrt{3}',
                '\\sqrt{2}'
            ],
            correct: 0,
            explanation: 'R = a√3/3, r = a√3/6, тому R/r = 2. Центри обох кіл збігаються!',
            formula: '\\frac{R}{r} = 2',
            topic: 'Особливі фігури'
        }),
        // Square R/r
        () => ({
            question: 'Співвідношення R/r для квадрата:',
            answers: [
                '\\sqrt{2}',
                '2',
                '\\sqrt{3}',
                '\\frac{3}{2}'
            ],
            correct: 0,
            explanation: 'R = a√2/2, r = a/2, тому R/r = √2',
            formula: '\\frac{R}{r} = \\sqrt{2}',
            topic: 'Особливі фігури'
        }),
        // Tangent quadrilateral condition
        () => ({
            question: 'Умова існування вписаного кола в чотирикутник:',
            answers: [
                'a + c = b + d',
                'a \\cdot c = b \\cdot d',
                'a + b = c + d',
                'a^2 + c^2 = b^2 + d^2'
            ],
            correct: 0,
            explanation: 'Коло можна вписати, якщо суми протилежних сторін рівні: a + c = b + d',
            formula: 'a + c = b + d',
            topic: 'Особливі фігури'
        }),
        // Cyclic quadrilateral condition
        () => ({
            question: 'Умова існування описаного кола навколо чотирикутника:',
            answers: [
                '\\alpha + \\gamma = 180°',
                '\\alpha + \\beta = 180°',
                '\\alpha = \\gamma',
                '\\alpha + \\beta + \\gamma + \\delta = 360°'
            ],
            correct: 0,
            explanation: 'Коло можна описати, якщо суми протилежних кутів = 180°',
            formula: '\\alpha + \\gamma = \\beta + \\delta = 180°',
            topic: 'Особливі фігури'
        }),
        // Regular hexagon R
        () => ({
            question: 'Радіус описаного кола навколо правильного шестикутника зі стороною a:',
            answers: [
                'R = a',
                'R = \\frac{a\\sqrt{3}}{2}',
                'R = a\\sqrt{3}',
                'R = \\frac{a}{2}'
            ],
            correct: 0,
            explanation: 'Для правильного шестикутника R = a (сторона = радіус описаного кола)',
            formula: 'R = a',
            topic: 'Особливі фігури'
        }),
        // Practical rhombus
        () => ({
            question: 'Ромб з діагоналями 6 і 8. Знайдіть r:',
            answers: [
                '2.4',
                '3.5',
                '4',
                '5'
            ],
            correct: 0,
            explanation: 'r = d₁d₂/(2√(d₁²+d₂²)) = 48/(2·10) = 2.4',
            formula: 'r = \\frac{6 \\cdot 8}{2\\sqrt{36+64}} = \\frac{48}{20} = 2.4',
            topic: 'Особливі фігури'
        })
    ]
};

// State
let currentTopic = 'circumscribed';
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

    // AI Help button
    document.getElementById('aiHelpBtn').addEventListener('click', showAIHelp);
    document.getElementById('aiCloseBtn').addEventListener('click', () => {
        document.getElementById('aiHelperModal').classList.add('hidden');
    });

    // Formula button
    document.getElementById('formulaBtn').addEventListener('click', () => {
        document.getElementById('formulaModal').classList.remove('hidden');
    });

    // Formula modal close
    document.getElementById('formulaCloseBtn').addEventListener('click', () => {
        document.getElementById('formulaModal').classList.add('hidden');
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
        ['f1', 'R = \\frac{abc}{4S}'],
        ['f2', 'R = \\frac{a}{2\\sin A}'],
        ['f3', 'R_{\\text{прям}} = \\frac{c}{2}'],
        ['f4', 'R_{\\text{рівн}} = \\frac{a\\sqrt{3}}{3}'],
        ['f5', 'r = \\frac{S}{p}'],
        ['f6', 'r_{\\text{прям}} = \\frac{a+b-c}{2}'],
        ['f7', 'r_{\\text{рівн}} = \\frac{a\\sqrt{3}}{6}'],
        ['f8', 'r_{\\text{квадрат}} = \\frac{a}{2}'],
        ['f9', 'R_{\\text{квадрат}} = \\frac{a\\sqrt{2}}{2}'],
        ['f10', 'r_{\\text{трапеція}} = \\frac{h}{2}']
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
            ...questionGenerators.circumscribed,
            ...questionGenerators.inscribed,
            ...questionGenerators.special
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
        circumscribed: 'Описане коло',
        inscribed: 'Вписане коло',
        special: 'Особливі фігури',
        mixed: 'Всі формули'
    };
    document.getElementById('topicTitle').textContent = titles[currentTopic] || 'Радіуси';
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    answered = false;

    // Update progress
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('questionNumber').textContent = `Питання ${currentQuestionIndex + 1} / ${questions.length}`;
    document.getElementById('questionType').textContent = question.topic;

    // Render question
    document.getElementById('questionText').textContent = question.question;

    // Generate shuffled answers
    const answerIndices = question.answers.map((_, i) => i);

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
        try {
            katex.render(question.answers[originalIndex], answerTextEl, { throwOnError: false });
        } catch (e) {
            answerTextEl.textContent = question.answers[originalIndex];
        }

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

    try {
        katex.render(question.formula, document.getElementById('feedbackFormula'), {
            throwOnError: false,
            displayMode: true
        });
    } catch (e) {
        document.getElementById('feedbackFormula').textContent = question.formula;
    }

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
    const hints = {
        circumscribed: 'R = abc/4S або R = a/(2sinA). Для прямокутного: R = c/2',
        inscribed: 'r = S/p. Для прямокутного: r = (a+b-c)/2',
        special: 'Для ромба і трапеції r = h/2 (половина висоти)',
        mixed: 'Описане: abc/4S. Вписане: S/p'
    };

    alert(hints[currentTopic] || 'Подивись на формули!');
}

function showAIHelp() {
    const modal = document.getElementById('aiHelperModal');
    const loading = document.getElementById('aiLoading');
    const response = document.getElementById('aiResponse');

    modal.classList.remove('hidden');
    loading.style.display = 'block';
    response.style.display = 'none';

    const question = questions[currentQuestionIndex];

    setTimeout(() => {
        loading.style.display = 'none';
        response.style.display = 'block';

        const hints = {
            'Описане коло': `<p><strong>🔵 Описане коло (R):</strong></p>
                <p>Проходить через усі вершини фігури</p>
                <p><strong>Формули:</strong></p>
                <p>• R = abc/4S (загальна)</p>
                <p>• R = a/(2sinA) (теорема синусів)</p>
                <p>• R = c/2 (прямокутний △, c — гіпотенуза)</p>
                <p>• R = a√3/3 (рівносторонній △)</p>
                <p>• R = a√2/2 (квадрат)</p>`,
            'Вписане коло': `<p><strong>🟢 Вписане коло (r):</strong></p>
                <p>Дотикається до всіх сторін фігури</p>
                <p><strong>Формули:</strong></p>
                <p>• r = S/p (загальна, p — півпериметр)</p>
                <p>• r = (a+b-c)/2 (прямокутний △)</p>
                <p>• r = a√3/6 (рівносторонній △)</p>
                <p>• r = a/2 (квадрат)</p>
                <p>• r = h/2 (ромб, трапеція)</p>`,
            'Особливі фігури': `<p><strong>📐 Особливі випадки:</strong></p>
                <p>• Рівносторонній △: R/r = 2</p>
                <p>• Квадрат: R/r = √2</p>
                <p>• Ромб: r = h/2 = d₁d₂/(2√(d₁²+d₂²))</p>
                <p>• Правильний 6-кутник: R = a</p>
                <p><strong>Умови існування:</strong></p>
                <p>• Вписане в 4-кутник: a+c = b+d</p>
                <p>• Описане навколо 4-кутника: α+γ = 180°</p>`
        };

        response.innerHTML = hints[question.topic] || `<p><strong>Основні формули:</strong></p>
            <p>🔵 Описане: R = abc/4S</p>
            <p>🟢 Вписане: r = S/p</p>`;
    }, 600);
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
