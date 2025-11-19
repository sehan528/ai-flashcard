#!/usr/bin/env python3
"""
javascript.json 파일의 잘못된 질문-답변 매칭을 수정하는 스크립트

문제: 카드 #33부터 답변이 2칸씩 앞으로 밀려있음
해결: 답변을 2칸씩 뒤로 회전
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
    print(f"카드 #33부터 #{total}까지 답변이 2칸씩 앞으로 밀려있음")
    print(f"\n수정 중...")

    # 모든 답변을 별도 리스트에 저장
    original_answers = [card['answer'] for card in cards]

    # 올바른 순서로 재배치
    # 카드 0-31: 그대로
    # 카드 32-59: 답변을 2칸씩 뒤로 회전
    correct_answers = original_answers.copy()

    # 카드 32부터 끝까지 재배치
    # 현재: cards[i].answer가 cards[i+2]의 올바른 답변임 (2칸 앞으로 밀려있음)
    # 수정: cards[i]의 올바른 답변은 cards[i-2]에 있음
    for i in range(32, total):
        source_idx = 32 + ((i - 32 - 2) % (total - 32))
        correct_answers[i] = original_answers[source_idx]

    # 적용
    for i, card in enumerate(cards):
        card['answer'] = correct_answers[i]

    # 검증 출력
    print("\n✅ 수정 완료! 몇 가지 확인:")
    test_indices = [32, 33, 34, 35, 36]
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
    sys.exit(fix_javascript_qa())
