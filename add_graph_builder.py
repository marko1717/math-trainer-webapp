#!/usr/bin/env python3
import re

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

changes = []

# 1. Add function if not exists
if 'cmd_graph_builder' not in content:
    func_code = '''

async def cmd_graph_builder(u: Update, c: ContextTypes.DEFAULT_TYPE):
    """Graph builder trainer."""
    keyboard = [[InlineKeyboardButton("Почати тренування", web_app=WebAppInfo(url="https://marko1717.github.io/math-trainer-webapp/graph-builder/"))]]
    await u.effective_message.reply_text(
        "📈 *Побудова графіків*\\n\\n"
        "Навчись будувати графіки:\\n"
        "• Лінійна функція y = kx + b\\n"
        "• Квадратична y = a(x-p)² + q\\n"
        "• Гіпербола y = k/x\\n"
        "• Модуль |x|\\n"
        "• Корінь √x\\n\\n"
        "Став точки на координатній площині!",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )
'''
    # Insert after cmd_parity_trainer
    pattern = r'(async def cmd_parity_trainer\(u: Update, c: ContextTypes\.DEFAULT_TYPE\):.*?(?=\nasync def |\nclass |\n# ))'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        insert_pos = match.end()
        content = content[:insert_pos] + func_code + content[insert_pos:]
        changes.append("FUNCTION_ADDED")

# 2. Add callback handler
if 'menu_graph_builder' not in content:
    pattern = r'(elif query\.data == "menu_parity_trainer":\s*\n\s*await cmd_parity_trainer\(upd, ctx\))'
    replacement = r'''\1
    elif query.data == "menu_graph_builder":
        await cmd_graph_builder(upd, ctx)'''
    new_content = re.sub(pattern, replacement, content)
    if new_content != content:
        content = new_content
        changes.append("CALLBACK_ADDED")

# 3. Add menu button
if 'callback_data="menu_graph_builder"' not in content:
    pattern = r'(\[InlineKeyboardButton\("[^"]*Парність функцій[^"]*", callback_data="menu_parity_trainer"\)\],)'
    replacement = r'''\1
                [InlineKeyboardButton("📈 Побудова графіків", callback_data="menu_graph_builder")],'''
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
