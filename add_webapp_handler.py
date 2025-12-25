#!/usr/bin/env python3
"""
Add a dedicated CallbackQueryHandler for webapp_ callbacks
BEFORE the trainer_handlers pattern.
This ensures webapp trainers are handled first.
"""

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the trainer_handlers line and add webapp handler BEFORE it
old_pattern = '''    # Обробники тренажерів (ОБОВ'ЯЗКОВО ПЕРЕД ЗАГАЛЬНИМ callbacks!)
    app.add_handler(CallbackQueryHandler(
        handle_trainer_callbacks,
        pattern=r"^trainer_(percentage|power|polynomial|stats|answer)|^trainers_menu$"
    ))'''

new_pattern = '''    # WebApp trainers handler (ПЕРШИЙ! перед внутрішніми тренажерами)
    app.add_handler(CallbackQueryHandler(
        callbacks,  # Uses the same general callbacks function
        pattern=r"^webapp_|^open_trainers_menu$"
    ))

    # Обробники внутрішніх тренажерів (percentage, power, polynomial)
    app.add_handler(CallbackQueryHandler(
        handle_trainer_callbacks,
        pattern=r"^trainer_(percentage|power|polynomial|stats|answer)|^trainers_menu$"
    ))'''

if old_pattern in content:
    content = content.replace(old_pattern, new_pattern)
    with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("WEBAPP_HANDLER_ADDED")
else:
    print("PATTERN_NOT_FOUND - trying alternative...")
    # Try to find and add before trainer_handlers
    import re
    pattern = r"(# Обробники тренажерів.*?pattern=r\"\^trainer_\(percentage\|power\|polynomial\|stats\|answer\)\|\^trainers_menu\$\"\s*\))"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        print(f"Found at: {match.start()}")
    else:
        print("Still not found")
