/* ===================================
   MATH QUEST - GEOMETRIC PROGRESSION TRAINER
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
    ratio: 'Знаменник q',
    nth_term: 'n-й член',
    sum: 'Сума Sₙ',
    mean: 'Середнє геом.',
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

    const feedbackContainer = document.getElementById('feedbackContainer');
    if (feedbackContainer) feedbackContainer.style.display = 'none';

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

    const topic = state.topic === 'mixed' ? getRandomTopic() : state.topic;
    state.currentQuestion = generateQuestion(topic);

    displayQuestion();
}

function getRandomTopic() {
    const topics = ['ratio', 'nth_term', 'sum', 'mean', 'missing'];
    return topics[Math.floor(Math.random() * topics.length)];
}

function generateQuestion(topic) {
    const generators = {
        ratio: generateRatioQuestion,
        nth_term: generateNthTermQuestion,
        sum: generateSumQuestion,
        mean: generateMeanQuestion,
        missing: generateMissingQuestion
    };
    return generators[topic]();
}

// Question Generators
function generateRatioQuestion() {
    const possibleQ = [2, 3, 4, 5, -2, -3];
    const q = possibleQ[Math.floor(Math.random() * possibleQ.length)];
    const b1 = randomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
    const n = randomInt(3, 4 + state.level);

    const sequence = [];
    let current = b1;
    for (let i = 0; i < n; i++) {
        sequence.push(current);
        current *= q;
    }

    return {
        type: 'ratio',
        topicName: 'Знаменник q',
        text: 'Знайдіть знаменник геометричної прогресії:',
        sequence: sequence.join(', ') + ', ...',
        answer: q,
        hint: `q = b₂ / b₁ = ${sequence[1]} / ${sequence[0]} = ${q}`,
        formula: 'q = bₙ₊₁ / bₙ'
    };
}

function generateNthTermQuestion() {
    const b1 = randomInt(1, 5);
    const possibleQ = [2, 3, -2];
    const q = possibleQ[Math.floor(Math.random() * possibleQ.length)];
    const n = randomInt(3, 5 + state.level);
    const answer = b1 * Math.pow(q, n - 1);

    return {
        type: 'nth_term',
        topicName: 'n-й член',
        text: `Знайдіть b${subscript(n)}, якщо b₁ = ${b1}, q = ${q}`,
        sequence: null,
        answer: answer,
        hint: `b${subscript(n)} = ${b1} · ${q}^${n-1} = ${b1} · ${Math.pow(q, n-1)} = ${answer}`,
        formula: 'bₙ = b₁ · qⁿ⁻¹'
    };
}

function generateSumQuestion() {
    const b1 = randomInt(1, 4);
    const possibleQ = [2, 3];
    const q = possibleQ[Math.floor(Math.random() * possibleQ.length)];
    const n = randomInt(3, 5 + Math.floor(state.level / 2));

    const qn = Math.pow(q, n);
    const answer = b1 * (qn - 1) / (q - 1);

    return {
        type: 'sum',
        topicName: 'Сума Sₙ',
        text: `Знайдіть S${subscript(n)}, якщо b₁ = ${b1}, q = ${q}`,
        sequence: null,
        answer: answer,
        hint: `S${subscript(n)} = ${b1} · (${q}^${n} − 1) / (${q} − 1) = ${b1} · ${qn - 1} / ${q - 1} = ${answer}`,
        formula: 'Sₙ = b₁ · (qⁿ − 1) / (q − 1)'
    };
}

function generateMeanQuestion() {
    const b1 = randomInt(1, 6);
    const q = randomInt(2, 4);

    const b_prev = b1;
    const b_next = b1 * q * q;
    const answer = b1 * q;

    if (Math.random() > 0.5) {
        return {
            type: 'mean',
            topicName: 'Середнє геом.',
            text: `Знайдіть член прогресії між ${b_prev} і ${b_next}`,
            sequence: `${b_prev}, ?, ${b_next}`,
            answer: answer,
            hint: `Середнє геометричне: √(${b_prev} · ${b_next}) = √${b_prev * b_next} = ${answer}`,
            formula: 'bₙ = √(bₙ₋₁ · bₙ₊₁)'
        };
    } else {
        const middle = answer;
        return {
            type: 'mean',
            topicName: 'Середнє геом.',
            text: `В прогресії: ${b_prev}, ${middle}, ?. Знайдіть третій член.`,
            sequence: `${b_prev}, ${middle}, ?`,
            answer: b_next,
            hint: `q = ${middle} / ${b_prev} = ${q}\nb₃ = ${middle} · ${q} = ${b_next}`,
            formula: 'q = b₂ / b₁, b₃ = b₂ · q'
        };
    }
}

function generateMissingQuestion() {
    const b1 = randomInt(1, 4);
    const q = randomInt(2, 3);
    const length = randomInt(4, 5);
    const missingIndex = randomInt(1, length - 2);

    const sequence = [];
    let current = b1;
    for (let i = 0; i < length; i++) {
        sequence.push(current);
        current *= q;
    }

    const answer = sequence[missingIndex];
    const displaySeq = sequence.map((v, i) => i === missingIndex ? '?' : v);

    return {
        type: 'missing',
        topicName: 'Пропущений член',
        text: 'Знайдіть пропущений член прогресії:',
        sequence: displaySeq.join(', '),
        answer: answer,
        hint: `q = ${sequence[1]} / ${sequence[0]} = ${q}\nПропущений = ${sequence[missingIndex - 1]} · ${q} = ${answer}`,
        formula: 'q = bₙ₊₁ / bₙ'
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

    input.disabled = true;
    document.getElementById('submitBtn').disabled = true;

    if (isCorrect) {
        state.correct++;
        state.streak++;
        if (state.streak > state.maxStreak) state.maxStreak = state.streak;

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

    showFeedback(isCorrect, q);
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
            case 'ratio':
                explanation = `<p><strong>Як знайти знаменник q:</strong></p>
                    <p>Знаменник — це відношення сусідніх членів.</p>
                    <p><em>q = b₂ / b₁ = b₃ / b₂ = ...</em></p>`;
                break;
            case 'nth_term':
                explanation = `<p><strong>Як знайти n-й член:</strong></p>
                    <p>1. Використай формулу bₙ = b₁ · qⁿ⁻¹</p>
                    <p>2. Обчисли qⁿ⁻¹, потім помнож на b₁</p>`;
                break;
            case 'sum':
                explanation = `<p><strong>Як знайти суму:</strong></p>
                    <p>Використай формулу:</p>
                    <p><em>Sₙ = b₁ · (qⁿ - 1) / (q - 1)</em></p>`;
                break;
            case 'mean':
                explanation = `<p><strong>Середнє геометричне:</strong></p>
                    <p>Кожен член — корінь квадратний з добутку сусідніх.</p>
                    <p><em>bₙ = √(bₙ₋₁ · bₙ₊₁)</em></p>`;
                break;
            case 'missing':
                explanation = `<p><strong>Як знайти пропущений член:</strong></p>
                    <p>1. Знайди q за сусідніми членами</p>
                    <p>2. Помнож або поділи відомий член на q</p>`;
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
            <h4>📐 Формули геометричної прогресії</h4>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">bₙ = b₁ · qⁿ⁻¹</div>
                <div class="formula-note">n-й член прогресії</div>
            </div>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">q = bₙ₊₁ / bₙ</div>
                <div class="formula-note">Знаменник прогресії</div>
            </div>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">Sₙ = b₁(qⁿ - 1)/(q - 1)</div>
                <div class="formula-note">Сума n членів (q ≠ 1)</div>
            </div>
            <div class="theory-card" style="margin-bottom: 1rem;">
                <div class="formula-main">S = b₁/(1 - q)</div>
                <div class="formula-note">Нескінченна сума (|q| &lt; 1)</div>
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

    await saveToFirebase(accuracy, timeSpent);
    showScreen('results');
}

async function saveToFirebase(accuracy, timeSpent) {
    if (window.MathQuestFirebase) {
        try {
            await window.MathQuestFirebase.saveTrainerSession({
                trainerId: 'geometric',
                trainerName: 'Геометрична прогресія',
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
