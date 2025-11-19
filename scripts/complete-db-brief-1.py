#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
db.json 간략버전 생성 (카드 1-30)
"""

import json

# 기존 간략버전 로드
with open('public/data/dataset-brief/db/db.json', 'r', encoding='utf-8') as f:
    brief = json.load(f)

print(f"현재 카드 수: {len(brief['cards'])}")

# 카드 1-30 추가
cards_1_30 = [
    {
        "question": "기본키, 후보키, 슈퍼키, 대체키의 차이는?",
        "answer": "1. **슈퍼키** - 유일성만 만족 (튜플 구별 가능)\n2. **후보키** - 유일성 + 최소성 (슈퍼키 중 최소)\n3. **기본키** - 후보키 중 선택된 대표 키\n4. **대체키** - 기본키 제외한 나머지 후보키",
        "type": "essay",
        "tags": ["Database", "Key"]
    },
    {
        "question": "기본키 수정 가능 여부와 이유는?",
        "answer": "**가능하지만 권장하지 않음**\n\n**이유:**\n1. 외래키 참조 무결성 위반 가능\n2. 인덱스 재구성 비용\n3. 애플리케이션 논리 복잡도 증가\n\n**대안:** 대리키(Surrogate Key) 사용",
        "type": "essay",
        "tags": ["Database", "Key"]
    },
    {
        "question": "MySQL에서 기본키 없이 테이블 생성이 가능한 이유는?",
        "answer": "**InnoDB의 숨겨진 Row ID 사용**\n\n1. 기본키 없으면 UNIQUE 키 중 NOT NULL을 기본키로\n2. 그것도 없으면 내부적으로 6바이트 Row ID 자동 생성\n3. 하지만 명시적 기본키 사용 권장",
        "type": "essay",
        "tags": ["Database", "MySQL"]
    },
    {
        "question": "외래키에 NULL 허용 여부는?",
        "answer": "**허용됨**\n\n**의미:** 관계가 선택적(Optional)\n\n**예시:**\n- 사원 테이블의 부서 ID\n- 소속 부서가 없는 경우 NULL\n\n**NOT NULL 외래키:** 필수 관계",
        "type": "essay",
        "tags": ["Database", "ForeignKey"]
    },
    {
        "question": "UNIQUE 제약조건의 성능 효과는?",
        "answer": "**자동 인덱스 생성**\n\n**효과:**\n1. 중복 검사 빠름\n2. 해당 컬럼 조회 성능 향상\n3. 인덱스 스캔 활용 가능\n\n**주의:** 쓰기 성능은 약간 저하",
        "type": "essay",
        "tags": ["Database", "Index"]
    },
    {
        "question": "인덱스의 장단점은?",
        "answer": "**장점:**\n- 조회 속도 향상 (O(log N))\n- 정렬/그룹핑 성능 개선\n\n**단점:**\n- 쓰기 성능 저하 (INSERT/UPDATE/DELETE)\n- 추가 저장 공간 필요\n- 인덱스 유지 비용",
        "type": "essay",
        "tags": ["Database", "Index"]
    },
    {
        "question": "인덱스를 사용하면 항상 빠른가?",
        "answer": "**아니요, 상황에 따라 다름**\n\n**느린 경우:**\n1. 카디널리티 낮은 컬럼 (성별 등)\n2. 전체 데이터의 많은 비율 조회\n3. 함수 적용시 인덱스 무효화\n4. 복합 인덱스 순서 불일치",
        "type": "essay",
        "tags": ["Database", "Index"]
    },
    {
        "question": "인덱스 자료구조 3가지는?",
        "answer": "1. **B-Tree** - 균형 트리, 범위 검색 유리\n2. **Hash** - 등호 비교만, O(1)\n3. **Bitmap** - 카디널리티 낮을 때 (성별, 등급)",
        "type": "essay",
        "tags": ["Database", "Index"]
    },
    {
        "question": "Clustered Index와 Non-Clustered Index 차이는?",
        "answer": "**Clustered (군집):**\n- 데이터와 인덱스가 함께 정렬\n- 테이블당 1개만\n- 기본키에 자동 생성\n- 빠른 범위 검색\n\n**Non-Clustered:**\n- 별도 인덱스 구조\n- 여러 개 가능\n- 포인터로 데이터 참조",
        "type": "essay",
        "tags": ["Database", "Index"]
    },
    {
        "question": "복합 인덱스 생성시 고려사항은?",
        "answer": "1. **컬럼 순서** - 카디널리티 높은 것 먼저\n2. **WHERE 조건 순서** - 자주 사용하는 조합\n3. **최좌측 매칭** - 첫 번째 컬럼 필수\n4. **중복 방지** - (A,B)와 (A) 중복\n\n**예:** INDEX(dept, name) → dept만 사용 가능",
        "type": "essay",
        "tags": ["Database", "Index"]
    },
    {
        "question": "정규화의 목적과 장점 3가지는?",
        "answer": "**목적:** 데이터 중복 최소화, 무결성 유지\n\n**장점:**\n1. **이상 현상 방지** - 삽입/수정/삭제 이상\n2. **저장 공간 절약**\n3. **데이터 일관성 유지**",
        "type": "essay",
        "tags": ["Database", "Normalization"]
    },
    {
        "question": "제1정규형(1NF)의 조건은?",
        "answer": "**원자값(Atomic Value)만 허용**\n\n**위반 예:**\n- 전화번호: \"010-1234-5678, 02-9876-5432\"\n- 배열이나 리스트 저장\n\n**해결:** 각 값을 별도 행으로 분리",
        "type": "essay",
        "tags": ["Database", "Normalization"]
    },
    {
        "question": "제2정규형(2NF)의 조건은?",
        "answer": "**1NF + 부분 함수 종속 제거**\n\n**부분 함수 종속:**\n- 복합키의 일부에만 종속\n- (학번, 과목) → 학년 (X, 학번에만 종속)\n\n**해결:** 테이블 분리",
        "type": "essay",
        "tags": ["Database", "Normalization"]
    },
    {
        "question": "제3정규형(3NF)의 조건은?",
        "answer": "**2NF + 이행적 함수 종속 제거**\n\n**이행적 종속:**\n- A → B, B → C이면 A → C\n- 학번 → 학과, 학과 → 학과장\n\n**해결:** 학과 테이블 분리",
        "type": "essay",
        "tags": ["Database", "Normalization"]
    },
    {
        "question": "BCNF의 조건은?",
        "answer": "**3NF + 모든 결정자가 후보키**\n\n**위반 예:**\n- (학생, 과목) 테이블\n- 교수 → 과목 (교수가 결정자지만 후보키 아님)\n\n**해결:** 교수-과목 테이블 분리",
        "type": "essay",
        "tags": ["Database", "Normalization"]
    },
    {
        "question": "역정규화의 이유와 기법은?",
        "answer": "**이유:**\n- JOIN 비용 감소\n- 조회 성능 향상\n\n**기법:**\n1. 테이블 병합\n2. 컬럼 중복\n3. 파생 컬럼 추가 (총합 등)\n4. 이력 테이블 분리",
        "type": "essay",
        "tags": ["Database", "Denormalization"]
    },
    {
        "question": "트랜잭션의 ACID 속성은?",
        "answer": "1. **Atomicity (원자성)** - All or Nothing\n2. **Consistency (일관성)** - 제약조건 유지\n3. **Isolation (격리성)** - 독립 실행\n4. **Durability (지속성)** - 영구 저장",
        "type": "essay",
        "tags": ["Database", "Transaction"]
    },
    {
        "question": "트랜잭션 격리 수준 4가지는?",
        "answer": "1. **READ UNCOMMITTED** - Dirty Read 발생\n2. **READ COMMITTED** - Dirty Read 방지\n3. **REPEATABLE READ** - Non-Repeatable Read 방지\n4. **SERIALIZABLE** - Phantom Read 방지, 가장 엄격",
        "type": "essay",
        "tags": ["Database", "Transaction"]
    },
    {
        "question": "Dirty Read, Non-Repeatable Read, Phantom Read의 차이는?",
        "answer": "1. **Dirty Read** - 커밋 안된 데이터 읽기\n2. **Non-Repeatable Read** - 같은 데이터 재조회시 값 변경\n3. **Phantom Read** - 같은 조건 재조회시 행 수 변경",
        "type": "essay",
        "tags": ["Database", "Transaction"]
    },
    {
        "question": "낙관적 락과 비관적 락의 차이는?",
        "answer": "**낙관적 락:**\n- 충돌 없다고 가정\n- 버전/타임스탬프로 검증\n- 읽기 많은 환경\n\n**비관적 락:**\n- 충돌 발생 가정\n- SELECT FOR UPDATE\n- 쓰기 많은 환경",
        "type": "essay",
        "tags": ["Database", "Lock"]
    },
    {
        "question": "공유 락(S Lock)과 배타 락(X Lock)의 차이는?",
        "answer": "**공유 락 (Shared Lock):**\n- 읽기 락\n- 여러 트랜잭션 동시 획득 가능\n- 쓰기 차단\n\n**배타 락 (Exclusive Lock):**\n- 쓰기 락\n- 하나만 획득 가능\n- 읽기/쓰기 모두 차단",
        "type": "essay",
        "tags": ["Database", "Lock"]
    },
    {
        "question": "데드락의 발생 조건 4가지는?",
        "answer": "1. **상호 배제** - 자원 독점 사용\n2. **점유와 대기** - 자원 보유하면서 대기\n3. **비선점** - 강제로 뺏을 수 없음\n4. **순환 대기** - 자원 대기 그래프가 순환\n\n**모두 만족시 데드락 발생**",
        "type": "essay",
        "tags": ["Database", "Deadlock"]
    },
    {
        "question": "데드락 해결 방법 4가지는?",
        "answer": "1. **예방** - 4가지 조건 중 하나 제거\n2. **회피** - 안전 상태 유지 (은행원 알고리즘)\n3. **탐지 및 회복** - 주기적 검사, 롤백\n4. **타임아웃** - 일정 시간 후 자동 롤백",
        "type": "essay",
        "tags": ["Database", "Deadlock"]
    },
    {
        "question": "JOIN의 종류 5가지는?",
        "answer": "1. **INNER JOIN** - 교집합\n2. **LEFT JOIN** - 왼쪽 전체 + 매칭\n3. **RIGHT JOIN** - 오른쪽 전체 + 매칭\n4. **FULL OUTER JOIN** - 합집합\n5. **CROSS JOIN** - 카티션 곱",
        "type": "essay",
        "tags": ["Database", "JOIN"]
    },
    {
        "question": "INNER JOIN과 OUTER JOIN의 차이는?",
        "answer": "**INNER JOIN:**\n- 양쪽 테이블에 모두 존재하는 행만\n- 교집합\n\n**OUTER JOIN:**\n- 한쪽에만 있어도 포함\n- NULL로 채움\n- LEFT/RIGHT/FULL",
        "type": "essay",
        "tags": ["Database", "JOIN"]
    },
    {
        "question": "서브쿼리의 종류 3가지는?",
        "answer": "1. **스칼라 서브쿼리** - 단일 값 반환 (SELECT절)\n2. **인라인 뷰** - 가상 테이블 (FROM절)\n3. **중첩 서브쿼리** - 조건 비교 (WHERE절)\n\n**상관/비상관:** 외부 쿼리 참조 여부",
        "type": "essay",
        "tags": ["Database", "Subquery"]
    },
    {
        "question": "GROUP BY와 HAVING의 차이는?",
        "answer": "**GROUP BY:**\n- 그룹핑 기준\n- WHERE 이후 실행\n\n**HAVING:**\n- 그룹 필터링\n- 집계 함수 조건\n- GROUP BY 이후 실행\n\n**순서:** WHERE → GROUP BY → HAVING → ORDER BY",
        "type": "essay",
        "tags": ["Database", "SQL"]
    },
    {
        "question": "UNION과 UNION ALL의 차이는?",
        "answer": "**UNION:**\n- 중복 제거\n- 정렬 발생\n- 느림\n\n**UNION ALL:**\n- 중복 허용\n- 단순 결합\n- 빠름\n\n**권장:** 중복 없으면 UNION ALL 사용",
        "type": "essay",
        "tags": ["Database", "SQL"]
    },
    {
        "question": "윈도우 함수의 종류와 예시는?",
        "answer": "1. **순위** - ROW_NUMBER, RANK, DENSE_RANK\n2. **집계** - SUM, AVG, COUNT OVER\n3. **행 순서** - LAG, LEAD, FIRST_VALUE, LAST_VALUE\n\n**특징:** GROUP BY 없이 그룹별 계산",
        "type": "essay",
        "tags": ["Database", "SQL"]
    },
    {
        "question": "ROW_NUMBER, RANK, DENSE_RANK의 차이는?",
        "answer": "**예: 점수 90, 90, 80**\n\n1. **ROW_NUMBER** - 1, 2, 3 (고유 번호)\n2. **RANK** - 1, 1, 3 (동점 건너뜀)\n3. **DENSE_RANK** - 1, 1, 2 (연속 번호)",
        "type": "essay",
        "tags": ["Database", "SQL"]
    }
]

# 기존 5개 샘플 대체
brief["cards"] = cards_1_30

print(f"카드 1-30 추가 완료 (총 {len(brief['cards'])}개)")

# 저장
with open('public/data/dataset-brief/db/db.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"✅ DB 간략버전 저장 완료! (진행률: {len(brief['cards'])}/60)")
