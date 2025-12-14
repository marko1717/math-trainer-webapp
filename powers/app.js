// Powers/Exponents Trainer
// Learn exponent rules with topic selection

const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
}

// Topic names mapping
const TOPIC_NAMES = {
    multiply: 'Множення степенів',
    divide: 'Ділення степенів',
    power: 'Степінь степеня',
    zero: 'Нульовий показник',
    negative: "Від'ємний показник",
    product: 'Степінь добутку',
    fraction: 'Степінь дробу',
    expression: 'Складні вирази',
    mixed: 'Змішаний режим'
};

// Formulas for each topic
const TOPIC_FORMULAS = {
    multiply: 'aⁿ × aᵐ = aⁿ⁺ᵐ',
    divide: 'aⁿ ÷ aᵐ = aⁿ⁻ᵐ',
    power: '(aⁿ)ᵐ = aⁿᵐ',
    zero: 'a⁰ = 1 (при a ≠ 0)',
    negative: 'a⁻ⁿ = 1/aⁿ',
    product: '(ab)ⁿ = aⁿbⁿ',
    fraction: '(a/b)ⁿ = aⁿ/bⁿ',
    expression: 'Комбінація правил',
    mixed: 'Всі правила степенів'
};

// State
let state = {
    topic: 'mixed',
    correct: 0,
    wrong: 0,
    questionsAnswered: 0,
    totalQuestions: 10,
    currentQuestion: null,
    answered: false,
    startTime: null
};

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    result: document.getElementById('resultScreen')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    renderKaTeXFormulas();
});

// Render KaTeX formulas in topic buttons
function renderKaTeXFormulas() {
    document.querySelectorAll('.katex-formula').forEach(el => {
        const formula = el.dataset.formula;
        if (formula && window.katex) {
            try {
                katex.render(formula, el, {
                    throwOnError: false,
                    displayMode: false
                });
            } catch (e) {
                console.error('KaTeX error:', e);
                el.textContent = formula;
            }
        }
    });
}

function setupEventListeners() {
    // Topic selection buttons
    document.querySelectorAll('.btn-topic').forEach(btn => {
        btn.addEventListener('click', () => {
            state.topic = btn.dataset.topic;
            startGame();
        });
    });

    // Back buttons
    document.getElementById('backBtn')?.addEventListener('click', () => showScreen('start'));
    document.getElementById('resultBackBtn')?.addEventListener('click', () => showScreen('start'));
    document.getElementById('menuBtn')?.addEventListener('click', () => showScreen('start'));

    // Restart
    document.getElementById('restartBtn')?.addEventListener('click', startGame);

    // Help panel
    document.getElementById('hintBtn')?.addEventListener('click', showHint);
    document.getElementById('aiHelpBtn')?.addEventListener('click', showAIHelp);
    document.getElementById('formulaBtn')?.addEventListener('click', showFormula);

    // AI Modal close
    document.getElementById('aiCloseBtn')?.addEventListener('click', closeAIModal);
    document.getElementById('aiHelperModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'aiHelperModal') closeAIModal();
    });

    // Next button
    document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);
}

function showScreen(name) {
    Object.values(screens).forEach(s => s?.classList.remove('active'));
    screens[name]?.classList.add('active');
}

function startGame() {
    state = {
        ...state,
        correct: 0,
        wrong: 0,
        questionsAnswered: 0,
        currentQuestion: null,
        answered: false,
        startTime: Date.now()
    };

    // Update UI
    document.getElementById('correct').textContent = '0';
    document.getElementById('wrong').textContent = '0';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('topicTitle').textContent = TOPIC_NAMES[state.topic] || 'Степені';
    document.getElementById('nextBtn').style.display = 'none';

    showScreen('game');
    nextQuestion();
}

function nextQuestion() {
    if (state.questionsAnswered >= state.totalQuestions) {
        showResults();
        return;
    }

    state.answered = false;
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('feedback').className = 'feedback-container';

    // Enable help buttons
    document.getElementById('hintBtn').disabled = false;
    document.getElementById('aiHelpBtn').disabled = false;
    document.getElementById('formulaBtn').disabled = false;

    state.currentQuestion = generateQuestion();
    displayQuestion();
}

function generateQuestion() {
    let type = state.topic;

    if (type === 'mixed') {
        const types = ['multiply', 'divide', 'power', 'zero', 'negative', 'product', 'fraction', 'expression'];
        type = types[Math.floor(Math.random() * types.length)];
    }

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

// aⁿ × aᵐ = aⁿ⁺ᵐ
function generateMultiply() {
    const a = randomChoice([2, 3, 5, 7, 'a', 'x']);
    const n = randomInt(2, 6);
    const m = randomInt(2, 6);
    const answer = n + m;

    const display = `${a}${sup(n)} × ${a}${sup(m)}`;
    const options = generateOptions(answer, 2, 15, [n * m, n - m, Math.max(n, m)]);

    return {
        type: 'multiply',
        questionType: 'Множення степенів',
        text: display,
        formula: 'aⁿ × aᵐ = aⁿ⁺ᵐ',
        answer: `${a}${sup(answer)}`,
        answerValue: answer,
        options: options.map(o => `${a}${sup(o)}`),
        optionValues: options,
        hint: `При множенні степенів з однаковою основою показники додаються:\n${a}${sup(n)} × ${a}${sup(m)} = ${a}${sup(n + '+' + m)} = ${a}${sup(answer)}`
    };
}

// aⁿ ÷ aᵐ = aⁿ⁻ᵐ
function generateDivide() {
    const a = randomChoice([2, 3, 5, 'a', 'x']);
    const n = randomInt(5, 10);
    const m = randomInt(1, n - 1);
    const answer = n - m;

    const display = `${a}${sup(n)} ÷ ${a}${sup(m)}`;
    const options = generateOptions(answer, 1, 12, [n + m, n * m, Math.max(n, m)]);

    return {
        type: 'divide',
        questionType: 'Ділення степенів',
        text: display,
        formula: 'aⁿ ÷ aᵐ = aⁿ⁻ᵐ',
        answer: `${a}${sup(answer)}`,
        answerValue: answer,
        options: options.map(o => `${a}${sup(o)}`),
        optionValues: options,
        hint: `При діленні степенів з однаковою основою показники віднімаються:\n${a}${sup(n)} ÷ ${a}${sup(m)} = ${a}${sup(n + '-' + m)} = ${a}${sup(answer)}`
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
        formula: '(aⁿ)ᵐ = aⁿᵐ',
        answer: `${a}${sup(answer)}`,
        answerValue: answer,
        options: options.map(o => `${a}${sup(o)}`),
        optionValues: options,
        hint: `При піднесенні степеня до степеня показники множаться:\n(${a}${sup(n)})${sup(m)} = ${a}${sup(n + '×' + m)} = ${a}${sup(answer)}`
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
        formula: 'a⁰ = 1 (при a ≠ 0)',
        answer: '1',
        answerValue: 1,
        options: ['1', '0', `${a}`, '-1'],
        optionValues: [1, 0, a, -1],
        hint: `Будь-яке число (крім 0) в нульовому степені дорівнює 1:\n${a}${sup(0)} = 1`
    };
}

// a⁻ⁿ = 1/aⁿ
function generateNegative() {
    const a = randomChoice([2, 3, 5, 'a', 'x']);
    const n = randomInt(1, 3);

    const display = `${a}${sup(-n)}`;
    const answerDisplay = `1/${a}${sup(n)}`;

    let options;
    if (typeof a === 'number') {
        options = [`1/${a}${sup(n)}`, `${a}${sup(n)}`, `-${a}${sup(n)}`, `${-a}${sup(n)}`];
    } else {
        options = [`1/${a}${sup(n)}`, `${a}${sup(n)}`, `-${a}${sup(n)}`, `-1/${a}${sup(n)}`];
    }

    return {
        type: 'negative',
        questionType: "Від'ємний показник",
        text: display,
        formula: 'a⁻ⁿ = 1/aⁿ',
        answer: answerDisplay,
        options: options,
        hint: `Від'ємний показник означає обернене число:\n${a}${sup(-n)} = 1/${a}${sup(n)}`
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
        formula: '(ab)ⁿ = aⁿbⁿ',
        answer: answer,
        options: [
            `${a}${sup(n)}${b}${sup(n)}`,
            `${a}${sup(n)}${b}`,
            `${a}${b}${sup(n)}`,
            `(${a}${b})${sup(n + 1)}`
        ],
        hint: `Степінь добутку дорівнює добутку степенів:\n(${a}${b})${sup(n)} = ${a}${sup(n)} × ${b}${sup(n)} = ${a}${sup(n)}${b}${sup(n)}`
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
        formula: '(a/b)ⁿ = aⁿ/bⁿ',
        answer: answer,
        options: [
            `${a}${sup(n)}/${b}${sup(n)}`,
            `${a}/${b}${sup(n)}`,
            `${a}${sup(n)}/${b}`,
            `${a}${sup(n)}${b}${sup(n)}`
        ],
        hint: `Степінь дробу дорівнює дробу степенів:\n(${a}/${b})${sup(n)} = ${a}${sup(n)}/${b}${sup(n)}`
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
        },
        {
            text: `(2${sup(3)})${sup(2)} × 2${sup(-4)}`,
            answer: `2${sup(2)}`,
            options: [`2${sup(2)}`, `2${sup(10)}`, `2${sup(1)}`, `2${sup(0)}`],
            hint: `(2³)² = 2⁶\n2⁶ × 2⁻⁴ = 2²`
        },
        {
            text: `4${sup(2)} ÷ 2${sup(3)}`,
            answer: '2',
            options: ['2', '4', '8', '1'],
            hint: `4² = 16\n2³ = 8\n16 ÷ 8 = 2`
        },
        {
            text: `(ab)${sup(3)} ÷ a${sup(3)}`,
            answer: `b${sup(3)}`,
            options: [`b${sup(3)}`, `ab`, `(ab)${sup(3)}`, `a${sup(3)}b${sup(3)}`],
            hint: `(ab)³ = a³b³\na³b³ ÷ a³ = b³`
        }
    ];

    const expr = randomChoice(expressions);
    return {
        type: 'expression',
        questionType: 'Спрости вираз',
        text: expr.text,
        formula: 'Комбінація правил',
        answer: expr.answer,
        options: expr.options,
        hint: expr.hint
    };
}

function displayQuestion() {
    const q = state.currentQuestion;

    document.getElementById('questionType').textContent = q.questionType;
    document.getElementById('questionNumber').textContent = `Питання ${state.questionsAnswered + 1} / ${state.totalQuestions}`;
    document.getElementById('questionText').innerHTML = q.text;

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
    if (state.answered) return;
    state.answered = true;

    const q = state.currentQuestion;
    const isCorrect = selected === q.answer;

    // Disable all buttons and highlight
    document.querySelectorAll('.btn-answer').forEach(btn => {
        btn.disabled = true;
        if (btn.innerHTML === q.answer) btn.classList.add('correct');
        else if (btn.innerHTML === selected && !isCorrect) btn.classList.add('wrong');
    });

    // Update state
    if (isCorrect) {
        state.correct++;
    } else {
        state.wrong++;
    }

    // Update UI
    document.getElementById('correct').textContent = state.correct;
    document.getElementById('wrong').textContent = state.wrong;

    state.questionsAnswered++;
    document.getElementById('progressFill').style.width = `${(state.questionsAnswered / state.totalQuestions) * 100}%`;

    // Show feedback
    showFeedback(isCorrect);

    // Show next button or auto-advance
    if (state.questionsAnswered < state.totalQuestions) {
        document.getElementById('nextBtn').style.display = 'block';
    } else {
        setTimeout(showResults, 1500);
    }
}

function showFeedback(isCorrect) {
    const feedback = document.getElementById('feedback');
    if (isCorrect) {
        feedback.innerHTML = randomChoice(['Правильно! ✅', 'Вірно! 🎉', 'Молодець! ⭐']);
        feedback.className = 'feedback-container feedback-correct show';
    } else {
        feedback.innerHTML = `Відповідь: ${state.currentQuestion.answer}`;
        feedback.className = 'feedback-container feedback-wrong show';
    }
}

// Help functions
function showHint() {
    const q = state.currentQuestion;
    if (!q) return;

    showAIModal('💡 Підказка', q.hint);
    document.getElementById('hintBtn').disabled = true;
}

function showAIHelp() {
    const q = state.currentQuestion;
    if (!q) return;

    const explanation = `${q.hint}\n\n📐 Формула: ${q.formula}`;
    showAIModal('🤖 Допомога ШІ', explanation);
    document.getElementById('aiHelpBtn').disabled = true;
}

function showFormula() {
    const q = state.currentQuestion;
    if (!q) return;

    showAIModal('📐 Формула', q.formula);
    document.getElementById('formulaBtn').disabled = true;
}

function showAIModal(title, content) {
    const modal = document.getElementById('aiHelperModal');
    const titleEl = modal.querySelector('.ai-modal-title');
    const loading = document.getElementById('aiLoading');
    const response = document.getElementById('aiResponse');

    titleEl.innerHTML = `<span>${title.split(' ')[0]}</span><span>${title.split(' ').slice(1).join(' ')}</span>`;
    loading.style.display = 'none';
    response.innerHTML = content.replace(/\n/g, '<br>');
    modal.classList.remove('hidden');
}

function closeAIModal() {
    document.getElementById('aiHelperModal').classList.add('hidden');
}

function showResults() {
    const accuracy = state.correct + state.wrong > 0
        ? Math.round((state.correct / (state.correct + state.wrong)) * 100) : 0;
    const timeSpent = Math.round((Date.now() - state.startTime) / 1000);

    document.getElementById('finalCorrect').textContent = state.correct;
    document.getElementById('finalWrong').textContent = state.wrong;
    document.getElementById('finalAccuracy').textContent = `${accuracy}%`;

    // Set result icon and title
    const icon = document.getElementById('resultIcon');
    const title = document.getElementById('resultTitle');

    if (accuracy >= 90) {
        icon.textContent = '🏆';
        title.textContent = 'Бездоганно!';
    } else if (accuracy >= 70) {
        icon.textContent = '🎉';
        title.textContent = 'Чудово!';
    } else if (accuracy >= 50) {
        icon.textContent = '👍';
        title.textContent = 'Непогано!';
    } else {
        icon.textContent = '📚';
        title.textContent = 'Потрібно повторити';
    }

    // Save to Firebase
    saveToFirebase(accuracy, timeSpent);

    showScreen('result');
}

async function saveToFirebase(accuracy, timeSpent) {
    if (window.MathQuestFirebase) {
        try {
            await window.MathQuestFirebase.saveTrainerSession({
                trainerId: 'powers',
                trainerName: `Степені: ${TOPIC_NAMES[state.topic]}`,
                score: state.correct,
                totalQuestions: state.totalQuestions,
                timeSpent: timeSpent,
                difficulty: state.topic
            });
            console.log('✅ Session saved to Firebase');
        } catch (error) {
            console.error('❌ Firebase save error:', error);
        }
    }
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
    distractors.forEach(d => {
        if (d >= min && d <= max && d !== correct && Number.isInteger(d)) {
            options.add(d);
        }
    });
    while (options.size < 4) {
        const r = randomInt(min, max);
        if (r !== correct) options.add(r);
    }
    return Array.from(options).slice(0, 4);
}

console.log('⚡ Powers Trainer loaded');
