#!/usr/bin/env python3
"""
Fix bot menu:
1. Remove duplicate trainer buttons
2. Add single "Trainers" button that opens submenu
3. Add all new trainers
"""
import re

# Read bot file
with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

changes = []

# 1. Add trainers submenu handler function if not exists
if 'cmd_trainers_menu' not in content:
    trainers_menu_func = '''

async def cmd_trainers_menu(u: Update, c: ContextTypes.DEFAULT_TYPE):
    """Show trainers submenu with all available trainers."""
    keyboard = [
        [InlineKeyboardButton("📐 ФСМ (формули скороченого множення)", callback_data="trainer_fsm")],
        [InlineKeyboardButton("📈 Трансформації графіків", callback_data="trainer_graphs")],
        [InlineKeyboardButton("📊 Квадратні рівняння", callback_data="trainer_quadratic")],
        [InlineKeyboardButton("📐 Прямокутний трикутник", callback_data="trainer_triangle")],
        [InlineKeyboardButton("📊 Парність функцій", callback_data="trainer_parity")],
        [InlineKeyboardButton("📈 Побудова графіків", callback_data="trainer_graph_builder")],
        [InlineKeyboardButton("🎴 Флеш-картки", callback_data="trainer_flashcards")],
        [InlineKeyboardButton("💯 Відсотки", callback_data="trainer_percent")],
        [InlineKeyboardButton("⚡ Степені", callback_data="trainer_powers")],
        [InlineKeyboardButton("⬅️ Назад", callback_data="back_to_main_menu")]
    ]
    await u.effective_message.reply_text(
        "🎮 *Тренажери*\\n\\n"
        "Обери тренажер для практики:",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )


async def cmd_percent_trainer(u: Update, c: ContextTypes.DEFAULT_TYPE):
    """Percent trainer."""
    keyboard = [[InlineKeyboardButton("Почати тренування", web_app=WebAppInfo(url="https://marko1717.github.io/math-trainer-webapp/percent/"))]]
    await u.effective_message.reply_text(
        "💯 *Відсотки*\\n\\n"
        "Навчись розв\\'язувати задачі на відсотки:\\n"
        "• Знайти відсоток від числа\\n"
        "• Знайти число за відсотком\\n"
        "• Пропорції\\n"
        "• Збільшення/зменшення на %\\n\\n"
        "3 рівні складності + AI підказки!",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )


async def cmd_powers_trainer(u: Update, c: ContextTypes.DEFAULT_TYPE):
    """Powers/exponents trainer."""
    keyboard = [[InlineKeyboardButton("Почати тренування", web_app=WebAppInfo(url="https://marko1717.github.io/math-trainer-webapp/powers/"))]]
    await u.effective_message.reply_text(
        "⚡ *Степені*\\n\\n"
        "Вивчи властивості степенів:\\n"
        "• aⁿ × aᵐ = aⁿ⁺ᵐ\\n"
        "• aⁿ ÷ aᵐ = aⁿ⁻ᵐ\\n"
        "• (aⁿ)ᵐ = aⁿᵐ\\n"
        "• Від\\'ємні показники\\n"
        "• Вирази зі степенями\\n\\n"
        "3 рівні складності + AI підказки!",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )
'''
    # Find a good place to insert - after cmd_flashcards_webapp
    pattern = r'(async def cmd_flashcards_webapp\(u: Update, c: ContextTypes\.DEFAULT_TYPE\):.*?(?=\nasync def |\nclass |\n# ))'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        insert_pos = match.end()
        content = content[:insert_pos] + trainers_menu_func + content[insert_pos:]
        changes.append("TRAINERS_MENU_ADDED")

# 2. Add callback handlers for trainers submenu
trainer_callbacks = '''
        elif query.data == "menu_trainers":
            await cmd_trainers_menu(upd, ctx)
        elif query.data == "trainer_fsm":
            await cmd_fsm_trainer(upd, ctx)
        elif query.data == "trainer_graphs":
            await cmd_transform_trainer(upd, ctx)
        elif query.data == "trainer_quadratic":
            await cmd_quadratic_trainer(upd, ctx)
        elif query.data == "trainer_triangle":
            await cmd_triangle_trainer(upd, ctx)
        elif query.data == "trainer_parity":
            await cmd_parity_trainer(upd, ctx)
        elif query.data == "trainer_graph_builder":
            await cmd_graph_builder(upd, ctx)
        elif query.data == "trainer_flashcards":
            await cmd_flashcards_webapp(upd, ctx)
        elif query.data == "trainer_percent":
            await cmd_percent_trainer(upd, ctx)
        elif query.data == "trainer_powers":
            await cmd_powers_trainer(upd, ctx)'''

if 'menu_trainers' not in content:
    # Find where to insert - after menu_flashcards_webapp handler
    pattern = r'(elif query\.data == "menu_flashcards_webapp":\s*\n\s*await cmd_flashcards_webapp\(upd, ctx\))'
    if re.search(pattern, content):
        content = re.sub(pattern, r'\1' + trainer_callbacks, content)
        changes.append("TRAINER_CALLBACKS_ADDED")

# 3. Update main menu to have single "Trainers" button instead of many
# Find the menu keyboard section and replace individual trainer buttons with one
old_menu_patterns = [
    r'\[InlineKeyboardButton\("[^"]*ФСМ[^"]*", callback_data="menu_fsm_trainer"\)\],?\s*\n?',
    r'\[InlineKeyboardButton\("[^"]*Трансформації[^"]*", callback_data="menu_transform_trainer"\)\],?\s*\n?',
    r'\[InlineKeyboardButton\("[^"]*Квадратні рівняння[^"]*", callback_data="menu_quadratic_trainer"\)\],?\s*\n?',
    r'\[InlineKeyboardButton\("[^"]*Прямокутний трикутник[^"]*", callback_data="menu_triangle_trainer"\)\],?\s*\n?',
    r'\[InlineKeyboardButton\("[^"]*Парність функцій[^"]*", callback_data="menu_parity_trainer"\)\],?\s*\n?',
    r'\[InlineKeyboardButton\("[^"]*Побудова графіків[^"]*", callback_data="menu_graph_builder"\)\],?\s*\n?',
    r'\[InlineKeyboardButton\("[^"]*Флеш-картки[^"]*", callback_data="menu_flashcards_webapp"\)\],?\s*\n?',
]

for pattern in old_menu_patterns:
    if re.search(pattern, content):
        content = re.sub(pattern, '', content)
        changes.append("REMOVED_OLD_BUTTON")

# 4. Add new "Trainers" button to menu if not exists
if 'callback_data="menu_trainers"' not in content:
    # Find InlineKeyboardMarkup in menu and add trainers button
    # Look for a pattern like [InlineKeyboardButton("something", callback_data="menu_
    pattern = r'(\[InlineKeyboardButton\("[^"]*", callback_data="menu_[a-z_]+"\)\],\s*\n)'
    match = re.search(pattern, content)
    if match:
        # Add after first menu button found
        trainers_button = '                [InlineKeyboardButton("🎮 Тренажери", callback_data="menu_trainers")],\n'
        # Find a good spot - preferably after existing menu items
        content = content.replace(
            match.group(1),
            match.group(1) + trainers_button,
            1  # Only replace first occurrence
        )
        changes.append("TRAINERS_BUTTON_ADDED")

# Save changes
if changes:
    with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("CHANGES: " + ", ".join(set(changes)))
else:
    print("NO_CHANGES")
