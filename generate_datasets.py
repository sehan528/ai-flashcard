#!/usr/bin/env python3
"""
Generate JSON dataset files for flashcard datasets by combining
reference_data (questions) and answertemp (AI answers).
"""

import json
import os
import re
import glob
from datetime import datetime
import random
import string

def generate_id():
    """Generate unique ID using timestamp + random string"""
    timestamp = int(datetime.now().timestamp() * 1000)
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"{timestamp}-{random_str}"

def get_current_timestamp():
    """Get current timestamp in ISO format"""
    return datetime.now().isoformat()

def parse_questions(file_path):
    """Parse questions from reference_data markdown file"""
    questions = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            # Skip empty lines and headers (lines starting with ##)
            if line and line.startswith('- '):
                question = line[2:].strip()  # Remove "- " prefix
                if question:
                    questions.append(question)
    return questions

def parse_answers(answer_files):
    """Parse answers from answertemp markdown files"""
    answers = {}

    for file_path in sorted(answer_files):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Try both patterns:
        # Pattern 1: ## 질문 N: ... (Spring format)
        # Pattern 2: ## N. ... (OS, Network format)
        pattern1 = r'## 질문 (\d+):'
        pattern2 = r'## (\d+)\.'

        # Try pattern 1 first
        sections = re.split(pattern1, content)
        if len(sections) <= 1:
            # If pattern 1 didn't match, try pattern 2
            sections = re.split(pattern2, content)

        if len(sections) <= 1:
            # No matches found, skip this file
            continue

        # sections[0] is the file header, then alternating question numbers and content
        for i in range(1, len(sections), 2):
            question_num = int(sections[i])
            answer_content = sections[i + 1].strip() if i + 1 < len(sections) else ""

            # Remove the question text from the answer content
            # The answer starts after the first newline after the question
            lines = answer_content.split('\n', 1)
            if len(lines) > 1:
                answer_content = lines[1].strip()

            # Remove trailing separators (---)
            answer_content = re.sub(r'\n---\s*$', '', answer_content).strip()

            answers[question_num] = answer_content

    return answers

def extract_tags(question, answer, base_tags):
    """Extract relevant tags from question and answer content"""
    tags = base_tags.copy()

    # Add specific tags based on keywords
    keywords_map = {
        'JVM': 'JVM',
        '가비지': 'GC',
        'Garbage': 'GC',
        '메모리': '메모리',
        'Memory': '메모리',
        '스레드': '동시성',
        'Thread': '동시성',
        '동기화': '동기화',
        'Synchronized': '동기화',
        '네트워크': '네트워크',
        'HTTP': 'HTTP',
        'TCP': 'TCP',
        'UDP': 'UDP',
        '세션': '세션',
        'Session': '세션',
        '쿠키': '쿠키',
        'Cookie': '쿠키',
        '프로세스': '프로세스',
        'Process': '프로세스',
        '스케줄링': '스케줄링',
        'Scheduling': '스케줄링',
        '페이지': '가상메모리',
        'Page': '가상메모리',
        '캐시': '캐시',
        'Cache': '캐시',
        'Spring': 'Spring',
        'Bean': 'Bean',
        'AOP': 'AOP',
        'IoC': 'IoC',
        'DI': 'DI',
    }

    text = question + ' ' + answer
    for keyword, tag in keywords_map.items():
        if keyword in text and tag not in tags:
            tags.append(tag)
            if len(tags) >= 5:  # Limit to 5 tags
                break

    return tags[:5]  # Return at most 5 tags

def create_dataset(name, description, questions, answers, base_tags):
    """Create a complete dataset JSON structure"""
    cards = []
    timestamp = get_current_timestamp()

    for i, question in enumerate(questions, 1):
        answer = answers.get(i, "")

        if not answer:
            print(f"Warning: No answer found for question {i}")
            continue

        tags = extract_tags(question, answer, base_tags)

        card = {
            "question": question,
            "answer": answer,
            "type": "essay",
            "tags": tags,
            "id": generate_id(),
            "createdAt": timestamp,
            "studyCount": 0
        }
        cards.append(card)

    return {
        "name": name,
        "description": description,
        "cards": cards
    }

def main():
    """Main function to generate all datasets"""
    base_dir = "/home/user/ai-flashcard/public"

    datasets = [
        {
            "name": "스프링",
            "description": "Spring Framework 핵심 개념 및 면접 질문",
            "question_file": f"{base_dir}/reference_data/spring/spring.md",
            "answer_pattern": f"{base_dir}/data/answertemp/spring_answers_*.md",
            "output_dir": f"{base_dir}/data/dataset/spring",
            "output_file": "spring.json",
            "base_tags": ["Spring", "Java", "백엔드"],
            "expected_count": 86
        },
        {
            "name": "네트워크",
            "description": "네트워크 핵심 개념 및 면접 질문",
            "question_file": f"{base_dir}/reference_data/CS/Network/network.md",
            "answer_pattern": f"{base_dir}/data/answertemp/network_answers_*.md",
            "output_dir": f"{base_dir}/data/dataset/network",
            "output_file": "network.json",
            "base_tags": ["네트워크", "CS", "면접"],
            "expected_count": 104
        },
        {
            "name": "운영체제",
            "description": "운영체제 핵심 개념 및 면접 질문",
            "question_file": f"{base_dir}/reference_data/CS/OS/os.md",
            "answer_pattern": f"{base_dir}/data/answertemp/os_answers_*.md",
            "output_dir": f"{base_dir}/data/dataset/os",
            "output_file": "os.json",
            "base_tags": ["운영체제", "CS", "면접"],
            "expected_count": 122
        },
        {
            "name": "프로그래밍 언어",
            "description": "프로그래밍 언어 핵심 개념 및 면접 질문",
            "question_file": f"{base_dir}/reference_data/PL/pl.md",
            "answer_pattern": f"{base_dir}/data/answertemp/pl_answers_*.md",
            "output_dir": f"{base_dir}/data/dataset/pl",
            "output_file": "pl.json",
            "base_tags": ["프로그래밍언어", "CS", "면접"],
            "expected_count": 125
        }
    ]

    results = []

    for dataset_config in datasets:
        print(f"\n{'='*60}")
        print(f"Processing: {dataset_config['name']}")
        print(f"{'='*60}")

        # Parse questions
        print(f"Reading questions from: {dataset_config['question_file']}")
        questions = parse_questions(dataset_config['question_file'])
        print(f"Found {len(questions)} questions")

        # Parse answers
        answer_files = glob.glob(dataset_config['answer_pattern'])
        print(f"Reading answers from {len(answer_files)} files")
        answers = parse_answers(answer_files)
        print(f"Found {len(answers)} answers")

        # Create dataset
        dataset = create_dataset(
            dataset_config['name'],
            dataset_config['description'],
            questions,
            answers,
            dataset_config['base_tags']
        )

        # Create output directory if needed
        os.makedirs(dataset_config['output_dir'], exist_ok=True)

        # Write JSON file
        output_path = os.path.join(dataset_config['output_dir'], dataset_config['output_file'])
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(dataset, f, ensure_ascii=False, indent=2)

        print(f"✓ Created: {output_path}")
        print(f"✓ Cards generated: {len(dataset['cards'])}")

        # Check if count matches expected
        if len(dataset['cards']) != dataset_config['expected_count']:
            print(f"⚠ Warning: Expected {dataset_config['expected_count']} cards, got {len(dataset['cards'])}")

        results.append({
            'name': dataset_config['name'],
            'file': output_path,
            'cards': len(dataset['cards']),
            'expected': dataset_config['expected_count'],
            'match': len(dataset['cards']) == dataset_config['expected_count']
        })

    # Print summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    for result in results:
        status = "✓" if result['match'] else "⚠"
        print(f"{status} {result['name']}: {result['cards']} cards (expected: {result['expected']})")
        print(f"  → {result['file']}")

    print(f"\n{'='*60}")
    print("All datasets generated successfully!")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
