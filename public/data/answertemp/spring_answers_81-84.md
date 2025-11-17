# Spring 답변 81-84

## 질문 81: Spring WebFlux와 Spring MVC의 차이점 및 사용 시나리오는 무엇인가요?

Spring WebFlux는 리액티브 프로그래밍 모델을 기반으로 한 논블로킹 웹 프레임워크이고, Spring MVC는 전통적인 서블릿 기반의 블로킹 웹 프레임워크입니다.

**Spring MVC의 특징:**

첫째, 서블릿 기반입니다. Servlet API 위에서 동작합니다. 서블릿 컨테이너(Tomcat, Jetty 등)가 필요합니다. 각 요청을 스레드가 처리합니다.

둘째, 동기 블로킹 모델입니다. 요청을 처리하는 동안 스레드가 블로킹됩니다. I/O 작업을 기다리는 동안 스레드가 대기합니다. 스레드가 응답을 반환할 때까지 점유됩니다.

셋째, 스레드 풀 기반입니다. 동시 요청 수만큼 스레드가 필요합니다. 스레드 풀 크기가 처리량의 한계입니다. 많은 동시 연결을 처리하려면 많은 스레드가 필요합니다.

넷째, 간단하고 직관적입니다. 명령형 프로그래밍 모델입니다. 순차적으로 코드를 작성합니다. 디버깅과 이해가 쉽습니다.

**Spring WebFlux의 특징:**

첫째, 리액티브 스택입니다. Reactive Streams를 구현합니다. Reactor 라이브러리를 기반으로 합니다. Netty, Undertow 같은 논블로킹 서버에서 동작합니다.

둘째, 논블로킹 모델입니다. 비동기 논블로킹 I/O를 사용합니다. 스레드가 I/O를 기다리지 않습니다. 이벤트 루프 방식으로 동작합니다. 적은 수의 스레드로 많은 요청을 처리합니다.

셋째, 리액티브 타입을 사용합니다. Mono는 0-1개의 요소를 비동기로 처리합니다. Flux는 0-N개의 요소를 비동기로 처리합니다. 스트림 방식으로 데이터를 처리합니다. 백프레셔를 지원합니다.

넷째, 함수형 엔드포인트를 지원합니다. RouterFunction으로 라우팅을 정의합니다. HandlerFunction으로 요청을 처리합니다. 어노테이션 기반도 여전히 사용 가능합니다.

**주요 차이점:**

첫째, 동시성 모델입니다. MVC는 스레드 풀로 동시성을 처리합니다. 요청당 스레드 모델입니다. WebFlux는 이벤트 루프로 동시성을 처리합니다. 소수의 스레드로 많은 요청을 처리합니다. CPU 코어 수만큼의 스레드만 필요합니다.

둘째, API 스타일입니다. MVC는 명령형입니다. 순차적으로 실행됩니다. WebFlux는 선언형입니다. 데이터 흐름을 정의합니다.

셋째, 데이터베이스 지원입니다. MVC는 JDBC, JPA를 사용합니다. 블로킹 방식입니다. WebFlux는 R2DBC, Reactive MongoDB를 사용합니다. 논블로킹 방식입니다. 리액티브 드라이버가 필요합니다.

넷째, 서버입니다. MVC는 Tomcat이 기본입니다. 서블릿 컨테이너입니다. WebFlux는 Netty가 기본입니다. 논블로킹 서버입니다. Tomcat, Jetty, Undertow도 지원합니다.

**성능 특성:**

MVC는 적은 수의 동시 연결에서 효율적입니다. CPU 집약적 작업에 적합합니다. 단순한 CRUD 작업에 충분합니다.

WebFlux는 많은 동시 연결에서 효율적입니다. I/O 집약적 작업에 적합합니다. 긴 연결을 유지하는 경우에 유리합니다. 마이크로서비스 간 통신에 적합합니다.

그러나 CPU 바운드 작업에서는 WebFlux가 더 느릴 수 있습니다. 리액티브 오버헤드가 있기 때문입니다. 블로킹 코드가 섞이면 성능이 떨어집니다.

**학습 곡선:**

MVC는 배우기 쉽습니다. 전통적인 프로그래밍 모델입니다. 스택 트레이스가 명확합니다.

WebFlux는 학습 곡선이 가파릅니다. 리액티브 프로그래밍 개념을 이해해야 합니다. 디버깅이 어렵습니다. 비동기 스택 트레이스가 복잡합니다.

**데이터 액세스:**

MVC는 Spring Data JPA를 사용합니다. 익숙하고 성숙한 기술입니다. 블로킹이지만 대부분의 경우 문제없습니다.

WebFlux는 R2DBC나 Reactive MongoDB를 사용해야 합니다. JPA를 사용하면 블로킹되어 이점이 사라집니다. 리액티브 드라이버가 아직 JPA만큼 성숙하지 않습니다.

**사용 시나리오:**

MVC를 선택해야 하는 경우는 다음과 같습니다. 전통적인 CRUD 애플리케이션입니다. 데이터베이스 중심 애플리케이션입니다. 팀이 리액티브에 익숙하지 않습니다. 블로킹 라이브러리를 많이 사용합니다. 간단하고 빠른 개발이 우선입니다.

WebFlux를 선택해야 하는 경우는 다음과 같습니다. 많은 동시 연결이 필요합니다. 실시간 스트리밍 애플리케이션입니다. 마이크로서비스 간 비동기 통신이 많습니다. 외부 API를 많이 호출합니다. 백프레셔가 필요합니다. 이벤트 기반 아키텍처입니다.

**혼용 가능성:**

하나의 애플리케이션에서 MVC와 WebFlux를 함께 사용할 수 없습니다. 둘 중 하나를 선택해야 합니다. 서로 다른 런타임 모델이기 때문입니다.

하지만 마이크로서비스 아키텍처에서는 서비스마다 다르게 선택할 수 있습니다. 적합한 기술을 각각 사용합니다.

**WebClient:**

WebFlux 환경이 아니어도 WebClient를 사용할 수 있습니다. MVC 애플리케이션에서 리액티브 클라이언트를 사용합니다. 외부 API 호출을 논블로킹으로 처리합니다. RestTemplate보다 성능이 좋고 기능이 풍부합니다.

**실무 권장사항:**

대부분의 경우 MVC로 충분합니다. 복잡도를 추가할 필요가 없습니다. 성능 문제가 실제로 발생했을 때 WebFlux를 고려합니다.

처음부터 WebFlux로 시작하지 마세요. 팀이 리액티브에 익숙해진 후 도입합니다. 작은 서비스부터 시작하여 경험을 쌓습니다.

WebClient는 적극적으로 사용하세요. MVC 환경에서도 외부 API 호출에 유용합니다. RestTemplate을 대체할 수 있습니다.

**결론:**

WebFlux는 모든 경우에 MVC보다 나은 것이 아닙니다. 특정 사용 사례에서 이점이 있습니다. 많은 동시 연결과 I/O 집약적 작업에 적합합니다. 하지만 복잡도가 높아집니다. 신중하게 선택해야 합니다.

## 질문 82: Spring에서 비동기 처리(Asynchronous Processing)를 구현하는 방법에 대해 설명해주세요.

비동기 처리는 시간이 오래 걸리는 작업을 별도의 스레드에서 실행하여 메인 스레드를 블로킹하지 않는 기법입니다. Spring은 다양한 비동기 처리 방법을 제공합니다.

**비동기 처리가 필요한 이유:**

첫째, 응답 시간 단축입니다. 사용자는 빠른 응답을 받습니다. 긴 작업이 완료될 때까지 기다리지 않습니다. 사용자 경험이 향상됩니다.

둘째, 리소스 효율성입니다. 요청 처리 스레드를 빠르게 반환합니다. 더 많은 요청을 처리할 수 있습니다. 스레드 풀 고갈을 방지합니다.

셋째, 병렬 처리입니다. 여러 작업을 동시에 실행할 수 있습니다. 전체 처리 시간이 단축됩니다.

**@Async 어노테이션:**

가장 간단한 비동기 처리 방법입니다.

첫째, @EnableAsync로 활성화합니다. 설정 클래스에 어노테이션을 붙입니다. Spring이 @Async를 인식하기 시작합니다.

둘째, @Async를 메서드에 붙입니다. 해당 메서드가 비동기로 실행됩니다. 별도의 스레드에서 실행됩니다. 호출자는 즉시 반환됩니다.

셋째, 반환 타입을 고려합니다. void면 결과를 기다리지 않습니다. 단순히 실행만 합니다. Future를 반환하면 결과를 나중에 받을 수 있습니다. get 메서드로 결과를 기다립니다. CompletableFuture를 반환하면 더 유연한 비동기 처리가 가능합니다. 콜백, 조합, 예외 처리 등을 할 수 있습니다.

**TaskExecutor 설정:**

@Async는 기본 TaskExecutor를 사용합니다. SimpleAsyncTaskExecutor가 기본입니다. 매 요청마다 새 스레드를 생성합니다. 스레드 풀을 사용하지 않아 비효율적입니다.

커스텀 Executor를 정의하는 것이 좋습니다. ThreadPoolTaskExecutor Bean을 만듭니다. 코어 풀 사이즈, 최대 풀 사이즈, 큐 용량을 설정합니다. 스레드 이름 접두사를 지정하여 디버깅을 돕습니다.

AsyncConfigurer를 구현하여 기본 Executor를 지정할 수 있습니다. getAsyncExecutor 메서드를 오버라이드합니다.

여러 Executor를 정의하고 @Async에서 이름으로 지정할 수 있습니다. 작업 유형별로 다른 Executor를 사용합니다.

**예외 처리:**

@Async 메서드에서 발생한 예외는 호출자에게 전파되지 않습니다. 별도의 스레드에서 실행되기 때문입니다.

void 반환 메서드는 AsyncUncaughtExceptionHandler를 사용합니다. AsyncConfigurer의 getAsyncUncaughtExceptionHandler를 구현합니다. 예외를 로깅하거나 알림을 전송합니다.

Future 반환 메서드는 get 호출 시 ExecutionException으로 예외를 받습니다. try-catch로 처리합니다.

CompletableFuture는 exceptionally나 handle로 예외를 처리합니다. 체이닝 방식으로 우아하게 처리할 수 있습니다.

**프록시 방식의 한계:**

@Async는 AOP 프록시로 동작합니다. 같은 클래스 내부에서 메서드를 호출하면 비동기가 적용되지 않습니다. self-invocation 문제입니다. 다른 Bean을 통해 호출해야 합니다.

public 메서드에만 적용됩니다. private나 protected 메서드는 프록시할 수 없습니다.

**DeferredResult와 Callable:**

컨트롤러에서 비동기 응답을 반환할 수 있습니다.

Callable을 반환하면 요청 처리 스레드를 즉시 해제합니다. Callable은 별도 스레드에서 실행됩니다. 완료되면 응답을 반환합니다. 타임아웃을 설정할 수 있습니다.

DeferredResult를 반환하면 더 유연합니다. 임의의 스레드에서 결과를 설정할 수 있습니다. 이벤트나 메시지를 받았을 때 응답을 완료합니다. Long Polling에 적합합니다.

**CompletableFuture 활용:**

Java 8의 CompletableFuture를 적극 활용합니다.

여러 비동기 작업을 조합할 수 있습니다. thenCombine으로 두 Future를 결합합니다. thenCompose로 순차적으로 실행합니다. allOf로 모든 Future가 완료될 때까지 기다립니다. anyOf로 하나라도 완료되면 진행합니다.

콜백을 등록할 수 있습니다. thenApply로 결과를 변환합니다. thenAccept로 결과를 소비합니다. thenRun으로 다음 작업을 실행합니다.

**@Scheduled와 비동기:**

@Scheduled 메서드에 @Async를 함께 사용할 수 있습니다. 스케줄된 작업이 비동기로 실행됩니다. 이전 실행이 완료되지 않아도 다음 실행이 시작될 수 있습니다.

주의점은 동시 실행 문제입니다. 같은 작업이 중복 실행될 수 있습니다. 분산 락이나 단일 스레드 Executor로 방지합니다.

**이벤트와 비동기:**

@EventListener에 @Async를 사용할 수 있습니다. 이벤트 처리가 비동기로 실행됩니다. 이벤트 발행자는 블로킹되지 않습니다.

주의점은 트랜잭션입니다. 비동기 리스너는 별도 트랜잭션에서 실행됩니다. 데이터 일관성을 고려해야 합니다.

**WebFlux의 비동기:**

WebFlux는 기본적으로 비동기입니다. @Async가 필요 없습니다. Mono와 Flux가 비동기 스트림입니다. 선언적으로 비동기 파이프라인을 구성합니다.

**메시징과 비동기:**

Kafka, RabbitMQ 등의 메시징 시스템을 사용합니다. 완전한 비동기 처리가 가능합니다. 프로듀서와 컨슈머가 독립적으로 동작합니다. 시스템 간 결합도가 낮아집니다.

**스레드 풀 크기 결정:**

코어 풀 사이즈는 CPU 코어 수를 기준으로 합니다. I/O 바운드 작업은 코어 수의 2배 이상으로 설정합니다. CPU 바운드 작업은 코어 수와 비슷하게 설정합니다.

최대 풀 사이즈는 시스템이 견딜 수 있는 최대치입니다. 너무 크면 메모리 문제가 발생합니다. 너무 작으면 큐가 가득 찹니다.

큐 용량은 버퍼 역할을 합니다. 일시적인 부하 증가를 흡수합니다. 무제한 큐는 메모리 문제를 일으킬 수 있습니다.

**거부 정책:**

큐가 가득 찬 경우의 처리 방식입니다. AbortPolicy는 예외를 던집니다. 기본 정책입니다. CallerRunsPolicy는 호출 스레드에서 실행합니다. 속도를 늦춥니다. DiscardPolicy는 조용히 버립니다. DiscardOldestPolicy는 가장 오래된 작업을 버립니다.

**모니터링:**

스레드 풀 상태를 모니터링해야 합니다. 활성 스레드 수, 큐 크기, 완료된 작업 수를 추적합니다. Micrometer로 메트릭을 수집합니다. 스레드 풀이 포화되면 알림을 받습니다.

**주의사항:**

첫째, 트랜잭션 컨텍스트가 전파되지 않습니다. 비동기 메서드는 별도의 트랜잭션을 가집니다. 필요하면 새로운 트랜잭션을 시작해야 합니다.

둘째, SecurityContext가 전파되지 않습니다. 기본적으로 인증 정보를 사용할 수 없습니다. DelegatingSecurityContextAsyncTaskExecutor를 사용하여 전파할 수 있습니다.

셋째, ThreadLocal 변수가 공유되지 않습니다. 요청 스레드의 ThreadLocal은 비동기 스레드에서 접근할 수 없습니다. 명시적으로 전달해야 합니다.

**테스트:**

비동기 메서드를 테스트할 때는 결과를 기다려야 합니다. Future의 get을 호출하거나 CountDownLatch를 사용합니다. Awaitility 라이브러리가 유용합니다.

**실무 팁:**

간단한 비동기는 @Async로 충분합니다. 복잡한 조합은 CompletableFuture를 사용합니다. 시스템 간 비동기는 메시징을 사용합니다. 스레드 풀을 적절히 튜닝합니다. 모니터링과 알림을 설정합니다.

비동기 처리는 성능과 사용자 경험을 크게 향상시킬 수 있습니다. 하지만 복잡도가 증가하므로 신중하게 적용해야 합니다.

## 질문 83: Logback을 이용한 Spring Boot의 로깅 설정과 관리 방법은 무엇인가요?

Logback은 Log4j의 후속으로 개발된 로깅 프레임워크이며, Spring Boot의 기본 로깅 구현체입니다. SLF4J 파사드를 통해 사용됩니다.

**로깅의 중요성:**

첫째, 문제 진단입니다. 애플리케이션 동작을 추적합니다. 에러 발생 시 원인을 파악합니다. 프로덕션 환경에서 디버깅합니다.

둘째, 모니터링입니다. 시스템 상태를 실시간으로 파악합니다. 비정상적인 동작을 조기에 발견합니다. 성능 메트릭을 수집합니다.

셋째, 감사(Audit)입니다. 누가 언제 무엇을 했는지 기록합니다. 보안 사고 조사에 활용합니다. 규정 준수를 증명합니다.

**로그 레벨:**

TRACE는 가장 상세한 레벨입니다. 모든 실행 흐름을 기록합니다. 개발 중 일시적으로 사용합니다.

DEBUG는 디버깅 정보입니다. 변수 값, 메서드 호출 등을 기록합니다. 개발 환경에서 주로 사용합니다.

INFO는 일반 정보입니다. 애플리케이션의 중요한 이벤트를 기록합니다. 프로덕션의 기본 레벨입니다.

WARN은 경고입니다. 잠재적인 문제를 나타냅니다. 당장은 문제없지만 주의가 필요합니다.

ERROR는 에러입니다. 오류가 발생했지만 애플리케이션은 계속 실행됩니다. 즉각적인 조치가 필요합니다.

레벨을 설정하면 그 이상의 레벨만 출력됩니다. INFO로 설정하면 DEBUG와 TRACE는 출력되지 않습니다.

**Spring Boot의 기본 설정:**

spring-boot-starter-logging이 자동으로 포함됩니다. Logback, SLF4J, Log4j to SLF4J, JUL to SLF4J가 함께 들어옵니다. 모든 로깅 API를 SLF4J로 브리징합니다.

기본 로그 레벨은 INFO입니다. 콘솔에 출력됩니다. 파일에는 기본적으로 출력되지 않습니다.

**application.properties로 설정:**

간단한 설정은 application.properties로 할 수 있습니다.

logging.level.root로 전체 로그 레벨을 설정합니다. logging.level.패키지명으로 패키지별 레벨을 설정합니다. 예를 들어 logging.level.com.myapp=DEBUG로 지정합니다.

logging.file.name으로 로그 파일 이름을 지정합니다. logging.file.path로 로그 파일 경로를 지정합니다. 둘 중 하나만 사용합니다.

logging.pattern.console로 콘솔 출력 패턴을 변경합니다. logging.pattern.file로 파일 출력 패턴을 변경합니다.

**logback-spring.xml 설정:**

복잡한 설정은 XML 파일로 합니다. src/main/resources에 logback-spring.xml을 생성합니다. logback.xml 대신 logback-spring.xml을 사용하는 것이 좋습니다. Spring Boot의 확장 기능을 사용할 수 있습니다.

**Appender 설정:**

Appender는 로그를 어디에 출력할지 정의합니다.

ConsoleAppender는 콘솔에 출력합니다. 표준 출력이나 표준 에러로 보냅니다.

FileAppender는 파일에 출력합니다. 단일 파일에 계속 추가합니다.

RollingFileAppender는 파일을 롤링합니다. 크기나 날짜 기반으로 새 파일을 생성합니다. 오래된 파일은 압축하거나 삭제합니다. 프로덕션에서 주로 사용합니다.

**RollingPolicy:**

TimeBasedRollingPolicy는 시간 기반 롤링입니다. 매일, 매시간 등으로 새 파일을 생성합니다. 파일 이름 패턴에 날짜를 포함합니다. maxHistory로 보관 기간을 설정합니다.

SizeAndTimeBasedRollingPolicy는 크기와 시간을 함께 고려합니다. 일정 크기를 초과하거나 시간이 지나면 롤링합니다. 더 세밀한 제어가 가능합니다.

**패턴 레이아웃:**

로그 메시지의 형식을 지정합니다.

%d는 날짜와 시간입니다. 형식을 지정할 수 있습니다.

%thread는 스레드 이름입니다.

%level 또는 %-5level은 로그 레벨입니다. 5자리로 정렬합니다.

%logger는 로거 이름입니다. 보통 클래스명입니다. %logger{36}으로 길이를 제한할 수 있습니다.

%msg는 로그 메시지입니다.

%n은 줄바꿈입니다.

%ex는 예외 스택 트레이스입니다.

컬러를 추가할 수도 있습니다. %clr로 감쌉니다.

**프로파일별 설정:**

springProfile 태그로 프로파일별 설정을 분리합니다. 개발 환경에서는 DEBUG 레벨로 콘솔에 출력합니다. 프로덕션에서는 INFO 레벨로 파일에 출력합니다.

**MDC(Mapped Diagnostic Context):**

스레드별로 컨텍스트 정보를 저장합니다. MDC.put으로 키-값을 저장합니다. 로그 패턴에 %X{키}로 값을 출력합니다. 요청 ID, 사용자 ID 등을 추적하는 데 유용합니다.

Filter나 Interceptor에서 MDC에 정보를 넣습니다. 모든 로그에 자동으로 포함됩니다. 요청 종료 시 MDC.clear로 정리합니다.

**비동기 로깅:**

AsyncAppender로 비동기 로깅을 구현합니다. 로깅을 별도 스레드에서 처리합니다. 애플리케이션 성능에 영향을 줄입니다. 큐 크기와 거부 정책을 설정합니다.

주의점은 애플리케이션 종료 시 큐의 로그가 유실될 수 있습니다. ShutdownHook으로 처리합니다.

**구조화된 로깅:**

JSON 형태로 로그를 출력합니다. logstash-logback-encoder를 사용합니다. 각 로그가 JSON 객체가 됩니다. Elasticsearch, Logstash, Kibana(ELK) 스택과 통합하기 좋습니다. 로그를 쿼리하고 분석하기 쉽습니다.

**로그 레벨 동적 변경:**

Actuator의 /loggers 엔드포인트를 사용합니다. 런타임에 로그 레벨을 조회하고 변경할 수 있습니다. 재시작 없이 디버깅할 수 있습니다. POST 요청으로 특정 패키지의 레벨을 변경합니다.

**민감 정보 마스킹:**

비밀번호, 신용카드 번호 등을 로그에 남기지 않습니다. 커스텀 Filter나 Converter를 만듭니다. 정규표현식으로 민감 정보를 감지하고 마스킹합니다. 보안과 규정 준수에 중요합니다.

**성능 고려사항:**

로깅은 성능에 영향을 줍니다. 너무 많은 로그는 I/O 부하를 증가시킵니다. 적절한 로그 레벨을 설정합니다. 프로덕션에서는 DEBUG를 사용하지 않습니다.

조건부 로깅을 사용합니다. isDebugEnabled로 레벨을 확인한 후 로그를 남깁니다. 문자열 연결 비용을 절약합니다. SLF4J의 파라미터 치환을 사용합니다. 로그 레벨이 낮으면 문자열이 생성되지 않습니다.

**중앙 집중식 로깅:**

여러 서버의 로그를 한 곳에 모읍니다. ELK 스택을 많이 사용합니다. Filebeat나 Logstash가 로그 파일을 수집합니다. Elasticsearch에 저장합니다. Kibana로 시각화하고 검색합니다.

Splunk, Datadog 같은 상용 솔루션도 있습니다.

**알림 설정:**

특정 에러 발생 시 알림을 전송합니다. 커스텀 Appender를 만듭니다. ERROR 레벨 로그를 Slack이나 이메일로 전송합니다. 즉각적인 대응이 가능합니다.

**로그 보관 정책:**

디스크 공간을 고려하여 보관 기간을 설정합니다. 오래된 로그는 압축합니다. 일정 기간 후 삭제합니다. 법적 요구사항이 있으면 장기 보관합니다.

**실무 권장사항:**

의미 있는 로그 메시지를 작성합니다. 컨텍스트 정보를 포함합니다. 로그 레벨을 올바르게 선택합니다. 예외는 스택 트레이스와 함께 로깅합니다. 민감 정보를 로그에 남기지 않습니다. 로그를 정기적으로 검토하고 모니터링합니다.

로깅은 애플리케이션 운영에 필수적입니다. Logback의 강력한 기능을 활용하여 효과적으로 로그를 관리해야 합니다.

## 질문 84: HttpMessageConverter의 역할과 Spring에서의 메시지 변환 과정을 설명해주세요.

HttpMessageConverter는 HTTP 요청과 응답의 바디를 자바 객체로 변환하거나 자바 객체를 HTTP 바디로 변환하는 역할을 합니다. Spring MVC와 WebFlux에서 RESTful API 개발의 핵심 컴포넌트입니다.

**HttpMessageConverter의 필요성:**

첫째, 자동 직렬화와 역직렬화입니다. 개발자가 수동으로 JSON이나 XML을 파싱할 필요가 없습니다. 자바 객체와 HTTP 메시지 간 변환이 자동으로 이루어집니다. 생산성이 크게 향상됩니다.

둘째, 다양한 형식 지원입니다. JSON, XML, Form, Text 등 다양한 형식을 처리합니다. 클라이언트와 서버가 원하는 형식을 협상합니다. Content-Type과 Accept 헤더를 기반으로 합니다.

셋째, 확장성입니다. 커스텀 Converter를 추가할 수 있습니다. 새로운 형식을 쉽게 지원합니다. 기존 Converter를 커스터마이징할 수 있습니다.

**주요 HttpMessageConverter:**

첫째, MappingJackson2HttpMessageConverter입니다. JSON 변환을 담당합니다. Jackson 라이브러리를 사용합니다. 가장 많이 사용되는 Converter입니다. application/json 미디어 타입을 처리합니다.

둘째, StringHttpMessageConverter입니다. 문자열 변환을 담당합니다. text/plain 미디어 타입을 처리합니다. 간단한 텍스트 응답에 사용합니다.

셋째, FormHttpMessageConverter입니다. 폼 데이터 변환을 담당합니다. application/x-www-form-urlencoded를 처리합니다. MultiValueMap으로 매핑합니다.

넷째, ByteArrayHttpMessageConverter입니다. 바이트 배열 변환을 담당합니다. 파일 다운로드 등에 사용합니다. application/octet-stream을 처리합니다.

다섯째, Jaxb2RootElementHttpMessageConverter입니다. XML 변환을 담당합니다. JAXB 어노테이션을 사용합니다. application/xml을 처리합니다.

여섯째, ResourceHttpMessageConverter입니다. Resource 객체 변환을 담당합니다. 정적 파일 서빙에 사용합니다.

**요청 변환 과정(@RequestBody):**

첫째, 클라이언트가 HTTP 요청을 전송합니다. 바디에 JSON이나 XML 데이터를 포함합니다. Content-Type 헤더로 형식을 명시합니다.

둘째, DispatcherServlet이 요청을 받습니다. 핸들러(컨트롤러)를 찾습니다. RequestMappingHandlerAdapter가 핸들러를 실행합니다.

셋째, @RequestBody 파라미터를 발견합니다. RequestResponseBodyMethodProcessor가 처리합니다. Content-Type 헤더를 확인합니다.

넷째, 적절한 HttpMessageConverter를 선택합니다. 등록된 Converter 목록을 순회합니다. canRead 메서드로 처리 가능 여부를 확인합니다. 미디어 타입과 클래스 타입을 검사합니다. 처음으로 true를 반환하는 Converter를 사용합니다.

다섯째, read 메서드로 변환합니다. HTTP 바디를 읽습니다. 자바 객체로 역직렬화합니다. 파라미터로 전달합니다.

여섯째, 컨트롤러 메서드가 실행됩니다. 변환된 객체를 사용하여 비즈니스 로직을 처리합니다.

**응답 변환 과정(@ResponseBody):**

첫째, 컨트롤러 메서드가 객체를 반환합니다. @ResponseBody나 @RestController가 있으면 뷰가 아닌 데이터를 반환합니다.

둘째, RequestResponseBodyMethodProcessor가 처리합니다. Accept 헤더를 확인합니다. 클라이언트가 원하는 형식을 파악합니다.

셋째, 적절한 HttpMessageConverter를 선택합니다. canWrite 메서드로 처리 가능 여부를 확인합니다. 반환 타입과 미디어 타입을 검사합니다.

넷째, write 메서드로 변환합니다. 자바 객체를 직렬화합니다. HTTP 응답 바디에 씁니다. Content-Type 헤더를 설정합니다.

다섯째, 클라이언트가 응답을 받습니다. JSON이나 XML 형태의 데이터를 받습니다.

**Content Negotiation:**

클라이언트와 서버가 형식을 협상합니다.

Accept 헤더로 클라이언트가 원하는 형식을 명시합니다. application/json, application/xml 등을 나열합니다. 우선순위를 지정할 수 있습니다.

produces 속성으로 서버가 생성할 수 있는 형식을 명시합니다. @RequestMapping의 produces 속성입니다. 여러 형식을 지원할 수 있습니다.

ContentNegotiationManager가 협상을 담당합니다. 가장 적합한 미디어 타입을 결정합니다. 해당 타입을 처리하는 Converter를 선택합니다.

**커스텀 HttpMessageConverter:**

특수한 형식을 지원하려면 커스텀 Converter를 만들 수 있습니다.

AbstractHttpMessageConverter를 상속합니다. supports 메서드로 지원하는 클래스를 지정합니다. readInternal로 읽기 로직을 구현합니다. writeInternal로 쓰기 로직을 구현합니다.

WebMvcConfigurer를 구현합니다. configureMessageConverters 메서드로 Converter 목록을 대체합니다. 기본 Converter들이 사라집니다. extendMessageConverters 메서드로 Converter를 추가합니다. 기본 Converter들을 유지하면서 추가합니다. 이 방법이 더 안전합니다.

**Jackson 커스터마이징:**

Jackson의 동작을 커스터마이징할 수 있습니다.

ObjectMapper Bean을 등록합니다. 다양한 설정을 적용합니다. 날짜 형식, null 처리, 들여쓰기 등을 설정합니다.

@JsonProperty로 필드 이름을 변경합니다. @JsonIgnore로 필드를 제외합니다. @JsonFormat으로 형식을 지정합니다. @JsonSerialize와 @JsonDeserialize로 커스텀 직렬화를 구현합니다.

**Converter 우선순위:**

Converter 목록의 순서가 중요합니다. 먼저 등록된 Converter가 우선합니다. canRead나 canWrite가 true를 반환하는 첫 번째 Converter를 사용합니다.

커스텀 Converter를 앞에 추가하면 기본 Converter보다 우선합니다.

**에러 처리:**

변환 실패 시 HttpMessageNotReadableException이 발생합니다. JSON 파싱 에러, 타입 불일치 등이 원인입니다. @ExceptionHandler나 @ControllerAdvice로 처리합니다. 400 Bad Request와 의미 있는 에러 메시지를 반환합니다.

**성능 최적화:**

큰 객체는 직렬화/역직렬화 비용이 큽니다. 필요한 필드만 포함하도록 DTO를 설계합니다. @JsonView로 필드를 선택적으로 노출합니다.

ObjectMapper를 재사용합니다. 매번 생성하지 않고 싱글톤으로 관리합니다. Spring이 자동으로 Bean으로 등록합니다.

**스트리밍:**

대용량 데이터는 스트리밍으로 처리합니다. ResponseBodyEmitter를 사용합니다. 데이터를 조각내어 전송합니다. 클라이언트가 점진적으로 받습니다.

SseEmitter로 Server-Sent Events를 구현합니다. 실시간 푸시에 사용합니다.

**파일 업로드:**

MultipartFile로 파일 업로드를 처리합니다. MultipartResolver가 multipart 요청을 파싱합니다. HttpMessageConverter와는 별개의 메커니즘입니다.

**WebFlux에서의 메시지 변환:**

WebFlux는 HttpMessageReader와 HttpMessageWriter를 사용합니다. Reactive Streams를 지원합니다. Mono와 Flux를 직접 변환합니다. 논블로킹 방식으로 동작합니다.

**주의사항:**

순환 참조는 직렬화를 실패시킵니다. @JsonManagedReference와 @JsonBackReference로 해결합니다. DTO를 사용하여 순환 참조를 제거하는 것이 더 좋습니다.

민감 정보를 응답에 포함하지 않습니다. @JsonIgnore로 제외합니다. DTO에서 아예 포함하지 않습니다.

**테스트:**

MockMvc로 Converter를 테스트합니다. andExpect로 JSON 응답을 검증합니다. JsonPath로 특정 필드를 확인합니다. ObjectMapper로 객체를 JSON으로 변환하여 요청 바디에 포함합니다.

HttpMessageConverter는 RESTful API 개발을 편리하게 만드는 핵심 메커니즘입니다. 자동 변환 덕분에 개발자는 비즈니스 로직에 집중할 수 있습니다.
