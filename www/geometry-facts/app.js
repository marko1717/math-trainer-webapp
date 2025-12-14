/* ===================================
   MATH QUEST - GEOMETRY FACTS
   Вірю / Не вірю Game
   =================================== */

// Geometry facts data (74 statements)
const GEOMETRY_FACTS = [
    {
        statement: "Точка перетину медіан трикутника є центром вписаного кола",
        isTrue: false,
        explanation: "Точка перетину медіан називається центроїдом (центром мас). Центр вписаного кола — це точка перетину бісектрис."
    },
    {
        statement: "Діагоналі ромба перпендикулярні",
        isTrue: true,
        explanation: "Це властивість ромба. Діагоналі ромба перетинаються під прямим кутом і є бісектрисами його кутів."
    },
    {
        statement: "Сума кутів опуклого чотирикутника дорівнює 360°",
        isTrue: true,
        explanation: "Будь-який опуклий чотирикутник можна розділити на два трикутники, сума кутів кожного з яких 180°."
    },
    {
        statement: "Медіана трикутника завжди ділить його на два рівні за площею трикутники",
        isTrue: true,
        explanation: "Медіана ділить трикутник на два трикутники з рівними основами і спільною висотою, тому їх площі рівні."
    },
    {
        statement: "Вписаний кут, що спирається на діаметр, завжди прямий",
        isTrue: true,
        explanation: "Це теорема Фалеса. Кут, вписаний у коло і який спирається на діаметр, завжди дорівнює 90°."
    },
    {
        statement: "Бісектриса кута трикутника ділить протилежну сторону навпіл",
        isTrue: false,
        explanation: "Бісектриса ділить протилежну сторону у відношенні прилеглих сторін, а не навпіл."
    },
    {
        statement: "Висота прямокутного трикутника, проведена до гіпотенузи, є середнім геометричним проекцій катетів на гіпотенузу",
        isTrue: true,
        explanation: "Якщо h — висота, а p і q — проекції катетів на гіпотенузу, то h² = p·q."
    },
    {
        statement: "Трапеція з рівними діагоналями є рівнобічною",
        isTrue: true,
        explanation: "Рівність діагоналей — характеристична властивість рівнобічної трапеції."
    },
    {
        statement: "Сума протилежних кутів вписаного чотирикутника дорівнює 180°",
        isTrue: true,
        explanation: "Це властивість вписаного чотирикутника. Протилежні кути спираються на дуги, що разом складають повне коло."
    },
    {
        statement: "Середня лінія трикутника паралельна основі і дорівнює її половині",
        isTrue: true,
        explanation: "Середня лінія з'єднує середини двох сторін і паралельна третій стороні, рівна її половині."
    },
    {
        statement: "Квадрат — це окремий випадок прямокутника",
        isTrue: true,
        explanation: "Квадрат — це прямокутник з рівними сторонами. Він успадковує всі властивості прямокутника."
    },
    {
        statement: "Точка перетину висот трикутника завжди лежить всередині трикутника",
        isTrue: false,
        explanation: "В тупокутному трикутнику ортоцентр (точка перетину висот) лежить зовні трикутника."
    },
    {
        statement: "Діагоналі прямокутника рівні",
        isTrue: true,
        explanation: "Це характеристична властивість прямокутника. Діагоналі прямокутника рівні і точкою перетину діляться навпіл."
    },
    {
        statement: "Кут між дотичною і хордою дорівнює половині дуги, на яку спирається хорда",
        isTrue: true,
        explanation: "Це теорема про кут між дотичною і хордою — він вимірюється половиною дуги."
    },
    {
        statement: "Площа ромба дорівнює половині добутку його діагоналей",
        isTrue: true,
        explanation: "S = (d₁ · d₂) / 2, де d₁ і d₂ — діагоналі ромба."
    },
    {
        statement: "Паралелограм з рівними діагоналями є прямокутником",
        isTrue: true,
        explanation: "Рівність діагоналей — достатня умова для того, щоб паралелограм був прямокутником."
    },
    {
        statement: "Відстань від центра кола до хорди не залежить від довжини хорди",
        isTrue: false,
        explanation: "Чим довша хорда, тим ближче вона до центра. Найдовша хорда — діаметр, що проходить через центр."
    },
    {
        statement: "Центральний кут удвічі більший за вписаний, що спирається на ту саму дугу",
        isTrue: true,
        explanation: "Це фундаментальна теорема: вписаний кут = половина центрального кута на тій же дузі."
    },
    {
        statement: "Будь-який трикутник можна вписати в коло",
        isTrue: true,
        explanation: "Через три точки, що не лежать на одній прямій, можна провести єдине коло."
    },
    {
        statement: "Рівнобедрений трикутник має вісь симетрії",
        isTrue: true,
        explanation: "Вісь симетрії проходить через вершину і середину основи (збігається з медіаною, висотою і бісектрисою)."
    },
    {
        statement: "Діагоналі квадрата перпендикулярні і рівні",
        isTrue: true,
        explanation: "Квадрат є одночасно ромбом (перпендикулярні діагоналі) і прямокутником (рівні діагоналі)."
    },
    {
        statement: "Сума зовнішніх кутів опуклого многокутника дорівнює 360°",
        isTrue: true,
        explanation: "Незалежно від кількості сторін, сума зовнішніх кутів опуклого многокутника завжди 360°."
    },
    {
        statement: "Паралелограм з перпендикулярними діагоналями є ромбом",
        isTrue: true,
        explanation: "Перпендикулярність діагоналей — достатня умова для того, щоб паралелограм був ромбом."
    },
    {
        statement: "Площа трапеції дорівнює добутку півсуми основ на висоту",
        isTrue: true,
        explanation: "S = ((a + b) / 2) · h, де a і b — основи, h — висота."
    },
    {
        statement: "Кут, вписаний у коло, що спирається на півколо, є тупим",
        isTrue: false,
        explanation: "Кут, що спирається на півколо (діаметр), завжди прямий (90°), а не тупий."
    },
    {
        statement: "Три медіани трикутника перетинаються в одній точці",
        isTrue: true,
        explanation: "Ця точка називається центроїдом і ділить кожну медіану у відношенні 2:1 від вершини."
    },
    {
        statement: "Площа круга з радіусом r дорівнює πr²",
        isTrue: true,
        explanation: "Це базова формула площі круга: S = πr²."
    },
    {
        statement: "Тангенс кута 45° дорівнює 1",
        isTrue: true,
        explanation: "tg 45° = sin 45° / cos 45° = 1, оскільки sin 45° = cos 45°."
    },
    {
        statement: "Косинус тупого кута завжди від'ємний",
        isTrue: true,
        explanation: "Для кутів від 90° до 180° косинус набуває від'ємних значень."
    },
    {
        statement: "Сума квадратів катетів дорівнює квадрату гіпотенузи",
        isTrue: true,
        explanation: "Це теорема Піфагора: a² + b² = c², де c — гіпотенуза."
    },
    {
        statement: "Три бісектриси трикутника перетинаються в центрі описаного кола",
        isTrue: false,
        explanation: "Бісектриси перетинаються в центрі вписаного кола. Описане коло — перетин серединних перпендикулярів."
    },
    {
        statement: "Середина гіпотенузи є центром описаного кола прямокутного трикутника",
        isTrue: true,
        explanation: "У прямокутному трикутнику гіпотенуза є діаметром описаного кола."
    },
    {
        statement: "Площа рівностороннього трикутника зі стороною a дорівнює (a²√3)/4",
        isTrue: true,
        explanation: "S = (a² · √3) / 4 — стандартна формула для рівностороннього трикутника."
    },
    {
        statement: "Вписані кути, що спираються на одну дугу, рівні",
        isTrue: true,
        explanation: "Всі вписані кути, що спираються на одну й ту ж дугу, мають однакову величину."
    },
    {
        statement: "Якщо діагоналі чотирикутника рівні, то він є прямокутником",
        isTrue: false,
        explanation: "Це правильно тільки для паралелограма. Рівнобічна трапеція також має рівні діагоналі."
    },
    {
        statement: "Периметр кола з радіусом r дорівнює 2πr",
        isTrue: true,
        explanation: "Довжина кола (периметр) C = 2πr = πd, де d — діаметр."
    },
    {
        statement: "Кут між бісектрисами суміжних кутів дорівнює 90°",
        isTrue: true,
        explanation: "Суміжні кути в сумі дають 180°, їх половини — 90°."
    },
    {
        statement: "Площа паралелограма дорівнює добутку основи на висоту",
        isTrue: true,
        explanation: "S = a · h, де a — основа, h — відповідна висота."
    },
    {
        statement: "Синус кута завжди додатний",
        isTrue: false,
        explanation: "Синус від'ємний для кутів від 180° до 360°."
    },
    {
        statement: "Діагоналі паралелограма точкою перетину діляться навпіл",
        isTrue: true,
        explanation: "Це характеристична властивість паралелограма."
    },
    {
        statement: "Радіус вписаного кола трикутника дорівнює S/p, де S — площа, p — півпериметр",
        isTrue: true,
        explanation: "r = S/p — формула для радіуса вписаного кола."
    },
    {
        statement: "Довжина дуги пропорційна центральному куту",
        isTrue: true,
        explanation: "l = (α/360°) · 2πr, де α — центральний кут у градусах."
    },
    {
        statement: "Відношення площ подібних фігур дорівнює квадрату коефіцієнта подібності",
        isTrue: true,
        explanation: "Якщо k — коефіцієнт подібності, то відношення площ = k²."
    },
    {
        statement: "Висота рівностороннього трикутника зі стороною a дорівнює (a√3)/2",
        isTrue: true,
        explanation: "h = (a · √3) / 2 — отримується з теореми Піфагора."
    },
    {
        statement: "Два трикутники подібні, якщо їх кути відповідно рівні",
        isTrue: true,
        explanation: "Рівність кутів — достатня умова подібності трикутників."
    },
    {
        statement: "Сума кутів трикутника дорівнює 180°",
        isTrue: true,
        explanation: "Це фундаментальна аксіома евклідової геометрії."
    },
    {
        statement: "Точка перетину серединних перпендикулярів — центр вписаного кола",
        isTrue: false,
        explanation: "Серединні перпендикуляри перетинаються в центрі описаного кола. Вписане — перетин бісектрис."
    },
    {
        statement: "Кут 1 радіан приблизно дорівнює 57°",
        isTrue: true,
        explanation: "1 рад = 180°/π ≈ 57.3°."
    },
    {
        statement: "Площа сектора кола пропорційна центральному куту",
        isTrue: true,
        explanation: "S = (α/360°) · πr², де α — центральний кут."
    },
    {
        statement: "Теорема синусів: a/sin A = b/sin B = c/sin C = 2R",
        isTrue: true,
        explanation: "Це теорема синусів, де R — радіус описаного кола."
    },
    {
        statement: "В прямокутному трикутнику катет лежить проти меншого гострого кута",
        isTrue: false,
        explanation: "Менший катет лежить проти меншого кута. Більший катет — проти більшого гострого кута."
    },
    {
        statement: "Тангенс прямого кута не існує",
        isTrue: true,
        explanation: "tg 90° = sin 90° / cos 90° = 1/0 — ділення на нуль, тому не визначений."
    },
    {
        statement: "Сума довжин двох сторін трикутника більша за третю сторону",
        isTrue: true,
        explanation: "Це нерівність трикутника — необхідна умова існування трикутника."
    },
    {
        statement: "Площа трикутника дорівнює половині добутку двох сторін на синус кута між ними",
        isTrue: true,
        explanation: "S = (1/2) · a · b · sin C — формула площі трикутника."
    },
    {
        statement: "Кут між дотичною до кола і радіусом, проведеним у точку дотику, дорівнює 90°",
        isTrue: true,
        explanation: "Дотична завжди перпендикулярна до радіуса в точці дотику."
    },
    {
        statement: "Відношення периметрів подібних фігур дорівнює коефіцієнту подібності",
        isTrue: true,
        explanation: "Периметри пропорційні з коефіцієнтом k, площі — з k²."
    },
    {
        statement: "Косинус 60° дорівнює 1/2",
        isTrue: true,
        explanation: "cos 60° = 1/2 — один із табличних значень."
    },
    {
        statement: "В будь-якому трикутнику можна провести рівно три висоти",
        isTrue: true,
        explanation: "З кожної вершини можна опустити рівно одну висоту на протилежну сторону."
    },
    {
        statement: "Діагональ квадрата зі стороною a дорівнює a√2",
        isTrue: true,
        explanation: "За теоремою Піфагора: d² = a² + a² = 2a², тому d = a√2."
    },
    {
        statement: "Всі радіуси одного кола рівні між собою",
        isTrue: true,
        explanation: "За означенням кола всі його точки рівновіддалені від центра, тому всі радіуси рівні."
    },
    {
        statement: "Кут при основі рівнобедреного трикутника може бути тупим",
        isTrue: false,
        explanation: "Якщо кут при основі тупий, то два таких кути дали б суму більше 180°, що неможливо."
    },
    {
        statement: "Синус 30° дорівнює 1/2",
        isTrue: true,
        explanation: "sin 30° = 1/2 — один із табличних значень."
    },
    {
        statement: "Два кола з різними радіусами можуть мати не більше двох спільних точок",
        isTrue: true,
        explanation: "Два кола можуть: не перетинатися, дотикатися (1 точка) або перетинатися (2 точки)."
    },
    {
        statement: "Площа кільця дорівнює π(R² - r²), де R і r — зовнішній і внутрішній радіуси",
        isTrue: true,
        explanation: "Площа кільця = площа більшого кола мінус площа меншого: πR² - πr² = π(R² - r²)."
    },
    {
        statement: "Будь-який чотирикутник можна вписати в коло",
        isTrue: false,
        explanation: "Тільки чотирикутники з сумою протилежних кутів 180° можна вписати в коло."
    },
    {
        statement: "Теорема косинусів: c² = a² + b² - 2ab·cos C",
        isTrue: true,
        explanation: "Це теорема косинусів — узагальнення теореми Піфагора."
    },
    {
        statement: "Медіана прямокутного трикутника, проведена до гіпотенузи, дорівнює половині гіпотенузи",
        isTrue: true,
        explanation: "Медіана до гіпотенузи = радіус описаного кола = половина гіпотенузи."
    },
    {
        statement: "Площа круга завжди більша за площу вписаного в нього квадрата",
        isTrue: true,
        explanation: "Квадрат міститься всередині круга, тому його площа менша."
    },
    {
        statement: "В рівнобедреному трикутнику бісектриса, проведена до основи, є також медіаною і висотою",
        isTrue: true,
        explanation: "В рівнобедреному трикутнику ці три лінії з вершини до основи збігаються."
    },
    {
        statement: "Косинус 0° дорівнює 0",
        isTrue: false,
        explanation: "cos 0° = 1, а не 0. Нулю дорівнює cos 90°."
    },
    {
        statement: "Периметр правильного шестикутника дорівнює 6R, де R — радіус описаного кола",
        isTrue: true,
        explanation: "Сторона правильного шестикутника дорівнює радіусу описаного кола, тому P = 6R."
    },
    {
        statement: "Довжина кола більша за периметр будь-якого вписаного многокутника",
        isTrue: true,
        explanation: "Вписаний многокутник завжди має менший периметр, ніж довжина кола."
    },
    {
        statement: "Градусна міра повного кута дорівнює 360°",
        isTrue: true,
        explanation: "Повний кут — це кут повного оберту, він завжди дорівнює 360° або 2π радіан."
    }
];

// Game state
let state = {
    currentQuestion: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    totalQuestions: 10,
    questions: [],
    mistakes: [],
    answered: false,
    startTime: null,
    bestScore: 0,
    gamesPlayed: 0
};

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    results: document.getElementById('resultsScreen'),
    review: document.getElementById('reviewScreen')
};

// Load saved stats
function loadStats() {
    const saved = localStorage.getItem('geometry_facts_stats');
    if (saved) {
        const stats = JSON.parse(saved);
        state.bestScore = stats.bestScore || 0;
        state.gamesPlayed = stats.gamesPlayed || 0;

        document.getElementById('bestScore').textContent = state.bestScore + '%';
        document.getElementById('gamesPlayed').textContent = state.gamesPlayed;
    }
}

// Save stats
function saveStats() {
    localStorage.setItem('geometry_facts_stats', JSON.stringify({
        bestScore: state.bestScore,
        gamesPlayed: state.gamesPlayed
    }));
}

// Shuffle array (Fisher-Yates)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Show screen
function showScreen(screenId) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenId].classList.add('active');
}

// Initialize game
function initGame() {
    // Reset state
    state.currentQuestion = 0;
    state.score = 0;
    state.streak = 0;
    state.mistakes = [];
    state.answered = false;
    state.startTime = Date.now();

    // Shuffle and select questions
    state.questions = shuffleArray(GEOMETRY_FACTS).slice(0, state.totalQuestions);

    // Show progress
    document.getElementById('progressContainer').style.display = 'block';
    document.getElementById('totalCount').textContent = state.totalQuestions;

    // Show game screen and first question
    showScreen('game');
    showQuestion();
}

// Show current question
function showQuestion() {
    const question = state.questions[state.currentQuestion];

    // Update question number
    document.getElementById('questionNumber').textContent =
        `Твердження ${state.currentQuestion + 1} / ${state.totalQuestions}`;

    // Update statement
    document.getElementById('statementText').textContent = question.statement;

    // Reset buttons
    const trueBtn = document.getElementById('trueBtn');
    const falseBtn = document.getElementById('falseBtn');
    trueBtn.disabled = false;
    falseBtn.disabled = false;
    trueBtn.className = 'answer-btn true-btn';
    falseBtn.className = 'answer-btn false-btn';

    // Show answer buttons, hide feedback
    document.getElementById('answerButtons').style.display = 'grid';
    document.getElementById('feedbackContainer').classList.add('hidden');

    // Update progress
    const progress = (state.currentQuestion / state.totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('correctCount').textContent = state.score;

    // Update streak
    document.getElementById('streakNumber').textContent = state.streak;

    state.answered = false;
}

// Handle answer
function handleAnswer(userAnswer) {
    if (state.answered) return;
    state.answered = true;

    const question = state.questions[state.currentQuestion];
    const isCorrect = userAnswer === question.isTrue;

    const trueBtn = document.getElementById('trueBtn');
    const falseBtn = document.getElementById('falseBtn');

    // Disable buttons
    trueBtn.disabled = true;
    falseBtn.disabled = true;

    // Show which was selected and correct answer
    if (userAnswer) {
        trueBtn.classList.add(isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect) falseBtn.classList.add('correct');
    } else {
        falseBtn.classList.add(isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect) trueBtn.classList.add('correct');
    }

    // Update score and streak
    if (isCorrect) {
        state.score++;
        state.streak++;
        if (state.streak > state.maxStreak) {
            state.maxStreak = state.streak;
        }
    } else {
        state.streak = 0;
        state.mistakes.push({
            statement: question.statement,
            userAnswer: userAnswer,
            correctAnswer: question.isTrue,
            explanation: question.explanation
        });
    }

    // Update streak display
    document.getElementById('streakNumber').textContent = state.streak;

    // Show feedback
    const feedbackContainer = document.getElementById('feedbackContainer');
    const feedbackResult = document.querySelector('.feedback-result');
    const feedbackIcon = document.getElementById('feedbackIcon');
    const feedbackText = document.getElementById('feedbackText');
    const explanationText = document.getElementById('explanationText');

    feedbackResult.className = 'feedback-result ' + (isCorrect ? 'correct' : 'incorrect');
    feedbackIcon.textContent = isCorrect ? '✅' : '❌';
    feedbackText.textContent = isCorrect ? 'Правильно!' : 'Неправильно';
    explanationText.textContent = question.explanation;

    feedbackContainer.classList.remove('hidden');

    // Update progress
    document.getElementById('correctCount').textContent = state.score;
}

// Next question
function nextQuestion() {
    state.currentQuestion++;

    if (state.currentQuestion >= state.totalQuestions) {
        showResults();
    } else {
        showQuestion();
    }
}

// Show results
function showResults() {
    const accuracy = Math.round((state.score / state.totalQuestions) * 100);
    const timeSpent = Math.round((Date.now() - state.startTime) / 1000);

    // Update best score
    if (accuracy > state.bestScore) {
        state.bestScore = accuracy;
    }
    state.gamesPlayed++;
    saveStats();

    // Update results display
    document.getElementById('resultCorrect').textContent = state.score + '/' + state.totalQuestions;
    document.getElementById('resultAccuracy').textContent = accuracy + '%';
    document.getElementById('resultStreak').textContent = state.maxStreak;

    // Set icon and title based on performance
    const resultsIcon = document.getElementById('resultsIcon');
    const resultsTitle = document.getElementById('resultsTitle');

    if (accuracy >= 90) {
        resultsIcon.textContent = '🏆';
        resultsTitle.textContent = 'Відмінно!';
    } else if (accuracy >= 70) {
        resultsIcon.textContent = '🎉';
        resultsTitle.textContent = 'Чудова робота!';
    } else if (accuracy >= 50) {
        resultsIcon.textContent = '👍';
        resultsTitle.textContent = 'Непогано!';
    } else {
        resultsIcon.textContent = '💪';
        resultsTitle.textContent = 'Продовжуй вчитися!';
    }

    // Show/hide review button
    document.getElementById('reviewBtn').style.display =
        state.mistakes.length > 0 ? 'flex' : 'none';

    // Hide progress
    document.getElementById('progressContainer').style.display = 'none';

    // Save to Firebase
    saveToFirebase(accuracy, timeSpent);

    showScreen('results');
}

// Save to Firebase
async function saveToFirebase(accuracy, timeSpent) {
    if (window.MathQuestFirebase && window.MathQuestFirebase.getCurrentUser()) {
        try {
            await window.MathQuestFirebase.saveTrainerSession({
                trainerId: 'geometry-facts',
                trainerName: 'Вірю / Не вірю',
                score: state.score,
                totalQuestions: state.totalQuestions,
                timeSpent: timeSpent,
                difficulty: 'normal'
            });
            console.log('✅ Results saved to Firebase');
        } catch (error) {
            console.error('Firebase save error:', error);
        }
    }
}

// Show mistakes review
function showReview() {
    const mistakesList = document.getElementById('mistakesList');
    mistakesList.innerHTML = '';

    state.mistakes.forEach((mistake, index) => {
        const card = document.createElement('div');
        card.className = 'mistake-card';
        card.innerHTML = `
            <div class="mistake-statement">${index + 1}. ${mistake.statement}</div>
            <div class="mistake-answer">
                <span class="your-answer">Твоя: ${mistake.userAnswer ? 'Вірю' : 'Не вірю'}</span>
                <span class="correct-answer">Правильно: ${mistake.correctAnswer ? 'Вірю' : 'Не вірю'}</span>
            </div>
            <div class="mistake-explanation">${mistake.explanation}</div>
        `;
        mistakesList.appendChild(card);
    });

    showScreen('review');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadStats();

    // Question count selector
    document.querySelectorAll('.count-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.totalQuestions = parseInt(btn.dataset.count);
        });
    });

    // Start button
    document.getElementById('startBtn').addEventListener('click', initGame);

    // Answer buttons
    document.getElementById('trueBtn').addEventListener('click', () => handleAnswer(true));
    document.getElementById('falseBtn').addEventListener('click', () => handleAnswer(false));

    // Next button
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);

    // Restart button
    document.getElementById('restartBtn').addEventListener('click', initGame);

    // Review button
    document.getElementById('reviewBtn').addEventListener('click', showReview);

    // Back from review
    document.getElementById('backFromReviewBtn').addEventListener('click', () => showScreen('results'));
});

console.log('📐 Geometry Facts game loaded');
