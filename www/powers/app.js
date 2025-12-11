// Powers/Exponents Trainer
// Learn exponent rules with numbers and expressions

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
    hintUsed: false
};

// DOM
const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    result: document.getElementById('resultScreen')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    document.querySelectorAll('.btn-level').forEach(btn => {
        btn.addEventListener('click', () => {
            state.level = parseInt(btn.dataset.level);
            startGame();
        });
    });

    document.getElementById('hintBtn').addEventListener('click', showHint);
    document.getElementById('nextLevelBtn').addEventListener('click', () => {
        if (state.level < 3) state.level++;
        startGame();
    });
    document.getElementById('restartBtn').addEventListener('click', startGame);
    document.getElementById('menuBtn').addEventListener('click', () => showScreen('start'));
}

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
}

function startGame() {
    state = { ...state, correct: 0, wrong: 0, streak: 0, maxStreak: 0, questionsAnswered: 0, hintUsed: false };

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
    document.getElementById('hintContainer').classList.remove('show');
    document.getElementById('feedback').classList.remove('show');

    state.currentQuestion = generateQuestion();
    displayQuestion();
}

function generateQuestion() {
    const types = getQuestionTypes();
    const type = types[Math.floor(Math.random() * types.length)];

    switch (type) {
        case 'multiply': return generateMultiply();
        case 'divide': return generateDivide();
        case 'power': return generatePower();
        case 'zero': return generateZero();
        case 'negative': return generateNegative();
        case 'product': return generateProduct();
        case 'fraction': return generateFraction();
        case 'expression': return generateExpression();
        default: return generateMultiply();
    }
}

function getQuestionTypes() {
    switch (state.level) {
        case 1: return ['multiply', 'divide', 'power', 'zero'];
        case 2: return ['multiply', 'divide', 'power', 'negative', 'product'];
        case 3: return ['multiply', 'divide', 'power', 'negative', 'product', 'fraction', 'expression'];
        default: return ['multiply'];
    }
}

// aⁿ × aᵐ = aⁿ⁺ᵐ
function generateMultiply() {
    const a = randomChoice([2, 3, 5, 7, 'a', 'x']);
    const n = randomInt(2, 5);
    const m = randomInt(2, 5);
    const answer = n + m;

    const display = `${a}${sup(n)} × ${a}${sup(m)}`;
    const options = generateOptions(answer, -2, 15, [n * m, n - m, Math.max(n, m)]);

    return {
        type: 'multiply',
        questionType: 'Множення степенів',
        text: display,
        ruleHint: 'aⁿ × aᵐ = aⁿ⁺ᵐ',
        answer: `${a}${sup(answer)}`,
        answerValue: answer,
        options: options.map(o => `${a}${sup(o)}`),
        optionValues: options,
        hint: `При множенні степенів з однаковою основою показники додаються:
${a}${sup(n)} × ${a}${sup(m)} = ${a}${sup(n + '+' + m)} = ${a}${sup(answer)}`
    };
}

// aⁿ ÷ aᵐ = aⁿ⁻ᵐ
function generateDivide() {
    const a = randomChoice([2, 3, 5, 'a', 'x']);
    const n = randomInt(4, 8);
    const m = randomInt(1, n - 1);
    const answer = n - m;

    const display = `${a}${sup(n)} ÷ ${a}${sup(m)}`;
    const options = generateOptions(answer, 1, 10, [n + m, n * m, Math.max(n, m)]);

    return {
        type: 'divide',
        questionType: 'Ділення степенів',
        text: display,
        ruleHint: 'aⁿ ÷ aᵐ = aⁿ⁻ᵐ',
        answer: `${a}${sup(answer)}`,
        answerValue: answer,
        options: options.map(o => `${a}${sup(o)}`),
        optionValues: options,
        hint: `При діленні степенів з однаковою основою показники віднімаються:
${a}${sup(n)} ÷ ${a}${sup(m)} = ${a}${sup(n + '-' + m)} = ${a}${sup(answer)}`
    };
}

// (aⁿ)ᵐ = aⁿᵐ
function generatePower() {
    const a = randomChoice([2, 3, 'a', 'x']);
    const n = randomInt(2, 4);
    const m = randomInt(2, 4);
    const answer = n * m;

    const display = `(${a}${sup(n)})${sup(m)}`;
    const options = generateOptions(answer, 2, 20, [n + m, n - m, Math.pow(n, m)]);

    return {
        type: 'power',
        questionType: 'Степінь степеня',
        text: display,
        ruleHint: '(aⁿ)ᵐ = aⁿᵐ',
        answer: `${a}${sup(answer)}`,
        answerValue: answer,
        options: options.map(o => `${a}${sup(o)}`),
        optionValues: options,
        hint: `При піднесенні степеня до степеня показники множаться:
(${a}${sup(n)})${sup(m)} = ${a}${sup(n + '×' + m)} = ${a}${sup(answer)}`
    };
}

// a⁰ = 1
function generateZero() {
    const bases = [2, 3, 5, 7, 10, 100, 'a', 'x', '(a+b)'];
    const a = randomChoice(bases);

    const display = `${a}${sup(0)}`;

    return {
        type: 'zero',
        questionType: 'Нульовий показник',
        text: display,
        ruleHint: 'a⁰ = 1 (при a ≠ 0)',
        answer: '1',
        answerValue: 1,
        options: ['1', '0', `${a}`, '-1'],
        optionValues: [1, 0, a, -1],
        hint: `Будь-яке число (крім 0) в нульовому степені дорівнює 1:
${a}${sup(0)} = 1`
    };
}

// a⁻ⁿ = 1/aⁿ
function generateNegative() {
    const a = randomChoice([2, 3, 5, 'a', 'x']);
    const n = randomInt(1, 3);

    const display = `${a}${sup(-n)}`;

    // For numbers, calculate actual value
    let answerDisplay, options;
    if (typeof a === 'number') {
        const value = 1 / Math.pow(a, n);
        answerDisplay = `1/${a}${sup(n)}`;
        options = [`1/${a}${sup(n)}`, `${a}${sup(n)}`, `-${a}${sup(n)}`, `${-a}${sup(n)}`];
    } else {
        answerDisplay = `1/${a}${sup(n)}`;
        options = [`1/${a}${sup(n)}`, `${a}${sup(n)}`, `-${a}${sup(n)}`, `-1/${a}${sup(n)}`];
    }

    return {
        type: 'negative',
        questionType: 'Від\'ємний показник',
        text: display,
        ruleHint: 'a⁻ⁿ = 1/aⁿ',
        answer: answerDisplay,
        options: options,
        hint: `Від'ємний показник означає обернене число:
${a}${sup(-n)} = 1/${a}${sup(n)}`
    };
}

// (ab)ⁿ = aⁿbⁿ
function generateProduct() {
    const a = randomChoice([2, 3, 'a', 'x']);
    const b = randomChoice([2, 5, 'b', 'y']);
    const n = randomInt(2, 4);

    const display = `(${a}${b})${sup(n)}`;
    const answer = `${a}${sup(n)}${b}${sup(n)}`;

    return {
        type: 'product',
        questionType: 'Степінь добутку',
        text: display,
        ruleHint: '(ab)ⁿ = aⁿbⁿ',
        answer: answer,
        options: [
            `${a}${sup(n)}${b}${sup(n)}`,
            `${a}${sup(n)}${b}`,
            `${a}${b}${sup(n)}`,
            `(${a}${b})${sup(n)}`
        ],
        hint: `Степінь добутку дорівнює добутку степенів:
(${a}${b})${sup(n)} = ${a}${sup(n)} × ${b}${sup(n)} = ${a}${sup(n)}${b}${sup(n)}`
    };
}

// (a/b)ⁿ = aⁿ/bⁿ
function generateFraction() {
    const a = randomChoice([2, 3, 'a', 'x']);
    const b = randomChoice([2, 5, 'b', 'y']);
    const n = randomInt(2, 3);

    const display = `(${a}/${b})${sup(n)}`;
    const answer = `${a}${sup(n)}/${b}${sup(n)}`;

    return {
        type: 'fraction',
        questionType: 'Степінь дробу',
        text: display,
        ruleHint: '(a/b)ⁿ = aⁿ/bⁿ',
        answer: answer,
        options: [
            `${a}${sup(n)}/${b}${sup(n)}`,
            `${a}/${b}${sup(n)}`,
            `${a}${sup(n)}/${b}`,
            `(${a}/${b})${sup(n)}`
        ],
        hint: `Степінь дробу дорівнює дробу степенів:
(${a}/${b})${sup(n)} = ${a}${sup(n)}/${b}${sup(n)}`
    };
}

// Complex expression
function generateExpression() {
    const expressions = [
        {
            text: `2${sup(3)} × 2${sup(4)} ÷ 2${sup(5)}`,
            answer: `2${sup(2)}`,
            options: [`2${sup(2)}`, `2${sup(12)}`, `2${sup(7)}`, `2${sup(1)}`],
            hint: `Крок за кроком:\n2³ × 2⁴ = 2⁷\n2⁷ ÷ 2⁵ = 2²`
        },
        {
            text: `(3${sup(2)})${sup(3)} ÷ 3${sup(4)}`,
            answer: `3${sup(2)}`,
            options: [`3${sup(2)}`, `3${sup(10)}`, `3${sup(1)}`, `3${sup(6)}`],
            hint: `(3²)³ = 3⁶\n3⁶ ÷ 3⁴ = 3²`
        },
        {
            text: `5${sup(0)} + 2${sup(3)}`,
            answer: '9',
            options: ['9', '8', '1', '13'],
            hint: `5⁰ = 1\n2³ = 8\n1 + 8 = 9`
        },
        {
            text: `(x${sup(3)})${sup(2)} × x${sup(4)}`,
            answer: `x${sup(10)}`,
            options: [`x${sup(10)}`, `x${sup(9)}`, `x${sup(24)}`, `x${sup(7)}`],
            hint: `(x³)² = x⁶\nx⁶ × x⁴ = x¹⁰`
        },
        {
            text: `a${sup(5)} × a${sup(-2)}`,
            answer: `a${sup(3)}`,
            options: [`a${sup(3)}`, `a${sup(7)}`, `a${sup(-10)}`, `a${sup(-3)}`],
            hint: `a⁵ × a⁻² = a⁵⁺⁽⁻²⁾ = a³`
        }
    ];

    const expr = randomChoice(expressions);
    return {
        type: 'expression',
        questionType: 'Спрости вираз',
        text: expr.text,
        ruleHint: 'Застосуй правила степенів',
        answer: expr.answer,
        options: expr.options,
        hint: expr.hint
    };
}

function displayQuestion() {
    const q = state.currentQuestion;

    document.getElementById('questionType').textContent = q.questionType;
    document.getElementById('questionText').innerHTML = q.text;
    document.getElementById('ruleHint').textContent = q.ruleHint;

    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';

    const shuffled = [...q.options];
    shuffleArray(shuffled);

    shuffled.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-answer';
        btn.innerHTML = opt;
        btn.onclick = () => checkAnswer(opt);
        answersDiv.appendChild(btn);
    });
}

function checkAnswer(selected) {
    const q = state.currentQuestion;
    const isCorrect = selected === q.answer;

    // Disable all buttons
    document.querySelectorAll('.btn-answer').forEach(btn => {
        btn.disabled = true;
        if (btn.innerHTML === q.answer) btn.classList.add('correct');
        else if (btn.innerHTML === selected && !isCorrect) btn.classList.add('wrong');
    });

    if (isCorrect) {
        state.correct++;
        state.streak++;
        if (state.streak > state.maxStreak) state.maxStreak = state.streak;
        showFeedback(true);
    } else {
        state.wrong++;
        state.streak = 0;
        showFeedback(false);
    }

    document.getElementById('correct').textContent = state.correct;
    document.getElementById('wrong').textContent = state.wrong;
    document.getElementById('streak').textContent = state.streak;

    state.questionsAnswered++;
    document.getElementById('progressFill').style.width = `${(state.questionsAnswered / state.totalQuestions) * 100}%`;

    setTimeout(nextQuestion, isCorrect ? 1000 : 2000);
}

function showFeedback(isCorrect) {
    const feedback = document.getElementById('feedback');
    if (isCorrect) {
        feedback.textContent = randomChoice(['Правильно! 🎉', 'Вірно! ✅', 'Молодець! ✨']);
        feedback.className = 'feedback show correct';
    } else {
        feedback.textContent = `Відповідь: ${state.currentQuestion.answer}`;
        feedback.className = 'feedback show wrong';
    }
}

async function showHint() {
    if (state.hintUsed) return;
    state.hintUsed = true;

    const hintBtn = document.getElementById('hintBtn');
    const hintContainer = document.getElementById('hintContainer');
    const hintLoading = document.getElementById('hintLoading');
    const hintText = document.getElementById('hintText');

    hintBtn.disabled = true;
    hintContainer.classList.add('show');
    hintLoading.classList.remove('hidden');
    hintText.innerHTML = '';

    if (window.AIHints) {
        const result = await window.AIHints.getHint('powers', state.currentQuestion.text, state.level);
        hintLoading.classList.add('hidden');
        const hintContent = result.hint || state.currentQuestion.hint;
        hintText.innerHTML = hintContent;
        // Render LaTeX if available
        if (window.renderMathInElement) {
            renderMathInElement(hintText, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false
            });
        }
    } else {
        hintLoading.classList.add('hidden');
        hintText.innerHTML = state.currentQuestion.hint;
    }
}

function showResults() {
    const accuracy = state.correct + state.wrong > 0
        ? Math.round((state.correct / (state.correct + state.wrong)) * 100) : 0;

    document.getElementById('finalCorrect').textContent = state.correct;
    document.getElementById('finalWrong').textContent = state.wrong;
    document.getElementById('finalAccuracy').textContent = `${accuracy}%`;

    const title = document.getElementById('resultTitle');
    if (accuracy >= 90) title.textContent = '🏆 Бездоганно!';
    else if (accuracy >= 70) title.textContent = '🎉 Чудово!';
    else if (accuracy >= 50) title.textContent = '👍 Непогано!';
    else title.textContent = '📚 Потрібно повторити';

    document.getElementById('nextLevelBtn').style.display = state.level < 3 ? 'block' : 'none';

    if (window.Progress) {
        window.Progress.saveSession('powers', {
            level: state.level, correct: state.correct, wrong: state.wrong,
            streak: state.maxStreak, accuracy, completed: accuracy >= 70
        });
    }

    showScreen('result');
}

// Helpers
function sup(n) { return `<sup>${n}</sup>`; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
function generateOptions(correct, min, max, distractors) {
    const options = new Set([correct]);
    distractors.forEach(d => { if (d >= min && d <= max && d !== correct) options.add(d); });
    while (options.size < 4) {
        const r = randomInt(min, max);
        if (r !== correct) options.add(r);
    }
    return Array.from(options).slice(0, 4);
}
