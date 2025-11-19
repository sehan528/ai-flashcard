#!/usr/bin/env python3
"""
데이터셋을 간략버전으로 변환하는 스크립트

변환 규칙:
1. 질문: 더 구체적이고 명확하게 (개수, 범위 명시)
2. 답변: 핵심만 추출 (리스트 형태, 간결하게)
3. 코드 예제 제거
4. "첫째, 둘째..." → 숫자 리스트로
"""
import json
import os

def create_brief_prompt(question, answer):
    """간략버전 변환을 위한 프롬프트 생성"""
    return f"""다음 플래시카드를 "간략버전"으로 변환해주세요.

**변환 규칙:**
1. **질문**: 더 구체적이고 명확하게 만들기
   - 개수를 명시 (예: "주요 기능 4가지", "차이점 3가지")
   - 범위를 명확히 (예: "대표적인 5가지", "핵심 개념")
   - 모호한 표현 제거

2. **답변**: 핵심만 간결하게
   - 번호 리스트 형식 사용 (1. 2. 3. ...)
   - 각 항목은 한 줄로 간결하게
   - 코드 예제 제거
   - 상세 설명 제거, 핵심 키워드만
   - 전체 길이는 원본의 1/5 수준

**원본 질문:**
{question}

**원본 답변 (일부):**
{answer[:500]}...

**간략버전 출력 형식:**
{{
  "question": "변환된 질문",
  "answer": "1. 첫번째 핵심\\n2. 두번째 핵심\\n3. 세번째 핵심"
}}

간략버전으로 변환된 JSON만 출력해주세요 (다른 설명 없이):"""

def convert_card_to_brief(card):
    """
    카드를 간략버전으로 변환
    실제로는 AI API를 호출해야 하지만, 여기서는 패턴 기반으로 변환
    """
    question = card['question']
    answer = card['answer']

    # 간단한 패턴 변환 (실제로는 AI가 더 잘 할 것)
    brief_question = question
    brief_answer = answer

    # "설명해주세요" → "몇 가지인가요?" 같은 변환이 필요하지만
    # 이건 AI가 해야 함

    return {
        'question': brief_question,
        'answer': brief_answer,
        'tags': card.get('tags', [])
    }

def convert_dataset(input_path, output_path):
    """데이터셋을 간략버전으로 변환"""
    print(f"\n변환 중: {input_path}")

    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    original_cards = data['cards']
    brief_cards = []

    print(f"총 {len(original_cards)}개 카드 변환 시작...")

    # 각 카드를 변환 (실제로는 AI API 호출 필요)
    for i, card in enumerate(original_cards):
        if (i + 1) % 10 == 0:
            print(f"  진행: {i + 1}/{len(original_cards)}")

        brief_card = convert_card_to_brief(card)
        brief_cards.append(brief_card)

    # 간략버전 데이터 생성
    brief_data = {
        'title': data.get('title', '') + ' (간략버전)',
        'description': '핵심 개념만 간결하게 정리한 버전',
        'cards': brief_cards
    }

    # 출력 폴더 생성
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # 파일 저장
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(brief_data, f, ensure_ascii=False, indent=2)

    print(f"✅ 완료: {output_path} ({len(brief_cards)}개 카드)")

def main():
    """메인 함수"""
    datasets = [
        'db', 'ds', 'etc', 'javascript', 'network',
        'os', 'pl', 'react', 'redis', 'spring', 'websocket'
    ]

    print("="*80)
    print("데이터셋 간략버전 변환 시작")
    print("="*80)

    for dataset in datasets:
        input_path = f'public/data/dataset/{dataset}/{dataset}.json'
        output_path = f'public/data/dataset-brief/{dataset}/{dataset}.json'

        if os.path.exists(input_path):
            convert_dataset(input_path, output_path)
        else:
            print(f"⚠️  파일 없음: {input_path}")

    print("\n" + "="*80)
    print("모든 변환 완료!")
    print("="*80)

if __name__ == '__main__':
    main()
