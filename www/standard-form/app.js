// Standard Form Trainer - with unit conversions

const QUESTIONS_PER_ROUND = 10;

// Question generators for each topic
const questionGenerators = {
    basic: [
        // Basic conversion to standard form
        () => {
            const numbers = [
                { num: '4500', answer: '4.5 \\times 10^3', wrong: ['45 \\times 10^2', '4.5 \\times 10^2', '0.45 \\times 10^4'] },
                { num: '0.0032', answer: '3.2 \\times 10^{-3}', wrong: ['32 \\times 10^{-4}', '3.2 \\times 10^{-2}', '0.32 \\times 10^{-2}'] },
                { num: '78000', answer: '7.8 \\times 10^4', wrong: ['78 \\times 10^3', '7.8 \\times 10^3', '0.78 \\times 10^5'] },
                { num: '0.00056', answer: '5.6 \\times 10^{-4}', wrong: ['56 \\times 10^{-5}', '5.6 \\times 10^{-3}', '0.56 \\times 10^{-3}'] },
                { num: '123', answer: '1.23 \\times 10^2', wrong: ['12.3 \\times 10^1', '1.23 \\times 10^3', '0.123 \\times 10^3'] },
                { num: '0.089', answer: '8.9 \\times 10^{-2}', wrong: ['89 \\times 10^{-3}', '8.9 \\times 10^{-1}', '0.89 \\times 10^{-1}'] }
            ];
            const q = numbers[Math.floor(Math.random() * numbers.length)];
            const answers = [q.answer, ...q.wrong].sort(() => Math.random() - 0.5);
            return {
                question: `Запишіть ${q.num} у стандартному вигляді:`,
                answers: answers,
                correct: answers.indexOf(q.answer),
                explanation: `У стандартному вигляді a × 10ⁿ, де 1 ≤ a < 10. Отже ${q.num} = ${q.answer.replace(/\\times/g, '×')}`,
                formula: q.answer,
                topic: 'Основи'
            };
        },
        // Convert from standard form
        () => {
            const numbers = [
                { standard: '3.5 \\times 10^4', answer: '35000', wrong: ['3500', '350000', '350'] },
                { standard: '2.1 \\times 10^{-3}', answer: '0.0021', wrong: ['0.021', '0.00021', '21'] },
                { standard: '9.8 \\times 10^5', answer: '980000', wrong: ['98000', '9800000', '9800'] },
                { standard: '4.7 \\times 10^{-2}', answer: '0.047', wrong: ['0.47', '0.0047', '47'] }
            ];
            const q = numbers[Math.floor(Math.random() * numbers.length)];
            const answers = [q.answer, ...q.wrong].sort(() => Math.random() - 0.5);
            return {
                question: `Запишіть ${q.standard.replace(/\\times/g, '×')} у звичайному вигляді:`,
                answers: answers,
                correct: answers.indexOf(q.answer),
                explanation: `${q.standard.replace(/\\times/g, '×')} = ${q.answer}`,
                formula: `${q.standard} = ${q.answer}`,
                topic: 'Основи'
            };
        },
        // Which is in standard form?
        () => ({
            question: 'Яке число записано у стандартному вигляді?',
            answers: [
                '5.2 \\times 10^7',
                '52 \\times 10^6',
                '0.52 \\times 10^8',
                '520 \\times 10^5'
            ],
            correct: 0,
            explanation: 'У стандартному вигляді a × 10ⁿ число a має бути від 1 до 10 (1 ≤ a < 10)',
            formula: '1 \\leq a < 10',
            topic: 'Основи'
        })
    ],
    large: [
        // Large numbers - real world
        () => ({
            question: 'Відстань від Землі до Сонця — 150 000 000 км. У стандартному вигляді:',
            answers: [
                '1.5 \\times 10^8 \\text{ км}',
                '15 \\times 10^7 \\text{ км}',
                '1.5 \\times 10^7 \\text{ км}',
                '150 \\times 10^6 \\text{ км}'
            ],
            correct: 0,
            explanation: '150 000 000 = 1.5 × 10⁸ (переносимо кому на 8 позицій вліво)',
            formula: '150000000 = 1.5 \\times 10^8',
            topic: 'Великі числа'
        }),
        () => ({
            question: 'Населення Землі — приблизно 8 мільярдів. У стандартному вигляді:',
            answers: [
                '8 \\times 10^9',
                '8 \\times 10^{12}',
                '8 \\times 10^6',
                '80 \\times 10^8'
            ],
            correct: 0,
            explanation: '1 мільярд = 10⁹, тому 8 мільярдів = 8 × 10⁹',
            formula: '8 \\text{ млрд} = 8 \\times 10^9',
            topic: 'Великі числа'
        }),
        () => ({
            question: 'Швидкість світла — 300 000 км/с. У стандартному вигляді:',
            answers: [
                '3 \\times 10^5 \\text{ км/с}',
                '30 \\times 10^4 \\text{ км/с}',
                '3 \\times 10^6 \\text{ км/с}',
                '0.3 \\times 10^6 \\text{ км/с}'
            ],
            correct: 0,
            explanation: '300 000 = 3 × 10⁵',
            formula: '300000 = 3 \\times 10^5',
            topic: 'Великі числа'
        }),
        () => ({
            question: '2.5 × 10⁶ — це скільки?',
            answers: [
                '2 500 000 (2.5 мільйони)',
                '250 000 (250 тисяч)',
                '25 000 000 (25 мільйонів)',
                '25 000 (25 тисяч)'
            ],
            correct: 0,
            explanation: '2.5 × 10⁶ = 2.5 × 1 000 000 = 2 500 000',
            formula: '2.5 \\times 10^6 = 2500000',
            topic: 'Великі числа'
        })
    ],
    small: [
        // Small numbers - real world
        () => ({
            question: 'Діаметр атома водню — приблизно 0.0000000001 м. У стандартному вигляді:',
            answers: [
                '1 \\times 10^{-10} \\text{ м}',
                '1 \\times 10^{-9} \\text{ м}',
                '10 \\times 10^{-11} \\text{ м}',
                '1 \\times 10^{-8} \\text{ м}'
            ],
            correct: 0,
            explanation: 'Рахуємо нулі після коми: їх 10, тому степінь = -10',
            formula: '0.0000000001 = 1 \\times 10^{-10}',
            topic: 'Малі числа'
        }),
        () => ({
            question: 'Товщина людської волосини — 0.00007 м. У стандартному вигляді:',
            answers: [
                '7 \\times 10^{-5} \\text{ м}',
                '7 \\times 10^{-4} \\text{ м}',
                '70 \\times 10^{-6} \\text{ м}',
                '7 \\times 10^{-6} \\text{ м}'
            ],
            correct: 0,
            explanation: '0.00007 = 7 × 10⁻⁵ (переносимо кому на 5 позицій вправо)',
            formula: '0.00007 = 7 \\times 10^{-5}',
            topic: 'Малі числа'
        }),
        () => ({
            question: '5 × 10⁻⁴ — це:',
            answers: [
                '0.0005',
                '0.005',
                '0.00005',
                '0.05'
            ],
            correct: 0,
            explanation: '5 × 10⁻⁴ = 5 ÷ 10000 = 0.0005',
            formula: '5 \\times 10^{-4} = 0.0005',
            topic: 'Малі числа'
        }),
        () => ({
            question: '3.2 нанометри (нм) у метрах:',
            answers: [
                '3.2 \\times 10^{-9} \\text{ м}',
                '3.2 \\times 10^{-6} \\text{ м}',
                '3.2 \\times 10^{-12} \\text{ м}',
                '3.2 \\times 10^{-3} \\text{ м}'
            ],
            correct: 0,
            explanation: 'Нано = 10⁻⁹, тому 3.2 нм = 3.2 × 10⁻⁹ м',
            formula: '1 \\text{ нм} = 10^{-9} \\text{ м}',
            topic: 'Малі числа'
        })
    ],
    units: [
        // Unit conversions - grams to kg
        () => ({
            question: 'Маса предмета 4500 г. Запишіть у кілограмах у стандартному вигляді:',
            answers: [
                '4.5 \\text{ кг}',
                '4.5 \\times 10^3 \\text{ кг}',
                '0.45 \\text{ кг}',
                '45 \\text{ кг}'
            ],
            correct: 0,
            explanation: '4500 г = 4500 ÷ 1000 кг = 4.5 кг',
            formula: '4500 \\text{ г} = 4.5 \\text{ кг}',
            topic: 'Одиниці виміру'
        }),
        () => ({
            question: 'Маса 2.5 × 10⁴ г у кілограмах:',
            answers: [
                '25 \\text{ кг}',
                '2.5 \\text{ кг}',
                '250 \\text{ кг}',
                '2500 \\text{ кг}'
            ],
            correct: 0,
            explanation: '2.5 × 10⁴ г = 25000 г = 25 кг',
            formula: '2.5 \\times 10^4 \\text{ г} = 25 \\text{ кг}',
            topic: 'Одиниці виміру'
        }),
        // cm to m
        () => ({
            question: 'Довжина 350 см. Запишіть у метрах:',
            answers: [
                '3.5 \\text{ м}',
                '35 \\text{ м}',
                '0.35 \\text{ м}',
                '3.5 \\times 10^2 \\text{ м}'
            ],
            correct: 0,
            explanation: '350 см = 350 ÷ 100 м = 3.5 м',
            formula: '350 \\text{ см} = 3.5 \\text{ м}',
            topic: 'Одиниці виміру'
        }),
        () => ({
            question: 'Довжина 7.2 × 10³ см у метрах:',
            answers: [
                '72 \\text{ м}',
                '7.2 \\text{ м}',
                '720 \\text{ м}',
                '7200 \\text{ м}'
            ],
            correct: 0,
            explanation: '7.2 × 10³ см = 7200 см = 72 м',
            formula: '7.2 \\times 10^3 \\text{ см} = 72 \\text{ м}',
            topic: 'Одиниці виміру'
        }),
        // mm to m
        () => ({
            question: 'Товщина листа 0.8 мм. Запишіть у метрах у стандартному вигляді:',
            answers: [
                '8 \\times 10^{-4} \\text{ м}',
                '8 \\times 10^{-3} \\text{ м}',
                '0.8 \\times 10^{-3} \\text{ м}',
                '8 \\times 10^{-2} \\text{ м}'
            ],
            correct: 0,
            explanation: '0.8 мм = 0.8 ÷ 1000 м = 0.0008 м = 8 × 10⁻⁴ м',
            formula: '0.8 \\text{ мм} = 8 \\times 10^{-4} \\text{ м}',
            topic: 'Одиниці виміру'
        }),
        // mg to g
        () => ({
            question: 'Маса таблетки 500 мг. Запишіть у грамах:',
            answers: [
                '0.5 \\text{ г}',
                '5 \\text{ г}',
                '0.05 \\text{ г}',
                '5 \\times 10^{-1} \\text{ г}'
            ],
            correct: 0,
            explanation: '500 мг = 500 ÷ 1000 г = 0.5 г',
            formula: '500 \\text{ мг} = 0.5 \\text{ г}',
            topic: 'Одиниці виміру'
        }),
        // Tricky conversions
        () => ({
            question: 'Площа 4.5 × 10⁴ см². Скільки це м²?',
            answers: [
                '4.5 \\text{ м}^2',
                '45 \\text{ м}^2',
                '0.45 \\text{ м}^2',
                '450 \\text{ м}^2'
            ],
            correct: 0,
            explanation: '1 м² = 10000 см² = 10⁴ см². Тому 4.5 × 10⁴ см² = 4.5 м²',
            formula: '4.5 \\times 10^4 \\text{ см}^2 = 4.5 \\text{ м}^2',
            topic: 'Одиниці виміру'
        }),
        () => ({
            question: 'Об\'єм 2000 мл. Запишіть у літрах:',
            answers: [
                '2 \\text{ л}',
                '0.2 \\text{ л}',
                '20 \\text{ л}',
                '2 \\times 10^3 \\text{ л}'
            ],
            correct: 0,
            explanation: '2000 мл = 2000 ÷ 1000 л = 2 л',
            formula: '2000 \\text{ мл} = 2 \\text{ л}',
            topic: 'Одиниці виміру'
        }),
        // Attention check - answer in different units
        () => ({
            question: '⚠️ УВАГА: Маса 6200 г. Відповідь у кілограмах:',
            answers: [
                '6.2 \\text{ кг}',
                '6.2 \\times 10^3 \\text{ г}',
                '0.62 \\text{ кг}',
                '62 \\text{ г}'
            ],
            correct: 0,
            explanation: '6200 г = 6.2 кг. Увага: відповідь має бути в КІЛОГРАМАХ!',
            formula: '6200 \\text{ г} = 6.2 \\text{ кг}',
            topic: 'Одиниці виміру'
        }),
        () => ({
            question: '⚠️ УВАГА: Довжина 4800 см. Відповідь у МЕТРАХ:',
            answers: [
                '48 \\text{ м}',
                '4.8 \\times 10^3 \\text{ см}',
                '480 \\text{ м}',
                '4.8 \\text{ м}'
            ],
            correct: 0,
            explanation: '4800 см = 48 м. Перевіряй одиниці у відповіді!',
            formula: '4800 \\text{ см} = 48 \\text{ м}',
            topic: 'Одиниці виміру'
        })
    ]
};

// State
let currentTopic = 'basic';
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
    const f1 = document.getElementById('f1');
    if (f1) {
        katex.render('a \\times 10^n', f1, { throwOnError: false });
    }
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
            ...questionGenerators.basic,
            ...questionGenerators.large,
            ...questionGenerators.small,
            ...questionGenerators.units
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
        basic: 'Основи',
        large: 'Великі числа',
        small: 'Малі числа',
        units: 'Одиниці виміру',
        mixed: 'Змішаний режим'
    };
    document.getElementById('topicTitle').textContent = titles[currentTopic] || 'Стандартний вигляд';
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
        basic: 'У стандартному вигляді a × 10ⁿ число a має бути від 1 до 10!',
        large: 'Порахуй, скільки разів треба перенести кому вліво',
        small: 'Порахуй нулі після коми — це буде від\'ємний показник степеня',
        units: 'Спочатку переведи одиниці, потім запиши у стандартному вигляді!',
        mixed: '1 км = 1000 м, 1 кг = 1000 г, 1 м = 100 см'
    };

    alert(hints[currentTopic] || 'Перевір одиниці виміру!');
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
            'Основи': `<p><strong>Стандартний вигляд числа:</strong></p>
                <p>a × 10ⁿ, де 1 ≤ a < 10</p>
                <p><strong>Як перетворити:</strong></p>
                <p>1. Знайди першу значущу цифру</p>
                <p>2. Постав кому після неї</p>
                <p>3. Порахуй, скільки позицій зсунулась кома</p>
                <p>• Вліво → додатний степінь</p>
                <p>• Вправо → від'ємний степінь</p>`,
            'Великі числа': `<p><strong>Великі числа (степінь додатний):</strong></p>
                <p>Порахуй нулі або позиції вліво:</p>
                <p>• 1 000 000 = 10⁶ (мільйон)</p>
                <p>• 1 000 000 000 = 10⁹ (мільярд)</p>
                <p><strong>Приклад:</strong></p>
                <p>150 000 000 → 1.5 × 10⁸</p>
                <p>(кома зсунулась на 8 позицій вліво)</p>`,
            'Малі числа': `<p><strong>Малі числа (степінь від'ємний):</strong></p>
                <p>Порахуй нулі після коми:</p>
                <p>• 0.001 = 10⁻³ (мілі)</p>
                <p>• 0.000001 = 10⁻⁶ (мікро)</p>
                <p>• 0.000000001 = 10⁻⁹ (нано)</p>
                <p><strong>Приклад:</strong></p>
                <p>0.00056 → 5.6 × 10⁻⁴</p>`,
            'Одиниці виміру': `<p><strong>Переведення одиниць:</strong></p>
                <p>• 1 км = 1000 м = 10³ м</p>
                <p>• 1 м = 100 см = 10² см</p>
                <p>• 1 кг = 1000 г = 10³ г</p>
                <p>• 1 г = 1000 мг = 10³ мг</p>
                <p><strong>⚠️ Увага:</strong> Перевіряй, в яких одиницях має бути відповідь!</p>`
        };

        response.innerHTML = hints[question.topic] || `<p>Запам'ятай головне правило:</p>
            <p><strong>a × 10ⁿ</strong>, де 1 ≤ a < 10</p>
            <p>Число a завжди від 1 до 10!</p>`;
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
