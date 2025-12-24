// Stories data
const stories = [
    {
        id: 'pythagoras',
        name: 'Піфагор',
        emoji: '📐',
        slides: [
            {
                icon: '📐',
                title: 'Теорема Піфагора',
                formula: 'a^2 + b^2 = c^2',
                description: 'У прямокутному трикутнику квадрат гіпотенузи дорівнює сумі квадратів катетів',
                animation: `
                    <svg viewBox="0 0 200 160" fill="none">
                        <line class="triangle-side" x1="20" y1="140" x2="180" y2="140" stroke="#EF8748" stroke-width="3"/>
                        <line class="triangle-side" x1="180" y1="140" x2="180" y2="40" stroke="#EF8748" stroke-width="3"/>
                        <line class="triangle-side" x1="180" y1="40" x2="20" y2="140" stroke="#34c759" stroke-width="3"/>
                        <text x="100" y="158" fill="#6e6e73" font-size="14" text-anchor="middle">a</text>
                        <text x="192" y="95" fill="#6e6e73" font-size="14">b</text>
                        <text x="90" y="82" fill="#34c759" font-size="14">c</text>
                    </svg>
                `
            },
            {
                icon: '💡',
                title: 'Приклад',
                formula: '3^2 + 4^2 = 5^2',
                description: 'Трійка (3, 4, 5) — найвідоміша Піфагорова трійка',
                example: {
                    label: 'Перевірка',
                    content: '9 + 16 = 25 ✓'
                }
            },
            {
                icon: '🎯',
                title: 'Знайти гіпотенузу',
                formula: 'c = \\sqrt{a^2 + b^2}',
                description: 'Щоб знайти гіпотенузу, витягуємо корінь із суми квадратів катетів'
            }
        ]
    },
    {
        id: 'sin-cos',
        name: 'sin/cos',
        emoji: '🔄',
        slides: [
            {
                icon: '🔄',
                title: 'Основна тотожність',
                formula: '\\sin^2\\alpha + \\cos^2\\alpha = 1',
                description: 'Сума квадратів синуса і косинуса будь-якого кута дорівнює одиниці'
            },
            {
                icon: '📊',
                title: 'Виразити sin',
                formula: '\\sin\\alpha = \\pm\\sqrt{1 - \\cos^2\\alpha}',
                description: 'Знак залежить від чверті, в якій знаходиться кут'
            },
            {
                icon: '📊',
                title: 'Виразити cos',
                formula: '\\cos\\alpha = \\pm\\sqrt{1 - \\sin^2\\alpha}',
                description: 'Корисно, коли відомий синус, а треба знайти косинус'
            }
        ]
    },
    {
        id: 'quadratic',
        name: 'Дискримінант',
        emoji: '📈',
        slides: [
            {
                icon: '📈',
                title: 'Квадратне рівняння',
                formula: 'ax^2 + bx + c = 0',
                description: 'Загальний вигляд квадратного рівняння'
            },
            {
                icon: '🔢',
                title: 'Дискримінант',
                formula: 'D = b^2 - 4ac',
                description: 'Дискримінант визначає кількість коренів рівняння'
            },
            {
                icon: '✨',
                title: 'Формула коренів',
                formula: 'x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}',
                description: 'Якщо D > 0 — два корені, D = 0 — один, D < 0 — немає'
            },
            {
                icon: '💡',
                title: 'Теорема Вієта',
                formula: 'x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 \\cdot x_2 = \\frac{c}{a}',
                description: 'Зв\'язок між коренями та коефіцієнтами'
            }
        ]
    },
    {
        id: 'circle',
        name: 'Коло',
        emoji: '⭕',
        slides: [
            {
                icon: '⭕',
                title: 'Довжина кола',
                formula: 'C = 2\\pi r',
                description: 'Довжина кола через радіус',
                animation: `
                    <svg viewBox="0 0 200 200" fill="none">
                        <circle class="animated-circle" cx="100" cy="100" r="70" stroke="#EF8748" stroke-width="3" fill="none"/>
                        <line x1="100" y1="100" x2="170" y2="100" stroke="#34c759" stroke-width="2"/>
                        <text x="135" y="95" fill="#34c759" font-size="14">r</text>
                        <circle cx="100" cy="100" r="4" fill="#EF8748"/>
                    </svg>
                `
            },
            {
                icon: '🔵',
                title: 'Площа круга',
                formula: 'S = \\pi r^2',
                description: 'Площа круга дорівнює π помножене на квадрат радіуса'
            },
            {
                icon: '📏',
                title: 'Через діаметр',
                formula: 'C = \\pi d, \\quad S = \\frac{\\pi d^2}{4}',
                description: 'Формули через діаметр (d = 2r)'
            }
        ]
    },
    {
        id: 'progressions',
        name: 'Прогресії',
        emoji: '📶',
        slides: [
            {
                icon: '➕',
                title: 'Арифметична прогресія',
                formula: 'a_n = a_1 + (n-1)d',
                description: 'Кожен наступний член більший на d'
            },
            {
                icon: '📊',
                title: 'Сума АП',
                formula: 'S_n = \\frac{(a_1 + a_n) \\cdot n}{2}',
                description: 'Сума перших n членів арифметичної прогресії'
            },
            {
                icon: '✖️',
                title: 'Геометрична прогресія',
                formula: 'b_n = b_1 \\cdot q^{n-1}',
                description: 'Кожен наступний член більший у q разів'
            },
            {
                icon: '📈',
                title: 'Сума ГП',
                formula: 'S_n = \\frac{b_1(q^n - 1)}{q - 1}',
                description: 'Сума перших n членів геометричної прогресії (q ≠ 1)'
            }
        ]
    },
    {
        id: 'trig-values',
        name: 'Значення',
        emoji: '🎯',
        slides: [
            {
                icon: '0️⃣',
                title: 'sin і cos для 0°',
                formula: '\\sin 0° = 0, \\quad \\cos 0° = 1',
                description: 'Початкові значення тригонометричних функцій'
            },
            {
                icon: '3️⃣',
                title: 'sin і cos для 30°',
                formula: '\\sin 30° = \\frac{1}{2}, \\quad \\cos 30° = \\frac{\\sqrt{3}}{2}',
                description: 'Запам\'ятай: синус зростає від 0 до 1'
            },
            {
                icon: '4️⃣',
                title: 'sin і cos для 45°',
                formula: '\\sin 45° = \\cos 45° = \\frac{\\sqrt{2}}{2}',
                description: 'На 45° синус і косинус рівні'
            },
            {
                icon: '6️⃣',
                title: 'sin і cos для 60°',
                formula: '\\sin 60° = \\frac{\\sqrt{3}}{2}, \\quad \\cos 60° = \\frac{1}{2}',
                description: 'Протилежно до 30°'
            },
            {
                icon: '9️⃣',
                title: 'sin і cos для 90°',
                formula: '\\sin 90° = 1, \\quad \\cos 90° = 0',
                description: 'Синус досягає максимуму, косинус — нуля'
            }
        ]
    }
];

// State
let currentStoryIndex = -1;
let currentSlideIndex = 0;
let progressInterval = null;
let viewedStories = new Set(JSON.parse(localStorage.getItem('viewedStories') || '[]'));

// ========== AUTO-GENERATED STORIES (6-hour rotation, 3-4 per day) ==========
const STORY_GENERATION_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours
const AUTO_STORIES_KEY = 'autoStoriesData';
const AI_API_URL = 'https://marko17.pythonanywhere.com/api/hint';

// Story types for variety
const STORY_TYPES = ['fact', 'animation', 'problem', 'tip'];

// Math topics for AI generation
const mathTopics = [
    { id: 'algebra', name: 'Алгебра', emoji: '🔢' },
    { id: 'geometry', name: 'Геометрія', emoji: '📐' },
    { id: 'trigonometry', name: 'Тригонометрія', emoji: '🔄' },
    { id: 'calculus', name: 'Похідна', emoji: '📈' },
    { id: 'sequences', name: 'Прогресії', emoji: '📶' },
    { id: 'probability', name: 'Ймовірність', emoji: '🎲' },
    { id: 'logarithm', name: 'Логарифми', emoji: '📊' },
    { id: 'powers', name: 'Степені', emoji: '⚡' },
    { id: 'equations', name: 'Рівняння', emoji: '⚖️' },
    { id: 'functions', name: 'Функції', emoji: '📉' }
];

// Pre-built animated stories with SVG animations
const animatedStoryTemplates = [
    {
        topic: 'Теорема Піфагора',
        emoji: '📐',
        slides: [
            {
                icon: '📐',
                title: 'Теорема Піфагора',
                formula: 'a^2 + b^2 = c^2',
                description: 'Дивись, як квадрати катетів складаються у квадрат гіпотенузи!',
                animation: `<svg viewBox="0 0 240 200" fill="none">
                    <rect class="anim-square" x="20" y="100" width="60" height="60" fill="rgba(239,135,72,0.3)" stroke="#EF8748" stroke-width="2"/>
                    <rect class="anim-square delay-1" x="90" y="100" width="80" height="80" fill="rgba(52,199,89,0.3)" stroke="#34c759" stroke-width="2" transform="rotate(-90, 130, 140)"/>
                    <rect class="anim-square delay-2" x="100" y="20" width="100" height="100" fill="rgba(0,122,255,0.3)" stroke="#007AFF" stroke-width="2" transform="rotate(37, 150, 70)"/>
                    <text x="50" y="135" fill="#EF8748" font-size="12" text-anchor="middle">a²</text>
                    <text x="130" y="95" fill="#34c759" font-size="12" text-anchor="middle">b²</text>
                    <text x="180" y="70" fill="#007AFF" font-size="14" text-anchor="middle">c²</text>
                </svg>`
            }
        ]
    },
    {
        topic: 'Одиничне коло',
        emoji: '🔄',
        slides: [
            {
                icon: '🔄',
                title: 'Одиничне коло',
                formula: '\\sin^2\\theta + \\cos^2\\theta = 1',
                description: 'Точка рухається по колу — її координати це cos і sin!',
                animation: `<svg viewBox="0 0 200 200" fill="none">
                    <circle cx="100" cy="100" r="70" stroke="#e5e5ea" stroke-width="1" fill="none"/>
                    <line x1="20" y1="100" x2="180" y2="100" stroke="#e5e5ea" stroke-width="1"/>
                    <line x1="100" y1="20" x2="100" y2="180" stroke="#e5e5ea" stroke-width="1"/>
                    <circle class="moving-point" cx="170" cy="100" r="8" fill="#EF8748"/>
                    <line class="cos-line" x1="100" y1="100" x2="170" y2="100" stroke="#34c759" stroke-width="2"/>
                    <line class="sin-line" x1="170" y1="100" x2="170" y2="100" stroke="#007AFF" stroke-width="2"/>
                    <text x="135" y="118" fill="#34c759" font-size="11">cos θ</text>
                    <text x="175" y="100" fill="#007AFF" font-size="11">sin θ</text>
                </svg>`
            }
        ]
    },
    {
        topic: 'Парабола',
        emoji: '📈',
        slides: [
            {
                icon: '📈',
                title: 'Графік параболи',
                formula: 'y = ax^2 + bx + c',
                description: 'Знак "a" визначає напрямок вітей: a > 0 — вгору, a < 0 — вниз',
                animation: `<svg viewBox="0 0 200 150" fill="none">
                    <line x1="10" y1="120" x2="190" y2="120" stroke="#e5e5ea" stroke-width="1"/>
                    <line x1="100" y1="10" x2="100" y2="140" stroke="#e5e5ea" stroke-width="1"/>
                    <path class="draw-path" d="M 20 20 Q 100 140 180 20" stroke="#EF8748" stroke-width="3" fill="none"/>
                    <circle class="vertex-point" cx="100" cy="120" r="5" fill="#34c759"/>
                    <text x="108" y="135" fill="#34c759" font-size="10">вершина</text>
                </svg>`
            }
        ]
    },
    {
        topic: 'Похідна',
        emoji: '📉',
        slides: [
            {
                icon: '📉',
                title: 'Похідна як нахил',
                formula: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
                description: 'Похідна показує швидкість зміни функції — нахил дотичної!',
                animation: `<svg viewBox="0 0 200 150" fill="none">
                    <path d="M 20 120 Q 60 40 100 80 T 180 30" stroke="#EF8748" stroke-width="2" fill="none"/>
                    <line class="tangent-line" x1="60" y1="100" x2="140" y2="40" stroke="#34c759" stroke-width="2"/>
                    <circle cx="100" cy="70" r="5" fill="#007AFF"/>
                    <text x="105" y="60" fill="#007AFF" font-size="10">точка</text>
                    <text x="145" y="45" fill="#34c759" font-size="10">дотична</text>
                </svg>`
            }
        ]
    }
];

// Problem templates for "problem" type stories
const problemTemplates = [
    {
        topic: 'Квадратне рівняння',
        emoji: '🧮',
        slides: [
            { icon: '❓', title: 'Задача', formula: 'x^2 - 5x + 6 = 0', description: 'Знайди корені рівняння' },
            { icon: '💡', title: 'Розв\'язок', formula: 'D = 25 - 24 = 1', description: 'Дискримінант додатний — два корені' },
            { icon: '✅', title: 'Відповідь', formula: 'x_1 = 2, \\quad x_2 = 3', description: 'Перевірка: 2 + 3 = 5, 2 × 3 = 6 ✓' }
        ]
    },
    {
        topic: 'Система рівнянь',
        emoji: '⚖️',
        slides: [
            { icon: '❓', title: 'Задача', formula: '\\begin{cases} x + y = 7 \\\\ x - y = 3 \\end{cases}', description: 'Розв\'яжи систему' },
            { icon: '💡', title: 'Додамо рівняння', formula: '2x = 10 \\Rightarrow x = 5', description: 'Складаємо перше і друге рівняння' },
            { icon: '✅', title: 'Відповідь', formula: 'x = 5, \\quad y = 2', description: 'Підставляємо: 5 + 2 = 7, 5 - 2 = 3 ✓' }
        ]
    },
    {
        topic: 'Логарифм',
        emoji: '📊',
        slides: [
            { icon: '❓', title: 'Задача', formula: '\\log_2 8 + \\log_2 4 = ?', description: 'Обчисли суму логарифмів' },
            { icon: '💡', title: 'Властивість', formula: '\\log_a b + \\log_a c = \\log_a (bc)', description: 'Використаємо властивість суми' },
            { icon: '✅', title: 'Відповідь', formula: '\\log_2 32 = 5', description: 'Бо 2⁵ = 32' }
        ]
    },
    {
        topic: 'Тригонометрія',
        emoji: '🔄',
        slides: [
            { icon: '❓', title: 'Задача', formula: '\\sin 30° + \\cos 60° = ?', description: 'Обчисли вираз' },
            { icon: '💡', title: 'Табличні значення', formula: '\\sin 30° = \\frac{1}{2}, \\quad \\cos 60° = \\frac{1}{2}', description: 'Згадаємо таблицю' },
            { icon: '✅', title: 'Відповідь', formula: '\\frac{1}{2} + \\frac{1}{2} = 1', description: 'Ці кути — доповняльні!' }
        ]
    },
    {
        topic: 'Прогресії',
        emoji: '📶',
        slides: [
            { icon: '❓', title: 'Задача', formula: 'a_1 = 3, d = 2, n = 10', description: 'Знайди 10-й член АП' },
            { icon: '💡', title: 'Формула', formula: 'a_n = a_1 + (n-1)d', description: 'Формула n-го члена АП' },
            { icon: '✅', title: 'Відповідь', formula: 'a_{10} = 3 + 9 \\cdot 2 = 21', description: 'Підставляємо значення' }
        ]
    }
];

// Math tips for "tip" type stories
const mathTips = [
    {
        topic: 'Лайфхак: Множення на 11',
        emoji: '✨',
        slides: [
            { icon: '✨', title: 'Множення на 11', formula: '23 \\times 11 = 253', description: 'Розсунь цифри і встав їх суму!' },
            { icon: '🔢', title: 'Як це працює', formula: '2 \\underline{\\quad} 3 \\to 2 \\underline{5} 3', description: '2 + 3 = 5, вставляємо між цифрами' },
            { icon: '💡', title: 'Ще приклад', formula: '45 \\times 11 = 495', description: '4 + 5 = 9. Якщо сума > 9, переносимо!' }
        ]
    },
    {
        topic: 'Лайфхак: Квадрати',
        emoji: '🎯',
        slides: [
            { icon: '🎯', title: 'Квадрат числа на 5', formula: '25^2 = 625', description: 'Числа, що закінчуються на 5, легко підносити до квадрату' },
            { icon: '🔢', title: 'Правило', formula: 'n5^2 = n(n+1) | 25', description: 'Множимо першу цифру на наступну, дописуємо 25' },
            { icon: '✅', title: 'Приклади', formula: '35^2 = 1225, \\quad 85^2 = 7225', description: '3×4=12, дописуємо 25. 8×9=72, дописуємо 25' }
        ]
    },
    {
        topic: 'Запам\'ятай: sin і cos',
        emoji: '🧠',
        slides: [
            { icon: '🧠', title: 'Мнемоніка', formula: '\\sin \\to \\text{"солдат"} \\to \\frac{\\text{протилежний}}{\\text{гіпотенуза}}', description: 'Синус — Солдат дивиться Прямо (протилежний катет)' },
            { icon: '📐', title: 'Косинус', formula: '\\cos \\to \\text{"козак"} \\to \\frac{\\text{прилеглий}}{\\text{гіпотенуза}}', description: 'Косинус — Козак дивиться вбік (прилеглий катет)' },
            { icon: '💡', title: 'Тангенс', formula: '\\tan = \\frac{\\sin}{\\cos} = \\frac{\\text{протилежний}}{\\text{прилеглий}}', description: 'Тангенс — синус поділити на косинус' }
        ]
    }
];

// Get auto stories data from localStorage
function getAutoStoriesData() {
    try {
        return JSON.parse(localStorage.getItem(AUTO_STORIES_KEY) || '{}');
    } catch (e) {
        return {};
    }
}

// Save auto stories data
function saveAutoStoriesData(data) {
    localStorage.setItem(AUTO_STORIES_KEY, JSON.stringify(data));
}

// Get the current 6-hour slot index (0-3 for the day)
function getCurrentSlotIndex() {
    const now = new Date();
    const hours = now.getHours();
    return Math.floor(hours / 6); // 0-5: slot 0, 6-11: slot 1, 12-17: slot 2, 18-23: slot 3
}

// Get today's date string for comparison
function getTodayString() {
    return new Date().toDateString();
}

// Check if we should generate new stories for current slot
function shouldGenerateNewStories() {
    const data = getAutoStoriesData();
    const currentSlot = getCurrentSlotIndex();
    const today = getTodayString();

    // Reset if it's a new day
    if (data.date !== today) return true;

    // Check if current slot is already generated
    if (!data.slots || !data.slots[currentSlot]) return true;

    return false;
}

// Get time until next story slot
function getTimeUntilNextSlot() {
    const now = new Date();
    const currentSlot = getCurrentSlotIndex();
    const nextSlotHour = (currentSlot + 1) * 6;

    // If next slot is tomorrow
    if (nextSlotHour >= 24) {
        const hoursRemaining = 24 - now.getHours();
        const minutesRemaining = 60 - now.getMinutes();
        return { hours: hoursRemaining, minutes: minutesRemaining % 60 };
    }

    const hoursRemaining = nextSlotHour - now.getHours() - 1;
    const minutesRemaining = 60 - now.getMinutes();

    return {
        hours: hoursRemaining + (minutesRemaining === 60 ? 1 : 0),
        minutes: minutesRemaining % 60
    };
}

// Get a random story based on type
function getRandomStoryByType(type, usedIndices = {}) {
    let templates, key;

    switch (type) {
        case 'animation':
            templates = animatedStoryTemplates;
            key = 'animation';
            break;
        case 'problem':
            templates = problemTemplates;
            key = 'problem';
            break;
        case 'tip':
            templates = mathTips;
            key = 'tip';
            break;
        case 'fact':
        default:
            // Generate AI fact or use fallback
            return generateFactStory();
    }

    // Pick a random unused template
    const available = templates.filter((_, i) => !(usedIndices[key] || []).includes(i));
    if (available.length === 0) {
        usedIndices[key] = []; // Reset if all used
        return { ...templates[Math.floor(Math.random() * templates.length)] };
    }

    const index = Math.floor(Math.random() * available.length);
    const originalIndex = templates.indexOf(available[index]);
    usedIndices[key] = [...(usedIndices[key] || []), originalIndex];

    return { ...available[index] };
}

// Generate a fact-type story
async function generateFactStory() {
    const topic = mathTopics[Math.floor(Math.random() * mathTopics.length)];

    // Try AI generation
    try {
        const response = await fetch(AI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: topic.id,
                question: 'Згенеруй цікавий математичний факт, формулу або властивість для учня 9-11 класу. Дай формулу у форматі LaTeX та коротке пояснення українською. Формат відповіді: спочатку формула, потім пояснення.',
                level: 2,
                context: { type: 'story_fact', generateNew: true }
            })
        });

        if (response.ok) {
            const data = await response.json();
            const content = data.hint || getRandomFallbackFact(topic);
            return createFactStoryFromContent(topic, content);
        }
    } catch (e) {
        console.error('AI fact generation error:', e);
    }

    // Fallback
    const content = getRandomFallbackFact(topic);
    return createFactStoryFromContent(topic, content);
}

// Create a story object from fact content
function createFactStoryFromContent(topic, content) {
    const formula = extractFormula(content) || getDefaultFormula(topic.id);
    return {
        topic: topic.name,
        emoji: topic.emoji,
        slides: [
            {
                icon: topic.emoji,
                title: topic.name,
                formula: formula,
                description: content
            }
        ]
    };
}

// Get default formula for topic
function getDefaultFormula(topicId) {
    const formulas = {
        algebra: 'a^2 - b^2 = (a-b)(a+b)',
        geometry: 'S = \\frac{1}{2}ah',
        trigonometry: '\\sin^2\\alpha + \\cos^2\\alpha = 1',
        calculus: "(x^n)' = nx^{n-1}",
        sequences: 'a_n = a_1 + (n-1)d',
        probability: 'P(A) = \\frac{m}{n}',
        logarithm: '\\log_a(bc) = \\log_a b + \\log_a c',
        powers: 'a^m \\cdot a^n = a^{m+n}',
        equations: 'x = \\frac{-b \\pm \\sqrt{D}}{2a}',
        functions: 'f(x) = ax^2 + bx + c'
    };
    return formulas[topicId] || 'x^2 + y^2 = r^2';
}

// Fallback facts when API unavailable
function getRandomFallbackFact(topic) {
    const fallbackFacts = {
        algebra: [
            'Формули скороченого множення: (a+b)² = a² + 2ab + b²',
            'Різниця квадратів: a² - b² = (a-b)(a+b)',
            'Куб суми: (a+b)³ = a³ + 3a²b + 3ab² + b³'
        ],
        geometry: [
            'Сума кутів трикутника = 180°',
            'Площа трикутника S = ½·a·h',
            'Теорема Піфагора: a² + b² = c²'
        ],
        trigonometry: [
            'sin²α + cos²α = 1',
            'sin(α+β) = sinα·cosβ + cosα·sinβ',
            'tgα = sinα / cosα'
        ],
        calculus: [
            'Похідна (xⁿ)\' = n·xⁿ⁻¹',
            'Похідна (sin x)\' = cos x',
            'Похідна (eˣ)\' = eˣ'
        ],
        sequences: [
            'АП: aₙ = a₁ + (n-1)d',
            'ГП: bₙ = b₁ · qⁿ⁻¹',
            'Сума АП: Sₙ = (a₁+aₙ)·n/2'
        ],
        probability: [
            'P(A) = m/n (сприятливі / всі)',
            'P(A∪B) = P(A) + P(B) - P(A∩B)',
            'Cₙᵏ = n! / (k!(n-k)!)'
        ],
        logarithm: [
            'logₐ(bc) = logₐb + logₐc',
            'logₐ(b/c) = logₐb - logₐc',
            'logₐbⁿ = n·logₐb'
        ],
        powers: [
            'aᵐ · aⁿ = aᵐ⁺ⁿ',
            'aᵐ / aⁿ = aᵐ⁻ⁿ',
            '(aᵐ)ⁿ = aᵐⁿ'
        ],
        equations: [
            'Дискримінант: D = b² - 4ac',
            'Теорема Вієта: x₁ + x₂ = -b/a',
            'Квадратне рівняння: ax² + bx + c = 0'
        ],
        functions: [
            'Область визначення — всі допустимі x',
            'Парна функція: f(-x) = f(x)',
            'Непарна функція: f(-x) = -f(x)'
        ]
    };

    const facts = fallbackFacts[topic.id] || fallbackFacts.algebra;
    return facts[Math.floor(Math.random() * facts.length)];
}

// Generate stories for current slot
async function generateStoriesForCurrentSlot() {
    const data = getAutoStoriesData();
    const currentSlot = getCurrentSlotIndex();
    const today = getTodayString();

    // Reset if new day
    if (data.date !== today) {
        data.date = today;
        data.slots = {};
        data.usedIndices = {};
    }

    // Determine story type for this slot (rotating through types)
    const storyTypes = ['fact', 'animation', 'problem', 'tip'];
    const storyType = storyTypes[currentSlot % storyTypes.length];

    // Generate story
    const story = await getRandomStoryByType(storyType, data.usedIndices || {});

    // Save to slot
    data.slots = data.slots || {};
    data.slots[currentSlot] = {
        story: story,
        type: storyType,
        generatedAt: Date.now()
    };

    saveAutoStoriesData(data);
    return story;
}

// Get all active auto-generated stories for today
async function getActiveAutoStories() {
    const data = getAutoStoriesData();
    const today = getTodayString();
    const currentSlot = getCurrentSlotIndex();

    // Check if we need to generate for current slot
    if (shouldGenerateNewStories()) {
        await generateStoriesForCurrentSlot();
    }

    // Reload data after potential generation
    const updatedData = getAutoStoriesData();

    // Return all generated stories for today (up to current slot)
    const activeStories = [];
    for (let slot = 0; slot <= currentSlot; slot++) {
        if (updatedData.slots && updatedData.slots[slot]) {
            activeStories.push({
                ...updatedData.slots[slot].story,
                slotIndex: slot,
                type: updatedData.slots[slot].type,
                isNew: !viewedStories.has(`auto-${today}-${slot}`)
            });
        }
    }

    return activeStories;
}

// DOM Elements
const storiesScroll = document.getElementById('storiesScroll');
const storyViewer = document.getElementById('storyViewer');
const storyProgress = document.getElementById('storyProgress');
const storyAvatar = document.getElementById('storyAvatar');
const storyTitle = document.getElementById('storyTitle');
const storyContent = document.getElementById('storyContent');
const storyClose = document.getElementById('storyClose');
const navLeft = document.getElementById('navLeft');
const navRight = document.getElementById('navRight');
const mainContent = document.getElementById('mainContent');

// Initialize
async function init() {
    await renderStoryCircles();
    setupEventListeners();
}

async function renderStoryCircles() {
    const today = getTodayString();
    const timeUntilNext = getTimeUntilNextSlot();

    // Get all auto-generated stories for today
    const autoStories = await getActiveAutoStories();

    // Type icons for auto stories
    const typeIcons = {
        fact: '💡',
        animation: '🎬',
        problem: '🧮',
        tip: '✨'
    };

    const typeNames = {
        fact: 'Факт',
        animation: 'Анімація',
        problem: 'Задача',
        tip: 'Лайфхак'
    };

    // Build auto-generated story circles
    let autoStoriesHTML = autoStories.map((story, index) => {
        const isViewed = viewedStories.has(`auto-${today}-${story.slotIndex}`);
        const icon = story.emoji || typeIcons[story.type] || '💡';
        const name = story.topic || typeNames[story.type] || 'Нове';

        return `
            <div class="story-circle auto-story ${isViewed ? 'viewed' : 'new-available'}" data-type="auto" data-slot="${story.slotIndex}">
                <div class="story-avatar-wrapper ${!isViewed ? 'rainbow' : ''}">
                    <div class="story-avatar-inner ${!isViewed ? 'auto-story-avatar' : ''}">
                        <span class="emoji">${icon}</span>
                    </div>
                </div>
                <span class="story-circle-name">${name.substring(0, 10)}</span>
            </div>
        `;
    }).join('');

    // Add "next story" placeholder with countdown
    const nextStoryHTML = `
        <div class="story-circle next-story-placeholder" title="Наступна сторі через ${timeUntilNext.hours}г ${timeUntilNext.minutes}хв">
            <div class="story-avatar-wrapper placeholder-wrapper">
                <div class="story-avatar-inner placeholder-inner">
                    <span class="emoji">⏳</span>
                </div>
            </div>
            <span class="story-circle-name countdown-name">${timeUntilNext.hours}г ${timeUntilNext.minutes}хв</span>
        </div>
    `;

    // Regular stories
    const regularStoriesHTML = stories.map((story, index) => `
        <div class="story-circle ${viewedStories.has(story.id) ? 'viewed' : ''}" data-index="${index}">
            <div class="story-avatar-wrapper">
                <div class="story-avatar-inner">
                    <span class="emoji">${story.emoji}</span>
                </div>
            </div>
            <span class="story-circle-name">${story.name}</span>
        </div>
    `).join('');

    storiesScroll.innerHTML = autoStoriesHTML + nextStoryHTML + regularStoriesHTML;

    // Add click handlers for auto stories
    document.querySelectorAll('.story-circle.auto-story').forEach(circle => {
        circle.addEventListener('click', () => {
            const slot = parseInt(circle.dataset.slot);
            openAutoStory(slot);
        });
    });

    // Add click handlers for regular stories
    document.querySelectorAll('.story-circle:not(.auto-story):not(.next-story-placeholder)').forEach(circle => {
        if (circle.dataset.index !== undefined) {
            circle.addEventListener('click', () => {
                const index = parseInt(circle.dataset.index);
                openStory(index);
            });
        }
    });
}

// Open an auto-generated story by slot index
async function openAutoStory(slotIndex) {
    const data = getAutoStoriesData();
    const today = getTodayString();

    if (!data.slots || !data.slots[slotIndex]) return;

    const storyData = data.slots[slotIndex];
    const story = storyData.story;

    // Mark as viewed
    viewedStories.add(`auto-${today}-${slotIndex}`);
    localStorage.setItem('viewedStories', JSON.stringify([...viewedStories]));

    // Update UI
    const circle = document.querySelector(`.story-circle.auto-story[data-slot="${slotIndex}"]`);
    if (circle) {
        circle.classList.add('viewed');
        circle.classList.remove('new-available');
        circle.querySelector('.story-avatar-wrapper').classList.remove('rainbow');
    }

    // Store current auto story for navigation
    currentAutoStory = story;
    currentAutoSlot = slotIndex;

    // Show in viewer
    currentStoryIndex = -3; // Special index for auto stories
    currentSlideIndex = 0;

    storyViewer.classList.remove('hidden');
    mainContent.style.display = 'none';

    // Setup progress bar based on slides
    const slides = story.slides || [];
    storyProgress.innerHTML = slides.map((_, i) => `
        <div class="progress-segment ${i === 0 ? 'active' : ''}" data-slide="${i}">
            <div class="progress-fill"></div>
        </div>
    `).join('');

    // Set header
    storyAvatar.textContent = story.emoji || '💡';
    storyTitle.textContent = story.topic || 'Математика';

    // Show first slide
    showAutoSlide(0);
    startProgress();
}

// Current auto story state
let currentAutoStory = null;
let currentAutoSlot = -1;

// Show auto story slide
function showAutoSlide(index) {
    if (!currentAutoStory || !currentAutoStory.slides) return;

    const slide = currentAutoStory.slides[index];
    if (!slide) return;

    let slideHTML = `
        <div class="story-slide auto-story-slide">
            <div class="slide-icon">${slide.icon}</div>
            <h2 class="slide-title">${slide.title}</h2>
    `;

    // Animation if present
    if (slide.animation) {
        slideHTML += `<div class="slide-animation">${slide.animation}</div>`;
    }

    // Formula
    slideHTML += `<div class="slide-formula"><div class="formula-highlight" id="slideFormula"></div></div>`;

    // Description
    slideHTML += `<p class="slide-description">${slide.description}</p>`;

    // Example if present
    if (slide.example) {
        slideHTML += `
            <div class="slide-example">
                <div class="example-label">${slide.example.label}</div>
                <div class="example-content">${slide.example.content}</div>
            </div>
        `;
    }

    slideHTML += '</div>';

    storyContent.innerHTML = slideHTML;

    // Render LaTeX formula
    const formulaEl = document.getElementById('slideFormula');
    if (formulaEl && slide.formula) {
        try {
            katex.render(slide.formula, formulaEl, {
                throwOnError: false,
                displayMode: true
            });
        } catch (e) {
            formulaEl.textContent = slide.formula;
        }
    }

    // Update progress segments
    document.querySelectorAll('.progress-segment').forEach((seg, i) => {
        seg.classList.remove('active', 'completed');
        if (i < index) seg.classList.add('completed');
        if (i === index) seg.classList.add('active');
    });
}

// Try to extract a formula from text (simple heuristic)
function extractFormula(text) {
    // Look for common formula patterns
    const formulaPatterns = [
        /([a-zA-Z][\d²³⁺⁻\^_\{\}]+\s*[=<>≤≥]\s*[a-zA-Z0-9\^_\{\}\s\+\-\*\/]+)/,
        /([a-zA-Z]+\s*\([^)]+\)\s*=\s*[^.]+)/,
    ];

    for (const pattern of formulaPatterns) {
        const match = text.match(pattern);
        if (match) return match[1].trim();
    }

    return null;
}

function setupEventListeners() {
    storyClose.addEventListener('click', closeStory);
    navLeft.addEventListener('click', prevSlide);
    navRight.addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (currentStoryIndex === -1) return;
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'Escape') closeStory();
    });

    // Touch/swipe support
    let touchStartX = 0;
    storyContent.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    storyContent.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    });
}

function openStory(index) {
    currentStoryIndex = index;
    currentSlideIndex = 0;

    const story = stories[index];

    // Mark as viewed
    viewedStories.add(story.id);
    localStorage.setItem('viewedStories', JSON.stringify([...viewedStories]));

    // Update circle appearance
    document.querySelectorAll('.story-circle')[index].classList.add('viewed');

    // Show viewer
    storyViewer.classList.remove('hidden');
    mainContent.style.display = 'none';

    // Setup progress bar
    storyProgress.innerHTML = story.slides.map((_, i) => `
        <div class="progress-segment ${i === 0 ? 'active' : ''}" data-slide="${i}">
            <div class="progress-fill"></div>
        </div>
    `).join('');

    // Set header
    storyAvatar.textContent = story.emoji;
    storyTitle.textContent = story.name;

    // Show first slide
    showSlide(0);
    startProgress();
}

function closeStory() {
    currentStoryIndex = -1;
    currentSlideIndex = 0;
    stopProgress();

    storyViewer.classList.add('hidden');
    mainContent.style.display = 'block';
}

function showSlide(index) {
    const story = stories[currentStoryIndex];
    const slide = story.slides[index];

    // Build slide HTML
    let slideHTML = `
        <div class="story-slide">
            <div class="slide-icon">${slide.icon}</div>
            <h2 class="slide-title">${slide.title}</h2>
    `;

    // Animation if present
    if (slide.animation) {
        slideHTML += `<div class="slide-animation">${slide.animation}</div>`;
    }

    // Formula
    slideHTML += `<div class="slide-formula"><div class="formula-highlight" id="slideFormula"></div></div>`;

    // Description
    slideHTML += `<p class="slide-description">${slide.description}</p>`;

    // Example if present
    if (slide.example) {
        slideHTML += `
            <div class="slide-example">
                <div class="example-label">${slide.example.label}</div>
                <div class="example-content">${slide.example.content}</div>
            </div>
        `;
    }

    slideHTML += '</div>';

    storyContent.innerHTML = slideHTML;

    // Render LaTeX formula
    const formulaEl = document.getElementById('slideFormula');
    katex.render(slide.formula, formulaEl, {
        throwOnError: false,
        displayMode: true
    });

    // Update progress segments
    document.querySelectorAll('.progress-segment').forEach((seg, i) => {
        seg.classList.remove('active', 'completed');
        if (i < index) seg.classList.add('completed');
        if (i === index) seg.classList.add('active');
    });
}

function nextSlide() {
    // Handle auto stories
    if (currentStoryIndex === -3 && currentAutoStory) {
        if (currentSlideIndex < currentAutoStory.slides.length - 1) {
            currentSlideIndex++;
            showAutoSlide(currentSlideIndex);
            resetProgress();
        } else {
            // Try to go to next auto story or close
            const data = getAutoStoriesData();
            const nextSlot = currentAutoSlot + 1;
            if (data.slots && data.slots[nextSlot]) {
                openAutoStory(nextSlot);
            } else {
                closeStory();
            }
        }
        return;
    }

    // Handle regular stories
    if (currentStoryIndex < 0) {
        closeStory();
        return;
    }

    const story = stories[currentStoryIndex];

    if (currentSlideIndex < story.slides.length - 1) {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
        resetProgress();
    } else {
        // Go to next story or close
        if (currentStoryIndex < stories.length - 1) {
            openStory(currentStoryIndex + 1);
        } else {
            closeStory();
        }
    }
}

function prevSlide() {
    // Handle auto stories
    if (currentStoryIndex === -3 && currentAutoStory) {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            showAutoSlide(currentSlideIndex);
            resetProgress();
        } else if (currentAutoSlot > 0) {
            openAutoStory(currentAutoSlot - 1);
        }
        return;
    }

    // Handle regular stories
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        showSlide(currentSlideIndex);
        resetProgress();
    } else if (currentStoryIndex > 0) {
        // Go to previous story
        openStory(currentStoryIndex - 1);
    }
}

function startProgress() {
    stopProgress();
    progressInterval = setTimeout(() => {
        nextSlide();
    }, 5000); // 5 seconds per slide
}

function stopProgress() {
    if (progressInterval) {
        clearTimeout(progressInterval);
        progressInterval = null;
    }
}

function resetProgress() {
    stopProgress();
    startProgress();
}

// Start
init();
