#!/usr/bin/env python3
"""Add missing trainer functions"""
import re

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

changes = []

# 1. Add cmd_trainers_menu if not exists
if 'async def cmd_trainers_menu' not in content:
    func_code = '''

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
        [InlineKeyboardButton("⬅️ Назад до меню", callback_data="start")]
    ]
    await u.effective_message.reply_text(
        "🎮 *Тренажери*\\n\\n"
        "Обери тренажер для практики:",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )
'''
    # Insert after cmd_flashcards_webapp
    pattern = r'(async def cmd_flashcards_webapp\(u: Update, c: ContextTypes\.DEFAULT_TYPE\):.*?(?=\nasync def |\nclass |\n# [A-Z]))'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        insert_pos = match.end()
        content = content[:insert_pos] + func_code + content[insert_pos:]
        changes.append("TRAINERS_MENU_ADDED")

# 2. Add cmd_percent_trainer if not exists
if 'async def cmd_percent_trainer' not in content:
    func_code = '''

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
'''
    # Insert after cmd_trainers_menu or cmd_flashcards_webapp
    if 'async def cmd_trainers_menu' in content:
        pattern = r'(async def cmd_trainers_menu\(u: Update, c: ContextTypes\.DEFAULT_TYPE\):.*?(?=\nasync def |\nclass |\n# [A-Z]))'
    else:
        pattern = r'(async def cmd_flashcards_webapp\(u: Update, c: ContextTypes\.DEFAULT_TYPE\):.*?(?=\nasync def |\nclass |\n# [A-Z]))'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        insert_pos = match.end()
        content = content[:insert_pos] + func_code + content[insert_pos:]
        changes.append("PERCENT_TRAINER_ADDED")

# 3. Add cmd_powers_trainer if not exists
if 'async def cmd_powers_trainer' not in content:
    func_code = '''

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
    # Insert after cmd_percent_trainer
    if 'async def cmd_percent_trainer' in content:
        pattern = r'(async def cmd_percent_trainer\(u: Update, c: ContextTypes\.DEFAULT_TYPE\):.*?(?=\nasync def |\nclass |\n# [A-Z]))'
    else:
        pattern = r'(async def cmd_flashcards_webapp\(u: Update, c: ContextTypes\.DEFAULT_TYPE\):.*?(?=\nasync def |\nclass |\n# [A-Z]))'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        insert_pos = match.end()
        content = content[:insert_pos] + func_code + content[insert_pos:]
        changes.append("POWERS_TRAINER_ADDED")

if changes:
    with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("CHANGES: " + ", ".join(changes))
else:
    print("NO_CHANGES")
