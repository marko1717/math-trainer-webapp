#!/usr/bin/env python3
"""
Export all images from Telegram bot to local files
and generate JSON for web trainer
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

# Directories
DATA_DIR = Path("/home/marko17/bot-tg/bot_data")
EXPORT_DIR = Path("/home/marko17/nmt_images")
EXPORT_DIR.mkdir(exist_ok=True)

async def get_file_url(session, file_id):
    """Get download URL for a Telegram file_id"""
    try:
        async with session.get(f"{BASE_URL}/getFile?file_id={file_id}") as resp:
            data = await resp.json()
            if data.get("ok"):
                file_path = data["result"]["file_path"]
                return f"{FILE_URL}/{file_path}"
    except Exception as e:
        print(f"Error getting file URL for {file_id}: {e}")
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
        print(f"Error downloading {url}: {e}")
    return False

async def process_test_sets():
    """Process test_sets.json and download all images"""
    test_sets_path = DATA_DIR / "test_sets.json"

    if not test_sets_path.exists():
        print("test_sets.json not found!")
        return []

    with open(test_sets_path, 'r', encoding='utf-8') as f:
        test_sets = json.load(f)

    print(f"Found {len(test_sets)} test sets")

    exported_tests = []
    file_ids_processed = set()

    async with aiohttp.ClientSession() as session:
        for test_id, test_data in test_sets.items():
            print(f"\nProcessing: {test_data.get('name', test_id)}")

            exported_test = {
                "id": test_id,
                "name": test_data.get("name", ""),
                "tasks": []
            }

            tasks = test_data.get("tasks", [])
            for i, task in enumerate(tasks):
                task_num = task.get("task_num", i + 1)
                task_type = task.get("type", "quiz")
                correct = task.get("correct", "")

                # Process task photo
                photo_id = task.get("photo", "")
                photo_filename = ""
                if photo_id and photo_id not in file_ids_processed:
                    photo_filename = f"{test_id}_task{task_num}.jpg"
                    photo_path = EXPORT_DIR / photo_filename

                    url = await get_file_url(session, photo_id)
                    if url:
                        success = await download_file(session, url, photo_path)
                        if success:
                            print(f"  ✓ Downloaded task {task_num} photo")
                            file_ids_processed.add(photo_id)
                        else:
                            photo_filename = ""

                # Process solution photo
                solution_id = task.get("solution_photo", "")
                solution_filename = ""
                if solution_id and solution_id not in file_ids_processed:
                    solution_filename = f"{test_id}_task{task_num}_solution.jpg"
                    solution_path = EXPORT_DIR / solution_filename

                    url = await get_file_url(session, solution_id)
                    if url:
                        success = await download_file(session, url, solution_path)
                        if success:
                            print(f"  ✓ Downloaded task {task_num} solution")
                            file_ids_processed.add(solution_id)
                        else:
                            solution_filename = ""

                exported_test["tasks"].append({
                    "task_num": task_num,
                    "type": task_type,
                    "correct": correct,
                    "photo": photo_filename,
                    "solution_photo": solution_filename
                })

            exported_tests.append(exported_test)

    return exported_tests

async def process_quizzes():
    """Process quizzes.json and download all images"""
    quizzes_path = DATA_DIR / "quizzes.json"

    if not quizzes_path.exists():
        print("quizzes.json not found!")
        return []

    with open(quizzes_path, 'r', encoding='utf-8') as f:
        quizzes = json.load(f)

    print(f"\nFound {len(quizzes)} quizzes")

    exported_quizzes = []
    file_ids_processed = set()

    async with aiohttp.ClientSession() as session:
        for quiz_id, quiz_data in quizzes.items():
            photo_id = quiz_data.get("photo_id", "")
            photo_filename = ""

            if photo_id and photo_id not in file_ids_processed:
                photo_filename = f"quiz_{quiz_id}.jpg"
                photo_path = EXPORT_DIR / photo_filename

                url = await get_file_url(session, photo_id)
                if url:
                    success = await download_file(session, url, photo_path)
                    if success:
                        print(f"  ✓ Downloaded quiz {quiz_id}")
                        file_ids_processed.add(photo_id)
                    else:
                        photo_filename = ""

            exported_quizzes.append({
                "id": quiz_id,
                "type": quiz_data.get("type", "multiple"),
                "photo": photo_filename,
                "correct": quiz_data.get("correct_option", ""),
                "hashtag": quiz_data.get("hashtag", ""),
                "question_text": quiz_data.get("question_text", ""),
                "explanation": quiz_data.get("explanation", ""),
                "hint": quiz_data.get("hint", "")
            })

    return exported_quizzes

async def main():
    print("=" * 50)
    print("NMT Images Export Tool")
    print("=" * 50)

    # Process test sets
    test_sets = await process_test_sets()

    # Process quizzes
    quizzes = await process_quizzes()

    # Save exported data
    export_data = {
        "test_sets": test_sets,
        "quizzes": quizzes
    }

    export_json_path = EXPORT_DIR / "nmt_data.json"
    with open(export_json_path, 'w', encoding='utf-8') as f:
        json.dump(export_data, f, ensure_ascii=False, indent=2)

    print(f"\n{'=' * 50}")
    print(f"Export complete!")
    print(f"Images saved to: {EXPORT_DIR}")
    print(f"Data saved to: {export_json_path}")
    print(f"Test sets: {len(test_sets)}")
    print(f"Quizzes: {len(quizzes)}")

    # Count total images
    image_count = len(list(EXPORT_DIR.glob("*.jpg")))
    print(f"Total images: {image_count}")

if __name__ == "__main__":
    asyncio.run(main())
