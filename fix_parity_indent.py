#!/usr/bin/env python3

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the indentation issue
old_text = '''    elif query.data == "menu_triangle_trainer":
        await cmd_triangle_trainer(upd, ctx)
        elif query.data == "menu_parity_trainer":
            await cmd_parity_trainer(upd, ctx)'''

new_text = '''    elif query.data == "menu_triangle_trainer":
        await cmd_triangle_trainer(upd, ctx)
    elif query.data == "menu_parity_trainer":
        await cmd_parity_trainer(upd, ctx)'''

if old_text in content:
    content = content.replace(old_text, new_text)
    with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("FIXED")
else:
    print("NOT_FOUND")
