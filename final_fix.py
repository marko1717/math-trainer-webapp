#!/usr/bin/env python3
"""
Final fix - rename open_trainers_menu to webtrainers_menu to avoid conflict
with trainers_menu from trainer_handlers_with_options.py
"""

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Rename open_trainers_menu to webtrainers_menu
content = content.replace('open_trainers_menu', 'webtrainers_menu')

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("RENAMED: open_trainers_menu -> webtrainers_menu")
