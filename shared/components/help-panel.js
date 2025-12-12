/* ===================================
   MATH QUEST - HELP PANEL COMPONENT
   =================================== */

class HelpPanel {
    constructor(options = {}) {
        this.showHint = options.showHint !== false;
        this.showAI = options.showAI !== false;
        this.showFormula = options.showFormula !== false;

        this.onHintClick = options.onHintClick || null;
        this.onAIClick = options.onAIClick || null;
        this.onFormulaClick = options.onFormulaClick || null;

        this.aiHelper = null;
        this.container = null;
        this.currentQuestion = null;
        this.currentTopic = null;

        // Initialize AI Helper
        if (this.showAI && window.AIHelper) {
            this.aiHelper = new AIHelper(options.aiOptions || {});
        }
    }

    render(containerId = 'helpPanel') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Help panel container not found:', containerId);
            return;
        }

        let html = '<div class="help-panel">';

        if (this.showHint) {
            html += `
                <button class="help-btn" id="hintBtn">
                    <span>💡</span>
                    <span>Підказка</span>
                </button>
            `;
        }

        if (this.showAI) {
            html += `
                <button class="help-btn help-btn-ai" id="aiHelpBtn">
                    <span>🤖</span>
                    <span>Допомога ШІ</span>
                </button>
            `;
        }

        if (this.showFormula) {
            html += `
                <button class="help-btn" id="formulaBtn">
                    <span>📐</span>
                    <span>Формула</span>
                </button>
            `;
        }

        html += '</div>';
        this.container.innerHTML = html;

        this.attachEvents();
    }

    attachEvents() {
        if (this.showHint) {
            const hintBtn = document.getElementById('hintBtn');
            if (hintBtn) {
                hintBtn.addEventListener('click', () => this.handleHintClick());
            }
        }

        if (this.showAI) {
            const aiBtn = document.getElementById('aiHelpBtn');
            if (aiBtn) {
                aiBtn.addEventListener('click', () => this.handleAIClick());
            }
        }

        if (this.showFormula) {
            const formulaBtn = document.getElementById('formulaBtn');
            if (formulaBtn) {
                formulaBtn.addEventListener('click', () => this.handleFormulaClick());
            }
        }
    }

    setQuestion(question, topic) {
        this.currentQuestion = question;
        this.currentTopic = topic;
    }

    handleHintClick() {
        if (this.onHintClick) {
            this.onHintClick(this.currentQuestion, this.currentTopic);
        } else if (this.aiHelper) {
            this.aiHelper.getHint(this.currentQuestion, this.currentTopic);
        }
    }

    handleAIClick() {
        if (this.onAIClick) {
            this.onAIClick(this.currentQuestion, this.currentTopic);
        } else if (this.aiHelper) {
            this.aiHelper.getHint(this.currentQuestion, this.currentTopic);
        }
    }

    handleFormulaClick() {
        if (this.onFormulaClick) {
            this.onFormulaClick(this.currentTopic);
        } else if (this.aiHelper) {
            this.showDefaultFormula();
        }
    }

    showDefaultFormula() {
        const formulas = this.getFormulasForTopic(this.currentTopic);
        if (this.aiHelper && formulas) {
            this.aiHelper.showFormula(formulas, this.currentTopic);
        }
    }

    getFormulasForTopic(topic) {
        const formulaBank = {
            'quadratic': [
                { formula: 'ax² + bx + c = 0', description: 'Загальний вигляд' },
                { formula: 'D = b² - 4ac', description: 'Дискримінант' },
                { formula: 'x = (-b ± √D) / 2a', description: 'Формула коренів' },
                { formula: 'x₁ + x₂ = -b/a', description: 'Теорема Вієта (сума)' },
                { formula: 'x₁ · x₂ = c/a', description: 'Теорема Вієта (добуток)' }
            ],
            'fsm': [
                { formula: '(a + b)² = a² + 2ab + b²', description: 'Квадрат суми' },
                { formula: '(a - b)² = a² - 2ab + b²', description: 'Квадрат різниці' },
                { formula: 'a² - b² = (a-b)(a+b)', description: 'Різниця квадратів' },
                { formula: '(a + b)³ = a³ + 3a²b + 3ab² + b³', description: 'Куб суми' },
                { formula: '(a - b)³ = a³ - 3a²b + 3ab² - b³', description: 'Куб різниці' },
                { formula: 'a³ + b³ = (a+b)(a²-ab+b²)', description: 'Сума кубів' },
                { formula: 'a³ - b³ = (a-b)(a²+ab+b²)', description: 'Різниця кубів' }
            ],
            'arithmetic': [
                { formula: 'aₙ = a₁ + (n-1)d', description: 'n-й член прогресії' },
                { formula: 'd = aₙ - aₙ₋₁', description: 'Різниця прогресії' },
                { formula: 'Sₙ = (a₁ + aₙ)·n/2', description: 'Сума n членів' },
                { formula: 'Sₙ = (2a₁ + (n-1)d)·n/2', description: 'Сума через a₁ і d' }
            ],
            'geometric': [
                { formula: 'bₙ = b₁ · qⁿ⁻¹', description: 'n-й член прогресії' },
                { formula: 'q = bₙ / bₙ₋₁', description: 'Знаменник прогресії' },
                { formula: 'Sₙ = b₁(qⁿ - 1)/(q - 1)', description: 'Сума n членів (q ≠ 1)' },
                { formula: 'S = b₁/(1 - q)', description: 'Сума нескінч. (|q| < 1)' }
            ],
            'powers': [
                { formula: 'aᵐ · aⁿ = aᵐ⁺ⁿ', description: 'Множення степенів' },
                { formula: 'aᵐ / aⁿ = aᵐ⁻ⁿ', description: 'Ділення степенів' },
                { formula: '(aᵐ)ⁿ = aᵐⁿ', description: 'Піднесення до степеня' },
                { formula: 'a⁰ = 1', description: 'Нульовий степінь' },
                { formula: 'a⁻ⁿ = 1/aⁿ', description: 'Від\'ємний степінь' }
            ],
            'percent': [
                { formula: 'p% від A = A · p/100', description: 'Знайти відсоток' },
                { formula: 'A = B · 100/p', description: 'Знайти число за відсотком' },
                { formula: 'p = (B/A) · 100%', description: 'Знайти відсоткове відношення' }
            ],
            'parity': [
                { formula: 'Парне + Парне = Парне', description: '' },
                { formula: 'Непарне + Непарне = Парне', description: '' },
                { formula: 'Парне + Непарне = Непарне', description: '' },
                { formula: 'Парне × Будь-яке = Парне', description: '' },
                { formula: 'Непарне × Непарне = Непарне', description: '' }
            ],
            'triangle': [
                { formula: 'a² + b² = c²', description: 'Теорема Піфагора' },
                { formula: 'S = (a·h)/2', description: 'Площа трикутника' },
                { formula: 'α + β + γ = 180°', description: 'Сума кутів' },
                { formula: 'a/sin α = b/sin β = c/sin γ', description: 'Теорема синусів' }
            ]
        };

        return formulaBank[topic] || [
            { formula: 'Формула не знайдена', description: 'Перегляньте теорію' }
        ];
    }

    // Show explanation after answer
    showExplanation(correctAnswer, userAnswer, isCorrect) {
        if (this.aiHelper) {
            this.aiHelper.explainSolution(
                this.currentQuestion,
                correctAnswer,
                userAnswer,
                isCorrect
            );
        }
    }

    // Enable/disable buttons
    setEnabled(enabled) {
        const buttons = this.container?.querySelectorAll('.help-btn');
        buttons?.forEach(btn => {
            btn.disabled = !enabled;
            btn.style.opacity = enabled ? '1' : '0.5';
        });
    }
}

// Export for use
window.HelpPanel = HelpPanel;
