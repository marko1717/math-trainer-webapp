/* ===================================
   MATH QUEST - AI HELPER COMPONENT
   =================================== */

class AIHelper {
    constructor(options = {}) {
        this.apiEndpoint = options.apiEndpoint || null;
        this.language = options.language || 'uk';
        this.maxTokens = options.maxTokens || 500;

        this.isOpen = false;
        this.isLoading = false;
        this.modal = null;

        this.init();
    }

    init() {
        // Create modal if not exists
        if (!document.getElementById('aiHelperModal')) {
            this.createModal();
        }
        this.modal = document.getElementById('aiHelperModal');
    }

    createModal() {
        const modalHtml = `
            <div id="aiHelperModal" class="ai-modal hidden">
                <div class="ai-modal-content">
                    <div class="ai-modal-header">
                        <div class="ai-modal-title">
                            <span>🤖</span>
                            <span>Допомога ШІ</span>
                        </div>
                        <button class="ai-close-btn" id="aiCloseBtn">&times;</button>
                    </div>
                    <div class="ai-modal-body" id="aiModalBody">
                        <div class="ai-loading" id="aiLoading">
                            <div class="ai-loading-spinner"></div>
                            <span>Думаю...</span>
                        </div>
                        <div class="ai-response" id="aiResponse"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Add event listeners
        document.getElementById('aiCloseBtn').addEventListener('click', () => this.close());
        document.getElementById('aiHelperModal').addEventListener('click', (e) => {
            if (e.target.id === 'aiHelperModal') this.close();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
    }

    open() {
        this.isOpen = true;
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    showLoading() {
        this.isLoading = true;
        document.getElementById('aiLoading').style.display = 'flex';
        document.getElementById('aiResponse').style.display = 'none';
    }

    hideLoading() {
        this.isLoading = false;
        document.getElementById('aiLoading').style.display = 'none';
        document.getElementById('aiResponse').style.display = 'block';
    }

    setResponse(html) {
        document.getElementById('aiResponse').innerHTML = html;
        this.hideLoading();
    }

    // Get hint without giving away the answer
    async getHint(question, topic, difficulty = 'medium') {
        this.open();
        this.showLoading();

        const prompt = this.buildHintPrompt(question, topic, difficulty);

        try {
            const response = await this.callAI(prompt);
            this.setResponse(this.formatResponse(response));
        } catch (error) {
            console.error('AI Helper error:', error);
            this.setResponse(this.getFallbackHint(topic));
        }
    }

    // Explain solution after answer
    async explainSolution(question, correctAnswer, userAnswer, isCorrect) {
        this.open();
        this.showLoading();

        const prompt = this.buildExplanationPrompt(question, correctAnswer, userAnswer, isCorrect);

        try {
            const response = await this.callAI(prompt);
            this.setResponse(this.formatResponse(response));
        } catch (error) {
            console.error('AI Helper error:', error);
            this.setResponse(this.getFallbackExplanation(correctAnswer, isCorrect));
        }
    }

    // Show formula/theory
    showFormula(formulas, topic) {
        this.open();
        this.hideLoading();

        let html = `<div class="ai-formula-content">`;
        html += `<h3 style="color: var(--accent); margin-bottom: 1rem;">📐 ${topic}</h3>`;

        if (Array.isArray(formulas)) {
            formulas.forEach(f => {
                html += `
                    <div class="theory-card" style="margin-bottom: 1rem;">
                        <div class="formula-main">${f.formula}</div>
                        ${f.description ? `<div class="formula-note">${f.description}</div>` : ''}
                    </div>
                `;
            });
        } else {
            html += `<div class="theory-card"><div class="formula-main">${formulas}</div></div>`;
        }

        html += `</div>`;
        this.setResponse(html);
    }

    buildHintPrompt(question, topic, difficulty) {
        return `Ти - математичний репетитор для українських школярів.
Учень розв'язує задачу з теми "${topic}".

Задача: ${question}

Дай ПІДКАЗКУ, яка допоможе учневі самостійно знайти відповідь, але НЕ давай пряму відповідь.
Підказка має бути:
- Короткою (2-3 речення)
- Українською мовою
- Спрямовувати на правильний метод розв'язку
- Нагадати потрібну формулу якщо доречно

Рівень складності: ${difficulty}`;
    }

    buildExplanationPrompt(question, correctAnswer, userAnswer, isCorrect) {
        return `Ти - математичний репетитор для українських школярів.

Задача: ${question}
Правильна відповідь: ${correctAnswer}
Відповідь учня: ${userAnswer}
Результат: ${isCorrect ? 'Правильно' : 'Неправильно'}

${isCorrect
    ? 'Коротко похвали учня та поясни чому це правильно (2-3 речення).'
    : 'Поясни де помилка та як правильно розв\'язати (3-4 речення). Покажи хід розв\'язку.'
}

Відповідай українською мовою, дружньо та зрозуміло.`;
    }

    async callAI(prompt) {
        // If no API endpoint, use fallback
        if (!this.apiEndpoint) {
            return this.getLocalResponse(prompt);
        }

        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                maxTokens: this.maxTokens,
                language: this.language
            })
        });

        if (!response.ok) {
            throw new Error('AI API error');
        }

        const data = await response.json();
        return data.response || data.text || data.content;
    }

    getLocalResponse(prompt) {
        // Simulate delay for local responses
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(null);
            }, 500);
        });
    }

    formatResponse(response) {
        if (!response) {
            return '<p>Спробуй застосувати формулу крок за кроком. Якщо потрібна допомога - переглянь теорію.</p>';
        }

        // Convert markdown-like formatting to HTML
        let html = response
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        return `<p>${html}</p>`;
    }

    getFallbackHint(topic) {
        const hints = {
            'quadratic': `
                <p><strong>💡 Підказка:</strong></p>
                <p>Для квадратного рівняння ax² + bx + c = 0:</p>
                <ul style="margin-left: 1rem; margin-top: 0.5rem;">
                    <li>Визнач коефіцієнти a, b, c</li>
                    <li>Обчисли дискримінант D = b² - 4ac</li>
                    <li>Застосуй формулу коренів</li>
                </ul>
            `,
            'fsm': `
                <p><strong>💡 Підказка:</strong></p>
                <p>Пригадай формули скороченого множення:</p>
                <ul style="margin-left: 1rem; margin-top: 0.5rem;">
                    <li>(a + b)² = a² + 2ab + b²</li>
                    <li>(a - b)² = a² - 2ab + b²</li>
                    <li>a² - b² = (a-b)(a+b)</li>
                </ul>
            `,
            'arithmetic': `
                <p><strong>💡 Підказка:</strong></p>
                <p>Для арифметичної прогресії:</p>
                <ul style="margin-left: 1rem; margin-top: 0.5rem;">
                    <li>aₙ = a₁ + (n-1)d</li>
                    <li>Sₙ = (a₁ + aₙ)·n/2</li>
                </ul>
            `,
            'geometric': `
                <p><strong>💡 Підказка:</strong></p>
                <p>Для геометричної прогресії:</p>
                <ul style="margin-left: 1rem; margin-top: 0.5rem;">
                    <li>bₙ = b₁ · qⁿ⁻¹</li>
                    <li>Sₙ = b₁(qⁿ - 1)/(q - 1)</li>
                </ul>
            `,
            'default': `
                <p><strong>💡 Підказка:</strong></p>
                <p>Спробуй розбити задачу на кроки та застосувати відповідну формулу. Перевір свої обчислення уважно.</p>
            `
        };

        return hints[topic] || hints['default'];
    }

    getFallbackExplanation(correctAnswer, isCorrect) {
        if (isCorrect) {
            return `
                <p><strong>✅ Чудово!</strong></p>
                <p>Твоя відповідь правильна: <strong>${correctAnswer}</strong></p>
                <p>Продовжуй в тому ж дусі! 💪</p>
            `;
        } else {
            return `
                <p><strong>❌ Не зовсім так</strong></p>
                <p>Правильна відповідь: <strong>${correctAnswer}</strong></p>
                <p>Перевір свої обчислення та спробуй зрозуміти де сталася помилка. Не здавайся!</p>
            `;
        }
    }
}

// Export for use
window.AIHelper = AIHelper;
