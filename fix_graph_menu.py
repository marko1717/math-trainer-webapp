#!/usr/bin/env python3
"""
Fix graph menu to properly separate:
1. Static graphs (cmd_graph)
2. Bot trainer (cmd_graph_trainer)
3. WebApp transform trainer (cmd_transform_trainer)
4. WebApp graph builder (cmd_graph_builder)
"""

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add menu_transform_webapp handler
old_handlers = '''    elif query.data == "menu_graph_trainer":  # ← НОВИЙ ОБРОБНИК
        await cmd_graph_trainer(upd, ctx)

    elif query.data == "menu_fsm_trainer":'''

new_handlers = '''    elif query.data == "menu_graph_trainer":  # БОТ тренажер (теорія/практика)
        await cmd_graph_trainer(upd, ctx)
    elif query.data == "menu_transform_webapp":  # WEBAPP трансформації
        await cmd_transform_trainer(upd, ctx)

    elif query.data == "menu_fsm_trainer":'''

if old_handlers in content:
    content = content.replace(old_handlers, new_handlers)
    print("1. Handler added for menu_transform_webapp")
else:
    print("1. Handler pattern not found")

# 2. Update menu buttons - replace duplicate graph buttons
# Find the menu section and update
old_menu1 = '''[InlineKeyboardButton("📐 ФСМ", callback_data="menu_fsm_trainer"),
         InlineKeyboardButton("📈 Графіки", callback_data="menu_graph_trainer")],'''

new_menu1 = '''[InlineKeyboardButton("📐 ФСМ", callback_data="menu_fsm_trainer"),
         InlineKeyboardButton("📊 Графіки (бот)", callback_data="menu_graph_trainer")],'''

if old_menu1 in content:
    content = content.replace(old_menu1, new_menu1)
    print("2. First menu row updated")

# 3. Second row with graphs - change to transform webapp
old_menu2 = '''[InlineKeyboardButton("📊 Парність", callback_data="menu_parity_trainer"),
         InlineKeyboardButton("💯 Відсотки", callback_data="menu_percent_trainer")],
        [InlineKeyboardButton("⚡ Степені", callback_data="menu_powers_trainer"),
         InlineKeyboardButton("🎴 Картки", callback_data="menu_flashcards_webapp")],'''

new_menu2 = '''[InlineKeyboardButton("📊 Парність", callback_data="menu_parity_trainer"),
         InlineKeyboardButton("💯 Відсотки", callback_data="menu_percent_trainer")],
        [InlineKeyboardButton("⚡ Степені", callback_data="menu_powers_trainer"),
         InlineKeyboardButton("📈 Трансформації", callback_data="menu_transform_webapp")],
        [InlineKeyboardButton("✏️ Побудова графіків", callback_data="menu_graph_builder"),
         InlineKeyboardButton("🎴 Картки", callback_data="menu_flashcards_webapp")],'''

if old_menu2 in content:
    content = content.replace(old_menu2, new_menu2)
    print("3. Menu updated with transform and graph builder")
else:
    print("3. Menu pattern not found - trying alternative")

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("DONE")
