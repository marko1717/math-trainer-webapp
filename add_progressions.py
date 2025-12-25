#!/usr/bin/env python3
"""
Add arithmetic and geometric progression trainers to the bot
"""

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add cmd functions for progressions (after cmd_powers_trainer)
progression_functions = '''
async def cmd_arithmetic_trainer(u: Update, c: ContextTypes.DEFAULT_TYPE):
    """Запуск Web App тренажера арифметичної прогресії"""
    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton(
            "📐 Відкрити тренажер",
            web_app=WebAppInfo(url="https://marko1717.github.io/math-trainer-webapp/arithmetic/")
        )],
        [InlineKeyboardButton("↩️ Назад", callback_data="back_to_menu")]
    ])

    text = """📐 *Арифметична прогресія*

🎯 *Теми тренажера:*
• Різниця прогресії (d)
• Формула n-го члена
• Сума n перших членів
• Середнє арифметичне
• Пропущений член

📚 Теорія + практика + пояснення ШІ

Натисніть кнопку щоб почати:"""

    if hasattr(u, "callback_query") and u.callback_query:
        await u.callback_query.message.edit_text(
            text,
            reply_markup=keyboard,
            parse_mode="Markdown"
        )
    else:
        await u.message.reply_text(
            text,
            reply_markup=keyboard,
            parse_mode="Markdown"
        )


async def cmd_geometric_trainer(u: Update, c: ContextTypes.DEFAULT_TYPE):
    """Запуск Web App тренажера геометричної прогресії"""
    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton(
            "📊 Відкрити тренажер",
            web_app=WebAppInfo(url="https://marko1717.github.io/math-trainer-webapp/geometric/")
        )],
        [InlineKeyboardButton("↩️ Назад", callback_data="back_to_menu")]
    ])

    text = """📊 *Геометрична прогресія*

🎯 *Теми тренажера:*
• Знаменник прогресії (q)
• Формула n-го члена
• Сума n перших членів
• Середнє геометричне
• Пропущений член

📚 Теорія + практика + пояснення ШІ

Натисніть кнопку щоб почати:"""

    if hasattr(u, "callback_query") and u.callback_query:
        await u.callback_query.message.edit_text(
            text,
            reply_markup=keyboard,
            parse_mode="Markdown"
        )
    else:
        await u.message.reply_text(
            text,
            reply_markup=keyboard,
            parse_mode="Markdown"
        )

'''

# Find where to insert (after cmd_powers_trainer)
insert_marker = 'async def cmd_powers_trainer'
if insert_marker in content:
    # Find the end of cmd_powers_trainer function
    idx = content.find(insert_marker)
    # Find the next function definition
    next_func = content.find('\nasync def ', idx + 100)
    if next_func > 0:
        content = content[:next_func] + progression_functions + content[next_func:]
        print("1. Added cmd_arithmetic_trainer and cmd_geometric_trainer functions")
else:
    print("1. FAILED: Could not find insertion point for functions")

# 2. Add menu buttons
old_menu = '''[InlineKeyboardButton("⚡ Степені", callback_data="menu_powers_trainer"),
         InlineKeyboardButton("📈 Трансформації", callback_data="menu_webapp_transforms")],'''

new_menu = '''[InlineKeyboardButton("⚡ Степені", callback_data="menu_powers_trainer"),
         InlineKeyboardButton("📐 Арифм. прогр.", callback_data="menu_arithmetic_trainer")],
        [InlineKeyboardButton("📊 Геом. прогр.", callback_data="menu_geometric_trainer"),
         InlineKeyboardButton("📈 Трансформації", callback_data="menu_webapp_transforms")],'''

if old_menu in content:
    content = content.replace(old_menu, new_menu)
    print("2. Added menu buttons for progressions")
else:
    print("2. Menu pattern not found, trying alternative...")
    # Try adding after powers
    if 'menu_powers_trainer' in content and 'menu_arithmetic_trainer' not in content:
        # Add handlers at least
        print("2. Will add handlers only")

# 3. Add callback handlers
old_handlers = '''    elif query.data == "menu_powers_trainer":
        await cmd_powers_trainer(upd, ctx)'''

new_handlers = '''    elif query.data == "menu_powers_trainer":
        await cmd_powers_trainer(upd, ctx)
    elif query.data == "menu_arithmetic_trainer":
        await cmd_arithmetic_trainer(upd, ctx)
    elif query.data == "menu_geometric_trainer":
        await cmd_geometric_trainer(upd, ctx)'''

if old_handlers in content and 'menu_arithmetic_trainer' not in content.split('menu_powers_trainer')[1][:300]:
    content = content.replace(old_handlers, new_handlers)
    print("3. Added callback handlers")
else:
    if 'menu_arithmetic_trainer' in content:
        print("3. Handlers already exist")
    else:
        print("3. Handler pattern not found")

# Save
with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("DONE")
