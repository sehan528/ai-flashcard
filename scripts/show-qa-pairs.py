#!/usr/bin/env python3
"""
질문-답변 쌍을 보기 좋게 출력하는 스크립트
"""
import json
import sys

def show_qa_pairs(filepath, start_idx=1, end_idx=None):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data.get('cards', [])

    if end_idx is None:
        end_idx = len(cards)

    for idx in range(start_idx - 1, min(end_idx, len(cards))):
        card = cards[idx]
        question = card.get('question', 'N/A')
        answer = card.get('answer', 'N/A')

        if isinstance(answer, list):
            answer = ' '.join(answer)

        # 답변의 첫 200자만 표시
        answer_preview = answer[:200] + '...' if len(answer) > 200 else answer

        print(f"\n{'='*80}")
        print(f"카드 #{idx + 1}")
        print(f"{'='*80}")
        print(f"질문: {question}")
        print(f"\n답변:")
        print(answer_preview)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python show-qa-pairs.py <json_file> [start_idx] [end_idx]")
        sys.exit(1)

    filepath = sys.argv[1]
    start_idx = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    end_idx = int(sys.argv[3]) if len(sys.argv) > 3 else None

    show_qa_pairs(filepath, start_idx, end_idx)
