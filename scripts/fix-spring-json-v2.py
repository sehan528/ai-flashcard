#!/usr/bin/env python3
"""
spring.json 파일의 잘못된 질문-답변 매칭을 수정하는 스크립트 (v2)

발견된 패턴:
- 카드 #1-57: 올바름
- 카드 #58-59: 플레이스홀더 (실제 답변 없음)
- 카드 #60-85: 답변이 +3 offset으로 shift됨 (circular)
- 플레이스홀더들도 rotation에 포함됨

해결 방법:
- 카드 #58-85 전체 (28개)를 하나의 circular group으로 +3 offset rotation
- 이렇게 하면 플레이스홀더가 #83-84로 이동하고, 실제 답변들이 올바른 위치로 감
"""
import json

def fix_spring_qa():
    filepath = 'public/data/dataset/spring/spring.json'

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data['cards']
    total = len(cards)

    print(f"총 카드 수: {total}")
    print(f"카드 #1-57는 올바름")
    print(f"카드 #58-85: 전체 28개가 +3 offset circular rotation")
    print(f"플레이스홀더: #58, #59 → #83, #84로 이동할 예정")
    print(f"\n수정 중...")

    # 모든 답변을 별도 리스트에 저장
    original_answers = [card['answer'] for card in cards]
    correct_answers = original_answers.copy()

    # 카드 #58-85 (indices 57-84): 28개 전체를 +3 offset circular rotation
    zone_start = 57
    zone_size = total - zone_start  # 28 cards

    for i in range(zone_start, total):
        # i번 질문의 올바른 답변은 (i+3) 위치에 있음 (circular)
        source_idx = zone_start + ((i - zone_start + 3) % zone_size)
        correct_answers[i] = original_answers[source_idx]

    # 적용
    for i, card in enumerate(cards):
        card['answer'] = correct_answers[i]

    # 검증 출력
    print("\n✅ 수정 완료! 주요 카드 확인:")

    # 중요한 카드들 확인
    test_cases = [
        (57, "Spring Framework 기본 개념"),
        (58, "Spring Boot vs Spring"),
        (59, "Spring Bean 라이프사이클"),
        (60, "@Component, @Service, @Repository"),
        (61, "AOP"),
        (77, "Spring WebFlux"),
        (78, "비동기 처리"),
        (81, "RestTemplate/WebClient"),
        (82, "Spring Boot Starter (플레이스홀더 예상)"),
        (83, "Java Config (플레이스홀더 예상)"),
        (84, "최신 Spring 버전"),
    ]

    for idx, description in test_cases:
        q = cards[idx]['question'][:50]
        a_preview = correct_answers[idx][:80].replace('\n', ' ')
        print(f"\n카드 #{idx+1} ({description}):")
        print(f"  질문: {q}...")
        print(f"  답변: {a_preview}...")

    # 파일 저장
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n💾 {filepath} 파일이 저장되었습니다!")
    print(f"\n⚠️  참고: 카드 #83, #84는 원본 데이터에 답변이 없어 플레이스홀더가 유지됩니다.")
    return 0

if __name__ == '__main__':
    import sys
    sys.exit(fix_spring_qa())
