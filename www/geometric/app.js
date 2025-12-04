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
    ratio: 'Знаменник q',
    nth_term: 'n-й член',
    sum: 'Сума Sₙ',
    mean: 'Середнє геометричне',
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
        ratio: generateRatioQuestion,
        nth_term: generateNthTermQuestion,
        sum: generateSumQuestion,
        mean: generateMeanQuestion,
        missing: generateMissingQuestion
    };

    currentQuestion = generators[topic]();
    displayQuestion();
}

function getRandomTopic() {
    const topics = ['ratio', 'nth_term', 'sum', 'mean', 'missing'];
    return topics[Math.floor(Math.random() * topics.length)];
}

// Question generators
function generateRatioQuestion() {
    // Використовуємо цілі знаменники для простоти
    const possibleQ = [2, 3, 4, 5, -2, -3];
    const q = possibleQ[Math.floor(Math.random() * possibleQ.length)];
    const b1 = randomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
    const n = randomInt(3, 4 + level);

    const sequence = [];
    let current = b1;
    for (let i = 0; i < n; i++) {
        sequence.push(current);
        current *= q;
    }

    return {
        type: 'ratio',
        text: 'Знайдіть знаменник геометричної прогресії:',
        sequence: sequence.join(', ') + ', ...',
        answer: q,
        hint: 'Знаменник q = b₂ / b₁',
        formula: 'q = bₙ₊₁ / bₙ',
        explanation: `Знаменник прогресії — це відношення сусідніх членів.\nq = ${sequence[1]} / ${sequence[0]} = ${q}`
    };
}

function generateNthTermQuestion() {
    const b1 = randomInt(1, 5);
    const possibleQ = [2, 3, -2];
    const q = possibleQ[Math.floor(Math.random() * possibleQ.length)];
    const n = randomInt(3, 5 + level);
    const answer = b1 * Math.pow(q, n - 1);

    return {
        type: 'nth_term',
        text: `Знайдіть b${subscript(n)}, якщо b₁ = ${b1}, q = ${q}`,
        sequence: null,
        answer: answer,
        hint: `Підставте у формулу: b${subscript(n)} = b₁ · q^(n−1)`,
        formula: 'bₙ = b₁ · qⁿ⁻¹',
        explanation: `b${subscript(n)} = ${b1} · ${q}^${n-1} = ${b1} · ${Math.pow(q, n-1)} = ${answer}`
    };
}

function generateSumQuestion() {
    const b1 = randomInt(1, 4);
    const possibleQ = [2, 3];
    const q = possibleQ[Math.floor(Math.random() * possibleQ.length)];
    const n = randomInt(3, 5 + Math.floor(level / 2));

    const qn = Math.pow(q, n);
    const answer = b1 * (qn - 1) / (q - 1);

    return {
        type: 'sum',
        text: `Знайдіть суму перших ${n} членів прогресії, якщо b₁ = ${b1}, q = ${q}`,
        sequence: null,
        answer: answer,
        hint: 'Використайте формулу суми',
        formula: 'Sₙ = b₁ · (qⁿ − 1) / (q − 1)',
        explanation: `S${subscript(n)} = ${b1} · (${q}^${n} − 1) / (${q} − 1)\n= ${b1} · (${qn} − 1) / ${q - 1}\n= ${b1} · ${qn - 1} / ${q - 1} = ${answer}`
    };
}

function generateMeanQuestion() {
    const b1 = randomInt(1, 6);
    const q = randomInt(2, 4);

    const b_prev = b1;
    const b_next = b1 * q * q;
    const answer = b1 * q; // середній член

    if (Math.random() > 0.5) {
        // Знайти середній член
        return {
            type: 'mean',
            text: `Знайдіть член геометричної прогресії між ${b_prev} і ${b_next}`,
            sequence: `${b_prev}, ?, ${b_next}`,
            answer: answer,
            hint: 'Середнє геометричне = √(добуток сусідніх)',
            formula: 'bₙ = √(bₙ₋₁ · bₙ₊₁)',
            explanation: `Середнє геометричне: √(${b_prev} · ${b_next}) = √${b_prev * b_next} = ${answer}`
        };
    } else {
        // Знайти знаменник за трьома членами
        const middle = answer;
        return {
            type: 'mean',
            text: `В прогресії: ${b_prev}, ${middle}, ?. Знайдіть третій член.`,
            sequence: `${b_prev}, ${middle}, ?`,
            answer: b_next,
            hint: 'Знаменник q = b₂ / b₁',
            formula: 'q = b₂ / b₁, потім b₃ = b₂ · q',
            explanation: `q = ${middle} / ${b_prev} = ${q}\nb₃ = ${middle} · ${q} = ${b_next}`
        };
    }
}

function generateMissingQuestion() {
    const b1 = randomInt(1, 4);
    const q = randomInt(2, 3);
    const length = randomInt(4, 5);
    const missingIndex = randomInt(1, length - 2); // не перший і не останній

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
        text: 'Знайдіть пропущений член прогресії:',
        sequence: displaySeq.join(', '),
        answer: answer,
        hint: 'Знайдіть знаменник q за сусідніми членами',
        formula: 'q = bₙ₊₁ / bₙ',
        explanation: `q = ${sequence[missingIndex + 1] || sequence[missingIndex] * q} / ${sequence[missingIndex - 1] || b1} = ${q}\nПропущений член = ${sequence[missingIndex - 1]} · ${q} = ${answer}`
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
                'geometric_progression',
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
