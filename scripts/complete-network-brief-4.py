#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
network.json 간략버전 계속 추가 (카드 71-95)
"""

import json

# 기존 데이터 로드
with open('public/data/dataset-brief/network/network.json', 'r', encoding='utf-8') as f:
    brief = json.load(f)

print(f"현재 카드 수: {len(brief['cards'])}")

# 카드 71-95 추가
cards_71_95 = [
    {
        "question": "gRPC의 특징 4가지는?",
        "answer": "1. **HTTP/2 기반** - 멀티플렉싱, 스트리밍\n2. **Protocol Buffers** - 효율적 직렬화\n3. **4가지 통신 방식** - Unary, Server/Client/Bidirectional Streaming\n4. **언어 중립적** - 다양한 언어 지원",
        "type": "essay",
        "tags": ["Network", "gRPC"]
    },
    {
        "question": "WebRTC의 특징과 구성 요소는?",
        "answer": "**특징:** P2P 실시간 통신\n\n**구성:**\n1. **getUserMedia** - 미디어 획득\n2. **RTCPeerConnection** - P2P 연결\n3. **RTCDataChannel** - 데이터 전송\n4. **Signaling Server** - 피어 정보 교환",
        "type": "essay",
        "tags": ["Network", "WebRTC"]
    },
    {
        "question": "STUN과 TURN의 역할은?",
        "answer": "**STUN:**\n- 공인 IP/포트 확인\n- NAT 타입 판별\n\n**TURN:**\n- NAT 통과 실패시 릴레이\n- 미디어 중계 서버",
        "type": "essay",
        "tags": ["Network", "WebRTC"]
    },
    {
        "question": "Long Polling과 Server-Sent Events의 차이는?",
        "answer": "**Long Polling:**\n- 클라이언트가 주기적 요청\n- 이벤트 발생시 응답\n- HTTP 요청-응답 반복\n\n**SSE:**\n- 단일 연결 유지\n- 서버 → 클라이언트 단방향\n- EventSource API",
        "type": "essay",
        "tags": ["Network", "SSE"]
    },
    {
        "question": "mTLS의 개념과 동작은?",
        "answer": "**개념:** Mutual TLS, 양방향 인증서 검증\n\n**동작:**\n1. 클라이언트가 서버 인증서 검증\n2. 서버가 클라이언트 인증서 검증\n3. 양방향 신원 확인",
        "type": "essay",
        "tags": ["Network", "Security"]
    },
    {
        "question": "Zero Trust 네트워크의 원칙은?",
        "answer": "1. **Never Trust, Always Verify** - 모든 접근 검증\n2. **Least Privilege** - 최소 권한\n3. **Assume Breach** - 침해 가정\n4. **Micro-segmentation** - 세밀한 분할",
        "type": "essay",
        "tags": ["Network", "Security"]
    },
    {
        "question": "Service Mesh의 개념과 기능은?",
        "answer": "**개념:** 마이크로서비스 간 통신 인프라 계층\n\n**기능:**\n1. 트래픽 관리\n2. 보안 (mTLS)\n3. 모니터링\n4. 서비스 디스커버리\n\n**예:** Istio, Linkerd",
        "type": "essay",
        "tags": ["Network", "ServiceMesh"]
    },
    {
        "question": "Circuit Breaker 패턴의 상태 3가지는?",
        "answer": "1. **Closed** - 정상 작동\n2. **Open** - 실패 임계값 초과, 요청 차단\n3. **Half-Open** - 테스트 요청 허용",
        "type": "essay",
        "tags": ["Network", "Pattern"]
    },
    {
        "question": "Rate Limiting 알고리즘 4가지는?",
        "answer": "1. **Token Bucket** - 토큰 소비 방식\n2. **Leaky Bucket** - 일정 속도 처리\n3. **Fixed Window** - 고정 시간 윈도우\n4. **Sliding Window** - 이동 시간 윈도우",
        "type": "essay",
        "tags": ["Network", "RateLimit"]
    },
    {
        "question": "API Gateway의 주요 기능은?",
        "answer": "1. **라우팅** - 요청 분배\n2. **인증/인가** - 보안 처리\n3. **Rate Limiting** - 속도 제한\n4. **로깅/모니터링**\n5. **프로토콜 변환**\n6. **캐싱**",
        "type": "essay",
        "tags": ["Network", "APIGateway"]
    },
    {
        "question": "Forward Proxy와 Reverse Proxy의 차이점은?",
        "answer": "**Forward Proxy:**\n- 클라이언트 앞단\n- 클라이언트 대신 요청\n- 익명성, 캐싱\n\n**Reverse Proxy:**\n- 서버 앞단\n- 서버 대신 응답\n- 로드밸런싱, 보안",
        "type": "essay",
        "tags": ["Network", "Proxy"]
    },
    {
        "question": "Content Negotiation의 방법 3가지는?",
        "answer": "1. **Server-driven** - Accept 헤더 기반\n2. **Agent-driven** - 클라이언트가 선택\n3. **Transparent** - 중간 서버가 선택\n\n**헤더:** Accept, Accept-Language, Accept-Encoding",
        "type": "essay",
        "tags": ["Network", "HTTP"]
    },
    {
        "question": "ETag의 개념과 용도는?",
        "answer": "**개념:** 리소스의 버전 식별자\n\n**용도:**\n1. 캐시 검증 (If-None-Match)\n2. 조건부 요청\n3. 낙관적 동시성 제어\n\n**응답:** 304 Not Modified",
        "type": "essay",
        "tags": ["Network", "HTTP", "Cache"]
    },
    {
        "question": "HTTP 캐싱 헤더의 종류와 역할은?",
        "answer": "1. **Cache-Control** - 캐시 동작 지시\n2. **Expires** - 만료 시각\n3. **ETag** - 리소스 버전\n4. **Last-Modified** - 수정 시각\n5. **If-None-Match / If-Modified-Since** - 조건부 요청",
        "type": "essay",
        "tags": ["Network", "Cache"]
    },
    {
        "question": "Cache-Control 디렉티브 주요 값은?",
        "answer": "**요청:**\n- no-cache, no-store\n- max-age\n\n**응답:**\n- public, private\n- max-age, s-maxage\n- no-cache, no-store\n- must-revalidate",
        "type": "essay",
        "tags": ["Network", "Cache"]
    },
    {
        "question": "SameSite 쿠키 속성의 값 3가지는?",
        "answer": "1. **Strict** - 같은 사이트만 전송\n2. **Lax** - 일부 크로스 사이트 허용 (GET)\n3. **None** - 모든 요청 전송 (Secure 필수)\n\n**목적:** CSRF 방어",
        "type": "essay",
        "tags": ["Network", "Cookie", "Security"]
    },
    {
        "question": "JWT의 구조 3가지는?",
        "answer": "1. **Header** - 알고리즘, 타입\n2. **Payload** - 클레임 (데이터)\n3. **Signature** - 서명\n\n**형식:** xxxxx.yyyyy.zzzzz (Base64 인코딩)",
        "type": "essay",
        "tags": ["Network", "Auth", "JWT"]
    },
    {
        "question": "OAuth 2.0의 권한 부여 방식 4가지는?",
        "answer": "1. **Authorization Code** - 웹 앱 (가장 안전)\n2. **Implicit** - SPA (deprecated)\n3. **Resource Owner Password** - 신뢰 앱\n4. **Client Credentials** - 서버 간 통신",
        "type": "essay",
        "tags": ["Network", "OAuth"]
    },
    {
        "question": "Access Token과 Refresh Token의 차이는?",
        "answer": "**Access Token:**\n- API 접근 권한\n- 짧은 유효 기간 (15분-1시간)\n- 탈취 피해 최소화\n\n**Refresh Token:**\n- Access Token 재발급\n- 긴 유효 기간\n- 안전하게 저장",
        "type": "essay",
        "tags": ["Network", "Auth"]
    },
    {
        "question": "PKCE의 개념과 동작은?",
        "answer": "**개념:** Proof Key for Code Exchange, OAuth 보안 강화\n\n**동작:**\n1. Code Verifier 생성 (랜덤)\n2. Code Challenge 생성 (해시)\n3. 인증 요청시 Challenge 전송\n4. 토큰 요청시 Verifier 검증",
        "type": "essay",
        "tags": ["Network", "OAuth", "Security"]
    },
    {
        "question": "HSTS의 개념과 효과는?",
        "answer": "**개념:** HTTP Strict Transport Security, HTTPS 강제\n\n**효과:**\n1. HTTP → HTTPS 자동 리다이렉트\n2. 중간자 공격 방지\n3. SSL Stripping 방어\n\n**헤더:** Strict-Transport-Security: max-age=...",
        "type": "essay",
        "tags": ["Network", "Security"]
    },
    {
        "question": "CSP의 개념과 디렉티브는?",
        "answer": "**개념:** Content Security Policy, XSS 방어\n\n**주요 디렉티브:**\n- default-src\n- script-src\n- style-src\n- img-src\n- connect-src",
        "type": "essay",
        "tags": ["Network", "Security"]
    },
    {
        "question": "CSRF 토큰의 동작 원리는?",
        "answer": "1. 서버가 세션별 랜덤 토큰 생성\n2. 폼에 토큰 포함\n3. 요청시 토큰 검증\n4. 일치하지 않으면 거부\n\n**특징:** 공격자가 토큰 알 수 없음",
        "type": "essay",
        "tags": ["Network", "Security"]
    },
    {
        "question": "XSS 공격의 유형 3가지는?",
        "answer": "1. **Stored XSS** - DB에 스크립트 저장\n2. **Reflected XSS** - URL 파라미터 반영\n3. **DOM-based XSS** - 클라이언트 DOM 조작\n\n**방어:** 입력 검증, 출력 인코딩, CSP",
        "type": "essay",
        "tags": ["Network", "Security"]
    },
    {
        "question": "SQL Injection 방어 방법 4가지는?",
        "answer": "1. **Prepared Statement** - 파라미터 바인딩\n2. **입력 검증** - 화이트리스트\n3. **ORM 사용** - 쿼리 추상화\n4. **최소 권한** - DB 계정 권한 제한",
        "type": "essay",
        "tags": ["Network", "Security"]
    }
]

brief["cards"].extend(cards_71_95)

print(f"카드 71-95 추가 완료 (총 {len(brief['cards'])}개)")

# 저장
with open('public/data/dataset-brief/network/network.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"✅ 네트워크 간략버전 저장 완료! (진행률: {len(brief['cards'])}/104)")
