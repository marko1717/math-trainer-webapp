#!/usr/bin/env python3
"""
Replace the single "Тренажери" button with individual trainer buttons in main menu
"""

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the trainers menu button with individual buttons
old_menu = '''[InlineKeyboardButton("📈 Тренажер графіків", callback_data="menu_graph_trainer")],
                [InlineKeyboardButton("🎮 Тренажери", callback_data="webtrainers_menu")],'''

new_menu = '''[InlineKeyboardButton("📐 ФСМ", callback_data="menu_fsm_trainer"),
         InlineKeyboardButton("📈 Графіки", callback_data="menu_graph_trainer")],
        [InlineKeyboardButton("📊 Квадратні рівн.", callback_data="menu_quadratic_trainer"),
         InlineKeyboardButton("🔺 Трикутник", callback_data="menu_triangle_trainer")],
        [InlineKeyboardButton("📊 Парність", callback_data="menu_parity_trainer"),
         InlineKeyboardButton("💯 Відсотки", callback_data="menu_percent_trainer")],
        [InlineKeyboardButton("⚡ Степені", callback_data="menu_powers_trainer"),
         InlineKeyboardButton("🎴 Картки", callback_data="menu_flashcards_webapp")],'''

if old_menu in content:
    content = content.replace(old_menu, new_menu)
    with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("MENU_UPDATED")
else:
    print("OLD_MENU_NOT_FOUND - trying alternative...")
    # Try simpler replacement
    if 'webtrainers_menu' in content:
        print("Found webtrainers_menu in file")
