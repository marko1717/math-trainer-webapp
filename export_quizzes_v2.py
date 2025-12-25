#!/usr/bin/env python3
"""
Export unique quizzes with 'photo' field from Telegram bot
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
    try:
        async with session.get(f"{BASE_URL}/getFile?file_id={file_id}") as resp:
            data = await resp.json()
            if data.get("ok"):
                file_path = data["result"]["file_path"]
                return f"{FILE_URL}/{file_path}"
    except Exception as e:
        print(f"Error: {e}")
    return None

async def download_file(session, url, local_path):
    try:
        async with session.get(url) as resp:
            if resp.status == 200:
                async with aiofiles.open(local_path, 'wb') as f:
                    await f.write(await resp.read())
                return True
    except Exception as e:
        print(f"Download error: {e}")
    return False

async def main():
    print("=" * 50)
    print("Exporting quizzes with 'photo' field")
    print("=" * 50)

    # Load quizzes
    with open(DATA_DIR / "quizzes.json", 'r', encoding='utf-8') as f:
        quizzes = json.load(f)

    # Find unique quizzes with 'photo' field
    seen_photos = set()
    unique_quizzes = []

    for qid, q in quizzes.items():
        photo = q.get('photo', '')
        if not photo or photo in seen_photos:
            continue

        seen_photos.add(photo)
        unique_quizzes.append({
            'id': qid,
            'photo_file_id': photo,
            'solution_file_id': q.get('solution_photo', ''),
            'correct': q.get('correct', ''),
            'type': q.get('type', 'quiz'),
            'tag': q.get('tag', ''),
        })

    print(f"Found {len(unique_quizzes)} unique quizzes")

    # Download images
    downloaded = 0
    exported_quizzes = []

    async with aiohttp.ClientSession() as session:
        for i, quiz in enumerate(unique_quizzes):
            photo_filename = f"quiz_{quiz['id']}.jpg"
            photo_path = EXPORT_DIR / photo_filename

            # Download task photo
            if not photo_path.exists():
                url = await get_file_url(session, quiz['photo_file_id'])
                if url:
                    success = await download_file(session, url, photo_path)
                    if success:
                        downloaded += 1
                        if downloaded % 50 == 0:
                            print(f"  Downloaded {downloaded} images...")

            # Download solution photo if exists
            solution_filename = ""
            if quiz['solution_file_id']:
                solution_filename = f"quiz_{quiz['id']}_solution.jpg"
                solution_path = EXPORT_DIR / solution_filename

                if not solution_path.exists():
                    url = await get_file_url(session, quiz['solution_file_id'])
                    if url:
                        await download_file(session, url, solution_path)

            # Add to export list
            exported_quizzes.append({
                'id': quiz['id'],
                'type': quiz['type'],
                'photo': photo_filename,
                'solution_photo': solution_filename,
                'correct': quiz['correct'],
                'tag': quiz['tag']
            })

    print(f"\nDownloaded {downloaded} new images")

    # Load existing nmt_data.json
    nmt_data_path = EXPORT_DIR / "nmt_data.json"
    with open(nmt_data_path, 'r', encoding='utf-8') as f:
        nmt_data = json.load(f)

    # Update quizzes
    nmt_data['quizzes'] = exported_quizzes

    # Save
    with open(nmt_data_path, 'w', encoding='utf-8') as f:
        json.dump(nmt_data, f, ensure_ascii=False, indent=2)

    print(f"\n{'=' * 50}")
    print("Export complete!")
    print(f"Total quizzes: {len(exported_quizzes)}")
    print(f"With solutions: {sum(1 for q in exported_quizzes if q['solution_photo'])}")

if __name__ == "__main__":
    asyncio.run(main())
