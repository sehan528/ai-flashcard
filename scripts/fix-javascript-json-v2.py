#!/usr/bin/env python3
"""
javascript.json 파일의 잘못된 질문-답변 매칭을 수정하는 스크립트 (v2)

문제: 두 가지 다른 shift 패턴 발견
- 카드 #33-34 (indices 32-33): 답변이 25칸 뒤에 있음 (indices 57-58)
- 카드 #35-60 (indices 34-59): 답변이 2칸 뒤에 있음 (circular)
"""
import json

def fix_javascript_qa():
    filepath = 'public/data/dataset/javascript/javascript.json'

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data['cards']
    total = len(cards)

    print(f"총 카드 수: {total}")
    print(f"카드 #1-32는 올바름")
    print(f"카드 #33-34: 답변이 indices 57-58에 있음")
    print(f"카드 #35-60: 답변이 2칸씩 뒤에 있음 (circular)")
    print(f"\n수정 중...")

    # 모든 답변을 별도 리스트에 저장
    original_answers = [card['answer'] for card in cards]
    correct_answers = original_answers.copy()

    # 카드 33-34 (indices 32-33): offset +25
    correct_answers[32] = original_answers[57]  # Card #33 gets Card #58's answer (Symbol)
    correct_answers[33] = original_answers[58]  # Card #34 gets Card #59's answer (Template Literal)

    # 카드 35-60 (indices 34-59): offset -2 with circular
    for i in range(34, total):
        source_idx = 32 + ((i - 32 - 2) % (total - 32))
        correct_answers[i] = original_answers[source_idx]

    # 적용
    for i, card in enumerate(cards):
        card['answer'] = correct_answers[i]

    # 검증 출력
    print("\n✅ 수정 완료! 몇 가지 확인:")
    test_indices = [32, 33, 34, 35, 36, 37]
    for idx in test_indices:
        q = cards[idx]['question']
        a_preview = correct_answers[idx][:60].replace('\n', ' ')
        print(f"\n카드 #{idx+1}:")
        print(f"  질문: {q[:50]}...")
        print(f"  답변: {a_preview}...")

    # 파일 저장
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n💾 {filepath} 파일이 저장되었습니다!")
    return 0

if __name__ == '__main__':
    import sys
    sys.exit(fix_javascript_qa())
