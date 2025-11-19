#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
network.json 간략버전 계속 추가 (카드 21-45)
"""

import json

# 기존 데이터 로드
with open('public/data/dataset-brief/network/network.json', 'r', encoding='utf-8') as f:
    brief = json.load(f)

print(f"현재 카드 수: {len(brief['cards'])}")

# 카드 21-45 추가
cards_21_45 = [
    {
        "question": "VPN의 종류 3가지와 특징은?",
        "answer": "1. **Site-to-Site VPN** - 네트워크 간 연결\n2. **Remote Access VPN** - 개인 사용자 접속\n3. **SSL VPN** - 웹 브라우저 기반",
        "type": "essay",
        "tags": ["Network", "VPN"]
    },
    {
        "question": "방화벽의 종류 3가지는?",
        "answer": "1. **Packet Filtering** - IP/포트 기반 필터링\n2. **Stateful Inspection** - 연결 상태 추적\n3. **Application Level** - 애플리케이션 계층 검사",
        "type": "essay",
        "tags": ["Network", "Security"]
    },
    {
        "question": "DDoS 공격의 유형 3가지는?",
        "answer": "1. **Volume-based** - 대역폭 소진 (UDP Flood)\n2. **Protocol** - 프로토콜 취약점 (SYN Flood)\n3. **Application** - 애플리케이션 레벨 (HTTP Flood)",
        "type": "essay",
        "tags": ["Network", "Security"]
    },
    {
        "question": "MAC 주소의 특징과 구조는?",
        "answer": "**특징:** 48비트 물리적 주소, NIC 고유 식별\n\n**구조:**\n- 앞 24비트: OUI (제조사)\n- 뒤 24비트: 일련번호\n- 예: AA:BB:CC:DD:EE:FF",
        "type": "essay",
        "tags": ["Network", "MAC"]
    },
    {
        "question": "스위치와 라우터의 차이점 3가지는?",
        "answer": "1. **계층** - 스위치: L2 / 라우터: L3\n2. **주소** - 스위치: MAC / 라우터: IP\n3. **범위** - 스위치: LAN / 라우터: LAN+WAN",
        "type": "essay",
        "tags": ["Network", "Switch", "Router"]
    },
    {
        "question": "HTTP/3의 주요 특징 4가지는?",
        "answer": "1. **QUIC 프로토콜** - UDP 기반\n2. **0-RTT** - 연결 재개시 지연 없음\n3. **패킷 손실 개선** - 개별 스트림 영향 최소화\n4. **연결 마이그레이션** - IP 변경시에도 유지",
        "type": "essay",
        "tags": ["Network", "HTTP"]
    },
    {
        "question": "네트워크 보안 프로토콜 4가지는?",
        "answer": "1. **SSL/TLS** - 전송 계층 암호화\n2. **IPSec** - IP 계층 보안\n3. **SSH** - 안전한 원격 접속\n4. **HTTPS** - HTTP over SSL/TLS",
        "type": "essay",
        "tags": ["Network", "Security"]
    },
    {
        "question": "QoS의 메커니즘 3가지는?",
        "answer": "1. **Traffic Shaping** - 트래픽 속도 조절\n2. **Traffic Policing** - 초과 트래픽 제한\n3. **Priority Queuing** - 우선순위 기반 큐잉",
        "type": "essay",
        "tags": ["Network", "QoS"]
    },
    {
        "question": "멀티캐스트의 특징과 용도는?",
        "answer": "**특징:**\n- 1:N 통신\n- 특정 그룹에만 전송\n- 대역폭 효율적\n\n**용도:**\n- IPTV, 화상회의\n- 주식 시세 전송",
        "type": "essay",
        "tags": ["Network", "Multicast"]
    },
    {
        "question": "유니캐스트, 브로드캐스트, 멀티캐스트 비교는?",
        "answer": "1. **유니캐스트** - 1:1 통신\n2. **브로드캐스트** - 1:전체 통신\n3. **멀티캐스트** - 1:그룹 통신",
        "type": "essay",
        "tags": ["Network"]
    },
    {
        "question": "네트워크 토폴로지 5가지는?",
        "answer": "1. **Star** - 중앙 집중형\n2. **Ring** - 순환 구조\n3. **Bus** - 단일 백본\n4. **Mesh** - 완전 연결\n5. **Tree** - 계층 구조",
        "type": "essay",
        "tags": ["Network", "Topology"]
    },
    {
        "question": "ICMP의 용도와 주요 메시지는?",
        "answer": "**용도:** 네트워크 진단 및 오류 보고\n\n**주요 메시지:**\n- Echo Request/Reply (ping)\n- Destination Unreachable\n- Time Exceeded (traceroute)",
        "type": "essay",
        "tags": ["Network", "ICMP"]
    },
    {
        "question": "VLAN의 개념과 장점 3가지는?",
        "answer": "**개념:** 논리적으로 네트워크를 분할\n\n**장점:**\n1. 브로드캐스트 도메인 분리\n2. 보안 강화\n3. 유연한 네트워크 관리",
        "type": "essay",
        "tags": ["Network", "VLAN"]
    },
    {
        "question": "Ping과 Traceroute의 차이는?",
        "answer": "**Ping:**\n- 도달 가능 여부 확인\n- RTT 측정\n- ICMP Echo\n\n**Traceroute:**\n- 경로 추적\n- 각 홉의 지연시간\n- ICMP TTL 활용",
        "type": "essay",
        "tags": ["Network", "ICMP"]
    },
    {
        "question": "MTU와 MSS의 차이는?",
        "answer": "**MTU (Maximum Transmission Unit):**\n- 데이터링크 계층 최대 크기\n- 일반적으로 1500 bytes\n\n**MSS (Maximum Segment Size):**\n- TCP 데이터 최대 크기\n- MTU - IP헤더 - TCP헤더",
        "type": "essay",
        "tags": ["Network", "MTU"]
    },
    {
        "question": "대역폭과 처리량의 차이는?",
        "answer": "**대역폭 (Bandwidth):**\n- 이론적 최대 전송 속도\n- 물리적 용량\n\n**처리량 (Throughput):**\n- 실제 전송 속도\n- 네트워크 상태 영향",
        "type": "essay",
        "tags": ["Network"]
    },
    {
        "question": "지연(Latency)의 구성 요소 4가지는?",
        "answer": "1. **전파 지연** - 물리적 거리\n2. **전송 지연** - 데이터 크기/대역폭\n3. **처리 지연** - 라우터/스위치 처리\n4. **큐잉 지연** - 대기 시간",
        "type": "essay",
        "tags": ["Network", "Latency"]
    },
    {
        "question": "이더넷 프레임의 구조는?",
        "answer": "1. **Preamble** - 동기화 (7 bytes)\n2. **SFD** - 프레임 시작 (1 byte)\n3. **Destination MAC** (6 bytes)\n4. **Source MAC** (6 bytes)\n5. **Type** - 상위 프로토콜 (2 bytes)\n6. **Data** (46-1500 bytes)\n7. **FCS** - 오류 검출 (4 bytes)",
        "type": "essay",
        "tags": ["Network", "Ethernet"]
    },
    {
        "question": "IP 헤더의 주요 필드 5가지는?",
        "answer": "1. **Version** - IPv4/IPv6\n2. **TTL** - 홉 수 제한\n3. **Protocol** - 상위 프로토콜 (TCP/UDP)\n4. **Source IP**\n5. **Destination IP**",
        "type": "essay",
        "tags": ["Network", "IP"]
    },
    {
        "question": "TCP 헤더의 주요 필드 6가지는?",
        "answer": "1. **Source/Dest Port** - 포트 번호\n2. **Sequence Number** - 순서 번호\n3. **Acknowledgment** - 응답 번호\n4. **Flags** - SYN, ACK, FIN 등\n5. **Window Size** - 흐름 제어\n6. **Checksum** - 오류 검출",
        "type": "essay",
        "tags": ["Network", "TCP"]
    },
    {
        "question": "라우팅 테이블의 구성 요소는?",
        "answer": "1. **Destination Network** - 목적지 네트워크\n2. **Subnet Mask** - 서브넷 마스크\n3. **Gateway** - 다음 홉 라우터\n4. **Interface** - 출력 인터페이스\n5. **Metric** - 경로 비용",
        "type": "essay",
        "tags": ["Network", "Routing"]
    },
    {
        "question": "CIDR 표기법의 의미는?",
        "answer": "**개념:** Classless Inter-Domain Routing\n\n**예시:**\n- 192.168.1.0/24 → 256개 주소\n- 192.168.1.0/25 → 128개 주소\n\n**/N = 네트워크 비트 수**",
        "type": "essay",
        "tags": ["Network", "IP"]
    },
    {
        "question": "Public IP와 Private IP의 차이는?",
        "answer": "**Public IP:**\n- 인터넷에서 라우팅 가능\n- 전 세계 유일\n\n**Private IP:**\n- 내부 네트워크 전용\n- 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16",
        "type": "essay",
        "tags": ["Network", "IP"]
    },
    {
        "question": "Keepalive의 목적과 동작은?",
        "answer": "**목적:**\n- 연결 유지 확인\n- 죽은 연결 감지\n\n**동작:**\n- 주기적으로 probe 전송\n- 응답 없으면 연결 종료",
        "type": "essay",
        "tags": ["Network", "TCP"]
    },
    {
        "question": "Half-duplex와 Full-duplex의 차이는?",
        "answer": "**Half-duplex:**\n- 양방향 통신 가능\n- 동시 불가 (교대로)\n\n**Full-duplex:**\n- 양방향 통신 가능\n- 동시 가능",
        "type": "essay",
        "tags": ["Network"]
    }
]

brief["cards"].extend(cards_21_45)

print(f"카드 21-45 추가 완료 (총 {len(brief['cards'])}개)")

# 저장
with open('public/data/dataset-brief/network/network.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"✅ 네트워크 간략버전 저장 완료! (진행률: {len(brief['cards'])}/104)")
