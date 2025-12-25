#!/usr/bin/env python3
"""
Fix the trainer callback pattern conflict.
The pattern ^trainer_|^trainers_menu$ catches both:
1. Internal trainers (trainer_percentage, trainer_power, trainer_polynomial)
2. WebApp trainers (trainer_fsm, trainer_graphs, etc.)

Solution: Change the pattern to only match internal trainers explicitly.
"""

with open('/home/marko17/bot-tg/quiz-bot-2.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Old pattern that catches everything
old_pattern = 'pattern=r"^trainer_|^trainers_menu$"'

# New pattern that only matches the internal trainers from trainer_handlers_with_options.py
# These are: trainer_percentage, trainer_power, trainer_polynomial, trainer_stats, trainer_answer
new_pattern = 'pattern=r"^trainer_(percentage|power|polynomial|stats|answer)|^trainers_menu$"'

if old_pattern in content:
    content = content.replace(old_pattern, new_pattern)
    with open('/home/marko17/bot-tg/quiz-bot-2.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("PATTERN_FIXED")
else:
    # Maybe already fixed or different format
    print("PATTERN_NOT_FOUND - checking current state...")
    import re
    match = re.search(r'handle_trainer_callbacks.*?pattern.*?$', content, re.MULTILINE)
    if match:
        print(f"Current pattern: {match.group()}")
    else:
        print("No pattern found")
