// NMT Trainer App
let nmtData = null;
let currentTest = null;
let currentTaskIndex = 0;
let score = 0;
let userAnswers = [];
let timerInterval = null;
let elapsedSeconds = 0;
let answered = false;

// DOM Elements
const testSelectScreen = document.getElementById('testSelectScreen');
const taskScreen = document.getElementById('taskScreen');
const resultScreen = document.getElementById('resultScreen');
const solutionScreen = document.getElementById('solutionScreen');

const testList = document.getElementById('testList');
const timer = document.getElementById('timer');
const progressText = document.getElementById('progressText');
const taskTypeBadge = document.getElementById('taskTypeBadge');
const taskImage = document.getElementById('taskImage');
const quizOptions = document.getElementById('quizOptions');
const matchInputs = document.getElementById('matchInputs');
const shortAnswerInput = document.getElementById('shortAnswerInput');
const feedbackMessage = document.getElementById('feedbackMessage');
const submitBtn = document.getElementById('submitBtn');
const solutionBtn = document.getElementById('solutionBtn');
const nextRow = document.getElementById('nextRow');
const nextBtn = document.getElementById('nextBtn');

// Load data and initialize
async function init() {
    try {
        const response = await fetch('nmt_data.json');
        nmtData = await response.json();
        renderTestList();
    } catch (error) {
        console.error('Error loading NMT data:', error);
        testList.innerHTML = '<p style="color: var(--text-secondary);">Помилка завантаження даних</p>';
    }
}

function renderTestList() {
    testList.innerHTML = '';

    // Sort tests by name (НМТ мікс 1, 2, 3...)
    const sortedTests = [...nmtData.test_sets].sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)?.[0] || 0);
        const numB = parseInt(b.name.match(/\d+/)?.[0] || 0);
        return numA - numB;
    });

    sortedTests.forEach(test => {
        const card = document.createElement('div');
        card.className = 'test-card';
        card.innerHTML = `
            <div class="test-card-info">
                <span class="test-card-name">${test.name}</span>
                <span class="test-card-tasks">${test.tasks.length} завдань</span>
            </div>
            <span class="test-card-arrow">→</span>
        `;
        card.addEventListener('click', () => startTest(test));
        testList.appendChild(card);
    });
}

function startTest(test) {
    currentTest = test;
    currentTaskIndex = 0;
    score = 0;
    userAnswers = [];
    elapsedSeconds = 0;

    showScreen('task');
    startTimer();
    showTask();
}

function showScreen(screen) {
    testSelectScreen.classList.remove('active');
    taskScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    solutionScreen.classList.remove('active');

    switch(screen) {
        case 'select':
            testSelectScreen.classList.add('active');
            break;
        case 'task':
            taskScreen.classList.add('active');
            break;
        case 'result':
            resultScreen.classList.add('active');
            break;
        case 'solution':
            solutionScreen.classList.add('active');
            break;
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        elapsedSeconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Warning color after 30 minutes
    if (elapsedSeconds > 30 * 60) {
        timer.classList.add('warning');
    }
}

function showTask() {
    const task = currentTest.tasks[currentTaskIndex];
    answered = false;

    // Update progress
    progressText.textContent = `${currentTaskIndex + 1} / ${currentTest.tasks.length}`;

    // Update task type badge
    if (task.type === 'match') {
        taskTypeBadge.textContent = 'Відповідність';
        taskTypeBadge.className = 'task-type-badge match';
    } else if (task.type === 'short') {
        taskTypeBadge.textContent = 'Коротка відповідь';
        taskTypeBadge.className = 'task-type-badge short';
    } else {
        taskTypeBadge.textContent = 'Тест';
        taskTypeBadge.className = 'task-type-badge';
    }

    // Load task image
    taskImage.src = `images/${task.photo}`;

    // Show appropriate input type
    quizOptions.style.display = 'none';
    matchInputs.style.display = 'none';
    shortAnswerInput.style.display = 'none';

    if (task.type === 'match') {
        matchInputs.style.display = 'flex';
        // Reset match selects
        document.querySelectorAll('.match-select').forEach(select => {
            select.value = '';
        });
    } else if (task.type === 'short') {
        shortAnswerInput.style.display = 'block';
        shortAnswerInput.value = '';
    } else {
        quizOptions.style.display = 'flex';
        // Reset quiz buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected', 'correct', 'wrong');
        });
    }

    // Reset UI
    feedbackMessage.style.display = 'none';
    submitBtn.style.display = 'block';
    submitBtn.disabled = false;
    solutionBtn.style.display = 'none';
    nextRow.style.display = 'none';
}

function getUserAnswer() {
    const task = currentTest.tasks[currentTaskIndex];

    if (task.type === 'match') {
        const selects = document.querySelectorAll('.match-select');
        return Array.from(selects).map(s => s.value).join(' ');
    } else if (task.type === 'short') {
        return shortAnswerInput.value.trim();
    } else {
        const selected = document.querySelector('.answer-btn.selected');
        return selected ? selected.dataset.answer : '';
    }
}

function checkAnswer() {
    if (answered) return;

    const task = currentTest.tasks[currentTaskIndex];
    const userAnswer = getUserAnswer();

    if (!userAnswer || (task.type === 'match' && userAnswer.includes(' '))) {
        // Check if match has empty values
        if (task.type === 'match') {
            const selects = document.querySelectorAll('.match-select');
            const hasEmpty = Array.from(selects).some(s => !s.value);
            if (hasEmpty) {
                alert('Заповніть всі поля відповідності');
                return;
            }
        } else if (!userAnswer) {
            alert('Виберіть відповідь');
            return;
        }
    }

    answered = true;
    const isCorrect = userAnswer === task.correct;

    if (isCorrect) {
        score++;
    }

    userAnswers.push({
        taskNum: task.task_num,
        userAnswer,
        correct: task.correct,
        isCorrect
    });

    // Show feedback
    showFeedback(isCorrect, task.correct);

    // Update button states for quiz
    if (task.type !== 'match' && task.type !== 'short') {
        document.querySelectorAll('.answer-btn').forEach(btn => {
            if (btn.dataset.answer === task.correct) {
                btn.classList.add('correct');
            } else if (btn.classList.contains('selected')) {
                btn.classList.add('wrong');
            }
        });
    }

    // Show solution button if available
    if (task.solution_photo) {
        solutionBtn.style.display = 'block';
    }

    // Show next button
    submitBtn.style.display = 'none';
    nextRow.style.display = 'flex';
}

function showFeedback(isCorrect, correctAnswer) {
    feedbackMessage.style.display = 'block';
    feedbackMessage.className = 'feedback-message ' + (isCorrect ? 'correct' : 'wrong');
    feedbackMessage.textContent = isCorrect
        ? '✓ Правильно!'
        : `✗ Неправильно. Відповідь: ${correctAnswer}`;
}

function nextTask() {
    currentTaskIndex++;

    if (currentTaskIndex >= currentTest.tasks.length) {
        showResults();
    } else {
        showTask();
    }
}

function showResults() {
    stopTimer();
    showScreen('result');

    const total = currentTest.tasks.length;
    const percent = Math.round((score / total) * 100);

    // Emoji based on score
    let emoji = '😢';
    let text = 'Потрібно ще попрацювати';
    if (percent >= 90) {
        emoji = '🏆';
        text = 'Відмінний результат!';
    } else if (percent >= 75) {
        emoji = '🎉';
        text = 'Чудовий результат!';
    } else if (percent >= 60) {
        emoji = '👍';
        text = 'Непоганий результат';
    } else if (percent >= 40) {
        emoji = '📚';
        text = 'Потрібна практика';
    }

    document.getElementById('resultEmoji').textContent = emoji;
    document.getElementById('resultScore').textContent = `${score}/${total}`;
    document.getElementById('resultText').textContent = text;

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    document.getElementById('resultTime').textContent =
        `Час: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    document.getElementById('correctCount').textContent = score;
    document.getElementById('wrongCount').textContent = total - score;
    document.getElementById('percentScore').textContent = `${percent}%`;
}

function showSolution() {
    const task = currentTest.tasks[currentTaskIndex];

    document.getElementById('solutionAnswer').textContent = task.correct;

    const solutionImageContainer = document.getElementById('solutionImageContainer');
    const solutionImage = document.getElementById('solutionImage');

    if (task.solution_photo) {
        solutionImage.src = `images/${task.solution_photo}`;
        solutionImageContainer.style.display = 'block';
    } else {
        solutionImageContainer.style.display = 'none';
    }

    showScreen('solution');
}

// Event Listeners
document.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (answered) return;
        document.querySelectorAll('.answer-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });
});

submitBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', nextTask);
solutionBtn.addEventListener('click', showSolution);

document.getElementById('closeSolutionBtn').addEventListener('click', () => {
    showScreen('task');
});

document.getElementById('restartBtn').addEventListener('click', () => {
    startTest(currentTest);
});

document.getElementById('backToTestsBtn').addEventListener('click', () => {
    showScreen('select');
});

// Handle Enter key for short answer
shortAnswerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Initialize
init();
