// Percent Trainer
// Learn percentages through proportions, decimals, and formulas

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

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    result: document.getElementById('resultScreen')
};

// Nice numbers for problems
const NICE_PERCENTS = {
    1: [10, 20, 25, 50, 100],
    2: [5, 15, 30, 40, 60, 75],
    3: [12, 18, 22, 35, 45, 65, 80, 125, 150]
};

const NICE_NUMBERS = {
    1: [20, 40, 50, 80, 100, 200],
    2: [24, 36, 48, 60, 120, 150, 180, 250],
    3: [15, 45, 72, 96, 125, 175, 240, 320, 450]
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // Level buttons
    document.querySelectorAll('.btn-level').forEach(btn => {
        btn.addEventListener('click', () => {
            state.level = parseInt(btn.dataset.level);
            startGame();
        });
    });

    // Answer input
    const input = document.getElementById('answerInput');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    // Submit button
    document.getElementById('submitBtn').addEventListener('click', checkAnswer);

    // Hint button
    document.getElementById('hintBtn').addEventListener('click', showHint);

    // Result buttons
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
    state = {
        ...state,
        correct: 0,
        wrong: 0,
        streak: 0,
        maxStreak: 0,
        questionsAnswered: 0,
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
    document.getElementById('hintContainer').classList.remove('show');
    document.getElementById('feedback').classList.remove('show');
    document.getElementById('submitBtn').disabled = false;

    const input = document.getElementById('answerInput');
    input.value = '';
    input.classList.remove('correct', 'wrong');
    input.focus();

    state.currentQuestion = generateQuestion();
    displayQuestion();
}

function generateQuestion() {
    const types = getQuestionTypes();
    const type = types[Math.floor(Math.random() * types.length)];

    switch (type) {
        case 'findPart': return generateFindPart();
        case 'findPercent': return generateFindPercent();
        case 'findWhole': return generateFindWhole();
        case 'increase': return generateIncrease();
        case 'decrease': return generateDecrease();
        case 'compare': return generateCompare();
        default: return generateFindPart();
    }
}

function getQuestionTypes() {
    switch (state.level) {
        case 1: return ['findPart', 'findPart', 'findPercent'];
        case 2: return ['findPart', 'findPercent', 'findWhole', 'findWhole'];
        case 3: return ['findPart', 'findPercent', 'findWhole', 'increase', 'decrease'];
        default: return ['findPart'];
    }
}

// Level 1-3: Find p% of A
function generateFindPart() {
    const percents = NICE_PERCENTS[state.level];
    const numbers = NICE_NUMBERS[state.level];

    const p = percents[Math.floor(Math.random() * percents.length)];
    const A = numbers[Math.floor(Math.random() * numbers.length)];
    const answer = A * p / 100;

    return {
        type: 'findPart',
        questionType: 'Знайди частину',
        text: `Скільки буде ${p}% від ${A}?`,
        methodHint: 'Формула: A × p ÷ 100',
        answer: answer,
        data: { p, A },
        hint: `Щоб знайти ${p}% від ${A}:
1. Переведи % у десятковий дріб: ${p}% = ${p/100}
2. Помнож: ${A} × ${p/100} = ${answer}

Або пропорцією:
${A} — 100%
x — ${p}%
x = ${A} × ${p} ÷ 100 = ${answer}`
    };
}

// Level 1-3: What percent is B of A?
function generateFindPercent() {
    const percents = NICE_PERCENTS[state.level];
    const numbers = NICE_NUMBERS[state.level];

    const p = percents[Math.floor(Math.random() * percents.length)];
    const A = numbers[Math.floor(Math.random() * numbers.length)];
    const B = A * p / 100;

    return {
        type: 'findPercent',
        questionType: 'Знайди відсоток',
        text: `${B} — це скільки відсотків від ${A}?`,
        methodHint: 'Формула: (B ÷ A) × 100',
        answer: p,
        answerSuffix: '%',
        data: { A, B },
        hint: `Щоб знайти скільки % складає ${B} від ${A}:
1. Поділи частину на ціле: ${B} ÷ ${A} = ${B/A}
2. Помнож на 100: ${B/A} × 100 = ${p}%

Або пропорцією:
${A} — 100%
${B} — x%
x = ${B} × 100 ÷ ${A} = ${p}%`
    };
}

// Level 2-3: Find A if p% of A equals B
function generateFindWhole() {
    const percents = NICE_PERCENTS[state.level];
    const numbers = NICE_NUMBERS[state.level];

    const p = percents[Math.floor(Math.random() * percents.length)];
    const A = numbers[Math.floor(Math.random() * numbers.length)];
    const B = A * p / 100;

    return {
        type: 'findWhole',
        questionType: 'Знайди ціле',
        text: `${p}% числа дорівнює ${B}. Знайди це число.`,
        methodHint: 'Формула: B × 100 ÷ p',
        answer: A,
        data: { p, B },
        hint: `${p}% = ${B}, знайти 100%:
1. Знайди 1%: ${B} ÷ ${p} = ${B/p}
2. Знайди 100%: ${B/p} × 100 = ${A}

Або формулою:
Число = ${B} × 100 ÷ ${p} = ${A}`
    };
}

// Level 3: Increase by p%
function generateIncrease() {
    const percents = [10, 20, 25, 50];
    const numbers = [40, 60, 80, 100, 120, 200];

    const p = percents[Math.floor(Math.random() * percents.length)];
    const A = numbers[Math.floor(Math.random() * numbers.length)];
    const answer = A * (1 + p/100);

    return {
        type: 'increase',
        questionType: 'Збільшення',
        text: `Збільш ${A} на ${p}%`,
        methodHint: 'Формула: A × (1 + p/100)',
        answer: answer,
        data: { p, A },
        hint: `Збільшити ${A} на ${p}%:
1. Знайди ${p}% від ${A}: ${A} × ${p/100} = ${A * p/100}
2. Додай до початкового: ${A} + ${A * p/100} = ${answer}

Або одразу: ${A} × ${1 + p/100} = ${answer}`
    };
}

// Level 3: Decrease by p%
function generateDecrease() {
    const percents = [10, 20, 25, 50];
    const numbers = [40, 60, 80, 100, 120, 200];

    const p = percents[Math.floor(Math.random() * percents.length)];
    const A = numbers[Math.floor(Math.random() * numbers.length)];
    const answer = A * (1 - p/100);

    return {
        type: 'decrease',
        questionType: 'Зменшення',
        text: `Зменш ${A} на ${p}%`,
        methodHint: 'Формула: A × (1 - p/100)',
        answer: answer,
        data: { p, A },
        hint: `Зменшити ${A} на ${p}%:
1. Знайди ${p}% від ${A}: ${A} × ${p/100} = ${A * p/100}
2. Відніми від початкового: ${A} - ${A * p/100} = ${answer}

Або одразу: ${A} × ${1 - p/100} = ${answer}`
    };
}

function displayQuestion() {
    const q = state.currentQuestion;
    document.getElementById('questionType').textContent = q.questionType;
    document.getElementById('questionText').textContent = q.text;
    document.getElementById('methodHint').textContent = q.methodHint;
}

function checkAnswer() {
    const input = document.getElementById('answerInput');
    const userAnswer = parseFloat(input.value.replace(',', '.').replace('%', ''));

    if (isNaN(userAnswer)) {
        input.classList.add('wrong');
        setTimeout(() => input.classList.remove('wrong'), 500);
        return;
    }

    const q = state.currentQuestion;
    const isCorrect = Math.abs(userAnswer - q.answer) < 0.01;

    document.getElementById('submitBtn').disabled = true;

    if (isCorrect) {
        state.correct++;
        state.streak++;
        if (state.streak > state.maxStreak) state.maxStreak = state.streak;
        input.classList.add('correct');
        showFeedback(true);
    } else {
        state.wrong++;
        state.streak = 0;
        input.classList.add('wrong');
        showFeedback(false, q.answer, q.answerSuffix);
    }

    document.getElementById('correct').textContent = state.correct;
    document.getElementById('wrong').textContent = state.wrong;
    document.getElementById('streak').textContent = state.streak;

    state.questionsAnswered++;
    const progress = (state.questionsAnswered / state.totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    setTimeout(nextQuestion, isCorrect ? 1200 : 2500);
}

function showFeedback(isCorrect, correctAnswer = null, suffix = '') {
    const feedback = document.getElementById('feedback');

    if (isCorrect) {
        const messages = ['Правильно! 🎉', 'Молодець! ✨', 'Вірно! ✅', 'Чудово! 💪'];
        feedback.textContent = messages[Math.floor(Math.random() * messages.length)];
        feedback.className = 'feedback show correct';
    } else {
        feedback.textContent = `Відповідь: ${correctAnswer}${suffix || ''}`;
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
    hintText.textContent = '';

    // Try AI hint, fall back to local
    if (window.AIHints) {
        const result = await window.AIHints.getHint(
            'percent',
            state.currentQuestion.text,
            state.level,
            { type: state.currentQuestion.type, data: state.currentQuestion.data }
        );
        hintLoading.classList.add('hidden');
        hintText.textContent = result.hint;
    } else {
        // Fallback to local hint
        hintLoading.classList.add('hidden');
        hintText.textContent = state.currentQuestion.hint;
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
    if (accuracy >= 90) title.textContent = '🏆 Бездоганно!';
    else if (accuracy >= 70) title.textContent = '🎉 Чудово!';
    else if (accuracy >= 50) title.textContent = '👍 Непогано!';
    else title.textContent = '📚 Потрібно повторити';

    // Hide next level button on level 3
    document.getElementById('nextLevelBtn').style.display = state.level < 3 ? 'block' : 'none';

    // Save progress
    if (window.Progress) {
        window.Progress.saveSession('percent', {
            level: state.level,
            correct: state.correct,
            wrong: state.wrong,
            streak: state.maxStreak,
            accuracy,
            completed: accuracy >= 70
        });
    }

    showScreen('result');
}
