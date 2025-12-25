#!/usr/bin/env python3
"""
Rename trainer callbacks to webapp_ to avoid any conflicts.
trainer_fsm -> webapp_fsm
trainer_graphs -> webapp_graphs
etc.
"""

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Rename all webapp trainer callbacks from trainer_ to webapp_
renames = [
    ('trainer_fsm', 'webapp_fsm'),
    ('trainer_graphs', 'webapp_graphs'),
    ('trainer_quadratic', 'webapp_quadratic'),
    ('trainer_triangle', 'webapp_triangle'),
    ('trainer_parity', 'webapp_parity'),
    ('trainer_graph_builder', 'webapp_graph_builder'),
    ('trainer_flashcards', 'webapp_flashcards'),
    ('trainer_percent', 'webapp_percent'),
    ('trainer_powers', 'webapp_powers'),
    ('menu_trainers', 'open_trainers_menu'),
]

changes = []
for old, new in renames:
    if old in content:
        content = content.replace(f'"{old}"', f'"{new}"')
        changes.append(f'{old} -> {new}')

if changes:
    with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("RENAMED:")
    for c in changes:
        print(f"  {c}")
else:
    print("NO_CHANGES")
