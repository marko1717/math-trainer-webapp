// === Right Triangle Trainer ===
// Adaptive AI-powered trainer for NMT preparation

const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    if (tg.colorScheme === 'light') {
        document.body.classList.add('tg-theme-light');
    }
}

const API_URL = 'https://marko17.pythonanywhere.com';

// === Topics ===
const TOPICS = {
    pythagoras: { name: 'Теорема Піфагора', difficulty: 1 },
    angle30: { name: 'Кут 30°', difficulty: 1 },
    angle45: { name: 'Кут 45°', difficulty: 1 },
    angle60: { name: 'Кут 60°', difficulty: 1 },
    median: { name: 'Медіана до гіпотенузи', difficulty: 1 },
    trigFind: { name: 'Знайти sin/cos/tg', difficulty: 2 },
    trigSolve: { name: 'Розв\'язати через sin/cos/tg', difficulty: 2 },
    trigAlpha: { name: 'Вираження через α', difficulty: 3 }
};

// Trig values for special angles
const TRIG_VALUES = {
    30: { sin: '1/2', cos: '√3/2', tg: '√3/3', sinNum: 0.5, cosNum: Math.sqrt(3)/2, tgNum: Math.sqrt(3)/3 },
    45: { sin: '√2/2', cos: '√2/2', tg: '1', sinNum: Math.sqrt(2)/2, cosNum: Math.sqrt(2)/2, tgNum: 1 },
    60: { sin: '√3/2', cos: '1/2', tg: '√3', sinNum: Math.sqrt(3)/2, cosNum: 0.5, tgNum: Math.sqrt(3) }
};

// === State ===
let state = {
    currentQuestion: 0,
    totalQuestions: 10,
    correctCount: 0,
    streak: 0,
    maxStreak: 0,
    level: 1,
    maxLevel: 3,
    currentQuestionData: null,
    answered: false,
    hintUsed: false,
    history: [],
    weakAreas: {},
    selectedTopic: 'mixed' // Track selected topic
};

function loadProgress() {
    const saved = localStorage.getItem('triangleProgress');
    if (saved) {
        const data = JSON.parse(saved);
        state.level = data.level || 1;
        state.maxStreak = data.maxStreak || 0;
        state.weakAreas = data.weakAreas || {};
    }
}

function saveProgress() {
    localStorage.setItem('triangleProgress', JSON.stringify({
        level: state.level,
        maxStreak: state.maxStreak,
        weakAreas: state.weakAreas
    }));
}

// === Triangle Drawing ===
function drawTriangle(canvas, data) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Triangle coordinates (right angle at bottom-left)
    const padding = 40;
    const A = { x: padding, y: h - padding }; // Right angle
    const B = { x: w - padding, y: h - padding }; // Bottom right
    const C = { x: padding, y: padding + 20 }; // Top left

    // Adjust for different triangle types
    let triangleType = data.triangleType || 'generic';

    if (triangleType === '30-60-90') {
        // Adjust proportions for 30-60-90 triangle
        const baseLen = w - 2 * padding;
        C.y = A.y - baseLen * Math.tan(60 * Math.PI / 180) * 0.6;
    } else if (triangleType === '45-45-90') {
        // Equal legs for 45-45-90
        const legLen = Math.min(w, h) - 2 * padding - 20;
        B.x = A.x + legLen;
        C.y = A.y - legLen;
    }

    // Get colors
    const style = getComputedStyle(document.body);
    const primaryColor = style.getPropertyValue('--primary-light').trim() || '#A29BFE';
    const textColor = style.getPropertyValue('--text-primary').trim() || '#FFFFFF';
    const mutedColor = style.getPropertyValue('--text-muted').trim() || '#6B6B80';
    const accentColor = style.getPropertyValue('--warning-color').trim() || '#FDCB6E';

    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.closePath();
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw right angle symbol
    const squareSize = 15;
    ctx.beginPath();
    ctx.moveTo(A.x + squareSize, A.y);
    ctx.lineTo(A.x + squareSize, A.y - squareSize);
    ctx.lineTo(A.x, A.y - squareSize);
    ctx.strokeStyle = mutedColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw labels
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillStyle = textColor;

    // Vertex labels
    ctx.fillText('A', A.x - 20, A.y + 5);
    ctx.fillText('B', B.x + 10, B.y + 5);
    ctx.fillText('C', C.x - 20, C.y);

    // Draw side labels and values
    ctx.font = '13px Inter, sans-serif';

    // Side a (opposite to A, BC - hypotenuse)
    if (data.labels?.c !== undefined) {
        const midBC = { x: (B.x + C.x) / 2 + 15, y: (B.y + C.y) / 2 };
        ctx.fillStyle = data.highlight?.includes('c') ? accentColor : textColor;
        ctx.fillText(data.labels.c, midBC.x, midBC.y);
    }

    // Side b (AC - vertical leg)
    if (data.labels?.b !== undefined) {
        const midAC = { x: A.x - 25, y: (A.y + C.y) / 2 };
        ctx.fillStyle = data.highlight?.includes('b') ? accentColor : textColor;
        ctx.fillText(data.labels.b, midAC.x, midAC.y);
    }

    // Side c (AB - horizontal leg)
    if (data.labels?.a !== undefined) {
        const midAB = { x: (A.x + B.x) / 2, y: A.y + 20 };
        ctx.fillStyle = data.highlight?.includes('a') ? accentColor : textColor;
        ctx.fillText(data.labels.a, midAB.x, midAB.y);
    }

    // Draw angles
    if (data.angles) {
        // Angle at B
        if (data.angles.B) {
            ctx.fillStyle = data.highlight?.includes('B') ? accentColor : mutedColor;
            const angleB = Math.atan2(C.y - B.y, C.x - B.x);
            ctx.beginPath();
            ctx.arc(B.x, B.y, 25, Math.PI, angleB, true);
            ctx.stroke();
            ctx.fillText(data.angles.B, B.x - 35, B.y - 15);
        }

        // Angle at C
        if (data.angles.C) {
            ctx.fillStyle = data.highlight?.includes('C') ? accentColor : mutedColor;
            const angleC = Math.atan2(A.y - C.y, A.x - C.x);
            ctx.beginPath();
            ctx.arc(C.x, C.y, 25, angleC, Math.PI / 2 + 0.1, false);
            ctx.stroke();
            ctx.fillText(data.angles.C, C.x + 30, C.y + 20);
        }
    }

    // Draw median if needed
    if (data.showMedian) {
        const midBC = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(midBC.x, midBC.y);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);

        // Label median
        if (data.labels?.m !== undefined) {
            ctx.fillStyle = accentColor;
            ctx.fillText('m = ' + data.labels.m, (A.x + midBC.x) / 2 + 10, (A.y + midBC.y) / 2);
        }
    }

    // Draw unknown marker
    if (data.unknown) {
        ctx.fillStyle = accentColor;
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.fillText('?', data.unknownPos?.x || w/2, data.unknownPos?.y || h/2);
    }
}

// === Question Generators ===

function generatePythagoras() {
    const pythagoreanTriples = [
        [3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25]
    ];
    const triple = pythagoreanTriples[Math.floor(Math.random() * pythagoreanTriples.length)];
    const [a, b, c] = triple;

    const findTypes = ['hypotenuse', 'leg'];
    const findType = findTypes[Math.floor(Math.random() * findTypes.length)];

    if (findType === 'hypotenuse') {
        return {
            topic: 'pythagoras',
            question: `Катети трикутника ${a} і ${b}. Знайдіть гіпотенузу.`,
            correctAnswer: `${c}`,
            answers: shuffleArray([`${c}`, `${c + 1}`, `${c - 1}`, `${Math.round(Math.sqrt(a*a + b*b + 5))}`]),
            explanation: `c² = a² + b² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c}\nc = √${c*c} = ${c}`,
            hint: `Використай теорему Піфагора: c² = a² + b²`,
            drawing: {
                labels: { a: `${a}`, b: `${b}`, c: '?' },
                highlight: ['c'],
                triangleType: 'generic'
            }
        };
    } else {
        return {
            topic: 'pythagoras',
            question: `Гіпотенуза ${c}, один катет ${a}. Знайдіть інший катет.`,
            correctAnswer: `${b}`,
            answers: shuffleArray([`${b}`, `${b + 1}`, `${b - 1}`, `${Math.round(Math.sqrt(c*c - a*a + 3))}`]),
            explanation: `b² = c² - a² = ${c}² - ${a}² = ${c*c} - ${a*a} = ${b*b}\nb = √${b*b} = ${b}`,
            hint: `Виразіть катет: b² = c² - a²`,
            drawing: {
                labels: { a: `${a}`, b: '?', c: `${c}` },
                highlight: ['b'],
                triangleType: 'generic'
            }
        };
    }
}

function generateAngle30() {
    const aValues = [2, 3, 4, 5, 6];
    const a = aValues[Math.floor(Math.random() * aValues.length)];
    const hyp = 2 * a;
    const otherLeg = `${a}√3`;

    const questionTypes = ['findHyp', 'findShortLeg', 'findLongLeg'];
    const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    if (qType === 'findHyp') {
        return {
            topic: 'angle30',
            question: `Катет навпроти кута 30° дорівнює ${a}. Знайдіть гіпотенузу.`,
            correctAnswer: `${hyp}`,
            answers: shuffleArray([`${hyp}`, `${a}√3`, `${a}`, `${hyp + 2}`]),
            explanation: `Катет навпроти 30° = половина гіпотенузи\n${a} = c/2 → c = ${hyp}`,
            hint: `Катет навпроти 30° = половина гіпотенузи`,
            drawing: {
                labels: { a: `${a}`, b: '?', c: '?' },
                angles: { B: '30°', C: '60°' },
                highlight: ['c', 'B'],
                triangleType: '30-60-90'
            }
        };
    } else if (qType === 'findShortLeg') {
        return {
            topic: 'angle30',
            question: `Гіпотенуза дорівнює ${hyp}, один кут 30°. Знайдіть катет навпроти 30°.`,
            correctAnswer: `${a}`,
            answers: shuffleArray([`${a}`, `${hyp}`, `${a}√3`, `${a + 1}`]),
            explanation: `Катет навпроти 30° = c/2 = ${hyp}/2 = ${a}`,
            hint: `Катет навпроти 30° = половина гіпотенузи`,
            drawing: {
                labels: { a: '?', b: '', c: `${hyp}` },
                angles: { B: '30°', C: '60°' },
                highlight: ['a', 'B'],
                triangleType: '30-60-90'
            }
        };
    } else {
        return {
            topic: 'angle30',
            question: `Катет навпроти 30° = ${a}. Знайдіть катет навпроти 60°.`,
            correctAnswer: otherLeg,
            answers: shuffleArray([otherLeg, `${a}√2`, `${2*a}`, `${a + 1}√3`]),
            explanation: `Катети відносяться як a : a√3\nКатет навпроти 60° = ${a}√3`,
            hint: `В трикутнику 30-60-90: катети відносяться як 1 : √3`,
            drawing: {
                labels: { a: `${a}`, b: '?', c: '' },
                angles: { B: '30°', C: '60°' },
                highlight: ['b', 'C'],
                triangleType: '30-60-90'
            }
        };
    }
}

function generateAngle45() {
    const aValues = [3, 4, 5, 6, 7, 8];
    const a = aValues[Math.floor(Math.random() * aValues.length)];
    const hyp = `${a}√2`;

    const findType = Math.random() < 0.5 ? 'hyp' : 'leg';

    if (findType === 'hyp') {
        return {
            topic: 'angle45',
            question: `Катет рівнобедреного прямокутного трикутника = ${a}. Знайдіть гіпотенузу.`,
            correctAnswer: hyp,
            answers: shuffleArray([hyp, `${a}`, `${2*a}`, `${a}√3`]),
            explanation: `В трикутнику 45-45-90:\nc = a√2 = ${a}√2`,
            hint: `В рівнобедреному прямокутному трикутнику: c = a√2`,
            drawing: {
                labels: { a: `${a}`, b: `${a}`, c: '?' },
                angles: { B: '45°', C: '45°' },
                highlight: ['c'],
                triangleType: '45-45-90'
            }
        };
    } else {
        return {
            topic: 'angle45',
            question: `Гіпотенуза рівнобедреного прямокутного △ = ${a}√2. Знайдіть катет.`,
            correctAnswer: `${a}`,
            answers: shuffleArray([`${a}`, `${a}√2`, `${2*a}`, `${a-1}`]),
            explanation: `c = a√2 → a = c/√2 = ${a}√2/√2 = ${a}`,
            hint: `Катет = гіпотенуза / √2`,
            drawing: {
                labels: { a: '?', b: '?', c: `${a}√2` },
                angles: { B: '45°', C: '45°' },
                highlight: ['a', 'b'],
                triangleType: '45-45-90'
            }
        };
    }
}

function generateAngle60() {
    const aValues = [2, 3, 4, 5];
    const a = aValues[Math.floor(Math.random() * aValues.length)];
    const shortLeg = a;
    const longLeg = `${a}√3`;
    const hyp = 2 * a;

    return {
        topic: 'angle60',
        question: `Катет навпроти 60° = ${a}√3. Знайдіть гіпотенузу.`,
        correctAnswer: `${hyp}`,
        answers: shuffleArray([`${hyp}`, `${a}√3`, `${a}`, `${hyp + 2}`]),
        explanation: `Катет навпроти 60° = a√3, де a - катет навпроти 30°\n${a}√3 = a√3 → a = ${a}\nГіпотенуза = 2a = ${hyp}`,
        hint: `В 30-60-90: гіпотенуза = 2 × (катет навпроти 30°)`,
        drawing: {
            labels: { a: '', b: `${a}√3`, c: '?' },
            angles: { B: '30°', C: '60°' },
            highlight: ['c'],
            triangleType: '30-60-90'
        }
    };
}

function generateMedian() {
    const hypValues = [10, 12, 14, 16, 18, 20];
    const hyp = hypValues[Math.floor(Math.random() * hypValues.length)];
    const median = hyp / 2;

    const findType = Math.random() < 0.5 ? 'median' : 'hyp';

    if (findType === 'median') {
        return {
            topic: 'median',
            question: `Гіпотенуза = ${hyp}. Знайдіть медіану до гіпотенузи.`,
            correctAnswer: `${median}`,
            answers: shuffleArray([`${median}`, `${median + 1}`, `${median - 1}`, `${hyp}`]),
            explanation: `Медіана до гіпотенузи = c/2 = ${hyp}/2 = ${median}`,
            hint: `Медіана до гіпотенузи = половина гіпотенузи`,
            drawing: {
                labels: { a: '', b: '', c: `${hyp}`, m: '?' },
                showMedian: true,
                highlight: ['m'],
                triangleType: 'generic'
            }
        };
    } else {
        return {
            topic: 'median',
            question: `Медіана до гіпотенузи = ${median}. Знайдіть гіпотенузу.`,
            correctAnswer: `${hyp}`,
            answers: shuffleArray([`${hyp}`, `${median}`, `${hyp + 2}`, `${median * 3}`]),
            explanation: `m = c/2 → c = 2m = 2·${median} = ${hyp}`,
            hint: `Гіпотенуза = 2 × медіана`,
            drawing: {
                labels: { a: '', b: '', c: '?', m: `${median}` },
                showMedian: true,
                highlight: ['c'],
                triangleType: 'generic'
            }
        };
    }
}

function generateTrigFind() {
    const angles = [30, 45, 60];
    const angle = angles[Math.floor(Math.random() * angles.length)];
    const funcs = ['sin', 'cos', 'tg'];
    const func = funcs[Math.floor(Math.random() * funcs.length)];

    const values = TRIG_VALUES[angle];
    const correct = values[func];

    // Generate wrong answers based on function
    let wrongAnswers;
    if (func === 'sin') {
        wrongAnswers = [values.cos, values.tg, '1'];
    } else if (func === 'cos') {
        wrongAnswers = [values.sin, values.tg, '1'];
    } else {
        wrongAnswers = [values.sin, values.cos, '2'];
    }

    return {
        topic: 'trigFind',
        question: `Знайдіть ${func} ${angle}°`,
        correctAnswer: correct,
        answers: shuffleArray([correct, ...wrongAnswers]),
        explanation: `${func} ${angle}° = ${correct}`,
        hint: `Пригадай таблицю значень тригонометричних функцій`,
        drawing: {
            labels: { a: 'a', b: 'b', c: 'c' },
            angles: { B: `${90 - angle}°`, C: `${angle}°` },
            highlight: ['C'],
            triangleType: angle === 45 ? '45-45-90' : '30-60-90'
        }
    };
}

function generateTrigSolve() {
    // Problems with decimal ratios like sin α = 0.6, find side
    const sides = [
        { opp: 3, hyp: 5, adj: 4 },
        { opp: 5, hyp: 13, adj: 12 },
        { opp: 8, hyp: 10, adj: 6 },
        { opp: 15, hyp: 17, adj: 8 }
    ];
    const side = sides[Math.floor(Math.random() * sides.length)];

    const problemTypes = ['findOpp', 'findAdj', 'findHyp', 'findSin', 'findCos'];
    const pType = problemTypes[Math.floor(Math.random() * problemTypes.length)];

    const sinVal = (side.opp / side.hyp).toFixed(2).replace(/\.?0+$/, '');
    const cosVal = (side.adj / side.hyp).toFixed(2).replace(/\.?0+$/, '');

    if (pType === 'findOpp') {
        return {
            topic: 'trigSolve',
            question: `sin α = ${sinVal}, гіпотенуза = ${side.hyp}. Знайдіть протилежний катет.`,
            correctAnswer: `${side.opp}`,
            answers: shuffleArray([`${side.opp}`, `${side.adj}`, `${side.opp + 1}`, `${side.hyp}`]),
            explanation: `sin α = opp/hyp\nopp = sin α × hyp = ${sinVal} × ${side.hyp} = ${side.opp}`,
            hint: `sin α = протилежний / гіпотенуза`,
            drawing: {
                labels: { a: '?', b: '', c: `${side.hyp}` },
                angles: { C: 'α' },
                highlight: ['a', 'C'],
                triangleType: 'generic'
            }
        };
    } else if (pType === 'findAdj') {
        return {
            topic: 'trigSolve',
            question: `cos α = ${cosVal}, гіпотенуза = ${side.hyp}. Знайдіть прилеглий катет.`,
            correctAnswer: `${side.adj}`,
            answers: shuffleArray([`${side.adj}`, `${side.opp}`, `${side.adj + 1}`, `${side.hyp}`]),
            explanation: `cos α = adj/hyp\nadj = cos α × hyp = ${cosVal} × ${side.hyp} = ${side.adj}`,
            hint: `cos α = прилеглий / гіпотенуза`,
            drawing: {
                labels: { a: '', b: '?', c: `${side.hyp}` },
                angles: { C: 'α' },
                highlight: ['b', 'C'],
                triangleType: 'generic'
            }
        };
    } else if (pType === 'findHyp') {
        return {
            topic: 'trigSolve',
            question: `sin α = ${sinVal}, протилежний катет = ${side.opp}. Знайдіть гіпотенузу.`,
            correctAnswer: `${side.hyp}`,
            answers: shuffleArray([`${side.hyp}`, `${side.adj}`, `${side.hyp + 2}`, `${side.opp}`]),
            explanation: `sin α = opp/hyp\nhyp = opp/sin α = ${side.opp}/${sinVal} = ${side.hyp}`,
            hint: `Виразіть гіпотенузу: hyp = opp / sin α`,
            drawing: {
                labels: { a: `${side.opp}`, b: '', c: '?' },
                angles: { C: 'α' },
                highlight: ['c', 'C'],
                triangleType: 'generic'
            }
        };
    } else if (pType === 'findSin') {
        return {
            topic: 'trigSolve',
            question: `Протилежний катет = ${side.opp}, гіпотенуза = ${side.hyp}. Знайдіть sin α.`,
            correctAnswer: sinVal,
            answers: shuffleArray([sinVal, cosVal, `${(side.opp/side.adj).toFixed(2)}`, '1']),
            explanation: `sin α = opp/hyp = ${side.opp}/${side.hyp} = ${sinVal}`,
            hint: `sin α = протилежний / гіпотенуза`,
            drawing: {
                labels: { a: `${side.opp}`, b: '', c: `${side.hyp}` },
                angles: { C: 'α' },
                highlight: ['a', 'c', 'C'],
                triangleType: 'generic'
            }
        };
    } else {
        return {
            topic: 'trigSolve',
            question: `Прилеглий катет = ${side.adj}, гіпотенуза = ${side.hyp}. Знайдіть cos α.`,
            correctAnswer: cosVal,
            answers: shuffleArray([cosVal, sinVal, `${(side.adj/side.opp).toFixed(2)}`, '1']),
            explanation: `cos α = adj/hyp = ${side.adj}/${side.hyp} = ${cosVal}`,
            hint: `cos α = прилеглий / гіпотенуза`,
            drawing: {
                labels: { a: '', b: `${side.adj}`, c: `${side.hyp}` },
                angles: { C: 'α' },
                highlight: ['b', 'c', 'C'],
                triangleType: 'generic'
            }
        };
    }
}

function generateTrigAlpha() {
    const sideValues = [3, 4, 5, 6, 8, 10, 12];
    const side = sideValues[Math.floor(Math.random() * sideValues.length)];

    const problemTypes = ['hypBySin', 'oppByCos', 'adjByTg'];
    const pType = problemTypes[Math.floor(Math.random() * problemTypes.length)];

    if (pType === 'hypBySin') {
        return {
            topic: 'trigAlpha',
            question: `Катет навпроти α = ${side}. Виразіть гіпотенузу через α.`,
            correctAnswer: `${side}/sin α`,
            answers: shuffleArray([`${side}/sin α`, `${side}·sin α`, `${side}/cos α`, `${side}·cos α`]),
            explanation: `sin α = opp/hyp\nhyp = opp/sin α = ${side}/sin α`,
            hint: `З формули sin α = opp/hyp виразіть hyp`,
            drawing: {
                labels: { a: `${side}`, b: '', c: '?' },
                angles: { C: 'α' },
                highlight: ['a', 'c', 'C'],
                triangleType: 'generic'
            }
        };
    } else if (pType === 'oppByCos') {
        return {
            topic: 'trigAlpha',
            question: `Гіпотенуза = ${side}. Виразіть прилеглий катет через α.`,
            correctAnswer: `${side}·cos α`,
            answers: shuffleArray([`${side}·cos α`, `${side}/cos α`, `${side}·sin α`, `${side}/sin α`]),
            explanation: `cos α = adj/hyp\nadj = hyp·cos α = ${side}·cos α`,
            hint: `cos α = прилеглий / гіпотенуза`,
            drawing: {
                labels: { a: '', b: '?', c: `${side}` },
                angles: { C: 'α' },
                highlight: ['b', 'C'],
                triangleType: 'generic'
            }
        };
    } else {
        return {
            topic: 'trigAlpha',
            question: `Прилеглий катет = ${side}. Виразіть протилежний через α.`,
            correctAnswer: `${side}·tg α`,
            answers: shuffleArray([`${side}·tg α`, `${side}/tg α`, `${side}·sin α`, `${side}·cos α`]),
            explanation: `tg α = opp/adj\nopp = adj·tg α = ${side}·tg α`,
            hint: `tg α = протилежний / прилеглий`,
            drawing: {
                labels: { a: '?', b: `${side}`, c: '' },
                angles: { C: 'α' },
                highlight: ['a', 'C'],
                triangleType: 'generic'
            }
        };
    }
}

// === Question Selection ===
function generateQuestion() {
    let topicsPool = [];

    // If specific topic selected
    if (state.selectedTopic && state.selectedTopic !== 'mixed') {
        switch (state.selectedTopic) {
            case 'pythagoras':
                topicsPool = ['pythagoras'];
                break;
            case 'specialAngles':
                topicsPool = ['angle30', 'angle45', 'angle60'];
                break;
            case 'median':
                topicsPool = ['median'];
                break;
            case 'trigValues':
                topicsPool = ['trigFind'];
                break;
            case 'trigSolve':
                topicsPool = ['trigSolve', 'trigAlpha'];
                break;
            default:
                topicsPool = ['pythagoras'];
        }
    } else {
        // Mixed mode - use level-based selection
        if (state.level >= 1) {
            topicsPool.push('pythagoras', 'angle30', 'angle45', 'angle60', 'median');
        }
        if (state.level >= 2) {
            topicsPool.push('trigFind', 'trigSolve');
        }
        if (state.level >= 3) {
            topicsPool.push('trigAlpha');
        }
    }

    // Prefer weak areas in mixed mode
    let selectedTopic;
    if (state.selectedTopic === 'mixed') {
        const weakTopics = topicsPool.filter(t => state.weakAreas[t] > 0);
        if (weakTopics.length > 0 && Math.random() < 0.4) {
            selectedTopic = weakTopics[Math.floor(Math.random() * weakTopics.length)];
        } else {
            selectedTopic = topicsPool[Math.floor(Math.random() * topicsPool.length)];
        }
    } else {
        selectedTopic = topicsPool[Math.floor(Math.random() * topicsPool.length)];
    }

    switch (selectedTopic) {
        case 'pythagoras': return generatePythagoras();
        case 'angle30': return generateAngle30();
        case 'angle45': return generateAngle45();
        case 'angle60': return generateAngle60();
        case 'median': return generateMedian();
        case 'trigFind': return generateTrigFind();
        case 'trigSolve': return generateTrigSolve();
        case 'trigAlpha': return generateTrigAlpha();
        default: return generatePythagoras();
    }
}

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// === UI ===
function updateUI() {
    const levelBadge = document.getElementById('levelBadge');
    if (levelBadge) levelBadge.textContent = `Рівень ${state.level}`;

    const streakEl = document.getElementById('streakNumber');
    if (streakEl) streakEl.textContent = state.streak;

    const progress = (state.correctCount / state.totalQuestions) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.setProperty('--progress', `${progress}%`);

    const correctEl = document.getElementById('correctCount');
    if (correctEl) correctEl.textContent = state.correctCount;

    const totalEl = document.getElementById('totalCount');
    if (totalEl) totalEl.textContent = state.currentQuestion;

    const dots = document.querySelectorAll('.difficulty-dot');
    dots.forEach((dot, i) => dot.classList.toggle('active', i < state.level));
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function displayQuestion() {
    state.currentQuestionData = generateQuestion();
    state.answered = false;
    state.hintUsed = false;

    document.getElementById('questionNumber').textContent = `Питання ${state.currentQuestion + 1}`;
    document.getElementById('topicBadge').textContent = TOPICS[state.currentQuestionData.topic].name;
    document.getElementById('questionText').textContent = state.currentQuestionData.question;

    // Draw triangle
    const canvas = document.getElementById('triangleCanvas');
    drawTriangle(canvas, state.currentQuestionData.drawing);

    // Hide hint
    document.getElementById('hintContainer').style.display = 'none';
    document.getElementById('hintBtn').style.display = 'block';

    // Answers
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';

    const letters = ['А', 'Б', 'В', 'Г'];
    state.currentQuestionData.answers.forEach((answer, i) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerHTML = `<span class="answer-letter">${letters[i]}</span><span class="answer-text">${answer}</span>`;
        btn.addEventListener('click', () => handleAnswer(answer, btn));
        answersContainer.appendChild(btn);
    });

    document.getElementById('feedbackContainer').classList.remove('show', 'correct', 'incorrect');
    document.getElementById('nextBtn').style.display = 'none';

    updateUI();
}

function showHint() {
    state.hintUsed = true;
    document.getElementById('hintText').textContent = state.currentQuestionData.hint;
    document.getElementById('hintContainer').style.display = 'block';
    document.getElementById('hintBtn').style.display = 'none';
}

async function handleAnswer(answer, btn) {
    if (state.answered) return;
    state.answered = true;

    const isCorrect = answer === state.currentQuestionData.correctAnswer;

    document.querySelectorAll('.answer-btn').forEach(b => {
        b.classList.add('disabled');
        if (b.querySelector('.answer-text').textContent === state.currentQuestionData.correctAnswer) {
            b.classList.add('correct');
        }
    });

    if (!isCorrect) btn.classList.add('incorrect');

    if (isCorrect) {
        state.correctCount++;
        state.streak++;
        if (state.streak > state.maxStreak) state.maxStreak = state.streak;
        if (state.streak >= 5 && state.level < state.maxLevel) {
            state.level++;
            state.streak = 0;
        }
    } else {
        state.streak = 0;
        state.weakAreas[state.currentQuestionData.topic] = (state.weakAreas[state.currentQuestionData.topic] || 0) + 1;
        if (state.level > 1) {
            const recentWrong = state.history.slice(-5).filter(h => !h.correct).length;
            if (recentWrong >= 3) state.level--;
        }
    }

    state.history.push({ correct: isCorrect, topic: state.currentQuestionData.topic });

    showFeedback(isCorrect, answer);
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('hintBtn').style.display = 'none';

    saveProgress();
    updateUI();
}

async function showFeedback(isCorrect, userAnswer) {
    const feedbackContainer = document.getElementById('feedbackContainer');
    const feedbackIcon = document.getElementById('feedbackIcon');
    const feedbackText = document.getElementById('feedbackText');
    const feedbackExplanation = document.getElementById('feedbackExplanation');

    feedbackContainer.classList.remove('correct', 'incorrect');
    feedbackContainer.classList.add('show', isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
        feedbackIcon.textContent = '✅';
        feedbackText.textContent = ['Правильно!', 'Чудово!', 'Так тримати!', 'Молодець!'][Math.floor(Math.random() * 4)];
        feedbackExplanation.textContent = '';
    } else {
        feedbackIcon.textContent = '❌';
        feedbackText.textContent = 'Не зовсім так';
        feedbackExplanation.textContent = state.currentQuestionData.explanation;

        // Get GPT explanation
        try {
            const response = await fetch(`${API_URL}/api/explain`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: state.currentQuestionData.question,
                    correct: state.currentQuestionData.correctAnswer,
                    userAnswer: userAnswer,
                    formulaType: `Прямокутний трикутник: ${TOPICS[state.currentQuestionData.topic].name}`
                })
            });
            const data = await response.json();
            if (data.success) {
                feedbackExplanation.innerHTML = data.explanation;
                renderMath(feedbackExplanation);
            }
        } catch (e) {
            console.error('GPT error:', e);
        }
    }
}

function showResults() {
    showScreen('resultsScreen');

    const accuracy = Math.round((state.correctCount / state.totalQuestions) * 100);

    document.getElementById('resultCorrect').textContent = state.correctCount;
    document.getElementById('resultAccuracy').textContent = `${accuracy}%`;
    document.getElementById('resultLevel').textContent = state.level;

    const resultsIcon = document.getElementById('resultsIcon');
    const resultsTitle = document.getElementById('resultsTitle');

    if (accuracy >= 80) {
        resultsIcon.textContent = '🎉';
        resultsTitle.textContent = 'Чудова робота!';
    } else if (accuracy >= 60) {
        resultsIcon.textContent = '👍';
        resultsTitle.textContent = 'Непогано!';
    } else {
        resultsIcon.textContent = '💪';
        resultsTitle.textContent = 'Продовжуй тренуватись!';
    }

    displayWeakAreas();
    getGPTFeedback();
}

function displayWeakAreas() {
    const weakTopicsDiv = document.getElementById('weakTopics');
    const weakListDiv = document.getElementById('weakList');

    const significantWeak = Object.entries(state.weakAreas)
        .filter(([_, count]) => count >= 2)
        .map(([topic]) => TOPICS[topic]?.name || topic);

    if (significantWeak.length > 0) {
        weakTopicsDiv.style.display = 'block';
        weakListDiv.innerHTML = significantWeak.map(t => `<span class="weak-tag">${t}</span>`).join('');
    } else {
        weakTopicsDiv.style.display = 'none';
    }
}

async function getGPTFeedback() {
    const aiTextDiv = document.getElementById('aiText');
    aiTextDiv.textContent = 'Аналізую твої результати...';

    try {
        const weakNames = Object.entries(state.weakAreas)
            .filter(([_, c]) => c >= 2)
            .map(([t]) => TOPICS[t]?.name || t);

        const response = await fetch(`${API_URL}/api/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correct: state.correctCount,
                total: state.totalQuestions,
                level: state.level,
                weakAreas: weakNames,
                streak: state.maxStreak
            })
        });

        const data = await response.json();
        if (data.success) {
            aiTextDiv.innerHTML = data.feedback;
            renderMath(aiTextDiv);
        }
    } catch (e) {
        aiTextDiv.textContent = 'Продовжуй практикуватись! Прямокутний трикутник - основа геометрії.';
    }
}

function renderMath(element) {
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(element, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
            ],
            throwOnError: false
        });
    }
}

// === Event Listeners ===
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    updateUI();

    // Start button -> Topic selection
    document.getElementById('startBtn').addEventListener('click', () => {
        showScreen('topicScreen');
    });

    // Back to start from topic selection
    const backToStartBtn = document.getElementById('backToStartBtn');
    if (backToStartBtn) {
        backToStartBtn.addEventListener('click', () => {
            showScreen('startScreen');
        });
    }

    // Topic selection buttons
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.dataset.topic;
            state.selectedTopic = topic;
            state.currentQuestion = 0;
            state.correctCount = 0;
            state.streak = 0;
            state.history = [];
            state.weakAreas = {};

            showScreen('quizScreen');
            displayQuestion();
        });
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        state.currentQuestion++;
        if (state.currentQuestion >= state.totalQuestions) {
            showResults();
        } else {
            displayQuestion();
        }
    });

    document.getElementById('hintBtn').addEventListener('click', showHint);

    document.getElementById('restartBtn').addEventListener('click', () => {
        state.currentQuestion = 0;
        state.correctCount = 0;
        state.streak = 0;
        state.history = [];
        showScreen('topicScreen');
    });

    document.getElementById('reviewBtn').addEventListener('click', () => showScreen('theoryScreen'));
    document.getElementById('backToQuizBtn').addEventListener('click', () => showScreen('resultsScreen'));
});
