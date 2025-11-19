#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
websocket.json 간략버전 완성 (30 cards)
"""

import json

# 기존 간략버전 로드
with open('public/data/dataset-brief/websocket/websocket.json', 'r', encoding='utf-8') as f:
    brief = json.load(f)

print(f"현재 카드 수: {len(brief['cards'])}")

# 전체 30개 카드 생성
all_cards = [
    {
        "question": "WebSocket의 특징 5가지는?",
        "answer": "1. **양방향 통신** - Full-Duplex\n2. **실시간** - 낮은 지연\n3. **지속 연결** - 연결 유지\n4. **낮은 오버헤드** - 헤더 작음\n5. **HTTP 기반 핸드셰이크** - 포트 80/443 사용",
        "type": "essay",
        "tags": ["WebSocket", "Network"]
    },
    {
        "question": "WebSocket과 HTTP 폴링의 차이는?",
        "answer": "**WebSocket:**\n- 양방향, 실시간\n- 지속 연결\n- 낮은 오버헤드\n- 빠름\n\n**HTTP 폴링:**\n- 단방향, 주기적 요청\n- 연결 재생성\n- 높은 오버헤드\n- 느림, 서버 부담",
        "type": "essay",
        "tags": ["WebSocket", "Comparison"]
    },
    {
        "question": "WebSocket 핸드셰이크 과정은?",
        "answer": "**클라이언트 요청:**\n```\nGET /chat HTTP/1.1\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Key: ...\n```\n\n**서버 응답:**\n```\nHTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Accept: ...\n```\n\n**이후 WebSocket 프로토콜**",
        "type": "essay",
        "tags": ["WebSocket", "Handshake"]
    },
    {
        "question": "WebSocket 프레임 구조는?",
        "answer": "1. **FIN** - 최종 프레임 여부\n2. **Opcode** - 프레임 타입 (text/binary/close/ping/pong)\n3. **Mask** - 클라이언트→서버는 마스킹 필수\n4. **Payload Length** - 데이터 길이\n5. **Payload Data** - 실제 데이터",
        "type": "essay",
        "tags": ["WebSocket", "Frame"]
    },
    {
        "question": "WebSocket Opcode 종류는?",
        "answer": "1. **0x1** - Text Frame\n2. **0x2** - Binary Frame\n3. **0x8** - Connection Close\n4. **0x9** - Ping\n5. **0xA** - Pong\n\n**0x0:** Continuation Frame",
        "type": "essay",
        "tags": ["WebSocket", "Opcode"]
    },
    {
        "question": "WebSocket 마스킹의 목적은?",
        "answer": "**목적:** 캐시 포이즈닝 공격 방지\n\n**규칙:**\n- 클라이언트 → 서버: 마스킹 필수\n- 서버 → 클라이언트: 마스킹 금지\n\n**동작:** XOR 연산\n\n**보안:** 프록시 캐시 오염 방지",
        "type": "essay",
        "tags": ["WebSocket", "Security"]
    },
    {
        "question": "WebSocket 연결 종료 과정은?",
        "answer": "1. **Close Frame 전송** - 한쪽이 먼저\n2. **Close Frame 응답** - 상대방\n3. **TCP 연결 종료**\n\n**Status Code:**\n- 1000: Normal\n- 1001: Going Away\n- 1002: Protocol Error\n- 1003: Unsupported Data",
        "type": "essay",
        "tags": ["WebSocket", "Close"]
    },
    {
        "question": "WebSocket Ping/Pong의 역할은?",
        "answer": "**역할:**\n- **Keepalive** - 연결 유지 확인\n- **지연 측정** - RTT\n\n**동작:**\n1. 한쪽이 Ping 전송\n2. 받은 쪽은 Pong 응답\n\n**주기적 실행으로 죽은 연결 감지**",
        "type": "essay",
        "tags": ["WebSocket", "Heartbeat"]
    },
    {
        "question": "WebSocket 서브프로토콜의 개념은?",
        "answer": "**개념:** WebSocket 위에서 동작하는 애플리케이션 프로토콜\n\n**협상:**\n```\nSec-WebSocket-Protocol: chat, superchat\n```\n\n**예시:**\n- STOMP\n- WAMP\n- MQTT over WebSocket\n\n**선택적 사용**",
        "type": "essay",
        "tags": ["WebSocket", "Subprotocol"]
    },
    {
        "question": "STOMP 프로토콜의 특징은?",
        "answer": "**개념:** Simple Text Oriented Messaging Protocol\n\n**명령:**\n- CONNECT, SEND, SUBSCRIBE, UNSUBSCRIBE\n- MESSAGE, ACK, NACK\n\n**장점:**\n- 단순, 텍스트 기반\n- 메시지 브로커 패턴\n\n**WebSocket 위에서 주로 사용**",
        "type": "essay",
        "tags": ["WebSocket", "STOMP"]
    },
    {
        "question": "WebSocket vs Server-Sent Events 비교는?",
        "answer": "**WebSocket:**\n- 양방향\n- Binary 지원\n- 복잡\n\n**SSE:**\n- 단방향 (서버→클라이언트)\n- Text만\n- 간단\n- 자동 재연결\n- EventSource API\n\n**선택:** 양방향 필요시 WebSocket",
        "type": "essay",
        "tags": ["WebSocket", "SSE"]
    },
    {
        "question": "WebSocket 보안 고려사항은?",
        "answer": "1. **WSS 사용** - TLS 암호화 (ws:// → wss://)\n2. **Origin 검증** - CSRF 방지\n3. **인증/인가** - 토큰 등\n4. **입력 검증** - XSS 방지\n5. **Rate Limiting** - DoS 방지",
        "type": "essay",
        "tags": ["WebSocket", "Security"]
    },
    {
        "question": "WebSocket의 Origin 검증 방법은?",
        "answer": "**핸드셰이크시 검증:**\n```javascript\nif (req.headers.origin !== 'https://example.com') {\n  reject();\n}\n```\n\n**CSRF 방지:**\n- 허용된 Origin만 수락\n- 토큰 기반 인증 병행\n\n**서버에서 구현 필수**",
        "type": "essay",
        "tags": ["WebSocket", "Security"]
    },
    {
        "question": "WebSocket 확장(Extension)의 개념은?",
        "answer": "**개념:** WebSocket 프로토콜 기능 확장\n\n**예시:**\n- **permessage-deflate** - 압축\n- **multiplexing** - 다중화\n\n**협상:**\n```\nSec-WebSocket-Extensions: permessage-deflate\n```\n\n**선택적 사용**",
        "type": "essay",
        "tags": ["WebSocket", "Extension"]
    },
    {
        "question": "WebSocket 압축(permessage-deflate)의 효과는?",
        "answer": "**효과:**\n- 대역폭 절약\n- 전송 속도 향상\n\n**단점:**\n- CPU 오버헤드\n- 작은 메시지는 오히려 증가\n\n**설정:** 임계값 설정 권장\n\n**협상:** 클라이언트-서버 합의",
        "type": "essay",
        "tags": ["WebSocket", "Compression"]
    },
    {
        "question": "WebSocket 스케일링 방법은?",
        "answer": "**문제:** 상태 유지 연결\n\n**해결:**\n1. **Sticky Session** - 같은 서버 유지\n2. **Redis Pub/Sub** - 서버 간 메시지 공유\n3. **Message Broker** - Kafka, RabbitMQ\n4. **WebSocket Gateway** - 전용 서버\n\n**로드밸런서 설정 중요**",
        "type": "essay",
        "tags": ["WebSocket", "Scaling"]
    },
    {
        "question": "WebSocket 재연결 전략은?",
        "answer": "**전략:**\n1. **지수 백오프** - 재시도 간격 증가\n2. **최대 재시도 횟수** - 무한 방지\n3. **연결 상태 모니터링** - onclose, onerror\n4. **메시지 버퍼링** - 재연결시 재전송\n\n**라이브러리:** ReconnectingWebSocket",
        "type": "essay",
        "tags": ["WebSocket", "Reconnection"]
    },
    {
        "question": "WebSocket 메시지 순서 보장은?",
        "answer": "**보장:**\n- 같은 연결 내 순서 보장\n- TCP 기반\n\n**주의:**\n- 프레임 분할시 Continuation 순서\n- 재연결시 순서 보장 안됨\n\n**필요시:** 시퀀스 번호 추가",
        "type": "essay",
        "tags": ["WebSocket", "Ordering"]
    },
    {
        "question": "WebSocket과 HTTP/2의 관계는?",
        "answer": "**독립적:**\n- WebSocket은 HTTP/1.1 기반 핸드셰이크\n- HTTP/2와 별도 프로토콜\n\n**HTTP/2 대안:**\n- Server Push (단방향)\n- Stream (다중화)\n\n**but WebSocket 여전히 유용:** 양방향, 간단",
        "type": "essay",
        "tags": ["WebSocket", "HTTP2"]
    },
    {
        "question": "WebSocket의 메시지 크기 제한은?",
        "answer": "**프로토콜:** 이론적 제한 없음 (2^63)\n\n**실제:**\n- 서버 설정\n- 브라우저 제한\n- 메모리\n\n**권장:**\n- 작은 메시지로 분할\n- 큰 파일은 HTTP\n\n**설정 예:** maxPayload",
        "type": "essay",
        "tags": ["WebSocket", "Limit"]
    },
    {
        "question": "WebSocket 프록시 통과 문제와 해결책은?",
        "answer": "**문제:**\n- 일부 프록시가 WebSocket 차단\n- Upgrade 헤더 미지원\n\n**해결:**\n1. **WSS (포트 443)** - HTTPS 프록시 통과\n2. **Fallback** - Long Polling 대체\n3. **터널링**\n\n**라이브러리:** Socket.IO (자동 fallback)",
        "type": "essay",
        "tags": ["WebSocket", "Proxy"]
    },
    {
        "question": "Socket.IO의 특징과 WebSocket 차이는?",
        "answer": "**Socket.IO:**\n- WebSocket 기반 라이브러리\n- 자동 재연결\n- Fallback (Long Polling)\n- Room/Namespace\n- 이벤트 기반\n\n**vs 순수 WebSocket:**\n- 더 무겁지만 편리\n- 프로토콜 호환 안됨",
        "type": "essay",
        "tags": ["WebSocket", "SocketIO"]
    },
    {
        "question": "WebSocket 사용 사례 5가지는?",
        "answer": "1. **채팅** - 실시간 메시징\n2. **게임** - 멀티플레이어\n3. **주식/암호화폐** - 실시간 시세\n4. **협업 도구** - 공동 편집\n5. **알림** - 푸시 알림\n\n**IoT, 대시보드, 라이브 스트리밍 등**",
        "type": "essay",
        "tags": ["WebSocket", "UseCase"]
    },
    {
        "question": "WebSocket 브로드캐스트 구현 방법은?",
        "answer": "**서버에서 모든 연결에 전송:**\n```javascript\nwss.clients.forEach(client => {\n  if (client.readyState === WebSocket.OPEN) {\n    client.send(data);\n  }\n});\n```\n\n**최적화:**\n- Room 개념\n- Redis Pub/Sub (다중 서버)",
        "type": "essay",
        "tags": ["WebSocket", "Broadcast"]
    },
    {
        "question": "WebSocket readyState의 값은?",
        "answer": "**0 - CONNECTING:** 연결 중\n**1 - OPEN:** 연결됨, 통신 가능\n**2 - CLOSING:** 종료 중\n**3 - CLOSED:** 연결 종료\n\n**확인 후 메시지 전송:**\n```javascript\nif (ws.readyState === WebSocket.OPEN) {\n  ws.send(data);\n}\n```",
        "type": "essay",
        "tags": ["WebSocket", "State"]
    },
    {
        "question": "WebSocket API 이벤트 4가지는?",
        "answer": "1. **onopen** - 연결 성공\n2. **onmessage** - 메시지 수신\n3. **onerror** - 에러 발생\n4. **onclose** - 연결 종료\n\n```javascript\nws.onopen = () => {};\nws.onmessage = (event) => {};\n```",
        "type": "essay",
        "tags": ["WebSocket", "API"]
    },
    {
        "question": "WebSocket 바이너리 데이터 전송 방법은?",
        "answer": "**송신:**\n```javascript\nws.send(new ArrayBuffer());\nws.send(new Blob());\n```\n\n**수신:**\n```javascript\nws.binaryType = 'arraybuffer'; // or 'blob'\nws.onmessage = (event) => {\n  const buffer = event.data; // ArrayBuffer\n};\n```\n\n**용도:** 파일, 이미지, 오디오",
        "type": "essay",
        "tags": ["WebSocket", "Binary"]
    },
    {
        "question": "WebSocket 모니터링 지표는?",
        "answer": "1. **연결 수** - 현재 활성 연결\n2. **메시지 처리량** - 초당 메시지 수\n3. **메시지 지연** - RTT\n4. **재연결 빈도** - 연결 안정성\n5. **에러율** - 오류 발생 비율\n\n**도구:** PM2, New Relic, CloudWatch",
        "type": "essay",
        "tags": ["WebSocket", "Monitoring"]
    },
    {
        "question": "WebSocket 테스트 방법은?",
        "answer": "**도구:**\n1. **브라우저 콘솔** - WebSocket API 직접\n2. **Postman** - WebSocket 지원\n3. **wscat** - CLI 도구\n4. **Artillery** - 부하 테스트\n\n**단위 테스트:** Mock WebSocket\n\n**통합 테스트:** 실제 서버",
        "type": "essay",
        "tags": ["WebSocket", "Testing"]
    },
    {
        "question": "WebSocket 라이브러리 추천은?",
        "answer": "**Node.js:**\n- ws - 가볍고 빠름\n- Socket.IO - 풍부한 기능\n- uWebSockets.js - 고성능\n\n**Python:**\n- websockets\n- aiohttp\n\n**Java:**\n- Java-WebSocket\n- Spring WebSocket",
        "type": "essay",
        "tags": ["WebSocket", "Library"]
    }
]

# 기존 5개 샘플 대체
brief["cards"] = all_cards

print(f"전체 {len(brief['cards'])}개 카드 생성 완료")

# 저장
with open('public/data/dataset-brief/websocket/websocket.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"\n🎉 WebSocket 간략버전 100% 완성! 총 {len(brief['cards'])}개 카드")
print(f"✅ 파일 저장: public/data/dataset-brief/websocket/websocket.json")
