#!/usr/bin/env python3
"""
Spring.json을 간략버전으로 변환하는 스크립트
사용자가 제시한 패턴에 따라 변환
"""
import json
import re

def extract_key_points(answer):
    """답변에서 핵심 포인트 추출"""
    # "첫째, 둘째..." 패턴 찾기
    patterns = [
        r'첫째[,\s]+(.*?)(?:둘째|넷째|셋째|다섯째|$)',
        r'둘째[,\s]+(.*?)(?:셋째|넷째|다섯째|$)',
        r'셋째[,\s]+(.*?)(?:넷째|다섯째|$)',
        r'넷째[,\s]+(.*?)(?:다섯째|$)',
        r'다섯째[,\s]+(.*?)$'
    ]

    points = []
    for pattern in patterns:
        match = re.search(pattern, answer, re.DOTALL)
        if match:
            point = match.group(1).strip()
            # 첫 문장만 추출
            point = point.split('.')[0] + '.'
            points.append(point)

    return points

def convert_to_brief_question(question):
    """질문을 간략버전으로 변환"""
    # 패턴 1: "설명해주세요" → "몇 가지/무엇인가요"
    if "설명해" in question or "설명하" in question:
        # 키워드 추출
        if "final" in question:
            return "final 키워드의 주요 이점 3가지는?"
        elif "인터페이스와 추상 클래스" in question:
            return "인터페이스와 추상 클래스의 주요 차이점 5가지는?"
        elif "리플렉션" in question:
            return "리플렉션의 주요 기능 4가지와 사용 시 주의사항은?"
        # 기본 패턴
        else:
            return question.replace("설명해 주세요", "주요 특징은?").replace("설명해주세요", "주요 특징은?")

    # 패턴 2: "왜...인가요?" → 유지
    return question

# 원본 읽기
with open('public/data/dataset/spring/spring.json', 'r', encoding='utf-8') as f:
    original = json.load(f)

# 간략버전 읽기 (이미 만든 5개)
with open('public/data/dataset-brief/spring/spring.json', 'r', encoding='utf-8') as f:
    brief = json.load(f)

print(f"원본: {len(original['cards'])}개")
print(f"간략버전: {len(brief['cards'])}개")
print(f"남은 카드: {len(original['cards']) - len(brief['cards'])}개")

# 샘플 몇 개만 출력
print("\n다음 5개 카드 (6-10번):")
for i in range(5, 10):
    card = original['cards'][i]
    print(f"\n#{i+1} 원본 질문: {card['question']}")
    answer_preview = card['answer'][:200].replace('\n', ' ')
    print(f"   답변: {answer_preview}...")

    # 핵심 포인트 추출 시도
    points = extract_key_points(card['answer'])
    if points:
        print(f"   추출된 포인트: {len(points)}개")
