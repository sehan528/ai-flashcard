#!/usr/bin/env python3
import json
import os
import time
import random
import string
from pathlib import Path
from datetime import datetime

def generate_id():
    """Generate unique ID"""
    timestamp = int(time.time() * 1000)
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))
    return f"{timestamp}-{random_str}"

def fix_dataset_format(file_path):
    """Fix dataset format by adding missing fields"""
    try:
        print(f"Processing: {file_path}")

        # Read and parse JSON with proper encoding
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # First try to parse - if it fails, we might have formatting issues
        try:
            data = json.loads(content)
        except json.JSONDecodeError as e:
            print(f"  JSON parsing error: {e}")
            print(f"  Attempting to fix JSON formatting...")
            # Try to fix common issues - this is a simple attempt
            # In production, you might need more sophisticated fixing
            return False

        # Add missing top-level fields
        if 'id' not in data:
            data['id'] = generate_id()

        if 'createdAt' not in data:
            data['createdAt'] = datetime.now().isoformat()

        # Add missing card fields
        if 'cards' in data and isinstance(data['cards'], list):
            for card in data['cards']:
                if 'id' not in card:
                    card['id'] = generate_id()

                if 'createdAt' not in card:
                    card['createdAt'] = datetime.now().isoformat()

                if 'studyCount' not in card:
                    card['studyCount'] = 0

        # Write back to file with proper formatting
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"✓ Fixed: {file_path}")
        print(f"  - CardSet ID: {data['id']}")
        print(f"  - Cards: {len(data.get('cards', []))}")
        return True

    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")
        return False

def process_directory(directory):
    """Process all JSON files in directory recursively"""
    dataset_dir = Path(directory)

    if not dataset_dir.exists():
        print(f"Directory not found: {directory}")
        return

    json_files = list(dataset_dir.rglob('*.json'))

    if not json_files:
        print(f"No JSON files found in {directory}")
        return

    print(f"Found {len(json_files)} JSON file(s)\n")

    success_count = 0
    for json_file in json_files:
        if fix_dataset_format(str(json_file)):
            success_count += 1
        print()  # Empty line between files

    print(f"\nProcessed {success_count}/{len(json_files)} files successfully")

if __name__ == '__main__':
    # Get the script directory
    script_dir = Path(__file__).parent
    dataset_dir = script_dir.parent / 'public' / 'dataset'

    print("Fixing dataset formats...\n")
    process_directory(dataset_dir)
    print("\nDone!")
