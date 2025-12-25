#!/usr/bin/env python3
import re

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

changes = []

# 1. Add function if not exists
if 'cmd_flashcards_webapp' not in content:
    func_code = '''

async def cmd_flashcards_webapp(u: Update, c: ContextTypes.DEFAULT_TYPE):
    """Flashcards web app with flip animation."""
    keyboard = [[InlineKeyboardButton("Відкрити флеш-картки", web_app=WebAppInfo(url="https://marko1717.github.io/math-trainer-webapp/flashcards/"))]]
    await u.effective_message.reply_text(
        "🎴 *Флеш-картки*\\n\\n"
        "Вивчай формули ефективно!\\n\\n"
        "• 14 наборів карток\\n"
        "• 3D анімація перевертання\\n"
        "• Позначай: Знаю / Вчу\\n"
        "• Фільтр тільки НМТ\\n"
        "• Свайп для навігації\\n\\n"
        "Натисни картку — побачиш відповідь!",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )
'''
    # Insert after cmd_graph_builder
    pattern = r'(async def cmd_graph_builder\(u: Update, c: ContextTypes\.DEFAULT_TYPE\):.*?(?=\nasync def |\nclass |\n# ))'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        insert_pos = match.end()
        content = content[:insert_pos] + func_code + content[insert_pos:]
        changes.append("FUNCTION_ADDED")

# 2. Add callback handler
if 'menu_flashcards_webapp' not in content:
    pattern = r'(elif query\.data == "menu_graph_builder":\s*\n\s*await cmd_graph_builder\(upd, ctx\))'
    replacement = r'''\1
    elif query.data == "menu_flashcards_webapp":
        await cmd_flashcards_webapp(upd, ctx)'''
    new_content = re.sub(pattern, replacement, content)
    if new_content != content:
        content = new_content
        changes.append("CALLBACK_ADDED")

# 3. Add menu button
if 'callback_data="menu_flashcards_webapp"' not in content:
    pattern = r'(\[InlineKeyboardButton\("[^"]*Побудова графіків[^"]*", callback_data="menu_graph_builder"\)\],)'
    replacement = r'''\1
                [InlineKeyboardButton("🎴 Флеш-картки", callback_data="menu_flashcards_webapp")],'''
    new_content = re.sub(pattern, replacement, content)
    if new_content != content:
        content = new_content
        changes.append("BUTTON_ADDED")

if changes:
    with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("CHANGES: " + ", ".join(changes))
else:
    print("NO_CHANGES")
