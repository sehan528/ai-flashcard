#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
network.json 간략버전 완성 스크립트
104개 카드를 모두 간략버전으로 변환
"""

import json

# 원본 데이터 로드
with open('public/data/dataset/network/network.json', 'r', encoding='utf-8') as f:
    original = json.load(f)

# 간략버전 데이터 구조
brief = {
    "name": "네트워크 (간략버전)",
    "description": "Network 핵심 개념을 간결하게 정리한 버전",
    "cards": []
}

# 카드 11-30 추가 (다음 20개)
cards_11_30 = [
    {
        "question": "REST API의 설계 원칙 6가지는?",
        "answer": "1. **Uniform Interface** - 일관된 인터페이스\n2. **Stateless** - 무상태성\n3. **Cacheable** - 캐시 가능\n4. **Client-Server** - 클라이언트-서버 구조\n5. **Layered System** - 계층화\n6. **Code on Demand** - 선택적",
        "type": "essay",
        "tags": ["Network", "REST"]
    },
    {
        "question": "HTTP/1.1과 HTTP/2의 주요 차이점 4가지는?",
        "answer": "1. **멀티플렉싱** - HTTP/2는 하나의 연결로 여러 요청 동시 처리\n2. **헤더 압축** - HPACK으로 헤더 크기 감소\n3. **서버 푸시** - 클라이언트 요청 전 리소스 전송\n4. **바이너리 프로토콜** - 텍스트 대신 바이너리 사용",
        "type": "essay",
        "tags": ["Network", "HTTP"]
    },
    {
        "question": "로드 밸런싱 알고리즘 4가지는?",
        "answer": "1. **Round Robin** - 순차적 분배\n2. **Least Connection** - 연결 수가 가장 적은 서버\n3. **IP Hash** - IP 주소 기반 해싱\n4. **Weighted Round Robin** - 가중치 기반 분배",
        "type": "essay",
        "tags": ["Network", "LoadBalancing"]
    },
    {
        "question": "SSL/TLS Handshake 과정은?",
        "answer": "1. Client Hello - 클라이언트가 지원 가능한 암호화 방식 전송\n2. Server Hello - 서버가 선택한 암호화 방식, 인증서 전송\n3. 인증서 검증 - 클라이언트가 CA로 인증서 검증\n4. 키 교환 - 대칭키 생성 및 교환\n5. Finished - 암호화 통신 시작",
        "type": "essay",
        "tags": ["Network", "Security", "SSL"]
    },
    {
        "question": "NAT의 종류 3가지는?",
        "answer": "1. **Static NAT** - 1:1 고정 매핑\n2. **Dynamic NAT** - 풀에서 동적 할당\n3. **PAT (NAPT)** - 포트 번호로 다중 매핑",
        "type": "essay",
        "tags": ["Network", "NAT"]
    },
    {
        "question": "서브넷 마스크의 역할과 예시는?",
        "answer": "**역할:** IP 주소를 네트워크부와 호스트부로 구분\n\n**예시:**\n- 255.255.255.0 (/24) - C클래스, 254개 호스트\n- 255.255.0.0 (/16) - B클래스, 65534개 호스트",
        "type": "essay",
        "tags": ["Network", "IP"]
    },
    {
        "question": "ARP 프로토콜의 동작 과정은?",
        "answer": "1. ARP Request 브로드캐스트 - IP에 대한 MAC 주소 요청\n2. 해당 IP를 가진 호스트가 ARP Reply 유니캐스트\n3. MAC 주소 수신 및 ARP 캐시 저장\n4. 이후 통신에 캐시 사용",
        "type": "essay",
        "tags": ["Network", "ARP"]
    },
    {
        "question": "DHCP의 동작 과정 4단계는?",
        "answer": "1. **Discover** - 클라이언트가 DHCP 서버 찾기 (브로드캐스트)\n2. **Offer** - DHCP 서버가 IP 제안\n3. **Request** - 클라이언트가 IP 요청\n4. **Ack** - 서버가 IP 할당 확인",
        "type": "essay",
        "tags": ["Network", "DHCP"]
    },
    {
        "question": "Proxy 서버의 종류와 용도는?",
        "answer": "**Forward Proxy:**\n- 클라이언트 대신 요청\n- 익명성, 캐싱, 필터링\n\n**Reverse Proxy:**\n- 서버 앞단에 위치\n- 로드밸런싱, 보안, SSL 종료",
        "type": "essay",
        "tags": ["Network", "Proxy"]
    },
    {
        "question": "TCP 흐름제어 방법 2가지는?",
        "answer": "1. **Stop-and-Wait** - 응답 받을 때까지 대기\n2. **Sliding Window** - 윈도우 크기만큼 연속 전송, 동적 조절",
        "type": "essay",
        "tags": ["Network", "TCP"]
    },
    {
        "question": "TCP 혼잡제어 알고리즘 4가지는?",
        "answer": "1. **Slow Start** - 지수적으로 윈도우 증가\n2. **Congestion Avoidance** - 선형적으로 증가\n3. **Fast Retransmit** - 3 중복 ACK시 즉시 재전송\n4. **Fast Recovery** - 혼잡 회피 단계로 빠른 복구",
        "type": "essay",
        "tags": ["Network", "TCP"]
    },
    {
        "question": "웹 소켓과 HTTP 폴링의 차이는?",
        "answer": "**WebSocket:**\n- 양방향 실시간 통신\n- 연결 유지\n- 낮은 오버헤드\n\n**HTTP 폴링:**\n- 주기적 요청-응답\n- 연결 재생성\n- 높은 오버헤드",
        "type": "essay",
        "tags": ["Network", "WebSocket"]
    },
    {
        "question": "CDN의 동작 원리와 장점은?",
        "answer": "**동작:**\n- 전 세계 엣지 서버에 컨텐츠 분산\n- 사용자와 가까운 서버에서 응답\n\n**장점:**\n- 빠른 속도\n- 서버 부하 분산\n- DDoS 방어",
        "type": "essay",
        "tags": ["Network", "CDN"]
    },
    {
        "question": "HTTP 인증 방식 4가지는?",
        "answer": "1. **Basic** - Base64 인코딩 (보안 취약)\n2. **Digest** - 해시 사용\n3. **Bearer Token** - JWT 등\n4. **OAuth 2.0** - 토큰 기반 인증",
        "type": "essay",
        "tags": ["Network", "HTTP", "Auth"]
    },
    {
        "question": "RESTful API와 GraphQL의 차이점은?",
        "answer": "**REST:**\n- 여러 엔드포인트\n- Over/Under fetching 가능\n- 캐싱 용이\n\n**GraphQL:**\n- 단일 엔드포인트\n- 필요한 데이터만 요청\n- 복잡한 쿼리 가능",
        "type": "essay",
        "tags": ["Network", "REST", "GraphQL"]
    },
    {
        "question": "SOP(Same-Origin Policy)의 조건 3가지는?",
        "answer": "1. **프로토콜** - http/https 일치\n2. **도메인** - 도메인 일치\n3. **포트** - 포트 번호 일치\n\n모두 일치해야 동일 출처",
        "type": "essay",
        "tags": ["Network", "Security"]
    },
    {
        "question": "IPv4와 IPv6의 주요 차이점 4가지는?",
        "answer": "1. **주소 길이** - IPv4: 32비트 / IPv6: 128비트\n2. **표기법** - IPv4: 10진수 / IPv6: 16진수\n3. **주소 개수** - IPv4: 43억 / IPv6: 340간\n4. **헤더** - IPv6가 더 단순하고 효율적",
        "type": "essay",
        "tags": ["Network", "IP"]
    },
    {
        "question": "라우팅 프로토콜의 분류는?",
        "answer": "**IGP (내부):**\n- RIP - 거리 벡터\n- OSPF - 링크 상태\n- EIGRP - 하이브리드\n\n**EGP (외부):**\n- BGP - 경로 벡터",
        "type": "essay",
        "tags": ["Network", "Routing"]
    },
    {
        "question": "TCP 4-way handshake 과정은?",
        "answer": "1. **FIN** - 클라이언트 → 서버 (종료 요청)\n2. **ACK** - 서버 → 클라이언트\n3. **FIN** - 서버 → 클라이언트 (종료 준비 완료)\n4. **ACK** - 클라이언트 → 서버\n\n연결 종료",
        "type": "essay",
        "tags": ["Network", "TCP"]
    },
    {
        "question": "포트 번호의 분류는?",
        "answer": "1. **Well-Known Ports (0-1023)** - HTTP(80), HTTPS(443), SSH(22)\n2. **Registered Ports (1024-49151)** - 등록된 애플리케이션\n3. **Dynamic Ports (49152-65535)** - 임시 포트",
        "type": "essay",
        "tags": ["Network", "Port"]
    }
]

brief["cards"].extend(cards_11_30)

print(f"카드 11-30 추가 완료 (총 {len(brief['cards'])}개)")

# 저장
with open('public/data/dataset-brief/network/network.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print("✅ 네트워크 간략버전 저장 완료!")
