// Onboarding / Tutorial System for Math Quest
// Shows highlighted tooltips for first-time users

(function() {
    const ONBOARDING_KEY = 'math_quest_onboarding_done';

    // Tutorial steps configuration
    const tutorialSteps = [
        {
            selector: '.trainer-card',
            title: 'Обери тренажер',
            text: 'Натисни на будь-який тренажер, щоб почати практику',
            position: 'bottom'
        },
        {
            selector: '.stats-bar',
            title: 'Твій прогрес',
            text: 'Тут відображається твоя статистика: бали, комбо та кількість пройдених тренажерів',
            position: 'bottom'
        },
        {
            selector: '.xp-bar',
            title: 'Рівень',
            text: 'Розв\'язуй задачі, щоб підвищувати рівень!',
            position: 'bottom'
        },
        {
            selector: '.settings-toggle',
            title: 'Налаштування',
            text: 'Увімкни ретро-режим для 8-бітного стилю гри',
            position: 'top'
        }
    ];

    // Create overlay element
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'onboarding-overlay';
        overlay.innerHTML = `
            <div class="onboarding-backdrop"></div>
            <div class="onboarding-highlight"></div>
            <div class="onboarding-tooltip">
                <div class="onboarding-title"></div>
                <div class="onboarding-text"></div>
                <div class="onboarding-actions">
                    <button class="onboarding-skip">Пропустити</button>
                    <button class="onboarding-next">Далі →</button>
                </div>
                <div class="onboarding-dots"></div>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    // Add styles
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .onboarding-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                pointer-events: none;
            }

            .onboarding-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.75);
                pointer-events: auto;
            }

            .onboarding-highlight {
                position: absolute;
                border-radius: 12px;
                box-shadow:
                    0 0 0 4px #EF8748,
                    0 0 0 9999px rgba(0, 0, 0, 0.75);
                transition: all 0.4s ease;
                pointer-events: none;
            }

            .onboarding-tooltip {
                position: absolute;
                background: #252542;
                border: 3px solid #EF8748;
                border-radius: 16px;
                padding: 20px;
                max-width: 300px;
                pointer-events: auto;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                animation: tooltipIn 0.3s ease;
            }

            @keyframes tooltipIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .onboarding-tooltip::before {
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                background: #252542;
                border: 3px solid #EF8748;
                border-right: none;
                border-bottom: none;
                transform: rotate(45deg);
            }

            .onboarding-tooltip.position-bottom::before {
                top: -10px;
                left: 30px;
            }

            .onboarding-tooltip.position-top::before {
                bottom: -10px;
                left: 30px;
                transform: rotate(-135deg);
            }

            .onboarding-title {
                font-size: 1.1rem;
                font-weight: 700;
                color: #EF8748;
                margin-bottom: 8px;
            }

            .onboarding-text {
                font-size: 0.9rem;
                color: #F5F0EC;
                line-height: 1.5;
                margin-bottom: 16px;
            }

            .onboarding-actions {
                display: flex;
                gap: 10px;
            }

            .onboarding-skip,
            .onboarding-next {
                flex: 1;
                padding: 10px 16px;
                border-radius: 8px;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                font-family: inherit;
            }

            .onboarding-skip {
                background: transparent;
                border: 2px solid #3a3a5a;
                color: #a09a96;
            }

            .onboarding-skip:hover {
                border-color: #EF8748;
                color: #F5F0EC;
            }

            .onboarding-next {
                background: #EF8748;
                border: 2px solid #DB9063;
                color: #1a1a2e;
            }

            .onboarding-next:hover {
                background: #f5a06a;
                transform: translateY(-2px);
            }

            .onboarding-dots {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-top: 16px;
            }

            .onboarding-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #3a3a5a;
                transition: all 0.3s ease;
            }

            .onboarding-dot.active {
                background: #EF8748;
                transform: scale(1.2);
            }

            /* Retro mode styles */
            body.retro-mode .onboarding-highlight {
                border-radius: 0;
            }

            body.retro-mode .onboarding-tooltip {
                border-radius: 0;
                border-width: 4px;
                font-family: 'Press Start 2P', monospace;
            }

            body.retro-mode .onboarding-title {
                font-size: 0.6rem;
            }

            body.retro-mode .onboarding-text {
                font-size: 0.45rem;
                line-height: 1.8;
            }

            body.retro-mode .onboarding-skip,
            body.retro-mode .onboarding-next {
                font-size: 0.4rem;
                border-radius: 0;
            }

            body.retro-mode .onboarding-dot {
                border-radius: 0;
            }
        `;
        document.head.appendChild(style);
    }

    // Show specific step
    function showStep(overlay, stepIndex, steps) {
        const step = steps[stepIndex];
        const element = document.querySelector(step.selector);

        if (!element) {
            // Skip if element not found
            if (stepIndex < steps.length - 1) {
                showStep(overlay, stepIndex + 1, steps);
            } else {
                finishOnboarding(overlay);
            }
            return;
        }

        const rect = element.getBoundingClientRect();
        const highlight = overlay.querySelector('.onboarding-highlight');
        const tooltip = overlay.querySelector('.onboarding-tooltip');
        const title = overlay.querySelector('.onboarding-title');
        const text = overlay.querySelector('.onboarding-text');
        const nextBtn = overlay.querySelector('.onboarding-next');
        const skipBtn = overlay.querySelector('.onboarding-skip');
        const dotsContainer = overlay.querySelector('.onboarding-dots');

        // Position highlight
        const padding = 8;
        highlight.style.top = (rect.top - padding) + 'px';
        highlight.style.left = (rect.left - padding) + 'px';
        highlight.style.width = (rect.width + padding * 2) + 'px';
        highlight.style.height = (rect.height + padding * 2) + 'px';

        // Update tooltip content
        title.textContent = step.title;
        text.textContent = step.text;

        // Position tooltip
        tooltip.className = 'onboarding-tooltip position-' + step.position;
        if (step.position === 'bottom') {
            tooltip.style.top = (rect.bottom + 20) + 'px';
            tooltip.style.bottom = 'auto';
        } else {
            tooltip.style.bottom = (window.innerHeight - rect.top + 20) + 'px';
            tooltip.style.top = 'auto';
        }
        tooltip.style.left = Math.max(16, Math.min(rect.left, window.innerWidth - 320)) + 'px';

        // Update dots
        dotsContainer.innerHTML = steps.map((_, i) =>
            `<div class="onboarding-dot ${i === stepIndex ? 'active' : ''}"></div>`
        ).join('');

        // Update button text
        nextBtn.textContent = stepIndex === steps.length - 1 ? 'Готово!' : 'Далі →';

        // Button handlers
        nextBtn.onclick = () => {
            if (stepIndex < steps.length - 1) {
                showStep(overlay, stepIndex + 1, steps);
            } else {
                finishOnboarding(overlay);
            }
        };

        skipBtn.onclick = () => finishOnboarding(overlay);
    }

    // Finish onboarding
    function finishOnboarding(overlay) {
        localStorage.setItem(ONBOARDING_KEY, 'true');
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        setTimeout(() => overlay.remove(), 300);
    }

    // Start onboarding
    function startOnboarding() {
        // Check if already done
        if (localStorage.getItem(ONBOARDING_KEY)) {
            return;
        }

        // Only run on main page
        if (!document.querySelector('.trainer-grid')) {
            return;
        }

        // Wait for page to be fully loaded
        setTimeout(() => {
            addStyles();
            const overlay = createOverlay();
            showStep(overlay, 0, tutorialSteps);
        }, 500);
    }

    // Export for manual trigger
    window.showOnboarding = function() {
        localStorage.removeItem(ONBOARDING_KEY);
        addStyles();
        const overlay = createOverlay();
        showStep(overlay, 0, tutorialSteps);
    };

    // Auto-start on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startOnboarding);
    } else {
        startOnboarding();
    }
})();
