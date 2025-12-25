#!/usr/bin/env python3
"""
Add progression buttons to menu
"""

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add after Картки row
old_menu = '''[InlineKeyboardButton("🎴 Картки", callback_data="menu_flashcards_webapp")],
        [InlineKeyboardButton("📚 Матеріали НМТ (PDF)", callback_data="menu_nmt_materials")],'''

new_menu = '''[InlineKeyboardButton("🎴 Картки", callback_data="menu_flashcards_webapp")],
        [InlineKeyboardButton("📐 Арифм. прогр.", callback_data="menu_arithmetic_trainer"),
         InlineKeyboardButton("📊 Геом. прогр.", callback_data="menu_geometric_trainer")],
        [InlineKeyboardButton("📚 Матеріали НМТ (PDF)", callback_data="menu_nmt_materials")],'''

if old_menu in content:
    content = content.replace(old_menu, new_menu)
    with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("MENU_UPDATED")
else:
    print("PATTERN_NOT_FOUND")
