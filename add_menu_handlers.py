#!/usr/bin/env python3
"""
Add handlers for menu_percent_trainer and menu_powers_trainer
"""

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find where to add handlers - after menu_parity_trainer
old_handler = '''    elif query.data == "menu_parity_trainer":
        await cmd_parity_trainer(upd, ctx)'''

new_handlers = '''    elif query.data == "menu_parity_trainer":
        await cmd_parity_trainer(upd, ctx)
    elif query.data == "menu_percent_trainer":
        await cmd_percent_trainer(upd, ctx)
    elif query.data == "menu_powers_trainer":
        await cmd_powers_trainer(upd, ctx)'''

if old_handler in content and 'menu_percent_trainer' not in content.split('menu_parity_trainer')[1][:200]:
    content = content.replace(old_handler, new_handlers)
    with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("HANDLERS_ADDED")
else:
    # Check if already added
    if 'menu_percent_trainer' in content:
        print("HANDLERS_ALREADY_EXIST")
    else:
        print("COULD_NOT_ADD")
