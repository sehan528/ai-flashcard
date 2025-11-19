#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
os.json 간략버전 최종 완성 (카드 91-122)
"""

import json

# 기존 데이터 로드
with open('public/data/dataset-brief/os/os.json', 'r', encoding='utf-8') as f:
    brief = json.load(f)

print(f"현재 카드 수: {len(brief['cards'])}")

# 카드 91-122 추가 (최종 32개)
cards_91_122 = [
    {
        "question": "CFS(Completely Fair Scheduler)의 특징은?",
        "answer": "**개념:** Linux 기본 스케줄러\n\n**특징:**\n1. Red-Black Tree 사용\n2. vruntime (가상 실행 시간)\n3. 우선순위별 가중치\n4. O(log N)\n\n**목표:** 모든 프로세스에 공정한 CPU 시간",
        "type": "essay",
        "tags": ["OS", "Scheduling", "Linux"]
    },
    {
        "question": "nice 값과 우선순위의 관계는?",
        "answer": "**Nice 값:**\n- 범위: -20 (높은 우선순위) ~ 19 (낮은 우선순위)\n- 기본값: 0\n\n**우선순위:** Priority = 20 - nice\n\n**명령:** nice, renice\n\n**root만 음수 설정 가능**",
        "type": "essay",
        "tags": ["OS", "Priority"]
    },
    {
        "question": "프로세스 그룹과 세션의 개념은?",
        "answer": "**프로세스 그룹:**\n- 관련 프로세스 묶음\n- 파이프라인\n- 시그널 전파\n\n**세션:**\n- 여러 프로세스 그룹\n- 로그인 단위\n- 제어 터미널\n\n**명령:** setsid, setpgid",
        "type": "essay",
        "tags": ["OS", "Process"]
    },
    {
        "question": "시그널(Signal)의 종류와 처리는?",
        "answer": "**주요 시그널:**\n- SIGINT (2) - Ctrl+C\n- SIGKILL (9) - 강제 종료 (차단 불가)\n- SIGTERM (15) - 정상 종료\n- SIGSEGV (11) - Segmentation Fault\n- SIGCHLD - 자식 종료 알림\n\n**처리:** signal(), sigaction()",
        "type": "essay",
        "tags": ["OS", "Signal"]
    },
    {
        "question": "Daemon Process의 특징과 생성 방법은?",
        "answer": "**특징:**\n- 백그라운드 실행\n- 터미널 독립\n- init/systemd의 자식\n\n**생성:**\n1. fork() 후 부모 종료\n2. setsid() - 새 세션\n3. chdir(\"/\")\n4. umask(0)\n5. FD 닫기\n\n**예:** systemd, nginx",
        "type": "essay",
        "tags": ["OS", "Daemon"]
    },
    {
        "question": "ulimit의 역할과 주요 설정은?",
        "answer": "**역할:** 프로세스 자원 제한\n\n**주요 설정:**\n- -n: 파일 디스크립터 수\n- -u: 프로세스 수\n- -m: 메모리 크기\n- -s: 스택 크기\n- -c: 코어 덤프 크기\n\n**/etc/security/limits.conf**",
        "type": "essay",
        "tags": ["OS", "Limit"]
    },
    {
        "question": "Core Dump의 개념과 활용은?",
        "answer": "**개념:** 프로그램 비정상 종료시 메모리 덤프\n\n**활용:**\n- 디버깅\n- gdb로 분석\n\n**설정:**\n- ulimit -c unlimited\n- /proc/sys/kernel/core_pattern\n\n**주의:** 디스크 공간",
        "type": "essay",
        "tags": ["OS", "Debug"]
    },
    {
        "question": "strace의 역할과 사용법은?",
        "answer": "**역할:** 시스템 콜 추적\n\n**사용:**\n- strace ls\n- strace -p <pid>\n- strace -e open,read\n\n**활용:**\n- 디버깅\n- 성능 분석\n- 파일 접근 추적",
        "type": "essay",
        "tags": ["OS", "Debug"]
    },
    {
        "question": "perf의 기능과 활용은?",
        "answer": "**기능:** Linux 성능 분석 도구\n\n**명령:**\n- perf top - CPU 사용률\n- perf record/report - 프로파일링\n- perf stat - 통계\n\n**분석:** CPU, 캐시, 브랜치 예측 등",
        "type": "essay",
        "tags": ["OS", "Performance"]
    },
    {
        "question": "/proc 파일시스템의 역할과 주요 항목은?",
        "answer": "**역할:** 커널 정보를 파일로 제공\n\n**주요:**\n- /proc/cpuinfo - CPU 정보\n- /proc/meminfo - 메모리 정보\n- /proc/<pid>/ - 프로세스 정보\n- /proc/sys/ - 커널 파라미터\n\n**가상 파일시스템**",
        "type": "essay",
        "tags": ["OS", "Linux"]
    },
    {
        "question": "sysctl의 역할과 예시는?",
        "answer": "**역할:** 커널 파라미터 조회/수정\n\n**예시:**\n- vm.swappiness - 스왑 빈도\n- net.ipv4.ip_forward - IP 포워딩\n- kernel.pid_max - 최대 PID\n\n**영구 설정:** /etc/sysctl.conf",
        "type": "essay",
        "tags": ["OS", "Kernel"]
    },
    {
        "question": "tmpfs의 특징과 용도는?",
        "answer": "**특징:**\n- RAM 기반 파일시스템\n- 휘발성\n- 빠름\n\n**용도:**\n- /tmp\n- /dev/shm\n- 임시 빌드\n\n**주의:** 메모리 부족 주의",
        "type": "essay",
        "tags": ["OS", "FileSystem"]
    },
    {
        "question": "cgroups의 개념과 제어 자원은?",
        "answer": "**개념:** Control Groups, 자원 격리 및 제한\n\n**제어:**\n- CPU\n- 메모리\n- 디스크 I/O\n- 네트워크\n\n**활용:** Docker, systemd\n\n**계층 구조**",
        "type": "essay",
        "tags": ["OS", "cgroups"]
    },
    {
        "question": "namespace의 종류 6가지는?",
        "answer": "1. **PID** - 프로세스 격리\n2. **NET** - 네트워크 격리\n3. **MNT** - 파일시스템 격리\n4. **UTS** - 호스트명 격리\n5. **IPC** - IPC 격리\n6. **USER** - 사용자 격리\n\n**활용:** 컨테이너",
        "type": "essay",
        "tags": ["OS", "Namespace"]
    },
    {
        "question": "chroot의 개념과 한계는?",
        "answer": "**개념:** 루트 디렉토리 변경\n\n**용도:**\n- 격리 환경\n- 테스트\n\n**한계:**\n- root 권한으로 탈출 가능\n- 프로세스/네트워크 격리 안됨\n\n**대안:** namespace, container",
        "type": "essay",
        "tags": ["OS", "Security"]
    },
    {
        "question": "SELinux와 AppArmor의 차이는?",
        "answer": "**SELinux:**\n- 레이블 기반\n- 복잡, 강력\n- RedHat 계열\n\n**AppArmor:**\n- 경로 기반\n- 간단\n- Debian/Ubuntu\n\n**공통:** MAC (Mandatory Access Control)",
        "type": "essay",
        "tags": ["OS", "Security"]
    },
    {
        "question": "ASLR의 개념과 효과는?",
        "answer": "**개념:** Address Space Layout Randomization, 메모리 주소 무작위화\n\n**효과:**\n- 버퍼 오버플로우 공격 방어\n- ROP 공격 어렵게\n\n**무작위화:** Stack, Heap, Library\n\n**설정:** /proc/sys/kernel/randomize_va_space",
        "type": "essay",
        "tags": ["OS", "Security"]
    },
    {
        "question": "DEP/NX의 개념은?",
        "answer": "**개념:** Data Execution Prevention / No-eXecute\n\n**기능:** 데이터 영역 실행 금지\n\n**효과:** 쉘코드 실행 방지\n\n**우회:** ROP (Return-Oriented Programming)\n\n**하드웨어 지원 필요**",
        "type": "essay",
        "tags": ["OS", "Security"]
    },
    {
        "question": "KASLR의 개념은?",
        "answer": "**개념:** Kernel ASLR, 커널 주소 무작위화\n\n**효과:** 커널 공격 방어\n\n**주의:** 성능 영향\n\n**Linux:** 기본 활성화",
        "type": "essay",
        "tags": ["OS", "Security"]
    },
    {
        "question": "Meltdown과 Spectre의 개념은?",
        "answer": "**Meltdown:**\n- CPU 취약점\n- 커널 메모리 읽기\n- KPTI로 완화\n\n**Spectre:**\n- 분기 예측 악용\n- 프로세스 간 정보 유출\n- 완화 어려움\n\n**성능 저하 발생**",
        "type": "essay",
        "tags": ["OS", "Security"]
    },
    {
        "question": "eBPF의 개념과 용도는?",
        "answer": "**개념:** Extended Berkeley Packet Filter, 커널 내 샌드박스 VM\n\n**용도:**\n- 네트워크 필터링\n- 성능 모니터링\n- 보안\n- 트레이싱\n\n**장점:** 커널 수정 없이 확장\n\n**도구:** bpftrace, bcc",
        "type": "essay",
        "tags": ["OS", "eBPF"]
    },
    {
        "question": "io_uring의 개념과 장점은?",
        "answer": "**개념:** Linux 비동기 I/O 인터페이스\n\n**특징:**\n- Ring Buffer 기반\n- 시스템 콜 최소화\n- 고성능\n\n**vs AIO:** 더 빠르고 범용적\n\n**용도:** 고성능 서버",
        "type": "essay",
        "tags": ["OS", "IO"]
    },
    {
        "question": "CPU 캐시 일관성 프로토콜은?",
        "answer": "**MESI 프로토콜:**\n- **Modified** - 수정됨\n- **Exclusive** - 독점\n- **Shared** - 공유\n- **Invalid** - 무효\n\n**목적:** 멀티코어 캐시 동기화\n\n**False Sharing 문제**",
        "type": "essay",
        "tags": ["OS", "Cache"]
    },
    {
        "question": "False Sharing의 개념과 해결책은?",
        "answer": "**개념:** 다른 변수지만 같은 캐시 라인에 위치\n\n**문제:** 한 코어 수정시 다른 코어 캐시 무효화\n\n**해결:**\n- 패딩 추가\n- alignas\n- 변수 분리\n\n**캐시 라인:** 보통 64 bytes",
        "type": "essay",
        "tags": ["OS", "Cache"]
    },
    {
        "question": "메모리 배리어(Memory Barrier)의 역할은?",
        "answer": "**역할:** 메모리 접근 순서 보장\n\n**필요성:**\n- CPU 재배치 방지\n- 컴파일러 최적화 제어\n\n**종류:**\n- Load Barrier\n- Store Barrier\n- Full Barrier\n\n**동기화에 필수**",
        "type": "essay",
        "tags": ["OS", "Memory"]
    },
    {
        "question": "Atomic Operation의 종류와 구현은?",
        "answer": "**종류:**\n- Atomic Load/Store\n- Compare-and-Swap (CAS)\n- Fetch-and-Add\n- Test-and-Set\n\n**구현:**\n- 하드웨어 지원 (lock prefix)\n- C11 stdatomic.h\n- C++ std::atomic\n\n**Lock-Free 자료구조**",
        "type": "essay",
        "tags": ["OS", "Atomic"]
    },
    {
        "question": "Lock-Free와 Wait-Free의 차이는?",
        "answer": "**Lock-Free:**\n- 시스템 전체 진행 보장\n- 개별 스레드 Starvation 가능\n- CAS 사용\n\n**Wait-Free:**\n- 모든 스레드 진행 보장\n- 유한 시간 내 완료\n- 구현 어려움\n\n**Lock-Free ⊂ Wait-Free**",
        "type": "essay",
        "tags": ["OS", "LockFree"]
    },
    {
        "question": "ABA Problem의 개념과 해결책은?",
        "answer": "**문제:** CAS에서 A→B→A 변경을 감지 못함\n\n**예:**\n1. 스레드1: A 읽음\n2. 스레드2: A→B→A\n3. 스레드1: CAS 성공 (잘못된 판단)\n\n**해결:**\n- 버전 태그\n- Double-CAS\n- Hazard Pointer",
        "type": "essay",
        "tags": ["OS", "LockFree"]
    },
    {
        "question": "CPU 파이프라인의 단계 5가지는?",
        "answer": "1. **IF (Instruction Fetch)** - 명령어 가져오기\n2. **ID (Instruction Decode)** - 명령어 해석\n3. **EX (Execute)** - 실행\n4. **MEM (Memory)** - 메모리 접근\n5. **WB (Write Back)** - 결과 저장\n\n**Pipeline Hazard:** Data, Control, Structural",
        "type": "essay",
        "tags": ["OS", "CPU"]
    },
    {
        "question": "Branch Prediction의 개념과 영향은?",
        "answer": "**개념:** 조건 분기 결과 예측\n\n**영향:**\n- 예측 성공: 파이프라인 계속\n- 예측 실패: 파이프라인 플러시 (성능 저하)\n\n**최적화:** 예측 가능한 코드 작성\n\n**Misprediction 비용: 10-20 사이클**",
        "type": "essay",
        "tags": ["OS", "CPU"]
    },
    {
        "question": "SIMD의 개념과 예시는?",
        "answer": "**개념:** Single Instruction Multiple Data, 데이터 병렬성\n\n**예시:**\n- SSE (Streaming SIMD Extensions)\n- AVX (Advanced Vector Extensions)\n- NEON (ARM)\n\n**용도:** 멀티미디어, 과학 계산\n\n**벡터 연산**",
        "type": "essay",
        "tags": ["OS", "CPU"]
    },
    {
        "question": "Little Endian과 Big Endian의 차이는?",
        "answer": "**0x12345678 저장 예:**\n\n**Little Endian:**\n- 낮은 주소에 낮은 바이트\n- 78 56 34 12\n- x86\n\n**Big Endian:**\n- 낮은 주소에 높은 바이트\n- 12 34 56 78\n- 네트워크 바이트 순서\n\n**변환:** htonl, ntohl",
        "type": "essay",
        "tags": ["OS", "Endian"]
    }
]

brief["cards"].extend(cards_91_122)

print(f"카드 91-122 추가 완료 (총 {len(brief['cards'])}개)")

# 저장
with open('public/data/dataset-brief/os/os.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"\n🎉 OS 간략버전 100% 완성! 총 {len(brief['cards'])}개 카드")
print(f"✅ 파일 저장: public/data/dataset-brief/os/os.json")
