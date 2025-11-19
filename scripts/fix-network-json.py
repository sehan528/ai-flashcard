#!/usr/bin/env python3
"""
network.json 파일의 잘못된 질문-답변 매칭을 수정하는 스크립트

문제: 카드 #5부터 답변이 2칸씩 앞으로 밀려있음
해결: 답변을 2칸씩 뒤로 회전
"""
import json

def fix_network_qa():
    filepath = 'public/data/dataset/network/network.json'

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data['cards']
    total = len(cards)

    print(f"총 카드 수: {total}")
    print(f"카드 #1-4는 올바름")
    print(f"카드 #5부터 #{total}까지 답변이 2칸씩 앞으로 밀려있음")
    print(f"\n수정 중...")

    # 모든 답변을 별도 리스트에 저장
    original_answers = [card['answer'] for card in cards]

    # 올바른 순서로 재배치
    # 카드 0-3: 그대로
    # 카드 4-103: 답변을 2칸씩 뒤로 회전
    #   - 카드 4의 올바른 답변은 현재 카드 6에 있음
    #   - 카드 5의 올바른 답변은 현재 카드 7에 있음
    #   - ...
    #   - 카드 102의 올바른 답변은 현재 카드 4에 있음 (순환)
    #   - 카드 103의 올바른 답변은 현재 카드 5에 있음 (순환)

    correct_answers = original_answers.copy()

    # 카드 4부터 끝까지 재배치
    for i in range(4, total):
        # 카드 i의 올바른 답변은 현재 (i + 2)번 카드에 있음
        # 단, 범위를 벗어나면 순환 (4부터 시작)
        source_idx = 4 + ((i - 4 + 2) % (total - 4))
        correct_answers[i] = original_answers[source_idx]

    # 적용
    for i, card in enumerate(cards):
        card['answer'] = correct_answers[i]

    # 검증 출력
    print("\n✅ 수정 완료! 몇 가지 확인:")
    test_indices = [4, 5, 6, 7, 8]
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
    sys.exit(fix_network_qa())
