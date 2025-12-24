// Traps data - common NMT mistakes
const traps = [
    {
        id: 1,
        title: 'Квадратне рівняння',
        subtitle: 'Знайти корені',
        problem: 'x^2 - 5x + 6 = 0',
        steps: [
            { text: 'Знаходимо D:', formula: 'D = (-5)^2 - 4 \\cdot 1 \\cdot 6 = 25 - 24 = 1' },
            { text: 'Знаходимо корені:', formula: 'x = \\frac{5 \\pm \\sqrt{1}}{2} = \\frac{5 \\pm 1}{2}' },
            { text: 'Відповідь:', formula: 'x_1 = 3, \\quad x_2 = 2' }
        ],
        errorStep: null, // No error - correct solution
        explanation: 'Розв\'язок правильний! D = 1 > 0, тому є два корені. Перевірка: 3 + 2 = 5 = -(-5)/1 ✓ і 3 · 2 = 6 = 6/1 ✓',
        correctSolution: null
    },
    {
        id: 2,
        title: 'Квадратне рівняння',
        subtitle: 'Забули ±',
        problem: 'x^2 - 4 = 0',
        steps: [
            { text: 'Переносимо:', formula: 'x^2 = 4' },
            { text: 'Витягуємо корінь:', formula: 'x = \\sqrt{4} = 2' },
            { text: 'Відповідь:', formula: 'x = 2' }
        ],
        errorStep: 1, // Step 2 (index 1)
        explanation: 'Пастка! При витягуванні кореня з обох частин рівняння потрібно враховувати ОБА знаки: x = ±√4',
        correctSolution: 'x = \\pm\\sqrt{4} = \\pm 2 \\\\[6pt] \\text{Відповідь: } x_1 = 2, \\quad x_2 = -2'
    },
    {
        id: 3,
        title: 'Дискримінант',
        subtitle: 'D < 0, але пишуть корені',
        problem: 'x^2 + 2x + 5 = 0',
        steps: [
            { text: 'Знаходимо D:', formula: 'D = 2^2 - 4 \\cdot 1 \\cdot 5 = 4 - 20 = -16' },
            { text: 'Знаходимо корені:', formula: 'x = \\frac{-2 \\pm \\sqrt{-16}}{2}' },
            { text: 'Відповідь:', formula: 'x_1 = 1, \\quad x_2 = -3' }
        ],
        errorStep: 1, // Step 2
        explanation: 'Пастка! Якщо D < 0, рівняння НЕ МАЄ дійсних коренів. Не можна витягувати корінь з від\'ємного числа в R!',
        correctSolution: 'D = -16 < 0 \\\\[6pt] \\text{Відповідь: коренів немає}'
    },
    {
        id: 4,
        title: 'Тригонометрія',
        subtitle: 'Плутають sin і cos',
        problem: '\\text{Знайти } \\sin 60°',
        steps: [
            { text: 'Згадуємо таблицю:', formula: '\\sin 60° = \\frac{1}{2}' },
            { text: 'Відповідь:', formula: '\\sin 60° = 0{,}5' }
        ],
        errorStep: 0, // Step 1
        explanation: 'Пастка! sin 60° = √3/2 ≈ 0.866, а не 1/2. Це cos 60° = 1/2. Запам\'ятай: sin зростає від 0° до 90°!',
        correctSolution: '\\sin 60° = \\frac{\\sqrt{3}}{2} \\approx 0{,}866'
    },
    {
        id: 5,
        title: 'Ділення на вираз',
        subtitle: 'Втрата коренів',
        problem: 'x(x - 2) = 3(x - 2)',
        steps: [
            { text: 'Ділимо на (x-2):', formula: 'x = 3' },
            { text: 'Відповідь:', formula: 'x = 3' }
        ],
        errorStep: 0, // Step 1
        explanation: 'Пастка! Ділити на (x - 2) можна лише якщо x ≠ 2. Але x = 2 теж може бути коренем! Потрібно перевірити.',
        correctSolution: 'x(x-2) - 3(x-2) = 0 \\\\[4pt] (x-2)(x-3) = 0 \\\\[4pt] x = 2 \\text{ або } x = 3'
    },
    {
        id: 6,
        title: 'Формула скороченого множення',
        subtitle: 'Неправильне піднесення до квадрату',
        problem: '(a + b)^2 = ?',
        steps: [
            { text: 'Підносимо до квадрату:', formula: '(a + b)^2 = a^2 + b^2' },
            { text: 'Відповідь:', formula: 'a^2 + b^2' }
        ],
        errorStep: 0, // Step 1
        explanation: 'Пастка! (a + b)² ≠ a² + b². Забули подвоєний добуток 2ab!',
        correctSolution: '(a + b)^2 = a^2 + 2ab + b^2'
    },
    {
        id: 7,
        title: 'Прогресія',
        subtitle: 'Плутають формули АП і ГП',
        problem: 'a_1 = 3, d = 2. \\text{ Знайти } a_5',
        steps: [
            { text: 'Формула n-го члена АП:', formula: 'a_n = a_1 \\cdot d^{n-1}' },
            { text: 'Підставляємо:', formula: 'a_5 = 3 \\cdot 2^4 = 3 \\cdot 16 = 48' },
            { text: 'Відповідь:', formula: 'a_5 = 48' }
        ],
        errorStep: 0, // Step 1
        explanation: 'Пастка! Це формула геометричної прогресії! Для арифметичної: aₙ = a₁ + (n-1)·d',
        correctSolution: 'a_n = a_1 + (n-1) \\cdot d \\\\[4pt] a_5 = 3 + 4 \\cdot 2 = 3 + 8 = 11'
    },
    {
        id: 8,
        title: 'Корінь з добутку',
        subtitle: 'Неправильне спрощення',
        problem: '\\sqrt{x^2} = ?',
        steps: [
            { text: 'Спрощуємо:', formula: '\\sqrt{x^2} = x' },
            { text: 'Відповідь:', formula: 'x' }
        ],
        errorStep: 0, // Step 1
        explanation: 'Пастка! √(x²) = |x|, а не просто x. Адже якщо x = -3, то √((-3)²) = √9 = 3 = |-3|',
        correctSolution: '\\sqrt{x^2} = |x|'
    }
];

// Shuffle array
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// App State
let shuffledTraps = shuffle(traps);
let currentTrapIndex = 0;
let selectedStep = null;
let correctCount = 0;
let answered = false;

// DOM Elements
const trapCard = document.getElementById('trapCard');
const answerSection = document.getElementById('answerSection');
const answerHeader = document.getElementById('answerHeader');
const answerExplanation = document.getElementById('answerExplanation');
const stepButtons = document.getElementById('stepButtons');
const nextBtn = document.getElementById('nextBtn');
const currentQ = document.getElementById('currentQ');
const totalQ = document.getElementById('totalQ');

// Initialize
function init() {
    totalQ.textContent = shuffledTraps.length;
    loadTrap(currentTrapIndex);
    setupEventListeners();
}

function setupEventListeners() {
    nextBtn.addEventListener('click', nextTrap);
}

function loadTrap(index) {
    const trap = shuffledTraps[index];

    // Reset state
    selectedStep = null;
    answered = false;

    // Update progress
    currentQ.textContent = index + 1;

    // Build trap HTML
    let stepsHTML = trap.steps.map((step, i) => `
        <div class="solution-step" data-step="${i}">
            <div class="step-number">${i + 1}</div>
            <div class="step-content">
                <div class="step-text">${step.text}</div>
                <div class="step-formula" id="formula-${i}"></div>
            </div>
        </div>
    `).join('');

    trapCard.innerHTML = `
        <div class="trap-header">
            <span class="trap-icon">🎯</span>
            <div>
                <div class="trap-title">${trap.title}</div>
                <div class="trap-subtitle">${trap.subtitle}</div>
            </div>
        </div>

        <div class="problem-box">
            <div class="problem-label">Задача</div>
            <div class="problem-text" id="problemFormula"></div>
        </div>

        <div class="solution-box">
            <div class="solution-label">⚠️ Учень розв'язав так:</div>
            <div class="solution-steps">
                ${stepsHTML}
            </div>
        </div>

        <div class="question-box">
            <div class="question-text">Де помилка?</div>
        </div>
    `;

    // Render LaTeX
    katex.render(trap.problem, document.getElementById('problemFormula'), {
        throwOnError: false,
        displayMode: true
    });

    trap.steps.forEach((step, i) => {
        katex.render(step.formula, document.getElementById(`formula-${i}`), {
            throwOnError: false,
            displayMode: false
        });
    });

    // Build step buttons
    let buttonsHTML = trap.steps.map((_, i) => `
        <button class="step-btn" data-step="${i}">Крок ${i + 1}</button>
    `).join('');
    buttonsHTML += `<button class="step-btn no-error" data-step="-1">Помилки немає</button>`;

    stepButtons.innerHTML = buttonsHTML;

    // Add click handlers to buttons
    stepButtons.querySelectorAll('.step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (answered) return;
            selectStep(parseInt(btn.dataset.step));
        });
    });

    // Reset UI
    answerSection.classList.add('hidden');
    nextBtn.classList.add('hidden');
    stepButtons.classList.remove('hidden');
}

function selectStep(stepIndex) {
    selectedStep = stepIndex;
    answered = true;

    const trap = shuffledTraps[currentTrapIndex];
    const isCorrect = stepIndex === trap.errorStep;

    if (isCorrect) {
        correctCount++;
    }

    // Update buttons
    stepButtons.querySelectorAll('.step-btn').forEach(btn => {
        const btnStep = parseInt(btn.dataset.step);
        btn.classList.remove('selected');

        if (btnStep === stepIndex) {
            btn.classList.add(isCorrect ? 'correct' : 'incorrect');
        }

        // Show correct answer if user was wrong
        if (!isCorrect && btnStep === trap.errorStep) {
            btn.classList.add('correct');
        }
    });

    // Highlight step in solution
    document.querySelectorAll('.solution-step').forEach((step, i) => {
        if (i === trap.errorStep && trap.errorStep !== null) {
            step.classList.add('highlight-error');
        }
    });

    // Show answer section
    answerHeader.className = 'answer-header ' + (isCorrect ? 'correct' : 'incorrect');
    answerHeader.innerHTML = isCorrect
        ? '✓ Правильно!'
        : (trap.errorStep === null ? '✗ Тут все правильно!' : '✗ Неправильно');

    let explanationHTML = `<p>${trap.explanation}</p>`;

    if (trap.correctSolution) {
        explanationHTML += `
            <div class="correct-solution">
                <div class="correct-label">Правильний розв'язок</div>
                <div id="correctFormula"></div>
            </div>
        `;
    }

    answerExplanation.innerHTML = explanationHTML;

    if (trap.correctSolution) {
        katex.render(trap.correctSolution, document.getElementById('correctFormula'), {
            throwOnError: false,
            displayMode: true
        });
    }

    answerSection.classList.remove('hidden');
    nextBtn.classList.remove('hidden');

    answerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextTrap() {
    currentTrapIndex++;

    if (currentTrapIndex >= shuffledTraps.length) {
        showCompletion();
        return;
    }

    loadTrap(currentTrapIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCompletion() {
    const percentage = Math.round((correctCount / shuffledTraps.length) * 100);

    trapCard.innerHTML = `
        <div class="completion-card">
            <div class="completion-icon">🎯</div>
            <h2>Тренування завершено!</h2>
            <p>Ти навчився розпізнавати пастки НМТ</p>

            <div class="completion-stats">
                <div class="stat">
                    <div class="stat-value">${correctCount}/${shuffledTraps.length}</div>
                    <div class="stat-label">Правильних</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${percentage}%</div>
                    <div class="stat-label">Точність</div>
                </div>
            </div>

            <button class="btn-restart" onclick="location.reload()">Спробувати ще</button>
            <a href="../index.html" class="btn-home">На головну</a>
        </div>
    `;

    answerSection.classList.add('hidden');
    stepButtons.classList.add('hidden');
    nextBtn.classList.add('hidden');
}

// Start
init();
