#!/usr/bin/env python3
"""
Export unique quizzes from Telegram bot and download their images
"""

import os
import json
import asyncio
import aiohttp
import aiofiles
from pathlib import Path

BOT_TOKEN = "8196154557:AAFPjzLPWN834f98lp4x7gJ59L7Azs9xknI"
BASE_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"
FILE_URL = f"https://api.telegram.org/file/bot{BOT_TOKEN}"

DATA_DIR = Path("/home/marko17/bot-tg/bot_data")
EXPORT_DIR = Path("/home/marko17/nmt_images")

async def get_file_url(session, file_id):
    """Get download URL for a Telegram file_id"""
    try:
        async with session.get(f"{BASE_URL}/getFile?file_id={file_id}") as resp:
            data = await resp.json()
            if data.get("ok"):
                file_path = data["result"]["file_path"]
                return f"{FILE_URL}/{file_path}"
    except Exception as e:
        print(f"Error getting file URL: {e}")
    return None

async def download_file(session, url, local_path):
    """Download file from URL to local path"""
    try:
        async with session.get(url) as resp:
            if resp.status == 200:
                async with aiofiles.open(local_path, 'wb') as f:
                    await f.write(await resp.read())
                return True
    except Exception as e:
        print(f"Error downloading: {e}")
    return False

async def main():
    print("=" * 50)
    print("Exporting unique quizzes")
    print("=" * 50)

    # Load existing nmt_data.json
    nmt_data_path = EXPORT_DIR / "nmt_data.json"
    with open(nmt_data_path, 'r', encoding='utf-8') as f:
        nmt_data = json.load(f)

    # Load quizzes
    quizzes_path = DATA_DIR / "quizzes.json"
    with open(quizzes_path, 'r', encoding='utf-8') as f:
        quizzes = json.load(f)

    print(f"Total quizzes in file: {len(quizzes)}")

    # Find unique quizzes by photo_id
    seen_photos = set()
    unique_quizzes = []

    for quiz_id, quiz in quizzes.items():
        photo_id = quiz.get("photo_id", "")
        if not photo_id or photo_id in seen_photos:
            continue

        seen_photos.add(photo_id)

        # Determine type
        quiz_type = "quiz"
        correct = quiz.get("correct_option", "")

        # If answer is a number, it's short answer
        if correct and correct.replace(".", "").replace("-", "").replace(",", "").isdigit():
            quiz_type = "short"

        unique_quizzes.append({
            "id": quiz_id,
            "photo_id": photo_id,
            "type": quiz_type,
            "correct": correct,
            "hashtag": quiz.get("hashtag", ""),
            "hint": quiz.get("hint", ""),
            "explanation": quiz.get("explanation", "")
        })

    print(f"Unique quizzes: {len(unique_quizzes)}")

    # Download images for new quizzes
    async with aiohttp.ClientSession() as session:
        for i, quiz in enumerate(unique_quizzes):
            photo_id = quiz["photo_id"]
            filename = f"quiz_{quiz['id']}.jpg"
            filepath = EXPORT_DIR / filename

            # Check if already exists
            if filepath.exists():
                quiz["photo"] = filename
                continue

            # Download
            url = await get_file_url(session, photo_id)
            if url:
                success = await download_file(session, url, filepath)
                if success:
                    print(f"  ✓ Downloaded quiz {quiz['id']}")
                    quiz["photo"] = filename
                else:
                    quiz["photo"] = ""
            else:
                quiz["photo"] = ""

    # Prepare final quizzes list
    exported_quizzes = []
    for quiz in unique_quizzes:
        if quiz.get("photo"):
            exported_quizzes.append({
                "id": quiz["id"],
                "type": quiz["type"],
                "photo": quiz["photo"],
                "correct": quiz["correct"],
                "hashtag": quiz["hashtag"]
            })

    print(f"Exported quizzes with photos: {len(exported_quizzes)}")

    # Update nmt_data.json
    nmt_data["quizzes"] = exported_quizzes

    # Rename test sets to thematic names
    thematic_names = {
        1: "Вирази та рівняння",
        2: "Планіметрія",
        3: "Функції, нерівності",
        4: "Тригонометрія",
        5: "Похідна, первісна",
        6: "Стереометрія"
    }

    for i, test in enumerate(nmt_data["test_sets"]):
        old_name = test.get("name", "")
        # Extract number from name like "НМТ мікс 3"
        import re
        match = re.search(r'\d+', old_name)
        if match:
            num = int(match.group())
            if num in thematic_names:
                test["name"] = thematic_names[num]

    # Save updated data
    with open(nmt_data_path, 'w', encoding='utf-8') as f:
        json.dump(nmt_data, f, ensure_ascii=False, indent=2)

    print(f"\n{'=' * 50}")
    print("Export complete!")
    print(f"Updated: {nmt_data_path}")
    print(f"Test sets renamed to thematic names")
    print(f"Total quizzes: {len(exported_quizzes)}")

if __name__ == "__main__":
    asyncio.run(main())
