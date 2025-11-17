# Spring 답변 53-56

## 질문 53: Java에서 Annotation은 어떤 기능을 하나요?

Annotation(어노테이션)은 Java 5부터 도입된 메타데이터 기능으로, 코드에 추가 정보를 제공하는 특별한 형태의 인터페이스입니다.

**기본 개념:**

Annotation은 @ 기호를 사용하여 표시합니다. 클래스, 메서드, 필드, 파라미터 등 다양한 요소에 붙일 수 있습니다. 컴파일러나 런타임에 추가 정보를 제공합니다.

코드의 동작을 직접 변경하지는 않습니다. 메타데이터로서 다른 도구나 프레임워크가 해석하고 처리합니다.

**주요 용도:**

첫째, 컴파일러에게 정보를 제공합니다. @Override는 메서드가 오버라이드됨을 명시하여 컴파일러가 검증합니다. @SuppressWarnings는 특정 경고를 무시하도록 합니다. @Deprecated는 더 이상 사용되지 않는 요소임을 표시합니다.

둘째, 빌드 도구나 배포 도구에 정보를 제공합니다. 컴파일 시점이나 배포 시점에 특정 작업을 수행하도록 합니다. Javadoc 생성, 코드 검증, 리소스 생성 등에 사용됩니다.

셋째, 런타임에 처리됩니다. 리플렉션을 통해 런타임에 어노테이션 정보를 읽을 수 있습니다. Spring, Hibernate 같은 프레임워크가 이를 활용합니다.

**표준 Annotation:**

@Override는 부모 클래스의 메서드를 오버라이드함을 명시합니다. @Deprecated는 더 이상 사용을 권장하지 않음을 표시합니다. @SuppressWarnings는 컴파일 경고를 억제합니다. @SafeVarargs는 제네릭 가변 인자에 대한 경고를 억제합니다. @FunctionalInterface는 함수형 인터페이스임을 명시합니다.

**Retention 정책:**

@Retention은 어노테이션이 유지되는 시점을 지정합니다.

RetentionPolicy.SOURCE는 소스 코드에만 존재하고 컴파일 후 사라집니다. @Override, @SuppressWarnings가 해당됩니다.

RetentionPolicy.CLASS는 클래스 파일에 포함되지만 런타임에는 사용할 수 없습니다. 기본값입니다.

RetentionPolicy.RUNTIME은 런타임에도 유지되어 리플렉션으로 접근할 수 있습니다. Spring, JPA의 어노테이션이 대부분 이것입니다.

**Target 정책:**

@Target은 어노테이션을 적용할 수 있는 위치를 지정합니다.

ElementType.TYPE은 클래스, 인터페이스, enum에 적용합니다. ElementType.FIELD는 필드에 적용합니다. ElementType.METHOD는 메서드에 적용합니다. ElementType.PARAMETER는 파라미터에 적용합니다. ElementType.CONSTRUCTOR는 생성자에 적용합니다. ElementType.LOCAL_VARIABLE은 로컬 변수에 적용합니다. ElementType.ANNOTATION_TYPE은 어노테이션에 적용합니다.

**속성(Attribute):**

어노테이션은 속성을 가질 수 있습니다. 메서드 형태로 정의되며 기본값을 지정할 수 있습니다. 속성이 하나이고 이름이 value면 생략할 수 있습니다.

**메타 어노테이션:**

어노테이션을 정의하기 위한 어노테이션입니다. @Retention, @Target, @Inherited, @Documented가 있습니다.

@Inherited는 하위 클래스가 어노테이션을 상속받도록 합니다. @Documented는 Javadoc에 포함되도록 합니다.

**커스텀 Annotation 생성:**

@interface 키워드로 정의합니다. 메타 어노테이션으로 동작을 지정합니다. 속성을 선언하여 정보를 전달할 수 있습니다.

프로세서나 리플렉션으로 읽어서 처리합니다.

**어노테이션 프로세서:**

컴파일 시점에 어노테이션을 처리하는 도구입니다. Lombok이 대표적인 예입니다. 코드를 생성하거나 검증할 수 있습니다. javax.annotation.processing.Processor 인터페이스를 구현합니다.

**장점:**

설정을 코드에 직접 명시하여 가독성이 높아집니다. XML 같은 외부 설정 파일이 필요 없습니다. 타입 안전성이 보장됩니다. IDE의 자동 완성과 검증을 받을 수 있습니다.

**단점:**

코드와 설정이 결합되어 분리하기 어렵습니다. 런타임 어노테이션은 리플렉션 비용이 있습니다. 과도한 사용은 코드를 복잡하게 만들 수 있습니다.

Annotation은 Java의 선언적 프로그래밍을 가능하게 하며, 프레임워크와 라이브러리의 핵심 기능이 되었습니다.

## 질문 54: 별 기능이 없는 것 같은데, 어떻게 Spring에서는 Annotation이 그렇게 많은 기능을 하는 걸까요?

Annotation 자체는 단순한 메타데이터이지만, Spring은 다양한 메커니즘을 통해 이를 강력한 기능으로 확장합니다.

**리플렉션 기반 처리:**

Spring은 런타임에 리플렉션으로 어노테이션을 읽습니다. Class.getAnnotation이나 Method.getAnnotation으로 어노테이션 정보를 가져옵니다. 어노테이션의 속성값을 읽어 동작을 결정합니다.

예를 들어 @RequestMapping의 value, method 속성을 읽어 URL 매핑을 생성합니다.

**BeanPostProcessor:**

Spring은 BeanPostProcessor를 통해 Bean 생성 과정에 개입합니다. 모든 Bean이 생성된 후 postProcessBeforeInitialization과 postProcessAfterInitialization가 호출됩니다.

이 과정에서 어노테이션을 검사하고 처리합니다. @Autowired를 찾아 의존성을 주입합니다. @PostConstruct를 찾아 초기화 메서드를 호출합니다.

**프록시 생성:**

Spring AOP는 어노테이션 기반으로 프록시를 생성합니다. @Transactional이 붙은 메서드를 찾아 트랜잭션 프록시로 감쌉니다. @Async를 찾아 비동기 프록시를 생성합니다. @Cacheable을 찾아 캐싱 프록시를 만듭니다.

프록시는 실제 메서드 호출 전후에 추가 로직을 실행합니다. 이를 통해 어노테이션이 마치 동작을 변경하는 것처럼 보입니다.

**컴포넌트 스캔:**

@ComponentScan이 지정된 패키지를 스캔합니다. @Component, @Service, @Repository, @Controller를 찾아 Bean으로 등록합니다. ClassPathScanningCandidateComponentProvider가 클래스패스를 탐색합니다.

ASM이나 Javassist로 클래스 파일을 빠르게 읽습니다. 어노테이션 메타데이터를 수집하여 BeanDefinition을 생성합니다.

**어노테이션 프로세싱:**

AnnotationConfigApplicationContext가 Java Config를 처리합니다. @Configuration 클래스를 찾아 CGLIB으로 프록시를 생성합니다. @Bean 메서드를 찾아 Bean을 등록합니다.

@Import, @ImportResource, @PropertySource 등을 처리하여 설정을 통합합니다.

**HandlerMapping과 HandlerAdapter:**

Spring MVC는 @RequestMapping을 특별히 처리합니다. RequestMappingHandlerMapping이 모든 Controller를 스캔합니다. @RequestMapping 메타데이터로 URL 매핑 테이블을 생성합니다.

RequestMappingHandlerAdapter가 실제 메서드를 호출합니다. @RequestParam, @PathVariable, @RequestBody 등을 처리하여 파라미터를 바인딩합니다. @ResponseBody를 보고 MessageConverter로 응답을 변환합니다.

**AspectJ 통합:**

@Aspect를 찾아 Aspect로 등록합니다. @Before, @After, @Around 등의 Advice를 수집합니다. Pointcut 표현식을 파싱하여 매칭할 메서드를 찾습니다.

AspectJ의 풍부한 표현력과 Spring의 프록시 메커니즘이 결합됩니다.

**메타 어노테이션:**

Spring은 메타 어노테이션을 지원합니다. 어노테이션에 붙은 어노테이션도 인식합니다. @RestController는 내부에 @Controller를 가져 컴포넌트 스캔에 포착됩니다.

커스텀 어노테이션을 만들어 @RequestMapping을 메타 어노테이션으로 사용할 수 있습니다.

**조건부 처리:**

@Conditional을 통해 조건에 따라 Bean 등록 여부를 결정합니다. Spring Boot의 자동 구성이 이를 활용합니다. @ConditionalOnClass, @ConditionalOnBean 등으로 세밀하게 제어합니다.

**프로파일:**

@Profile을 보고 환경에 따라 Bean을 선택적으로 등록합니다. dev, prod 등의 프로파일로 구성을 분리합니다.

**이벤트 처리:**

@EventListener를 찾아 이벤트 리스너로 등록합니다. ApplicationEventMulticaster가 이벤트를 전파합니다.

**검증:**

@Valid와 @Validated를 처리하여 Bean Validation을 수행합니다. MethodValidationPostProcessor가 파라미터와 반환값을 검증합니다.

**스케줄링:**

@Scheduled를 찾아 스케줄러에 등록합니다. ScheduledAnnotationBeanPostProcessor가 cron 표현식을 파싱하고 실행합니다.

**캐싱:**

@Cacheable, @CacheEvict, @CachePut을 처리합니다. CacheInterceptor가 프록시로 동작하여 캐시를 관리합니다.

**종합:**

Spring은 어노테이션을 단순한 마커가 아닌 설정과 동작의 명세로 사용합니다. 리플렉션, 프록시, BeanPostProcessor, 컴포넌트 스캔 등 다양한 메커니즘을 조합합니다. 어노테이션은 선언적이고 어노테이션 프로세서와 프레임워크가 실제 기능을 구현합니다.

결과적으로 개발자는 간단한 어노테이션만 붙이면 복잡한 설정과 구현이 자동으로 이루어집니다. 이것이 Spring이 어노테이션으로 강력한 기능을 제공하는 비결입니다.

## 질문 55: Lombok의 @Data를 잘 사용하지 않는 이유는 무엇일까요?

@Data는 편리하지만 여러 문제를 일으킬 수 있어 실무에서는 신중하게 사용하거나 피하는 경우가 많습니다.

**@Data가 생성하는 것:**

@Data는 여러 어노테이션의 조합입니다. @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor를 모두 포함합니다.

모든 필드에 대해 getter와 setter를 생성합니다. toString, equals, hashCode 메서드를 자동 생성합니다. final 필드에 대한 생성자를 만듭니다.

**문제점:**

첫째, 불필요한 setter가 생성됩니다. 모든 필드에 setter가 만들어져 불변 객체를 만들 수 없습니다. 엔티티의 핵심 필드를 외부에서 마음대로 변경할 수 있게 됩니다. 캡슐화가 깨지고 객체의 일관성을 유지하기 어렵습니다.

도메인 주도 설계(DDD)에서는 엔티티가 스스로 상태를 관리해야 하는데, setter는 이를 방해합니다.

둘째, 양방향 연관관계에서 문제가 발생합니다. @ToString이 양방향 참조를 따라가면 무한 루프에 빠집니다. StackOverflowError가 발생합니다. @ToString(exclude = ...)로 명시적으로 제외해야 합니다.

@EqualsAndHashCode도 마찬가지입니다. 연관 엔티티를 포함하면 무한 재귀나 성능 문제가 생깁니다.

셋째, JPA 엔티티에서의 문제입니다. @EqualsAndHashCode가 모든 필드를 사용하면 프록시와 비교 시 문제가 발생합니다. 지연 로딩된 필드에 접근하면 예상치 못한 쿼리가 실행됩니다.

equals와 hashCode는 ID 기반으로 구현하는 것이 일반적인데, @Data는 모든 필드를 사용합니다. 엔티티를 HashSet에 넣거나 HashMap의 키로 사용할 때 예상과 다르게 동작할 수 있습니다.

넷째, 명시성이 떨어집니다. 어떤 메서드가 생성되는지 코드에서 바로 보이지 않습니다. 특히 equals와 hashCode의 동작을 예측하기 어렵습니다. 코드 리뷰와 유지보수가 어렵습니다.

다섯째, 세밀한 제어가 불가능합니다. 특정 필드만 setter를 만들거나 제외하기 어렵습니다. equals와 hashCode의 로직을 커스터마이징하기 어렵습니다. toString의 포맷을 변경하기 어렵습니다.

**대안:**

@Getter와 @RequiredArgsConstructor 또는 @AllArgsConstructor를 사용합니다. 필요한 필드에만 @Setter를 개별적으로 붙입니다. 불변 객체로 만들어 setter 없이 생성자로만 초기화합니다.

@ToString과 @EqualsAndHashCode는 명시적으로 필드를 지정합니다. exclude나 of 속성으로 제어합니다. JPA 엔티티는 ID만 사용하도록 @EqualsAndHashCode(onlyExplicitlyIncluded = true)와 @EqualsAndHashCode.Include를 활용합니다.

@Builder를 사용하여 불변 객체를 쉽게 생성합니다. 빌더 패턴으로 가독성과 안전성을 높입니다.

**적합한 사용 사례:**

간단한 DTO나 VO에는 @Data를 사용해도 괜찮습니다. 연관관계가 없고 단순 데이터 전송이 목적인 경우입니다. 내부적으로만 사용되는 간단한 모델 클래스입니다.

테스트 코드의 픽스처 객체에는 편리합니다.

**JPA 엔티티 권장 패턴:**

@Getter만 붙입니다. 필요한 경우에만 특정 필드에 @Setter를 붙입니다. @NoArgsConstructor(access = AccessLevel.PROTECTED)로 JPA를 위한 기본 생성자를 만듭니다. @Builder를 추가하여 편리한 생성 방법을 제공합니다.

equals와 hashCode는 직접 구현하거나 ID 기반으로 구현합니다. toString은 @ToString(exclude = ...)로 연관 필드를 제외합니다.

**결론:**

@Data는 편리하지만 숨겨진 비용이 큽니다. 캡슐화 위반, 무한 루프, JPA 문제 등이 발생할 수 있습니다. 실무에서는 @Getter, @Builder, @NoArgsConstructor 등을 조합하여 명시적으로 제어하는 것이 권장됩니다. 간단한 DTO에만 @Data를 사용하고, 엔티티나 복잡한 도메인 객체는 피하는 것이 좋습니다.

## 질문 56: Tomcat이 정확히 어떤 역할을 하는 도구인가요?

Tomcat은 Apache Software Foundation에서 개발한 오픈소스 서블릿 컨테이너이자 경량 웹 애플리케이션 서버입니다.

**핵심 역할:**

첫째, 서블릿 컨테이너입니다. Java Servlet 스펙을 구현하여 서블릿을 실행합니다. HttpServletRequest와 HttpServletResponse를 생성하고 관리합니다. 서블릿의 생명주기(초기화, 서비스, 소멸)를 관리합니다.

Spring MVC의 DispatcherServlet도 Tomcat 위에서 실행되는 서블릿입니다.

둘째, JSP 엔진입니다. JSP 파일을 서블릿으로 컴파일합니다. Jasper 컴파일러가 JSP를 Java 코드로 변환하고 클래스로 컴파일합니다. 컴파일된 서블릿을 실행하여 동적 HTML을 생성합니다.

셋째, 웹 서버 기능을 제공합니다. HTTP 요청을 받아 처리합니다. 정적 리소스(HTML, CSS, JavaScript, 이미지)를 서빙합니다. HTTP 프로토콜을 구현하여 요청과 응답을 처리합니다.

하지만 완전한 웹 서버(Apache HTTP Server, Nginx)에 비해 정적 리소스 처리 성능은 낮습니다.

**아키텍처:**

Connector가 클라이언트의 HTTP 요청을 받습니다. 기본 포트는 8080입니다. HTTP/1.1, HTTP/2, AJP 프로토콜을 지원합니다.

Container가 요청을 처리합니다. Engine, Host, Context, Wrapper의 계층 구조를 가집니다. Engine은 전체 서블릿 엔진입니다. Host는 가상 호스트를 나타냅니다. Context는 웹 애플리케이션을 나타냅니다. Wrapper는 개별 서블릿을 나타냅니다.

**스레드 풀:**

Tomcat은 스레드 풀을 사용하여 동시 요청을 처리합니다. 각 요청은 풀의 스레드 하나에 할당됩니다. 기본 최대 스레드 수는 200개입니다. server.tomcat.threads.max로 조정할 수 있습니다.

요청이 끝나면 스레드는 풀로 반환되어 재사용됩니다.

**세션 관리:**

HTTP 세션을 생성하고 관리합니다. 세션 ID를 쿠키(JSESSIONID)로 전송합니다. 세션 데이터를 메모리나 파일에 저장합니다. 세션 타임아웃을 관리하여 만료된 세션을 정리합니다.

**클래스 로딩:**

각 웹 애플리케이션마다 독립적인 클래스 로더를 사용합니다. WEB-INF/classes와 WEB-INF/lib의 클래스와 라이브러리를 로드합니다. 애플리케이션 간 클래스 충돌을 방지합니다.

**배포:**

WAR(Web Application Archive) 파일을 배포할 수 있습니다. webapps 디렉토리에 WAR를 복사하면 자동으로 압축 해제되고 배포됩니다. 핫 디플로이먼트를 지원하여 서버 재시작 없이 애플리케이션을 업데이트할 수 있습니다.

**Spring Boot와의 관계:**

Spring Boot는 내장 Tomcat을 포함합니다. 별도의 Tomcat 설치 없이 JAR 파일만으로 실행 가능합니다. spring-boot-starter-web이 임베디드 Tomcat을 포함합니다.

Spring Boot가 Tomcat을 프로그래밍 방식으로 시작하고 설정합니다. application.properties로 Tomcat 설정을 조정할 수 있습니다.

**다른 서블릿 컨테이너와의 비교:**

Jetty는 Tomcat과 유사하지만 더 경량이고 임베디드 사용에 최적화되어 있습니다. Undertow는 Red Hat이 개발한 고성능 서버입니다. Spring Boot에서 쉽게 교체할 수 있습니다.

**WAS vs 서블릿 컨테이너:**

Tomcat은 서블릿 컨테이너이자 경량 WAS입니다. 완전한 Java EE 스펙을 구현하지는 않습니다. EJB, JMS 등의 기능은 없습니다.

WildFly, WebLogic, WebSphere는 전체 Java EE를 지원하는 완전한 WAS입니다.

**설정:**

server.xml로 서버 전체를 설정합니다. context.xml로 컨텍스트를 설정합니다. web.xml로 웹 애플리케이션을 설정합니다. Spring Boot에서는 대부분 application.properties로 설정합니다.

**모니터링:**

Manager 앱으로 배포된 애플리케이션을 관리할 수 있습니다. JMX로 런타임 정보를 모니터링할 수 있습니다. 로그를 통해 요청과 오류를 추적할 수 있습니다.

Tomcat은 Java 웹 애플리케이션의 실행 환경을 제공하는 핵심 인프라로, Spring 애플리케이션이 HTTP 요청을 받아 처리할 수 있게 하는 기반입니다.
