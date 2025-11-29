// AI Hints System with Caching
// Shared module for all trainers

const AI_API_URL = 'https://marko17.pythonanywhere.com/api/hint';

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
            const hint = data.hint;

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
    getFallback: getFallbackHint
};
