#!/usr/bin/env python3
"""
Fix graph trainers in menu:
1. menu_graph_trainer -> calls built-in cmd_graph_trainer (keep as is for users who use it)
2. Add new: menu_webapp_transforms -> our WebApp /graphs/
3. Add new: menu_webapp_builder -> our WebApp /graph-builder/

Update main menu to show our webapps with clear names
"""

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add handlers for new webapp callbacks after menu_graph_builder
old_handlers = '''    elif query.data == "menu_graph_builder":
        await cmd_graph_builder(upd, ctx)'''

new_handlers = '''    elif query.data == "menu_graph_builder":
        await cmd_graph_builder(upd, ctx)
    elif query.data == "menu_webapp_transforms":
        await cmd_transform_trainer(upd, ctx)
    elif query.data == "menu_webapp_builder":
        await cmd_graph_builder(upd, ctx)'''

if old_handlers in content:
    content = content.replace(old_handlers, new_handlers)
    print("1. Handlers added")
else:
    print("1. Handlers already exist or pattern not found")

# 2. Update main menu - replace confusing graph entries
# Find the menu section and update it
old_menu = '''[InlineKeyboardButton("📐 ФСМ", callback_data="menu_fsm_trainer"),
         InlineKeyboardButton("📈 Графіки", callback_data="menu_graph_trainer")],
        [InlineKeyboardButton("📊 Квадратні рівн.", callback_data="menu_quadratic_trainer"),
         InlineKeyboardButton("🔺 Трикутник", callback_data="menu_triangle_trainer")],
        [InlineKeyboardButton("📊 Парність", callback_data="menu_parity_trainer"),
         InlineKeyboardButton("💯 Відсотки", callback_data="menu_percent_trainer")],
        [InlineKeyboardButton("⚡ Степені", callback_data="menu_powers_trainer"),
         InlineKeyboardButton("🎴 Картки", callback_data="menu_flashcards_webapp")],'''

new_menu = '''[InlineKeyboardButton("📐 ФСМ", callback_data="menu_fsm_trainer"),
         InlineKeyboardButton("📊 Квадратні", callback_data="menu_quadratic_trainer")],
        [InlineKeyboardButton("🔺 Трикутник", callback_data="menu_triangle_trainer"),
         InlineKeyboardButton("📊 Парність", callback_data="menu_parity_trainer")],
        [InlineKeyboardButton("💯 Відсотки", callback_data="menu_percent_trainer"),
         InlineKeyboardButton("⚡ Степені", callback_data="menu_powers_trainer")],
        [InlineKeyboardButton("📈 Трансформації", callback_data="menu_webapp_transforms"),
         InlineKeyboardButton("✏️ Будівник", callback_data="menu_webapp_builder")],
        [InlineKeyboardButton("🎴 Картки", callback_data="menu_flashcards_webapp")],'''

if old_menu in content:
    content = content.replace(old_menu, new_menu)
    print("2. Menu updated")
else:
    print("2. Menu pattern not found, trying to find current state...")
    if "menu_graph_trainer" in content:
        print("   menu_graph_trainer still exists in file")

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
