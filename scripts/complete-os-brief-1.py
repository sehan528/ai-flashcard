#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
os.json 간략버전 생성 (카드 1-30)
"""

import json

# 기존 간략버전 로드
with open('public/data/dataset-brief/os/os.json', 'r', encoding='utf-8') as f:
    brief = json.load(f)

print(f"현재 카드 수: {len(brief['cards'])}")

# 카드 1-30 추가
cards_1_30 = [
    {
        "question": "프로세스와 스레드의 차이점 3가지는?",
        "answer": "1. **메모리** - 프로세스: 독립 / 스레드: 공유\n2. **생성 비용** - 프로세스: 높음 / 스레드: 낮음\n3. **통신** - 프로세스: IPC / 스레드: 변수 공유\n\n**스레드:** 프로세스 내 실행 단위",
        "type": "essay",
        "tags": ["OS", "Process", "Thread"]
    },
    {
        "question": "프로세스의 메모리 구조 4가지는?",
        "answer": "1. **Code (Text)** - 실행 코드\n2. **Data** - 전역/정적 변수\n3. **Heap** - 동적 할당 (malloc)\n4. **Stack** - 지역 변수, 함수 호출\n\n**성장:** Heap ↑ / Stack ↓",
        "type": "essay",
        "tags": ["OS", "Memory"]
    },
    {
        "question": "프로세스 상태 5가지는?",
        "answer": "1. **New** - 생성\n2. **Ready** - 실행 대기\n3. **Running** - 실행 중\n4. **Waiting (Blocked)** - I/O 대기\n5. **Terminated** - 종료",
        "type": "essay",
        "tags": ["OS", "Process"]
    },
    {
        "question": "PCB(Process Control Block)에 포함된 정보는?",
        "answer": "1. **프로세스 ID (PID)**\n2. **프로세스 상태**\n3. **Program Counter** - 다음 명령어 주소\n4. **CPU 레지스터** - 컨텍스트\n5. **메모리 정보** - 메모리 주소 공간\n6. **스케줄링 정보** - 우선순위 등",
        "type": "essay",
        "tags": ["OS", "Process"]
    },
    {
        "question": "컨텍스트 스위칭(Context Switching)의 과정과 비용은?",
        "answer": "**과정:**\n1. 현재 프로세스 상태 PCB 저장\n2. 다음 프로세스 PCB 로드\n3. CPU 레지스터 복원\n\n**비용:**\n- 캐시 무효화\n- TLB 플러시\n- 순수 오버헤드",
        "type": "essay",
        "tags": ["OS", "Process"]
    },
    {
        "question": "CPU 스케줄링 알고리즘 6가지는?",
        "answer": "1. **FCFS** - First Come First Served\n2. **SJF** - Shortest Job First\n3. **SRTF** - Shortest Remaining Time First\n4. **Priority** - 우선순위\n5. **Round Robin** - 시간 할당량\n6. **Multilevel Queue** - 다단계 큐",
        "type": "essay",
        "tags": ["OS", "Scheduling"]
    },
    {
        "question": "선점형과 비선점형 스케줄링의 차이는?",
        "answer": "**선점형 (Preemptive):**\n- 실행 중 강제 전환\n- Round Robin, SRTF, Priority\n- 응답 시간 빠름\n\n**비선점형 (Non-preemptive):**\n- 자발적 양보까지 대기\n- FCFS, SJF\n- 컨텍스트 스위칭 적음",
        "type": "essay",
        "tags": ["OS", "Scheduling"]
    },
    {
        "question": "Round Robin의 특징과 시간 할당량 영향은?",
        "answer": "**특징:**\n- 시간 할당량(Time Quantum) 기반\n- 선점형\n- 공평성\n\n**시간 할당량:**\n- 너무 크면 → FCFS화\n- 너무 작으면 → 컨텍스트 스위칭 과다",
        "type": "essay",
        "tags": ["OS", "Scheduling"]
    },
    {
        "question": "Convoy Effect와 Starvation의 차이는?",
        "answer": "**Convoy Effect:**\n- FCFS에서 긴 작업이 앞에 있을 때\n- 뒤의 짧은 작업들 대기\n- 평균 대기 시간 증가\n\n**Starvation:**\n- 우선순위 낮은 프로세스가 무한 대기\n- Aging으로 해결",
        "type": "essay",
        "tags": ["OS", "Scheduling"]
    },
    {
        "question": "프로세스 동기화가 필요한 이유는?",
        "answer": "**Race Condition 방지**\n\n**문제:**\n- 공유 자원 동시 접근\n- 실행 순서에 따라 결과 달라짐\n\n**해결:**\n- 상호 배제 (Mutual Exclusion)\n- 임계 영역 (Critical Section) 보호",
        "type": "essay",
        "tags": ["OS", "Synchronization"]
    },
    {
        "question": "임계 영역(Critical Section) 해결 조건 3가지는?",
        "answer": "1. **상호 배제** - 한 번에 하나만 진입\n2. **진행 (Progress)** - 대기 중이면 진입 가능\n3. **한정 대기** - 무한 대기 방지\n\n**추가:** 성능 (빠른 진입/퇴출)",
        "type": "essay",
        "tags": ["OS", "Synchronization"]
    },
    {
        "question": "뮤텍스(Mutex)와 세마포어(Semaphore)의 차이는?",
        "answer": "**Mutex:**\n- Binary (0 또는 1)\n- 소유권 개념 (락 건 스레드만 해제)\n- 상호 배제\n\n**Semaphore:**\n- Counter (N개 허용)\n- 소유권 없음\n- 자원 관리\n\n**Binary Semaphore ≠ Mutex (소유권)**",
        "type": "essay",
        "tags": ["OS", "Synchronization"]
    },
    {
        "question": "스핀락(Spinlock)의 특징과 적합한 상황은?",
        "answer": "**특징:**\n- Busy Waiting (루프 돌며 대기)\n- 컨텍스트 스위칭 없음\n- CPU 소모\n\n**적합:**\n- 짧은 임계 영역\n- 멀티 코어 환경\n- 실시간 시스템",
        "type": "essay",
        "tags": ["OS", "Lock"]
    },
    {
        "question": "데드락(Deadlock)의 발생 조건 4가지는?",
        "answer": "1. **상호 배제** - 자원 독점\n2. **점유와 대기** - 자원 보유 + 추가 대기\n3. **비선점** - 강제로 빼앗을 수 없음\n4. **순환 대기** - 자원 대기 그래프 순환\n\n**4가지 모두 만족시 데드락**",
        "type": "essay",
        "tags": ["OS", "Deadlock"]
    },
    {
        "question": "데드락 처리 방법 4가지는?",
        "answer": "1. **예방** - 4가지 조건 중 하나 제거\n2. **회피** - 안전 상태 유지 (은행원 알고리즘)\n3. **탐지 및 회복** - 주기적 검사, 프로세스 종료\n4. **무시** - 발생 확률 낮으면 (타조 알고리즘)",
        "type": "essay",
        "tags": ["OS", "Deadlock"]
    },
    {
        "question": "은행원 알고리즘(Banker's Algorithm)의 개념은?",
        "answer": "**개념:** 자원 할당 전 안전 상태 검사\n\n**동작:**\n1. 요청 자원 할당 가정\n2. 안전 순서열 존재 확인\n3. 안전하면 할당, 아니면 대기\n\n**단점:** 사전에 최대 자원 수 알아야 함",
        "type": "essay",
        "tags": ["OS", "Deadlock"]
    },
    {
        "question": "메모리 관리 기법 3가지는?",
        "answer": "1. **연속 할당** - 고정/가변 분할\n2. **페이징** - 고정 크기 페이지\n3. **세그멘테이션** - 가변 크기 세그먼트\n\n**현대:** 페이징 + 세그멘테이션",
        "type": "essay",
        "tags": ["OS", "Memory"]
    },
    {
        "question": "내부 단편화와 외부 단편화의 차이는?",
        "answer": "**내부 단편화:**\n- 할당된 메모리 내부 낭비\n- 페이징 발생\n- 페이지 크기 조절로 완화\n\n**외부 단편화:**\n- 할당 가능한 메모리가 흩어짐\n- 세그멘테이션 발생\n- 압축(Compaction)으로 해결",
        "type": "essay",
        "tags": ["OS", "Memory"]
    },
    {
        "question": "페이징(Paging)의 개념과 구성 요소는?",
        "answer": "**개념:** 물리 메모리를 고정 크기로 분할\n\n**구성:**\n- **Page** - 논리 메모리 단위\n- **Frame** - 물리 메모리 단위\n- **Page Table** - 매핑 테이블\n\n**크기:** 보통 4KB",
        "type": "essay",
        "tags": ["OS", "Paging"]
    },
    {
        "question": "페이지 테이블의 구조와 문제점은?",
        "answer": "**구조:** 논리 주소 → 물리 주소 매핑\n\n**문제:**\n- 큰 메모리 공간 필요\n- 메모리 접근 2번 (테이블 + 실제 데이터)\n\n**해결:**\n1. **TLB** - 캐시\n2. **계층적 페이징**\n3. **역 페이지 테이블**",
        "type": "essay",
        "tags": ["OS", "Paging"]
    },
    {
        "question": "TLB(Translation Lookaside Buffer)란?",
        "answer": "**개념:** 페이지 테이블 캐시\n\n**특징:**\n- 빠른 주소 변환\n- 하드웨어 구현\n- 작은 크기 (수십~수백 엔트리)\n\n**동작:**\n- TLB Hit → 빠른 변환\n- TLB Miss → 페이지 테이블 참조",
        "type": "essay",
        "tags": ["OS", "TLB"]
    },
    {
        "question": "다단계 페이지 테이블의 장점은?",
        "answer": "**장점:**\n1. 메모리 절약 - 사용 안하는 부분 미할당\n2. 큰 주소 공간 지원\n\n**단점:**\n- 메모리 접근 횟수 증가\n\n**예:** x86-64는 4단계 페이징",
        "type": "essay",
        "tags": ["OS", "Paging"]
    },
    {
        "question": "가상 메모리(Virtual Memory)의 개념과 장점은?",
        "answer": "**개념:** 물리 메모리보다 큰 주소 공간 제공\n\n**장점:**\n1. 메모리 부족 해결\n2. 프로세스 격리\n3. 공유 메모리 구현\n4. 효율적 메모리 활용\n\n**구현:** Demand Paging",
        "type": "essay",
        "tags": ["OS", "VirtualMemory"]
    },
    {
        "question": "Demand Paging의 동작 원리는?",
        "answer": "**원리:** 필요할 때만 페이지 로드\n\n**동작:**\n1. Page Fault 발생\n2. 디스크에서 페이지 로드\n3. 페이지 테이블 업데이트\n4. 명령어 재실행\n\n**장점:** 메모리 절약, 빠른 시작",
        "type": "essay",
        "tags": ["OS", "Paging"]
    },
    {
        "question": "페이지 교체 알고리즘 5가지는?",
        "answer": "1. **FIFO** - 먼저 들어온 것\n2. **OPT (Optimal)** - 가장 나중에 사용될 것 (이론적)\n3. **LRU** - Least Recently Used\n4. **LFU** - Least Frequently Used\n5. **Clock (Second Chance)** - FIFO + Reference bit",
        "type": "essay",
        "tags": ["OS", "PageReplacement"]
    },
    {
        "question": "Belady's Anomaly란?",
        "answer": "**현상:** 프레임 수 증가했는데 Page Fault 증가\n\n**발생:** FIFO 알고리즘\n\n**해결:** LRU 등 Stack 알고리즘 사용\n\n**이유:** FIFO는 페이지 사용 패턴 무시",
        "type": "essay",
        "tags": ["OS", "PageReplacement"]
    },
    {
        "question": "LRU 구현 방법 2가지는?",
        "answer": "1. **Stack** - 최근 사용을 top으로\n2. **Counter** - 타임스탬프 기록\n\n**문제:** 오버헤드\n\n**대안:**\n- LRU Approximation (Reference bit)\n- Clock Algorithm",
        "type": "essay",
        "tags": ["OS", "LRU"]
    },
    {
        "question": "Thrashing의 개념과 원인은?",
        "answer": "**개념:** Page Fault 과다로 시스템 성능 급격히 저하\n\n**원인:**\n- 프로세스가 필요한 페이지보다 적은 프레임 할당\n- 지속적인 Page In/Out\n\n**해결:**\n- Working Set 보장\n- 다중 프로그래밍 정도 감소",
        "type": "essay",
        "tags": ["OS", "Thrashing"]
    },
    {
        "question": "Working Set의 개념과 활용은?",
        "answer": "**개념:** 일정 시간 동안 참조된 페이지 집합\n\n**활용:**\n- 프로세스가 필요한 최소 페이지 예측\n- Thrashing 방지\n- 적절한 프레임 할당\n\n**Locality 원리 기반**",
        "type": "essay",
        "tags": ["OS", "WorkingSet"]
    },
    {
        "question": "Locality의 종류 2가지는?",
        "answer": "1. **시간 지역성 (Temporal)** - 최근 참조된 것 재참조\n2. **공간 지역성 (Spatial)** - 인접한 주소 참조\n\n**활용:**\n- 캐시\n- Prefetching\n- Page 교체",
        "type": "essay",
        "tags": ["OS", "Locality"]
    }
]

# 기존 5개 샘플 대체
brief["cards"] = cards_1_30

print(f"카드 1-30 추가 완료 (총 {len(brief['cards'])}개)")

# 저장
with open('public/data/dataset-brief/os/os.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"✅ OS 간략버전 저장 완료! (진행률: {len(brief['cards'])}/122)")
