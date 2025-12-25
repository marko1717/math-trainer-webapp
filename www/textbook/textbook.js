/**
 * Interactive Textbook with Character
 * Математика з Максом
 */

// ========== TOPICS DATA ==========
const TOPICS = [
    {
        id: 'natural-numbers',
        title: 'Натуральні числа',
        icon: '🔢',
        description: 'Основи: додавання, віднімання, множення, ділення',
        lessons: naturalNumbersLessons()
    },
    {
        id: 'fractions',
        title: 'Дроби',
        icon: '½',
        description: 'Звичайні та десяткові дроби',
        lessons: fractionsLessons()
    },
    {
        id: 'equations',
        title: 'Рівняння',
        icon: '⚖️',
        description: 'Лінійні та квадратні рівняння',
        lessons: equationsLessons()
    },
    {
        id: 'functions',
        title: 'Функції',
        icon: '📈',
        description: 'Графіки, властивості, перетворення',
        locked: true
    },
    {
        id: 'geometry',
        title: 'Геометрія',
        icon: '📐',
        description: 'Фігури, площі, об\'єми',
        locked: true
    },
    {
        id: 'trigonometry',
        title: 'Тригонометрія',
        icon: '🔄',
        description: 'Синус, косинус, тангенс',
        locked: true
    }
];

// ========== LESSON GENERATORS ==========

function naturalNumbersLessons() {
    return [
        {
            type: 'story',
            content: {
                character: '🧙',
                name: 'Макс',
                text: 'Сьогодні ми поговоримо про <span class="highlight">натуральні числа</span>. Це найпростіші числа, які ти знаєш з дитинства: 1, 2, 3, 4, 5... Вони використовуються для підрахунку предметів.'
            }
        },
        {
            type: 'content',
            content: {
                title: '📚 Що таке натуральні числа?',
                blocks: [
                    { type: 'text', content: 'Натуральні числа — це числа, які використовуються для лічби предметів.' },
                    { type: 'formula', content: '\\mathbb{N} = \\{1, 2, 3, 4, 5, ...\\}', label: 'Множина натуральних чисел' },
                    { type: 'text', content: 'Нуль НЕ є натуральним числом (за українською традицією).' }
                ]
            }
        },
        {
            type: 'story',
            content: {
                character: '🧙',
                name: 'Макс',
                text: 'Важлива властивість: якщо додати або помножити два натуральні числа, результат завжди буде натуральним числом. А от з відніманням та діленням — не завжди! 🤔'
            }
        },
        {
            type: 'interactive-choice',
            content: {
                question: 'Яке з цих чисел НЕ є натуральним?',
                options: ['5', '0', '100', '1'],
                correct: 1,
                explanation: 'Нуль не є натуральним числом!'
            }
        },
        {
            type: 'content',
            content: {
                title: '➕ Властивості додавання',
                blocks: [
                    { type: 'text', content: 'Додавання натуральних чисел має важливі властивості:' },
                    { type: 'formula', content: 'a + b = b + a', label: 'Комутативність (переставна)' },
                    { type: 'formula', content: '(a + b) + c = a + (b + c)', label: 'Асоціативність (сполучна)' }
                ]
            }
        },
        {
            type: 'interactive-input',
            content: {
                question: 'Обчисли: 17 + 25 + 83 = ?',
                hint: 'Спробуй спочатку скласти 17 і 83',
                answer: '125',
                explanation: '17 + 83 = 100, потім 100 + 25 = 125'
            }
        },
        {
            type: 'story',
            content: {
                character: '🧙',
                name: 'Макс',
                text: 'Чудово! Тепер поговоримо про <span class="highlight">множення</span>. Воно теж має корисні властивості, які спрощують обчислення.'
            }
        },
        {
            type: 'content',
            content: {
                title: '✖️ Властивості множення',
                blocks: [
                    { type: 'formula', content: 'a \\cdot b = b \\cdot a', label: 'Комутативність' },
                    { type: 'formula', content: '(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)', label: 'Асоціативність' },
                    { type: 'formula', content: 'a \\cdot (b + c) = a \\cdot b + a \\cdot c', label: 'Дистрибутивність' }
                ]
            }
        },
        {
            type: 'interactive-input',
            content: {
                question: 'Обчисли: 25 × 4 = ?',
                answer: '100',
                explanation: '25 × 4 = 100. Це корисне число для швидких обчислень!'
            }
        },
        {
            type: 'interactive-choice',
            content: {
                question: 'Яка властивість дозволяє переставляти множники?',
                options: ['Асоціативність', 'Комутативність', 'Дистрибутивність', 'Транзитивність'],
                correct: 1,
                explanation: 'Комутативність (переставна властивість): a × b = b × a'
            }
        },
        {
            type: 'completion',
            content: {
                title: 'Вітаю! 🎉',
                message: 'Ти опанував основи натуральних чисел!',
                points: 50
            }
        }
    ];
}

function fractionsLessons() {
    return [
        {
            type: 'story',
            content: {
                character: '🧙',
                name: 'Макс',
                text: 'Тепер перейдемо до <span class="highlight">дробів</span>! Дроби з\'явились, коли люди зрозуміли, що не все можна порахувати цілими числами. Як поділити одне яблуко на двох? 🍎'
            }
        },
        {
            type: 'content',
            content: {
                title: '🔢 Що таке дріб?',
                blocks: [
                    { type: 'text', content: 'Дріб — це частина цілого. Записується як:' },
                    { type: 'formula', content: '\\frac{a}{b}', label: 'Загальний вигляд дробу' },
                    { type: 'text', content: 'де a — чисельник (скільки частин взяли), b — знаменник (на скільки частин поділили).' }
                ]
            }
        },
        {
            type: 'interactive-choice',
            content: {
                question: 'Що означає дріб ¾?',
                options: ['3 поділити на 4', 'Взяли 3 з 4 частин', 'Обидва варіанти правильні', '4 поділити на 3'],
                correct: 2,
                explanation: 'Дріб ¾ означає і "3 поділити на 4", і "взяли 3 частини з 4".'
            }
        },
        {
            type: 'content',
            content: {
                title: '➕ Додавання дробів',
                blocks: [
                    { type: 'text', content: 'Щоб додати дроби з однаковими знаменниками:' },
                    { type: 'formula', content: '\\frac{a}{c} + \\frac{b}{c} = \\frac{a + b}{c}', label: 'Додавання дробів' },
                    { type: 'example', content: '\\frac{2}{5} + \\frac{1}{5} = \\frac{2+1}{5} = \\frac{3}{5}' }
                ]
            }
        },
        {
            type: 'interactive-input',
            content: {
                question: 'Обчисли: 2/7 + 3/7 = ?/7',
                hint: 'Додай чисельники',
                answer: '5',
                explanation: '2/7 + 3/7 = (2+3)/7 = 5/7'
            }
        },
        {
            type: 'story',
            content: {
                character: '🧙',
                name: 'Макс',
                text: 'А що робити, якщо знаменники <span class="highlight">різні</span>? Потрібно знайти спільний знаменник! Це як знайти спільну мову 😄'
            }
        },
        {
            type: 'content',
            content: {
                title: '🔄 Зведення до спільного знаменника',
                blocks: [
                    { type: 'text', content: 'Щоб додати дроби з різними знаменниками, зведи їх до спільного:' },
                    { type: 'formula', content: '\\frac{1}{2} + \\frac{1}{3} = \\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}', label: 'Приклад' }
                ]
            }
        },
        {
            type: 'interactive-input',
            content: {
                question: 'Обчисли: 1/2 + 1/4 = ?/4',
                hint: 'Спільний знаменник = 4',
                answer: '3',
                explanation: '1/2 = 2/4, тому 2/4 + 1/4 = 3/4'
            }
        },
        {
            type: 'completion',
            content: {
                title: 'Молодець! 🎉',
                message: 'Ти розібрався з дробами!',
                points: 60
            }
        }
    ];
}

function equationsLessons() {
    return [
        {
            type: 'story',
            content: {
                character: '🧙',
                name: 'Макс',
                text: 'Рівняння — це як загадка! У нас є невідоме <span class="highlight">x</span>, і наше завдання — знайти його значення. Готовий до детективної роботи? 🔍'
            }
        },
        {
            type: 'content',
            content: {
                title: '⚖️ Що таке рівняння?',
                blocks: [
                    { type: 'text', content: 'Рівняння — це рівність з невідомою величиною (зазвичай x).' },
                    { type: 'formula', content: '2x + 5 = 11', label: 'Приклад рівняння' },
                    { type: 'text', content: 'Розв\'язати рівняння — знайти таке x, при якому рівність виконується.' }
                ]
            }
        },
        {
            type: 'story',
            content: {
                character: '🧙',
                name: 'Макс',
                text: 'Головне правило: що робиш з однією частиною рівняння, те ж роби і з іншою! Як терези — щоб вони залишались у рівновазі ⚖️'
            }
        },
        {
            type: 'content',
            content: {
                title: '🔧 Розв\'язування лінійних рівнянь',
                blocks: [
                    { type: 'text', content: 'Крок 1: Перенеси числа в одну сторону, x — в іншу' },
                    { type: 'formula', content: '2x + 5 = 11 \\Rightarrow 2x = 11 - 5 \\Rightarrow 2x = 6' },
                    { type: 'text', content: 'Крок 2: Поділи обидві частини на коефіцієнт при x' },
                    { type: 'formula', content: 'x = \\frac{6}{2} = 3' }
                ]
            }
        },
        {
            type: 'interactive-input',
            content: {
                question: 'Розв\'яжи: 3x + 2 = 14. x = ?',
                hint: 'Перенеси 2 вправо, потім поділи на 3',
                answer: '4',
                explanation: '3x = 14 - 2 = 12, x = 12/3 = 4'
            }
        },
        {
            type: 'interactive-input',
            content: {
                question: 'Розв\'яжи: 5x - 10 = 25. x = ?',
                answer: '7',
                explanation: '5x = 25 + 10 = 35, x = 35/5 = 7'
            }
        },
        {
            type: 'story',
            content: {
                character: '🧙',
                name: 'Макс',
                text: 'Тепер перейдемо до <span class="highlight">квадратних рівнянь</span>! Вони складніші, але є чарівна формула — дискримінант ✨'
            }
        },
        {
            type: 'content',
            content: {
                title: '📊 Квадратне рівняння',
                blocks: [
                    { type: 'formula', content: 'ax^2 + bx + c = 0', label: 'Загальний вигляд' },
                    { type: 'formula', content: 'D = b^2 - 4ac', label: 'Дискримінант' },
                    { type: 'text', content: 'Якщо D > 0 — два корені, D = 0 — один корінь, D < 0 — немає коренів' },
                    { type: 'formula', content: 'x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}', label: 'Формула коренів' }
                ]
            }
        },
        {
            type: 'interactive-choice',
            content: {
                question: 'Скільки коренів має рівняння x² - 4 = 0?',
                options: ['0', '1', '2', 'Нескінченно'],
                correct: 2,
                explanation: 'x² = 4, x = ±2. Два корені: x₁ = 2, x₂ = -2'
            }
        },
        {
            type: 'interactive-input',
            content: {
                question: 'Знайди D для рівняння x² - 5x + 6 = 0',
                hint: 'D = b² - 4ac, де a=1, b=-5, c=6',
                answer: '1',
                explanation: 'D = (-5)² - 4·1·6 = 25 - 24 = 1'
            }
        },
        {
            type: 'completion',
            content: {
                title: 'Супер! 🎉',
                message: 'Ти освоїв рівняння!',
                points: 80
            }
        }
    ];
}

// ========== STATE ==========
let currentTopic = null;
let currentStep = 0;
let userProgress = {};

// Load progress
try {
    userProgress = JSON.parse(localStorage.getItem('textbook_progress') || '{}');
} catch (e) {
    userProgress = {};
}

// ========== RENDER FUNCTIONS ==========

function renderTopics() {
    const grid = document.getElementById('topicsGrid');
    grid.innerHTML = TOPICS.map(topic => {
        const progress = userProgress[topic.id] || 0;
        const totalLessons = topic.lessons ? topic.lessons.length : 0;
        const progressPercent = totalLessons > 0 ? Math.round((progress / totalLessons) * 100) : 0;

        return `
            <div class="topic-card ${topic.locked ? 'locked' : ''}" onclick="${topic.locked ? '' : `startTopic('${topic.id}')`}">
                <h3>${topic.icon} ${topic.title} ${topic.locked ? '🔒' : ''}</h3>
                <p>${topic.description}</p>
                ${!topic.locked ? `
                    <div class="topic-progress">
                        <div class="topic-progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function startTopic(topicId) {
    currentTopic = TOPICS.find(t => t.id === topicId);
    if (!currentTopic || !currentTopic.lessons) return;

    currentStep = userProgress[topicId] || 0;
    if (currentStep >= currentTopic.lessons.length) currentStep = 0;

    document.getElementById('topicView').style.display = 'none';
    document.getElementById('lessonView').classList.add('active');
    document.getElementById('lessonTitle').textContent = currentTopic.title;

    renderStep();
}

function showTopics() {
    document.getElementById('lessonView').classList.remove('active');
    document.getElementById('topicView').style.display = 'block';
    renderTopics();
}

function renderStep() {
    const lesson = currentTopic.lessons[currentStep];
    const container = document.getElementById('lessonContent');

    // Update progress indicator
    document.getElementById('lessonProgress').textContent = `${currentStep + 1}/${currentTopic.lessons.length}`;

    // Update nav buttons
    document.getElementById('prevBtn').style.visibility = currentStep > 0 ? 'visible' : 'hidden';

    let html = '';

    switch (lesson.type) {
        case 'story':
            html = renderStory(lesson.content);
            break;
        case 'content':
            html = renderContent(lesson.content);
            break;
        case 'interactive-input':
            html = renderInputInteractive(lesson.content);
            break;
        case 'interactive-choice':
            html = renderChoiceInteractive(lesson.content);
            break;
        case 'completion':
            html = renderCompletion(lesson.content);
            break;
    }

    container.innerHTML = html;

    // Render KaTeX
    container.querySelectorAll('.math').forEach(el => {
        katex.render(el.textContent, el, { throwOnError: false, displayMode: el.classList.contains('display') });
    });

    // Disable next button for interactive elements until answered
    if (lesson.type.startsWith('interactive-')) {
        document.getElementById('nextBtn').disabled = true;
    } else {
        document.getElementById('nextBtn').disabled = false;
    }

    // Update next button text for completion
    if (lesson.type === 'completion') {
        document.getElementById('nextBtn').textContent = 'Завершити ✓';
    } else if (currentStep === currentTopic.lessons.length - 1) {
        document.getElementById('nextBtn').textContent = 'Завершити ✓';
    } else {
        document.getElementById('nextBtn').textContent = 'Далі →';
    }
}

function renderStory(content) {
    return `
        <div class="character-section">
            <div class="character-avatar">${content.character}</div>
            <div class="character-bubble">
                <div class="character-name">${content.name}</div>
                <div class="character-text">${content.text}</div>
            </div>
        </div>
    `;
}

function renderContent(content) {
    let blocksHtml = content.blocks.map(block => {
        switch (block.type) {
            case 'text':
                return `<p>${block.content}</p>`;
            case 'formula':
                return `
                    <div class="formula-box">
                        <span class="math display">${block.content}</span>
                        ${block.label ? `<div class="formula-label">${block.label}</div>` : ''}
                    </div>
                `;
            case 'example':
                return `
                    <div class="example-box">
                        <h4>💡 Приклад</h4>
                        <span class="math display">${block.content}</span>
                    </div>
                `;
            default:
                return '';
        }
    }).join('');

    return `
        <div class="content-block">
            <h2>${content.title}</h2>
            ${blocksHtml}
        </div>
    `;
}

function renderInputInteractive(content) {
    return `
        <div class="interactive-block" id="interactiveBlock">
            <h3>✏️ Твоя черга!</h3>
            <p style="margin-bottom: 16px;">${content.question}</p>
            ${content.hint ? `<p style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 16px;">💡 Підказка: ${content.hint}</p>` : ''}
            <div class="input-group">
                <input type="text" class="math-input" id="userAnswer" placeholder="Введи відповідь..." onkeypress="if(event.key==='Enter')checkInputAnswer()">
                <button class="check-btn" onclick="checkInputAnswer()">Перевірити</button>
            </div>
            <div class="feedback" id="feedback"></div>
        </div>
    `;
}

function renderChoiceInteractive(content) {
    const optionsHtml = content.options.map((opt, i) => `
        <button class="choice-btn" onclick="selectChoice(${i})" data-index="${i}">${opt}</button>
    `).join('');

    return `
        <div class="interactive-block" id="interactiveBlock">
            <h3>🤔 Вибери правильну відповідь</h3>
            <p style="margin-bottom: 16px;">${content.question}</p>
            <div class="choice-grid" id="choiceGrid">
                ${optionsHtml}
            </div>
            <div class="feedback" id="feedback"></div>
        </div>
    `;
}

function renderCompletion(content) {
    return `
        <div class="completion-screen">
            <div class="completion-icon">🏆</div>
            <h2>${content.title}</h2>
            <p style="color: var(--text-dim);">${content.message}</p>
            <div class="completion-stats">
                <div class="stat-item">
                    <div class="stat-value">+${content.points}</div>
                    <div class="stat-label">балів</div>
                </div>
            </div>
        </div>
    `;
}

// ========== INTERACTION HANDLERS ==========

function checkInputAnswer() {
    const input = document.getElementById('userAnswer');
    const feedback = document.getElementById('feedback');
    const block = document.getElementById('interactiveBlock');
    const lesson = currentTopic.lessons[currentStep];

    const userAnswer = input.value.trim().toLowerCase().replace(/\s/g, '');
    const correctAnswer = lesson.content.answer.toLowerCase().replace(/\s/g, '');

    if (userAnswer === correctAnswer) {
        block.classList.add('correct');
        feedback.className = 'feedback show success';
        feedback.innerHTML = `✓ Правильно! ${lesson.content.explanation || ''}`;
        input.disabled = true;
        document.querySelector('.check-btn').disabled = true;
        document.getElementById('nextBtn').disabled = false;
    } else {
        block.classList.add('incorrect');
        feedback.className = 'feedback show error';
        feedback.innerHTML = `✗ Спробуй ще раз!`;
        setTimeout(() => {
            block.classList.remove('incorrect');
        }, 500);
    }
}

function selectChoice(index) {
    const lesson = currentTopic.lessons[currentStep];
    const buttons = document.querySelectorAll('.choice-btn');
    const feedback = document.getElementById('feedback');
    const block = document.getElementById('interactiveBlock');

    buttons.forEach(btn => btn.disabled = true);

    if (index === lesson.content.correct) {
        buttons[index].classList.add('correct');
        block.classList.add('correct');
        feedback.className = 'feedback show success';
        feedback.innerHTML = `✓ Правильно! ${lesson.content.explanation || ''}`;
        document.getElementById('nextBtn').disabled = false;
    } else {
        buttons[index].classList.add('incorrect');
        buttons[lesson.content.correct].classList.add('correct');
        block.classList.add('incorrect');
        feedback.className = 'feedback show error';
        feedback.innerHTML = `✗ Неправильно. ${lesson.content.explanation || ''}`;
        setTimeout(() => {
            document.getElementById('nextBtn').disabled = false;
        }, 1500);
    }
}

function nextStep() {
    if (currentStep < currentTopic.lessons.length - 1) {
        currentStep++;
        saveProgress();
        renderStep();
        window.scrollTo(0, 0);
    } else {
        // Topic completed
        userProgress[currentTopic.id] = currentTopic.lessons.length;
        saveProgress();
        showTopics();
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        renderStep();
        window.scrollTo(0, 0);
    }
}

function saveProgress() {
    userProgress[currentTopic.id] = Math.max(userProgress[currentTopic.id] || 0, currentStep);
    localStorage.setItem('textbook_progress', JSON.stringify(userProgress));
}

// ========== INIT ==========
renderTopics();
