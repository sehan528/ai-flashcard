#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
db.json 간략버전 완성 (카드 31-60)
"""

import json

# 기존 데이터 로드
with open('public/data/dataset-brief/db/db.json', 'r', encoding='utf-8') as f:
    brief = json.load(f)

print(f"현재 카드 수: {len(brief['cards'])}")

# 카드 31-60 추가
cards_31_60 = [
    {
        "question": "실행 계획(Execution Plan)의 주요 확인 항목은?",
        "answer": "1. **type** - 조인 타입 (ALL, index, range, ref, eq_ref, const)\n2. **key** - 사용된 인덱스\n3. **rows** - 예상 스캔 행 수\n4. **Extra** - Using filesort, Using temporary 등\n\n**const > eq_ref > ref > range > index > ALL**",
        "type": "essay",
        "tags": ["Database", "Performance"]
    },
    {
        "question": "쿼리 최적화 기법 6가지는?",
        "answer": "1. **인덱스 활용** - WHERE, JOIN 컬럼\n2. **SELECT 컬럼 최소화** - * 대신 필요한 것만\n3. **서브쿼리 대신 JOIN**\n4. **LIMIT 활용** - 페이징\n5. **WHERE 조건 최적화** - 인덱스 무효화 방지\n6. **파티셔닝** - 데이터 분할",
        "type": "essay",
        "tags": ["Database", "Performance"]
    },
    {
        "question": "인덱스를 무효화시키는 WHERE 조건 5가지는?",
        "answer": "1. **함수 적용** - WHERE YEAR(date) = 2024\n2. **연산자 사용** - WHERE age + 1 = 30\n3. **LIKE 앞 와일드카드** - WHERE name LIKE '%kim'\n4. **NOT, !=**\n5. **OR 조건** - 인덱스 머지 또는 풀스캔",
        "type": "essay",
        "tags": ["Database", "Index"]
    },
    {
        "question": "파티셔닝의 종류 4가지는?",
        "answer": "1. **Range** - 범위 기준 (날짜 등)\n2. **List** - 특정 값 목록\n3. **Hash** - 해시 함수\n4. **Key** - MySQL 내부 해시\n\n**목적:** 대용량 데이터 관리, 쿼리 성능 향상",
        "type": "essay",
        "tags": ["Database", "Partitioning"]
    },
    {
        "question": "샤딩(Sharding)의 개념과 방식은?",
        "answer": "**개념:** 수평 파티셔닝, 여러 DB에 데이터 분산\n\n**방식:**\n1. **Modular** - user_id % N\n2. **Range** - 1-1000, 1001-2000\n3. **Directory** - 매핑 테이블\n\n**장점:** 확장성 / **단점:** 복잡도, JOIN 어려움",
        "type": "essay",
        "tags": ["Database", "Sharding"]
    },
    {
        "question": "레플리케이션(Replication)의 방식 2가지는?",
        "answer": "**Master-Slave:**\n- 읽기 분산\n- Master 쓰기, Slave 읽기\n\n**Master-Master:**\n- 양방향 동기화\n- 쓰기도 분산\n- 충돌 가능성\n\n**목적:** 가용성, 성능, 백업",
        "type": "essay",
        "tags": ["Database", "Replication"]
    },
    {
        "question": "CAP 이론의 3가지 요소는?",
        "answer": "1. **Consistency (일관성)** - 모든 노드 동일 데이터\n2. **Availability (가용성)** - 항상 응답\n3. **Partition Tolerance (분할 내성)** - 네트워크 장애 대응\n\n**정리:** 3가지 중 2가지만 선택 가능",
        "type": "essay",
        "tags": ["Database", "DistributedSystem"]
    },
    {
        "question": "RDBMS vs NoSQL 비교는?",
        "answer": "**RDBMS:**\n- 정형 데이터, 스키마\n- ACID, 트랜잭션\n- JOIN, 복잡한 쿼리\n\n**NoSQL:**\n- 비정형 데이터, 유연한 스키마\n- BASE, 최종 일관성\n- 수평 확장 용이",
        "type": "essay",
        "tags": ["Database", "NoSQL"]
    },
    {
        "question": "NoSQL의 종류 4가지는?",
        "answer": "1. **Key-Value** - Redis, DynamoDB\n2. **Document** - MongoDB, CouchDB\n3. **Column-Family** - Cassandra, HBase\n4. **Graph** - Neo4j, OrientDB",
        "type": "essay",
        "tags": ["Database", "NoSQL"]
    },
    {
        "question": "Redis의 주요 특징과 용도는?",
        "answer": "**특징:**\n- In-Memory Key-Value\n- 다양한 자료구조 (String, List, Set, Hash, Sorted Set)\n- 영속성 옵션 (RDB, AOF)\n\n**용도:**\n- 캐싱\n- 세션 저장\n- 실시간 랭킹\n- Pub/Sub",
        "type": "essay",
        "tags": ["Database", "Redis"]
    },
    {
        "question": "MongoDB의 특징과 용어 매핑은?",
        "answer": "**특징:** Document 기반 NoSQL, JSON 유사\n\n**용어:**\n- Database → Database\n- Table → Collection\n- Row → Document\n- Column → Field\n\n**장점:** 스키마 유연성, 확장성",
        "type": "essay",
        "tags": ["Database", "MongoDB"]
    },
    {
        "question": "뷰(View)의 장점과 단점은?",
        "answer": "**장점:**\n1. 보안 (컬럼 숨김)\n2. 쿼리 단순화\n3. 논리적 독립성\n\n**단점:**\n1. 성능 (매번 실행)\n2. 인덱스 불가\n3. 수정 제한\n\n**대안:** Materialized View (결과 저장)",
        "type": "essay",
        "tags": ["Database", "View"]
    },
    {
        "question": "스토어드 프로시저의 장단점은?",
        "answer": "**장점:**\n1. 네트워크 트래픽 감소\n2. 재사용성\n3. 보안 (권한 제어)\n4. 실행 계획 캐싱\n\n**단점:**\n1. DB 부하 증가\n2. 디버깅 어려움\n3. 이식성 낮음",
        "type": "essay",
        "tags": ["Database", "Procedure"]
    },
    {
        "question": "트리거(Trigger)의 용도와 주의사항은?",
        "answer": "**용도:**\n- 자동 로깅\n- 데이터 검증\n- 연쇄 작업\n\n**주의:**\n1. 성능 저하\n2. 디버깅 어려움\n3. 순환 트리거 방지\n4. 과도한 사용 지양",
        "type": "essay",
        "tags": ["Database", "Trigger"]
    },
    {
        "question": "커넥션 풀(Connection Pool)의 개념과 장점은?",
        "answer": "**개념:** 미리 생성한 DB 연결 재사용\n\n**장점:**\n1. 연결 생성/해제 비용 절감\n2. 빠른 응답 시간\n3. 연결 수 제한 (DB 보호)\n\n**설정:** min, max, timeout",
        "type": "essay",
        "tags": ["Database", "ConnectionPool"]
    },
    {
        "question": "슬로우 쿼리 로그의 활용법은?",
        "answer": "**설정:**\n- slow_query_log = 1\n- long_query_time = 2 (초)\n\n**활용:**\n1. 느린 쿼리 식별\n2. 실행 계획 분석\n3. 인덱스 추가/수정\n4. 쿼리 튜닝",
        "type": "essay",
        "tags": ["Database", "Performance"]
    },
    {
        "question": "EXPLAIN 결과의 type별 성능 순서는?",
        "answer": "**빠름 → 느림:**\n1. **system** - 테이블에 0~1행\n2. **const** - 기본키/유니크 상수 비교\n3. **eq_ref** - 조인시 기본키/유니크\n4. **ref** - 인덱스 동등 비교\n5. **range** - 인덱스 범위\n6. **index** - 인덱스 풀스캔\n7. **ALL** - 테이블 풀스캔",
        "type": "essay",
        "tags": ["Database", "Performance"]
    },
    {
        "question": "커버링 인덱스(Covering Index)란?",
        "answer": "**개념:** 쿼리에 필요한 모든 컬럼이 인덱스에 포함\n\n**장점:**\n- 테이블 접근 불필요\n- 빠른 성능\n\n**예:**\n- INDEX(dept, name)\n- SELECT name FROM user WHERE dept = 'IT'",
        "type": "essay",
        "tags": ["Database", "Index"]
    },
    {
        "question": "인덱스 힌트(Index Hint)를 사용하는 경우는?",
        "answer": "**사용:**\n- 옵티마이저가 잘못된 인덱스 선택시\n- 통계 정보 부정확시\n\n**문법:**\n- USE INDEX (idx_name)\n- FORCE INDEX (idx_name)\n- IGNORE INDEX (idx_name)\n\n**주의:** 최후 수단, 통계 업데이트 우선",
        "type": "essay",
        "tags": ["Database", "Index"]
    },
    {
        "question": "Full Text Index의 특징은?",
        "answer": "**용도:** 텍스트 검색 (LIKE '%word%' 대안)\n\n**특징:**\n1. 자연어 검색\n2. Boolean 모드\n3. Stopword 제외\n4. 최소 단어 길이 제한\n\n**MATCH AGAINST 구문 사용**",
        "type": "essay",
        "tags": ["Database", "Index"]
    },
    {
        "question": "InnoDB와 MyISAM의 차이점은?",
        "answer": "**InnoDB:**\n- 트랜잭션 지원\n- 외래키 지원\n- 행 레벨 락\n- 기본 엔진\n\n**MyISAM:**\n- 트랜잭션 미지원\n- 테이블 레벨 락\n- 빠른 읽기\n- 레거시",
        "type": "essay",
        "tags": ["Database", "MySQL"]
    },
    {
        "question": "MVCC(Multi-Version Concurrency Control)란?",
        "answer": "**개념:** 다중 버전 동시성 제어\n\n**동작:**\n- 변경시 새 버전 생성\n- 읽기는 스냅샷 참조\n- 락 없이 읽기 가능\n\n**장점:** 읽기/쓰기 동시 처리\n**사용:** PostgreSQL, InnoDB",
        "type": "essay",
        "tags": ["Database", "MVCC"]
    },
    {
        "question": "Undo Log와 Redo Log의 차이는?",
        "answer": "**Undo Log:**\n- 롤백용\n- MVCC 구현\n- 이전 버전 저장\n\n**Redo Log:**\n- 복구용\n- 장애시 재실행\n- 변경 사항 기록\n\n**Write-Ahead Logging (WAL)**",
        "type": "essay",
        "tags": ["Database", "Log"]
    },
    {
        "question": "체크포인트(Checkpoint)의 역할은?",
        "answer": "**역할:**\n1. 메모리의 변경 사항 디스크 반영\n2. Redo Log 크기 관리\n3. 복구 시간 단축\n\n**동작:**\n- 주기적 실행\n- Dirty Page 플러시",
        "type": "essay",
        "tags": ["Database", "Checkpoint"]
    },
    {
        "question": "페이지(Page)와 블록(Block)의 개념은?",
        "answer": "**Page:**\n- DB가 읽고 쓰는 최소 단위\n- InnoDB: 16KB\n- 여러 행 포함\n\n**Block:**\n- OS/디스크 I/O 단위\n- 보통 4KB~8KB\n\n**Buffer Pool:** 페이지 캐싱",
        "type": "essay",
        "tags": ["Database", "Storage"]
    },
    {
        "question": "B-Tree 인덱스의 구조와 특징은?",
        "answer": "**구조:**\n- Root → Branch → Leaf\n- 균형 트리 (모든 Leaf 동일 깊이)\n- Leaf는 Linked List\n\n**특징:**\n- O(log N) 검색\n- 범위 검색 유리\n- 정렬 상태 유지",
        "type": "essay",
        "tags": ["Database", "BTree"]
    },
    {
        "question": "카디널리티(Cardinality)란?",
        "answer": "**개념:** 컬럼의 고유값 비율\n\n**높음:** 주민번호, 이메일 (인덱스 유리)\n**낮음:** 성별, 등급 (인덱스 불리)\n\n**선택도 = 카디널리티 / 전체 행 수**",
        "type": "essay",
        "tags": ["Database", "Index"]
    },
    {
        "question": "통계 정보 업데이트의 중요성은?",
        "answer": "**역할:** 옵티마이저가 실행 계획 결정\n\n**포함 정보:**\n- 행 수\n- 인덱스 카디널리티\n- 데이터 분포\n\n**업데이트:**\n- ANALYZE TABLE\n- 주기적 실행 필요",
        "type": "essay",
        "tags": ["Database", "Statistics"]
    },
    {
        "question": "쿼리 캐시의 동작과 주의사항은?",
        "answer": "**동작:**\n- 동일 쿼리 결과 캐싱\n- 빠른 응답\n\n**무효화:**\n- 테이블 변경시 전체 캐시 삭제\n\n**주의:**\n- MySQL 8.0에서 제거됨\n- 쓰기 많으면 오히려 느림\n\n**대안:** 애플리케이션 레벨 캐싱",
        "type": "essay",
        "tags": ["Database", "Cache"]
    },
    {
        "question": "데이터베이스 백업 방식 3가지는?",
        "answer": "1. **Full Backup** - 전체 백업\n2. **Incremental** - 마지막 백업 이후 변경분\n3. **Differential** - 마지막 Full 이후 변경분\n\n**복구:** Full + Incremental 순차 적용\n\n**도구:** mysqldump, xtrabackup",
        "type": "essay",
        "tags": ["Database", "Backup"]
    }
]

brief["cards"].extend(cards_31_60)

print(f"카드 31-60 추가 완료 (총 {len(brief['cards'])}개)")

# 저장
with open('public/data/dataset-brief/db/db.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"\n🎉 DB 간략버전 100% 완성! 총 {len(brief['cards'])}개 카드")
print(f"✅ 파일 저장: public/data/dataset-brief/db/db.json")
