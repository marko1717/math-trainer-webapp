#!/usr/bin/env node
/**
 * Telegram Channel Publisher
 *
 * Публікує математичний контент в Telegram канал:
 * - Теорію (формули, пояснення)
 * - Практику (завдання з розв'язками)
 * - Активності (опитування, челенджі)
 *
 * Використання:
 *   node telegram-publisher.js --theory                # Випадкова теорія
 *   node telegram-publisher.js --practice              # Випадкове завдання
 *   node telegram-publisher.js --quiz                  # Опитування
 *   node telegram-publisher.js --daily                 # Щоденний пост
 *   node telegram-publisher.js --schedule              # Запланувати пости
 *
 * Вимагає: TELEGRAM_BOT_TOKEN і TELEGRAM_CHANNEL_ID в змінних середовища
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '8196154557:AAFPjzLPWN834f98lp4x7gJ59L7Azs9xknI',
  channelId: process.env.TELEGRAM_CHANNEL_ID || '@nmt_math_trainer', // Replace with actual channel
  nmtDataPath: path.join(__dirname, '../nmt-trainer/nmt_data.json'),
  classtimeDataPath: path.join(__dirname, '../nmt-trainer/classtime_data.json'),
  imagesDir: path.join(__dirname, '../nmt-trainer/images')
};

// Theory content for posts
const THEORY_TOPICS = [
  {
    title: 'Теорема Піфагора',
    emoji: '📐',
    formula: 'a² + b² = c²',
    explanation: 'У прямокутному трикутнику квадрат гіпотенузи дорівнює сумі квадратів катетів.',
    example: '3² + 4² = 5² → 9 + 16 = 25 ✓',
    hashtags: '#математика #теорема #піфагор #геометрія'
  },
  {
    title: 'Дискримінант',
    emoji: '📈',
    formula: 'D = b² - 4ac',
    explanation: 'Дискримінант визначає кількість коренів квадратного рівняння:\n• D > 0 → два корені\n• D = 0 → один корінь\n• D < 0 → немає коренів',
    example: 'x² - 5x + 6 = 0\nD = 25 - 24 = 1 > 0\nx₁ = 2, x₂ = 3',
    hashtags: '#математика #дискримінант #рівняння #алгебра'
  },
  {
    title: 'Основна тригонометрична тотожність',
    emoji: '🔄',
    formula: 'sin²α + cos²α = 1',
    explanation: 'Сума квадратів синуса і косинуса будь-якого кута завжди дорівнює одиниці.',
    example: 'sin²30° + cos²30° = (1/2)² + (√3/2)² = 1/4 + 3/4 = 1 ✓',
    hashtags: '#математика #тригонометрія #формула'
  },
  {
    title: 'Логарифми - додавання',
    emoji: '📊',
    formula: 'log_a(b·c) = log_a(b) + log_a(c)',
    explanation: 'Логарифм добутку дорівнює сумі логарифмів множників.',
    example: 'log₂(4·8) = log₂4 + log₂8 = 2 + 3 = 5\nПеревірка: log₂32 = 5 ✓',
    hashtags: '#математика #логарифми #формула #алгебра'
  },
  {
    title: 'Арифметична прогресія',
    emoji: '📶',
    formula: 'aₙ = a₁ + (n-1)·d',
    explanation: 'n-й член АП = перший член + (n-1) × різниця.',
    example: 'a₁ = 3, d = 2\na₁₀ = 3 + 9·2 = 21',
    hashtags: '#математика #прогресія #послідовність'
  },
  {
    title: 'Геометрична прогресія',
    emoji: '📈',
    formula: 'bₙ = b₁ · q^(n-1)',
    explanation: 'n-й член ГП = перший член × знаменник^(n-1).',
    example: 'b₁ = 2, q = 3\nb₅ = 2 · 3⁴ = 2 · 81 = 162',
    hashtags: '#математика #прогресія #геометрична'
  },
  {
    title: 'Похідна',
    emoji: '📉',
    formula: "(x^n)' = n·x^(n-1)",
    explanation: 'Основне правило диференціювання степеневої функції.',
    example: "(x⁵)' = 5x⁴\n(x³)' = 3x²",
    hashtags: '#математика #похідна #диференціювання'
  },
  {
    title: 'Формули скороченого множення',
    emoji: '✨',
    formula: '(a ± b)² = a² ± 2ab + b²',
    explanation: 'Квадрат суми/різниці двох виразів.',
    example: '(x + 3)² = x² + 6x + 9\n(2a - 5)² = 4a² - 20a + 25',
    hashtags: '#математика #формули #алгебра'
  },
  {
    title: 'Площа трикутника',
    emoji: '📐',
    formula: 'S = ½ · a · h',
    explanation: 'Площа = половина добутку основи на висоту.',
    example: 'a = 8, h = 5\nS = ½ · 8 · 5 = 20',
    hashtags: '#математика #геометрія #площа #трикутник'
  },
  {
    title: 'Теорема косинусів',
    emoji: '📐',
    formula: 'c² = a² + b² - 2ab·cos(C)',
    explanation: 'Узагальнення теореми Піфагора для довільного трикутника.',
    example: 'Якщо C = 90°, то cos(C) = 0, і отримуємо теорему Піфагора!',
    hashtags: '#математика #геометрія #косинус #трикутник'
  }
];

// Daily challenges
const DAILY_CHALLENGES = [
  'Розв\'яжи 5 завдань на НМТ тренажері без помилок!',
  'Пройди весь тест на час - менше 30 хвилин!',
  'Вивчи всі тригонометричні формули подвійного кута',
  'Розв\'яжи 10 логарифмічних прикладів підряд',
  'Знайди 3 способи розв\'язати одну задачу',
  'Поділись своїм прогресом з друзями!'
];

// Telegram API helper
async function telegramRequest(method, params = {}) {
  return new Promise((resolve, reject) => {
    const url = `https://api.telegram.org/bot${CONFIG.botToken}/${method}`;

    const postData = JSON.stringify(params);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.ok) {
            resolve(result.result);
          } else {
            reject(new Error(result.description));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Send text message
async function sendMessage(text, parseMode = 'HTML') {
  return telegramRequest('sendMessage', {
    chat_id: CONFIG.channelId,
    text,
    parse_mode: parseMode
  });
}

// Send photo with caption
async function sendPhoto(photoPath, caption) {
  const FormData = require('form-data');
  const form = new FormData();

  form.append('chat_id', CONFIG.channelId);
  form.append('caption', caption);
  form.append('parse_mode', 'HTML');
  form.append('photo', fs.createReadStream(photoPath));

  return new Promise((resolve, reject) => {
    form.submit(`https://api.telegram.org/bot${CONFIG.botToken}/sendPhoto`, (err, res) => {
      if (err) reject(err);
      else {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const result = JSON.parse(data);
          if (result.ok) resolve(result.result);
          else reject(new Error(result.description));
        });
      }
    });
  });
}

// Send poll
async function sendPoll(question, options, correctIndex) {
  return telegramRequest('sendPoll', {
    chat_id: CONFIG.channelId,
    question,
    options,
    type: 'quiz',
    correct_option_id: correctIndex,
    is_anonymous: true
  });
}

// Post theory content
async function postTheory() {
  const topic = THEORY_TOPICS[Math.floor(Math.random() * THEORY_TOPICS.length)];

  const text = `${topic.emoji} <b>${topic.title}</b>

<code>${topic.formula}</code>

${topic.explanation}

💡 <b>Приклад:</b>
<pre>${topic.example}</pre>

${topic.hashtags}`;

  try {
    await sendMessage(text);
    console.log(`Posted theory: ${topic.title}`);
    return true;
  } catch (e) {
    console.error('Failed to post theory:', e.message);
    return false;
  }
}

// Post practice task
async function postPractice() {
  // Load NMT data
  let nmtData = null;
  if (fs.existsSync(CONFIG.nmtDataPath)) {
    nmtData = JSON.parse(fs.readFileSync(CONFIG.nmtDataPath, 'utf8'));
  }

  if (!nmtData || !nmtData.test_sets || nmtData.test_sets.length === 0) {
    console.error('No NMT data available');
    return false;
  }

  // Pick random test and task
  const test = nmtData.test_sets[Math.floor(Math.random() * nmtData.test_sets.length)];
  const task = test.tasks[Math.floor(Math.random() * test.tasks.length)];

  if (!task.photo) {
    console.log('Task has no photo, trying another...');
    return postPractice(); // Try again
  }

  const photoPath = path.join(CONFIG.imagesDir, task.photo);

  if (!fs.existsSync(photoPath)) {
    console.log(`Photo not found: ${photoPath}`);
    return false;
  }

  const caption = `📝 <b>Завдання дня!</b>

Тест: ${test.name}
Завдання #${task.task_num}

Напиши свою відповідь в коментарях! 👇

<tg-spoiler>Правильна відповідь: ${task.correct}</tg-spoiler>

#НМТ #математика #практика`;

  try {
    // Note: sendPhoto requires form-data package
    console.log(`Would post practice task: ${test.name} #${task.task_num}`);
    console.log(`Photo: ${photoPath}`);
    console.log(`Answer: ${task.correct}`);
    return true;
  } catch (e) {
    console.error('Failed to post practice:', e.message);
    return false;
  }
}

// Post quiz poll
async function postQuiz() {
  const quizzes = [
    {
      question: 'Чому дорівнює sin²30° + cos²30°?',
      options: ['0', '0.5', '1', '2'],
      correct: 2
    },
    {
      question: 'Скільки коренів має рівняння x² + 1 = 0?',
      options: ['0', '1', '2', 'Нескінченно'],
      correct: 0
    },
    {
      question: 'Чому дорівнює log₂(8)?',
      options: ['2', '3', '4', '8'],
      correct: 1
    },
    {
      question: '(a + b)² = ?',
      options: ['a² + b²', 'a² - b²', 'a² + 2ab + b²', '2ab'],
      correct: 2
    },
    {
      question: 'Похідна функції f(x) = x³ дорівнює:',
      options: ['x²', '3x', '3x²', 'x⁴/4'],
      correct: 2
    }
  ];

  const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];

  try {
    await sendPoll(quiz.question, quiz.options, quiz.correct);
    console.log(`Posted quiz: ${quiz.question}`);
    return true;
  } catch (e) {
    console.error('Failed to post quiz:', e.message);
    return false;
  }
}

// Post daily motivation/challenge
async function postDaily() {
  const challenge = DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)];
  const today = new Date().toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' });

  const text = `🌟 <b>Доброго ранку!</b>

📅 ${today}

🎯 <b>Челендж дня:</b>
${challenge}

Хай щастить! 🍀

#НМТ #математика #мотивація #челендж`;

  try {
    await sendMessage(text);
    console.log('Posted daily challenge');
    return true;
  } catch (e) {
    console.error('Failed to post daily:', e.message);
    return false;
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Telegram Channel Publisher

Використання:
  node telegram-publisher.js --theory      Публікація теорії
  node telegram-publisher.js --practice    Публікація завдання
  node telegram-publisher.js --quiz        Публікація опитування
  node telegram-publisher.js --daily       Щоденний пост
  node telegram-publisher.js --all         Всі типи (для тесту)

Налаштування:
  Встановіть змінні середовища:
  - TELEGRAM_BOT_TOKEN (за замовчуванням використовується існуючий)
  - TELEGRAM_CHANNEL_ID (наприклад @nmt_math_trainer)
`);
    return;
  }

  console.log(`Bot Token: ${CONFIG.botToken.substring(0, 10)}...`);
  console.log(`Channel: ${CONFIG.channelId}`);
  console.log('');

  if (args.includes('--theory')) {
    await postTheory();
  }

  if (args.includes('--practice')) {
    await postPractice();
  }

  if (args.includes('--quiz')) {
    await postQuiz();
  }

  if (args.includes('--daily')) {
    await postDaily();
  }

  if (args.includes('--all')) {
    console.log('=== Testing all post types ===\n');
    await postDaily();
    console.log('');
    await postTheory();
    console.log('');
    await postQuiz();
    console.log('');
    await postPractice();
  }
}

main().catch(console.error);
