#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
os.json 간략버전 계속 추가 (카드 31-60)
"""

import json

# 기존 데이터 로드
with open('public/data/dataset-brief/os/os.json', 'r', encoding='utf-8') as f:
    brief = json.load(f)

print(f"현재 카드 수: {len(brief['cards'])}")

# 카드 31-60 추가
cards_31_60 = [
    {
        "question": "세그멘테이션(Segmentation)의 개념과 특징은?",
        "answer": "**개념:** 논리적 단위로 메모리 분할 (코드, 데이터, 스택 등)\n\n**특징:**\n- 가변 크기\n- 의미 있는 단위\n- 외부 단편화 발생\n\n**보호:** 세그먼트별 권한 설정 용이",
        "type": "essay",
        "tags": ["OS", "Segmentation"]
    },
    {
        "question": "캐시 메모리의 매핑 방식 3가지는?",
        "answer": "1. **Direct Mapping** - 고정 위치, 빠름, 충돌 많음\n2. **Fully Associative** - 어디든 가능, 느림, 충돌 적음\n3. **Set Associative** - 세트 내 자유, 절충안\n\n**교체:** LRU, Random",
        "type": "essay",
        "tags": ["OS", "Cache"]
    },
    {
        "question": "캐시 쓰기 정책 2가지는?",
        "answer": "**Write-Through:**\n- 캐시 + 메모리 동시 쓰기\n- 일관성 보장\n- 느림\n\n**Write-Back:**\n- 캐시만 쓰기\n- 교체시 메모리 갱신 (Dirty bit)\n- 빠름",
        "type": "essay",
        "tags": ["OS", "Cache"]
    },
    {
        "question": "파일 시스템의 역할 4가지는?",
        "answer": "1. **파일 관리** - 생성/삭제/수정\n2. **디렉토리 관리** - 계층 구조\n3. **저장 공간 관리** - 블록 할당\n4. **보안** - 접근 제어",
        "type": "essay",
        "tags": ["OS", "FileSystem"]
    },
    {
        "question": "파일 할당 방법 3가지는?",
        "answer": "1. **연속 할당** - 순차 블록, 빠름, 외부 단편화\n2. **연결 할당** - 포인터 연결, 느림, 순차 접근만\n3. **인덱스 할당** - 인덱스 블록, 직접 접근, FAT, inode",
        "type": "essay",
        "tags": ["OS", "FileSystem"]
    },
    {
        "question": "inode의 개념과 포함 정보는?",
        "answer": "**개념:** Unix/Linux 파일 메타데이터\n\n**포함:**\n- 파일 크기\n- 권한\n- 소유자\n- 타임스탬프\n- 데이터 블록 포인터 (직접/간접)\n\n**파일명은 디렉토리 엔트리에**",
        "type": "essay",
        "tags": ["OS", "FileSystem"]
    },
    {
        "question": "Hard Link와 Symbolic Link의 차이는?",
        "answer": "**Hard Link:**\n- 같은 inode 공유\n- 원본 삭제해도 유지\n- 디렉토리 불가\n- 같은 파일시스템만\n\n**Symbolic (Soft) Link:**\n- 경로 저장\n- 원본 삭제시 깨짐\n- 디렉토리 가능\n- 다른 파일시스템 가능",
        "type": "essay",
        "tags": ["OS", "FileSystem"]
    },
    {
        "question": "디스크 스케줄링 알고리즘 5가지는?",
        "answer": "1. **FCFS** - 순서대로\n2. **SSTF** - 가장 가까운 것 (Shortest Seek Time)\n3. **SCAN** - 엘리베이터, 한 방향\n4. **C-SCAN** - 한 방향만, 처음으로 복귀\n5. **LOOK** - 요청 있는 곳까지만",
        "type": "essay",
        "tags": ["OS", "DiskScheduling"]
    },
    {
        "question": "저널링 파일 시스템의 개념과 장점은?",
        "answer": "**개념:** 변경사항을 먼저 로그(저널)에 기록\n\n**장점:**\n1. 빠른 복구\n2. 일관성 보장\n3. fsck 시간 단축\n\n**예:** ext3/4, NTFS, XFS",
        "type": "essay",
        "tags": ["OS", "FileSystem"]
    },
    {
        "question": "RAID의 레벨별 특징은?",
        "answer": "**RAID 0:** 스트라이핑, 성능 향상, 안전성 X\n**RAID 1:** 미러링, 안전성, 용량 50%\n**RAID 5:** 패리티 분산, 균형\n**RAID 6:** 이중 패리티, 2개 실패 허용\n**RAID 10:** 0+1, 성능+안전성",
        "type": "essay",
        "tags": ["OS", "RAID"]
    },
    {
        "question": "버퍼링과 캐싱의 차이는?",
        "answer": "**버퍼링:**\n- 속도 차이 조정\n- 임시 저장\n- 한 번 사용\n\n**캐싱:**\n- 빠른 재접근\n- 자주 사용 데이터\n- 반복 사용",
        "type": "essay",
        "tags": ["OS", "Buffer", "Cache"]
    },
    {
        "question": "스풀링(Spooling)의 개념과 예시는?",
        "answer": "**개념:** 느린 I/O 장치를 위한 버퍼링\n\n**동작:**\n1. 작업을 디스크 큐에 저장\n2. 장치 준비되면 순차 처리\n\n**예:** 프린터 스풀\n\n**장점:** CPU 효율 향상",
        "type": "essay",
        "tags": ["OS", "Spooling"]
    },
    {
        "question": "인터럽트(Interrupt)의 종류와 처리 과정은?",
        "answer": "**종류:**\n1. **하드웨어** - I/O 완료, 타이머\n2. **소프트웨어** - System Call, Exception\n\n**처리:**\n1. 현재 상태 저장\n2. ISR (Interrupt Service Routine) 실행\n3. 상태 복원",
        "type": "essay",
        "tags": ["OS", "Interrupt"]
    },
    {
        "question": "DMA(Direct Memory Access)의 개념과 장점은?",
        "answer": "**개념:** CPU 개입 없이 I/O와 메모리 간 직접 전송\n\n**장점:**\n1. CPU 부담 감소\n2. 빠른 데이터 전송\n3. 효율적 I/O\n\n**완료시 인터럽트 발생**",
        "type": "essay",
        "tags": ["OS", "DMA"]
    },
    {
        "question": "폴링(Polling)과 인터럽트의 차이는?",
        "answer": "**Polling:**\n- CPU가 주기적으로 확인\n- 단순\n- CPU 낭비\n\n**Interrupt:**\n- 장치가 CPU에 알림\n- 효율적\n- 복잡\n\n**용도:** Polling은 빠른 응답 필요시",
        "type": "essay",
        "tags": ["OS", "IO"]
    },
    {
        "question": "System Call의 개념과 예시는?",
        "answer": "**개념:** 사용자 프로그램이 커널 기능 요청\n\n**예시:**\n- 파일: open, read, write\n- 프로세스: fork, exec, wait\n- 메모리: malloc, free\n- 통신: socket, send, recv\n\n**모드:** User → Kernel 전환",
        "type": "essay",
        "tags": ["OS", "SystemCall"]
    },
    {
        "question": "User Mode와 Kernel Mode의 차이는?",
        "answer": "**User Mode:**\n- 제한된 권한\n- 애플리케이션 실행\n- 하드웨어 직접 접근 불가\n\n**Kernel Mode:**\n- 모든 권한\n- OS 코어 실행\n- 하드웨어 제어 가능\n\n**전환:** System Call, Interrupt",
        "type": "essay",
        "tags": ["OS", "Mode"]
    },
    {
        "question": "IPC(Inter-Process Communication) 방법 6가지는?",
        "answer": "1. **Pipe** - 단방향, 부모-자식\n2. **Named Pipe (FIFO)** - 무관 프로세스\n3. **Message Queue** - 메시지 단위\n4. **Shared Memory** - 가장 빠름\n5. **Socket** - 네트워크 가능\n6. **Signal** - 간단한 알림",
        "type": "essay",
        "tags": ["OS", "IPC"]
    },
    {
        "question": "Shared Memory의 장단점은?",
        "answer": "**장점:**\n- 가장 빠른 IPC\n- 커널 개입 최소\n\n**단점:**\n- 동기화 필요 (직접 구현)\n- Race Condition 위험\n\n**용도:** 대량 데이터 공유",
        "type": "essay",
        "tags": ["OS", "IPC"]
    },
    {
        "question": "fork()의 동작과 특징은?",
        "answer": "**동작:**\n1. 자식 프로세스 생성\n2. 부모 메모리 복사 (COW)\n3. 부모는 자식 PID 반환, 자식은 0 반환\n\n**COW (Copy-on-Write):**\n- 실제 쓰기 전까지 공유\n- 메모리 효율",
        "type": "essay",
        "tags": ["OS", "Process"]
    },
    {
        "question": "exec() 계열 함수의 역할은?",
        "answer": "**역할:** 현재 프로세스를 새 프로그램으로 대체\n\n**종류:**\n- execl, execv, execvp 등\n\n**특징:**\n- PID 유지\n- 메모리 이미지 교체\n- 성공시 리턴 안함\n\n**조합:** fork + exec",
        "type": "essay",
        "tags": ["OS", "Process"]
    },
    {
        "question": "좀비 프로세스와 고아 프로세스의 차이는?",
        "answer": "**좀비 (Zombie):**\n- 종료했지만 부모가 wait() 안함\n- PCB만 남음\n- 자원은 해제됨\n\n**고아 (Orphan):**\n- 부모가 먼저 종료\n- init/systemd가 입양\n- 정상 동작",
        "type": "essay",
        "tags": ["OS", "Process"]
    },
    {
        "question": "메모리 누수(Memory Leak)의 원인과 탐지 방법은?",
        "answer": "**원인:**\n- malloc 후 free 안함\n- 포인터 분실\n- 순환 참조\n\n**탐지:**\n- Valgrind (Linux)\n- Instruments (macOS)\n- AddressSanitizer\n\n**예방:** RAII, 스마트 포인터",
        "type": "essay",
        "tags": ["OS", "Memory"]
    },
    {
        "question": "멀티스레딩의 모델 3가지는?",
        "answer": "1. **Many-to-One** - 여러 유저 스레드 → 1 커널 스레드\n2. **One-to-One** - 유저:커널 = 1:1 (Linux)\n3. **Many-to-Many** - M:N 매핑\n\n**Linux:** NPTL (One-to-One)",
        "type": "essay",
        "tags": ["OS", "Thread"]
    },
    {
        "question": "Thread-Safe의 개념과 구현 방법은?",
        "answer": "**개념:** 여러 스레드가 동시 실행해도 안전\n\n**방법:**\n1. Mutex/Lock 사용\n2. Atomic 연산\n3. Thread-Local Storage\n4. Immutable 데이터\n5. Re-entrant 함수",
        "type": "essay",
        "tags": ["OS", "Thread"]
    },
    {
        "question": "Re-entrant Function의 조건은?",
        "answer": "**조건:**\n1. 전역/정적 변수 사용 안함\n2. 동적 메모리 할당 안함\n3. 자기 자신 호출 가능\n4. 지역 변수만 사용\n\n**Thread-Safe의 부분 집합**",
        "type": "essay",
        "tags": ["OS", "Thread"]
    },
    {
        "question": "실시간 시스템(Real-Time System)의 종류는?",
        "answer": "**Hard Real-Time:**\n- 데드라인 엄수 필수\n- 의료, 항공, 군사\n\n**Soft Real-Time:**\n- 데드라인 놓쳐도 치명적 아님\n- 멀티미디어, 게임\n\n**스케줄링:** EDF, RM",
        "type": "essay",
        "tags": ["OS", "RealTime"]
    },
    {
        "question": "마이크로커널과 모놀리식 커널의 차이는?",
        "answer": "**Microkernel:**\n- 최소 기능만 (IPC, 스케줄링)\n- 나머지는 유저 공간 (드라이버 등)\n- 안정성, 확장성\n- 느림\n\n**Monolithic:**\n- 모든 기능 커널에\n- 빠름\n- 거대함\n\n**예:** Linux(모놀리식), Minix(마이크로)",
        "type": "essay",
        "tags": ["OS", "Kernel"]
    },
    {
        "question": "부팅 과정(Boot Process)의 단계는?",
        "answer": "1. **BIOS/UEFI** - 하드웨어 초기화, POST\n2. **부트로더** - GRUB, OS 로드\n3. **커널 로드** - 메모리에 적재\n4. **Init/Systemd** - 시스템 초기화\n5. **로그인**",
        "type": "essay",
        "tags": ["OS", "Boot"]
    },
    {
        "question": "가상화(Virtualization)의 종류 2가지는?",
        "answer": "**전가상화 (Full):**\n- 게스트 OS 수정 불필요\n- 하이퍼바이저가 모든 명령 처리\n- 느림\n- VMware, VirtualBox\n\n**반가상화 (Para):**\n- 게스트 OS 수정 필요\n- Hypercall 사용\n- 빠름\n- Xen",
        "type": "essay",
        "tags": ["OS", "Virtualization"]
    }
]

brief["cards"].extend(cards_31_60)

print(f"카드 31-60 추가 완료 (총 {len(brief['cards'])}개)")

# 저장
with open('public/data/dataset-brief/os/os.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"✅ OS 간략버전 저장 완료! (진행률: {len(brief['cards'])}/122)")
