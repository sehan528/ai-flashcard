#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
network.json 간략버전 최종 완성 (카드 96-104)
"""

import json

# 기존 데이터 로드
with open('public/data/dataset-brief/network/network.json', 'r', encoding='utf-8') as f:
    brief = json.load(f)

print(f"현재 카드 수: {len(brief['cards'])}")

# 카드 96-104 추가 (최종 9개)
cards_96_104 = [
    {
        "question": "TLS 1.3의 개선사항 4가지는?",
        "answer": "1. **1-RTT Handshake** - 기존 2-RTT에서 단축\n2. **0-RTT 재연결** - 이전 연결 재사용\n3. **암호화 강화** - 약한 알고리즘 제거\n4. **Forward Secrecy** - 필수 적용",
        "type": "essay",
        "tags": ["Network", "Security", "TLS"]
    },
    {
        "question": "Diffie-Hellman 키 교환의 원리는?",
        "answer": "1. 공개 매개변수 합의 (p, g)\n2. 각자 비밀 키 생성\n3. 공개 키 교환\n4. 공유 비밀 키 계산\n\n**특징:** 제3자는 공유 키 알 수 없음",
        "type": "essay",
        "tags": ["Network", "Security", "Cryptography"]
    },
    {
        "question": "대칭키와 비대칭키 암호화의 차이는?",
        "answer": "**대칭키:**\n- 동일 키로 암/복호화\n- 빠름\n- 키 배송 문제\n- AES, DES\n\n**비대칭키:**\n- 공개키/개인키 쌍\n- 느림\n- 안전한 키 교환\n- RSA, ECC",
        "type": "essay",
        "tags": ["Network", "Security", "Cryptography"]
    },
    {
        "question": "해시 함수의 특성 4가지는?",
        "answer": "1. **결정성** - 동일 입력 → 동일 출력\n2. **일방향성** - 역연산 불가\n3. **눈사태 효과** - 작은 변화 → 큰 변화\n4. **충돌 저항성** - 동일 해시값 찾기 어려움",
        "type": "essay",
        "tags": ["Network", "Security", "Hash"]
    },
    {
        "question": "Digital Signature의 동작 과정은?",
        "answer": "**서명:**\n1. 메시지 해시 생성\n2. 개인키로 해시 암호화\n\n**검증:**\n1. 공개키로 서명 복호화\n2. 메시지 해시와 비교\n\n**효과:** 무결성, 인증, 부인방지",
        "type": "essay",
        "tags": ["Network", "Security"]
    },
    {
        "question": "SNI의 개념과 필요성은?",
        "answer": "**개념:** Server Name Indication, TLS 확장\n\n**필요성:**\n- 하나의 IP에 여러 도메인 호스팅\n- 올바른 인증서 선택\n- HTTPS 가상 호스팅 지원",
        "type": "essay",
        "tags": ["Network", "TLS"]
    },
    {
        "question": "HTTP Pipelining과 Multiplexing의 차이는?",
        "answer": "**Pipelining (HTTP/1.1):**\n- 여러 요청 순차 전송\n- 응답도 순서대로\n- HOL Blocking 문제\n\n**Multiplexing (HTTP/2):**\n- 단일 연결에 여러 스트림\n- 응답 순서 무관\n- HOL Blocking 해결",
        "type": "essay",
        "tags": ["Network", "HTTP"]
    },
    {
        "question": "HOL Blocking의 개념과 해결책은?",
        "answer": "**개념:** Head-of-Line Blocking, 앞선 요청이 후속 요청 지연\n\n**HTTP/1.1:** 파이프라이닝 문제\n**해결 (HTTP/2):** 멀티플렉싱\n**TCP HOL:** HTTP/3의 QUIC으로 해결 (UDP 기반)",
        "type": "essay",
        "tags": ["Network", "HTTP"]
    },
    {
        "question": "네트워크 성능 최적화 기법 6가지는?",
        "answer": "1. **CDN** - 콘텐츠 분산\n2. **캐싱** - 중복 요청 감소\n3. **압축** - 데이터 크기 축소 (gzip, brotli)\n4. **HTTP/2, HTTP/3** - 프로토콜 개선\n5. **Connection Pooling** - 연결 재사용\n6. **DNS Prefetch** - DNS 조회 선행",
        "type": "essay",
        "tags": ["Network", "Performance"]
    }
]

brief["cards"].extend(cards_96_104)

print(f"카드 96-104 추가 완료 (총 {len(brief['cards'])}개)")

# 저장
with open('public/data/dataset-brief/network/network.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"\n🎉 네트워크 간략버전 100% 완성! 총 {len(brief['cards'])}개 카드")
print(f"✅ 파일 저장: public/data/dataset-brief/network/network.json")
