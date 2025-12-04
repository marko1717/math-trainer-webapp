// AI Hints System with Caching
// Shared module for all trainers

const AI_API_URL = 'https://marko17.pythonanywhere.com/api/hint';

// Convert LaTeX to readable Unicode text
function latexToUnicode(text) {
    if (!text) return text;

    // Subscripts
    const subscripts = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
        '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
        'n': 'ₙ', 'm': 'ₘ', 'k': 'ₖ', 'i': 'ᵢ', 'j': 'ⱼ',
        'a': 'ₐ', 'e': 'ₑ', 'o': 'ₒ', 'x': 'ₓ', 'h': 'ₕ',
        '+': '₊', '-': '₋', '(': '₍', ')': '₎'
    };

    // Superscripts
    const superscripts = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        'n': 'ⁿ', 'm': 'ᵐ', 'k': 'ᵏ', 'i': 'ⁱ', 'j': 'ʲ',
        'x': 'ˣ', 'y': 'ʸ', 'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ',
        '+': '⁺', '-': '⁻', '(': '⁽', ')': '⁾'
    };

    // Greek letters
    const greek = {
        'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'δ',
        'epsilon': 'ε', 'pi': 'π', 'sigma': 'σ', 'theta': 'θ',
        'lambda': 'λ', 'mu': 'μ', 'phi': 'φ', 'omega': 'ω'
    };

    let result = text;

    // Remove \( \) and $ $ delimiters
    result = result.replace(/\\\(|\\\)|\$\$/g, '');
    result = result.replace(/\$/g, '');

    // Handle fractions: \frac{a}{b} -> a/b
    result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');

    // Handle sqrt: \sqrt{x} -> √x
    result = result.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
    result = result.replace(/\\sqrt\s*(\w)/g, '√$1');

    // Handle subscripts: a_{n} -> aₙ, a_n -> aₙ
    result = result.replace(/([a-zA-Z])_\{([^}]+)\}/g, (match, base, sub) => {
        const subConverted = sub.split('').map(c => subscripts[c] || c).join('');
        return base + subConverted;
    });
    result = result.replace(/([a-zA-Z])_([a-zA-Z0-9])/g, (match, base, sub) => {
        return base + (subscripts[sub] || sub);
    });

    // Handle superscripts: a^{n} -> aⁿ, a^n -> aⁿ
    result = result.replace(/([a-zA-Z0-9])\\?\^\{([^}]+)\}/g, (match, base, sup) => {
        const supConverted = sup.split('').map(c => superscripts[c] || c).join('');
        return base + supConverted;
    });
    result = result.replace(/([a-zA-Z0-9])\^([a-zA-Z0-9])/g, (match, base, sup) => {
        return base + (superscripts[sup] || sup);
    });

    // Greek letters
    for (const [latex, unicode] of Object.entries(greek)) {
        result = result.replace(new RegExp('\\\\' + latex, 'g'), unicode);
    }

    // Common symbols
    result = result.replace(/\\times/g, '×');
    result = result.replace(/\\cdot/g, '·');
    result = result.replace(/\\div/g, '÷');
    result = result.replace(/\\pm/g, '±');
    result = result.replace(/\\mp/g, '∓');
    result = result.replace(/\\leq/g, '≤');
    result = result.replace(/\\geq/g, '≥');
    result = result.replace(/\\neq/g, '≠');
    result = result.replace(/\\approx/g, '≈');
    result = result.replace(/\\infty/g, '∞');
    result = result.replace(/\\sum/g, 'Σ');
    result = result.replace(/\\prod/g, 'Π');
    result = result.replace(/\\rightarrow/g, '→');
    result = result.replace(/\\leftarrow/g, '←');
    result = result.replace(/\\Rightarrow/g, '⇒');
    result = result.replace(/\\in/g, '∈');

    // Clean up remaining backslashes and braces
    result = result.replace(/\\[a-zA-Z]+/g, ''); // Remove unknown commands
    result = result.replace(/[{}]/g, ''); // Remove remaining braces
    result = result.replace(/\s+/g, ' '); // Normalize spaces

    return result.trim();
}

// Cache for hints (in-memory + localStorage)
const hintCache = new Map();
const CACHE_KEY = 'ai_hints_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Load cache from localStorage
function loadCache() {
    try {
        const stored = localStorage.getItem(CACHE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            const now = Date.now();

            // Filter out expired entries
            Object.entries(data).forEach(([key, entry]) => {
                if (now - entry.timestamp < CACHE_EXPIRY) {
                    hintCache.set(key, entry.hint);
                }
            });
        }
    } catch (e) {
        console.log('Could not load hint cache');
    }
}

// Save cache to localStorage
function saveCache() {
    try {
        const data = {};
        hintCache.forEach((hint, key) => {
            data[key] = { hint, timestamp: Date.now() };
        });
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) {
        console.log('Could not save hint cache');
    }
}

// Generate cache key from question data
function getCacheKey(topic, questionText, level) {
    // Normalize the question text for better cache hits
    const normalized = questionText
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
    return `${topic}_${level}_${normalized}`;
}

// Get hint with caching
async function getAIHint(topic, questionText, level, context = {}) {
    const cacheKey = getCacheKey(topic, questionText, level);

    // Check cache first
    if (hintCache.has(cacheKey)) {
        return {
            hint: hintCache.get(cacheKey),
            fromCache: true
        };
    }

    // Build request
    const requestBody = {
        topic,
        question: questionText,
        level,
        ...context
    };

    try {
        const response = await fetch(AI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            const data = await response.json();
            // Convert LaTeX to Unicode for readable display
            const hint = latexToUnicode(data.hint);

            // Cache the result
            hintCache.set(cacheKey, hint);
            saveCache();

            return { hint, fromCache: false };
        } else {
            throw new Error('API error');
        }
    } catch (e) {
        console.error('AI hint error:', e);

        // Return fallback hint
        return {
            hint: getFallbackHint(topic, context),
            fromCache: false,
            error: true
        };
    }
}

// Fallback hints when API is unavailable
function getFallbackHint(topic, context) {
    const fallbacks = {
        percent: `Пам'ятай: відсоток - це частина від 100.
Щоб знайти p% від числа A: A × p ÷ 100
Щоб знайти яким % є B від A: B ÷ A × 100`,

        powers: `Основні правила степенів:
• aⁿ × aᵐ = aⁿ⁺ᵐ
• aⁿ ÷ aᵐ = aⁿ⁻ᵐ
• (aⁿ)ᵐ = aⁿ×ᵐ
• a⁰ = 1 (a ≠ 0)
• a⁻ⁿ = 1/aⁿ`,

        parity: `Парна функція: f(-x) = f(x)
Графік симетричний відносно осі OY

Непарна функція: f(-x) = -f(x)
Графік симетричний відносно початку координат`,

        quadratic: `Дискримінант: D = b² - 4ac
• D > 0: два корені
• D = 0: один корінь
• D < 0: немає коренів

Формула коренів: x = (-b ± √D) / 2a`,

        triangle: `Прямокутний трикутник:
• Теорема Піфагора: a² + b² = c²
• sin α = протилежний / гіпотенуза
• cos α = прилеглий / гіпотенуза
• tg α = протилежний / прилеглий`,

        arithmetic_progression: `Арифметична прогресія:
• Різниця: d = aₙ₊₁ − aₙ
• n-й член: aₙ = a₁ + (n−1)·d
• Сума: Sₙ = (a₁ + aₙ)·n/2
• Середнє: aₙ = (aₙ₋₁ + aₙ₊₁)/2`,

        geometric_progression: `Геометрична прогресія:
• Знаменник: q = bₙ₊₁/bₙ
• n-й член: bₙ = b₁·qⁿ⁻¹
• Сума: Sₙ = b₁·(qⁿ−1)/(q−1)
• Середнє геом.: bₙ = √(bₙ₋₁·bₙ₊₁)`,

        default: 'Уважно прочитай умову та згадай відповідну формулу. Спробуй підставити відомі значення.'
    };

    return fallbacks[topic] || fallbacks.default;
}

// Show hint in UI
async function showHintInUI(hintBtn, hintContainer, hintLoading, hintText, topic, question, level, context = {}) {
    hintBtn.disabled = true;
    hintContainer.classList.add('show');
    hintLoading.classList.remove('hidden');
    hintText.textContent = '';

    const result = await getAIHint(topic, question, level, context);

    hintLoading.classList.add('hidden');
    hintText.textContent = result.hint;

    if (result.fromCache) {
        // Add subtle indicator that this is cached
        hintText.innerHTML += '<br><small style="opacity: 0.5">💾 з кешу</small>';
    }
}

// Initialize cache on load
loadCache();

// Export for use in trainers
window.AIHints = {
    getHint: getAIHint,
    showInUI: showHintInUI,
    getFallback: getFallbackHint,
    latexToUnicode: latexToUnicode
};
