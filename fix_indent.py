#!/usr/bin/env python3
"""Fix indentation issues in bot file"""

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the indentation issue - wrong indentation after menu_flashcards_webapp
old_text = '''    elif query.data == "menu_flashcards_webapp":
        await cmd_flashcards_webapp(upd, ctx)
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

new_text = '''    elif query.data == "menu_flashcards_webapp":
        await cmd_flashcards_webapp(upd, ctx)
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

if old_text in content:
    content = content.replace(old_text, new_text)
    with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("FIXED")
else:
    print("PATTERN_NOT_FOUND")
