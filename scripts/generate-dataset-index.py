#!/usr/bin/env python3
"""
Dataset Index Generator

public/data/dataset 폴더를 스캔하여 모든 데이터셋의 메타데이터를 생성합니다.
폴더 구조(db, ds, os 등)를 카테고리로 사용하여 자동으로 분류합니다.
"""

import json
import os
from pathlib import Path
from typing import List, Dict, Any

def scan_datasets(dataset_dir: Path) -> List[Dict[str, Any]]:
    """
    dataset 디렉토리를 스캔하여 모든 JSON 파일의 메타데이터를 수집합니다.

    Returns:
        List of dataset metadata with category, path, and summary info
    """
    datasets = []

    # dataset 디렉토리의 모든 하위 폴더를 순회
    for category_dir in sorted(dataset_dir.iterdir()):
        if not category_dir.is_dir():
            continue

        # README.md는 건너뛰기
        if category_dir.name.startswith('.') or category_dir.name == 'README.md':
            continue

        category = category_dir.name  # db, ds, os 등

        # 카테고리 폴더 내의 모든 JSON 파일 찾기
        for json_file in category_dir.glob('*.json'):
            try:
                # JSON 파일 읽기
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                # 상대 경로 생성 (브라우저에서 fetch할 경로)
                relative_path = f"/data/dataset/{category}/{json_file.name}"

                # 메타데이터 수집
                dataset_info = {
                    "category": category,
                    "path": relative_path,
                    "name": data.get("name", json_file.stem),
                    "description": data.get("description", ""),
                    "cardCount": len(data.get("cards", [])),
                    "fileName": json_file.name
                }

                datasets.append(dataset_info)
                print(f"✓ Found: {category}/{json_file.name} ({dataset_info['cardCount']} cards)")

            except json.JSONDecodeError as e:
                print(f"✗ Error parsing {json_file}: {e}")
            except Exception as e:
                print(f"✗ Error reading {json_file}: {e}")

    return datasets

def generate_index(dataset_dir: Path, output_file: Path):
    """
    index.json 파일을 생성합니다.
    """
    print("Scanning datasets...\n")

    datasets = scan_datasets(dataset_dir)

    # 카테고리별로 그룹화
    categories = {}
    for dataset in datasets:
        category = dataset["category"]
        if category not in categories:
            categories[category] = []
        categories[category].append(dataset)

    # index.json 데이터 구조
    index_data = {
        "version": "1.0.0",
        "generatedAt": "AUTO_GENERATED",
        "totalDatasets": len(datasets),
        "categories": categories,
        "datasets": datasets
    }

    # index.json 파일 저장
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Generated index.json:")
    print(f"   Total datasets: {len(datasets)}")
    print(f"   Categories: {list(categories.keys())}")
    for category, items in categories.items():
        print(f"   - {category}: {len(items)} dataset(s)")
    print(f"\n   Saved to: {output_file}")

if __name__ == '__main__':
    # 경로 설정
    script_dir = Path(__file__).parent
    dataset_dir = script_dir.parent / 'public' / 'data' / 'dataset'
    output_file = dataset_dir / 'index.json'

    if not dataset_dir.exists():
        print(f"Error: Dataset directory not found: {dataset_dir}")
        exit(1)

    generate_index(dataset_dir, output_file)
