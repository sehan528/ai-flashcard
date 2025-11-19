#!/usr/bin/env python3
"""
데이터셋 JSON 파일의 질문-답변 매칭을 검사하는 스크립트
"""
import json
import sys
from pathlib import Path

def extract_keywords(text):
    """텍스트에서 주요 키워드 추출 (간단한 방식)"""
    # 특수문자 제거 및 소문자 변환
    import re
    text = text.lower()
    # 한글, 영문, 숫자만 남기기
    text = re.sub(r'[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]', ' ', text)
    words = text.split()
    # 불용어 제거 (간단하게)
    stop_words = {'은', '는', '이', '가', '을', '를', '의', '에', '대해', '설명', '주세요', '무엇', '어떤', '왜', 'the', 'a', 'an', 'and', 'or', 'but'}
    keywords = [w for w in words if w not in stop_words and len(w) > 1]
    return set(keywords)

def check_qa_match(question, answer):
    """질문과 답변의 키워드 매칭 점수 계산"""
    q_keywords = extract_keywords(question)
    a_keywords = extract_keywords(answer)

    if not q_keywords:
        return 0.0

    # 질문 키워드 중 답변에 있는 비율
    match_count = len(q_keywords & a_keywords)
    match_ratio = match_count / len(q_keywords)

    return match_ratio, q_keywords, a_keywords

def analyze_file(filepath):
    """파일의 모든 카드 분석"""
    print(f"\n{'='*80}")
    print(f"분석 파일: {filepath}")
    print(f"{'='*80}\n")

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data.get('cards', [])
    suspicious_cards = []

    for idx, card in enumerate(cards, 1):
        question = card.get('question', '')
        answer = card.get('answer', '')

        if isinstance(answer, list):
            answer = ' '.join(answer)

        match_ratio, q_keys, a_keys = check_qa_match(question, answer)

        # 매칭 비율이 30% 이하면 의심스러운 것으로 표시
        if match_ratio < 0.3:
            suspicious_cards.append({
                'index': idx,
                'question': question[:100] + '...' if len(question) > 100 else question,
                'answer_preview': answer[:150] + '...' if len(answer) > 150 else answer,
                'match_ratio': match_ratio,
                'q_keywords': list(q_keys)[:10],  # 처음 10개만
                'a_keywords': list(a_keys)[:10]
            })

    print(f"총 카드 수: {len(cards)}")
    print(f"의심스러운 카드: {len(suspicious_cards)}개\n")

    if suspicious_cards:
        print("의심스러운 질문-답변 매칭:\n")
        for card in suspicious_cards:
            print(f"[카드 #{card['index']}] 매칭률: {card['match_ratio']:.1%}")
            print(f"질문: {card['question']}")
            print(f"답변 미리보기: {card['answer_preview']}")
            print(f"질문 키워드: {card['q_keywords']}")
            print(f"답변에서 발견된 질문 키워드: {len([k for k in card['q_keywords'] if k in card['a_keywords']])}개")
            print()

    # 모든 질문 목록 출력 (매칭 검토용)
    print("\n" + "="*80)
    print("전체 질문 목록 (순서대로):")
    print("="*80)
    for idx, card in enumerate(cards, 1):
        print(f"{idx:3d}. {card.get('question', 'N/A')}")

    return len(suspicious_cards)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python check-qa-matching.py <json_file>")
        sys.exit(1)

    filepath = sys.argv[1]
    if not Path(filepath).exists():
        print(f"Error: File not found: {filepath}")
        sys.exit(1)

    suspicious_count = analyze_file(filepath)
    sys.exit(0 if suspicious_count == 0 else 1)
