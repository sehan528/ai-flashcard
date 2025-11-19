#!/usr/bin/env python3
"""
spring.json 파일의 잘못된 질문-답변 매칭을 수정하는 스크립트

문제: 두 가지 다른 shift 패턴 발견
- 카드 #1-57 (indices 0-56): 올바름
- 카드 #58-59 (indices 57-58): 답변이 2칸 뒤에 있음
- 카드 #60-85 (indices 59-84): 답변이 3칸 뒤에 있음 (circular)
"""
import json

def fix_spring_qa():
    filepath = 'public/data/dataset/spring/spring.json'

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data['cards']
    total = len(cards)

    print(f"총 카드 수: {total}")
    print(f"카드 #1-57 (indices 0-56)는 올바름")
    print(f"카드 #58-59 (indices 57-58): offset +2")
    print(f"카드 #60-85 (indices 59-84): offset +3 circular")
    print(f"\n수정 중...")

    # 모든 답변을 별도 리스트에 저장
    original_answers = [card['answer'] for card in cards]
    correct_answers = original_answers.copy()

    # 단일 Zone: 카드 58-85 (indices 57-84): offset +3 with circular rotation
    # 전체 28개 카드가 하나의 순환 그룹으로 +3 offset
    zone_start = 57
    zone_size = total - zone_start  # 28 cards
    for i in range(zone_start, total):
        source_idx = zone_start + ((i - zone_start + 3) % zone_size)
        correct_answers[i] = original_answers[source_idx]

    # 적용
    for i, card in enumerate(cards):
        card['answer'] = correct_answers[i]

    # 검증 출력
    print("\n✅ 수정 완료! 몇 가지 확인:")
    test_indices = [57, 58, 59, 60, 61, 70, 78, 80, 82, 84]
    for idx in test_indices:
        q = cards[idx]['question']
        a_preview = correct_answers[idx][:80].replace('\n', ' ')
        print(f"\n카드 #{idx+1}:")
        print(f"  질문: {q[:60]}...")
        print(f"  답변: {a_preview}...")

    # 파일 저장
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n💾 {filepath} 파일이 저장되었습니다!")
    return 0

if __name__ == '__main__':
    import sys
    sys.exit(fix_spring_qa())
