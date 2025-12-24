// Multi-step problems with inline dropdowns (Mathigon style)
// Step-by-step verification
const problems = [
    {
        id: 1,
        title: 'Прямокутний трикутник',
        illustration: `
            <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="30,150 210,150 210,40" fill="none" stroke="#EF8748" stroke-width="3"/>
                <rect x="200" y="140" width="10" height="10" fill="none" stroke="#EF8748" stroke-width="2"/>
                <text x="115" y="170" fill="#6e6e73" font-size="16" text-anchor="middle">a = 3</text>
                <text x="220" y="100" fill="#6e6e73" font-size="16">b = 4</text>
                <text x="105" y="85" fill="#EF8748" font-size="16">c = ?</text>
                <circle cx="120" cy="113" r="45" fill="none" stroke="#34c759" stroke-width="2" stroke-dasharray="5,5"/>
                <text x="120" y="118" fill="#34c759" font-size="14" text-anchor="middle">r = ?</text>
            </svg>
        `,
        given: 'Катети a = 3 та b = 4',
        find: 'Радіус вписаного кола r',
        steps: [
            {
                text: 'Спочатку знайдемо гіпотенузу за',
                blankId: 'step1',
                options: [
                    { value: '', text: 'оберіть...' },
                    { value: 'pythagoras', text: 'теоремою Піфагора', correct: true },
                    { value: 'cosine', text: 'теоремою косинусів' },
                    { value: 'area', text: 'формулою площі' }
                ],
                calculation: 'c = \\sqrt{a^2 + b^2} = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5'
            },
            {
                text: 'Площу трикутника знайдемо як',
                blankId: 'step2',
                options: [
                    { value: '', text: 'оберіть...' },
                    { value: 'half_base', text: 'S = ½ · a · b', correct: true },
                    { value: 'heron', text: 'за формулою Герона' },
                    { value: 'sin', text: 'S = ½ · a · b · sin(C)' }
                ],
                calculation: 'S = \\frac{1}{2} \\cdot a \\cdot b = \\frac{1}{2} \\cdot 3 \\cdot 4 = 6'
            },
            {
                text: 'Радіус вписаного кола r =',
                blankId: 'step3',
                options: [
                    { value: '', text: 'оберіть...' },
                    { value: 's_p', text: 'S / p', correct: true },
                    { value: 'a_2', text: '(a + b) / 2' },
                    { value: 'abc', text: 'abc / (4S)' }
                ],
                calculation: 'p = \\frac{a + b + c}{2} = \\frac{3 + 4 + 5}{2} = 6 \\\\[8pt] r = \\frac{S}{p} = \\frac{6}{6} = 1'
            }
        ],
        result: 'r = 1'
    },
    {
        id: 2,
        title: 'Трикутник з описаним колом',
        illustration: `
            <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="120" cy="100" r="70" fill="none" stroke="#34c759" stroke-width="2"/>
                <polygon points="55,140 185,140 120,35" fill="none" stroke="#EF8748" stroke-width="3"/>
                <text x="120" y="160" fill="#6e6e73" font-size="14" text-anchor="middle">a = 10</text>
                <text x="60" y="85" fill="#6e6e73" font-size="14">b</text>
                <text x="175" y="85" fill="#6e6e73" font-size="14">c</text>
                <text x="120" y="15" fill="#34c759" font-size="14" text-anchor="middle">R = ?</text>
                <path d="M 95,140 A 20,20 0 0 1 100,125" fill="none" stroke="#EF8748" stroke-width="2"/>
                <text x="108" y="130" fill="#EF8748" font-size="12">30°</text>
            </svg>
        `,
        given: 'Сторона a = 10 та протилежний кут α = 30°',
        find: 'Радіус описаного кола R',
        steps: [
            {
                text: 'За теоремою синусів маємо',
                blankId: 'step1',
                options: [
                    { value: '', text: 'оберіть...' },
                    { value: 'a_sin', text: 'a / sin(α) = 2R', correct: true },
                    { value: 'a_cos', text: 'a / cos(α) = 2R' },
                    { value: 'a2', text: 'a² = 2R' }
                ],
                calculation: '\\frac{a}{\\sin(\\alpha)} = 2R'
            },
            {
                text: 'Знаходимо sin(30°) =',
                blankId: 'step2',
                options: [
                    { value: '', text: 'оберіть...' },
                    { value: 'half', text: '1/2', correct: true },
                    { value: 'sqrt2', text: '√2/2' },
                    { value: 'sqrt3', text: '√3/2' }
                ],
                calculation: '\\sin(30°) = \\frac{1}{2}'
            },
            {
                text: 'Отже радіус R =',
                blankId: 'step3',
                options: [
                    { value: '', text: 'оберіть...' },
                    { value: 'a_2sin', text: 'a / (2·sin α)', correct: true },
                    { value: 'a_sin2', text: 'a·sin α / 2' },
                    { value: '2a_sin', text: '2a·sin α' }
                ],
                calculation: 'R = \\frac{a}{2 \\cdot \\sin(\\alpha)} = \\frac{10}{2 \\cdot \\frac{1}{2}} = \\frac{10}{1} = 10'
            }
        ],
        result: 'R = 10'
    },
    {
        id: 3,
        title: 'Трапеція',
        illustration: `
            <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="50,120 190,120 160,40 80,40" fill="none" stroke="#EF8748" stroke-width="3"/>
                <line x1="80" y1="40" x2="80" y2="120" stroke="#34c759" stroke-width="2" stroke-dasharray="5,5"/>
                <text x="120" y="140" fill="#6e6e73" font-size="14" text-anchor="middle">a = 12</text>
                <text x="120" y="30" fill="#6e6e73" font-size="14" text-anchor="middle">b = 8</text>
                <text x="65" y="85" fill="#34c759" font-size="14">h = 5</text>
                <text x="200" y="85" fill="#EF8748" font-size="14">S = ?</text>
            </svg>
        `,
        given: 'Основи a = 12, b = 8 та висота h = 5',
        find: 'Площу трапеції S',
        steps: [
            {
                text: 'Площа трапеції обчислюється за формулою S =',
                blankId: 'step1',
                options: [
                    { value: '', text: 'оберіть...' },
                    { value: 'trap', text: '½(a + b)·h', correct: true },
                    { value: 'rect', text: 'a · b' },
                    { value: 'tri', text: '½ · a · h' }
                ],
                calculation: 'S = \\frac{1}{2}(a + b) \\cdot h'
            },
            {
                text: 'Сума основ дорівнює',
                blankId: 'step2',
                options: [
                    { value: '', text: 'оберіть...' },
                    { value: '20', text: '20', correct: true },
                    { value: '96', text: '96' },
                    { value: '4', text: '4' }
                ],
                calculation: 'a + b = 12 + 8 = 20'
            },
            {
                text: 'Отже площа S =',
                blankId: 'step3',
                options: [
                    { value: '', text: 'оберіть...' },
                    { value: '50', text: '50', correct: true },
                    { value: '100', text: '100' },
                    { value: '25', text: '25' }
                ],
                calculation: 'S = \\frac{1}{2} \\cdot 20 \\cdot 5 = \\frac{100}{2} = 50'
            }
        ],
        result: 'S = 50'
    }
];

// App State
let currentProblemIndex = 0;
let currentStepIndex = 0;

// DOM Elements
const problemCard = document.getElementById('problemCard');
const solutionCard = document.getElementById('solutionCard');
const solutionHeader = document.getElementById('solutionHeader');
const solutionSteps = document.getElementById('solutionSteps');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const currentQ = document.getElementById('currentQ');
const totalQ = document.getElementById('totalQ');

// Initialize
function init() {
    totalQ.textContent = problems.length;
    loadProblem(currentProblemIndex);
    setupEventListeners();
}

function setupEventListeners() {
    checkBtn.addEventListener('click', checkCurrentStep);
    nextBtn.addEventListener('click', nextProblem);
}

function loadProblem(index) {
    const problem = problems[index];

    // Reset state
    currentStepIndex = 0;

    // Update progress
    currentQ.textContent = index + 1;

    // Build problem HTML
    let stepsHTML = problem.steps.map((step, i) => `
        <div class="step-item ${i === 0 ? 'active' : ''}" data-step="${i}">
            <div class="step-number"><span>${i + 1}</span></div>
            <div class="step-content">
                <div class="step-text">
                    ${step.text}
                    <span class="inline-dropdown">
                        <select class="dropdown-select" data-blank="${step.blankId}" data-step="${i}">
                            ${step.options.map(opt =>
                                `<option value="${opt.value}" data-correct="${opt.correct || false}">${opt.text}</option>`
                            ).join('')}
                        </select>
                        <span class="dropdown-arrow">▼</span>
                    </span>
                </div>
                <div class="step-calculation" id="calc-${i}"></div>
            </div>
        </div>
    `).join('');

    problemCard.innerHTML = `
        <div class="problem-title">
            <span class="icon">📐</span>
            <h2>${problem.title}</h2>
        </div>

        <div class="problem-illustration">
            ${problem.illustration}
        </div>

        <div class="given-box">
            <div class="given-label">Дано</div>
            <div class="given-content">${problem.given}</div>
        </div>

        <div class="find-box">
            <div class="find-label">Знайти</div>
            <div class="find-content">${problem.find}</div>
        </div>

        <div class="steps-container">
            ${stepsHTML}
        </div>
    `;

    // Add change listeners to dropdowns
    document.querySelectorAll('.dropdown-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const stepIndex = parseInt(e.target.dataset.step);
            // Only enable check button for current step
            if (stepIndex === currentStepIndex && e.target.value) {
                checkBtn.disabled = false;
            }
        });
    });

    // Reset UI
    checkBtn.classList.remove('hidden');
    checkBtn.disabled = true;
    nextBtn.classList.add('hidden');
    solutionCard.classList.add('hidden');
}

function checkCurrentStep() {
    const problem = problems[currentProblemIndex];
    const step = problem.steps[currentStepIndex];

    const select = document.querySelector(`[data-blank="${step.blankId}"]`);
    const stepItem = document.querySelector(`[data-step="${currentStepIndex}"]`);
    const selectedOption = select.options[select.selectedIndex];
    const isCorrect = selectedOption.dataset.correct === 'true';

    select.classList.add('disabled');

    if (isCorrect) {
        select.classList.add('correct');
        stepItem.classList.add('completed');
        stepItem.classList.remove('active');

        // Show calculation with LaTeX
        const calcEl = document.getElementById(`calc-${currentStepIndex}`);
        katex.render(step.calculation, calcEl, {
            throwOnError: false,
            displayMode: true
        });

        // Move to next step or finish
        currentStepIndex++;

        if (currentStepIndex < problem.steps.length) {
            // Activate next step
            const nextStepItem = document.querySelector(`[data-step="${currentStepIndex}"]`);
            nextStepItem.classList.add('active');
            checkBtn.disabled = true;

            // Scroll to next step
            setTimeout(() => {
                nextStepItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        } else {
            // All steps completed
            setTimeout(() => {
                showResult(problem);
            }, 500);
        }
    } else {
        select.classList.add('incorrect');

        // Show correct answer after delay
        setTimeout(() => {
            const correctOpt = step.options.find(o => o.correct);
            select.value = correctOpt.value;
            select.classList.remove('incorrect');
            select.classList.add('correct');
            stepItem.classList.add('completed');
            stepItem.classList.remove('active');

            // Show calculation
            const calcEl = document.getElementById(`calc-${currentStepIndex}`);
            katex.render(step.calculation, calcEl, {
                throwOnError: false,
                displayMode: true
            });

            // Move to next step or finish
            currentStepIndex++;

            if (currentStepIndex < problem.steps.length) {
                const nextStepItem = document.querySelector(`[data-step="${currentStepIndex}"]`);
                nextStepItem.classList.add('active');
                checkBtn.disabled = true;

                setTimeout(() => {
                    nextStepItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            } else {
                setTimeout(() => {
                    showResult(problem);
                }, 500);
            }
        }, 1200);
    }
}

function showResult(problem) {
    solutionHeader.className = 'solution-header correct';
    solutionHeader.innerHTML = `
        <span class="icon">🎉</span>
        <span class="text">Задачу розв'язано!</span>
    `;

    solutionSteps.innerHTML = `
        <div class="solution-result">
            <div class="label">Відповідь:</div>
            <div class="value">${problem.result}</div>
        </div>
    `;

    solutionCard.classList.remove('hidden');
    checkBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');

    solutionCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextProblem() {
    currentProblemIndex++;

    if (currentProblemIndex >= problems.length) {
        showCompletion();
        return;
    }

    loadProblem(currentProblemIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCompletion() {
    problemCard.innerHTML = `
        <div class="completion-card">
            <div class="completion-icon">🎉</div>
            <h2>Вітаємо!</h2>
            <p>Ви пройшли всі задачі</p>
            <button class="btn-restart" onclick="location.reload()">Почати знову</button>
            <a href="../index.html" class="btn-home">На головну</a>
        </div>
    `;

    document.querySelector('.bottom-actions').style.display = 'none';
    solutionCard.classList.add('hidden');
}

// Start
init();
