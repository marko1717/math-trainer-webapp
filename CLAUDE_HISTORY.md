# Історія роботи з Claude Code - Math Trainer iOS App

## Огляд проекту

**Проект:** NMT Math Trainer - iOS додаток для підготовки до НМТ з математики
**GitHub:** https://github.com/marko1717/math-trainer-webapp
**Технології:** Capacitor, HTML/JS/CSS, iOS (Swift), Claude API для генерації розв'язків

---

## Сесія 1: Початкове налаштування та основні функції

### Виконані завдання:

1. **Адмін-панель для редагування завдань**
   - Можливість редагувати відповіді
   - Зміна типу завдання
   - Файл: `www/admin/solutions.html`

2. **Авто-постинг в Telegram канал**
   - Налаштування автоматичної публікації завдань
   - Інтеграція з Telegram Bot API

3. **Зображення-квізи з поясненнями**
   - Додавання картинок до постів в Telegram
   - Пояснення до відповідей

4. **Інтеграція LaTeX генератора розв'язків**
   - Підключення Claude API для генерації математичних розв'язків
   - Рендеринг LaTeX формул через KaTeX
   - Файл: `www/nmt-trainer/app.js` - функція `generateSolutionWithClaude()`

5. **Кешування згенерованих розв'язків**
   - Збереження розв'язків в `task.solution_latex`
   - Повторне використання без регенерації

---

## Сесія 2: Оптимізація для учнів (поточна сесія)

### Проблема користувача:
"А де кнопка згенерувати розв'язок?" → "А якщо в додатку?" → "То всім учням треба буде вводити API ключ?"

### Рішення:

1. **Приховано кнопку генерації для учнів**
   - Учні бачать лише вже згенеровані розв'язки
   - Кнопка "Згенерувати розв'язок" прихована для звичайних користувачів

   ```javascript
   // www/nmt-trainer/app.js - функція showSolution()
   // Hide generate button for regular users (only admins use admin panel to generate)
   // Students see pre-generated solutions stored in task.solution_latex
   if (generateBtn) {
       generateBtn.style.display = 'none';
   }
   ```

2. **Додано експорт JSON для адміністраторів**
   - Нова кнопка "📦 Експорт JSON" в адмін-панелі
   - Експортує всі дані з розв'язками
   - Файл: `www/admin/solutions.html`

   ```javascript
   function exportAllData() {
       const dataToExport = classtimeData || nmtData;
       // ... підрахунок розв'язків
       const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
       const a = document.createElement('a');
       a.href = URL.createObjectURL(blob);
       a.download = 'classtime_data_with_solutions.json';
       a.click();
   }
   ```

### Робочий процес:

```
АДМІНІСТРАТОР:
1. Відкриває /admin/solutions.html
2. Вводить свій Claude API ключ
3. Генерує розв'язки для завдань
4. Натискає "📦 Експорт JSON"
5. Замінює classtime_data.json на сервері

УЧНІ:
1. Відкривають додаток
2. Вирішують завдання
3. Натискають "Розв'язок"
4. Бачать готовий розв'язок (без потреби API ключа)
```

---

## Ключові файли проекту

### Основні:
- `www/nmt-trainer/app.js` - головна логіка тренажера
- `www/nmt-trainer/index.html` - інтерфейс тренажера
- `www/admin/solutions.html` - адмін-панель для генерації розв'язків
- `www/data/classtime_data.json` - дані завдань з розв'язками

### iOS:
- `ios/App/` - Capacitor iOS проект
- Синхронізація: `npx cap sync ios`

### Конфігурація:
- `capacitor.config.ts` - налаштування Capacitor
- `package.json` - залежності проекту

---

## Git коміти цієї сесії

```
6e14b52 Hide generate solution button for students, add JSON export for admins
5e83ae2 Always show generate solution button on solution screen
8eac385 Add admin panel editing, auto-posting, and solution generator
1008bfd Add pause/resume, answer highlighting, and interactive textbook
cba0609 Update phrases to Холостяк style
```

---

## Корисні команди

```bash
# Синхронізація iOS додатку
npx cap sync ios

# Відкрити в Xcode
npx cap open ios

# Pod install (якщо потрібно)
cd ios/App && LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 pod install

# Push на GitHub
git push math-trainer HEAD:main
```

---

## Структура генерації розв'язків

### Claude API запит (в app.js):
```javascript
async function generateSolutionWithClaude(task) {
    const apiKey = localStorage.getItem('claude_api_key');
    // ... формування промпту з умовою задачі
    // ... виклик Claude API
    // ... отримання LaTeX розв'язку
    task.solution_latex = response; // кешування
}
```

### Відображення LaTeX:
- Використовується KaTeX для рендерингу формул
- Розв'язки зберігаються в `task.solution_latex`

---

## Наступні кроки (опціонально)

1. Згенерувати розв'язки для всіх завдань через адмін-панель
2. Експортувати JSON і оновити на сервері
3. Зібрати iOS додаток через Xcode і завантажити в TestFlight

---

---

## Підключення до PythonAnywhere

### Дані для підключення:
- **Хост:** ssh.pythonanywhere.com
- **Користувач:** marko17
- **Пароль:** &m+5nQDWB/:%GLb

### Встановлення sshpass (для автоматичного вводу пароля):

```bash
# macOS
brew tap esolitos/ipa
brew install esolitos/ipa/sshpass
```

### Підключення через SSH:

```bash
/opt/homebrew/bin/sshpass -p '&m+5nQDWB/:%GLb' ssh -o StrictHostKeyChecking=no marko17@ssh.pythonanywhere.com
```

### Виконання команди на сервері:

```bash
/opt/homebrew/bin/sshpass -p '&m+5nQDWB/:%GLb' ssh -o StrictHostKeyChecking=no marko17@ssh.pythonanywhere.com "команда"
```

Приклад - перевірити файли:
```bash
/opt/homebrew/bin/sshpass -p '&m+5nQDWB/:%GLb' ssh -o StrictHostKeyChecking=no marko17@ssh.pythonanywhere.com "ls -la ~/bot-tg/"
```

### Копіювання файлу на сервер (SCP):

```bash
/opt/homebrew/bin/sshpass -p '&m+5nQDWB/:%GLb' scp -o StrictHostKeyChecking=no /локальний/шлях/файл.py marko17@ssh.pythonanywhere.com:/home/marko17/файл.py
```

### Перевірка синтаксису Python файлу:

```bash
/opt/homebrew/bin/sshpass -p '&m+5nQDWB/:%GLb' ssh -o StrictHostKeyChecking=no marko17@ssh.pythonanywhere.com "python3 -m py_compile /home/marko17/bot-tg/quiz-bot-2.py && echo SYNTAX_OK"
```

### Перегляд конкретних рядків файлу:

```bash
/opt/homebrew/bin/sshpass -p '&m+5nQDWB/:%GLb' ssh -o StrictHostKeyChecking=no marko17@ssh.pythonanywhere.com "sed -n '100,150p' /home/marko17/bot-tg/quiz-bot-2.py"
```

### Пошук в файлі:

```bash
/opt/homebrew/bin/sshpass -p '&m+5nQDWB/:%GLb' ssh -o StrictHostKeyChecking=no marko17@ssh.pythonanywhere.com "grep -n 'пошуковий_текст' ~/bot-tg/quiz-bot-2.py | head -20"
```

### Запуск Python скрипта на сервері:

```bash
/opt/homebrew/bin/sshpass -p '&m+5nQDWB/:%GLb' ssh -o StrictHostKeyChecking=no marko17@ssh.pythonanywhere.com "python3 /home/marko17/script.py"
```

### Структура файлів на PythonAnywhere:

```
/home/marko17/
├── bot-tg/
│   └── quiz-bot-2.py    # Telegram бот
├── mysite/
│   └── ...              # Web додаток (Flask/Django)
└── ...
```

### Перезапуск веб-додатку:

Через веб-інтерфейс PythonAnywhere:
1. Зайти на https://www.pythonanywhere.com
2. Вкладка "Web"
3. Натиснути "Reload"

---

*Створено: 26 грудня 2025*
*Claude Code session для проекту math-trainer-webapp*
