#!/usr/bin/env python3
"""
Telegram Auto-Poster for PythonAnywhere

Цей скрипт публікує контент в Telegram канал за розкладом.
Підтримує теорію, практику, опитування з картинками та поясненнями.

Використання:
    python telegram_autopost.py --auto          # Автопост залежно від часу
    python telegram_autopost.py --theory        # Публікація теорії
    python telegram_autopost.py --quiz          # Текстове опитування
    python telegram_autopost.py --practice      # Завдання з картинкою
    python telegram_autopost.py --explained     # Завдання з розв'язком
    python telegram_autopost.py --daily         # Щоденний челендж
    python telegram_autopost.py --test          # Тестовий режим

Налаштування cron на PythonAnywhere:
    - Tasks -> Scheduled Tasks
    - Додати: python3 /home/marko17/tools/telegram_autopost.py --auto
    - Час: кожні 3 години (8:00, 11:00, 14:00, 17:00, 20:00)
"""

import os
import sys
import json
import random
import re
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.parse import urlencode
from urllib.error import URLError, HTTPError

# Configuration
BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '8196154557:AAFPjzLPWN834f98lp4x7gJ59L7Azs9xknI')
CHANNEL_ID = os.environ.get('TELEGRAM_CHANNEL_ID', '@pvtr2525')
DATA_PATH = os.path.dirname(os.path.abspath(__file__))
NMT_DATA_PATH = os.path.join(DATA_PATH, '../www/nmt-trainer/nmt_data.json')
CLASSTIME_DATA_PATH = os.path.join(DATA_PATH, '../www/nmt-trainer/classtime_data.json')
TEST_MODE = '--test' in sys.argv

# Theory topics
THEORY_TOPICS = [
    {
        'title': 'Теорема Піфагора',
        'emoji': '📐',
        'formula': 'a² + b² = c²',
        'explanation': 'У прямокутному трикутнику квадрат гіпотенузи дорівнює сумі квадратів катетів.',
        'example': '3² + 4² = 5² → 9 + 16 = 25 ✓',
        'hashtags': '#математика #теорема #піфагор'
    },
    {
        'title': 'Дискримінант',
        'emoji': '📈',
        'formula': 'D = b² - 4ac',
        'explanation': 'D > 0 → два корені\nD = 0 → один корінь\nD < 0 → немає коренів',
        'example': 'x² - 5x + 6 = 0\nD = 25 - 24 = 1 > 0',
        'hashtags': '#математика #дискримінант #рівняння'
    },
    {
        'title': 'sin²α + cos²α = 1',
        'emoji': '🔄',
        'formula': 'sin²α + cos²α = 1',
        'explanation': 'Основна тригонометрична тотожність.',
        'example': 'sin²30° + cos²30° = 1/4 + 3/4 = 1 ✓',
        'hashtags': '#математика #тригонометрія'
    },
    {
        'title': 'Логарифми',
        'emoji': '📊',
        'formula': 'log_a(b·c) = log_a(b) + log_a(c)',
        'explanation': 'Логарифм добутку = сума логарифмів.',
        'example': 'log₂(4·8) = log₂4 + log₂8 = 2 + 3 = 5',
        'hashtags': '#математика #логарифми'
    },
    {
        'title': 'Похідна',
        'emoji': '📉',
        'formula': "(x^n)' = n·x^(n-1)",
        'explanation': 'Основне правило диференціювання.',
        'example': "(x⁵)' = 5x⁴",
        'hashtags': '#математика #похідна'
    },
    {
        'title': 'Арифметична прогресія',
        'emoji': '📶',
        'formula': 'aₙ = a₁ + (n-1)·d',
        'explanation': 'n-й член АП = перший член + (n-1) × різниця.',
        'example': 'a₁ = 3, d = 2 → a₁₀ = 3 + 9·2 = 21',
        'hashtags': '#математика #прогресія'
    },
    {
        'title': 'Формули скороченого множення',
        'emoji': '✨',
        'formula': '(a ± b)² = a² ± 2ab + b²',
        'explanation': 'Квадрат суми/різниці.',
        'example': '(x + 3)² = x² + 6x + 9',
        'hashtags': '#математика #формули'
    }
]

# Quiz bank
QUIZ_BANK = [
    {'question': 'Чому дорівнює sin²30° + cos²30°?', 'options': ['0', '0.5', '1', '2'], 'correct': 2},
    {'question': 'log₂(8) = ?', 'options': ['2', '3', '4', '8'], 'correct': 1},
    {'question': 'Скільки коренів має x² + 1 = 0?', 'options': ['0', '1', '2', '∞'], 'correct': 0},
    {'question': '(a + b)² = ?', 'options': ['a² + b²', 'a² - b²', 'a² + 2ab + b²', '2ab'], 'correct': 2},
    {'question': "(x³)' = ?", 'options': ['x²', '3x', '3x²', 'x⁴/4'], 'correct': 2},
    {'question': 'Сума кутів трикутника:', 'options': ['90°', '180°', '270°', '360°'], 'correct': 1},
    {'question': 'Площа кола радіуса r:', 'options': ['2πr', 'πr²', 'πr', '4πr²'], 'correct': 1},
    {'question': 'Теорема Піфагора:', 'options': ['a+b=c', 'a²+b²=c²', 'ab=c²', 'a²-b²=c²'], 'correct': 1},
]

DAILY_CHALLENGES = [
    'Розв\'яжи 5 завдань на НМТ тренажері без помилок!',
    'Пройди весь тест на час - менше 30 хвилин!',
    'Вивчи тригонометричні формули подвійного кута',
    'Розв\'яжи 10 логарифмічних прикладів підряд',
    'Знайди 3 способи розв\'язати одну задачу',
]


def telegram_request(method, params=None):
    """Make a request to Telegram API."""
    url = f'https://api.telegram.org/bot{BOT_TOKEN}/{method}'

    if TEST_MODE:
        print(f'[TEST] Would call {method} with:')
        print(json.dumps(params, ensure_ascii=False, indent=2)[:500])
        return {'ok': True, 'test': True}

    try:
        data = json.dumps(params).encode('utf-8') if params else None
        req = Request(url, data=data, headers={'Content-Type': 'application/json'})
        response = urlopen(req, timeout=30)
        result = json.loads(response.read().decode('utf-8'))
        return result
    except (URLError, HTTPError) as e:
        print(f'Error: {e}')
        return {'ok': False, 'error': str(e)}


def send_message(text, parse_mode='HTML'):
    """Send a text message to the channel."""
    return telegram_request('sendMessage', {
        'chat_id': CHANNEL_ID,
        'text': text,
        'parse_mode': parse_mode
    })


def send_photo(photo_url, caption):
    """Send a photo with caption."""
    return telegram_request('sendPhoto', {
        'chat_id': CHANNEL_ID,
        'photo': photo_url,
        'caption': caption,
        'parse_mode': 'HTML'
    })


def send_poll(question, options, correct_index):
    """Send a quiz poll."""
    return telegram_request('sendPoll', {
        'chat_id': CHANNEL_ID,
        'question': question,
        'options': options,
        'type': 'quiz',
        'correct_option_id': correct_index,
        'is_anonymous': True
    })


def post_theory():
    """Post a random theory topic."""
    topic = random.choice(THEORY_TOPICS)

    text = f"""{topic['emoji']} <b>{topic['title']}</b>

<code>{topic['formula']}</code>

{topic['explanation']}

💡 <b>Приклад:</b>
<pre>{topic['example']}</pre>

{topic['hashtags']}"""

    result = send_message(text)
    if result.get('ok'):
        print(f"✓ Posted theory: {topic['title']}")
        return True
    print(f"✗ Failed: {result.get('error', 'Unknown error')}")
    return False


def post_quiz():
    """Post a random quiz poll."""
    quiz = random.choice(QUIZ_BANK)

    result = send_poll(quiz['question'], quiz['options'], quiz['correct'])
    if result.get('ok'):
        print(f"✓ Posted quiz: {quiz['question']}")
        return True
    print(f"✗ Failed: {result.get('error', 'Unknown error')}")
    return False


def post_daily():
    """Post daily greeting with challenge."""
    challenge = random.choice(DAILY_CHALLENGES)
    today = datetime.now().strftime('%d.%m.%Y')

    text = f"""🌟 <b>Доброго ранку!</b>

📅 {today}

🎯 <b>Челендж дня:</b>
{challenge}

Хай щастить! 🍀

#НМТ #математика #мотивація"""

    result = send_message(text)
    if result.get('ok'):
        print("✓ Posted daily challenge")
        return True
    return False


def load_classtime_data():
    """Load Classtime data from JSON file."""
    try:
        # Try multiple paths
        paths = [
            CLASSTIME_DATA_PATH,
            '/home/marko17/www/nmt-trainer/classtime_data.json',
            os.path.join(os.path.dirname(__file__), 'classtime_data.json')
        ]

        for path in paths:
            if os.path.exists(path):
                with open(path, 'r', encoding='utf-8') as f:
                    return json.load(f)

        print("No classtime data found")
        return None
    except Exception as e:
        print(f"Error loading data: {e}")
        return None


def format_solution(latex):
    """Format LaTeX solution for Telegram."""
    if not latex:
        return ''

    # Parse table rows
    rows = [r.strip() for r in latex.split('\\hline') if r.strip()]
    steps = []

    for i, row in enumerate(rows[:5]):  # Limit to 5 steps
        parts = row.replace('\\\\', '').split('&')
        if len(parts) >= 1:
            step = parts[0].strip()
            # Clean LaTeX
            step = re.sub(r'\$', '', step)
            step = re.sub(r'\\cdot', '·', step)
            step = re.sub(r'\\times', '×', step)
            step = re.sub(r'\\frac\{([^}]+)\}\{([^}]+)\}', r'(\1)/(\2)', step)
            step = re.sub(r'\\sqrt\{([^}]+)\}', r'√(\1)', step)
            step = re.sub(r'\\sqrt', '√', step)
            step = step.replace('^2', '²').replace('^3', '³')

            steps.append(f"{i + 1}. {step}")

    return '\n'.join(steps)


def post_practice():
    """Post a random practice task with image."""
    data = load_classtime_data()
    if not data or not data.get('test_sets'):
        print("No data available")
        return False

    # Find task with photo
    for _ in range(30):
        test = random.choice(data['test_sets'])
        task = random.choice(test.get('tasks', []))

        if task.get('photo_url'):
            break
    else:
        print("No task with photo found")
        return False

    caption = f"""📝 <b>Завдання дня!</b>

📁 {test.get('folder', '')}
📚 {test['name']}
📌 Завдання #{task.get('task_num', '?')}

<tg-spoiler>✅ Відповідь: {task.get('correct', '?')}</tg-spoiler>

#НМТ #математика"""

    result = send_photo(task['photo_url'], caption)
    if result.get('ok'):
        print(f"✓ Posted practice: {test['name']} #{task.get('task_num')}")
        return True
    print(f"✗ Failed: {result.get('error', 'Unknown error')}")
    return False


def post_explained():
    """Post a task with solution explanation."""
    data = load_classtime_data()
    if not data or not data.get('test_sets'):
        return post_practice()

    # Find task with solution
    for _ in range(30):
        test = random.choice(data['test_sets'])
        task = random.choice(test.get('tasks', []))

        if task.get('photo_url') and task.get('solution_latex'):
            break
    else:
        # No solution found, post regular practice
        return post_practice()

    solution = format_solution(task['solution_latex'])

    caption = f"""📊 <b>Завдання з поясненням!</b>

📁 {test.get('folder', '')}
📚 {test['name']}
📌 Завдання #{task.get('task_num', '?')}

✅ <b>Відповідь:</b> {task.get('correct', '?')}

📝 <b>Розв'язок:</b>
{solution}

#НМТ #математика #розвязок"""

    result = send_photo(task['photo_url'], caption)
    if result.get('ok'):
        print(f"✓ Posted explained: {test['name']} #{task.get('task_num')}")
        return True
    return False


def auto_post():
    """Automatically select content based on time of day."""
    hour = datetime.now().hour

    print(f"⏰ Auto-post at {hour}:00")

    if 7 <= hour < 9:
        # Morning: daily + theory
        post_daily()
        return post_theory()
    elif 9 <= hour < 12:
        # Morning: theory
        return post_theory()
    elif 12 <= hour < 15:
        # Afternoon: explained task
        return post_explained()
    elif 15 <= hour < 18:
        # Afternoon: practice
        return post_practice()
    elif 18 <= hour < 21:
        # Evening: quiz
        return post_quiz()
    else:
        # Night: theory
        return post_theory()


def main():
    print(f"📡 Channel: {CHANNEL_ID}")
    print(f"🤖 Bot: {BOT_TOKEN[:15]}...")
    if TEST_MODE:
        print("🔧 TEST MODE - no messages will be sent\n")
    print()

    args = sys.argv[1:]

    if not args or '--help' in args:
        print("""
Telegram Auto-Poster for NMT Math Trainer

Commands:
  --theory      Post theory (formula + explanation)
  --practice    Post task with image
  --quiz        Post text quiz poll
  --explained   Post task with solution
  --daily       Post daily challenge
  --auto        Auto-select based on time
  --test        Test mode (no sending)
  --help        This help
""")
        return

    success = 0
    total = 0

    if '--auto' in args:
        total += 1
        if auto_post():
            success += 1

    if '--theory' in args:
        total += 1
        if post_theory():
            success += 1

    if '--practice' in args:
        total += 1
        if post_practice():
            success += 1

    if '--quiz' in args:
        total += 1
        if post_quiz():
            success += 1

    if '--explained' in args:
        total += 1
        if post_explained():
            success += 1

    if '--daily' in args:
        total += 1
        if post_daily():
            success += 1

    if total > 0:
        print(f"\n{'═' * 40}")
        print(f"  Result: {success}/{total} posts")
        print('═' * 40)


if __name__ == '__main__':
    main()
