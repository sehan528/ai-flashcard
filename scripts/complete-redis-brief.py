#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
redis.json 간략버전 완성 (32 cards)
"""

import json

# 기존 간략버전 로드
with open('public/data/dataset-brief/redis/redis.json', 'r', encoding='utf-8') as f:
    brief = json.load(f)

print(f"현재 카드 수: {len(brief['cards'])}")

# 전체 32개 카드 생성
all_cards = [
    {
        "question": "Redis의 주요 특징 5가지는?",
        "answer": "1. **In-Memory** - 빠른 속도\n2. **Key-Value Store** - 단순 구조\n3. **다양한 자료구조** - String, List, Set, Hash, Sorted Set\n4. **영속성** - RDB, AOF\n5. **싱글 스레드** - Atomic 연산",
        "type": "essay",
        "tags": ["Redis", "NoSQL"]
    },
    {
        "question": "Redis 자료구조 5가지는?",
        "answer": "1. **String** - 기본, 512MB까지\n2. **List** - 양방향 연결 리스트\n3. **Set** - 중복 없는 집합\n4. **Hash** - Field-Value 쌍\n5. **Sorted Set** - 스코어 기반 정렬",
        "type": "essay",
        "tags": ["Redis", "DataStructure"]
    },
    {
        "question": "Redis의 영속성 방식 2가지는?",
        "answer": "**RDB (Redis Database):**\n- 스냅샷\n- 빠른 재시작\n- 데이터 손실 가능\n\n**AOF (Append Only File):**\n- 모든 쓰기 로그\n- 안전\n- 파일 커짐\n\n**혼합 사용 가능**",
        "type": "essay",
        "tags": ["Redis", "Persistence"]
    },
    {
        "question": "Redis 캐싱 전략 3가지는?",
        "answer": "1. **Cache Aside** - 애플리케이션이 직접 관리\n2. **Write Through** - 쓰기시 캐시+DB 동시\n3. **Write Behind** - 비동기 DB 쓰기\n\n**Read Through:** 캐시가 DB 읽기 담당",
        "type": "essay",
        "tags": ["Redis", "Cache"]
    },
    {
        "question": "Cache Stampede 문제와 해결책은?",
        "answer": "**문제:** 캐시 만료시 동시 다발적 DB 접근\n\n**해결:**\n1. **Lock** - 첫 요청만 DB 접근\n2. **Probabilistic Early Expiration** - 확률적 조기 갱신\n3. **고정 TTL 회피**",
        "type": "essay",
        "tags": ["Redis", "Cache"]
    },
    {
        "question": "Redis Replication의 특징은?",
        "answer": "**구조:** Master-Slave\n\n**특징:**\n1. 비동기 복제\n2. 다중 Slave 가능\n3. Slave는 읽기 전용\n4. 자동 재연결\n\n**용도:** 읽기 분산, HA",
        "type": "essay",
        "tags": ["Redis", "Replication"]
    },
    {
        "question": "Redis Sentinel의 역할은?",
        "answer": "**역할:**\n1. **모니터링** - Master/Slave 상태\n2. **알림** - 장애 통지\n3. **자동 failover** - Master 장애시 Slave 승격\n4. **구성 제공** - 클라이언트에 Master 정보\n\n**쿼럼 기반 결정**",
        "type": "essay",
        "tags": ["Redis", "HA"]
    },
    {
        "question": "Redis Cluster의 특징은?",
        "answer": "**특징:**\n1. **샤딩** - 16384 슬롯 분산\n2. **고가용성** - 자동 failover\n3. **확장성** - 노드 추가 가능\n4. **Multi-key 제한** - 같은 슬롯만\n\n**최소 3 Master**",
        "type": "essay",
        "tags": ["Redis", "Cluster"]
    },
    {
        "question": "Redis 파이프라인의 개념과 장점은?",
        "answer": "**개념:** 여러 명령을 한 번에 전송\n\n**장점:**\n- RTT (Round Trip Time) 감소\n- 처리량 향상\n\n**주의:**\n- 응답 순서 보장\n- 메모리 사용\n- Atomic 아님",
        "type": "essay",
        "tags": ["Redis", "Pipeline"]
    },
    {
        "question": "Redis Transaction의 특징은?",
        "answer": "**명령:** MULTI, EXEC, DISCARD, WATCH\n\n**특징:**\n1. 원자성 (All or Nothing)\n2. 순차 실행\n3. 롤백 없음 (오류시 계속)\n4. WATCH로 낙관적 락\n\n**vs Pipeline:** 원자성 보장",
        "type": "essay",
        "tags": ["Redis", "Transaction"]
    },
    {
        "question": "Redis Pub/Sub의 동작 방식은?",
        "answer": "**명령:**\n- PUBLISH channel message\n- SUBSCRIBE channel\n- PSUBSCRIBE pattern\n\n**특징:**\n- Fire-and-Forget\n- 메시지 저장 안함\n- 구독자 없어도 OK\n\n**용도:** 실시간 알림",
        "type": "essay",
        "tags": ["Redis", "PubSub"]
    },
    {
        "question": "Redis Streams의 특징은?",
        "answer": "**개념:** 로그 기반 메시지 큐\n\n**특징:**\n1. 메시지 저장\n2. Consumer Group\n3. ACK 메커니즘\n4. 범위 조회\n\n**vs Pub/Sub:** 영속성, 재처리\n\n**명령:** XADD, XREAD, XGROUP",
        "type": "essay",
        "tags": ["Redis", "Streams"]
    },
    {
        "question": "Redis의 메모리 관리 정책은?",
        "answer": "**Eviction Policy:**\n1. **noeviction** - 쓰기 거부\n2. **allkeys-lru** - 모든 키 LRU\n3. **volatile-lru** - TTL 있는 키만\n4. **allkeys-random** - 랜덤 삭제\n5. **volatile-ttl** - TTL 짧은 것 먼저\n\n**설정:** maxmemory-policy",
        "type": "essay",
        "tags": ["Redis", "Memory"]
    },
    {
        "question": "Redis의 만료 키 삭제 방식은?",
        "answer": "**Passive (지연 삭제):**\n- 접근시 확인\n- CPU 효율적\n\n**Active (능동 삭제):**\n- 주기적 스캔\n- 메모리 관리\n\n**혼합 사용**",
        "type": "essay",
        "tags": ["Redis", "Expiration"]
    },
    {
        "question": "Redis HyperLogLog의 용도는?",
        "answer": "**용도:** 고유 개수 추정 (Cardinality)\n\n**특징:**\n- 고정 메모리 (12KB)\n- 0.81% 오차\n- 대용량 처리\n\n**명령:** PFADD, PFCOUNT, PFMERGE\n\n**예:** DAU 계산",
        "type": "essay",
        "tags": ["Redis", "HyperLogLog"]
    },
    {
        "question": "Redis Bitmap의 활용 예시는?",
        "answer": "**활용:**\n1. **출석 체크** - 날짜별 비트\n2. **온라인 상태** - 사용자 ID별 비트\n3. **권한 관리** - 기능별 비트\n\n**명령:** SETBIT, GETBIT, BITCOUNT, BITOP\n\n**장점:** 메모리 효율",
        "type": "essay",
        "tags": ["Redis", "Bitmap"]
    },
    {
        "question": "Redis Geospatial의 기능은?",
        "answer": "**기능:**\n1. 위치 저장 - GEOADD\n2. 거리 계산 - GEODIST\n3. 반경 검색 - GEORADIUS\n4. 위치 조회 - GEOPOS\n\n**내부:** Sorted Set\n\n**용도:** 위치 기반 서비스",
        "type": "essay",
        "tags": ["Redis", "Geospatial"]
    },
    {
        "question": "Redis Sorted Set의 활용 예시는?",
        "answer": "**활용:**\n1. **랭킹** - 점수로 정렬\n2. **우선순위 큐** - 스코어 = 우선순위\n3. **타임라인** - 스코어 = 타임스탬프\n\n**명령:** ZADD, ZRANGE, ZRANK, ZINCRBY\n\n**복잡도:** O(log N)",
        "type": "essay",
        "tags": ["Redis", "SortedSet"]
    },
    {
        "question": "Redis Lua 스크립팅의 장점은?",
        "answer": "**장점:**\n1. **원자성** - 스크립트 전체 원자적\n2. **네트워크 오버헤드 감소**\n3. **복잡한 로직** - 서버에서 실행\n\n**명령:** EVAL, EVALSHA\n\n**주의:** 싱글 스레드 블로킹",
        "type": "essay",
        "tags": ["Redis", "Lua"]
    },
    {
        "question": "Redis의 분산 락 구현 방법은?",
        "answer": "**SET NX EX 방식:**\n```\nSET lock_key value NX EX 10\n```\n\n**Redlock 알고리즘:**\n- 다중 Redis 인스턴스\n- 과반수 획득\n\n**해제:** Lua 스크립트로 안전하게\n\n**주의:** 타임아웃",
        "type": "essay",
        "tags": ["Redis", "Lock"]
    },
    {
        "question": "Redis 성능 최적화 방법 5가지는?",
        "answer": "1. **파이프라인** - 명령 배칭\n2. **Connection Pool** - 연결 재사용\n3. **적절한 자료구조** - 용도에 맞게\n4. **메모리 관리** - maxmemory 설정\n5. **Slow Log 모니터링**\n\n**SLOWLOG GET**",
        "type": "essay",
        "tags": ["Redis", "Performance"]
    },
    {
        "question": "Redis의 싱글 스레드 장단점은?",
        "answer": "**장점:**\n1. Atomic 연산\n2. 동기화 불필요\n3. 단순성\n\n**단점:**\n1. CPU 멀티코어 활용 불가\n2. 긴 명령 블로킹\n\n**최신:** I/O 스레드 추가 (6.0+)",
        "type": "essay",
        "tags": ["Redis", "Architecture"]
    },
    {
        "question": "Redis 모니터링 지표 5가지는?",
        "answer": "1. **메모리 사용량** - used_memory\n2. **히트율** - keyspace_hits/misses\n3. **연결 수** - connected_clients\n4. **초당 명령 수** - instantaneous_ops_per_sec\n5. **Eviction 수** - evicted_keys\n\n**명령:** INFO",
        "type": "essay",
        "tags": ["Redis", "Monitoring"]
    },
    {
        "question": "Redis의 큰 키 문제와 해결책은?",
        "answer": "**문제:**\n- 메모리 낭비\n- 느린 삭제 (블로킹)\n- 네트워크 부담\n\n**해결:**\n1. **분할** - 여러 키로\n2. **UNLINK** - 비동기 삭제\n3. **TTL 설정**\n4. **모니터링** - --bigkeys\n\n**권장:** < 10MB",
        "type": "essay",
        "tags": ["Redis", "Performance"]
    },
    {
        "question": "Redis 보안 설정 방법은?",
        "answer": "1. **requirepass** - 비밀번호 설정\n2. **bind** - IP 제한\n3. **rename-command** - 위험 명령 비활성화\n4. **protected-mode** - 외부 접근 차단\n5. **ACL** - 사용자별 권한 (6.0+)\n\n**TLS/SSL 지원**",
        "type": "essay",
        "tags": ["Redis", "Security"]
    },
    {
        "question": "Redis vs Memcached 비교는?",
        "answer": "**Redis:**\n- 다양한 자료구조\n- 영속성\n- 싱글 스레드\n- 풍부한 기능\n\n**Memcached:**\n- Key-Value만\n- 메모리 전용\n- 멀티 스레드\n- 단순, 빠름\n\n**선택:** 기능 vs 단순성",
        "type": "essay",
        "tags": ["Redis", "Comparison"]
    },
    {
        "question": "Redis의 메모리 단편화 해결 방법은?",
        "answer": "**확인:** INFO memory - mem_fragmentation_ratio\n\n**해결:**\n1. **재시작** - 단순하지만 다운타임\n2. **activedefrag** - 자동 조각 모음 (4.0+)\n3. **Replica 승격** - 새 인스턴스\n\n**1.5 이상시 조치**",
        "type": "essay",
        "tags": ["Redis", "Memory"]
    },
    {
        "question": "Redis Backup 전략은?",
        "answer": "**방법:**\n1. **RDB 백업** - SAVE/BGSAVE\n2. **AOF 복사**\n3. **Replica 활용** - 읽기 전용 복제본\n\n**자동화:**\n- SAVE 주기 설정\n- AOF rewrite 주기\n\n**복구:** RDB/AOF 로드",
        "type": "essay",
        "tags": ["Redis", "Backup"]
    },
    {
        "question": "Redis 버전별 주요 기능은?",
        "answer": "**5.0:**\n- Streams\n- Sorted Set ZPOPMIN/MAX\n\n**6.0:**\n- ACL\n- SSL/TLS\n- I/O 스레드\n\n**6.2:**\n- I/O 스레드 개선\n\n**7.0:**\n- Functions (Lua 대체)\n- Sharded Pub/Sub",
        "type": "essay",
        "tags": ["Redis", "Version"]
    },
    {
        "question": "Redis 사용 사례 5가지는?",
        "answer": "1. **캐싱** - 세션, 페이지, API 응답\n2. **세션 스토어** - 분산 세션\n3. **실시간 랭킹** - Sorted Set\n4. **메시지 큐** - Pub/Sub, Streams\n5. **Rate Limiting** - 요청 횟수 제한\n\n**분산 락, 지오펜싱 등**",
        "type": "essay",
        "tags": ["Redis", "UseCase"]
    },
    {
        "question": "Redis Rate Limiting 구현 방법은?",
        "answer": "**Fixed Window:**\n```\nINCR key\nEXPIRE key 60\nif count > limit: reject\n```\n\n**Sliding Window:**\n- Sorted Set 활용\n- 타임스탬프 저장\n- ZREMRANGEBYSCORE\n\n**Token Bucket:** Lua 스크립트",
        "type": "essay",
        "tags": ["Redis", "RateLimit"]
    },
    {
        "question": "Redis 클라이언트 라이브러리 선택 기준은?",
        "answer": "**고려사항:**\n1. **Connection Pool** - 필수\n2. **Pipeline 지원**\n3. **Cluster 지원**\n4. **성능**\n5. **유지보수**\n\n**예:** Jedis, Lettuce (Java), ioredis (Node.js), redis-py (Python)",
        "type": "essay",
        "tags": ["Redis", "Client"]
    }
]

# 기존 5개 샘플 대체
brief["cards"] = all_cards

print(f"전체 {len(brief['cards'])}개 카드 생성 완료")

# 저장
with open('public/data/dataset-brief/redis/redis.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"\n🎉 Redis 간략버전 100% 완성! 총 {len(brief['cards'])}개 카드")
print(f"✅ 파일 저장: public/data/dataset-brief/redis/redis.json")
