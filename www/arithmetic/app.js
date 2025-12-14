/* ===================================
   MATH QUEST - ARITHMETIC PROGRESSION TRAINER
   Full unified version with Help Panel & Firebase
   =================================== */

const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
}

// State
let state = {
    topic: 'mixed',
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

// Topic names
const TOPICS = {
    difference: 'Різниця d',
    nth_term: 'n-й член',
    sum: 'Сума Sₙ',
    mean: 'Середнє',
    missing: 'Пропущений член',
    mixed: 'Мікс'
};

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    topic: document.getElementById('topicScreen'),
    quiz: document.getElementById('quizScreen'),
    results: document.getElementById('resultsScreen'),
    theory: document.getElementById('theoryScreen')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // Start button
    document.getElementById('startBtn')?.addEventListener('click', () => showScreen('topic'));
    document.getElementById('backToStartBtn')?.addEventListener('click', () => showScreen('start'));

    // Topic buttons
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.topic = btn.dataset.topic;
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

    // Submit & Next buttons
    document.getElementById('submitBtn')?.addEventListener('click', checkAnswer);
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
    document.getElementById('restartBtn')?.addEventListener('click', startGame);
    document.getElementById('changeTopicBtn')?.addEventListener('click', () => showScreen('topic'));
    document.getElementById('theoryBtn')?.addEventListener('click', () => showScreen('theory'));
    document.getElementById('backFromTheoryBtn')?.addEventListener('click', () => showScreen('results'));
}

function showScreen(name) {
    Object.values(screens).forEach(s => s?.classList.remove('active'));
    screens[name]?.classList.add('active');

    // Show/hide progress container
    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
        progressContainer.style.display = (name === 'quiz') ? 'block' : 'none';
    }
}

function updateDifficultyIndicator() {
    const dots = document.querySelectorAll('.difficulty-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i < state.level);
    });
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

    document.getElementById('correctCount').textContent = '0';
    document.getElementById('streakNumber').textContent = '0';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('totalCount').textContent = state.totalQuestions;

    updateDifficultyIndicator();
    showScreen('quiz');
    nextQuestion();
}

function nextQuestion() {
    if (state.questionsAnswered >= state.totalQuestions) {
        showResults();
        return;
    }

    state.hintUsed = false;

    // Reset UI
    const feedbackContainer = document.getElementById('feedbackContainer');
    if (feedbackContainer) {
        feedbackContainer.style.display = 'none';
    }

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.style.display = 'none';

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.disabled = false;

    const input = document.getElementById('answerInput');
    if (input) {
        input.value = '';
        input.disabled = false;
        input.focus();
    }

    // Generate question based on topic
    const topic = state.topic === 'mixed' ? getRandomTopic() : state.topic;
    state.currentQuestion = generateQuestion(topic);

    displayQuestion();
}

function getRandomTopic() {
    const topics = ['difference', 'nth_term', 'sum', 'mean', 'missing'];
    return topics[Math.floor(Math.random() * topics.length)];
}

function generateQuestion(topic) {
    const generators = {
        difference: generateDifferenceQuestion,
        nth_term: generateNthTermQuestion,
        sum: generateSumQuestion,
        mean: generateMeanQuestion,
        missing: generateMissingQuestion
    };
    return generators[topic]();
}

// Question Generators
function generateDifferenceQuestion() {
    const a1 = randomInt(-10, 20);
    const d = randomInt(-8, 12);
    const n = randomInt(3, 5 + state.level);

    const sequence = [];
    for (let i = 0; i < n; i++) {
        sequence.push(a1 + i * d);
    }

    return {
        type: 'difference',
        topicName: 'Різниця d',
        text: 'Знайдіть різницю арифметичної прогресії:',
        sequence: sequence.join(', ') + ', ...',
        answer: d,
        hint: `Різниця d = a₂ − a₁ = ${sequence[1]} − ${sequence[0]} = ${d}`,
        formula: 'd = aₙ₊₁ − aₙ'
    };
}

function generateNthTermQuestion() {
    const a1 = randomInt(1, 15);
    const d = randomInt(-5, 10);
    const n = randomInt(5, 10 + state.level * 2);
    const answer = a1 + (n - 1) * d;

    return {
        type: 'nth_term',
        topicName: 'n-й член',
        text: `Знайдіть a${subscript(n)}, якщо a₁ = ${a1}, d = ${d}`,
        sequence: null,
        answer: answer,
        hint: `a${subscript(n)} = ${a1} + (${n} − 1) · ${d} = ${a1} + ${(n-1)*d} = ${answer}`,
        formula: 'aₙ = a₁ + (n − 1) · d'
    };
}

function generateSumQuestion() {
    const a1 = randomInt(1, 10);
    const d = randomInt(1, 5);
    const n = randomInt(4, 8 + state.level);
    const an = a1 + (n - 1) * d;
    const answer = (a1 + an) * n / 2;

    return {
        type: 'sum',
        topicName: 'Сума Sₙ',
        text: `Знайдіть S${subscript(n)}, якщо a₁ = ${a1}, d = ${d}`,
        sequence: null,
        answer: answer,
        hint: `a${subscript(n)} = ${a1} + (${n}−1)·${d} = ${an}\nS${subscript(n)} = (${a1} + ${an}) · ${n} / 2 = ${answer}`,
        formula: 'Sₙ = (a₁ + aₙ) · n / 2'
    };
}

function generateMeanQuestion() {
    const a1 = randomInt(1, 20);
    const d = randomInt(2, 10);

    const a_prev = a1;
    const a_next = a1 + 2 * d;
    const answer = a1 + d;

    if (Math.random() > 0.5) {
        return {
            type: 'mean',
            topicName: 'Середнє',
            text: `Знайдіть член прогресії між ${a_prev} і ${a_next}`,
            sequence: `${a_prev}, ?, ${a_next}`,
            answer: answer,
            hint: `Середнє арифметичне: (${a_prev} + ${a_next}) / 2 = ${answer}`,
            formula: 'aₙ = (aₙ₋₁ + aₙ₊₁) / 2'
        };
    } else {
        const middle = answer;
        return {
            type: 'mean',
            topicName: 'Середнє',
            text: `В прогресії: ${a_prev}, ${middle}, ?. Знайдіть третій член.`,
            sequence: `${a_prev}, ${middle}, ?`,
            answer: a_next,
            hint: `d = ${middle} − ${a_prev} = ${d}\na₃ = ${middle} + ${d} = ${a_next}`,
            formula: 'd = a₂ − a₁, a₃ = a₂ + d'
        };
    }
}

function generateMissingQuestion() {
    const a1 = randomInt(1, 15);
    const d = randomInt(2, 8);
    const length = randomInt(4, 6);
    const missingIndex = randomInt(1, length - 2);

    const sequence = [];
    for (let i = 0; i < length; i++) {
        sequence.push(a1 + i * d);
    }

    const answer = sequence[missingIndex];
    const displaySeq = sequence.map((v, i) => i === missingIndex ? '?' : v);

    return {
        type: 'missing',
        topicName: 'Пропущений член',
        text: 'Знайдіть пропущений член прогресії:',
        sequence: displaySeq.join(', '),
        answer: answer,
        hint: `d = ${sequence[1]} − ${sequence[0]} = ${d}\nПропущений = ${sequence[missingIndex - 1]} + ${d} = ${answer}`,
        formula: 'd = aₙ₊₁ − aₙ'
    };
}

function displayQuestion() {
    const q = state.currentQuestion;

    document.getElementById('topicBadge').textContent = q.topicName;
    document.getElementById('questionNumber').textContent = `Питання ${state.questionsAnswered + 1}`;
    document.getElementById('questionText').textContent = q.text;

    const seqDisplay = document.getElementById('sequenceDisplay');
    if (q.sequence) {
        seqDisplay.textContent = q.sequence;
        seqDisplay.style.display = 'block';
    } else {
        seqDisplay.style.display = 'none';
    }
}

function checkAnswer() {
    const input = document.getElementById('answerInput');
    const userAnswer = parseFloat(input.value.replace(',', '.'));

    if (isNaN(userAnswer)) {
        input.style.borderColor = 'var(--error)';
        setTimeout(() => input.style.borderColor = 'var(--border)', 500);
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

        // Level up on streak
        if (state.streak >= 5 && state.level < 3) {
            state.level++;
            updateDifficultyIndicator();
        }
    } else {
        state.wrong++;
        state.streak = 0;
    }

    document.getElementById('correctCount').textContent = state.correct;
    document.getElementById('streakNumber').textContent = state.streak;

    state.questionsAnswered++;
    const progress = (state.questionsAnswered / state.totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    // Show feedback
    showFeedback(isCorrect, q);

    // Show next button
    document.getElementById('nextBtn').style.display = 'block';
}

function showFeedback(isCorrect, question) {
    const container = document.getElementById('feedbackContainer');
    const icon = document.getElementById('feedbackIcon');
    const text = document.getElementById('feedbackText');
    const explanation = document.getElementById('feedbackExplanation');

    container.style.display = 'block';

    if (isCorrect) {
        const messages = ['Правильно!', 'Чудово!', 'Так тримати!', 'Вірно!'];
        icon.textContent = '✅';
        text.textContent = messages[Math.floor(Math.random() * messages.length)];
        text.style.color = 'var(--success)';
        explanation.textContent = `Відповідь: ${question.answer}`;
    } else {
        icon.textContent = '❌';
        text.textContent = `Правильна відповідь: ${question.answer}`;
        text.style.color = 'var(--error)';
        explanation.textContent = '';
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

    setTimeout(() => {
        loading.style.display = 'none';
        response.style.display = 'block';

        const q = state.currentQuestion;
        let explanation = '';

        switch (q.type) {
            case 'difference':
                explanation = `<p><strong>Як знайти різницю d:</strong></p>
                    <p>Різниця — це різниця між сусідніми членами.</p>
                    <p><em>d = a₂ − a₁ = a₃ − a₂ = ...</em></p>`;
                break;
            case 'nth_term':
                explanation = `<p><strong>Як знайти n-й член:</strong></p>
                    <p>1. Використай формулу aₙ = a₁ + (n-1)·d</p>
                    <p>2. Підстав відомі значення</p>`;
                break;
            case 'sum':
                explanation = `<p><strong>Як знайти суму:</strong></p>
                    <p>1. Знайди останній член aₙ</p>
                    <p>2. Використай Sₙ = (a₁ + aₙ)·n/2</p>`;
                break;
            case 'mean':
                explanation = `<p><strong>Середнє арифметичне:</strong></p>
                    <p>Кожен член (крім крайніх) — середнє сусідніх.</p>
                    <p><em>aₙ = (aₙ₋₁ + aₙ₊₁)/2</em></p>`;
                break;
            case 'missing':
                explanation = `<p><strong>Як знайти пропущений член:</strong></p>
                    <p>1. Знайди d за сусідніми членами</p>
                    <p>2. Додай або відніми d від відомого члена</p>`;
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
            <h4>📐 Формули арифметичної прогресії</h4>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">aₙ = a₁ + (n-1)·d</div>
                <div class="formula-note">n-й член прогресії</div>
            </div>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">d = aₙ₊₁ - aₙ</div>
                <div class="formula-note">Різниця прогресії</div>
            </div>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">Sₙ = (a₁ + aₙ)·n/2</div>
                <div class="formula-note">Сума n членів</div>
            </div>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">Sₙ = (2a₁ + (n-1)·d)·n/2</div>
                <div class="formula-note">Сума через a₁ і d</div>
            </div>
        </div>
    `;
}

function closeAIModal() {
    document.getElementById('aiHelperModal').classList.add('hidden');
}

// ========== RESULTS ==========

async function showResults() {
    const accuracy = state.correct + state.wrong > 0
        ? Math.round((state.correct / (state.correct + state.wrong)) * 100)
        : 0;

    const timeSpent = Math.round((Date.now() - state.startTime) / 1000);

    document.getElementById('resultCorrect').textContent = state.correct;
    document.getElementById('resultAccuracy').textContent = `${accuracy}%`;
    document.getElementById('resultLevel').textContent = state.level;

    const title = document.getElementById('resultsTitle');
    const icon = document.getElementById('resultsIcon');

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

    // Save to Firebase
    await saveToFirebase(accuracy, timeSpent);

    showScreen('results');
}

async function saveToFirebase(accuracy, timeSpent) {
    if (window.MathQuestFirebase) {
        try {
            await window.MathQuestFirebase.saveTrainerSession({
                trainerId: 'arithmetic',
                trainerName: 'Арифметична прогресія',
                score: state.correct,
                totalQuestions: state.totalQuestions,
                difficulty: state.level,
                accuracy: accuracy,
                maxStreak: state.maxStreak,
                timeSpent: timeSpent,
                topic: state.topic
            });
            console.log('Session saved to Firebase');
        } catch (error) {
            console.error('Error saving to Firebase:', error);
        }
    }
}

// ========== HELPERS ==========

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function subscript(n) {
    const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
    return String(n).split('').map(d => subscripts[parseInt(d)]).join('');
}
