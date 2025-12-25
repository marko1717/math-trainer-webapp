#!/usr/bin/env python3
import re

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Check if parity trainer already exists
if 'cmd_parity_trainer' in content:
    print("ALREADY_EXISTS")
else:
    # Add function after cmd_triangle_trainer function
    parity_func = '''

async def cmd_parity_trainer(u: Update, c: ContextTypes.DEFAULT_TYPE):
    """Parity functions trainer (even/odd)."""
    keyboard = [[InlineKeyboardButton("Почати тренування", web_app=WebAppInfo(url="https://marko1717.github.io/math-trainer-webapp/parity/"))]]
    await u.effective_message.reply_text(
        "📊 *Парні та непарні функції*\\n\\n"
        "Вивчи:\\n"
        "• Визначення парної f(-x) = f(x)\\n"
        "• Визначення непарної f(-x) = -f(x)\\n"
        "• Типові функції\\n"
        "• Графіки та симетрію\\n"
        "• Властивості композицій\\n\\n"
        "3 рівні складності!",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )
'''

    # Find cmd_triangle_trainer and insert after it
    pattern = r'(async def cmd_triangle_trainer\(u: Update, c: ContextTypes\.DEFAULT_TYPE\):.*?(?=\nasync def |\nclass |\n# ))'
    match = re.search(pattern, content, re.DOTALL)

    if match:
        insert_pos = match.end()
        content = content[:insert_pos] + parity_func + content[insert_pos:]

        with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
            f.write(content)
        print("FUNCTION_ADDED")
    else:
        print("PATTERN_NOT_FOUND")
