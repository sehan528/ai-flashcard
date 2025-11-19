# Flashcard Dataset Generation Report

## Overview
Successfully generated 4 JSON flashcard datasets by combining questions from reference_data and answers from answertemp.

## Generated Files

### 1. Spring Framework
- **File**: `/home/user/ai-flashcard/public/data/dataset/spring/spring.json`
- **Name**: 스프링
- **Description**: Spring Framework 핵심 개념 및 면접 질문
- **Cards**: 85 cards
- **Size**: 417 KB
- **Tags**: Spring, Java, 백엔드 + auto-generated tags
- **Status**: ✓ Complete

### 2. Network
- **File**: `/home/user/ai-flashcard/public/data/dataset/network/network.json`
- **Name**: 네트워크
- **Description**: 네트워크 핵심 개념 및 면접 질문
- **Cards**: 104 cards
- **Size**: 427 KB
- **Tags**: 네트워크, CS, 면접 + auto-generated tags
- **Status**: ✓ Complete

### 3. Operating Systems
- **File**: `/home/user/ai-flashcard/public/data/dataset/os/os.json`
- **Name**: 운영체제
- **Description**: 운영체제 핵심 개념 및 면접 질문
- **Cards**: 122 cards
- **Size**: 467 KB
- **Tags**: 운영체제, CS, 면접 + auto-generated tags
- **Status**: ✓ Complete

### 4. Programming Languages
- **File**: `/home/user/ai-flashcard/public/data/dataset/pl/pl.json`
- **Name**: 프로그래밍 언어
- **Description**: 프로그래밍 언어 핵심 개념 및 면접 질문
- **Cards**: 125 cards
- **Size**: 318 KB
- **Tags**: 프로그래밍언어, CS, 면접 + auto-generated tags
- **Status**: ✓ Complete

## Total Statistics
- **Total Cards**: 436 cards
- **Total Size**: ~1.6 MB
- **Datasets**: 4

## JSON Structure
Each flashcard follows this structure:
```json
{
  "question": "질문 내용",
  "answer": "답변 내용 (markdown formatted)",
  "type": "essay",
  "tags": ["태그1", "태그2", "태그3"],
  "id": "TIMESTAMP-RANDOM",
  "createdAt": "2025-11-18T현재시각",
  "studyCount": 0
}
```

## Source Files

### Questions (reference_data)
- Spring: `/home/user/ai-flashcard/public/reference_data/spring/spring.md`
- Network: `/home/user/ai-flashcard/public/reference_data/CS/Network/network.md`
- OS: `/home/user/ai-flashcard/public/reference_data/CS/OS/os.md`
- PL: `/home/user/ai-flashcard/public/reference_data/PL/pl.md`

### Answers (answertemp)
- Spring: 22 files (spring_answers_*.md)
- Network: 26 files (network_answers_*.md)
- OS: 31 files (os_answers_*.md)
- PL: 32 files (pl_answers_*.md)

## Features
- ✓ Unique ID generation (timestamp + random string)
- ✓ Automatic tag extraction based on content
- ✓ Markdown formatting preserved in answers
- ✓ Clean answer content (removed headers and separators)
- ✓ ISO timestamp format
- ✓ Proper JSON structure with all required fields

## Notes
- Spring dataset has 85 cards (question 60 was a blank line/section separator)
- All answer markdown formatting (**, bullets, etc.) is preserved
- Tags are automatically extracted from question and answer content
- Each card has a unique ID for tracking and referencing
