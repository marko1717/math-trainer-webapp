// Flashcards Web App
// Interactive flashcard learning with flip animation

const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
}

// Flashcard sets data (imported from bot)
const FLASH_CARDS = {
    algebra: {
        title: "Алгебра",
        icon: "📐",
        cards: [
            { front: "a² - b²", back: "(a + b)(a - b)", nmt: true },
            { front: "(a + b)²", back: "a² + 2ab + b²", nmt: true },
            { front: "(a - b)²", back: "a² - 2ab + b²", nmt: true },
            { front: "a³ + b³", back: "(a + b)(a² - ab + b²)", nmt: true },
            { front: "a³ - b³", back: "(a - b)(a² + ab + b²)", nmt: true },
            { front: "|a| = ?", back: "a, якщо a ≥ 0\n-a, якщо a < 0", nmt: true }
        ]
    },
    equations: {
        title: "Рівняння",
        icon: "🔢",
        cards: [
            { front: "D = ?", back: "b² - 4ac", nmt: true },
            { front: "x₁,₂ = ? (D > 0)", back: "(-b ± √D) / 2a", nmt: true },
            { front: "x = ? (D = 0)", back: "-b / 2a", nmt: true },
            { front: "x₁ + x₂ = ? (Вієта)", back: "-b/a", nmt: true },
            { front: "x₁ · x₂ = ? (Вієта)", back: "c/a", nmt: true },
            { front: "ax² + bx + c = ?", back: "a(x - x₁)(x - x₂)", nmt: true }
        ]
    },
    powers: {
        title: "Степені",
        icon: "⚡",
        cards: [
            { front: "a⁰ = ?", back: "1 (a ≠ 0)", nmt: true },
            { front: "a⁻ⁿ = ?", back: "1/aⁿ", nmt: true },
            { front: "aᵐ · aⁿ = ?", back: "aᵐ⁺ⁿ", nmt: true },
            { front: "aᵐ / aⁿ = ?", back: "aᵐ⁻ⁿ", nmt: true },
            { front: "(aᵐ)ⁿ = ?", back: "aᵐⁿ", nmt: true },
            { front: "(ab)ⁿ = ?", back: "aⁿ · bⁿ", nmt: true },
            { front: "√a² = ?", back: "|a|", nmt: true },
            { front: "aᵐ/ⁿ = ?", back: "ⁿ√aᵐ", nmt: true }
        ]
    },
    logarithms: {
        title: "Логарифми",
        icon: "📊",
        cards: [
            { front: "logₐa = ?", back: "1", nmt: true },
            { front: "logₐ1 = ?", back: "0", nmt: true },
            { front: "logₐ(bc) = ?", back: "logₐb + logₐc", nmt: true },
            { front: "logₐ(b/c) = ?", back: "logₐb - logₐc", nmt: true },
            { front: "logₐbⁿ = ?", back: "n · logₐb", nmt: true },
            { front: "logₐb = ?", back: "logₖb / logₖa", nmt: true },
            { front: "logₐb = ?", back: "1 / logᵦa", nmt: true }
        ]
    },
    progressions: {
        title: "Прогресії",
        icon: "📈",
        cards: [
            { front: "aₙ = ? (АП)", back: "a₁ + d(n-1)", nmt: true },
            { front: "Sₙ = ? (АП)", back: "(a₁ + aₙ)·n / 2", nmt: true },
            { front: "bₙ = ? (ГП)", back: "b₁ · qⁿ⁻¹", nmt: true },
            { front: "Sₙ = ? (ГП)", back: "b₁(qⁿ - 1)/(q - 1)", nmt: true }
        ]
    },
    trigonometry: {
        title: "Тригонометрія",
        icon: "🔵",
        cards: [
            { front: "sin²α + cos²α = ?", back: "1", nmt: true },
            { front: "tg α = ?", back: "sin α / cos α", nmt: true },
            { front: "1 + tg²α = ?", back: "1/cos²α", nmt: true },
            { front: "sin 2α = ?", back: "2sin α·cos α", nmt: true },
            { front: "cos 2α = ?", back: "cos²α - sin²α", nmt: true },
            { front: "sin(-α) = ?", back: "-sin α", nmt: true },
            { front: "cos(-α) = ?", back: "cos α", nmt: true },
            { front: "sin(90° - α) = ?", back: "cos α", nmt: true },
            { front: "cos(90° - α) = ?", back: "sin α", nmt: true },
            { front: "sin(180° - α) = ?", back: "sin α", nmt: true },
            { front: "cos(180° - α) = ?", back: "-cos α", nmt: true }
        ]
    },
    trig_values: {
        title: "Значення триг. функцій",
        icon: "📐",
        cards: [
            { front: "sin 0° = ?", back: "0", nmt: true },
            { front: "sin 30° = ?", back: "1/2", nmt: true },
            { front: "sin 45° = ?", back: "√2/2", nmt: true },
            { front: "sin 60° = ?", back: "√3/2", nmt: true },
            { front: "sin 90° = ?", back: "1", nmt: true },
            { front: "cos 0° = ?", back: "1", nmt: true },
            { front: "cos 30° = ?", back: "√3/2", nmt: true },
            { front: "cos 45° = ?", back: "√2/2", nmt: true },
            { front: "cos 60° = ?", back: "1/2", nmt: true },
            { front: "cos 90° = ?", back: "0", nmt: true },
            { front: "tg 30° = ?", back: "√3/3", nmt: true },
            { front: "tg 45° = ?", back: "1", nmt: true },
            { front: "tg 60° = ?", back: "√3", nmt: true }
        ]
    },
    calculus: {
        title: "Похідні",
        icon: "∂",
        cards: [
            { front: "(C)' = ?", back: "0", nmt: true },
            { front: "(x)' = ?", back: "1", nmt: true },
            { front: "(xⁿ)' = ?", back: "n·xⁿ⁻¹", nmt: true },
            { front: "(√x)' = ?", back: "1/(2√x)", nmt: true },
            { front: "(eˣ)' = ?", back: "eˣ", nmt: true },
            { front: "(ln x)' = ?", back: "1/x", nmt: true },
            { front: "(sin x)' = ?", back: "cos x", nmt: true },
            { front: "(cos x)' = ?", back: "-sin x", nmt: true },
            { front: "(u + v)' = ?", back: "u' + v'", nmt: true },
            { front: "(u·v)' = ?", back: "u'v + uv'", nmt: true },
            { front: "(u/v)' = ?", back: "(u'v - uv')/v²", nmt: true }
        ]
    },
    integrals: {
        title: "Первісні",
        icon: "∫",
        cards: [
            { front: "∫xⁿ dx = ?", back: "xⁿ⁺¹/(n+1) + C", nmt: true },
            { front: "∫1/x dx = ?", back: "ln|x| + C", nmt: true },
            { front: "∫eˣ dx = ?", back: "eˣ + C", nmt: true },
            { front: "∫sin x dx = ?", back: "-cos x + C", nmt: true },
            { front: "∫cos x dx = ?", back: "sin x + C", nmt: true },
            { front: "∫1/cos²x dx = ?", back: "tg x + C", nmt: true },
            { front: "∫f(x)dx |ᵇₐ = ?", back: "F(b) - F(a)", nmt: true }
        ]
    },
    triangles: {
        title: "Трикутники",
        icon: "📐",
        cards: [
            { front: "S = ? (основа, висота)", back: "½·a·h", nmt: true },
            { front: "S = ? (дві сторони, кут)", back: "½·a·b·sin C", nmt: true },
            { front: "S = ? (Герон)", back: "√(p(p-a)(p-b)(p-c))", nmt: true },
            { front: "a² + b² = ? (Піфагор)", back: "c²", nmt: true },
            { front: "a/sin A = ?", back: "2R (теорема синусів)", nmt: true },
            { front: "c² = ? (косинусів)", back: "a² + b² - 2ab·cos C", nmt: true },
            { front: "S правильного △", back: "a²√3/4", nmt: true }
        ]
    },
    quadrilaterals: {
        title: "Чотирикутники",
        icon: "⬛",
        cards: [
            { front: "S паралелограма", back: "a·h = a·b·sin γ", nmt: true },
            { front: "S ромба", back: "½·d₁·d₂", nmt: true },
            { front: "S прямокутника", back: "a·b", nmt: true },
            { front: "S квадрата", back: "a²", nmt: true },
            { front: "S трапеції", back: "½(a+b)·h", nmt: true },
            { front: "d прямокутника", back: "√(a² + b²)", nmt: true },
            { front: "d квадрата", back: "a√2", nmt: true }
        ]
    },
    circles: {
        title: "Коло",
        icon: "⭕",
        cards: [
            { front: "L кола", back: "2πR", nmt: true },
            { front: "S круга", back: "πR²", nmt: true },
            { front: "Рівняння кола", back: "(x-x₀)² + (y-y₀)² = R²", nmt: true },
            { front: "R описаного △", back: "abc/4S", nmt: true },
            { front: "r вписаного △", back: "S/p", nmt: true }
        ]
    },
    solids: {
        title: "Стереометрія",
        icon: "📦",
        cards: [
            { front: "V призми", back: "S_осн · H", nmt: true },
            { front: "V піраміди", back: "⅓·S_осн·H", nmt: true },
            { front: "V циліндра", back: "πR²H", nmt: true },
            { front: "S_біч циліндра", back: "2πRH", nmt: true },
            { front: "V конуса", back: "⅓πR²H", nmt: true },
            { front: "S_біч конуса", back: "πRL", nmt: true },
            { front: "V кулі", back: "⁴⁄₃πR³", nmt: true },
            { front: "S кулі", back: "4πR²", nmt: true }
        ]
    },
    probability: {
        title: "Ймовірність",
        icon: "🎲",
        cards: [
            { front: "P(A) = ?", back: "k/n (сприятливі/всі)", nmt: true },
            { front: "Pₙ = ?", back: "n! (перестановки)", nmt: true },
            { front: "Aₙᵏ = ?", back: "n!/(n-k)! (розміщення)", nmt: true },
            { front: "Cₙᵏ = ?", back: "n!/k!(n-k)! (комбінації)", nmt: true }
        ]
    }
};

// State
let state = {
    currentSet: null,
    currentSetName: null,
    currentIndex: 0,
    cards: [],
    known: new Set(),
    learning: new Set(),
    isFlipped: false,
    nmtOnly: false,
    startTime: null
};

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    cards: document.getElementById('cardsScreen'),
    results: document.getElementById('resultsScreen')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderSetsList();
    setupEventListeners();
    loadProgress();
});

function renderSetsList() {
    const grid = document.getElementById('setsGrid');
    grid.innerHTML = '';

    Object.entries(FLASH_CARDS).forEach(([key, set]) => {
        const nmtCount = set.cards.filter(c => c.nmt).length;
        const card = document.createElement('div');
        card.className = 'set-card';
        card.dataset.set = key;
        card.innerHTML = `
            <div class="set-icon">${set.icon}</div>
            <div class="set-name">${set.title}</div>
            <div class="set-count">
                ${set.cards.length} карток
                ${nmtCount > 0 ? `<span class="nmt-indicator">${nmtCount} НМТ</span>` : ''}
            </div>
        `;
        card.addEventListener('click', () => startSet(key));
        grid.appendChild(card);
    });
}

function setupEventListeners() {
    // Back button
    document.getElementById('backBtn').addEventListener('click', () => {
        saveProgress();
        showScreen('start');
    });

    // Card flip
    document.getElementById('flashcard').addEventListener('click', flipCard);

    // Navigation
    document.getElementById('prevBtn').addEventListener('click', prevCard);
    document.getElementById('nextBtn').addEventListener('click', nextCard);
    document.getElementById('knowBtn').addEventListener('click', markAsKnown);
    document.getElementById('learnBtn').addEventListener('click', markAsLearning);

    // Results buttons
    document.getElementById('reviewLearningBtn').addEventListener('click', reviewLearning);
    document.getElementById('restartBtn').addEventListener('click', restartSet);
    document.getElementById('backToSetsBtn').addEventListener('click', () => showScreen('start'));
    document.getElementById('resultsBackBtn')?.addEventListener('click', () => showScreen('start'));

    // NMT filter
    document.getElementById('nmtOnlyFilter').addEventListener('change', (e) => {
        state.nmtOnly = e.target.checked;
    });

    // Touch swipe
    setupSwipeGestures();
}

function setupSwipeGestures() {
    const card = document.getElementById('flashcard');
    let startX = 0;
    let startY = 0;

    card.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = endX - startX;
        const diffY = endY - startY;

        // Horizontal swipe (more than 50px and horizontal > vertical)
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                prevCard();
            } else {
                nextCard();
            }
        }
    }, { passive: true });
}

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
}

function startSet(setKey) {
    const set = FLASH_CARDS[setKey];
    if (!set) return;

    state.currentSet = setKey;
    state.currentSetName = set.title;
    state.currentIndex = 0;
    state.isFlipped = false;
    state.startTime = Date.now();

    // Filter cards if NMT only
    state.cards = state.nmtOnly
        ? set.cards.filter(c => c.nmt)
        : [...set.cards];

    // Shuffle cards
    shuffleArray(state.cards);

    // Reset progress for this session
    state.known = new Set();
    state.learning = new Set();

    document.getElementById('setTitle').textContent = set.title;
    document.getElementById('totalCards').textContent = state.cards.length;

    showScreen('cards');
    displayCard();

    // Hide swipe hint after first view
    setTimeout(() => {
        document.getElementById('swipeHint').style.opacity = '0';
    }, 3000);
}

function displayCard() {
    if (state.cards.length === 0) {
        showResults();
        return;
    }

    const card = state.cards[state.currentIndex];
    const flashcard = document.getElementById('flashcard');

    // Reset flip
    state.isFlipped = false;
    flashcard.classList.remove('flipped');

    // Update content
    document.getElementById('cardFront').textContent = card.front;
    document.getElementById('cardBack').textContent = card.back;

    // NMT badge
    const badge = document.getElementById('nmtBadge');
    badge.classList.toggle('hidden', !card.nmt);

    // Update counter and progress
    document.getElementById('currentIndex').textContent = state.currentIndex + 1;
    const progress = ((state.currentIndex + 1) / state.cards.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function flipCard() {
    const flashcard = document.getElementById('flashcard');
    state.isFlipped = !state.isFlipped;
    flashcard.classList.toggle('flipped', state.isFlipped);
}

function nextCard() {
    if (state.currentIndex < state.cards.length - 1) {
        state.currentIndex++;
        displayCard();
    } else {
        showResults();
    }
}

function prevCard() {
    if (state.currentIndex > 0) {
        state.currentIndex--;
        displayCard();
    }
}

function markAsKnown() {
    const cardIndex = state.currentIndex;
    state.known.add(cardIndex);
    state.learning.delete(cardIndex);

    // Animate and go to next
    animateSwipe('right');
    setTimeout(() => {
        nextCard();
    }, 300);
}

function markAsLearning() {
    const cardIndex = state.currentIndex;
    state.learning.add(cardIndex);
    state.known.delete(cardIndex);

    // Animate and go to next
    animateSwipe('left');
    setTimeout(() => {
        nextCard();
    }, 300);
}

function animateSwipe(direction) {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.add(`swipe-${direction}`);
    setTimeout(() => {
        flashcard.classList.remove(`swipe-${direction}`);
    }, 300);
}

async function showResults() {
    const total = state.cards.length;
    const known = state.known.size;
    const learning = state.learning.size;
    const remaining = total - known - learning;

    document.getElementById('knownCount').textContent = known;
    document.getElementById('learningCount').textContent = learning;
    document.getElementById('remainingCount').textContent = remaining;

    // Results icon based on known percentage
    const resultsIcon = document.getElementById('resultsIcon');
    const resultsTitle = document.getElementById('resultsTitle');
    const knownPercent = total > 0 ? Math.round((known / total) * 100) : 0;

    if (knownPercent >= 80) {
        resultsIcon.textContent = '🎉';
        resultsTitle.textContent = 'Чудово!';
    } else if (knownPercent >= 50) {
        resultsIcon.textContent = '👍';
        resultsTitle.textContent = 'Непогано!';
    } else {
        resultsIcon.textContent = '📚';
        resultsTitle.textContent = 'Продовжуй вчити!';
    }

    // Disable review button if no learning cards
    document.getElementById('reviewLearningBtn').disabled = learning === 0;

    showScreen('results');
    saveProgress();

    // Save to Firebase
    await saveToFirebase(known, total);
}

async function saveToFirebase(known, total) {
    if (window.MathQuestFirebase) {
        const endTime = Date.now();
        const timeSpent = Math.round((endTime - state.startTime) / 1000);
        const accuracy = total > 0 ? Math.round((known / total) * 100) : 0;

        try {
            await window.MathQuestFirebase.saveTrainerSession({
                trainerId: `flashcards-${state.currentSet}`,
                trainerName: `Флеш-картки: ${state.currentSetName}`,
                score: known,
                totalQuestions: total,
                difficulty: 1,
                accuracy: accuracy,
                maxStreak: known,
                timeSpent: timeSpent
            });
            console.log('Session saved to Firebase');
        } catch (error) {
            console.error('Error saving to Firebase:', error);
        }
    }
}

function reviewLearning() {
    // Filter only learning cards
    const learningCards = [];
    state.learning.forEach(index => {
        if (state.cards[index]) {
            learningCards.push(state.cards[index]);
        }
    });

    if (learningCards.length === 0) return;

    state.cards = learningCards;
    state.currentIndex = 0;
    state.known = new Set();
    state.learning = new Set();

    shuffleArray(state.cards);
    document.getElementById('totalCards').textContent = state.cards.length;

    showScreen('cards');
    displayCard();
}

function restartSet() {
    if (state.currentSet) {
        startSet(state.currentSet);
    }
}

function saveProgress() {
    try {
        const progress = {
            sets: {}
        };

        Object.keys(FLASH_CARDS).forEach(key => {
            const stored = localStorage.getItem(`flashcards_${key}`);
            if (stored) {
                progress.sets[key] = JSON.parse(stored);
            }
        });

        if (state.currentSet) {
            progress.sets[state.currentSet] = {
                known: Array.from(state.known),
                learning: Array.from(state.learning),
                lastPlayed: Date.now()
            };
        }

        Object.entries(progress.sets).forEach(([key, data]) => {
            localStorage.setItem(`flashcards_${key}`, JSON.stringify(data));
        });
    } catch (e) {
        console.log('Could not save progress');
    }
}

function loadProgress() {
    try {
        const nmtFilter = localStorage.getItem('flashcards_nmt_only');
        if (nmtFilter) {
            state.nmtOnly = nmtFilter === 'true';
            document.getElementById('nmtOnlyFilter').checked = state.nmtOnly;
        }
    } catch (e) {
        console.log('Could not load progress');
    }
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
