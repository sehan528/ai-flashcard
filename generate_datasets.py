#!/usr/bin/env python3
import json
import re
from datetime import datetime
import random
import string

def generate_id():
    """Generate a unique ID with timestamp and random string"""
    timestamp = int(datetime.now().timestamp() * 1000)
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))
    return f"{timestamp}-{random_str}"

def extract_questions_from_md(file_path):
    """Extract questions from markdown file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all lines that start with "- " (questions)
    questions = []
    for line in content.split('\n'):
        stripped = line.strip()
        if stripped.startswith('- ') and len(stripped) > 2:
            question = stripped[2:]  # Remove "- "
            questions.append(question)

    return questions

def extract_answers_from_file(file_path):
    """Extract answers from answer file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    answers = {}
    # Split by question headers (## 질문 N:)
    pattern = r'## 질문 (\d+):(.*?)(?=## 질문 \d+:|---\s*$|$)'
    matches = re.findall(pattern, content, re.DOTALL)

    for match in matches:
        question_num = int(match[0])
        answer_content = match[1].strip()

        # Remove the question title line and first separator
        lines = answer_content.split('\n')
        # Skip first line (question text) and find where answer starts
        clean_lines = []
        skip_first_separator = True
        for line in lines[1:]:  # Skip question line
            if line.strip() == '---' and skip_first_separator:
                skip_first_separator = False
                continue
            if line.strip() == '---':  # End of answer
                break
            clean_lines.append(line)

        answer_text = '\n'.join(clean_lines).strip()
        answers[question_num] = answer_text

    return answers

def extract_tags_from_question(question):
    """Extract relevant tags from question text"""
    tags = []

    # Common keywords to look for
    keywords = {
        'async': ['async', 'await', 'Promise', '비동기', 'Asynchronous'],
        'function': ['함수', 'function', 'arrow', 'Function'],
        'closure': ['클로저', 'Closure'],
        'prototype': ['프로토타입', 'Prototype', 'prototype'],
        'this': ['this'],
        'scope': ['스코프', 'Scope'],
        'hoisting': ['호이스팅', 'Hoisting'],
        'ES6': ['ES6', 'ES2015'],
        'array': ['배열', 'Array', 'map', 'filter', 'reduce'],
        'object': ['객체', 'Object'],
        'DOM': ['DOM'],
        'event': ['이벤트', 'Event', 'event'],
        'Hook': ['Hook', 'useState', 'useEffect', 'useMemo', 'useCallback'],
        'component': ['컴포넌트', 'Component'],
        'props': ['Props', 'props'],
        'state': ['State', 'state', '상태'],
        'lifecycle': ['라이프사이클', 'lifecycle', 'LifeCycle'],
        'performance': ['성능', 'performance', '최적화'],
    }

    question_lower = question.lower()
    for tag, terms in keywords.items():
        for term in terms:
            if term.lower() in question_lower:
                if tag not in tags:
                    tags.append(tag)
                break

    return tags[:3]  # Return max 3 tags

def create_dataset_json(name, description, questions, answers_dict, base_tags):
    """Create dataset JSON structure"""
    cards = []
    current_time = datetime.now().isoformat()

    for idx, question in enumerate(questions, 1):
        answer = answers_dict.get(idx, "답변 준비 중입니다.")

        # Extract tags
        tags = base_tags + extract_tags_from_question(question)
        # Remove duplicates and limit to reasonable number
        tags = list(dict.fromkeys(tags))[:5]

        card = {
            "question": question,
            "answer": answer,
            "type": "essay",
            "tags": tags,
            "id": generate_id(),
            "createdAt": current_time,
            "studyCount": 0
        }
        cards.append(card)

    return {
        "name": name,
        "description": description,
        "cards": cards
    }

def main():
    # Process JavaScript dataset
    print("Processing JavaScript dataset...")
    js_questions = extract_questions_from_md('/home/user/ai-flashcard/public/reference_data/javascript/javascript.md')

    # Collect all JavaScript answers
    js_answers = {}
    for i in range(1, 61, 4):  # 1-4, 5-8, ..., 57-60
        file_path = f'/home/user/ai-flashcard/public/data/answertemp/javascript_answers_{i:02d}-{min(i+3, 60):02d}.md'
        try:
            answers = extract_answers_from_file(file_path)
            js_answers.update(answers)
        except FileNotFoundError:
            print(f"Warning: {file_path} not found")
            continue

    js_dataset = create_dataset_json(
        "자바스크립트",
        "JavaScript 핵심 개념 및 면접 질문",
        js_questions,
        js_answers,
        ["JavaScript", "JS"]
    )

    # Write JavaScript JSON
    js_output_path = '/home/user/ai-flashcard/public/data/dataset/javascript/javascript.json'
    with open(js_output_path, 'w', encoding='utf-8') as f:
        json.dump(js_dataset, f, ensure_ascii=False, indent=2)
    print(f"✓ JavaScript dataset created: {len(js_dataset['cards'])} cards")

    # Process React dataset
    print("\nProcessing React dataset...")
    react_questions = extract_questions_from_md('/home/user/ai-flashcard/public/reference_data/react/react.md')

    # Collect all React answers
    react_answers = {}
    for i in range(1, 61, 4):  # 1-4, 5-8, ..., 57-60
        file_path = f'/home/user/ai-flashcard/public/data/answertemp/react_answers_{i:02d}-{min(i+3, 60):02d}.md'
        try:
            answers = extract_answers_from_file(file_path)
            react_answers.update(answers)
        except FileNotFoundError:
            print(f"Warning: {file_path} not found")
            continue

    react_dataset = create_dataset_json(
        "리액트",
        "React 핵심 개념 및 면접 질문",
        react_questions,
        react_answers,
        ["React", "리액트"]
    )

    # Write React JSON
    react_output_path = '/home/user/ai-flashcard/public/data/dataset/react/react.json'
    with open(react_output_path, 'w', encoding='utf-8') as f:
        json.dump(react_dataset, f, ensure_ascii=False, indent=2)
    print(f"✓ React dataset created: {len(react_dataset['cards'])} cards")

    print("\n" + "="*50)
    print("Dataset generation complete!")
    print(f"JavaScript: {js_output_path}")
    print(f"React: {react_output_path}")

if __name__ == "__main__":
    main()
