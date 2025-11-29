"""
Flask API for Math Trainer
- AI Hints with caching
- Progress tracking
- GPT-4o integration

Deploy to PythonAnywhere /home/marko17/mysite/flask_app.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import hashlib
import json
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# OpenAI setup
openai.api_key = os.environ.get('OPENAI_API_KEY')  # Set in PythonAnywhere environment

# In-memory cache for hints
hint_cache = {}
CACHE_TTL = 3600 * 24  # 24 hours

# Topic-specific system prompts
TOPIC_PROMPTS = {
    'percent': """Ти - репетитор з математики. Допомагаєш учню розв'язувати задачі на відсотки.
Дай коротку, зрозумілу підказку українською мовою.
- Поясни метод розв'язання (пропорція, формула або десятковий дріб)
- НЕ давай повну відповідь, лише наводь на правильний шлях
- Використовуй прості приклади якщо потрібно
- Максимум 3-4 речення""",

    'powers': """Ти - репетитор з математики. Допомагаєш учню зі степенями.
Дай коротку підказку українською:
- Вкажи яке правило степенів застосувати
- Покажи перший крок
- НЕ давай повну відповідь
- Максимум 3-4 речення""",

    'parity': """Ти - репетитор з математики. Допомагаєш визначити парність функції.
Коротка підказка українською:
- Нагадай визначення парної/непарної функції
- Підкажи як перевірити f(-x)
- НЕ давай відповідь напряму
- Максимум 3-4 речення""",

    'quadratic': """Ти - репетитор з математики. Допомагаєш з квадратними рівняннями.
Коротка підказка українською:
- Вкажи який метод використати (дискримінант, Вієта, розклад)
- Покажи перший крок
- НЕ давай повну відповідь
- Максимум 3-4 речення""",

    'triangle': """Ти - репетитор з математики. Допомагаєш з прямокутними трикутниками.
Коротка підказка українською:
- Вкажи яку теорему або формулу використати
- Нагадай співвідношення сторін якщо потрібно
- НЕ давай повну відповідь
- Максимум 3-4 речення""",

    'default': """Ти - репетитор з математики. Дай коротку підказку українською мовою.
- Поясни метод розв'язання
- НЕ давай повну відповідь
- Максимум 3-4 речення"""
}


def get_cache_key(topic, question, level):
    """Generate cache key from request parameters"""
    data = f"{topic}:{level}:{question.lower().strip()}"
    return hashlib.md5(data.encode()).hexdigest()


def get_cached_hint(cache_key):
    """Get hint from cache if not expired"""
    if cache_key in hint_cache:
        entry = hint_cache[cache_key]
        if datetime.now() < entry['expires']:
            return entry['hint']
    return None


def cache_hint(cache_key, hint):
    """Store hint in cache"""
    hint_cache[cache_key] = {
        'hint': hint,
        'expires': datetime.now() + timedelta(seconds=CACHE_TTL)
    }


@app.route('/api/hint', methods=['POST', 'OPTIONS'])
def get_hint():
    """Get AI-generated hint for a math problem"""
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()
        topic = data.get('topic', 'default')
        question = data.get('question', '')
        level = data.get('level', 1)
        context = data.get('context', {})

        if not question:
            return jsonify({'error': 'Question is required'}), 400

        # Check cache first
        cache_key = get_cache_key(topic, question, level)
        cached = get_cached_hint(cache_key)
        if cached:
            return jsonify({'hint': cached, 'cached': True})

        # Get system prompt for topic
        system_prompt = TOPIC_PROMPTS.get(topic, TOPIC_PROMPTS['default'])

        # Build user message
        user_message = f"Питання (рівень {level}): {question}"
        if context:
            user_message += f"\nКонтекст: {json.dumps(context, ensure_ascii=False)}"

        # Call OpenAI
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=200,
                temperature=0.7
            )
            hint = response.choices[0].message.content.strip()
        except Exception as e:
            # Fallback hints
            fallback_hints = {
                'percent': 'Пам\'ятай: відсоток - це частина від 100. Формула: A × p ÷ 100',
                'powers': 'Згадай правила: aⁿ × aᵐ = aⁿ⁺ᵐ, aⁿ ÷ aᵐ = aⁿ⁻ᵐ, (aⁿ)ᵐ = aⁿᵐ',
                'parity': 'Підстав -x замість x. Парна: f(-x)=f(x), Непарна: f(-x)=-f(x)',
                'quadratic': 'Використай дискримінант D = b² - 4ac або теорему Вієта',
                'triangle': 'Згадай теорему Піфагора та тригонометричні співвідношення',
                'default': 'Уважно прочитай умову та застосуй відповідну формулу'
            }
            hint = fallback_hints.get(topic, fallback_hints['default'])

        # Cache the result
        cache_hint(cache_key, hint)

        return jsonify({'hint': hint, 'cached': False})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/explain', methods=['POST', 'OPTIONS'])
def get_explanation():
    """Get detailed explanation for a solved problem"""
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()
        topic = data.get('topic', 'math')
        question = data.get('question', '')
        answer = data.get('answer', '')
        user_answer = data.get('user_answer', '')

        system_prompt = """Ти - репетитор з математики. Поясни розв'язання задачі українською.
- Покажи покроковий розв'язок
- Поясни чому саме така відповідь
- Якщо учень помилився, поясни де помилка
- Використовуй простий, зрозумілий стиль"""

        user_message = f"""Задача: {question}
Правильна відповідь: {answer}
Відповідь учня: {user_answer}

Поясни розв'язання та вкажи на помилку якщо є."""

        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=400,
            temperature=0.7
        )

        explanation = response.choices[0].message.content.strip()
        return jsonify({'explanation': explanation})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'cache_size': len(hint_cache),
        'timestamp': datetime.now().isoformat()
    })


# For PythonAnywhere WSGI
application = app

if __name__ == '__main__':
    app.run(debug=True)
