/* ===================================
   MATH QUEST - TRAINER HEADER COMPONENT
   =================================== */

class TrainerHeader {
    constructor(options = {}) {
        this.title = options.title || 'Тренажер';
        this.backUrl = options.backUrl || '../index.html';
        this.showLevel = options.showLevel !== false;
        this.showStreak = options.showStreak !== false;
        this.showScore = options.showScore !== false;

        this.level = 1;
        this.streak = 0;
        this.correct = 0;
        this.total = 0;

        this.container = null;
    }

    render(containerId = 'header') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Header container not found:', containerId);
            return;
        }

        this.container.innerHTML = `
            <div class="trainer-header">
                <div class="header-left">
                    <a href="${this.backUrl}" class="back-btn">← Меню</a>
                </div>
                <div class="header-center">
                    <h1 class="trainer-title">${this.title}</h1>
                </div>
                <div class="header-right">
                    ${this.showStreak ? `
                        <div class="streak-counter">
                            <span class="streak-icon">🔥</span>
                            <span class="streak-number" id="headerStreak">${this.streak}</span>
                        </div>
                    ` : ''}
                    ${this.showLevel ? `
                        <span class="level-badge" id="headerLevel">Рівень ${this.level}</span>
                    ` : ''}
                </div>
            </div>
            ${this.showScore ? `
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" id="headerProgressFill" style="width: 0%"></div>
                    </div>
                    <div class="progress-text">
                        <span id="headerCorrect">${this.correct}</span> / <span id="headerTotal">${this.total}</span> правильно
                    </div>
                </div>
            ` : ''}
        `;

        // Add header class to container
        this.container.classList.add('trainer-header-wrapper');
    }

    setLevel(level) {
        this.level = level;
        const el = document.getElementById('headerLevel');
        if (el) el.textContent = `Рівень ${level}`;
    }

    setStreak(streak) {
        this.streak = streak;
        const el = document.getElementById('headerStreak');
        if (el) el.textContent = streak;
    }

    setScore(correct, total) {
        this.correct = correct;
        this.total = total;

        const correctEl = document.getElementById('headerCorrect');
        const totalEl = document.getElementById('headerTotal');
        const fillEl = document.getElementById('headerProgressFill');

        if (correctEl) correctEl.textContent = correct;
        if (totalEl) totalEl.textContent = total;
        if (fillEl && total > 0) {
            fillEl.style.width = `${(correct / total) * 100}%`;
        }
    }

    setTitle(title) {
        this.title = title;
        const el = this.container?.querySelector('.trainer-title');
        if (el) el.textContent = title;
    }
}

// Export for use
window.TrainerHeader = TrainerHeader;

// Auto-initialize if data attributes present
document.addEventListener('DOMContentLoaded', () => {
    const headerEl = document.querySelector('[data-trainer-header]');
    if (headerEl) {
        const options = {
            title: headerEl.dataset.title,
            backUrl: headerEl.dataset.backUrl,
            showLevel: headerEl.dataset.showLevel !== 'false',
            showStreak: headerEl.dataset.showStreak !== 'false',
            showScore: headerEl.dataset.showScore !== 'false'
        };
        const header = new TrainerHeader(options);
        header.render(headerEl.id || 'header');
        window.trainerHeader = header;
    }
});
