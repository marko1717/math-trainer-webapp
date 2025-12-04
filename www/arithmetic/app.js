// Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
}

// State
let currentTopic = 'mixed';
let currentQuestion = null;
let correctCount = 0;
let streak = 0;
let bestStreak = 0;
let level = 1;
let questionsAnswered = 0;

// Topics
const topics = {
    difference: 'Різниця d',
    nth_term: 'n-й член',
    sum: 'Сума Sₙ',
    mean: 'Середнє арифметичне',
    missing: 'Пропущений член',
    mixed: 'Мікс'
};

// Show sections
function showTheory() {
    hideAllSections();
    document.getElementById('theory-section').classList.remove('hidden');
}

function showTopics() {
    hideAllSections();
    document.getElementById('topic-section').classList.remove('hidden');
}

function startPractice() {
    showTopics();
}

function selectTopic(topic) {
    currentTopic = topic;
    document.getElementById('topic-name').textContent = topics[topic];
    hideAllSections();
    document.getElementById('practice-section').classList.remove('hidden');
    generateQuestion();
}

function hideAllSections() {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
}

// Generate question based on topic and level
function generateQuestion() {
    const topic = currentTopic === 'mixed' ? getRandomTopic() : currentTopic;

    const generators = {
        difference: generateDifferenceQuestion,
        nth_term: generateNthTermQuestion,
        sum: generateSumQuestion,
        mean: generateMeanQuestion,
        missing: generateMissingQuestion
    };

    currentQuestion = generators[topic]();
    displayQuestion();
}

function getRandomTopic() {
    const topics = ['difference', 'nth_term', 'sum', 'mean', 'missing'];
    return topics[Math.floor(Math.random() * topics.length)];
}

// Question generators
function generateDifferenceQuestion() {
    const a1 = randomInt(-10, 20) * (level > 2 ? 1 : 1);
    const d = randomInt(-8, 12);
    const n = randomInt(3, 5 + level);

    const sequence = [];
    for (let i = 0; i < n; i++) {
        sequence.push(a1 + i * d);
    }

    return {
        type: 'difference',
        text: 'Знайдіть різницю арифметичної прогресії:',
        sequence: sequence.join(', ') + ', ...',
        answer: d,
        hint: 'Різниця d = a₂ − a₁',
        formula: 'd = aₙ₊₁ − aₙ',
        explanation: `Різниця прогресії — це різниця між сусідніми членами.\nd = ${sequence[1]} − ${sequence[0]} = ${d}`
    };
}

function generateNthTermQuestion() {
    const a1 = randomInt(1, 15);
    const d = randomInt(-5, 10);
    const n = randomInt(5, 10 + level * 2);
    const answer = a1 + (n - 1) * d;

    return {
        type: 'nth_term',
        text: `Знайдіть a${subscript(n)}, якщо a₁ = ${a1}, d = ${d}`,
        sequence: null,
        answer: answer,
        hint: `Підставте у формулу: a${subscript(n)} = a₁ + (n−1)·d`,
        formula: 'aₙ = a₁ + (n − 1) · d',
        explanation: `a${subscript(n)} = ${a1} + (${n} − 1) · ${d} = ${a1} + ${n-1} · ${d} = ${a1} + ${(n-1)*d} = ${answer}`
    };
}

function generateSumQuestion() {
    const a1 = randomInt(1, 10);
    const d = randomInt(1, 5);
    const n = randomInt(4, 8 + level);
    const an = a1 + (n - 1) * d;
    const answer = (a1 + an) * n / 2;

    return {
        type: 'sum',
        text: `Знайдіть суму перших ${n} членів прогресії, якщо a₁ = ${a1}, d = ${d}`,
        sequence: null,
        answer: answer,
        hint: `Спочатку знайдіть a${subscript(n)}, потім суму`,
        formula: 'Sₙ = (a₁ + aₙ) · n / 2',
        explanation: `a${subscript(n)} = ${a1} + (${n}−1)·${d} = ${an}\nS${subscript(n)} = (${a1} + ${an}) · ${n} / 2 = ${a1 + an} · ${n} / 2 = ${answer}`
    };
}

function generateMeanQuestion() {
    const a1 = randomInt(1, 20);
    const d = randomInt(2, 10);

    const a_prev = a1;
    const a_next = a1 + 2 * d;
    const answer = a1 + d; // середній член

    if (Math.random() > 0.5) {
        // Знайти середній член
        return {
            type: 'mean',
            text: `Знайдіть член прогресії між ${a_prev} і ${a_next}`,
            sequence: `${a_prev}, ?, ${a_next}`,
            answer: answer,
            hint: 'Середній член = (попередній + наступний) / 2',
            formula: 'aₙ = (aₙ₋₁ + aₙ₊₁) / 2',
            explanation: `Середнє арифметичне: (${a_prev} + ${a_next}) / 2 = ${a_prev + a_next} / 2 = ${answer}`
        };
    } else {
        // Знайти один з крайніх
        const middle = answer;
        return {
            type: 'mean',
            text: `В прогресії: ${a_prev}, ${middle}, ?. Знайдіть третій член.`,
            sequence: `${a_prev}, ${middle}, ?`,
            answer: a_next,
            hint: 'Різниця d однакова між усіма членами',
            formula: 'd = a₂ − a₁, потім a₃ = a₂ + d',
            explanation: `d = ${middle} − ${a_prev} = ${d}\na₃ = ${middle} + ${d} = ${a_next}`
        };
    }
}

function generateMissingQuestion() {
    const a1 = randomInt(1, 15);
    const d = randomInt(2, 8);
    const length = randomInt(4, 6);
    const missingIndex = randomInt(1, length - 2); // не перший і не останній

    const sequence = [];
    for (let i = 0; i < length; i++) {
        sequence.push(a1 + i * d);
    }

    const answer = sequence[missingIndex];
    const displaySeq = sequence.map((v, i) => i === missingIndex ? '?' : v);

    return {
        type: 'missing',
        text: 'Знайдіть пропущений член прогресії:',
        sequence: displaySeq.join(', '),
        answer: answer,
        hint: 'Знайдіть різницю d за сусідніми членами',
        formula: 'd = aₙ₊₁ − aₙ',
        explanation: `d = ${sequence[missingIndex + 1] || sequence[missingIndex - 1] + d} − ${sequence[missingIndex - 1] || sequence[0]} / відстань = ${d}\nПропущений член = ${sequence[missingIndex - 1]} + ${d} = ${answer}`
    };
}

// Display question
function displayQuestion() {
    document.getElementById('question-text').textContent = currentQuestion.text;

    const seqDisplay = document.getElementById('sequence-display');
    if (currentQuestion.sequence) {
        seqDisplay.textContent = currentQuestion.sequence;
        seqDisplay.classList.remove('hidden');
    } else {
        seqDisplay.classList.add('hidden');
    }

    document.getElementById('answer-input').value = '';
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('hint-box').classList.add('hidden');
    document.getElementById('level-badge').textContent = `Рівень ${level}`;

    // Focus on input
    setTimeout(() => document.getElementById('answer-input').focus(), 100);
}

// Check answer
function checkAnswer() {
    const userAnswer = parseFloat(document.getElementById('answer-input').value.replace(',', '.'));
    const feedback = document.getElementById('feedback');

    if (isNaN(userAnswer)) {
        feedback.textContent = '⚠️ Введіть число';
        feedback.className = 'feedback incorrect';
        feedback.classList.remove('hidden');
        return;
    }

    const isCorrect = Math.abs(userAnswer - currentQuestion.answer) < 0.01;

    if (isCorrect) {
        correctCount++;
        streak++;
        if (streak > bestStreak) bestStreak = streak;
        questionsAnswered++;

        // Level up
        if (streak >= 5 && level < 3) {
            level++;
        }

        feedback.innerHTML = `✅ Правильно! Відповідь: ${currentQuestion.answer}`;
        feedback.className = 'feedback correct';

        // Haptic feedback
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
    } else {
        streak = 0;
        if (level > 1 && questionsAnswered > 3) level--;

        feedback.innerHTML = `❌ Неправильно. Правильна відповідь: ${currentQuestion.answer}`;
        feedback.className = 'feedback incorrect';

        if (tg?.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('error');
        }
    }

    feedback.classList.remove('hidden');
    updateStats();
}

// Hints
function showHint() {
    const hintBox = document.getElementById('hint-box');
    hintBox.innerHTML = `<h4>💡 Підказка</h4><p>${currentQuestion.hint}</p>`;
    hintBox.className = 'hint-box';
    hintBox.classList.remove('hidden');
}

function showFormula() {
    const hintBox = document.getElementById('hint-box');
    hintBox.innerHTML = `<h4>📐 Формула</h4><div class="formula" style="margin: 10px 0;">${currentQuestion.formula}</div>`;
    hintBox.className = 'hint-box';
    hintBox.classList.remove('hidden');
}

async function getAIHelp() {
    const hintBox = document.getElementById('hint-box');
    hintBox.innerHTML = `<h4>🤖 ШІ думає...</h4><div class="loading"></div>`;
    hintBox.className = 'hint-box ai-hint';
    hintBox.classList.remove('hidden');

    try {
        // Use cached AI hints if available
        if (typeof getAIHint === 'function') {
            const result = await getAIHint(
                'arithmetic_progression',
                currentQuestion.text + (currentQuestion.sequence ? ' ' + currentQuestion.sequence : ''),
                level,
                { type: currentQuestion.type }
            );

            hintBox.innerHTML = `<h4>🤖 Пояснення ШІ</h4><p>${result.hint}</p>`;
        } else {
            // Fallback to local explanation
            hintBox.innerHTML = `<h4>🤖 Пояснення</h4><p>${currentQuestion.explanation}</p>`;
        }
    } catch (e) {
        hintBox.innerHTML = `<h4>📝 Розв'язок</h4><p>${currentQuestion.explanation}</p>`;
    }
}

// Navigation
function nextQuestion() {
    generateQuestion();
}

function updateStats() {
    document.getElementById('correct').textContent = correctCount;
    document.getElementById('streak').textContent = streak;
}

// Helpers
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function subscript(n) {
    const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
    return String(n).split('').map(d => subscripts[parseInt(d)]).join('');
}

// Enter key to submit
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !document.getElementById('practice-section').classList.contains('hidden')) {
        checkAnswer();
    }
});

// Initialize
updateStats();
