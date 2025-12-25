#!/usr/bin/env python3
import re

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

changes_made = []

# 1. Add callback handler for menu_parity_trainer
if 'menu_parity_trainer' not in content:
    # Find where menu_triangle_trainer handler is and add after it
    pattern = r'(elif query\.data == "menu_triangle_trainer":\s*\n\s*await cmd_triangle_trainer\(upd, ctx\))'
    replacement = r'''\1
        elif query.data == "menu_parity_trainer":
            await cmd_parity_trainer(upd, ctx)'''

    new_content = re.sub(pattern, replacement, content)
    if new_content != content:
        content = new_content
        changes_made.append("CALLBACK_ADDED")

# 2. Add button to menu after triangle trainer button
if 'menu_parity_trainer' not in content or 'callback_data="menu_parity_trainer"' not in content:
    # Find the triangle trainer button line and add parity button after it
    pattern = r'(\[InlineKeyboardButton\("[^"]*Прямокутний трикутник[^"]*", callback_data="menu_triangle_trainer"\)\],)'
    replacement = r'''\1
                [InlineKeyboardButton("📊 Парність функцій", callback_data="menu_parity_trainer")],'''

    new_content = re.sub(pattern, replacement, content)
    if new_content != content:
        content = new_content
        changes_made.append("BUTTON_ADDED")

if changes_made:
    with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("CHANGES: " + ", ".join(changes_made))
else:
    print("NO_CHANGES_NEEDED")
