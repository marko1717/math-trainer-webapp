/* ===================================
   MATH QUEST - PERCENT TRAINER
   Full unified version with Help Panel & Firebase
   =================================== */

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
    hintUsed: false,
    startTime: null
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
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.level = parseInt(btn.dataset.level);
            startGame();
        });
    });

    // Answer input
    const input = document.getElementById('answerInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkAnswer();
        });
    }

    // Submit button
    document.getElementById('submitBtn')?.addEventListener('click', checkAnswer);

    // Next button
    document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);

    // Help Panel buttons
    document.getElementById('hintBtn')?.addEventListener('click', showHint);
    document.getElementById('aiHelpBtn')?.addEventListener('click', showAIHelp);
    document.getElementById('formulaBtn')?.addEventListener('click', showFormulaHelp);

    // AI Modal close
    document.getElementById('aiCloseBtn')?.addEventListener('click', closeAIModal);
    document.getElementById('aiHelperModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'aiHelperModal') closeAIModal();
    });

    // Result buttons
    document.getElementById('nextLevelBtn')?.addEventListener('click', () => {
        if (state.level < 3) state.level++;
        startGame();
    });
    document.getElementById('restartBtn')?.addEventListener('click', startGame);
}

function showScreen(name) {
    Object.values(screens).forEach(s => s?.classList.remove('active'));
    screens[name]?.classList.add('active');

    // Show/hide progress container
    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
        progressContainer.style.display = (name === 'game') ? 'block' : 'none';
    }
}

function startGame() {
    state = {
        ...state,
        correct: 0,
        wrong: 0,
        streak: 0,
        maxStreak: 0,
        questionsAnswered: 0,
        hintUsed: false,
        startTime: Date.now()
    };

    document.getElementById('correct').textContent = '0';
    document.getElementById('streak').textContent = '0';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('totalQuestions').textContent = state.totalQuestions;

    showScreen('game');
    nextQuestion();
}

function nextQuestion() {
    if (state.questionsAnswered >= state.totalQuestions) {
        showResults();
        return;
    }

    state.hintUsed = false;

    // Reset UI
    const feedback = document.getElementById('feedback');
    if (feedback) feedback.innerHTML = '';

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.style.display = 'none';

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.disabled = false;

    const input = document.getElementById('answerInput');
    if (input) {
        input.value = '';
        input.classList.remove('correct', 'wrong');
        input.disabled = false;
        input.focus();
    }

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
        answer: answer,
        data: { p, A },
        hint: `Щоб знайти ${p}% від ${A}:\n1. Переведи % у десятковий дріб: ${p}% = ${p/100}\n2. Помнож: ${A} × ${p/100} = ${answer}`
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
        answer: p,
        answerSuffix: '%',
        data: { A, B },
        hint: `Щоб знайти скільки % складає ${B} від ${A}:\n1. Поділи частину на ціле: ${B} ÷ ${A} = ${B/A}\n2. Помнож на 100: ${B/A} × 100 = ${p}%`
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
        answer: A,
        data: { p, B },
        hint: `${p}% = ${B}, знайти 100%:\n1. Знайди 1%: ${B} ÷ ${p} = ${B/p}\n2. Знайди 100%: ${B/p} × 100 = ${A}`
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
        answer: answer,
        data: { p, A },
        hint: `Збільшити ${A} на ${p}%:\n1. Знайди ${p}% від ${A}: ${A} × ${p/100} = ${A * p/100}\n2. Додай до початкового: ${A} + ${A * p/100} = ${answer}`
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
        answer: answer,
        data: { p, A },
        hint: `Зменшити ${A} на ${p}%:\n1. Знайди ${p}% від ${A}: ${A} × ${p/100} = ${A * p/100}\n2. Відніми від початкового: ${A} - ${A * p/100} = ${answer}`
    };
}

function displayQuestion() {
    const q = state.currentQuestion;
    document.getElementById('questionType').textContent = q.questionType;
    document.getElementById('questionText').textContent = q.text;
    document.getElementById('questionNumber').textContent = `Питання ${state.questionsAnswered + 1}`;
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

    // Disable input and submit
    input.disabled = true;
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
    document.getElementById('streak').textContent = state.streak;

    state.questionsAnswered++;
    const progress = (state.questionsAnswered / state.totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    // Show next button
    document.getElementById('nextBtn').style.display = 'block';
}

function showFeedback(isCorrect, correctAnswer = null, suffix = '') {
    const feedback = document.getElementById('feedback');

    if (isCorrect) {
        const messages = ['Правильно! 🎉', 'Молодець! ✨', 'Вірно! ✅', 'Чудово! 💪'];
        feedback.innerHTML = `<div class="feedback-correct">${messages[Math.floor(Math.random() * messages.length)]}</div>`;
    } else {
        feedback.innerHTML = `<div class="feedback-wrong">Відповідь: ${correctAnswer}${suffix || ''}</div>`;
    }
}

// ========== HELP PANEL FUNCTIONS ==========

function showHint() {
    if (state.hintUsed) return;
    state.hintUsed = true;

    const modal = document.getElementById('aiHelperModal');
    const loading = document.getElementById('aiLoading');
    const response = document.getElementById('aiResponse');

    modal.classList.remove('hidden');
    loading.style.display = 'flex';
    response.style.display = 'none';

    // Simulate loading then show hint
    setTimeout(() => {
        loading.style.display = 'none';
        response.style.display = 'block';
        response.innerHTML = `
            <div class="ai-hint-content">
                <h4>💡 Підказка</h4>
                <p style="white-space: pre-line;">${state.currentQuestion.hint}</p>
            </div>
        `;
    }, 500);
}

function showAIHelp() {
    const modal = document.getElementById('aiHelperModal');
    const loading = document.getElementById('aiLoading');
    const response = document.getElementById('aiResponse');

    modal.classList.remove('hidden');
    loading.style.display = 'flex';
    response.style.display = 'none';

    // Show contextual help
    setTimeout(() => {
        loading.style.display = 'none';
        response.style.display = 'block';

        const q = state.currentQuestion;
        let explanation = '';

        switch (q.type) {
            case 'findPart':
                explanation = `<p><strong>Як знайти відсоток від числа:</strong></p>
                    <p>1. Перетвори відсоток у десятковий дріб (поділи на 100)</p>
                    <p>2. Помнож число на цей дріб</p>
                    <p><em>Формула: A × p ÷ 100</em></p>`;
                break;
            case 'findPercent':
                explanation = `<p><strong>Як знайти відсоткове відношення:</strong></p>
                    <p>1. Поділи частину на ціле</p>
                    <p>2. Помнож результат на 100</p>
                    <p><em>Формула: (B ÷ A) × 100%</em></p>`;
                break;
            case 'findWhole':
                explanation = `<p><strong>Як знайти число за його відсотком:</strong></p>
                    <p>1. Визнач скільки це 1%</p>
                    <p>2. Помнож на 100</p>
                    <p><em>Формула: B × 100 ÷ p</em></p>`;
                break;
            case 'increase':
                explanation = `<p><strong>Як збільшити число на відсоток:</strong></p>
                    <p>1. Знайди скільки це відсотків</p>
                    <p>2. Додай до початкового числа</p>
                    <p><em>Формула: A × (1 + p/100)</em></p>`;
                break;
            case 'decrease':
                explanation = `<p><strong>Як зменшити число на відсоток:</strong></p>
                    <p>1. Знайди скільки це відсотків</p>
                    <p>2. Відніми від початкового числа</p>
                    <p><em>Формула: A × (1 - p/100)</em></p>`;
                break;
        }

        response.innerHTML = `
            <div class="ai-help-content">
                <h4>🤖 Допомога</h4>
                ${explanation}
            </div>
        `;
    }, 600);
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
            <h4>📐 Формули відсотків</h4>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">p% від A = A × p ÷ 100</div>
                <div class="formula-note">Знайти частину</div>
            </div>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">p = (B ÷ A) × 100%</div>
                <div class="formula-note">Знайти відсоток</div>
            </div>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">A = B × 100 ÷ p</div>
                <div class="formula-note">Знайти ціле число</div>
            </div>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">Збільшення: A × (1 + p/100)</div>
                <div class="formula-note">Зменшення: A × (1 - p/100)</div>
            </div>
        </div>
    `;
}

function closeAIModal() {
    const modal = document.getElementById('aiHelperModal');
    modal.classList.add('hidden');
}

// ========== RESULTS ==========

async function showResults() {
    const accuracy = state.correct + state.wrong > 0
        ? Math.round((state.correct / (state.correct + state.wrong)) * 100)
        : 0;

    const timeSpent = Math.round((Date.now() - state.startTime) / 1000);

    document.getElementById('finalCorrect').textContent = state.correct;
    document.getElementById('finalWrong').textContent = state.wrong;
    document.getElementById('finalAccuracy').textContent = `${accuracy}%`;

    const title = document.getElementById('resultTitle');
    const icon = document.getElementById('resultIcon');

    if (accuracy >= 90) {
        title.textContent = 'Бездоганно!';
        icon.textContent = '🏆';
    } else if (accuracy >= 70) {
        title.textContent = 'Чудова робота!';
        icon.textContent = '🎉';
    } else if (accuracy >= 50) {
        title.textContent = 'Непогано!';
        icon.textContent = '👍';
    } else {
        title.textContent = 'Потрібно повторити';
        icon.textContent = '📚';
    }

    // Hide next level button on level 3
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    if (nextLevelBtn) {
        nextLevelBtn.style.display = state.level < 3 ? 'block' : 'none';
    }

    // Save to Firebase
    await saveToFirebase(accuracy, timeSpent);

    showScreen('result');
}

async function saveToFirebase(accuracy, timeSpent) {
    if (window.MathQuestFirebase) {
        try {
            await window.MathQuestFirebase.saveTrainerSession({
                trainerId: 'percent',
                trainerName: 'Відсотки',
                score: state.correct,
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
