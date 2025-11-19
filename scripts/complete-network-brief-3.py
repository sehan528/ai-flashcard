#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
network.json 간략버전 계속 추가 (카드 46-70)
"""

import json

# 기존 데이터 로드
with open('public/data/dataset-brief/network/network.json', 'r', encoding='utf-8') as f:
    brief = json.load(f)

print(f"현재 카드 수: {len(brief['cards'])}")

# 카드 46-70 추가
cards_46_70 = [
    {
        "question": "FTP의 동작 모드 2가지는?",
        "answer": "1. **Active Mode** - 서버가 클라이언트에 데이터 연결\n2. **Passive Mode** - 클라이언트가 서버에 데이터 연결\n\n방화벽 환경에서는 Passive 선호",
        "type": "essay",
        "tags": ["Network", "FTP"]
    },
    {
        "question": "SMTP, POP3, IMAP의 차이는?",
        "answer": "**SMTP (25):**\n- 메일 전송\n\n**POP3 (110):**\n- 메일 다운로드 후 서버 삭제\n\n**IMAP (143):**\n- 서버에 메일 유지, 동기화",
        "type": "essay",
        "tags": ["Network", "Email"]
    },
    {
        "question": "Telnet과 SSH의 차이는?",
        "answer": "**Telnet (23):**\n- 평문 전송\n- 보안 취약\n\n**SSH (22):**\n- 암호화 전송\n- 안전한 원격 접속",
        "type": "essay",
        "tags": ["Network", "SSH"]
    },
    {
        "question": "네트워크 장비의 계층별 분류는?",
        "answer": "- **L1 (물리)** - 리피터, 허브\n- **L2 (데이터링크)** - 스위치, 브리지\n- **L3 (네트워크)** - 라우터, L3 스위치\n- **L4 (전송)** - L4 스위치, 로드밸런서\n- **L7 (응용)** - 방화벽, 프록시",
        "type": "essay",
        "tags": ["Network"]
    },
    {
        "question": "TCP Nagle 알고리즘의 목적은?",
        "answer": "**목적:** 작은 패킷 전송 최소화\n\n**동작:**\n- ACK 받기 전까지 작은 데이터 버퍼링\n- 모아서 한번에 전송\n- 네트워크 효율성 향상",
        "type": "essay",
        "tags": ["Network", "TCP"]
    },
    {
        "question": "Delayed ACK의 개념은?",
        "answer": "**개념:** ACK 전송을 지연시켜 효율성 향상\n\n**특징:**\n- 200ms까지 지연\n- 여러 세그먼트를 하나의 ACK로\n- 데이터와 함께 piggyback 가능",
        "type": "essay",
        "tags": ["Network", "TCP"]
    },
    {
        "question": "SYN Flood 공격의 원리와 대응은?",
        "answer": "**원리:**\n- 대량 SYN 전송\n- ACK 응답 안함\n- Half-open 연결 누적\n\n**대응:**\n- SYN Cookie\n- 연결 타임아웃 단축\n- 방화벽 필터링",
        "type": "essay",
        "tags": ["Network", "Security"]
    },
    {
        "question": "TIME_WAIT 상태의 목적과 시간은?",
        "answer": "**목적:**\n1. 마지막 ACK 재전송 대기\n2. 지연 패킷 처리\n\n**시간:** 2MSL (보통 60초-4분)",
        "type": "essay",
        "tags": ["Network", "TCP"]
    },
    {
        "question": "UDP의 특징과 사용 사례는?",
        "answer": "**특징:**\n- 비연결형, 비신뢰적\n- 순서 보장 안함\n- 빠른 전송\n\n**사용:**\n- DNS, DHCP\n- 스트리밍, 게임\n- VoIP",
        "type": "essay",
        "tags": ["Network", "UDP"]
    },
    {
        "question": "Jumbo Frame의 개념과 장단점은?",
        "answer": "**개념:** MTU > 1500 bytes (보통 9000)\n\n**장점:**\n- CPU 오버헤드 감소\n- 처리량 증가\n\n**단점:**\n- 전체 경로 지원 필요\n- 패킷 손실시 재전송 비용 증가",
        "type": "essay",
        "tags": ["Network", "MTU"]
    },
    {
        "question": "ARP Spoofing 공격의 원리와 대응은?",
        "answer": "**원리:**\n- 위조된 ARP Reply 전송\n- MAC-IP 매핑 변조\n- MITM 공격 가능\n\n**대응:**\n- Static ARP 테이블\n- DAI (Dynamic ARP Inspection)\n- 암호화 통신",
        "type": "essay",
        "tags": ["Network", "Security"]
    },
    {
        "question": "Spanning Tree Protocol의 목적은?",
        "answer": "**목적:** 스위치 네트워크의 루프 방지\n\n**동작:**\n1. Root Bridge 선출\n2. 최단 경로 계산\n3. 중복 경로 차단\n4. 장애시 우회 경로 활성화",
        "type": "essay",
        "tags": ["Network", "STP"]
    },
    {
        "question": "Link Aggregation의 개념과 장점은?",
        "answer": "**개념:** 여러 물리 링크를 논리적으로 묶음\n\n**장점:**\n1. 대역폭 증가\n2. 이중화 (장애 대응)\n3. 로드 밸런싱",
        "type": "essay",
        "tags": ["Network"]
    },
    {
        "question": "Port Mirroring의 용도는?",
        "answer": "**용도:**\n- 트래픽 모니터링\n- 네트워크 분석\n- IDS/IPS 연동\n\n**방식:**\n- SPAN (로컬)\n- RSPAN (원격)",
        "type": "essay",
        "tags": ["Network", "Monitoring"]
    },
    {
        "question": "Anycast의 개념과 용도는?",
        "answer": "**개념:** 동일 IP를 여러 서버가 공유, 가장 가까운 서버 응답\n\n**용도:**\n- DNS 루트 서버\n- CDN\n- DDoS 방어",
        "type": "essay",
        "tags": ["Network", "Anycast"]
    },
    {
        "question": "BGP의 특징과 경로 선택 기준은?",
        "answer": "**특징:**\n- AS 간 라우팅\n- 경로 벡터 프로토콜\n- TCP 기반 (포트 179)\n\n**선택 기준:**\n1. Weight\n2. Local Preference\n3. AS Path 길이\n4. MED",
        "type": "essay",
        "tags": ["Network", "BGP"]
    },
    {
        "question": "OSPF의 특징과 장점은?",
        "answer": "**특징:**\n- 링크 상태 프로토콜\n- 최단 경로 (Dijkstra)\n- Area 개념\n\n**장점:**\n- 빠른 수렴\n- VLSM 지원\n- 확장성",
        "type": "essay",
        "tags": ["Network", "OSPF"]
    },
    {
        "question": "Static Routing과 Dynamic Routing의 비교는?",
        "answer": "**Static:**\n- 수동 설정\n- 변경 불가\n- 작은 네트워크 적합\n\n**Dynamic:**\n- 자동 학습\n- 경로 변경 대응\n- 큰 네트워크 적합",
        "type": "essay",
        "tags": ["Network", "Routing"]
    },
    {
        "question": "Distance Vector와 Link State의 차이는?",
        "answer": "**Distance Vector (RIP):**\n- 거리와 방향 정보\n- 주기적 업데이트\n- 느린 수렴\n\n**Link State (OSPF):**\n- 전체 토폴로지 파악\n- 변경시만 업데이트\n- 빠른 수렴",
        "type": "essay",
        "tags": ["Network", "Routing"]
    },
    {
        "question": "Count to Infinity 문제와 해결책은?",
        "answer": "**문제:** Distance Vector에서 라우팅 루프 발생\n\n**해결:**\n1. **Split Horizon** - 받은 인터페이스로 역전송 금지\n2. **Poison Reverse** - 무한대 메트릭 전송\n3. **Hold Down Timer** - 일정 시간 업데이트 거부",
        "type": "essay",
        "tags": ["Network", "Routing"]
    },
    {
        "question": "MPLS의 개념과 장점은?",
        "answer": "**개념:** 레이블 기반 고속 라우팅\n\n**장점:**\n1. 빠른 포워딩\n2. TE (Traffic Engineering)\n3. VPN 구성 용이\n4. QoS 지원",
        "type": "essay",
        "tags": ["Network", "MPLS"]
    },
    {
        "question": "SDN의 개념과 특징은?",
        "answer": "**개념:** Software Defined Networking, 제어와 데이터 평면 분리\n\n**특징:**\n1. 중앙 집중 제어\n2. 프로그래밍 가능\n3. OpenFlow 프로토콜\n4. 네트워크 자동화",
        "type": "essay",
        "tags": ["Network", "SDN"]
    },
    {
        "question": "NFV의 개념과 장점은?",
        "answer": "**개념:** Network Functions Virtualization, 네트워크 기능 가상화\n\n**장점:**\n1. 하드웨어 독립성\n2. 빠른 배포\n3. 비용 절감\n4. 유연한 확장",
        "type": "essay",
        "tags": ["Network", "NFV"]
    },
    {
        "question": "Ingress와 Egress의 의미는?",
        "answer": "**Ingress:**\n- 네트워크/시스템으로 들어오는 트래픽\n- 인바운드\n\n**Egress:**\n- 네트워크/시스템에서 나가는 트래픽\n- 아웃바운드",
        "type": "essay",
        "tags": ["Network"]
    },
    {
        "question": "네트워크 모니터링 도구와 용도는?",
        "answer": "1. **Wireshark** - 패킷 캡처/분석\n2. **tcpdump** - 커맨드라인 패킷 캡처\n3. **SNMP** - 장비 모니터링\n4. **NetFlow** - 트래픽 분석\n5. **Nagios** - 네트워크 감시",
        "type": "essay",
        "tags": ["Network", "Monitoring"]
    }
]

brief["cards"].extend(cards_46_70)

print(f"카드 46-70 추가 완료 (총 {len(brief['cards'])}개)")

# 저장
with open('public/data/dataset-brief/network/network.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"✅ 네트워크 간략버전 저장 완료! (진행률: {len(brief['cards'])}/104)")
