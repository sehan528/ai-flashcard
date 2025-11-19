#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
etc.json 간략버전 완성 (44 cards - 개발상식/CS기타)
"""

import json

# 간략버전 데이터 구조
brief = {
    "name": "개발상식 (간략버전)",
    "description": "CS 기타 핵심 개념을 간결하게 정리한 버전",
    "cards": []
}

# 44개 카드 생성
all_cards = [
    {
        "question": "Git의 주요 명령어 6가지는?",
        "answer": "1. **git init** - 저장소 초기화\n2. **git add** - 스테이징\n3. **git commit** - 커밋\n4. **git push** - 원격 저장소 업로드\n5. **git pull** - 원격 저장소 다운로드\n6. **git branch** - 브랜치 관리",
        "type": "essay",
        "tags": ["CS", "Git"]
    },
    {
        "question": "Git의 3가지 영역은?",
        "answer": "1. **Working Directory** - 작업 공간\n2. **Staging Area (Index)** - 커밋 대기\n3. **Repository (.git)** - 버전 저장소\n\n**흐름:** Working → Staging → Repository",
        "type": "essay",
        "tags": ["CS", "Git"]
    },
    {
        "question": "Git merge와 rebase의 차이는?",
        "answer": "**Merge:**\n- 브랜치 병합, 머지 커밋 생성\n- 히스토리 보존\n- 복잡한 그래프\n\n**Rebase:**\n- 커밋 재배치\n- 선형 히스토리\n- 깔끔하지만 히스토리 변경\n\n**공개 브랜치는 merge 권장**",
        "type": "essay",
        "tags": ["CS", "Git"]
    },
    {
        "question": "Git의 브랜칭 전략 3가지는?",
        "answer": "1. **Git Flow** - master, develop, feature, release, hotfix\n2. **GitHub Flow** - master, feature만 (간단)\n3. **GitLab Flow** - environment 브랜치 추가\n\n**선택:** 프로젝트 규모와 배포 주기에 따라",
        "type": "essay",
        "tags": ["CS", "Git"]
    },
    {
        "question": "CI/CD의 개념과 차이는?",
        "answer": "**CI (Continuous Integration):**\n- 코드 통합 자동화\n- 빌드, 테스트 자동 실행\n\n**CD (Continuous Delivery/Deployment):**\n- 배포 자동화\n- Delivery: 수동 승인\n- Deployment: 완전 자동\n\n**목적:** 빠른 피드백, 품질 향상",
        "type": "essay",
        "tags": ["CS", "CICD"]
    },
    {
        "question": "TDD의 개발 순서 3단계는?",
        "answer": "1. **Red** - 실패하는 테스트 작성\n2. **Green** - 테스트 통과하는 최소 코드\n3. **Refactor** - 코드 개선\n\n**장점:** 버그 감소, 설계 개선, 문서화\n**단점:** 초기 시간 투자",
        "type": "essay",
        "tags": ["CS", "TDD"]
    },
    {
        "question": "애자일의 핵심 가치 4가지는?",
        "answer": "1. **개인과 상호작용** > 프로세스와 도구\n2. **작동하는 소프트웨어** > 포괄적 문서\n3. **고객과 협력** > 계약 협상\n4. **변화 대응** > 계획 따르기",
        "type": "essay",
        "tags": ["CS", "Agile"]
    },
    {
        "question": "Scrum의 주요 역할 3가지는?",
        "answer": "1. **Product Owner** - 제품 책임, 백로그 관리\n2. **Scrum Master** - 프로세스 촉진\n3. **Development Team** - 개발 담당\n\n**이벤트:** Sprint, Daily Standup, Review, Retrospective",
        "type": "essay",
        "tags": ["CS", "Scrum"]
    },
    {
        "question": "RESTful API 설계 원칙 6가지는?",
        "answer": "1. **URI는 자원** - 명사 사용\n2. **HTTP 메서드** - GET, POST, PUT, DELETE\n3. **무상태성** - Stateless\n4. **계층 구조** - 슬래시(/)\n5. **표준 HTTP 코드** - 200, 201, 400, 404, 500\n6. **JSON 응답** - 일관된 형식",
        "type": "essay",
        "tags": ["CS", "REST"]
    },
    {
        "question": "HTTP 메서드의 멱등성은?",
        "answer": "**멱등성 O:**\n- GET (조회)\n- PUT (전체 수정)\n- DELETE (삭제)\n- HEAD, OPTIONS\n\n**멱등성 X:**\n- POST (생성)\n- PATCH (부분 수정)\n\n**의미:** 여러 번 실행해도 결과 동일",
        "type": "essay",
        "tags": ["CS", "HTTP"]
    },
    {
        "question": "모놀리식과 마이크로서비스의 차이는?",
        "answer": "**모놀리식:**\n- 하나의 애플리케이션\n- 배포 단순\n- 확장 어려움\n\n**마이크로서비스:**\n- 독립 서비스들\n- 독립 배포\n- 복잡도 증가\n- 확장 용이\n\n**선택:** 프로젝트 규모, 팀 구조",
        "type": "essay",
        "tags": ["CS", "Architecture"]
    },
    {
        "question": "12 Factor App의 주요 원칙 5가지는?",
        "answer": "1. **코드베이스** - 하나의 저장소\n2. **의존성** - 명시적 선언\n3. **설정** - 환경변수로 분리\n4. **백엔드 서비스** - 리소스로 취급\n5. **빌드/실행 분리** - 엄격히 구분\n\n**목적:** 클라우드 네이티브 앱",
        "type": "essay",
        "tags": ["CS", "12Factor"]
    },
    {
        "question": "도커의 주요 개념 4가지는?",
        "answer": "1. **Image** - 실행 파일 (읽기 전용)\n2. **Container** - 실행 인스턴스\n3. **Dockerfile** - 이미지 빌드 스크립트\n4. **Registry** - 이미지 저장소 (Docker Hub)\n\n**계층:** Image → Container",
        "type": "essay",
        "tags": ["CS", "Docker"]
    },
    {
        "question": "VM과 컨테이너의 차이는?",
        "answer": "**VM:**\n- 하이퍼바이저\n- 게스트 OS 포함\n- 무겁고 느림 (GB)\n\n**컨테이너:**\n- OS 커널 공유\n- 가볍고 빠름 (MB)\n- Docker, LXC\n\n**용도에 따라 선택**",
        "type": "essay",
        "tags": ["CS", "Container"]
    },
    {
        "question": "쿠버네티스의 주요 개념 5가지는?",
        "answer": "1. **Pod** - 최소 배포 단위\n2. **Service** - 네트워크 추상화\n3. **Deployment** - 배포 관리\n4. **Namespace** - 논리적 분리\n5. **ConfigMap/Secret** - 설정 관리",
        "type": "essay",
        "tags": ["CS", "Kubernetes"]
    },
    {
        "question": "OAuth 2.0의 4가지 역할은?",
        "answer": "1. **Resource Owner** - 사용자\n2. **Client** - 애플리케이션\n3. **Authorization Server** - 인증 서버\n4. **Resource Server** - API 서버\n\n**토큰:** Access Token, Refresh Token",
        "type": "essay",
        "tags": ["CS", "OAuth"]
    },
    {
        "question": "JWT의 구조 3가지는?",
        "answer": "1. **Header** - 알고리즘, 타입\n2. **Payload** - 클레임 (데이터)\n3. **Signature** - 서명 (검증)\n\n**형식:** xxxxx.yyyyy.zzzzz\n**특징:** Self-contained, Stateless",
        "type": "essay",
        "tags": ["CS", "JWT"]
    },
    {
        "question": "세션 기반과 토큰 기반 인증의 차이는?",
        "answer": "**세션:**\n- 서버에 저장\n- 세션 ID 쿠키\n- Stateful\n\n**토큰 (JWT):**\n- 클라이언트 저장\n- Self-contained\n- Stateless\n- 확장성 좋음",
        "type": "essay",
        "tags": ["CS", "Auth"]
    },
    {
        "question": "SOLID 원칙 5가지는?",
        "answer": "1. **SRP** - Single Responsibility (단일 책임)\n2. **OCP** - Open/Closed (개방-폐쇄)\n3. **LSP** - Liskov Substitution (리스코프 치환)\n4. **ISP** - Interface Segregation (인터페이스 분리)\n5. **DIP** - Dependency Inversion (의존성 역전)",
        "type": "essay",
        "tags": ["CS", "SOLID"]
    },
    {
        "question": "디자인 패턴의 분류 3가지는?",
        "answer": "1. **생성 패턴** - Singleton, Factory, Builder\n2. **구조 패턴** - Adapter, Decorator, Proxy\n3. **행위 패턴** - Observer, Strategy, Template Method\n\n**GoF 23가지 패턴**",
        "type": "essay",
        "tags": ["CS", "DesignPattern"]
    },
    {
        "question": "Singleton 패턴의 장단점은?",
        "answer": "**장점:**\n- 인스턴스 1개만\n- 전역 접근\n\n**단점:**\n- 테스트 어려움\n- 결합도 증가\n- 멀티스레드 주의\n\n**구현:** Lazy/Eager, Thread-safe",
        "type": "essay",
        "tags": ["CS", "DesignPattern"]
    },
    {
        "question": "Factory 패턴의 목적은?",
        "answer": "**목적:** 객체 생성 캡슐화\n\n**장점:**\n- 결합도 감소\n- 유연성\n- OCP 준수\n\n**종류:**\n- Simple Factory\n- Factory Method\n- Abstract Factory",
        "type": "essay",
        "tags": ["CS", "DesignPattern"]
    },
    {
        "question": "Observer 패턴의 개념은?",
        "answer": "**개념:** 1:N 의존 관계, 상태 변화 자동 알림\n\n**구성:**\n- Subject (주체)\n- Observer (관찰자)\n\n**예:** Event Listener, Pub/Sub\n\n**장점:** 느슨한 결합",
        "type": "essay",
        "tags": ["CS", "DesignPattern"]
    },
    {
        "question": "Strategy 패턴의 목적은?",
        "answer": "**목적:** 알고리즘을 캡슐화하여 교체 가능하게\n\n**예:**\n- 정렬 알고리즘 선택\n- 결제 방법 선택\n\n**장점:** OCP, 런타임 변경\n\n**vs Template Method:** 상속 vs 위임",
        "type": "essay",
        "tags": ["CS", "DesignPattern"]
    },
    {
        "question": "MVC 패턴의 구성 요소는?",
        "answer": "1. **Model** - 데이터, 비즈니스 로직\n2. **View** - UI, 표현\n3. **Controller** - 입력 처리, 중재\n\n**흐름:** User → Controller → Model → View\n\n**장점:** 관심사 분리",
        "type": "essay",
        "tags": ["CS", "Architecture"]
    },
    {
        "question": "클린 아키텍처의 핵심 원칙은?",
        "answer": "**원칙:**\n1. **의존성 규칙** - 외부 → 내부 (단방향)\n2. **계층 분리** - Entity, Use Case, Interface, Framework\n3. **독립성** - UI, DB, 프레임워크 독립\n\n**목적:** 테스트 용이성, 유지보수성",
        "type": "essay",
        "tags": ["CS", "Architecture"]
    },
    {
        "question": "DDD의 주요 개념 5가지는?",
        "answer": "1. **Entity** - 식별자 있는 객체\n2. **Value Object** - 값으로 구분\n3. **Aggregate** - 일관성 경계\n4. **Repository** - 영속성 추상화\n5. **Domain Service** - 도메인 로직\n\n**Ubiquitous Language 중요**",
        "type": "essay",
        "tags": ["CS", "DDD"]
    },
    {
        "question": "CQRS 패턴의 개념은?",
        "answer": "**개념:** Command와 Query 분리\n\n**Command (CUD):**\n- 상태 변경\n- 반환값 없음\n\n**Query (R):**\n- 상태 조회\n- 변경 없음\n\n**장점:** 읽기/쓰기 최적화 독립\n**복잡도:** 증가",
        "type": "essay",
        "tags": ["CS", "CQRS"]
    },
    {
        "question": "Event Sourcing의 개념은?",
        "answer": "**개념:** 상태 변경을 이벤트로 저장\n\n**특징:**\n- 모든 변경 기록\n- 이벤트 재생으로 상태 복원\n- Audit 용이\n\n**단점:** 복잡도, 성능\n\n**CQRS와 함께 사용**",
        "type": "essay",
        "tags": ["CS", "EventSourcing"]
    },
    {
        "question": "CAP 정리의 3가지 요소는?",
        "answer": "1. **Consistency** - 일관성\n2. **Availability** - 가용성\n3. **Partition Tolerance** - 분할 내성\n\n**정리:** 3가지 중 2가지만 선택 가능\n\n**예:** CP(HBase), AP(Cassandra), CA(RDBMS)",
        "type": "essay",
        "tags": ["CS", "DistributedSystem"]
    },
    {
        "question": "BASE vs ACID의 차이는?",
        "answer": "**ACID (RDBMS):**\n- 강한 일관성\n- 트랜잭션\n\n**BASE (NoSQL):**\n- **BA**sically Available\n- **S**oft state\n- **E**ventual consistency\n- 최종 일관성\n\n**용도:** 분산 시스템",
        "type": "essay",
        "tags": ["CS", "DistributedSystem"]
    },
    {
        "question": "샤딩과 파티셔닝의 차이는?",
        "answer": "**파티셔닝:**\n- 하나의 DB 내 분할\n- 수직/수평\n\n**샤딩:**\n- 여러 DB에 분산 (수평 파티셔닝)\n- 확장성\n\n**문제:** JOIN 어려움, 일관성",
        "type": "essay",
        "tags": ["CS", "Database"]
    },
    {
        "question": "Eventual Consistency의 개념은?",
        "answer": "**개념:** 일정 시간 후 최종적으로 일관성 보장\n\n**특징:**\n- 즉시 일관성 아님\n- 가용성 우선\n- 분산 시스템\n\n**예:** DNS, NoSQL\n\n**vs Strong Consistency**",
        "type": "essay",
        "tags": ["CS", "Consistency"]
    },
    {
        "question": "메시지 큐의 장점과 예시는?",
        "answer": "**장점:**\n1. 비동기 처리\n2. 부하 분산\n3. 결합도 감소\n4. 확장성\n\n**예:** RabbitMQ, Kafka, SQS\n\n**패턴:** Pub/Sub, Point-to-Point",
        "type": "essay",
        "tags": ["CS", "MessageQueue"]
    },
    {
        "question": "Kafka의 주요 개념 4가지는?",
        "answer": "1. **Producer** - 메시지 발행\n2. **Consumer** - 메시지 소비\n3. **Topic** - 메시지 카테고리\n4. **Partition** - 토픽 분할, 병렬 처리\n\n**특징:** 높은 처리량, 영속성",
        "type": "essay",
        "tags": ["CS", "Kafka"]
    },
    {
        "question": "gRPC의 특징 4가지는?",
        "answer": "1. **HTTP/2** - 멀티플렉싱, 스트리밍\n2. **Protocol Buffers** - 효율적 직렬화\n3. **언어 중립** - 다양한 언어 지원\n4. **4가지 통신** - Unary, Server/Client/Bi-directional Streaming\n\n**vs REST:** 빠르지만 복잡",
        "type": "essay",
        "tags": ["CS", "gRPC"]
    },
    {
        "question": "GraphQL의 특징과 장점은?",
        "answer": "**특징:**\n- 쿼리 언어\n- 단일 엔드포인트\n- 클라이언트가 필요한 데이터만 요청\n\n**장점:**\n- Over/Under fetching 해결\n- 강력한 타입 시스템\n\n**vs REST:** 유연성 vs 단순성",
        "type": "essay",
        "tags": ["CS", "GraphQL"]
    },
    {
        "question": "로드 밸런싱 알고리즘 4가지는?",
        "answer": "1. **Round Robin** - 순차 분배\n2. **Least Connection** - 연결 수 적은 곳\n3. **IP Hash** - IP 기반 고정\n4. **Weighted** - 가중치 기반\n\n**L4/L7 로드밸런서**",
        "type": "essay",
        "tags": ["CS", "LoadBalancing"]
    },
    {
        "question": "캐싱 전략 4가지는?",
        "answer": "1. **Cache Aside** - 애플리케이션 관리\n2. **Read Through** - 캐시가 DB 읽기\n3. **Write Through** - 캐시+DB 동시 쓰기\n4. **Write Behind** - 비동기 DB 쓰기\n\n**TTL, Eviction Policy 설정 중요**",
        "type": "essay",
        "tags": ["CS", "Cache"]
    },
    {
        "question": "CORS의 개념과 해결 방법은?",
        "answer": "**개념:** Cross-Origin Resource Sharing, 다른 출처 리소스 공유\n\n**SOP 위반 시 차단**\n\n**해결:**\n- Access-Control-Allow-Origin 헤더\n- Preflight 요청 (OPTIONS)\n- Proxy 서버\n\n**보안:** Origin 검증",
        "type": "essay",
        "tags": ["CS", "CORS"]
    },
    {
        "question": "웹 성능 최적화 기법 6가지는?",
        "answer": "1. **코드 분할** - Lazy Loading\n2. **이미지 최적화** - WebP, 압축\n3. **번들 최적화** - Tree Shaking\n4. **캐싱** - Browser/CDN 캐시\n5. **CDN** - 지리적 분산\n6. **Critical CSS** - 인라인\n\n**측정:** Lighthouse",
        "type": "essay",
        "tags": ["CS", "Performance"]
    },
    {
        "question": "보안 위협과 대응 5가지는?",
        "answer": "1. **XSS** - 입력 검증, CSP\n2. **CSRF** - 토큰, SameSite Cookie\n3. **SQL Injection** - Prepared Statement\n4. **DDoS** - Rate Limiting, CDN\n5. **Man-in-the-Middle** - HTTPS, HSTS\n\n**OWASP Top 10**",
        "type": "essay",
        "tags": ["CS", "Security"]
    },
    {
        "question": "정규표현식 기본 패턴 6가지는?",
        "answer": "1. **.** - 임의 문자\n2. **\\*** - 0회 이상\n3. **+** - 1회 이상\n4. **?** - 0 or 1회\n5. **^** - 시작\n6. **$** - 끝\n\n**그룹:** (), 선택: |, 범위: []",
        "type": "essay",
        "tags": ["CS", "Regex"]
    },
    {
        "question": "API 버저닝 방법 3가지는?",
        "answer": "1. **URI** - /v1/users, /v2/users\n2. **Query Parameter** - /users?version=1\n3. **Header** - Accept: application/vnd.api+json;version=1\n\n**선택:** 명확성 vs 유연성\n\n**하위 호환성 유지 중요**",
        "type": "essay",
        "tags": ["CS", "API"]
    }
]

brief["cards"] = all_cards

print(f"전체 {len(brief['cards'])}개 카드 생성 완료")

# 저장
with open('public/data/dataset-brief/etc/etc.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"\n🎉 개발상식(etc) 간략버전 100% 완성! 총 {len(brief['cards'])}개 카드")
print(f"✅ 파일 저장: public/data/dataset-brief/etc/etc.json")
