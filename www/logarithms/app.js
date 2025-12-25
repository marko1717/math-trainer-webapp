// Logarithms Trainer

// ========== CONSTANTS ==========
const TOTAL_QUESTIONS = 10;

const TOPIC_NAMES = {
    definition: 'Означення логарифма',
    basic: 'Основна тотожність',
    sum: 'Додавання логарифмів',
    diff: 'Віднімання логарифмів',
    power: 'Логарифм степеня',
    inverse: 'Перевернутий логарифм',
    decimal: 'Десятковий логарифм (lg)',
    natural: 'Натуральний логарифм (ln)',
    compute: 'Обчислення',
    mixed: 'Змішаний режим'
};

// ========== STATE ==========
let currentTopic = 'mixed';
let currentQuestion = 0;
let correctCount = 0;
let wrongCount = 0;
let answered = false;

// ========== DOM ELEMENTS ==========
const screens = {
    welcome: document.getElementById('welcomeScreen'),
    question: document.getElementById('questionScreen'),
    results: document.getElementById('resultsScreen')
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // Topic buttons
    document.querySelectorAll('.btn-topic').forEach(btn => {
        btn.addEventListener('click', () => {
            currentTopic = btn.dataset.topic;
            startTraining();
        });
    });

    // Navigation
    document.getElementById('backBtn').addEventListener('click', () => showScreen('welcome'));
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('restartBtn').addEventListener('click', startTraining);
    document.getElementById('menuBtn').addEventListener('click', () => showScreen('welcome'));
}

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
}

// ========== GAME LOGIC ==========
function startTraining() {
    currentQuestion = 0;
    correctCount = 0;
    wrongCount = 0;

    document.getElementById('correctCount').textContent = '0';
    document.getElementById('wrongCount').textContent = '0';
    document.getElementById('topicTitle').textContent = TOPIC_NAMES[currentTopic];

    showScreen('question');
    generateQuestion();
}

function generateQuestion() {
    answered = false;
    currentQuestion++;

    document.getElementById('questionNumber').textContent = `Питання ${currentQuestion} / ${TOTAL_QUESTIONS}`;
    document.getElementById('progressFill').style.width = `${((currentQuestion - 1) / TOTAL_QUESTIONS) * 100}%`;
    document.getElementById('feedbackContainer').classList.remove('show', 'correct', 'incorrect');
    document.getElementById('nextBtn').classList.add('hidden');

    let topic = currentTopic;
    if (topic === 'mixed') {
        const topics = ['definition', 'basic', 'sum', 'diff', 'power', 'inverse', 'decimal', 'natural', 'compute'];
        topic = topics[Math.floor(Math.random() * topics.length)];
    }

    let question;
    switch (topic) {
        case 'definition':
            question = generateDefinition();
            break;
        case 'basic':
            question = generateBasicIdentity();
            break;
        case 'sum':
            question = generateSum();
            break;
        case 'diff':
            question = generateDiff();
            break;
        case 'power':
            question = generatePower();
            break;
        case 'inverse':
            question = generateInverse();
            break;
        case 'decimal':
            question = generateDecimal();
            break;
        case 'natural':
            question = generateNatural();
            break;
        case 'compute':
            question = generateCompute();
            break;
        default:
            question = generateDefinition();
    }

    displayQuestion(question);
}

// Generate question about definition
function generateDefinition() {
    const problems = [
        {
            question: '\\log_2 8 = ?',
            answer: '3',
            wrong: ['2', '4', '8'],
            explanation: '2^3 = 8, \\text{ тому } \\log_2 8 = 3'
        },
        {
            question: '\\log_3 27 = ?',
            answer: '3',
            wrong: ['2', '9', '4'],
            explanation: '3^3 = 27, \\text{ тому } \\log_3 27 = 3'
        },
        {
            question: '\\log_5 25 = ?',
            answer: '2',
            wrong: ['3', '5', '1'],
            explanation: '5^2 = 25, \\text{ тому } \\log_5 25 = 2'
        },
        {
            question: '\\log_4 16 = ?',
            answer: '2',
            wrong: ['3', '4', '1'],
            explanation: '4^2 = 16, \\text{ тому } \\log_4 16 = 2'
        },
        {
            question: '\\log_{10} 100 = ?',
            answer: '2',
            wrong: ['1', '3', '10'],
            explanation: '10^2 = 100, \\text{ тому } \\log_{10} 100 = 2'
        },
        {
            question: '\\log_2 16 = ?',
            answer: '4',
            wrong: ['2', '3', '8'],
            explanation: '2^4 = 16, \\text{ тому } \\log_2 16 = 4'
        },
        {
            question: '\\log_3 9 = ?',
            answer: '2',
            wrong: ['1', '3', '4'],
            explanation: '3^2 = 9, \\text{ тому } \\log_3 9 = 2'
        },
        {
            question: '\\log_7 49 = ?',
            answer: '2',
            wrong: ['1', '7', '3'],
            explanation: '7^2 = 49, \\text{ тому } \\log_7 49 = 2'
        },
        {
            question: '\\log_2 32 = ?',
            answer: '5',
            wrong: ['4', '6', '3'],
            explanation: '2^5 = 32, \\text{ тому } \\log_2 32 = 5'
        },
        {
            question: '\\log_5 125 = ?',
            answer: '3',
            wrong: ['2', '5', '4'],
            explanation: '5^3 = 125, \\text{ тому } \\log_5 125 = 3'
        }
    ];

    const selected = problems[Math.floor(Math.random() * problems.length)];
    return {
        question: selected.question,
        correctAnswer: selected.answer,
        answers: shuffleArray([selected.answer, ...selected.wrong]),
        explanation: selected.explanation
    };
}

// Basic identity: a^(log_a b) = b
function generateBasicIdentity() {
    const problems = [
        {
            question: '2^{\\log_2 5} = ?',
            answer: '5',
            wrong: ['2', '10', '25'],
            explanation: 'a^{\\log_a b} = b, \\text{ тому } 2^{\\log_2 5} = 5'
        },
        {
            question: '3^{\\log_3 7} = ?',
            answer: '7',
            wrong: ['3', '21', '9'],
            explanation: 'a^{\\log_a b} = b, \\text{ тому } 3^{\\log_3 7} = 7'
        },
        {
            question: '5^{\\log_5 2} = ?',
            answer: '2',
            wrong: ['5', '10', '25'],
            explanation: 'a^{\\log_a b} = b, \\text{ тому } 5^{\\log_5 2} = 2'
        },
        {
            question: '10^{\\log_{10} 3} = ?',
            answer: '3',
            wrong: ['10', '30', '1000'],
            explanation: 'a^{\\log_a b} = b, \\text{ тому } 10^{\\log_{10} 3} = 3'
        },
        {
            question: '\\log_2 2^5 = ?',
            answer: '5',
            wrong: ['2', '10', '32'],
            explanation: '\\log_a a^n = n, \\text{ тому } \\log_2 2^5 = 5'
        },
        {
            question: '\\log_3 3^4 = ?',
            answer: '4',
            wrong: ['3', '12', '81'],
            explanation: '\\log_a a^n = n, \\text{ тому } \\log_3 3^4 = 4'
        },
        {
            question: '4^{\\log_4 9} = ?',
            answer: '9',
            wrong: ['4', '36', '16'],
            explanation: 'a^{\\log_a b} = b, \\text{ тому } 4^{\\log_4 9} = 9'
        },
        {
            question: '\\log_5 5^3 = ?',
            answer: '3',
            wrong: ['5', '15', '125'],
            explanation: '\\log_a a^n = n, \\text{ тому } \\log_5 5^3 = 3'
        }
    ];

    const selected = problems[Math.floor(Math.random() * problems.length)];
    return {
        question: selected.question,
        correctAnswer: selected.answer,
        answers: shuffleArray([selected.answer, ...selected.wrong]),
        explanation: selected.explanation
    };
}

// Sum of logs: log(ab) = log(a) + log(b)
function generateSum() {
    const problems = [
        {
            question: '\\log_2 4 + \\log_2 8 = ?',
            answer: '5',
            wrong: ['3', '6', '12'],
            explanation: '\\log_2 4 + \\log_2 8 = \\log_2(4 \\cdot 8) = \\log_2 32 = 5'
        },
        {
            question: '\\log_3 9 + \\log_3 3 = ?',
            answer: '3',
            wrong: ['2', '5', '6'],
            explanation: '\\log_3 9 + \\log_3 3 = \\log_3(9 \\cdot 3) = \\log_3 27 = 3'
        },
        {
            question: '\\log_5 5 + \\log_5 25 = ?',
            answer: '3',
            wrong: ['2', '5', '6'],
            explanation: '\\log_5 5 + \\log_5 25 = \\log_5(5 \\cdot 25) = \\log_5 125 = 3'
        },
        {
            question: '\\log_2 2 + \\log_2 4 = ?',
            answer: '3',
            wrong: ['2', '5', '6'],
            explanation: '\\log_2 2 + \\log_2 4 = \\log_2(2 \\cdot 4) = \\log_2 8 = 3'
        },
        {
            question: '\\log_{10} 2 + \\log_{10} 5 = ?',
            answer: '1',
            wrong: ['2', '7', '10'],
            explanation: '\\log_{10} 2 + \\log_{10} 5 = \\log_{10}(2 \\cdot 5) = \\log_{10} 10 = 1'
        },
        {
            question: '\\log_{10} 4 + \\log_{10} 25 = ?',
            answer: '2',
            wrong: ['1', '3', '29'],
            explanation: '\\log_{10} 4 + \\log_{10} 25 = \\log_{10}(4 \\cdot 25) = \\log_{10} 100 = 2'
        },
        {
            question: '\\log_2 8 + \\log_2 2 = ?',
            answer: '4',
            wrong: ['3', '5', '10'],
            explanation: '\\log_2 8 + \\log_2 2 = \\log_2(8 \\cdot 2) = \\log_2 16 = 4'
        }
    ];

    const selected = problems[Math.floor(Math.random() * problems.length)];
    return {
        question: selected.question,
        correctAnswer: selected.answer,
        answers: shuffleArray([selected.answer, ...selected.wrong]),
        explanation: selected.explanation
    };
}

// Difference of logs: log(a/b) = log(a) - log(b)
function generateDiff() {
    const problems = [
        {
            question: '\\log_2 32 - \\log_2 4 = ?',
            answer: '3',
            wrong: ['2', '4', '8'],
            explanation: '\\log_2 32 - \\log_2 4 = \\log_2\\frac{32}{4} = \\log_2 8 = 3'
        },
        {
            question: '\\log_3 81 - \\log_3 3 = ?',
            answer: '3',
            wrong: ['2', '4', '27'],
            explanation: '\\log_3 81 - \\log_3 3 = \\log_3\\frac{81}{3} = \\log_3 27 = 3'
        },
        {
            question: '\\log_5 125 - \\log_5 5 = ?',
            answer: '2',
            wrong: ['1', '3', '25'],
            explanation: '\\log_5 125 - \\log_5 5 = \\log_5\\frac{125}{5} = \\log_5 25 = 2'
        },
        {
            question: '\\log_2 64 - \\log_2 8 = ?',
            answer: '3',
            wrong: ['2', '4', '8'],
            explanation: '\\log_2 64 - \\log_2 8 = \\log_2\\frac{64}{8} = \\log_2 8 = 3'
        },
        {
            question: '\\log_{10} 1000 - \\log_{10} 10 = ?',
            answer: '2',
            wrong: ['1', '3', '100'],
            explanation: '\\log_{10} 1000 - \\log_{10} 10 = \\log_{10}\\frac{1000}{10} = \\log_{10} 100 = 2'
        },
        {
            question: '\\log_4 64 - \\log_4 4 = ?',
            answer: '2',
            wrong: ['1', '3', '16'],
            explanation: '\\log_4 64 - \\log_4 4 = \\log_4\\frac{64}{4} = \\log_4 16 = 2'
        },
        {
            question: '\\log_3 27 - \\log_3 9 = ?',
            answer: '1',
            wrong: ['2', '3', '0'],
            explanation: '\\log_3 27 - \\log_3 9 = \\log_3\\frac{27}{9} = \\log_3 3 = 1'
        }
    ];

    const selected = problems[Math.floor(Math.random() * problems.length)];
    return {
        question: selected.question,
        correctAnswer: selected.answer,
        answers: shuffleArray([selected.answer, ...selected.wrong]),
        explanation: selected.explanation
    };
}

// Power rule: log(a^n) = n*log(a)
function generatePower() {
    const problems = [
        {
            question: '\\log_2 4^3 = ?',
            answer: '6',
            wrong: ['3', '12', '8'],
            explanation: '\\log_2 4^3 = 3 \\cdot \\log_2 4 = 3 \\cdot 2 = 6'
        },
        {
            question: '\\log_3 9^2 = ?',
            answer: '4',
            wrong: ['2', '6', '18'],
            explanation: '\\log_3 9^2 = 2 \\cdot \\log_3 9 = 2 \\cdot 2 = 4'
        },
        {
            question: '\\log_5 25^2 = ?',
            answer: '4',
            wrong: ['2', '10', '50'],
            explanation: '\\log_5 25^2 = 2 \\cdot \\log_5 25 = 2 \\cdot 2 = 4'
        },
        {
            question: '2 \\cdot \\log_3 9 = ?',
            answer: '4',
            wrong: ['2', '6', '18'],
            explanation: '2 \\cdot \\log_3 9 = 2 \\cdot 2 = 4 = \\log_3 81'
        },
        {
            question: '3 \\cdot \\log_2 2 = ?',
            answer: '3',
            wrong: ['1', '6', '8'],
            explanation: '3 \\cdot \\log_2 2 = 3 \\cdot 1 = 3'
        },
        {
            question: '\\log_2 8^2 = ?',
            answer: '6',
            wrong: ['3', '9', '16'],
            explanation: '\\log_2 8^2 = 2 \\cdot \\log_2 8 = 2 \\cdot 3 = 6'
        },
        {
            question: '\\log_{10} 10^4 = ?',
            answer: '4',
            wrong: ['1', '10', '40'],
            explanation: '\\log_{10} 10^4 = 4 \\cdot \\log_{10} 10 = 4 \\cdot 1 = 4'
        },
        {
            question: '\\frac{1}{2} \\cdot \\log_3 81 = ?',
            answer: '2',
            wrong: ['1', '4', '9'],
            explanation: '\\frac{1}{2} \\cdot \\log_3 81 = \\frac{1}{2} \\cdot 4 = 2 = \\log_3 9'
        }
    ];

    const selected = problems[Math.floor(Math.random() * problems.length)];
    return {
        question: selected.question,
        correctAnswer: selected.answer,
        answers: shuffleArray([selected.answer, ...selected.wrong]),
        explanation: selected.explanation
    };
}

// Inverse logarithm: log_a b = 1/log_b a
function generateInverse() {
    const problems = [
        {
            question: '\\log_2 8 \\cdot \\log_8 2 = ?',
            answer: '1',
            wrong: ['0', '2', '3'],
            explanation: '\\log_a b \\cdot \\log_b a = 1, \\text{ тому } \\log_2 8 \\cdot \\log_8 2 = 1'
        },
        {
            question: '\\log_3 9 \\cdot \\log_9 3 = ?',
            answer: '1',
            wrong: ['2', '3', '0'],
            explanation: '\\log_a b \\cdot \\log_b a = 1, \\text{ тому } \\log_3 9 \\cdot \\log_9 3 = 1'
        },
        {
            question: '\\text{Якщо } \\log_2 5 = a, \\text{ то } \\log_5 2 = ?',
            answer: '\\frac{1}{a}',
            wrong: ['a', '-a', 'a^2'],
            explanation: '\\log_b a = \\frac{1}{\\log_a b}, \\text{ тому } \\log_5 2 = \\frac{1}{a}'
        },
        {
            question: '\\log_4 2 = ?',
            answer: '\\frac{1}{2}',
            wrong: ['2', '1', '\\frac{1}{4}'],
            explanation: '4^{1/2} = 2, \\text{ тому } \\log_4 2 = \\frac{1}{2}'
        },
        {
            question: '\\log_9 3 = ?',
            answer: '\\frac{1}{2}',
            wrong: ['2', '3', '\\frac{1}{3}'],
            explanation: '9^{1/2} = 3, \\text{ тому } \\log_9 3 = \\frac{1}{2}'
        },
        {
            question: '\\log_{27} 3 = ?',
            answer: '\\frac{1}{3}',
            wrong: ['3', '9', '\\frac{1}{9}'],
            explanation: '27^{1/3} = 3, \\text{ тому } \\log_{27} 3 = \\frac{1}{3}'
        },
        {
            question: '\\log_8 4 = ?',
            answer: '\\frac{2}{3}',
            wrong: ['\\frac{1}{2}', '2', '\\frac{3}{2}'],
            explanation: '8^{2/3} = (2^3)^{2/3} = 2^2 = 4, \\text{ тому } \\log_8 4 = \\frac{2}{3}'
        },
        {
            question: '\\log_{16} 8 = ?',
            answer: '\\frac{3}{4}',
            wrong: ['\\frac{1}{2}', '2', '\\frac{4}{3}'],
            explanation: '16^{3/4} = (2^4)^{3/4} = 2^3 = 8, \\text{ тому } \\log_{16} 8 = \\frac{3}{4}'
        },
        {
            question: '\\text{Спростіть: } \\frac{1}{\\log_5 3} = ?',
            answer: '\\log_3 5',
            wrong: ['\\log_5 3', '\\log_3 15', '5'],
            explanation: '\\frac{1}{\\log_a b} = \\log_b a, \\text{ тому } \\frac{1}{\\log_5 3} = \\log_3 5'
        },
        {
            question: '\\log_5 25 \\cdot \\log_{25} 5 = ?',
            answer: '1',
            wrong: ['2', '5', '10'],
            explanation: '\\log_a b \\cdot \\log_b a = 1'
        }
    ];

    const selected = problems[Math.floor(Math.random() * problems.length)];
    return {
        question: selected.question,
        correctAnswer: selected.answer,
        answers: shuffleArray([selected.answer, ...selected.wrong]),
        explanation: selected.explanation
    };
}

// Decimal logarithm (lg = log_10)
function generateDecimal() {
    const problems = [
        {
            question: '\\lg 100 = ?',
            answer: '2',
            wrong: ['1', '10', '3'],
            explanation: '10^2 = 100, \\text{ тому } \\lg 100 = 2'
        },
        {
            question: '\\lg 1000 = ?',
            answer: '3',
            wrong: ['2', '10', '100'],
            explanation: '10^3 = 1000, \\text{ тому } \\lg 1000 = 3'
        },
        {
            question: '\\lg 10 = ?',
            answer: '1',
            wrong: ['0', '10', '2'],
            explanation: '10^1 = 10, \\text{ тому } \\lg 10 = 1'
        },
        {
            question: '\\lg 1 = ?',
            answer: '0',
            wrong: ['1', '10', '-1'],
            explanation: '10^0 = 1, \\text{ тому } \\lg 1 = 0'
        },
        {
            question: '\\lg 0.1 = ?',
            answer: '-1',
            wrong: ['1', '0.1', '-10'],
            explanation: '10^{-1} = 0.1, \\text{ тому } \\lg 0.1 = -1'
        },
        {
            question: '\\lg 0.01 = ?',
            answer: '-2',
            wrong: ['-1', '2', '0.01'],
            explanation: '10^{-2} = 0.01, \\text{ тому } \\lg 0.01 = -2'
        },
        {
            question: '\\lg 10000 = ?',
            answer: '4',
            wrong: ['3', '5', '1000'],
            explanation: '10^4 = 10000, \\text{ тому } \\lg 10000 = 4'
        },
        {
            question: '\\lg 2 + \\lg 5 = ?',
            answer: '1',
            wrong: ['7', '10', '\\lg 7'],
            explanation: '\\lg 2 + \\lg 5 = \\lg(2 \\cdot 5) = \\lg 10 = 1'
        },
        {
            question: '\\lg 20 - \\lg 2 = ?',
            answer: '1',
            wrong: ['10', '18', '2'],
            explanation: '\\lg 20 - \\lg 2 = \\lg\\frac{20}{2} = \\lg 10 = 1'
        },
        {
            question: '\\lg 4 + \\lg 25 = ?',
            answer: '2',
            wrong: ['1', '29', '3'],
            explanation: '\\lg 4 + \\lg 25 = \\lg(4 \\cdot 25) = \\lg 100 = 2'
        },
        {
            question: '2 \\cdot \\lg 10 = ?',
            answer: '2',
            wrong: ['1', '20', '100'],
            explanation: '2 \\cdot \\lg 10 = 2 \\cdot 1 = 2'
        },
        {
            question: '\\lg 10^5 = ?',
            answer: '5',
            wrong: ['10', '50', '100000'],
            explanation: '\\lg 10^5 = 5 \\cdot \\lg 10 = 5 \\cdot 1 = 5'
        }
    ];

    const selected = problems[Math.floor(Math.random() * problems.length)];
    return {
        question: selected.question,
        correctAnswer: selected.answer,
        answers: shuffleArray([selected.answer, ...selected.wrong]),
        explanation: selected.explanation
    };
}

// Natural logarithm (ln = log_e)
function generateNatural() {
    const problems = [
        {
            question: '\\ln e = ?',
            answer: '1',
            wrong: ['0', 'e', '2'],
            explanation: 'e^1 = e, \\text{ тому } \\ln e = 1'
        },
        {
            question: '\\ln 1 = ?',
            answer: '0',
            wrong: ['1', 'e', '-1'],
            explanation: 'e^0 = 1, \\text{ тому } \\ln 1 = 0'
        },
        {
            question: '\\ln e^2 = ?',
            answer: '2',
            wrong: ['e', 'e^2', '1'],
            explanation: '\\ln e^n = n, \\text{ тому } \\ln e^2 = 2'
        },
        {
            question: '\\ln e^5 = ?',
            answer: '5',
            wrong: ['e', 'e^5', '1'],
            explanation: '\\ln e^n = n, \\text{ тому } \\ln e^5 = 5'
        },
        {
            question: 'e^{\\ln 3} = ?',
            answer: '3',
            wrong: ['e', '\\ln 3', 'e^3'],
            explanation: 'e^{\\ln x} = x, \\text{ тому } e^{\\ln 3} = 3'
        },
        {
            question: 'e^{\\ln 7} = ?',
            answer: '7',
            wrong: ['e', '\\ln 7', 'e^7'],
            explanation: 'e^{\\ln x} = x, \\text{ тому } e^{\\ln 7} = 7'
        },
        {
            question: '\\ln e^{-1} = ?',
            answer: '-1',
            wrong: ['1', 'e', '\\frac{1}{e}'],
            explanation: '\\ln e^{-1} = -1 \\cdot \\ln e = -1'
        },
        {
            question: '\\ln \\frac{1}{e} = ?',
            answer: '-1',
            wrong: ['1', 'e', '-e'],
            explanation: '\\ln \\frac{1}{e} = \\ln e^{-1} = -1'
        },
        {
            question: '\\ln e^3 + \\ln e^2 = ?',
            answer: '5',
            wrong: ['6', 'e^5', '3'],
            explanation: '\\ln e^3 + \\ln e^2 = 3 + 2 = 5'
        },
        {
            question: '2 \\cdot \\ln e = ?',
            answer: '2',
            wrong: ['e^2', '1', 'e'],
            explanation: '2 \\cdot \\ln e = 2 \\cdot 1 = 2'
        },
        {
            question: '\\ln e^4 - \\ln e = ?',
            answer: '3',
            wrong: ['4', 'e^3', '1'],
            explanation: '\\ln e^4 - \\ln e = 4 - 1 = 3'
        },
        {
            question: 'e^{2\\ln 3} = ?',
            answer: '9',
            wrong: ['6', '3', 'e^6'],
            explanation: 'e^{2\\ln 3} = e^{\\ln 3^2} = e^{\\ln 9} = 9'
        }
    ];

    const selected = problems[Math.floor(Math.random() * problems.length)];
    return {
        question: selected.question,
        correctAnswer: selected.answer,
        answers: shuffleArray([selected.answer, ...selected.wrong]),
        explanation: selected.explanation
    };
}

// Compute complex expressions
function generateCompute() {
    const problems = [
        {
            question: '\\log_2 4 + \\log_2 8 - \\log_2 2 = ?',
            answer: '4',
            wrong: ['3', '5', '6'],
            explanation: '\\log_2 4 + \\log_2 8 - \\log_2 2 = 2 + 3 - 1 = 4'
        },
        {
            question: '\\log_3 27 \\cdot \\log_3 3 = ?',
            answer: '3',
            wrong: ['1', '9', '6'],
            explanation: '\\log_3 27 \\cdot \\log_3 3 = 3 \\cdot 1 = 3'
        },
        {
            question: '\\log_2 16 + \\log_3 9 = ?',
            answer: '6',
            wrong: ['5', '7', '8'],
            explanation: '\\log_2 16 + \\log_3 9 = 4 + 2 = 6'
        },
        {
            question: '\\log_5 25 + \\log_5 5 - \\log_5 125 = ?',
            answer: '0',
            wrong: ['1', '-1', '2'],
            explanation: '\\log_5 25 + \\log_5 5 - \\log_5 125 = 2 + 1 - 3 = 0'
        },
        {
            question: '2 \\cdot \\log_4 16 = ?',
            answer: '4',
            wrong: ['2', '8', '6'],
            explanation: '2 \\cdot \\log_4 16 = 2 \\cdot 2 = 4'
        },
        {
            question: '\\log_2 64 - \\log_2 16 + \\log_2 2 = ?',
            answer: '3',
            wrong: ['2', '4', '5'],
            explanation: '\\log_2 64 - \\log_2 16 + \\log_2 2 = 6 - 4 + 1 = 3'
        },
        {
            question: '\\frac{\\log_3 81}{\\log_3 9} = ?',
            answer: '2',
            wrong: ['1', '3', '4'],
            explanation: '\\frac{\\log_3 81}{\\log_3 9} = \\frac{4}{2} = 2'
        },
        {
            question: '\\log_{10} 100 + \\log_{10} 0.1 = ?',
            answer: '1',
            wrong: ['0', '2', '3'],
            explanation: '\\log_{10} 100 + \\log_{10} 0.1 = 2 + (-1) = 1'
        }
    ];

    const selected = problems[Math.floor(Math.random() * problems.length)];
    return {
        question: selected.question,
        correctAnswer: selected.answer,
        answers: shuffleArray([selected.answer, ...selected.wrong]),
        explanation: selected.explanation
    };
}

function displayQuestion(q) {
    // Render question
    const questionEl = document.getElementById('questionText');
    katex.render(q.question, questionEl, { throwOnError: false, displayMode: true });

    // Render answers
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';

    const letters = ['А', 'Б', 'В', 'Г'];
    q.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.dataset.answer = answer;
        btn.dataset.correct = (answer === q.correctAnswer).toString();

        btn.innerHTML = `
            <span class="answer-letter">${letters[index]}</span>
            <span class="answer-text"></span>
        `;

        const answerText = btn.querySelector('.answer-text');
        // Render answer as LaTeX if it looks like math
        if (/[\\{}_^]/.test(answer)) {
            katex.render(answer, answerText, { throwOnError: false });
        } else {
            answerText.textContent = answer;
        }

        btn.addEventListener('click', () => handleAnswer(btn, q));
        container.appendChild(btn);
    });
}

function handleAnswer(btn, question) {
    if (answered) return;
    answered = true;

    const isCorrect = btn.dataset.correct === 'true';

    // Disable all buttons
    document.querySelectorAll('.answer-btn').forEach(b => {
        b.classList.add('disabled');
        if (b.dataset.correct === 'true') {
            b.classList.add('correct');
        }
    });

    if (!isCorrect) {
        btn.classList.add('incorrect');
        wrongCount++;
    } else {
        correctCount++;
    }

    // Update stats
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('wrongCount').textContent = wrongCount;

    // Show feedback
    const feedbackContainer = document.getElementById('feedbackContainer');
    feedbackContainer.classList.add('show');
    feedbackContainer.classList.add(isCorrect ? 'correct' : 'incorrect');

    document.getElementById('feedbackIcon').textContent = isCorrect ? '✅' : '❌';
    document.getElementById('feedbackText').textContent = isCorrect ? 'Правильно!' : 'Неправильно';

    const explanationEl = document.getElementById('feedbackExplanation');
    if (question.explanation) {
        katex.render(question.explanation, explanationEl, { throwOnError: false });
    } else {
        explanationEl.textContent = '';
    }

    // Show next button
    document.getElementById('nextBtn').classList.remove('hidden');
}

function nextQuestion() {
    if (currentQuestion >= TOTAL_QUESTIONS) {
        showResults();
    } else {
        generateQuestion();
    }
}

function showResults() {
    const accuracy = Math.round((correctCount / TOTAL_QUESTIONS) * 100);

    document.getElementById('finalCorrect').textContent = correctCount;
    document.getElementById('finalWrong').textContent = wrongCount;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';

    // Set emoji based on score
    let emoji = '😢';
    let title = 'Потрібно ще попрактикуватись';
    if (accuracy >= 90) {
        emoji = '🏆';
        title = 'Відмінно!';
    } else if (accuracy >= 70) {
        emoji = '🎉';
        title = 'Молодець!';
    } else if (accuracy >= 50) {
        emoji = '👍';
        title = 'Непогано!';
    }

    document.getElementById('resultsIcon').textContent = emoji;
    document.getElementById('resultsTitle').textContent = title;

    showScreen('results');
}

// ========== HELPERS ==========
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
