// Stereometry 2D - understanding 3D figures through 2D representations
const figures = [
    {
        id: 1,
        title: 'Куб',
        subtitle: 'Скільки граней?',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180">
            <rect x="60" y="20" width="80" height="80" fill="none" stroke="#ccc" stroke-width="2" stroke-dasharray="5,5"/>
            <rect x="40" y="60" width="80" height="80" fill="none" stroke="#EF8748" stroke-width="3"/>
            <line x1="40" y1="60" x2="60" y2="20" stroke="#34c759" stroke-width="2"/>
            <line x1="120" y1="60" x2="140" y2="20" stroke="#34c759" stroke-width="2"/>
            <line x1="120" y1="140" x2="140" y2="100" stroke="#ccc" stroke-width="2" stroke-dasharray="5,5"/>
            <line x1="40" y1="140" x2="60" y2="100" stroke="#ccc" stroke-width="2" stroke-dasharray="5,5"/>
        </svg>`,
        question: 'Скільки граней має куб?',
        options: ['4', '6', '8', '12'],
        correct: 1,
        explanation: 'Куб має 6 граней (верхня, нижня і 4 бічні), 12 ребер і 8 вершин.',
        formula: 'V = a^3, \\quad S = 6a^2'
    },
    {
        id: 2,
        title: 'Куб',
        subtitle: 'Діагональ грані',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180">
            <rect x="40" y="30" width="120" height="120" fill="none" stroke="#EF8748" stroke-width="3"/>
            <line x1="40" y1="30" x2="160" y2="150" stroke="#34c759" stroke-width="3"/>
            <text x="100" y="165" fill="#6e6e73" font-size="16" text-anchor="middle">a</text>
            <text x="170" y="95" fill="#6e6e73" font-size="16">a</text>
            <text x="90" y="85" fill="#34c759" font-size="16">d</text>
        </svg>`,
        question: 'Чому дорівнює діагональ грані куба зі стороною a?',
        options: ['a', 'a√2', 'a√3', '2a'],
        correct: 1,
        explanation: 'Діагональ квадрата (грані куба) обчислюється за теоремою Піфагора: d² = a² + a² = 2a², отже d = a√2',
        formula: 'd_{\\text{грані}} = a\\sqrt{2}'
    },
    {
        id: 3,
        title: 'Куб',
        subtitle: 'Діагональ куба',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180">
            <rect x="60" y="20" width="80" height="80" fill="none" stroke="#ccc" stroke-width="2" stroke-dasharray="5,5"/>
            <rect x="40" y="60" width="80" height="80" fill="none" stroke="#EF8748" stroke-width="2"/>
            <line x1="40" y1="60" x2="60" y2="20" stroke="#ccc" stroke-width="2"/>
            <line x1="120" y1="60" x2="140" y2="20" stroke="#ccc" stroke-width="2"/>
            <line x1="120" y1="140" x2="140" y2="100" stroke="#ccc" stroke-width="2" stroke-dasharray="5,5"/>
            <line x1="40" y1="140" x2="140" y2="20" stroke="#34c759" stroke-width="3"/>
            <circle cx="40" cy="140" r="5" fill="#34c759"/>
            <circle cx="140" cy="20" r="5" fill="#34c759"/>
        </svg>`,
        question: 'Чому дорівнює діагональ куба зі стороною a?',
        options: ['a√2', 'a√3', '2a', '3a'],
        correct: 1,
        explanation: 'Діагональ куба: D² = a² + a² + a² = 3a², отже D = a√3',
        formula: 'D_{\\text{куба}} = a\\sqrt{3}'
    },
    {
        id: 4,
        title: 'Піраміда',
        subtitle: 'Скільки граней?',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180">
            <polygon points="40,140 100,160 160,140 100,120" fill="none" stroke="#EF8748" stroke-width="2"/>
            <circle cx="100" cy="40" r="5" fill="#34c759"/>
            <line x1="40" y1="140" x2="100" y2="40" stroke="#34c759" stroke-width="2"/>
            <line x1="160" y1="140" x2="100" y2="40" stroke="#34c759" stroke-width="2"/>
            <line x1="100" y1="160" x2="100" y2="40" stroke="#ccc" stroke-width="2" stroke-dasharray="5,5"/>
            <line x1="100" y1="120" x2="100" y2="40" stroke="#34c759" stroke-width="2"/>
            <line x1="100" y1="40" x2="100" y2="140" stroke="#6e6e73" stroke-width="1" stroke-dasharray="3,3"/>
            <text x="108" y="95" fill="#6e6e73" font-size="14">h</text>
        </svg>`,
        question: 'Скільки граней має чотирикутна піраміда?',
        options: ['4', '5', '6', '8'],
        correct: 1,
        explanation: 'Чотирикутна піраміда має 5 граней: 1 основа (квадрат) + 4 бічні грані (трикутники).',
        formula: 'V = \\frac{1}{3}S_{\\text{осн}} \\cdot h'
    },
    {
        id: 5,
        title: 'Призма',
        subtitle: 'Об\'єм',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180">
            <polygon points="40,140 160,140 100,100" fill="none" stroke="#EF8748" stroke-width="3"/>
            <polygon points="40,60 160,60 100,20" fill="none" stroke="#EF8748" stroke-width="2"/>
            <line x1="40" y1="140" x2="40" y2="60" stroke="#34c759" stroke-width="2"/>
            <line x1="160" y1="140" x2="160" y2="60" stroke="#34c759" stroke-width="2"/>
            <line x1="100" y1="100" x2="100" y2="20" stroke="#ccc" stroke-width="2" stroke-dasharray="5,5"/>
            <text x="168" y="105" fill="#34c759" font-size="14">h</text>
        </svg>`,
        question: 'Як обчислити об\'єм призми?',
        options: ['V = a³', 'V = S·h', 'V = ⅓S·h', 'V = πr²h'],
        correct: 1,
        explanation: 'Об\'єм будь-якої призми = площа основи × висота. Це працює для будь-якої форми основи!',
        formula: 'V = S_{\\text{осн}} \\cdot h'
    },
    {
        id: 6,
        title: 'Циліндр',
        subtitle: 'Розгортка',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180">
            <rect x="20" y="40" width="160" height="80" fill="none" stroke="#EF8748" stroke-width="2"/>
            <ellipse cx="100" cy="40" rx="80" ry="15" fill="none" stroke="#34c759" stroke-width="2"/>
            <ellipse cx="100" cy="120" rx="80" ry="15" fill="none" stroke="#34c759" stroke-width="2"/>
            <text x="100" y="25" fill="#34c759" font-size="14" text-anchor="middle">2πr</text>
            <text x="8" y="85" fill="#6e6e73" font-size="14">h</text>
        </svg>`,
        question: 'Яка довжина розгортки бічної поверхні циліндра з радіусом r?',
        options: ['πr', '2r', '2πr', 'πr²'],
        correct: 2,
        explanation: 'Розгортка бічної поверхні циліндра — прямокутник. Його ширина = довжині кола основи = 2πr',
        formula: 'S_{\\text{біч}} = 2\\pi r \\cdot h'
    },
    {
        id: 7,
        title: 'Конус',
        subtitle: 'Твірна',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180">
            <ellipse cx="100" cy="150" rx="70" ry="20" fill="none" stroke="#EF8748" stroke-width="2"/>
            <circle cx="100" cy="30" r="5" fill="#34c759"/>
            <line x1="30" y1="150" x2="100" y2="30" stroke="#34c759" stroke-width="2"/>
            <line x1="170" y1="150" x2="100" y2="30" stroke="#34c759" stroke-width="2"/>
            <line x1="100" y1="30" x2="100" y2="150" stroke="#6e6e73" stroke-width="1" stroke-dasharray="3,3"/>
            <text x="108" y="95" fill="#6e6e73" font-size="14">h</text>
            <text x="55" y="80" fill="#34c759" font-size="14">l</text>
            <text x="130" y="165" fill="#EF8748" font-size="14">r</text>
        </svg>`,
        question: 'Як знайти твірну конуса l, знаючи h і r?',
        options: ['l = h + r', 'l = √(h² + r²)', 'l = h · r', 'l = √(h² - r²)'],
        correct: 1,
        explanation: 'Твірна, висота і радіус утворюють прямокутний трикутник. За теоремою Піфагора: l² = h² + r²',
        formula: 'l = \\sqrt{h^2 + r^2}'
    },
    {
        id: 8,
        title: 'Куля',
        subtitle: 'Об\'єм',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180">
            <circle cx="100" cy="90" r="70" fill="none" stroke="#EF8748" stroke-width="3"/>
            <ellipse cx="100" cy="90" rx="70" ry="20" fill="none" stroke="#ccc" stroke-width="1" stroke-dasharray="5,5"/>
            <line x1="100" y1="90" x2="170" y2="90" stroke="#34c759" stroke-width="2"/>
            <circle cx="100" cy="90" r="4" fill="#34c759"/>
            <text x="135" y="82" fill="#34c759" font-size="14">r</text>
        </svg>`,
        question: 'Як обчислити об\'єм кулі?',
        options: ['V = πr³', 'V = ⁴⁄₃πr³', 'V = ²⁄₃πr³', 'V = 4πr²'],
        correct: 1,
        explanation: 'Об\'єм кулі = ⁴⁄₃πr³. Площа поверхні кулі = 4πr².',
        formula: 'V = \\frac{4}{3}\\pi r^3'
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
let shuffledFigures = shuffle(figures);
let currentIndex = 0;
let correctCount = 0;
let answered = false;

// DOM Elements
const figureCard = document.getElementById('figureCard');
const optionsGrid = document.getElementById('optionsGrid');
const feedbackSection = document.getElementById('feedbackSection');
const nextBtn = document.getElementById('nextBtn');
const currentQ = document.getElementById('currentQ');
const totalQ = document.getElementById('totalQ');

// Initialize
function init() {
    totalQ.textContent = shuffledFigures.length;
    loadQuestion(currentIndex);
    setupEventListeners();
}

function setupEventListeners() {
    nextBtn.addEventListener('click', nextQuestion);
}

function loadQuestion(index) {
    const item = shuffledFigures[index];

    // Reset state
    answered = false;

    // Update progress
    currentQ.textContent = index + 1;

    // Render figure card
    figureCard.innerHTML = `
        <div class="figure-header">
            <span class="figure-icon">📦</span>
            <div>
                <div class="figure-title">${item.title}</div>
                <div class="figure-subtitle">${item.subtitle}</div>
            </div>
        </div>
        <div class="figure-display">${item.svg}</div>
        <div class="figure-question">${item.question}</div>
    `;

    // Render options
    optionsGrid.innerHTML = item.options.map((opt, i) => `
        <div class="option-btn" data-index="${i}">
            <span class="option-text">${opt}</span>
        </div>
    `).join('');

    // Add click handlers
    optionsGrid.querySelectorAll('.option-btn').forEach(opt => {
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
    const item = shuffledFigures[currentIndex];
    const isCorrect = index === item.correct;

    if (isCorrect) {
        correctCount++;
    }

    // Update options visually
    optionsGrid.querySelectorAll('.option-btn').forEach((opt, i) => {
        if (i === index) {
            opt.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
        if (i === item.correct && !isCorrect) {
            opt.classList.add('highlight');
        }
    });

    // Show feedback
    feedbackSection.innerHTML = `
        <div class="feedback-header ${isCorrect ? 'correct' : 'incorrect'}">
            ${isCorrect ? '✓ Правильно!' : '✗ Неправильно'}
        </div>
        <div class="feedback-text">${item.explanation}</div>
        <div class="feedback-formula" id="feedbackFormula"></div>
    `;

    feedbackSection.classList.remove('hidden');

    katex.render(item.formula, document.getElementById('feedbackFormula'), {
        throwOnError: false,
        displayMode: true
    });

    nextBtn.classList.remove('hidden');

    feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextQuestion() {
    currentIndex++;

    if (currentIndex >= shuffledFigures.length) {
        showCompletion();
        return;
    }

    loadQuestion(currentIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCompletion() {
    const percentage = Math.round((correctCount / shuffledFigures.length) * 100);

    figureCard.innerHTML = `
        <div class="completion-card">
            <div class="completion-icon">📦</div>
            <h2>Молодець!</h2>
            <p>Тепер ти краще розумієш стереометрію</p>

            <div class="completion-stats">
                <div class="stat">
                    <div class="stat-value">${correctCount}/${shuffledFigures.length}</div>
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

    optionsGrid.classList.add('hidden');
    feedbackSection.classList.add('hidden');
    nextBtn.classList.add('hidden');
}

// Start
init();
