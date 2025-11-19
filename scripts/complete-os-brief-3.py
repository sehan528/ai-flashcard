#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
os.json 간략버전 계속 추가 (카드 61-90)
"""

import json

# 기존 데이터 로드
with open('public/data/dataset-brief/os/os.json', 'r', encoding='utf-8') as f:
    brief = json.load(f)

print(f"현재 카드 수: {len(brief['cards'])}")

# 카드 61-90 추가
cards_61_90 = [
    {
        "question": "컨테이너와 VM의 차이점은?",
        "answer": "**컨테이너:**\n- OS 커널 공유\n- 가벼움 (MB)\n- 빠른 시작 (초)\n- Docker, LXC\n\n**VM:**\n- 별도 OS\n- 무거움 (GB)\n- 느린 시작 (분)\n- VirtualBox, VMware",
        "type": "essay",
        "tags": ["OS", "Container"]
    },
    {
        "question": "Priority Inversion 문제와 해결책은?",
        "answer": "**문제:** 낮은 우선순위가 자원 점유, 높은 우선순위 대기\n\n**해결:**\n1. **Priority Inheritance** - 일시적 우선순위 상승\n2. **Priority Ceiling** - 최고 우선순위로 설정\n\n**사례:** Mars Pathfinder",
        "type": "essay",
        "tags": ["OS", "Priority"]
    },
    {
        "question": "Semaphore 구현시 주의사항은?",
        "answer": "**Busy Waiting 방지:**\n- Block/Wakeup 방식 사용\n- Wait Queue 활용\n\n**Atomic Operation:**\n- P/V 연산 원자적 실행\n- Test-and-Set, Compare-and-Swap\n\n**Deadlock 방지**",
        "type": "essay",
        "tags": ["OS", "Semaphore"]
    },
    {
        "question": "Monitor의 개념과 장점은?",
        "answer": "**개념:** 상호 배제 자동 제공하는 추상화\n\n**구성:**\n- 공유 데이터\n- Mutex (암시적)\n- Condition Variable\n\n**장점:**\n- 프로그래밍 쉬움\n- 안전함\n\n**예:** Java synchronized",
        "type": "essay",
        "tags": ["OS", "Monitor"]
    },
    {
        "question": "Reader-Writer Problem의 해결 방법은?",
        "answer": "**문제:** 읽기는 동시, 쓰기는 독점\n\n**해결:**\n1. **Reader 우선** - Starvation (Writer)\n2. **Writer 우선** - Starvation (Reader)\n3. **공정** - 순서대로\n\n**RW Lock 사용**",
        "type": "essay",
        "tags": ["OS", "Synchronization"]
    },
    {
        "question": "Dining Philosophers Problem의 해결책은?",
        "answer": "**해결:**\n1. **비대칭** - 한 명은 반대 순서\n2. **최대 N-1명** - 동시 식사 제한\n3. **원자적** - 두 포크 동시 획득\n4. **타임아웃**\n\n**Deadlock 예방 문제**",
        "type": "essay",
        "tags": ["OS", "Deadlock"]
    },
    {
        "question": "Bounded Buffer Problem의 해결책은?",
        "answer": "**Semaphore 사용:**\n- empty = N (빈 슬롯)\n- full = 0 (찬 슬롯)\n- mutex = 1 (상호 배제)\n\n**Producer:** wait(empty) → wait(mutex) → signal(mutex) → signal(full)\n**Consumer:** wait(full) → wait(mutex) → signal(mutex) → signal(empty)",
        "type": "essay",
        "tags": ["OS", "Synchronization"]
    },
    {
        "question": "메모리 보호 기법 3가지는?",
        "answer": "1. **Base & Limit Register** - 범위 체크\n2. **Paging** - 페이지 테이블 권한\n3. **Segmentation** - 세그먼트 보호\n\n**MMU (Memory Management Unit)가 하드웨어로 지원**",
        "type": "essay",
        "tags": ["OS", "Memory"]
    },
    {
        "question": "Copy-on-Write(COW)의 개념과 용도는?",
        "answer": "**개념:** 쓰기 전까지 복사 지연\n\n**용도:**\n1. fork() 최적화\n2. 가상 메모리\n3. 파일 시스템 스냅샷\n\n**장점:** 메모리 절약, 빠른 복사\n\n**구현:** Page Fault 활용",
        "type": "essay",
        "tags": ["OS", "COW"]
    },
    {
        "question": "메모리 압축(Memory Compression)의 개념은?",
        "answer": "**개념:** 메모리 페이지를 압축하여 더 많은 데이터 저장\n\n**장점:**\n- Swap 감소\n- 성능 향상\n\n**단점:**\n- CPU 오버헤드\n\n**사용:** macOS, Linux zRAM",
        "type": "essay",
        "tags": ["OS", "Memory"]
    },
    {
        "question": "Huge Page의 개념과 장점은?",
        "answer": "**개념:** 기본 페이지(4KB)보다 큰 페이지 (2MB, 1GB)\n\n**장점:**\n1. TLB Miss 감소\n2. 페이지 테이블 크기 감소\n3. 대용량 메모리 성능 향상\n\n**단점:** 내부 단편화 증가\n\n**용도:** 데이터베이스, VM",
        "type": "essay",
        "tags": ["OS", "Memory"]
    },
    {
        "question": "NUMA(Non-Uniform Memory Access)의 특징은?",
        "answer": "**특징:**\n- CPU가 자신의 로컬 메모리 빠르게 접근\n- 다른 CPU 메모리는 느림\n\n**고려사항:**\n- 메모리 배치 최적화\n- NUMA-aware 스케줄링\n\n**대비:** UMA (Uniform)",
        "type": "essay",
        "tags": ["OS", "NUMA"]
    },
    {
        "question": "메모리 매핑 파일(Memory-Mapped File)의 개념은?",
        "answer": "**개념:** 파일을 메모리 주소 공간에 매핑\n\n**장점:**\n1. 파일 I/O 간편 (포인터 접근)\n2. 빠른 접근\n3. 프로세스 간 공유 용이\n\n**시스템 콜:** mmap()\n\n**용도:** 대용량 파일, IPC",
        "type": "essay",
        "tags": ["OS", "Memory"]
    },
    {
        "question": "Swap Space의 개념과 관리는?",
        "answer": "**개념:** 물리 메모리 부족시 디스크 사용\n\n**관리:**\n- Swappiness - 스왑 빈도 설정\n- Swap In/Out\n\n**문제:** 매우 느림\n\n**대안:** 메모리 증설, 압축",
        "type": "essay",
        "tags": ["OS", "Swap"]
    },
    {
        "question": "OOM Killer의 역할과 동작은?",
        "answer": "**역할:** 메모리 부족시 프로세스 강제 종료\n\n**점수 기준:**\n- 메모리 사용량\n- 실행 시간\n- nice 값\n- root 프로세스 보호\n\n**Linux:** /proc/<pid>/oom_score",
        "type": "essay",
        "tags": ["OS", "Memory"]
    },
    {
        "question": "파일 디스크립터(File Descriptor)란?",
        "answer": "**개념:** 열린 파일을 가리키는 정수\n\n**기본:**\n- 0: stdin\n- 1: stdout\n- 2: stderr\n\n**관리:** 프로세스별 FD 테이블\n\n**제한:** ulimit -n",
        "type": "essay",
        "tags": ["OS", "FileDescriptor"]
    },
    {
        "question": "Select, Poll, Epoll의 차이는?",
        "answer": "**Select:**\n- FD 개수 제한 (1024)\n- O(N) 스캔\n\n**Poll:**\n- FD 제한 없음\n- O(N) 스캔\n\n**Epoll (Linux):**\n- FD 제한 없음\n- O(1) - 이벤트만\n- Edge/Level Trigger\n\n**고성능:** Epoll, kqueue(BSD)",
        "type": "essay",
        "tags": ["OS", "IO"]
    },
    {
        "question": "동기 I/O와 비동기 I/O의 차이는?",
        "answer": "**동기 (Synchronous):**\n- I/O 완료까지 대기 (Blocking)\n- 또는 완료 여부 직접 확인 (Non-blocking)\n\n**비동기 (Asynchronous):**\n- I/O 요청 후 즉시 리턴\n- 완료시 콜백/시그널\n\n**예:** aio, io_uring",
        "type": "essay",
        "tags": ["OS", "IO"]
    },
    {
        "question": "Zero-Copy의 개념과 기법은?",
        "answer": "**개념:** 데이터 복사 최소화\n\n**기법:**\n- sendfile() - 커널 내부 전송\n- mmap() - 메모리 매핑\n- splice() - 파이프 활용\n\n**장점:** CPU 절약, 성능 향상\n\n**용도:** 파일 전송, 프록시",
        "type": "essay",
        "tags": ["OS", "IO"]
    },
    {
        "question": "Direct I/O의 개념과 용도는?",
        "answer": "**개념:** 페이지 캐시 우회, 직접 디스크 I/O\n\n**장점:**\n- 캐시 오염 방지\n- 예측 가능한 성능\n\n**단점:**\n- 느릴 수 있음\n- 정렬 요구사항\n\n**용도:** 데이터베이스",
        "type": "essay",
        "tags": ["OS", "IO"]
    },
    {
        "question": "fsync와 fdatasync의 차이는?",
        "answer": "**fsync:**\n- 데이터 + 메타데이터 동기화\n- 느림\n\n**fdatasync:**\n- 데이터만 동기화\n- 빠름\n\n**용도:** 내구성 보장\n\n**주의:** 성능 저하",
        "type": "essay",
        "tags": ["OS", "IO"]
    },
    {
        "question": "Page Cache와 Buffer Cache의 차이는?",
        "answer": "**Page Cache:**\n- 파일 I/O 캐싱\n- 페이지 단위\n\n**Buffer Cache:**\n- 블록 I/O 캐싱\n- 블록 단위\n\n**현대 Linux:** 통합 (Unified Buffer Cache)",
        "type": "essay",
        "tags": ["OS", "Cache"]
    },
    {
        "question": "COW 파일시스템의 예시와 장점은?",
        "answer": "**예시:** Btrfs, ZFS\n\n**특징:**\n- 쓰기시 새 위치에 기록\n- 원본 유지\n\n**장점:**\n1. 빠른 스냅샷\n2. 데이터 일관성\n3. 압축/중복 제거\n\n**단점:** 단편화",
        "type": "essay",
        "tags": ["OS", "FileSystem"]
    },
    {
        "question": "ext4의 주요 특징 4가지는?",
        "answer": "1. **저널링** - 빠른 복구\n2. **Extent** - 연속 블록 그룹화\n3. **지연 할당** - 성능 향상\n4. **대용량 지원** - 1EB\n\n**Linux 기본 파일시스템**",
        "type": "essay",
        "tags": ["OS", "FileSystem"]
    },
    {
        "question": "SSD와 HDD의 차이점과 최적화는?",
        "answer": "**SSD:**\n- 빠름, 비쌈\n- 쓰기 수명\n- Wear Leveling\n- TRIM 명령\n\n**HDD:**\n- 느림, 저렴\n- 기계식\n- 디스크 스케줄링\n\n**최적화:** SSD는 순차/랜덤 차이 적음",
        "type": "essay",
        "tags": ["OS", "Storage"]
    },
    {
        "question": "TRIM 명령의 역할은?",
        "answer": "**역할:** SSD에 삭제된 블록 알림\n\n**효과:**\n1. 가비지 컬렉션 효율 향상\n2. 쓰기 성능 유지\n3. 수명 연장\n\n**주의:** RAID에서는 주의 필요",
        "type": "essay",
        "tags": ["OS", "SSD"]
    },
    {
        "question": "링 버퍼(Ring Buffer)의 개념과 용도는?",
        "answer": "**개념:** 고정 크기 순환 버퍼\n\n**특징:**\n- FIFO\n- Head/Tail 포인터\n- 오버라이트 또는 차단\n\n**용도:**\n- 로그\n- 네트워크 패킷\n- 오디오/비디오",
        "type": "essay",
        "tags": ["OS", "DataStructure"]
    },
    {
        "question": "Futex의 개념과 장점은?",
        "answer": "**개념:** Fast Userspace Mutex\n\n**동작:**\n- 경쟁 없으면 유저 공간에서 처리\n- 경쟁시만 커널 호출\n\n**장점:** 빠른 락\n\n**사용:** pthread_mutex",
        "type": "essay",
        "tags": ["OS", "Lock"]
    },
    {
        "question": "RCU(Read-Copy-Update)의 개념은?",
        "answer": "**개념:** 읽기 최적화 동기화\n\n**동작:**\n1. 읽기 - 락 없음\n2. 쓰기 - 복사 → 수정 → 교체\n3. 이전 버전 대기 후 삭제\n\n**장점:** 빠른 읽기\n\n**용도:** Linux 커널",
        "type": "essay",
        "tags": ["OS", "RCU"]
    },
    {
        "question": "CPU Affinity의 개념과 용도는?",
        "answer": "**개념:** 프로세스/스레드를 특정 CPU에 고정\n\n**장점:**\n- 캐시 효율 향상\n- NUMA 최적화\n\n**설정:** taskset, sched_setaffinity()\n\n**주의:** 부하 불균형 가능",
        "type": "essay",
        "tags": ["OS", "Scheduling"]
    }
]

brief["cards"].extend(cards_61_90)

print(f"카드 61-90 추가 완료 (총 {len(brief['cards'])}개)")

# 저장
with open('public/data/dataset-brief/os/os.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"✅ OS 간략버전 저장 완료! (진행률: {len(brief['cards'])}/122)")
