// NMT Trainer App - Enhanced Version

// ========== CONSTANTS ==========

// NMT Score conversion table (raw score -> NMT score)
const NMT_SCORE_TABLE = {
    5: 100, 6: 108, 7: 115, 8: 123, 9: 131, 10: 134,
    11: 137, 12: 140, 13: 143, 14: 145, 15: 147, 16: 148,
    17: 149, 18: 150, 19: 151, 20: 152, 21: 155, 22: 159,
    23: 163, 24: 167, 25: 170, 26: 173, 27: 176, 28: 180,
    29: 184, 30: 189, 31: 194, 32: 200
};

// Topic names by task number ranges
const TOPIC_RANGES = {
    1: { name: 'Вирази та рівняння', range: [1, 4] },
    2: { name: 'Планіметрія', range: [5, 8] },
    3: { name: 'Функції, нерівності', range: [9, 12] },
    4: { name: 'Тригонометрія', range: [13, 16] },
    5: { name: 'Похідна, первісна', range: [17, 19] },
    6: { name: 'Стереометрія', range: [20, 22] }
};

// Task types by position (last 4 are short answer, some are matching)
const SHORT_ANSWER_TASKS = [19, 20, 21, 22]; // Last 4 tasks
const NUMBER_TYPES = ['short', 'number']; // Types that use number input

// ========== STATE ==========

let nmtData = null;
let currentTest = null;
let currentTaskIndex = 0;
let totalScore = 0; // Raw test score (max 32 for 22 tasks)
let userAnswers = [];
let timerInterval = null;
let elapsedSeconds = 0;
let answered = false;
let mode = 'exam'; // 'exam' or 'training'
let selectedTopic = 'all';
let hintCache = {}; // Cache for AI hints
let draggedOption = null;

// ========== DOM ELEMENTS ==========

const testSelectScreen = document.getElementById('testSelectScreen');
const taskScreen = document.getElementById('taskScreen');
const resultScreen = document.getElementById('resultScreen');
const solutionScreen = document.getElementById('solutionScreen');

const testList = document.getElementById('testList');
const timer = document.getElementById('timer');
const progressText = document.getElementById('progressText');
const taskNav = document.getElementById('taskNav');
const taskTypeBadge = document.getElementById('taskTypeBadge');
const topicBadge = document.getElementById('topicBadge');
const taskImage = document.getElementById('taskImage');
const quizOptions = document.getElementById('quizOptions');
const matchContainer = document.getElementById('matchContainer');
const matchOptions = document.getElementById('matchOptions');
const shortAnswerContainer = document.getElementById('shortAnswerContainer');
const shortAnswerInput = document.getElementById('shortAnswerInput');
const hintBtn = document.getElementById('hintBtn');
const hintContainer = document.getElementById('hintContainer');
const hintText = document.getElementById('hintText');
const feedbackMessage = document.getElementById('feedbackMessage');
const submitBtn = document.getElementById('submitBtn');
const solutionBtn = document.getElementById('solutionBtn');
const nextRow = document.getElementById('nextRow');
const nextBtn = document.getElementById('nextBtn');

// ========== INITIALIZATION ==========

async function init() {
    try {
        const response = await fetch('nmt_data.json');
        nmtData = await response.json();
        renderTestList();
        setupEventListeners();
    } catch (error) {
        console.error('Error loading NMT data:', error);
        testList.innerHTML = '<p style="color: var(--text-secondary);">Помилка завантаження даних</p>';
    }
}

function setupEventListeners() {
    // Topic tabs
    document.querySelectorAll('.topic-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.topic-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            selectedTopic = tab.dataset.topic;
            renderTestList();
        });
    });

    // Mode toggle
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            mode = btn.dataset.mode;
        });
    });

    // Quiz answer buttons
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (answered) return;
            document.querySelectorAll('.answer-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // Drag and drop for matching
    setupMatchingDragDrop();

    // Short answer input
    shortAnswerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    // Action buttons
    submitBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', nextTask);
    solutionBtn.addEventListener('click', showSolution);
    hintBtn.addEventListener('click', showHint);

    document.getElementById('closeSolutionBtn').addEventListener('click', () => showScreen('task'));
    document.getElementById('restartBtn').addEventListener('click', () => startTest(currentTest));
    document.getElementById('backToTestsBtn').addEventListener('click', () => showScreen('select'));
    document.getElementById('reviewBtn').addEventListener('click', () => {
        currentTaskIndex = 0;
        showScreen('task');
        showTask();
    });
}

function setupMatchingDragDrop() {
    const dropzones = document.querySelectorAll('.match-dropzone');
    const options = document.querySelectorAll('.match-option');

    options.forEach(option => {
        option.addEventListener('dragstart', (e) => {
            if (option.classList.contains('used') || answered) {
                e.preventDefault();
                return;
            }
            draggedOption = option;
            option.classList.add('dragging');
        });

        option.addEventListener('dragend', () => {
            option.classList.remove('dragging');
            draggedOption = null;
        });

        // Touch support
        option.addEventListener('click', () => {
            if (option.classList.contains('used') || answered) return;

            // If already selected, deselect
            if (option.classList.contains('selected')) {
                option.classList.remove('selected');
                draggedOption = null;
                return;
            }

            // Select this option
            options.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            draggedOption = option;
        });
    });

    dropzones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            if (answered) return;
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            if (answered) return;
            e.preventDefault();
            zone.classList.remove('drag-over');

            if (draggedOption) {
                placeAnswer(zone, draggedOption.dataset.value);
            }
        });

        // Touch/click support
        zone.addEventListener('click', () => {
            if (answered) return;

            // If zone has answer, remove it
            if (zone.dataset.answer) {
                const value = zone.dataset.answer;
                zone.dataset.answer = '';
                zone.textContent = '';
                zone.classList.remove('has-answer');

                // Restore option
                const option = document.querySelector(`.match-option[data-value="${value}"]`);
                if (option) option.classList.remove('used');
                return;
            }

            // Place selected option
            if (draggedOption) {
                placeAnswer(zone, draggedOption.dataset.value);
                document.querySelectorAll('.match-option').forEach(o => o.classList.remove('selected'));
                draggedOption = null;
            }
        });
    });
}

function placeAnswer(zone, value) {
    // If zone already has answer, restore that option first
    if (zone.dataset.answer) {
        const oldValue = zone.dataset.answer;
        const oldOption = document.querySelector(`.match-option[data-value="${oldValue}"]`);
        if (oldOption) oldOption.classList.remove('used');
    }

    zone.dataset.answer = value;
    zone.textContent = value;
    zone.classList.add('has-answer');

    // Mark option as used
    const option = document.querySelector(`.match-option[data-value="${value}"]`);
    if (option) option.classList.add('used');
}

// ========== TEST LIST ==========

function renderTestList() {
    testList.innerHTML = '';

    // Sort tests by name
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
                <h3>${test.name}</h3>
                <p>${test.tasks.length} завдань • ~45 хв</p>
            </div>
            <span class="test-card-arrow">→</span>
        `;
        card.addEventListener('click', () => startTest(test));
        testList.appendChild(card);
    });

    // Add quizzes section if available
    if (nmtData.quizzes && nmtData.quizzes.length > 0) {
        const quizzesCard = document.createElement('div');
        quizzesCard.className = 'test-card';
        quizzesCard.innerHTML = `
            <div class="test-card-info">
                <h3>📝 Окремі завдання</h3>
                <p>${nmtData.quizzes.length} завдань з різних тем</p>
            </div>
            <span class="test-card-arrow">→</span>
        `;
        quizzesCard.addEventListener('click', () => startQuizzes());
        testList.appendChild(quizzesCard);
    }
}

// ========== TEST FLOW ==========

function startTest(test) {
    currentTest = test;
    currentTaskIndex = 0;
    totalScore = 0;
    userAnswers = new Array(test.tasks.length).fill(null);
    elapsedSeconds = 0;
    hintCache = {};

    showScreen('task');
    renderTaskNav();
    startTimer();
    showTask();
}

function startQuizzes() {
    // Create a virtual test from quizzes
    const quizTest = {
        id: 'quizzes',
        name: 'Окремі завдання',
        tasks: nmtData.quizzes.map((q, i) => ({
            task_num: i + 1,
            type: q.type === 'short' ? 'short' : 'quiz',
            photo: q.photo,
            correct: q.correct,
            solution_photo: null,
            hashtag: q.hashtag || ''
        }))
    };
    startTest(quizTest);
}

function showScreen(screen) {
    testSelectScreen.classList.remove('active');
    taskScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    solutionScreen.classList.remove('active');

    switch(screen) {
        case 'select':
            testSelectScreen.classList.add('active');
            stopTimer();
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

// ========== TIMER ==========

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

    if (elapsedSeconds > 45 * 60) {
        timer.classList.add('warning');
    }
}

// ========== TASK NAVIGATION ==========

function renderTaskNav() {
    taskNav.innerHTML = '';

    currentTest.tasks.forEach((task, index) => {
        const btn = document.createElement('button');
        btn.className = 'task-nav-btn';
        btn.textContent = index + 1;

        if (index === currentTaskIndex) {
            btn.classList.add('current');
        }

        if (userAnswers[index] !== null) {
            const answer = userAnswers[index];
            if (answer.isCorrect) {
                btn.classList.add('answered');
            } else if (answer.partialScore > 0) {
                btn.classList.add('partial');
            } else {
                btn.classList.add('wrong');
            }
        }

        btn.addEventListener('click', () => {
            currentTaskIndex = index;
            showTask();
            updateTaskNav();
        });

        taskNav.appendChild(btn);
    });
}

function updateTaskNav() {
    const buttons = taskNav.querySelectorAll('.task-nav-btn');
    buttons.forEach((btn, index) => {
        btn.classList.remove('current');
        if (index === currentTaskIndex) {
            btn.classList.add('current');
        }
    });
}

// ========== TASK DISPLAY ==========

function showTask() {
    const task = currentTest.tasks[currentTaskIndex];
    const taskNum = task.task_num || currentTaskIndex + 1;
    const previousAnswer = userAnswers[currentTaskIndex];

    answered = previousAnswer !== null;

    // Update progress
    progressText.textContent = `${currentTaskIndex + 1} / ${currentTest.tasks.length}`;
    updateTaskNav();

    // Determine task type
    let taskType = task.type || 'quiz';
    if (SHORT_ANSWER_TASKS.includes(taskNum) || NUMBER_TYPES.includes(taskType)) {
        taskType = 'short';
    }

    // Update badges
    updateTaskTypeBadge(taskType);
    updateTopicBadge(taskNum);

    // Load image
    if (task.photo) {
        taskImage.src = `images/${task.photo}`;
        taskImage.parentElement.style.display = 'block';
    } else {
        taskImage.parentElement.style.display = 'none';
    }

    // Show appropriate input
    quizOptions.classList.add('hidden');
    matchContainer.classList.add('hidden');
    shortAnswerContainer.classList.add('hidden');

    if (taskType === 'match') {
        matchContainer.classList.remove('hidden');
        resetMatchingUI();
        if (previousAnswer) {
            restoreMatchingAnswer(previousAnswer);
        }
    } else if (taskType === 'short') {
        shortAnswerContainer.classList.remove('hidden');
        shortAnswerInput.value = previousAnswer?.userAnswer || '';
        shortAnswerInput.classList.remove('correct', 'wrong');
        if (previousAnswer) {
            shortAnswerInput.classList.add(previousAnswer.isCorrect ? 'correct' : 'wrong');
        }
    } else {
        quizOptions.classList.remove('hidden');
        resetQuizButtons();
        if (previousAnswer) {
            restoreQuizAnswer(previousAnswer, task.correct);
        }
    }

    // Show/hide hint button (training mode only)
    if (mode === 'training' && !answered) {
        hintBtn.classList.remove('hidden');
    } else {
        hintBtn.classList.add('hidden');
    }
    hintContainer.classList.add('hidden');

    // Feedback
    feedbackMessage.classList.add('hidden');
    if (previousAnswer) {
        showFeedbackMessage(previousAnswer);
    }

    // Buttons
    if (answered) {
        submitBtn.classList.add('hidden');
        nextRow.classList.remove('hidden');
        if (task.solution_photo) {
            solutionBtn.classList.remove('hidden');
        } else {
            solutionBtn.classList.add('hidden');
        }
    } else {
        submitBtn.classList.remove('hidden');
        nextRow.classList.add('hidden');
        solutionBtn.classList.add('hidden');
    }
}

function updateTaskTypeBadge(type) {
    taskTypeBadge.className = 'task-type-badge';
    if (type === 'match') {
        taskTypeBadge.textContent = 'Відповідність';
        taskTypeBadge.classList.add('match');
    } else if (type === 'short') {
        taskTypeBadge.textContent = 'Коротка відповідь';
        taskTypeBadge.classList.add('short');
    } else {
        taskTypeBadge.textContent = 'Тест';
    }
}

function updateTopicBadge(taskNum) {
    for (const [topicId, topic] of Object.entries(TOPIC_RANGES)) {
        if (taskNum >= topic.range[0] && taskNum <= topic.range[1]) {
            topicBadge.textContent = topic.name;
            return;
        }
    }
    topicBadge.textContent = 'Загальне';
}

function resetQuizButtons() {
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('selected', 'correct', 'wrong');
        btn.disabled = false;
    });
}

function restoreQuizAnswer(answer, correct) {
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.answer === correct) {
            btn.classList.add('correct');
        }
        if (btn.dataset.answer === answer.userAnswer && answer.userAnswer !== correct) {
            btn.classList.add('wrong');
        }
    });
}

function resetMatchingUI() {
    document.querySelectorAll('.match-dropzone').forEach(zone => {
        zone.dataset.answer = '';
        zone.textContent = '';
        zone.classList.remove('has-answer', 'correct', 'wrong');
    });
    document.querySelectorAll('.match-option').forEach(opt => {
        opt.classList.remove('used', 'selected');
    });
}

function restoreMatchingAnswer(answer) {
    const parts = answer.userAnswer.split(' ');
    const correctParts = answer.correct.split(' ');

    document.querySelectorAll('.match-dropzone').forEach((zone, i) => {
        if (parts[i]) {
            zone.dataset.answer = parts[i];
            zone.textContent = parts[i];
            zone.classList.add('has-answer');

            if (parts[i] === correctParts[i]) {
                zone.classList.add('correct');
            } else {
                zone.classList.add('wrong');
            }

            const opt = document.querySelector(`.match-option[data-value="${parts[i]}"]`);
            if (opt) opt.classList.add('used');
        }
    });
}

// ========== ANSWER CHECKING ==========

function checkAnswer() {
    if (answered) return;

    const task = currentTest.tasks[currentTaskIndex];
    const taskNum = task.task_num || currentTaskIndex + 1;
    let taskType = task.type || 'quiz';
    if (SHORT_ANSWER_TASKS.includes(taskNum) || NUMBER_TYPES.includes(taskType)) {
        taskType = 'short';
    }

    let userAnswer = '';
    let isCorrect = false;
    let partialScore = 0;
    let maxScore = 1;

    if (taskType === 'match') {
        userAnswer = getMatchingAnswer();
        const result = checkMatchingAnswer(userAnswer, task.correct);
        isCorrect = result.isCorrect;
        partialScore = result.partialScore;
        maxScore = 3; // Matching tasks worth 3 points

        if (!userAnswer.trim()) {
            alert('Заповніть всі поля відповідності');
            return;
        }
    } else if (taskType === 'short') {
        userAnswer = shortAnswerInput.value.trim();
        if (!userAnswer) {
            alert('Введіть відповідь');
            return;
        }
        isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(task.correct);
        partialScore = isCorrect ? 1 : 0;
        maxScore = 1;
    } else {
        const selected = document.querySelector('.answer-btn.selected');
        if (!selected) {
            alert('Виберіть відповідь');
            return;
        }
        userAnswer = selected.dataset.answer;
        isCorrect = userAnswer === task.correct;
        partialScore = isCorrect ? 1 : 0;
        maxScore = 1;
    }

    answered = true;

    // Save answer
    userAnswers[currentTaskIndex] = {
        taskNum,
        userAnswer,
        correct: task.correct,
        isCorrect,
        partialScore,
        maxScore
    };

    // Update score
    totalScore += partialScore;

    // Show feedback
    showAnswerFeedback(taskType, task.correct, userAnswer, isCorrect, partialScore, maxScore);
    updateTaskNav();

    // Update buttons
    submitBtn.classList.add('hidden');
    nextRow.classList.remove('hidden');
    if (task.solution_photo) {
        solutionBtn.classList.remove('hidden');
    }
    hintBtn.classList.add('hidden');
}

function getMatchingAnswer() {
    const dropzones = document.querySelectorAll('.match-dropzone');
    return Array.from(dropzones).map(z => z.dataset.answer || '').join(' ');
}

function checkMatchingAnswer(userAnswer, correct) {
    // Normalize: remove spaces and split into chars if no spaces
    const userParts = userAnswer.includes(' ') ? userAnswer.split(' ') : userAnswer.split('');
    const correctParts = correct.includes(' ') ? correct.split(' ') : correct.split('');

    let matchCount = 0;
    for (let i = 0; i < correctParts.length; i++) {
        if (userParts[i] === correctParts[i]) {
            matchCount++;
        }
    }

    return {
        isCorrect: matchCount === correctParts.length,
        partialScore: matchCount // 0, 1, 2, or 3 points
    };
}

function normalizeAnswer(answer) {
    // Normalize for comparison: remove spaces, convert comma to dot
    return answer.toString().trim().toLowerCase().replace(',', '.').replace(/\s/g, '');
}

function showAnswerFeedback(taskType, correct, userAnswer, isCorrect, partialScore, maxScore) {
    // Show feedback message
    feedbackMessage.classList.remove('hidden', 'correct', 'wrong', 'partial');

    if (isCorrect) {
        feedbackMessage.classList.add('correct');
        feedbackMessage.textContent = '✓ Правильно!';
    } else if (partialScore > 0 && partialScore < maxScore) {
        feedbackMessage.classList.add('partial');
        feedbackMessage.textContent = `◐ Частково правильно (${partialScore}/${maxScore}). Відповідь: ${correct}`;
    } else {
        feedbackMessage.classList.add('wrong');
        feedbackMessage.textContent = `✗ Неправильно. Відповідь: ${correct}`;
    }

    // Visual feedback on inputs
    if (taskType === 'quiz') {
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.answer === correct) {
                btn.classList.add('correct');
            } else if (btn.classList.contains('selected')) {
                btn.classList.add('wrong');
            }
        });
    } else if (taskType === 'short') {
        shortAnswerInput.classList.add(isCorrect ? 'correct' : 'wrong');
    } else if (taskType === 'match') {
        const userParts = userAnswer.split(' ');
        const correctParts = correct.split(' ');
        document.querySelectorAll('.match-dropzone').forEach((zone, i) => {
            if (userParts[i] === correctParts[i]) {
                zone.classList.add('correct');
            } else {
                zone.classList.add('wrong');
            }
        });
    }
}

function showFeedbackMessage(answer) {
    feedbackMessage.classList.remove('hidden', 'correct', 'wrong', 'partial');

    if (answer.isCorrect) {
        feedbackMessage.classList.add('correct');
        feedbackMessage.textContent = '✓ Правильно!';
    } else if (answer.partialScore > 0 && answer.partialScore < answer.maxScore) {
        feedbackMessage.classList.add('partial');
        feedbackMessage.textContent = `◐ Частково правильно (${answer.partialScore}/${answer.maxScore}). Відповідь: ${answer.correct}`;
    } else {
        feedbackMessage.classList.add('wrong');
        feedbackMessage.textContent = `✗ Неправильно. Відповідь: ${answer.correct}`;
    }
}

// ========== NAVIGATION ==========

function nextTask() {
    // Find next unanswered task, or go to next, or finish
    let nextIndex = currentTaskIndex + 1;

    // Check if all tasks are answered
    const allAnswered = userAnswers.every(a => a !== null);

    if (allAnswered) {
        showResults();
        return;
    }

    // Find next unanswered
    while (nextIndex < currentTest.tasks.length && userAnswers[nextIndex] !== null) {
        nextIndex++;
    }

    // If we reached the end, loop back to find unanswered
    if (nextIndex >= currentTest.tasks.length) {
        nextIndex = userAnswers.findIndex(a => a === null);
    }

    if (nextIndex === -1) {
        showResults();
    } else {
        currentTaskIndex = nextIndex;
        showTask();
    }
}

// ========== RESULTS ==========

function showResults() {
    stopTimer();
    showScreen('result');

    // Calculate totals
    let correctCount = 0;
    let partialCount = 0;
    let wrongCount = 0;
    let maxPossibleScore = 0;

    userAnswers.forEach(answer => {
        if (answer) {
            maxPossibleScore += answer.maxScore;
            if (answer.isCorrect) {
                correctCount++;
            } else if (answer.partialScore > 0) {
                partialCount++;
            } else {
                wrongCount++;
            }
        }
    });

    // Convert to NMT score
    const nmtScore = convertToNMT(totalScore);

    // Emoji based on score
    let emoji = '😢';
    if (nmtScore >= 190) emoji = '🏆';
    else if (nmtScore >= 170) emoji = '🎉';
    else if (nmtScore >= 150) emoji = '👍';
    else if (nmtScore >= 130) emoji = '📚';

    document.getElementById('resultEmoji').textContent = emoji;
    document.getElementById('resultNmtScore').textContent = nmtScore;
    document.getElementById('resultRawScore').textContent = `${totalScore}/${maxPossibleScore} тестових балів`;

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    document.getElementById('resultTime').textContent =
        `Час: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('partialCount').textContent = partialCount;
    document.getElementById('wrongCount').textContent = wrongCount;
}

function convertToNMT(rawScore) {
    // Use lookup table, interpolate if needed
    if (rawScore <= 4) return 100;
    if (rawScore >= 32) return 200;

    return NMT_SCORE_TABLE[rawScore] || 100;
}

// ========== SOLUTION ==========

function showSolution() {
    const task = currentTest.tasks[currentTaskIndex];

    document.getElementById('solutionAnswer').textContent = task.correct;

    const container = document.getElementById('solutionImageContainer');
    const img = document.getElementById('solutionImage');

    if (task.solution_photo) {
        img.src = `images/${task.solution_photo}`;
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }

    showScreen('solution');
}

// ========== AI HINTS ==========

async function showHint() {
    const task = currentTest.tasks[currentTaskIndex];
    const cacheKey = `${currentTest.id}_${currentTaskIndex}`;

    // Check cache
    if (hintCache[cacheKey]) {
        displayHint(hintCache[cacheKey]);
        return;
    }

    // Show loading
    hintBtn.classList.add('hidden');
    hintContainer.classList.remove('hidden');
    hintText.innerHTML = '<div class="hint-loading"><div class="spinner"></div>Генерую підказку...</div>';

    // Generate hint (mock for now - can be replaced with actual AI call)
    const hint = generateMockHint(task);

    // Cache it
    hintCache[cacheKey] = hint;

    // Display after small delay for UX
    setTimeout(() => {
        displayHint(hint);
    }, 500);
}

function displayHint(hint) {
    hintContainer.classList.remove('hidden');
    hintText.textContent = hint;
}

function generateMockHint(task) {
    // Generate helpful hints based on task type
    const taskNum = task.task_num || currentTaskIndex + 1;

    const hints = {
        1: 'Спробуй спростити вираз, застосувавши формули скороченого множення.',
        2: 'Уважно прочитай умову та визнач, які величини дані і що потрібно знайти.',
        3: 'Перевір, чи можна розкласти вираз на множники.',
        4: 'Зверни увагу на область визначення виразу.',
        5: 'Використай властивості трикутників: сума кутів = 180°.',
        6: 'Застосуй теорему Піфагора або властивості подібних трикутників.',
        7: 'Площа трикутника: S = ½·a·h або S = ½·a·b·sin(C).',
        8: 'Для кола: довжина = 2πR, площа = πR².',
        9: 'Знайди область визначення функції та перевір граничні випадки.',
        10: 'Побудуй графік або проаналізуй знак функції на інтервалах.',
        11: 'Для нерівності: знайди нулі та визнач знак на проміжках.',
        12: 'Перевір, чи функція парна, непарна, або жодна з них.',
        13: 'Використай основну тригонометричну тотожність: sin²x + cos²x = 1.',
        14: 'Зведи до одного аргументу, використовуючи формули зведення.',
        15: 'Для показникових: приведи до однієї основи.',
        16: 'Для логарифмів: використай властивості log(ab) = log(a) + log(b).',
        17: 'Похідна показує швидкість зміни функції. f\'(x) = 0 в точках екстремуму.',
        18: 'Первісна - це функція F, така що F\'(x) = f(x).',
        19: 'Для комбінаторики: визнач, чи важливий порядок (перестановки vs комбінації).',
        20: 'Для многогранників: V = ⅓·S_осн·h (піраміда), V = S_осн·h (призма).',
        21: 'Площа бічної поверхні циліндра: S = 2πRh.',
        22: 'Для кулі: V = 4/3·πR³, S = 4πR².'
    };

    return hints[taskNum] || 'Уважно прочитай умову та визнач тип задачі. Запиши, що дано і що потрібно знайти.';
}

// ========== INIT ==========

init();
