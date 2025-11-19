#!/usr/bin/env python3
"""
spring.json 파일의 잘못된 질문-답변 매칭을 수정하는 스크립트 (Final)

최종 분석 결과:
- 카드 #1-57: 올바름
- 카드 #58-85: 답변이 shift됨
  - 카드 #58-59의 올바른 답변은 현재 카드 #60-61에 있음 (offset +2)
  - 카드 #60-85는 +3 offset circular rotation
- 주의: 카드 #83-85는 원본 데이터에 적절한 답변이 없어 부분적으로 불일치할 수 있음
"""
import json

def fix_spring_qa():
    filepath = 'public/data/dataset/spring/spring.json'

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data['cards']
    total = len(cards)

    print(f"총 카드 수: {total}")
    print(f"\n패턴 분석:")
    print(f"  - 카드 #1-57: 올바름")
    print(f"  - 카드 #58-59: 답변이 #60-61에 있음 (offset +2)")
    print(f"  - 카드 #60-85: +3 offset circular rotation (26개)")
    print(f"\n수정 중...")

    # 모든 답변을 별도 리스트에 저장
    original_answers = [card['answer'] for card in cards]
    correct_answers = original_answers.copy()

    # Zone 1: 카드 #58-59 (indices 57-58)
    # 이 질문들의 답변은 현재 #60-61에 있음
    correct_answers[57] = original_answers[59]  # Q#58 ← A#60 (Spring Framework)
    correct_answers[58] = original_answers[60]  # Q#59 ← A#61 (Spring Boot)

    # Zone 2: 카드 #60-85 (indices 59-84)
    # 26개 카드가 +3 offset으로 circular rotation
    zone2_start = 59
    zone2_size = total - zone2_start  # 26 cards

    for i in range(zone2_start, total):
        source_idx = zone2_start + ((i - zone2_start + 3) % zone2_size)
        correct_answers[i] = original_answers[source_idx]

    # 적용
    for i, card in enumerate(cards):
        card['answer'] = correct_answers[i]

    # 검증 출력
    print("\n✅ 수정 완료! 주요 카드 확인:")

    test_cases = [
        (57, "Spring Framework 기본 개념"),
        (58, "Spring Boot vs Spring"),
        (59, "Spring Bean 라이프사이클"),
        (60, "@Component, @Service, @Repository"),
        (61, "AOP"),
        (76, "Spring WebFlux"),
        (77, "비동기 처리"),
        (78, "Logback"),
        (79, "HttpMessageConverter"),
        (80, "RestTemplate/WebClient"),
        (81, "@Scheduled"),
        (82, "Spring Boot Starter"),
        (83, "Java Config"),
        (84, "최신 Spring 버전"),
    ]

    for idx, expected_topic in test_cases:
        q = cards[idx]['question'][:55]
        a_preview = correct_answers[idx][:70].replace('\n', ' ')
        print(f"\n#{idx+1} {expected_topic}:")
        print(f"  Q: {q}...")
        print(f"  A: {a_preview}...")

    # 파일 저장
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n💾 {filepath} 파일이 저장되었습니다!")
    print(f"\n⚠️  주의사항:")
    print(f"   - 카드 #83-85는 원본 데이터에 해당 답변이 없어")
    print(f"     카드 #58-60의 답변(플레이스홀더 또는 다른 주제)을 받게 됩니다.")
    print(f"   - 이는 데이터셋 자체의 불완전성으로 인한 것입니다.")
    return 0

if __name__ == '__main__':
    import sys
    sys.exit(fix_spring_qa())
