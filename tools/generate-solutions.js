#!/usr/bin/env node
/**
 * Автоматична генерація розв'язків математичних задач через Claude + LaTeX
 *
 * Використання:
 *   node generate-solutions.js --test <test_id>           # Генерувати для одного тесту
 *   node generate-solutions.js --task <test_id> <task_num> # Генерувати для однієї задачі
 *   node generate-solutions.js --all                      # Генерувати для всіх задач без розв'язку
 *   node generate-solutions.js --folder <folder_name>     # Генерувати для папки (Classtime)
 *
 * Вимагає: ANTHROPIC_API_KEY в змінних середовища
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

// Конфігурація
const CONFIG = {
  nmtDataPath: path.join(__dirname, '../nmt-trainer/nmt_data.json'),
  classtimeDataPath: path.join(__dirname, '../nmt-trainer/classtime_data.json'),
  imagesDir: path.join(__dirname, '../nmt-trainer/images'),
  tempDir: '/tmp/latex-solutions',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY
};

// LaTeX шаблон для розв'язку
const LATEX_TEMPLATE = `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[ukrainian]{babel}
\\usepackage{amsmath,amssymb,amsthm}
\\usepackage{tikz}
\\usepackage{pgfplots}
\\usepackage{geometry}
\\usepackage{array}
\\usepackage{colortbl}
\\usepackage{xcolor}

\\geometry{margin=1.5cm}
\\pagestyle{empty}

\\definecolor{headergreen}{RGB}{183,223,185}
\\definecolor{answerpeach}{RGB}{253,218,192}

\\begin{document}

\\begin{center}
\\colorbox{headergreen}{\\parbox{0.9\\textwidth}{\\centering\\Large\\bfseries Завдання TASK_NUM}}
\\end{center}

\\vspace{0.3cm}

QUESTION_TEXT

\\vspace{0.5cm}

\\begin{tabular}{|p{0.45\\textwidth}|p{0.45\\textwidth}|}
\\hline
\\rowcolor{yellow!20}
\\textbf{Крок} & \\textbf{Коментар} \\\\
\\hline
SOLUTION_STEPS
\\hline
\\end{tabular}

\\vspace{0.5cm}

\\begin{center}
\\colorbox{answerpeach}{\\parbox{0.3\\textwidth}{\\centering\\large\\bfseries Відповідь: ANSWER}}
\\end{center}

\\end{document}
`;

// Промпт для Claude
const CLAUDE_PROMPT = `Ти - досвідчений репетитор з математики для підготовки до НМТ (національний мультипредметний тест) в Україні.

Проаналізуй це математичне завдання та створи детальний покроковий розв'язок у форматі LaTeX.

ВАЖЛИВО:
1. Відповідь має бути ТІЛЬКИ LaTeX код для таблиці кроків розв'язку
2. Формат: рядки таблиці, де кожен рядок має формат:
   Крок розв'язку & Короткий коментар \\\\
3. Використовуй українську мову
4. Математичні формули пиши в режимі $...$
5. Кроки мають бути логічними та зрозумілими для учня 11 класу
6. Останній крок - отримання відповіді

Приклад виводу (ТІЛЬКИ РЯДКИ ТАБЛИЦІ):
Визначаємо знак виразу під модулем: $1 - \\sqrt{3}$ & Порівнюємо 1 та $\\sqrt{3}$ \\\\
\\hline
Оскільки $\\sqrt{3} \\approx 1.732 > 1$, то $1 - \\sqrt{3} < 0$ & Вираз під модулем від'ємний \\\\
\\hline
За означенням модуля: $|a| = -a$, якщо $a < 0$ & Властивість модуля для від'ємних чисел \\\\
\\hline
$|1 - \\sqrt{3}| = -(1 - \\sqrt{3}) = -1 + \\sqrt{3} = \\sqrt{3} - 1$ & Застосовуємо означення модуля \\\\

Тепер проаналізуй завдання та дай ТІЛЬКИ рядки таблиці LaTeX (без преамбули, без \\begin{tabular}, тощо):`;

// Функція для виклику Claude API
async function callClaude(imageBase64, questionText, correctAnswer) {
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBase64
            }
          },
          {
            type: 'text',
            text: `${CLAUDE_PROMPT}\n\nПравильна відповідь: ${correctAnswer}\n\nДодатковий контекст (якщо є): ${questionText || 'немає'}`
          }
        ]
      }]
    });

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CONFIG.anthropicApiKey,
        'anthropic-version': '2023-06-01'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.content && response.content[0]) {
            resolve(response.content[0].text);
          } else {
            reject(new Error('Invalid API response: ' + data));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

// Компіляція LaTeX в JPG
function compileLaTeX(latexCode, outputPath, taskNum, questionText, answer) {
  // Створюємо повний LaTeX документ
  let fullLatex = LATEX_TEMPLATE
    .replace('TASK_NUM', taskNum)
    .replace('QUESTION_TEXT', questionText || '')
    .replace('SOLUTION_STEPS', latexCode)
    .replace('ANSWER', answer);

  // Створюємо тимчасову директорію
  if (!fs.existsSync(CONFIG.tempDir)) {
    fs.mkdirSync(CONFIG.tempDir, { recursive: true });
  }

  const texFile = path.join(CONFIG.tempDir, 'solution.tex');
  const pdfFile = path.join(CONFIG.tempDir, 'solution.pdf');

  fs.writeFileSync(texFile, fullLatex);

  try {
    // Компілюємо LaTeX
    execSync(`cd "${CONFIG.tempDir}" && /Library/TeX/texbin/pdflatex -interaction=nonstopmode solution.tex`, {
      stdio: 'pipe'
    });

    // Конвертуємо PDF в JPG через sips (macOS) або ImageMagick
    const pngFile = path.join(CONFIG.tempDir, 'solution.png');

    // Спочатку конвертуємо PDF в PNG через pdftoppm якщо є, або через Preview
    try {
      execSync(`/usr/bin/sips -s format png "${pdfFile}" --out "${pngFile}"`, { stdio: 'pipe' });
    } catch (e) {
      // Якщо sips не працює з PDF, використовуємо qlmanage
      execSync(`qlmanage -t -s 1200 -o "${CONFIG.tempDir}" "${pdfFile}"`, { stdio: 'pipe' });
      const qlPng = path.join(CONFIG.tempDir, 'solution.pdf.png');
      if (fs.existsSync(qlPng)) {
        fs.renameSync(qlPng, pngFile);
      }
    }

    // Конвертуємо PNG в JPG
    execSync(`/usr/bin/sips -s format jpeg "${pngFile}" --out "${outputPath}"`, { stdio: 'pipe' });

    console.log(`  -> Створено: ${path.basename(outputPath)}`);
    return true;
  } catch (e) {
    console.error(`  Помилка компіляції LaTeX: ${e.message}`);
    // Зберігаємо LaTeX для ручної перевірки
    const debugFile = outputPath.replace('.jpg', '.tex');
    fs.writeFileSync(debugFile, fullLatex);
    console.log(`  -> Збережено LaTeX для перевірки: ${path.basename(debugFile)}`);
    return false;
  }
}

// Генерація розв'язку для однієї задачі
async function generateSolution(task, testId, imagesDir) {
  const photoPath = path.join(imagesDir, task.photo);
  const solutionPath = path.join(imagesDir, `${testId}_task${task.task_num}_solution.jpg`);

  // Перевіряємо чи вже є розв'язок
  if (fs.existsSync(solutionPath)) {
    console.log(`  Завдання ${task.task_num}: вже є розв'язок, пропускаємо`);
    return { skipped: true };
  }

  // Перевіряємо чи є зображення задачі
  if (!fs.existsSync(photoPath)) {
    console.log(`  Завдання ${task.task_num}: немає зображення ${task.photo}`);
    return { error: 'no_image' };
  }

  console.log(`  Завдання ${task.task_num}: генеруємо розв'язок...`);

  try {
    // Читаємо зображення
    const imageBuffer = fs.readFileSync(photoPath);
    const imageBase64 = imageBuffer.toString('base64');

    // Викликаємо Claude
    const solutionSteps = await callClaude(imageBase64, task.question || '', task.correct);

    // Компілюємо LaTeX
    const success = compileLaTeX(
      solutionSteps,
      solutionPath,
      task.task_num,
      task.question || '',
      task.correct
    );

    if (success) {
      // Оновлюємо task з solution_photo
      task.solution_photo = `${testId}_task${task.task_num}_solution.jpg`;
      return { success: true };
    } else {
      return { error: 'latex_compile' };
    }
  } catch (e) {
    console.error(`  Помилка: ${e.message}`);
    return { error: e.message };
  }
}

// Генерація для всього тесту
async function generateForTest(testSet, imagesDir) {
  console.log(`\nТест: ${testSet.name} (${testSet.id})`);

  let stats = { success: 0, skipped: 0, errors: 0 };

  for (const task of testSet.tasks) {
    const result = await generateSolution(task, testSet.id, imagesDir);
    if (result.success) stats.success++;
    else if (result.skipped) stats.skipped++;
    else stats.errors++;

    // Пауза між запитами до API
    await new Promise(r => setTimeout(r, 1000));
  }

  return stats;
}

// Головна функція
async function main() {
  const args = process.argv.slice(2);

  if (!CONFIG.anthropicApiKey) {
    console.error('Помилка: встановіть ANTHROPIC_API_KEY');
    console.log('Приклад: export ANTHROPIC_API_KEY=sk-ant-...');
    process.exit(1);
  }

  // Завантажуємо дані
  let nmtData = null;
  let classtimeData = null;

  if (fs.existsSync(CONFIG.nmtDataPath)) {
    nmtData = JSON.parse(fs.readFileSync(CONFIG.nmtDataPath, 'utf8'));
  }
  if (fs.existsSync(CONFIG.classtimeDataPath)) {
    classtimeData = JSON.parse(fs.readFileSync(CONFIG.classtimeDataPath, 'utf8'));
  }

  // Парсимо аргументи
  if (args[0] === '--test' && args[1]) {
    const testId = args[1];
    const testSet = nmtData?.test_sets.find(t => t.id === testId) ||
                    classtimeData?.test_sets.find(t => t.id === testId);

    if (!testSet) {
      console.error(`Тест ${testId} не знайдено`);
      process.exit(1);
    }

    const stats = await generateForTest(testSet, CONFIG.imagesDir);
    console.log(`\nРезультат: ${stats.success} створено, ${stats.skipped} пропущено, ${stats.errors} помилок`);

  } else if (args[0] === '--task' && args[1] && args[2]) {
    const testId = args[1];
    const taskNum = parseInt(args[2]);

    const testSet = nmtData?.test_sets.find(t => t.id === testId) ||
                    classtimeData?.test_sets.find(t => t.id === testId);
    const task = testSet?.tasks.find(t => t.task_num === taskNum);

    if (!task) {
      console.error(`Завдання ${taskNum} в тесті ${testId} не знайдено`);
      process.exit(1);
    }

    await generateSolution(task, testId, CONFIG.imagesDir);

  } else if (args[0] === '--all') {
    let totalStats = { success: 0, skipped: 0, errors: 0 };

    // NMT тести
    if (nmtData) {
      console.log('=== NMT тести ===');
      for (const testSet of nmtData.test_sets) {
        const stats = await generateForTest(testSet, CONFIG.imagesDir);
        totalStats.success += stats.success;
        totalStats.skipped += stats.skipped;
        totalStats.errors += stats.errors;
      }
    }

    console.log(`\n=== ЗАГАЛЬНИЙ РЕЗУЛЬТАТ ===`);
    console.log(`Створено: ${totalStats.success}`);
    console.log(`Пропущено: ${totalStats.skipped}`);
    console.log(`Помилок: ${totalStats.errors}`);

  } else if (args[0] === '--folder' && args[1]) {
    const folderName = args.slice(1).join(' ');

    if (!classtimeData) {
      console.error('Classtime дані не завантажено');
      process.exit(1);
    }

    const testSets = classtimeData.test_sets.filter(t => t.folder === folderName);
    if (testSets.length === 0) {
      console.error(`Папку "${folderName}" не знайдено`);
      console.log('Доступні папки:');
      [...new Set(classtimeData.test_sets.map(t => t.folder))].forEach(f => console.log(`  - ${f}`));
      process.exit(1);
    }

    console.log(`Папка: ${folderName} (${testSets.length} тестів)`);

    let totalStats = { success: 0, skipped: 0, errors: 0 };
    for (const testSet of testSets) {
      const stats = await generateForTest(testSet, CONFIG.imagesDir);
      totalStats.success += stats.success;
      totalStats.skipped += stats.skipped;
      totalStats.errors += stats.errors;
    }

    console.log(`\nРезультат: ${totalStats.success} створено, ${totalStats.skipped} пропущено, ${totalStats.errors} помилок`);

  } else {
    console.log(`
Генератор розв'язків математичних задач через Claude + LaTeX

Використання:
  node generate-solutions.js --test <test_id>              Генерувати для одного тесту
  node generate-solutions.js --task <test_id> <task_num>   Генерувати для однієї задачі
  node generate-solutions.js --all                         Генерувати для всіх задач
  node generate-solutions.js --folder "<folder_name>"      Генерувати для папки Classtime

Приклад:
  export ANTHROPIC_API_KEY=sk-ant-...
  node generate-solutions.js --test test_1748266688
  node generate-solutions.js --folder "НМТ 2025"
`);
  }

  // Зберігаємо оновлені дані
  if (nmtData) {
    fs.writeFileSync(CONFIG.nmtDataPath, JSON.stringify(nmtData, null, 2));
  }
}

main().catch(console.error);
