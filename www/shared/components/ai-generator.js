/* ===================================
   AI Task Generator
   Генерує нові математичні завдання на основі існуючих шаблонів
   =================================== */

const AI_GENERATOR_API = 'https://marko17.pythonanywhere.com';

// Кеш згенерованих завдань
const generatedTasksCache = {
    fsm: [],
    polynomials: [],
    linear: [],
    systems: [],
    quadratic: []
};

// Шаблони для генерації (приклади існуючих завдань)
const TASK_TEMPLATES = {
    fsm: {
        description: 'Формули скороченого множення',
        examples: [
            { question: 'Розкрийте дужки: (x + 3)²', answer: 'x² + 6x + 9', type: 'squareSum' },
            { question: 'Розкрийте дужки: (a - 4)²', answer: 'a² - 8a + 16', type: 'squareDiff' },
            { question: 'Розкладіть на множники: x² - 16', answer: '(x - 4)(x + 4)', type: 'diffSquares' },
            { question: 'Розкладіть на множники: a³ + 8', answer: '(a + 2)(a² - 2a + 4)', type: 'sumCubes' },
            { question: 'Спростіть: (2x + 1)² - (2x - 1)²', answer: '8x', type: 'combined' }
        ],
        formulas: [
            '(a + b)² = a² + 2ab + b²',
            '(a - b)² = a² - 2ab + b²',
            'a² - b² = (a - b)(a + b)',
            'a³ + b³ = (a + b)(a² - ab + b²)',
            'a³ - b³ = (a - b)(a² + ab + b²)'
        ]
    },
    polynomials: {
        description: 'Дії з многочленами',
        examples: [
            { question: 'Спростіть: (3x² + 2x - 1) + (x² - x + 4)', answer: '4x² + x + 3', type: 'addition' },
            { question: 'Спростіть: (5y² + 4y + 3) - (y² - 2y - 3)', answer: '4y² + 6y + 6', type: 'subtraction' },
            { question: 'Розкрийте дужки: 2x(3x - 5)', answer: '6x² - 10x', type: 'multiplication' },
            { question: 'Спростіть: (x + 2)(x - 3)', answer: 'x² - x - 6', type: 'multiplication' }
        ]
    },
    linear: {
        description: 'Лінійні рівняння',
        examples: [
            { question: 'Розвʼяжіть: x + 8 = 3', answer: 'x = -5', type: 'simple' },
            { question: 'Розвʼяжіть: 3x - 7 = 14', answer: 'x = 7', type: 'twoStep' },
            { question: 'Розвʼяжіть: 2(x + 3) = 10', answer: 'x = 2', type: 'brackets' },
            { question: 'Розвʼяжіть: 5x - 3 = 2x + 9', answer: 'x = 4', type: 'bothSides' }
        ]
    },
    systems: {
        description: 'Системи лінійних рівнянь',
        examples: [
            {
                question: 'Розвʼяжіть систему:\nx + y = 5\nx - y = 1',
                answer: 'x = 3, y = 2',
                type: 'addition'
            },
            {
                question: 'Розвʼяжіть систему:\n2x + y = 7\nx - y = 2',
                answer: 'x = 3, y = 1',
                type: 'addition'
            },
            {
                question: 'Розвʼяжіть систему:\ny = 2x - 1\n3x + y = 9',
                answer: 'x = 2, y = 3',
                type: 'substitution'
            }
        ]
    },
    quadratic: {
        description: 'Квадратні рівняння',
        examples: [
            { question: 'Розвʼяжіть: x² - 5x + 6 = 0', answer: 'x = 2 або x = 3', type: 'factoring' },
            { question: 'Розвʼяжіть: x² - 9 = 0', answer: 'x = 3 або x = -3', type: 'diffSquares' },
            { question: 'Знайдіть дискримінант: x² + 4x - 5 = 0', answer: 'D = 36', type: 'discriminant' },
            { question: 'Розвʼяжіть: 2x² - 8x = 0', answer: 'x = 0 або x = 4', type: 'factoring' }
        ]
    }
};

/**
 * Генерує нові завдання через AI
 * @param {string} topic - Тема (fsm, polynomials, linear, systems, quadratic)
 * @param {number} difficulty - Рівень складності (1, 2, 3)
 * @param {number} count - Кількість завдань
 * @returns {Promise<Array>} Масив згенерованих завдань
 */
async function generateAITasks(topic, difficulty = 1, count = 5) {
    const template = TASK_TEMPLATES[topic];
    if (!template) {
        console.error('Unknown topic:', topic);
        return [];
    }

    // Перевіряємо кеш
    const cached = generatedTasksCache[topic];
    if (cached.length >= count) {
        const tasks = cached.splice(0, count);
        return tasks;
    }

    try {
        const response = await fetch(`${AI_GENERATOR_API}/api/generate-tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: template.description,
                examples: template.examples,
                formulas: template.formulas || [],
                difficulty,
                count: count + 5 // Генеруємо більше для кешу
            })
        });

        if (!response.ok) {
            console.error('AI Generator API error:', response.status);
            return generateFallbackTasks(topic, difficulty, count);
        }

        const data = await response.json();

        if (data.success && data.tasks) {
            // Зберігаємо зайві в кеш
            const tasks = data.tasks.slice(0, count);
            const extra = data.tasks.slice(count);
            generatedTasksCache[topic].push(...extra);

            console.log(`✅ AI згенерував ${tasks.length} завдань для ${topic}`);
            return tasks;
        }

        return generateFallbackTasks(topic, difficulty, count);
    } catch (error) {
        console.error('AI Generator error:', error);
        return generateFallbackTasks(topic, difficulty, count);
    }
}

/**
 * Fallback генератор - створює завдання локально якщо AI недоступний
 */
function generateFallbackTasks(topic, difficulty, count) {
    console.log(`⚠️ Using fallback generator for ${topic}`);
    const tasks = [];

    switch (topic) {
        case 'fsm':
            tasks.push(...generateFSMTasks(difficulty, count));
            break;
        case 'polynomials':
            tasks.push(...generatePolynomialTasks(difficulty, count));
            break;
        case 'linear':
            tasks.push(...generateLinearTasks(difficulty, count));
            break;
        case 'systems':
            tasks.push(...generateSystemsTasks(difficulty, count));
            break;
        case 'quadratic':
            tasks.push(...generateQuadraticTasks(difficulty, count));
            break;
        default:
            console.error('No fallback for topic:', topic);
    }

    return tasks;
}

// === Fallback generators ===

function generateFSMTasks(difficulty, count) {
    const tasks = [];
    const vars = ['x', 'y', 'a', 'b', 'm', 'n'];
    const nums = difficulty === 1 ? [2, 3, 4, 5] : [3, 4, 5, 6, 7];

    for (let i = 0; i < count; i++) {
        const v = vars[Math.floor(Math.random() * vars.length)];
        const n = nums[Math.floor(Math.random() * nums.length)];
        const type = Math.random();

        if (type < 0.33) {
            // Квадрат суми
            tasks.push({
                question: `Розкрийте дужки: (${v} + ${n})²`,
                correct: `${v}² + ${2*n}${v} + ${n*n}`,
                wrongAnswers: [
                    `${v}² + ${n}${v} + ${n*n}`,
                    `${v}² + ${2*n}${v} + ${n}`,
                    `${v}² - ${2*n}${v} + ${n*n}`
                ],
                explanation: `(${v} + ${n})² = ${v}² + 2·${v}·${n} + ${n}² = ${v}² + ${2*n}${v} + ${n*n}`
            });
        } else if (type < 0.66) {
            // Квадрат різниці
            tasks.push({
                question: `Розкрийте дужки: (${v} - ${n})²`,
                correct: `${v}² - ${2*n}${v} + ${n*n}`,
                wrongAnswers: [
                    `${v}² + ${2*n}${v} + ${n*n}`,
                    `${v}² - ${n}${v} + ${n*n}`,
                    `${v}² - ${n*n}`
                ],
                explanation: `(${v} - ${n})² = ${v}² - 2·${v}·${n} + ${n}² = ${v}² - ${2*n}${v} + ${n*n}`
            });
        } else {
            // Різниця квадратів
            const sq = n * n;
            tasks.push({
                question: `Розкладіть на множники: ${v}² - ${sq}`,
                correct: `(${v} - ${n})(${v} + ${n})`,
                wrongAnswers: [
                    `(${v} - ${sq})(${v} + ${sq})`,
                    `(${v} + ${n})²`,
                    `(${v} - ${n})²`
                ],
                explanation: `${v}² - ${sq} = ${v}² - ${n}² = (${v} - ${n})(${v} + ${n})`
            });
        }
    }

    return tasks;
}

function generatePolynomialTasks(difficulty, count) {
    const tasks = [];
    const vars = ['x', 'y', 'a'];

    for (let i = 0; i < count; i++) {
        const v = vars[Math.floor(Math.random() * vars.length)];
        const a1 = Math.floor(Math.random() * 5) + 1;
        const a2 = Math.floor(Math.random() * 5) + 1;
        const b1 = Math.floor(Math.random() * 6) - 2;
        const b2 = Math.floor(Math.random() * 6) - 2;
        const c1 = Math.floor(Math.random() * 6) - 2;
        const c2 = Math.floor(Math.random() * 6) - 2;

        const isAdd = Math.random() > 0.5;
        const sumA = isAdd ? a1 + a2 : a1 - a2;
        const sumB = isAdd ? b1 + b2 : b1 - b2;
        const sumC = isAdd ? c1 + c2 : c1 - c2;

        const sign = isAdd ? '+' : '-';
        const formatNum = (n) => n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
        const formatCoef = (n, v) => {
            if (n === 0) return '';
            if (n === 1) return `+ ${v}`;
            if (n === -1) return `- ${v}`;
            return n > 0 ? `+ ${n}${v}` : `- ${Math.abs(n)}${v}`;
        };

        tasks.push({
            question: `Спростіть: (${a1}${v}² ${formatNum(b1).replace('+ ', '')}${v} ${formatNum(c1)}) ${sign} (${a2}${v}² ${formatNum(b2).replace('+ ', '')}${v} ${formatNum(c2)})`,
            correct: `${sumA}${v}² ${formatCoef(sumB, v)} ${formatNum(sumC)}`.replace(/\+ -/g, '- ').replace(/^\+ /, '').trim(),
            wrongAnswers: [
                `${sumA + 1}${v}² ${formatCoef(sumB, v)} ${formatNum(sumC)}`,
                `${sumA}${v}² ${formatCoef(sumB + 1, v)} ${formatNum(sumC)}`,
                `${sumA}${v}² ${formatCoef(sumB, v)} ${formatNum(sumC + 1)}`
            ],
            explanation: `Зводимо подібні члени`
        });
    }

    return tasks;
}

function generateLinearTasks(difficulty, count) {
    const tasks = [];

    for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 15) - 7; // відповідь від -7 до 7
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 20) - 10;
        const c = a * x + b;

        tasks.push({
            question: `Розв'яжіть рівняння: ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`,
            correct: `x = ${x}`,
            wrongAnswers: [
                `x = ${x + 1}`,
                `x = ${x - 1}`,
                `x = ${-x}`
            ],
            explanation: `${a}x = ${c} - (${b}) = ${c - b}\nx = ${(c - b) / a}`
        });
    }

    return tasks;
}

function generateSystemsTasks(difficulty, count) {
    const tasks = [];

    for (let i = 0; i < count; i++) {
        // Генеруємо прості цілі відповіді
        const x = Math.floor(Math.random() * 7) - 2;
        const y = Math.floor(Math.random() * 7) - 2;

        // Коефіцієнти
        const a1 = Math.floor(Math.random() * 3) + 1;
        const b1 = Math.floor(Math.random() * 3) + 1;
        const a2 = Math.floor(Math.random() * 3) + 1;
        const b2 = -b1; // Щоб легко було розв'язати методом додавання

        const c1 = a1 * x + b1 * y;
        const c2 = a2 * x + b2 * y;

        tasks.push({
            question: `Розв'яжіть систему:\n${a1}x + ${b1}y = ${c1}\n${a2}x ${b2 >= 0 ? '+' : '-'} ${Math.abs(b2)}y = ${c2}`,
            correct: `x = ${x}, y = ${y}`,
            wrongAnswers: [
                `x = ${y}, y = ${x}`,
                `x = ${x + 1}, y = ${y}`,
                `x = ${x}, y = ${y + 1}`
            ],
            explanation: `Методом додавання: складаємо рівняння, щоб скоротити y`
        });
    }

    return tasks;
}

function generateQuadraticTasks(difficulty, count) {
    const tasks = [];

    for (let i = 0; i < count; i++) {
        // Генеруємо через корені для простих відповідей
        const x1 = Math.floor(Math.random() * 7) - 3;
        const x2 = Math.floor(Math.random() * 7) - 3;

        // (x - x1)(x - x2) = x² - (x1+x2)x + x1*x2
        const b = -(x1 + x2);
        const c = x1 * x2;

        tasks.push({
            question: `Розв'яжіть: x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = 0`,
            correct: x1 === x2 ? `x = ${x1}` : `x = ${Math.min(x1, x2)} або x = ${Math.max(x1, x2)}`,
            wrongAnswers: [
                `x = ${x1 + 1} або x = ${x2}`,
                `x = ${x1} або x = ${x2 + 1}`,
                `x = ${-x1} або x = ${-x2}`
            ],
            explanation: `D = ${b}² - 4·1·${c} = ${b*b - 4*c}`
        });
    }

    return tasks;
}

/**
 * Отримати одне випадкове завдання
 */
async function getRandomAITask(topic, difficulty = 1) {
    const tasks = await generateAITasks(topic, difficulty, 1);
    return tasks[0] || null;
}

/**
 * Перевірити чи AI генерація доступна
 */
async function isAIGeneratorAvailable() {
    try {
        const response = await fetch(`${AI_GENERATOR_API}/api/health`, {
            method: 'GET',
            timeout: 3000
        });
        return response.ok;
    } catch {
        return false;
    }
}

// Export
window.AITaskGenerator = {
    generate: generateAITasks,
    getOne: getRandomAITask,
    isAvailable: isAIGeneratorAvailable,
    templates: TASK_TEMPLATES,
    // Fallback generators
    fallback: {
        fsm: generateFSMTasks,
        polynomials: generatePolynomialTasks,
        linear: generateLinearTasks,
        systems: generateSystemsTasks,
        quadratic: generateQuadraticTasks
    }
};

console.log('📦 AITaskGenerator module loaded');
