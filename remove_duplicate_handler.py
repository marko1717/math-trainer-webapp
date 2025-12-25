#!/usr/bin/env python3
"""
Remove the duplicate webapp handler - the general callbacks handler already handles everything.
Just need to make sure webapp_ callbacks reach the callbacks function.
"""

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the duplicate webapp handler that we added
old_text = '''        # WebApp trainers handler (ПЕРШИЙ! перед внутрішніми тренажерами)
    app.add_handler(CallbackQueryHandler(
        callbacks,  # Uses the same general callbacks function
        pattern=r"^webapp_|^open_trainers_menu$"
    ))

    # Обробники внутрішніх тренажерів (percentage, power, polynomial)'''

new_text = '''    # Обробники внутрішніх тренажерів (percentage, power, polynomial)'''

if old_text in content:
    content = content.replace(old_text, new_text)
    with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("DUPLICATE_HANDLER_REMOVED")
else:
    print("Pattern not found, checking alternative...")
    # Try without the extra indent
    old_text2 = '''    # WebApp trainers handler (ПЕРШИЙ! перед внутрішніми тренажерами)
    app.add_handler(CallbackQueryHandler(
        callbacks,  # Uses the same general callbacks function
        pattern=r"^webapp_|^open_trainers_menu$"
    ))

    # Обробники внутрішніх тренажерів'''

    if old_text2 in content:
        content = content.replace(old_text2, '    # Обробники внутрішніх тренажерів')
        with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
            f.write(content)
        print("DUPLICATE_HANDLER_REMOVED (alt)")
    else:
        print("NOT_FOUND")
