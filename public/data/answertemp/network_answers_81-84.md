# Network 답변 모음 (81-84)

## 81. hosts 파일은 어떤 역할을 하나요? DNS와 비교하였을 때 어떤 것이 우선순위가 더 높나요?

**hosts 파일**은 로컬 시스템에서 도메인 이름을 IP 주소로 매핑하는 텍스트 파일입니다.

**hosts 파일의 위치:**
- **Windows**: C:\Windows\System32\drivers\etc\hosts
- **Linux/macOS**: /etc/hosts

**형식:**
각 줄에 IP 주소와 도메인 이름을 공백으로 구분하여 작성합니다.
```
192.0.2.1    example.com www.example.com
127.0.0.1    localhost
::1          localhost
```

**역할:**

**도메인 이름 해석:**
hosts 파일에 등록된 도메인은 DNS 조회 없이 즉시 IP로 변환됩니다. 로컬 시스템에서만 유효한 매핑입니다.

**개발 및 테스트:**
운영 서버에 영향 없이 로컬에서 도메인을 테스트할 수 있습니다. 예: 새 서버의 IP를 미리 hosts에 등록하여 테스트합니다.

**광고 차단:**
광고 도메인을 127.0.0.1로 매핑하여 차단합니다. 악성 사이트 접근을 방지합니다.

**우회 접근:**
DNS 문제 발생 시 임시로 IP를 직접 지정합니다.

**우선순위:**

**hosts 파일이 DNS보다 우선합니다.**

**조회 순서:**
1. 애플리케이션이 도메인 이름 해석을 요청합니다
2. 운영체제가 hosts 파일을 먼저 확인합니다
3. hosts 파일에 매핑이 있으면 즉시 해당 IP를 반환합니다
4. hosts 파일에 없으면 DNS 조회를 수행합니다
5. DNS 캐시 확인 후 DNS 서버에 쿼리합니다

**전체 이름 해석 순서:**
hosts 파일 → DNS 캐시 → DNS 리졸버 → 권한 DNS 서버

**장점:**

**빠른 해석:**
DNS 네트워크 조회 없이 즉시 IP를 얻습니다. 지연 시간이 거의 없습니다.

**완전한 제어:**
로컬 시스템에서 어떤 도메인도 원하는 IP로 매핑할 수 있습니다.

**DNS 독립성:**
DNS 서버 장애 시에도 hosts 파일의 매핑은 동작합니다.

**단점:**

**수동 관리:**
모든 컴퓨터에서 개별적으로 편집해야 합니다. 중앙 집중 관리가 불가능합니다.

**확장성 부족:**
대량의 도메인을 관리하기 어렵습니다.

**동기화 문제:**
IP 주소가 변경되면 모든 시스템의 hosts 파일을 수동으로 업데이트해야 합니다.

**캐시 없음:**
hosts 파일은 매번 읽히므로 TTL 개념이 없습니다.

**실무 활용:**

**개발 환경:**
```
127.0.0.1    dev.example.com
192.168.1.100    staging.example.com
```
로컬 개발 서버나 스테이징 서버를 편리하게 접근합니다.

**테스트:**
운영 DNS를 변경하기 전에 hosts 파일로 새 서버를 테스트합니다.

**보안:**
```
0.0.0.0    ads.example.com
0.0.0.0    malware.example.com
```
악성 사이트나 광고 서버를 차단합니다.

**주의사항:**

**권한 필요:**
hosts 파일 수정은 관리자 권한이 필요합니다. 보안상 중요한 파일이기 때문입니다.

**오타 위험:**
잘못된 IP를 입력하면 사이트 접속이 불가능해집니다. 정상 동작하지 않을 때 hosts 파일을 확인해야 합니다.

**보안 위협:**
악성 소프트웨어가 hosts 파일을 변조하여 피싱 사이트로 리다이렉트할 수 있습니다. 정기적으로 hosts 파일을 점검해야 합니다.

**캐시 이슈:**
hosts 파일 변경 후 DNS 캐시를 삭제해야 즉시 적용됩니다. Windows: ipconfig /flushdns. Linux: sudo systemd-resolve --flush-caches.

**IPv6 지원:**
IPv4와 IPv6 매핑을 모두 지정할 수 있습니다.
```
192.0.2.1       example.com
2001:db8::1     example.com
```

**무시되는 경우:**
일부 브라우저(Chrome 등)는 자체 DNS 캐시를 사용하여 hosts 파일을 우회할 수 있습니다. DoH(DNS over HTTPS)를 사용하면 hosts 파일이 무시될 수 있습니다.

**대안:**
대규모 환경에서는 내부 DNS 서버를 구축하는 것이 더 효율적입니다. 컨테이너 환경에서는 Docker의 DNS 또는 쿠버네티스의 CoreDNS를 사용합니다.

---

## 82. SOP 정책에 대해 설명해 주세요.

**SOP(Same-Origin Policy, 동일 출처 정책)**는 웹 브라우저의 핵심 보안 메커니즘으로, 한 출처의 스크립트가 다른 출처의 리소스에 접근하는 것을 제한합니다.

**출처(Origin)의 정의:**
출처는 **프로토콜(Scheme) + 호스트(Host) + 포트(Port)**의 조합입니다. 세 가지가 모두 동일해야 같은 출처로 간주됩니다.

**예시 - https://www.example.com:443/page 기준:**
- https://www.example.com:443/other → 같은 출처 (O)
- https://www.example.com/page → 같은 출처 (O, 포트 443 기본값)
- http://www.example.com → 다른 출처 (X, 프로토콜 다름)
- https://example.com → 다른 출처 (X, 호스트 다름)
- https://www.example.com:8080 → 다른 출처 (X, 포트 다름)
- https://api.example.com → 다른 출처 (X, 서브도메인 다름)

**SOP가 제한하는 것:**

**XMLHttpRequest와 Fetch API:**
다른 출처로 AJAX 요청을 보낼 수 없습니다. JavaScript로 응답을 읽을 수 없습니다.

**DOM 접근:**
다른 출처의 iframe 내부 DOM에 접근할 수 없습니다. window.opener로 부모 창에 접근하는 것도 제한됩니다.

**쿠키와 스토리지:**
다른 출처의 Cookie, LocalStorage, SessionStorage에 접근할 수 없습니다.

**SOP가 허용하는 것:**

**리소스 임베딩:**
다른 출처의 이미지, CSS, JavaScript를 로드할 수 있습니다. script, img, link, iframe 태그는 허용됩니다. 하지만 읽기는 제한될 수 있습니다.

**폼 전송:**
다른 출처로 form을 제출할 수 있습니다.

**리다이렉션:**
다른 출처로 이동할 수 있습니다.

**SOP의 필요성:**

**보안 위협 방지:**
악의적인 사이트가 사용자의 은행 사이트 데이터를 읽는 것을 방지합니다. 세션 하이재킹, CSRF 공격을 완화합니다.

**사용자 정보 보호:**
한 탭의 민감한 정보가 다른 탭의 스크립트에 노출되지 않습니다.

**실제 공격 시나리오 (SOP가 없다면):**

**1. 악의적 사이트 방문:**
사용자가 evil.com을 방문합니다. evil.com의 JavaScript가 실행됩니다.

**2. 은행 사이트 공격:**
JavaScript가 숨겨진 iframe으로 bank.com을 로드합니다. 사용자가 이미 bank.com에 로그인되어 있습니다. SOP 없이는 evil.com의 스크립트가 bank.com의 계좌 정보를 읽을 수 있습니다.

**3. 정보 탈취:**
은행 계좌 잔액, 거래 내역 등을 evil.com 서버로 전송합니다.

**SOP의 한계:**

**같은 출처의 공격:**
XSS(Cross-Site Scripting)처럼 같은 출처에서 악성 스크립트가 실행되면 SOP는 무력합니다.

**개발 불편:**
마이크로서비스, API 서버 등 정당한 교차 출처 통신도 막힙니다. 이를 해결하기 위해 CORS가 도입되었습니다.

**우회 기법:**

**JSONP:**
script 태그는 SOP 제한을 받지 않는 점을 이용합니다. 콜백 함수로 데이터를 전달합니다. 보안 문제로 더 이상 권장되지 않습니다.

**프록시 서버:**
같은 출처의 서버가 다른 출처 API를 대신 호출합니다. 브라우저 입장에서는 같은 출처 통신입니다.

**CORS:**
서버가 명시적으로 다른 출처의 접근을 허용합니다. Access-Control-Allow-Origin 헤더를 사용합니다.

**postMessage:**
다른 출처의 window 간 안전한 메시지 전달을 위한 API입니다.

**브라우저별 차이:**
대부분의 현대 브라우저는 SOP를 엄격하게 적용합니다. 일부 구형 브라우저는 느슨한 정책을 가질 수 있습니다.

**개발 시 주의사항:**
SOP 오류는 콘솔에 명확히 표시됩니다. 정당한 교차 출처 통신은 CORS를 구현해야 합니다. 로컬 개발 시 프록시나 CORS 플러그인을 사용할 수 있습니다.

---

## 83. CORS 정책이 무엇인가요?

**CORS(Cross-Origin Resource Sharing, 교차 출처 리소스 공유)**는 SOP의 제약을 완화하여 **다른 출처 간 안전한 리소스 공유**를 가능하게 하는 메커니즘입니다.

**필요성:**
SOP는 보안을 위해 필수적이지만, 정당한 교차 출처 통신도 막습니다. 프론트엔드(www.example.com)와 API 서버(api.example.com)가 다른 도메인일 때 통신이 필요합니다. CORS는 서버가 명시적으로 허용한 출처에만 접근을 허용합니다.

**동작 원리:**

**서버의 허가 헤더:**
서버가 HTTP 응답에 특별한 헤더를 포함하여 어떤 출처를 허용하는지 명시합니다. 브라우저가 이 헤더를 확인하고 접근을 허용하거나 차단합니다.

**주요 CORS 헤더:**

**Access-Control-Allow-Origin:**
어떤 출처를 허용할지 지정합니다.
```
Access-Control-Allow-Origin: https://www.example.com
Access-Control-Allow-Origin: *  (모든 출처 허용, 보안 위험)
```

**Access-Control-Allow-Methods:**
허용되는 HTTP 메서드를 지정합니다.
```
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

**Access-Control-Allow-Headers:**
허용되는 요청 헤더를 지정합니다.
```
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Access-Control-Allow-Credentials:**
쿠키나 인증 정보를 포함한 요청을 허용할지 지정합니다.
```
Access-Control-Allow-Credentials: true
```

**Access-Control-Max-Age:**
Preflight 응답을 캐시할 시간(초)을 지정합니다.
```
Access-Control-Max-Age: 86400
```

**단순 요청(Simple Request):**

**조건:**
- 메서드: GET, HEAD, POST 중 하나
- 헤더: Accept, Accept-Language, Content-Language, Content-Type만 사용
- Content-Type: application/x-www-form-urlencoded, multipart/form-data, text/plain 중 하나

**동작:**
1. 브라우저가 바로 실제 요청을 보냅니다
2. 요청에 Origin 헤더를 자동으로 추가합니다
3. 서버가 Access-Control-Allow-Origin 헤더와 함께 응답합니다
4. 브라우저가 헤더를 확인하고 응답을 JavaScript에 전달하거나 차단합니다

**Preflight 요청:**

**조건:**
단순 요청 조건을 만족하지 않는 경우. 사용자 정의 헤더를 사용하거나, PUT, DELETE 등의 메서드를 사용하거나, application/json Content-Type을 사용하는 경우.

**동작:**
1. 브라우저가 먼저 OPTIONS 메서드로 Preflight 요청을 보냅니다
2. 서버가 허용 정책을 헤더로 응답합니다
3. 브라우저가 허용 여부를 확인합니다
4. 허용되면 실제 요청(POST, PUT 등)을 보냅니다
5. 서버가 실제 응답을 반환합니다

**Preflight 예시:**

**Preflight 요청:**
```
OPTIONS /api/users HTTP/1.1
Origin: https://www.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

**Preflight 응답:**
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://www.example.com
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

**실제 요청:**
브라우저가 확인 후 실제 POST 요청을 보냅니다.

**인증 정보 포함:**

**Credentials 모드:**
JavaScript에서 fetch나 XMLHttpRequest 시 credentials 옵션을 설정합니다.
```
fetch(url, { credentials: 'include' })
```

**서버 응답:**
```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://www.example.com  (와일드카드 불가)
```

**와일드카드 제한:**
credentials: true일 때 Allow-Origin에 *를 사용할 수 없습니다. 보안상 정확한 출처를 명시해야 합니다.

**서버 구현 예시:**

**Node.js (Express):**
```
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://www.example.com');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
```

**Spring Boot:**
```
@CrossOrigin(origins = "https://www.example.com")
```

**보안 고려사항:**

**와일드카드 위험:**
Access-Control-Allow-Origin: *는 모든 출처를 허용하여 위험합니다. 공개 API가 아니면 사용하지 않아야 합니다.

**동적 출처 검증:**
요청의 Origin 헤더를 확인하고 허용 목록에 있을 때만 반영합니다.

**민감한 데이터:**
인증이 필요한 API는 credentials와 정확한 출처 지정을 함께 사용합니다.

**개발 환경:**
로컬 개발 시 프록시를 사용하거나 개발 서버에서 CORS를 느슨하게 설정합니다. 운영 환경에서는 엄격하게 제한합니다.

**문제 해결:**
CORS 오류는 브라우저 콘솔에 명확히 표시됩니다. 서버 응답 헤더를 확인하고 누락된 헤더를 추가합니다. Preflight 요청을 올바르게 처리하는지 확인합니다.

---

## 84. Preflight에 대해 설명해 주세요.

**Preflight 요청**은 CORS에서 실제 요청 전에 서버의 허가를 확인하는 **사전 검증 요청**입니다.

**목적:**
서버가 실제 요청을 처리하기 전에 해당 요청을 허용하는지 확인합니다. 서버에 부담을 주는 요청(POST, PUT, DELETE)을 사전 차단합니다. 보안과 성능을 동시에 고려한 메커니즘입니다.

**발생 조건:**

**1. 비표준 HTTP 메서드:**
GET, HEAD, POST 외의 메서드(PUT, DELETE, PATCH 등)를 사용할 때.

**2. 사용자 정의 헤더:**
Authorization, X-Custom-Header 같은 표준 외 헤더를 포함할 때.

**3. Content-Type:**
application/json, application/xml 등 특정 Content-Type을 사용할 때. application/x-www-form-urlencoded, multipart/form-data, text/plain은 단순 요청으로 분류됩니다.

**Preflight 요청 형식:**

**메서드:**
항상 OPTIONS 메서드를 사용합니다.

**헤더:**
```
OPTIONS /api/users HTTP/1.1
Host: api.example.com
Origin: https://www.example.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Content-Type, Authorization
```

**Access-Control-Request-Method:**
실제 요청에서 사용할 메서드를 알립니다.

**Access-Control-Request-Headers:**
실제 요청에서 사용할 헤더 목록을 알립니다.

**Preflight 응답 형식:**

**성공 응답:**
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://www.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

**거부 응답:**
CORS 헤더가 없거나 Origin을 허용하지 않으면 브라우저가 실제 요청을 차단합니다.

**전체 흐름:**

**1단계 - Preflight 요청:**
브라우저가 자동으로 OPTIONS 요청을 보냅니다. 개발자가 명시적으로 보내지 않아도 됩니다.

**2단계 - 서버 검증:**
서버가 요청된 메서드와 헤더를 허용하는지 확인합니다. 허용 정책을 응답 헤더에 포함합니다.

**3단계 - 브라우저 확인:**
브라우저가 서버 응답을 검토합니다. 허용되지 않으면 실제 요청을 보내지 않고 오류를 발생시킵니다.

**4단계 - 실제 요청:**
Preflight가 성공하면 원래 의도한 요청(DELETE, PUT 등)을 보냅니다.

**5단계 - 실제 응답:**
서버가 비즈니스 로직을 처리하고 결과를 반환합니다.

**캐싱:**

**Access-Control-Max-Age:**
Preflight 응답을 캐시할 시간(초)을 지정합니다.
```
Access-Control-Max-Age: 86400  (24시간)
```

**효과:**
같은 조건의 요청은 캐시 기간 동안 Preflight를 다시 보내지 않습니다. 네트워크 트래픽과 지연을 감소시킵니다.

**브라우저별 차이:**
Chrome: 2시간 기본 캐시, 최대 24시간. Firefox: 24시간 최대. Safari: 5분 기본.

**서버 구현:**

**OPTIONS 요청 처리:**
서버는 OPTIONS 메서드를 명시적으로 처리해야 합니다. 실제 비즈니스 로직을 실행하지 않고 CORS 헤더만 반환합니다.

**모든 라우트 대응:**
OPTIONS 요청은 모든 엔드포인트에 도착할 수 있으므로 공통 미들웨어에서 처리합니다.

**예시 - Express.js:**
```
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://www.example.com');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
});
```

**성능 최적화:**

**Max-Age 활용:**
긴 캐시 시간을 설정하여 Preflight 횟수를 줄입니다.

**단순 요청 사용:**
가능하면 단순 요청 조건을 만족하도록 설계합니다. Content-Type을 text/plain으로 보내고 서버에서 JSON으로 파싱하는 트릭도 있습니다.

**필요한 헤더만:**
불필요한 사용자 정의 헤더를 피합니다.

**문제 해결:**

**Preflight 실패:**
브라우저 콘솔에 명확한 오류 메시지가 표시됩니다. 서버가 OPTIONS 요청을 올바르게 처리하는지 확인합니다. 허용 헤더에 요청한 모든 헤더가 포함되어 있는지 확인합니다.

**네트워크 도구:**
Chrome DevTools의 Network 탭에서 OPTIONS 요청을 확인할 수 있습니다. Preflight와 실제 요청이 순차적으로 나타납니다.

**보안 의미:**
Preflight는 서버를 보호하는 메커니즘입니다. 악의적인 교차 출처 요청이 실제 데이터를 변경하기 전에 차단합니다. 하지만 서버가 허용하면 통과하므로, 서버 측 검증이 필수입니다.

**실무 권장:**
CORS를 올바르게 설정하여 Preflight를 통과시킵니다. Max-Age를 적절히 설정하여 성능을 최적화합니다. 서버 로그에서 OPTIONS 요청을 모니터링합니다.
