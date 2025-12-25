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
 *   node telegram-publisher.js --practice              # Випадкове завдання (з картинкою)
 *   node telegram-publisher.js --quiz                  # Опитування
 *   node telegram-publisher.js --daily                 # Щоденний пост
 *   node telegram-publisher.js --schedule              # Показати інструкцію автопостінгу
 *   node telegram-publisher.js --image-quiz           # Опитування з картинкою
 *   node telegram-publisher.js --test                  # Тестовий режим (без надсилання)
 *
 * Налаштування:
 *   1. Створіть канал в Telegram
 *   2. Додайте бота @BotFather як адміністратора каналу
 *   3. Встановіть TELEGRAM_CHANNEL_ID (наприклад @your_channel або -100xxxxxxxxx)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '8196154557:AAFPjzLPWN834f98lp4x7gJ59L7Azs9xknI',
  channelId: process.env.TELEGRAM_CHANNEL_ID || '@pvtr2525', // Your channel
  nmtDataPath: path.join(__dirname, '../www/nmt-trainer/nmt_data.json'),
  classtimeDataPath: path.join(__dirname, '../www/nmt-trainer/classtime_data.json'),
  imagesDir: path.join(__dirname, '../www/nmt-trainer/images'),
  testMode: false // Set via --test flag
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

// Send photo with caption (supports local file or URL)
async function sendPhoto(photoSource, caption) {
  if (CONFIG.testMode) {
    console.log('[TEST] Would send photo:', photoSource);
    console.log('[TEST] Caption:', caption.substring(0, 100) + '...');
    return { ok: true, test: true };
  }

  // If it's a URL, use simpler method
  if (photoSource.startsWith('http')) {
    return telegramRequest('sendPhoto', {
      chat_id: CONFIG.channelId,
      photo: photoSource,
      caption: caption,
      parse_mode: 'HTML'
    });
  }

  // For local files, use multipart form
  const boundary = '----FormBoundary' + Math.random().toString(36).substring(2);

  const photoData = fs.readFileSync(photoSource);
  const fileName = path.basename(photoSource);

  let body = '';
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="chat_id"\r\n\r\n${CONFIG.channelId}\r\n`;
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`;
  body += `--${boundary}\r\n`;
  body += `Content-Disposition: form-data; name="parse_mode"\r\n\r\nHTML\r\n`;

  const headerPart = Buffer.from(body + `--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="${fileName}"\r\nContent-Type: image/jpeg\r\n\r\n`);
  const footerPart = Buffer.from(`\r\n--${boundary}--\r\n`);
  const fullBody = Buffer.concat([headerPart, photoData, footerPart]);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${CONFIG.botToken}/sendPhoto`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': fullBody.length
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.ok) resolve(result.result);
          else reject(new Error(result.description));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(fullBody);
    req.end();
  });
}

// Send poll
async function sendPoll(question, options, correctIndex) {
  if (CONFIG.testMode) {
    console.log('[TEST] Would send poll:', question);
    console.log('[TEST] Options:', options);
    console.log('[TEST] Correct:', correctIndex);
    return { ok: true, test: true };
  }

  return telegramRequest('sendPoll', {
    chat_id: CONFIG.channelId,
    question,
    options,
    type: 'quiz',
    correct_option_id: correctIndex,
    is_anonymous: true
  });
}

// Send message with test mode support
async function sendMessageSafe(text, parseMode = 'HTML') {
  if (CONFIG.testMode) {
    console.log('[TEST] Would send message:');
    console.log(text);
    return { ok: true, test: true };
  }
  return sendMessage(text, parseMode);
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
    await sendMessageSafe(text);
    console.log(`✓ Posted theory: ${topic.title}`);
    return true;
  } catch (e) {
    console.error('✗ Failed to post theory:', e.message);
    return false;
  }
}

// Post practice task with image from NMT data
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

  // Pick random test and task with photo
  let attempts = 0;
  let test, task, photoPath;

  while (attempts < 20) {
    test = nmtData.test_sets[Math.floor(Math.random() * nmtData.test_sets.length)];
    task = test.tasks[Math.floor(Math.random() * test.tasks.length)];

    if (task.photo) {
      photoPath = path.join(CONFIG.imagesDir, task.photo);
      if (fs.existsSync(photoPath)) break;
    }
    attempts++;
  }

  if (!photoPath || !fs.existsSync(photoPath)) {
    console.log('No valid photo found after 20 attempts');
    return false;
  }

  const caption = `📝 <b>Завдання дня!</b>

📚 ${test.name}
📌 Завдання #${task.task_num}

Напиши відповідь в коментарях! 👇

<tg-spoiler>Правильна відповідь: ${task.correct}</tg-spoiler>

#НМТ #математика #практика`;

  try {
    await sendPhoto(photoPath, caption);
    console.log(`✓ Posted practice: ${test.name} #${task.task_num}`);
    return true;
  } catch (e) {
    console.error('✗ Failed to post practice:', e.message);
    return false;
  }
}

// Post practice task from Classtime with image URL
async function postClasstimePractice() {
  let classtimeData = null;
  if (fs.existsSync(CONFIG.classtimeDataPath)) {
    classtimeData = JSON.parse(fs.readFileSync(CONFIG.classtimeDataPath, 'utf8'));
  }

  if (!classtimeData || !classtimeData.test_sets || classtimeData.test_sets.length === 0) {
    console.error('No Classtime data available');
    return false;
  }

  // Pick random test and task with photo URL
  let attempts = 0;
  let test, task;

  while (attempts < 20) {
    test = classtimeData.test_sets[Math.floor(Math.random() * classtimeData.test_sets.length)];
    task = test.tasks[Math.floor(Math.random() * test.tasks.length)];

    if (task.photo_url) break;
    attempts++;
  }

  if (!task || !task.photo_url) {
    console.log('No valid Classtime task found');
    return false;
  }

  const caption = `📝 <b>Завдання з Classtime</b>

📁 ${test.folder || ''}
📚 ${test.name}
📌 Завдання #${task.task_num}

Напиши відповідь в коментарях! 👇

#НМТ #математика #classtime`;

  try {
    await sendPhoto(task.photo_url, caption);
    console.log(`✓ Posted Classtime: ${test.name} #${task.task_num}`);
    return true;
  } catch (e) {
    console.error('✗ Failed to post Classtime:', e.message);
    return false;
  }
}

// Extended quiz bank for Telegram polls
const QUIZ_BANK = [
  // Тригонометрія
  { question: 'Чому дорівнює sin²30° + cos²30°?', options: ['0', '0.5', '1', '2'], correct: 2, topic: 'тригонометрія' },
  { question: 'Чому дорівнює sin(90°)?', options: ['0', '0.5', '1', '-1'], correct: 2, topic: 'тригонометрія' },
  { question: 'Чому дорівнює cos(0°)?', options: ['0', '0.5', '1', '-1'], correct: 2, topic: 'тригонометрія' },
  { question: 'Чому дорівнює tg(45°)?', options: ['0', '0.5', '1', '√2'], correct: 2, topic: 'тригонометрія' },
  { question: 'sin(180°) = ?', options: ['0', '1', '-1', '0.5'], correct: 0, topic: 'тригонометрія' },

  // Рівняння
  { question: 'Скільки коренів має x² + 1 = 0?', options: ['0', '1', '2', '∞'], correct: 0, topic: 'рівняння' },
  { question: 'Розв\'яжи: x² - 4 = 0', options: ['x=2', 'x=±2', 'x=-2', 'x=4'], correct: 1, topic: 'рівняння' },
  { question: 'Дискримінант x²-5x+6: D=?', options: ['1', '-1', '25', '11'], correct: 0, topic: 'рівняння' },
  { question: 'Корінь рівняння 2x + 4 = 0', options: ['x=2', 'x=-2', 'x=4', 'x=-4'], correct: 1, topic: 'рівняння' },

  // Логарифми
  { question: 'log₂(8) = ?', options: ['2', '3', '4', '8'], correct: 1, topic: 'логарифми' },
  { question: 'log₁₀(100) = ?', options: ['1', '2', '10', '100'], correct: 1, topic: 'логарифми' },
  { question: 'log₃(27) = ?', options: ['2', '3', '9', '27'], correct: 1, topic: 'логарифми' },
  { question: 'ln(e) = ?', options: ['0', '1', 'e', '2.71'], correct: 1, topic: 'логарифми' },
  { question: 'log₅(1) = ?', options: ['0', '1', '5', '-1'], correct: 0, topic: 'логарифми' },

  // Формули скороченого множення
  { question: '(a + b)² = ?', options: ['a² + b²', 'a² - b²', 'a² + 2ab + b²', '2ab'], correct: 2, topic: 'формули' },
  { question: '(a - b)² = ?', options: ['a² + b²', 'a² - 2ab + b²', 'a² + 2ab + b²', '(a-b)(a+b)'], correct: 1, topic: 'формули' },
  { question: 'a² - b² = ?', options: ['(a-b)²', '(a+b)²', '(a-b)(a+b)', 'a²-2ab+b²'], correct: 2, topic: 'формули' },
  { question: '(a + b)³ = ?', options: ['a³+b³', 'a³+3a²b+3ab²+b³', 'a³-b³', '3ab(a+b)'], correct: 1, topic: 'формули' },

  // Похідні
  { question: "(x³)' = ?", options: ['x²', '3x', '3x²', 'x⁴/4'], correct: 2, topic: 'похідні' },
  { question: "(sin x)' = ?", options: ['sin x', '-sin x', 'cos x', '-cos x'], correct: 2, topic: 'похідні' },
  { question: "(eˣ)' = ?", options: ['eˣ', 'xeˣ⁻¹', 'ln x', 'e'], correct: 0, topic: 'похідні' },
  { question: "(ln x)' = ?", options: ['ln x', '1/x', 'x', 'eˣ'], correct: 1, topic: 'похідні' },
  { question: "(x⁵)' = ?", options: ['5x⁴', 'x⁴', '5x⁵', 'x⁶/6'], correct: 0, topic: 'похідні' },

  // Геометрія
  { question: 'Сума кутів трикутника:', options: ['90°', '180°', '270°', '360°'], correct: 1, topic: 'геометрія' },
  { question: 'Сума кутів чотирикутника:', options: ['180°', '270°', '360°', '540°'], correct: 2, topic: 'геометрія' },
  { question: 'Площа кола радіуса r:', options: ['2πr', 'πr²', 'πr', '4πr²'], correct: 1, topic: 'геометрія' },
  { question: 'Довжина кола радіуса r:', options: ['2πr', 'πr²', 'πr', '4πr²'], correct: 0, topic: 'геометрія' },
  { question: 'Теорема Піфагора:', options: ['a+b=c', 'a²+b²=c²', 'ab=c²', 'a²-b²=c²'], correct: 1, topic: 'геометрія' },

  // Прогресії
  { question: 'Сума АП: 1+2+3+...+100=?', options: ['5000', '5050', '10100', '100'], correct: 1, topic: 'прогресії' },
  { question: 'Який наступний член: 2,4,8,16,...', options: ['18', '24', '32', '64'], correct: 2, topic: 'прогресії' },
  { question: 'Який наступний член: 3,6,9,12,...', options: ['14', '15', '16', '18'], correct: 1, topic: 'прогресії' }
];

// Post quiz poll
async function postQuiz() {
  const quiz = QUIZ_BANK[Math.floor(Math.random() * QUIZ_BANK.length)];

  try {
    await sendPoll(quiz.question, quiz.options, quiz.correct);
    console.log(`✓ Posted quiz: ${quiz.question}`);
    return true;
  } catch (e) {
    console.error('✗ Failed to post quiz:', e.message);
    return false;
  }
}

// Post quiz with image + explanation (solution)
async function postImageQuizWithExplanation() {
  let classtimeData = null;
  if (fs.existsSync(CONFIG.classtimeDataPath)) {
    classtimeData = JSON.parse(fs.readFileSync(CONFIG.classtimeDataPath, 'utf8'));
  }

  if (!classtimeData || !classtimeData.test_sets) {
    console.log('No Classtime data, falling back to simple quiz');
    return postQuiz();
  }

  // Find a task with solution
  let attempts = 0;
  let test, task;

  while (attempts < 30) {
    test = classtimeData.test_sets[Math.floor(Math.random() * classtimeData.test_sets.length)];
    task = test.tasks[Math.floor(Math.random() * test.tasks.length)];

    if (task.photo_url && task.correct && task.solution_latex) break;
    attempts++;
  }

  // If no solution, try without it
  if (!task || !task.photo_url) {
    return postImageQuiz();
  }

  const caption = task.solution_latex ?
    `📊 <b>Завдання з поясненням!</b>

📁 ${test.folder || ''}
📚 ${test.name}
📌 Завдання #${task.task_num}

✅ <b>Відповідь:</b> ${task.correct}

📝 <b>Розв'язок:</b>
${formatSolutionForTelegram(task.solution_latex)}

#НМТ #математика #розвязок` :
    `📊 <b>Завдання дня!</b>

📁 ${test.folder || ''}
📚 ${test.name}
📌 Завдання #${task.task_num}

<tg-spoiler>✅ Відповідь: ${task.correct}</tg-spoiler>

#НМТ #математика`;

  try {
    await sendPhoto(task.photo_url, caption);
    console.log(`✓ Posted quiz with explanation: ${test.name} #${task.task_num}`);
    return true;
  } catch (e) {
    console.error('✗ Failed to post quiz with explanation:', e.message);
    return false;
  }
}

// Format LaTeX solution for Telegram (simplified)
function formatSolutionForTelegram(latex) {
  if (!latex) return '';

  // Parse table rows and convert to readable format
  const rows = latex.split('\\hline').map(r => r.trim()).filter(r => r);
  const steps = [];

  rows.forEach((row, i) => {
    const parts = row.replace(/\\\\$/g, '').split('&');
    if (parts.length >= 2) {
      // Clean up LaTeX for Telegram
      let step = parts[0].trim()
        .replace(/\$/g, '')
        .replace(/\\cdot/g, '·')
        .replace(/\\times/g, '×')
        .replace(/\\div/g, '÷')
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
        .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
        .replace(/\\sqrt/g, '√')
        .replace(/\^2/g, '²')
        .replace(/\^3/g, '³')
        .replace(/_(\d)/g, '₀₁₂₃₄₅₆₇₈₉'.charAt);

      let comment = parts[1].trim();

      steps.push(`${i + 1}. ${step}`);
    }
  });

  return steps.slice(0, 5).join('\n'); // Limit to 5 steps for Telegram
}

// Post quiz with image (from NMT data)
async function postImageQuiz() {
  let nmtData = null;
  if (fs.existsSync(CONFIG.nmtDataPath)) {
    nmtData = JSON.parse(fs.readFileSync(CONFIG.nmtDataPath, 'utf8'));
  }

  if (!nmtData || !nmtData.test_sets) {
    console.log('No NMT data, falling back to text quiz');
    return postQuiz();
  }

  // Find a quiz-type task with photo
  let attempts = 0;
  let test, task, photoPath;

  while (attempts < 30) {
    test = nmtData.test_sets[Math.floor(Math.random() * nmtData.test_sets.length)];
    task = test.tasks[Math.floor(Math.random() * test.tasks.length)];

    if (task.type === 'quiz' && task.photo && task.correct) {
      photoPath = path.join(CONFIG.imagesDir, task.photo);
      if (fs.existsSync(photoPath)) break;
    }
    attempts++;
  }

  if (!photoPath || !fs.existsSync(photoPath)) {
    console.log('No quiz with image found, falling back to text quiz');
    return postQuiz();
  }

  // Ukrainian letter options
  const optionLetters = ['А', 'Б', 'В', 'Г', 'Д'];
  const correctIndex = optionLetters.indexOf(task.correct.toUpperCase());

  if (correctIndex === -1) {
    console.log('Invalid correct answer format, falling back');
    return postQuiz();
  }

  const caption = `📊 <b>Опитування дня!</b>

📚 ${test.name}
📌 Завдання #${task.task_num}

Обери правильний варіант! 👇

#НМТ #опитування`;

  try {
    // First send the image
    await sendPhoto(photoPath, caption);

    // Then send the poll
    await sendPoll(
      `Завдання #${task.task_num} - яка правильна відповідь?`,
      optionLetters.slice(0, 5), // А, Б, В, Г, Д
      correctIndex
    );

    console.log(`✓ Posted image quiz: ${test.name} #${task.task_num}`);
    return true;
  } catch (e) {
    console.error('✗ Failed to post image quiz:', e.message);
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
    await sendMessageSafe(text);
    console.log('✓ Posted daily challenge');
    return true;
  } catch (e) {
    console.error('✗ Failed to post daily:', e.message);
    return false;
  }
}

// Show schedule/cron setup instructions
function showScheduleInstructions() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║              АВТОМАТИЧНИЙ ПОСТІНГ В TELEGRAM               ║
╠════════════════════════════════════════════════════════════╣

📋 КРОК 1: Налаштування каналу
─────────────────────────────────
1. Створіть канал в Telegram (якщо ще немає)
2. Перейдіть в налаштування каналу → Адміністратори
3. Додайте бота @BotFather (токен вже налаштований)
4. Дайте боту права на публікацію повідомлень

📋 КРОК 2: Встановлення ID каналу
─────────────────────────────────
Відредагуйте channelId в цьому файлі:
  tools/telegram-publisher.js

Або встановіть змінну середовища:
  export TELEGRAM_CHANNEL_ID="@your_channel_name"

📋 КРОК 3: Автопостінг через cron (Linux/Mac)
─────────────────────────────────
Відкрийте crontab:
  crontab -e

Додайте рядки:
  # Щоранку о 8:00 - привітання + челендж
  0 8 * * * cd ${process.cwd()} && node tools/telegram-publisher.js --daily

  # О 10:00 - теорія
  0 10 * * * cd ${process.cwd()} && node tools/telegram-publisher.js --theory

  # О 14:00 - опитування з картинкою
  0 14 * * * cd ${process.cwd()} && node tools/telegram-publisher.js --image-quiz

  # О 18:00 - практичне завдання
  0 18 * * * cd ${process.cwd()} && node tools/telegram-publisher.js --practice

  # О 20:00 - текстове опитування
  0 20 * * * cd ${process.cwd()} && node tools/telegram-publisher.js --quiz

📋 КРОК 4: Автопостінг через PythonAnywhere
─────────────────────────────────
Якщо сервер на PythonAnywhere:
1. Перейдіть в Tasks → Scheduled tasks
2. Додайте задачу: node /home/marko17/tools/telegram-publisher.js --daily

📋 КРОК 5: Тестування
─────────────────────────────────
Спробуйте в тестовому режимі (без надсилання):
  node telegram-publisher.js --test --all

Надішліть тестовий пост:
  node telegram-publisher.js --theory

╚════════════════════════════════════════════════════════════╝
`);
}

// Main function
async function main() {
  const args = process.argv.slice(2);

  // Check for test mode
  if (args.includes('--test')) {
    CONFIG.testMode = true;
    console.log('🔧 ТЕСТОВИЙ РЕЖИМ - пости не надсилаються\n');
  }

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║              TELEGRAM CHANNEL PUBLISHER                    ║
║              для НМТ Math Trainer                          ║
╠════════════════════════════════════════════════════════════╣

📚 КОМАНДИ:
  --theory          Публікація теорії (формула + пояснення)
  --practice        Завдання з картинкою (з NMT тренажера)
  --classtime       Завдання з Classtime (з URL картинки)
  --quiz            Текстове опитування
  --image-quiz      Опитування з картинкою завдання
  --explained       Завдання з картинкою + розв'язок
  --daily           Щоденне привітання + челендж
  --auto            Автоматичний пост (залежно від часу)
  --all             Всі типи постів (для тесту)
  --schedule        Показати інструкцію автопостінгу
  --test            Тестовий режим (без надсилання)
  --help            Ця довідка

💡 ПРИКЛАДИ:
  node telegram-publisher.js --theory
  node telegram-publisher.js --test --all
  node telegram-publisher.js --schedule

⚙️ НАЛАШТУВАННЯ:
  Поточний канал: ${CONFIG.channelId}
  Бот: ${CONFIG.botToken.substring(0, 15)}...

╚════════════════════════════════════════════════════════════╝
`);
    return;
  }

  if (args.includes('--schedule')) {
    showScheduleInstructions();
    return;
  }

  console.log(`📡 Канал: ${CONFIG.channelId}`);
  console.log(`🤖 Бот: ${CONFIG.botToken.substring(0, 15)}...`);
  console.log('');

  let success = 0;
  let total = 0;

  if (args.includes('--theory')) {
    total++;
    if (await postTheory()) success++;
  }

  if (args.includes('--practice')) {
    total++;
    if (await postPractice()) success++;
  }

  if (args.includes('--classtime')) {
    total++;
    if (await postClasstimePractice()) success++;
  }

  if (args.includes('--quiz')) {
    total++;
    if (await postQuiz()) success++;
  }

  if (args.includes('--image-quiz')) {
    total++;
    if (await postImageQuiz()) success++;
  }

  if (args.includes('--daily')) {
    total++;
    if (await postDaily()) success++;
  }

  if (args.includes('--explained')) {
    total++;
    if (await postImageQuizWithExplanation()) success++;
  }

  if (args.includes('--auto')) {
    // Auto-select content based on current hour
    const hour = new Date().getHours();
    total++;

    if (hour >= 7 && hour < 9) {
      // Morning: daily greeting + theory
      if (await postDaily()) success++;
      total++;
      await new Promise(r => setTimeout(r, 2000)); // Small delay
      if (await postTheory()) success++;
    } else if (hour >= 9 && hour < 12) {
      // Morning practice: theory
      if (await postTheory()) success++;
    } else if (hour >= 12 && hour < 15) {
      // Afternoon: quiz with explanation
      if (await postImageQuizWithExplanation()) success++;
    } else if (hour >= 15 && hour < 18) {
      // Afternoon practice
      if (await postClasstimePractice()) success++;
    } else if (hour >= 18 && hour < 21) {
      // Evening: image quiz
      if (await postImageQuiz()) success++;
    } else {
      // Night: simple quiz
      if (await postQuiz()) success++;
    }

    console.log(`\n⏰ Автопост о ${hour}:00`);
  }

  if (args.includes('--all')) {
    console.log('═══════════════════════════════════════');
    console.log('  ТЕСТУВАННЯ ВСІХ ТИПІВ ПОСТІВ');
    console.log('═══════════════════════════════════════\n');

    total = 6;
    if (await postDaily()) success++;
    console.log('');
    if (await postTheory()) success++;
    console.log('');
    if (await postQuiz()) success++;
    console.log('');
    if (await postImageQuiz()) success++;
    console.log('');
    if (await postPractice()) success++;
    console.log('');
    if (await postClasstimePractice()) success++;
  }

  if (total > 0) {
    console.log('');
    console.log(`═══════════════════════════════════════`);
    console.log(`  Результат: ${success}/${total} постів`);
    console.log(`═══════════════════════════════════════`);
  }
}

main().catch(console.error);
