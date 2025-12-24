// Formula to Task data
const formulas = [
    {
        id: 1,
        formula: 'D = b^2 - 4ac',
        name: 'Дискримінант',
        correctTask: 'Знайти кількість коренів рівняння x² - 6x + 9 = 0',
        wrongTasks: [
            'Знайти площу прямокутника зі сторонами a і b',
            'Обчислити периметр трикутника',
            'Знайти довжину кола з радіусом r'
        ],
        hint: 'Дискримінант використовується для визначення кількості коренів квадратного рівняння ax² + bx + c = 0'
    },
    {
        id: 2,
        formula: 'a^2 + b^2 = c^2',
        name: 'Теорема Піфагора',
        correctTask: 'Знайти гіпотенузу прямокутного трикутника з катетами 3 і 4',
        wrongTasks: [
            'Знайти корені квадратного рівняння',
            'Обчислити суму арифметичної прогресії',
            'Знайти sin кута в трикутнику'
        ],
        hint: 'Теорема Піфагора: у прямокутному трикутнику квадрат гіпотенузи дорівнює сумі квадратів катетів'
    },
    {
        id: 3,
        formula: 'S = \\pi r^2',
        name: 'Площа круга',
        correctTask: 'Знайти площу круга з радіусом 5 см',
        wrongTasks: [
            'Знайти довжину кола',
            'Обчислити об\'єм кулі',
            'Знайти периметр квадрата'
        ],
        hint: 'Формула площі круга: S = πr², де r — радіус'
    },
    {
        id: 4,
        formula: 'S_n = \\frac{(a_1 + a_n) \\cdot n}{2}',
        name: 'Сума АП',
        correctTask: 'Знайти суму перших 10 членів АП: 2, 5, 8, 11...',
        wrongTasks: [
            'Знайти n-й член геометричної прогресії',
            'Обчислити площу трапеції',
            'Знайти корені рівняння'
        ],
        hint: 'Формула суми n перших членів арифметичної прогресії'
    },
    {
        id: 5,
        formula: '\\sin^2\\alpha + \\cos^2\\alpha = 1',
        name: 'Основна тригонометрична тотожність',
        correctTask: 'Знайти cos α, якщо sin α = 0.6 і α — гострий',
        wrongTasks: [
            'Знайти площу трикутника',
            'Обчислити дискримінант',
            'Знайти периметр прямокутника'
        ],
        hint: 'Сума квадратів синуса і косинуса одного кута завжди дорівнює 1'
    },
    {
        id: 6,
        formula: 'x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}',
        name: 'Формула коренів квадратного рівняння',
        correctTask: 'Розв\'язати рівняння 2x² - 7x + 3 = 0',
        wrongTasks: [
            'Знайти координати вершини параболи',
            'Обчислити площу трикутника',
            'Знайти n-й член прогресії'
        ],
        hint: 'Ця формула дає корені квадратного рівняння ax² + bx + c = 0'
    },
    {
        id: 7,
        formula: 'b_n = b_1 \\cdot q^{n-1}',
        name: 'n-й член ГП',
        correctTask: 'Знайти 5-й член ГП, якщо b₁ = 3 і q = 2',
        wrongTasks: [
            'Знайти суму арифметичної прогресії',
            'Обчислити дискримінант',
            'Знайти площу круга'
        ],
        hint: 'Формула n-го члена геометричної прогресії з першим членом b₁ і знаменником q'
    },
    {
        id: 8,
        formula: 'S = \\frac{1}{2}ah',
        name: 'Площа трикутника',
        correctTask: 'Знайти площу трикутника з основою 8 см і висотою 5 см',
        wrongTasks: [
            'Знайти периметр трикутника',
            'Обчислити гіпотенузу',
            'Знайти радіус вписаного кола'
        ],
        hint: 'Площа трикутника: половина добутку основи на висоту'
    },
    {
        id: 9,
        formula: 'C = 2\\pi r',
        name: 'Довжина кола',
        correctTask: 'Знайти довжину кола з радіусом 7 см',
        wrongTasks: [
            'Знайти площу круга',
            'Обчислити об\'єм циліндра',
            'Знайти діагональ квадрата'
        ],
        hint: 'Довжина кола (периметр круга) дорівнює 2πr'
    },
    {
        id: 10,
        formula: 'x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 \\cdot x_2 = \\frac{c}{a}',
        name: 'Теорема Вієта',
        correctTask: 'Не розв\'язуючи рівняння x² - 5x + 6 = 0, знайти суму його коренів',
        wrongTasks: [
            'Знайти дискримінант рівняння',
            'Побудувати графік функції',
            'Знайти точки перетину з осями'
        ],
        hint: 'Теорема Вієта зв\'язує корені квадратного рівняння з його коефіцієнтами'
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
let shuffledFormulas = shuffle(formulas);
let currentIndex = 0;
let correctCount = 0;
let answered = false;
let currentOptions = [];

// DOM Elements
const formulaCard = document.getElementById('formulaCard');
const tasksGrid = document.getElementById('tasksGrid');
const feedbackSection = document.getElementById('feedbackSection');
const nextBtn = document.getElementById('nextBtn');
const currentQ = document.getElementById('currentQ');
const totalQ = document.getElementById('totalQ');

// Initialize
function init() {
    totalQ.textContent = shuffledFormulas.length;
    loadQuestion(currentIndex);
    setupEventListeners();
}

function setupEventListeners() {
    nextBtn.addEventListener('click', nextQuestion);
}

function loadQuestion(index) {
    const item = shuffledFormulas[index];

    // Reset state
    answered = false;

    // Update progress
    currentQ.textContent = index + 1;

    // Render formula card
    formulaCard.innerHTML = `
        <div class="formula-header">
            <span class="formula-icon">📐</span>
            <span class="formula-label">Формула</span>
        </div>
        <div class="formula-display" id="formulaDisplay"></div>
        <div class="formula-name">${item.name}</div>
        <div class="formula-question">Яку задачу можна розв'язати цією формулою?</div>
    `;

    katex.render(item.formula, document.getElementById('formulaDisplay'), {
        throwOnError: false,
        displayMode: true
    });

    // Create options (1 correct + 3 wrong, shuffled)
    currentOptions = shuffle([
        { text: item.correctTask, correct: true },
        ...item.wrongTasks.map(t => ({ text: t, correct: false }))
    ]);

    // Render options
    tasksGrid.innerHTML = currentOptions.map((opt, i) => `
        <div class="task-option" data-index="${i}">
            <span class="task-text">${opt.text}</span>
        </div>
    `).join('');

    // Add click handlers
    tasksGrid.querySelectorAll('.task-option').forEach(opt => {
        opt.addEventListener('click', () => {
            if (answered) return;
            selectOption(parseInt(opt.dataset.index));
        });
    });

    // Reset UI
    feedbackSection.classList.add('hidden');
    nextBtn.classList.add('hidden');
}

function selectOption(index) {
    answered = true;
    const item = shuffledFormulas[currentIndex];
    const selected = currentOptions[index];
    const isCorrect = selected.correct;

    if (isCorrect) {
        correctCount++;
    }

    // Update options visually
    tasksGrid.querySelectorAll('.task-option').forEach((opt, i) => {
        if (i === index) {
            opt.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
        if (currentOptions[i].correct && !isCorrect) {
            opt.classList.add('highlight');
        }
    });

    // Show feedback
    feedbackSection.innerHTML = `
        <div class="feedback-header ${isCorrect ? 'correct' : 'incorrect'}">
            ${isCorrect ? '✓ Правильно!' : '✗ Неправильно'}
        </div>
        <div class="feedback-text">
            ${isCorrect ? 'Ти вірно визначив тип задачі!' : 'Ця формула використовується для іншого типу задач.'}
        </div>
        <div class="feedback-hint">
            <div class="hint-label">Підказка</div>
            ${item.hint}
        </div>
    `;

    feedbackSection.classList.remove('hidden');
    nextBtn.classList.remove('hidden');

    feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextQuestion() {
    currentIndex++;

    if (currentIndex >= shuffledFormulas.length) {
        showCompletion();
        return;
    }

    loadQuestion(currentIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCompletion() {
    const percentage = Math.round((correctCount / shuffledFormulas.length) * 100);

    formulaCard.innerHTML = `
        <div class="completion-card">
            <div class="completion-icon">🎓</div>
            <h2>Чудово!</h2>
            <p>Ти вмієш розпізнавати, де яку формулу застосувати</p>

            <div class="completion-stats">
                <div class="stat">
                    <div class="stat-value">${correctCount}/${shuffledFormulas.length}</div>
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

    tasksGrid.classList.add('hidden');
    feedbackSection.classList.add('hidden');
    nextBtn.classList.add('hidden');
}

// Start
init();
