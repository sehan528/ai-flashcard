# Spring 답변 41-44

## 질문 41: @Aspect는 어떻게 동작하나요?

@Aspect는 Spring AOP에서 Aspect를 정의하기 위한 어노테이션으로, AspectJ 라이브러리의 기능을 활용하여 동작합니다.

**동작 원리:**

첫째, 컴포넌트 스캔 단계에서 @Aspect가 붙은 클래스를 찾습니다. @Component나 @Configuration과 함께 사용되어야 Spring Bean으로 등록됩니다.

둘째, Bean 생성 시 BeanPostProcessor가 Aspect 정보를 수집합니다. AnnotationAwareAspectJAutoProxyCreator가 @Aspect 클래스를 분석합니다. @Before, @After, @Around 같은 Advice 메서드들을 찾아서 메타데이터로 저장합니다.

셋째, Pointcut 표현식을 파싱합니다. execution, within, @annotation 같은 표현식을 해석하여 어떤 메서드에 적용할지 결정합니다. AspectJ의 Pointcut 파서를 사용합니다.

넷째, Bean 생성 후처리에서 프록시를 생성합니다. postProcessAfterInitialization 단계에서 Bean이 Pointcut에 매칭되는지 확인합니다. 매칭되면 프록시 객체를 생성합니다.

**프록시 생성 방식:**

JDK 동적 프록시는 인터페이스가 있는 경우 사용됩니다. java.lang.reflect.Proxy를 사용하여 런타임에 프록시 클래스를 생성합니다. InvocationHandler를 구현하여 메서드 호출을 가로챕니다.

CGLIB 프록시는 인터페이스가 없는 경우 사용됩니다. 바이트코드 조작으로 Target 클래스를 상속받는 프록시를 생성합니다. 메서드를 오버라이드하여 Advice를 적용합니다. final 클래스나 final 메서드는 프록시를 만들 수 없습니다.

**실행 흐름:**

클라이언트가 Bean을 호출하면 실제로는 프록시 객체를 호출합니다. 프록시는 등록된 Advice 체인을 실행합니다.

@Before Advice가 먼저 실행됩니다. @Around Advice가 있으면 proceed 메서드로 실제 메서드를 호출합니다. Target 메서드가 실행됩니다. @AfterReturning 또는 @AfterThrowing이 실행됩니다. @After Advice가 마지막에 실행됩니다.

**어드바이저(Advisor) 생성:**

각 Advice 메서드는 Advisor로 변환됩니다. Advisor는 Pointcut과 Advice를 결합한 것입니다. 여러 Advisor가 하나의 Aspect에서 생성될 수 있습니다.

@Order나 Ordered 인터페이스로 Aspect의 우선순위를 지정할 수 있습니다. 숫자가 작을수록 먼저 실행됩니다.

**컴파일 타임 vs 런타임:**

Spring AOP는 런타임 프록시 기반입니다. 컴파일 타임이나 클래스 로딩 시점이 아닌, 런타임에 프록시가 생성됩니다.

AspectJ의 컴파일 타임 위빙(CTW)이나 로드 타임 위빙(LTW)을 사용할 수도 있지만, Spring AOP의 기본은 런타임 프록시입니다.

**최적화:**

Spring은 Pointcut 매칭을 캐싱합니다. 한 번 분석한 결과를 재사용하여 성능을 높입니다.

불필요한 프록시 생성을 피합니다. Pointcut에 매칭되는 메서드가 없으면 프록시를 만들지 않습니다.

**제한사항:**

프록시 기반이므로 self-invocation 문제가 있습니다. 같은 클래스 내에서 this로 메서드를 호출하면 프록시를 거치지 않아 AOP가 적용되지 않습니다.

public 메서드만 프록시할 수 있습니다. CGLIB 방식에서도 private이나 final 메서드는 오버라이드할 수 없어 AOP가 적용되지 않습니다.

생성자 호출에는 적용할 수 없습니다. 필드 접근에도 적용할 수 없습니다.

**설정 요구사항:**

@EnableAspectJAutoProxy를 설정 클래스에 붙여야 합니다. Spring Boot는 자동으로 활성화합니다.

aspectjweaver 라이브러리가 필요합니다. Pointcut 표현식 파싱에 사용됩니다.

**디버깅:**

프록시 생성 여부를 확인하려면 AopUtils.isAopProxy를 사용합니다. 실제 Target 객체를 얻으려면 AopContext.currentProxy나 AopTestUtils를 사용합니다.

@Aspect는 Spring의 강력한 AOP 지원과 AspectJ의 풍부한 표현력을 결합하여, 선언적이고 모듈화된 방식으로 횡단 관심사를 처리할 수 있게 합니다.

## 질문 42: Spring 에서 Interceptor와 Servlet Filter에 대해 설명해 주세요.

Interceptor와 Filter는 모두 요청을 가로채서 전처리와 후처리를 수행하지만, 동작 위치와 기능에 차이가 있습니다.

**Servlet Filter:**

Filter는 Java Servlet 표준의 일부로 서블릿 컨테이너 레벨에서 동작합니다. DispatcherServlet 이전에 실행되며 Spring 컨텍스트 외부에서 동작합니다.

javax.servlet.Filter 인터페이스를 구현합니다. init, doFilter, destroy 메서드를 가집니다. web.xml이나 @WebFilter로 등록하거나 Spring Boot에서는 @Component로 Bean으로 등록할 수 있습니다.

요청과 응답의 ServletRequest, ServletResponse를 다룹니다. HttpServletRequest와 HttpServletResponse로 캐스팅하여 사용합니다.

FilterChain.doFilter로 다음 필터나 서블릿을 호출합니다. 여러 필터가 체인으로 연결됩니다.

**Interceptor:**

Interceptor는 Spring MVC의 구성요소로 Spring 컨텍스트 내부에서 동작합니다. DispatcherServlet이 Controller를 호출하기 전후에 실행됩니다.

HandlerInterceptor 인터페이스를 구현합니다. preHandle, postHandle, afterCompletion 메서드를 가집니다. WebMvcConfigurer의 addInterceptors로 등록합니다.

HttpServletRequest, HttpServletResponse뿐 아니라 Handler(Controller) 정보와 ModelAndView에 접근할 수 있습니다. Spring의 빈과 서비스를 주입받을 수 있습니다.

**실행 순서:**

요청이 들어오면 Filter가 먼저 실행됩니다. 그 다음 DispatcherServlet이 호출됩니다. Interceptor의 preHandle이 실행됩니다. Controller가 실행됩니다. Interceptor의 postHandle이 실행됩니다. View가 렌더링됩니다. Interceptor의 afterCompletion이 실행됩니다. 마지막으로 Filter의 후처리가 실행됩니다.

**Filter의 특징과 사용 사례:**

Spring과 무관하게 동작하므로 Spring 컨텍스트가 필요 없는 작업에 적합합니다. 인코딩 설정, XSS 방어, CORS 설정 같은 요청/응답 변환에 사용됩니다.

보안 처리가 대표적입니다. Spring Security가 Filter 기반으로 동작합니다. 인증과 인가를 DispatcherServlet 이전에 처리합니다.

로깅과 감사, 압축과 암호화, 정적 리소스 처리 등에 사용됩니다. 모든 요청에 적용되어야 하는 전역 설정에 적합합니다.

**Interceptor의 특징과 사용 사례:**

Spring MVC에 특화되어 있어 Spring의 기능을 활용할 수 있습니다. 컨트롤러 정보와 비즈니스 로직에 접근 가능합니다.

인증과 권한 검사를 세밀하게 제어할 수 있습니다. 특정 URL 패턴이나 컨트롤러에만 적용할 수 있습니다.

로깅과 성능 측정, 사용자 활동 추적에 적합합니다. Handler를 알 수 있어 어떤 컨트롤러가 호출되었는지 로깅할 수 있습니다.

공통 데이터 설정에 유용합니다. Model에 공통 속성을 추가하거나 세션 데이터를 준비할 수 있습니다.

**preHandle vs postHandle vs afterCompletion:**

preHandle은 컨트롤러 실행 전에 호출됩니다. false를 반환하면 이후 처리를 중단할 수 있습니다. 인증 체크와 전처리에 사용됩니다.

postHandle은 컨트롤러 실행 후 View 렌더링 전에 호출됩니다. ModelAndView를 조작할 수 있습니다. 예외가 발생하면 호출되지 않습니다.

afterCompletion은 View 렌더링 후 항상 호출됩니다. 예외 발생 여부와 관계없이 실행됩니다. 리소스 정리와 로깅에 사용됩니다.

**선택 기준:**

Spring에 독립적인 요청/응답 처리는 Filter를 사용합니다. 인코딩, 보안, CORS 같은 저수준 처리에 적합합니다.

Spring MVC에 특화된 처리는 Interceptor를 사용합니다. 컨트롤러와 관련된 비즈니스 로직, 세밀한 URL 제어에 적합합니다.

두 가지를 함께 사용할 수도 있습니다. 전역 설정은 Filter로, 비즈니스 로직 관련은 Interceptor로 분리합니다.

**AOP와의 비교:**

Filter와 Interceptor는 웹 요청에 특화되어 있습니다. AOP는 더 범용적이며 모든 Bean 메서드에 적용할 수 있습니다. 웹 레이어는 Interceptor로, 서비스 레이어는 AOP로 처리하는 것이 일반적입니다.

## 질문 43: 설명만 들어보면 인터셉터만 쓰는게 나아보이는데, 아닌가요? 필터는 어떤 상황에 사용 해야 하나요?

Interceptor가 강력해 보이지만 Filter만의 고유한 장점과 적합한 사용 사례가 있습니다.

**Filter가 필수적인 상황:**

첫째, Spring 컨텍스트 외부에서 처리해야 하는 경우입니다. DispatcherServlet에 도달하기 전에 처리해야 하는 작업이 있습니다. DispatcherServlet 자체에 문제가 있거나 예외가 발생해도 Filter는 동작합니다.

둘째, 요청과 응답의 본질적인 변경이 필요한 경우입니다. ServletRequest와 ServletResponse를 래핑하여 변경할 수 있습니다. 요청 본문을 여러 번 읽어야 하는 경우 CachedBodyHttpServletRequest로 래핑합니다. 응답을 캡처하거나 수정할 때 ResponseWrapper를 사용합니다.

**구체적인 사용 사례:**

인코딩 설정이 대표적입니다. CharacterEncodingFilter로 요청과 응답의 문자 인코딩을 설정합니다. 모든 요청에 일관되게 적용되어야 하므로 Filter가 적합합니다.

보안 처리는 Filter의 핵심 사용 사례입니다. Spring Security는 FilterChainProxy를 기반으로 동작합니다. 인증과 인가를 DispatcherServlet 이전에 처리하여 보안을 강화합니다. 인증되지 않은 요청이 컨트롤러에 도달하지 못하게 막습니다.

CORS 설정도 Filter로 처리합니다. CorsFilter가 Preflight 요청을 처리하고 적절한 헤더를 추가합니다. 모든 도메인의 요청에 대해 일관되게 적용되어야 합니다.

XSS 방어와 입력 검증을 Filter에서 수행합니다. 악의적인 스크립트나 SQL Injection을 조기에 차단합니다. 모든 입력에 대해 일괄적으로 필터링합니다.

로깅과 감사도 Filter가 유용합니다. 모든 HTTP 요청과 응답을 로깅합니다. Spring 컨텍스트 밖의 요청도 포착할 수 있습니다. 요청 시작부터 끝까지 전체 시간을 측정할 수 있습니다.

압축과 암호화 처리에도 사용됩니다. GZIPFilter로 응답을 압축합니다. 요청과 응답 본문을 암호화하거나 복호화합니다.

요청 본문 캐싱이 필요한 경우입니다. 요청 본문은 한 번만 읽을 수 있는데, Filter에서 래핑하면 여러 번 읽을 수 있게 합니다. 로깅과 비즈니스 로직에서 모두 본문에 접근해야 할 때 필수입니다.

**Interceptor로는 할 수 없는 것들:**

DispatcherServlet에 도달하지 못한 요청을 처리할 수 없습니다. 정적 리소스 요청은 DispatcherServlet을 거치지 않을 수 있어 Interceptor가 적용되지 않습니다.

ServletRequest와 Response를 래핑하여 변경할 수 없습니다. Interceptor는 이미 생성된 요청과 응답 객체를 받으므로 근본적인 변경이 어렵습니다.

Spring이 초기화되기 전의 요청을 처리할 수 없습니다. Filter는 서블릿 컨테이너 레벨에서 동작하여 더 일찍 개입할 수 있습니다.

**성능 측면:**

Filter는 모든 요청에 적용되므로 최소한으로 유지하는 것이 좋습니다. 무거운 작업은 Interceptor나 AOP로 미루는 것이 효율적입니다.

Interceptor는 Spring MVC 요청에만 적용되어 선택적으로 사용할 수 있습니다. URL 패턴으로 세밀하게 제어할 수 있어 불필요한 오버헤드를 줄입니다.

**조합 사용:**

실무에서는 Filter와 Interceptor를 함께 사용합니다. 전역적이고 저수준 처리는 Filter로, 비즈니스 로직과 밀접한 처리는 Interceptor로 분리합니다.

보안과 인코딩은 Filter로, 인증 후의 권한 체크와 로깅은 Interceptor로 처리하는 패턴이 일반적입니다.

**결론:**

Interceptor가 더 강력하고 편리하지만, Filter는 더 근본적이고 포괄적입니다. 각각의 특성을 이해하고 적절한 상황에 맞게 선택하는 것이 중요합니다.

## 질문 44: DispatcherServlet의 역할에 대해 설명해 주세요.

DispatcherServlet은 Spring MVC의 핵심 구성요소로, Front Controller 패턴을 구현하여 모든 HTTP 요청을 중앙에서 처리합니다.

**Front Controller 패턴:**

모든 요청이 하나의 진입점을 거쳐 처리됩니다. DispatcherServlet이 요청을 받아 적절한 Controller에 위임합니다. 공통 처리 로직을 중앙화하여 중복을 제거합니다.

**주요 역할:**

첫째, 요청 수신과 라우팅입니다. 클라이언트의 HTTP 요청을 받아 처리할 Handler(Controller)를 찾습니다. HandlerMapping을 사용하여 URL과 Controller 메서드를 매핑합니다.

둘째, Handler 실행입니다. HandlerAdapter를 통해 실제 Controller 메서드를 호출합니다. 다양한 타입의 Handler를 지원할 수 있습니다.

셋째, 뷰 렌더링입니다. Controller가 반환한 View 이름을 ViewResolver로 해석합니다. 실제 View 객체를 찾아 렌더링을 수행합니다.

넷째, 예외 처리입니다. HandlerExceptionResolver로 예외를 처리합니다. @ExceptionHandler나 @ControllerAdvice가 이 단계에서 동작합니다.

**요청 처리 흐름:**

클라이언트가 HTTP 요청을 보냅니다. Filter 체인을 거쳐 DispatcherServlet에 도달합니다.

DispatcherServlet은 HandlerMapping에 요청을 위임하여 Handler를 찾습니다. @RequestMapping 정보를 기반으로 매칭합니다. HandlerExecutionChain을 반환받습니다. 이는 Handler와 Interceptor 목록을 포함합니다.

Interceptor의 preHandle을 실행합니다. false가 반환되면 요청 처리를 중단합니다.

HandlerAdapter를 통해 Handler를 실행합니다. @RequestMapping 메서드를 호출하고 파라미터를 바인딩합니다. ModelAndView를 반환받습니다.

Interceptor의 postHandle을 실행합니다. ModelAndView를 조작할 수 있습니다.

ViewResolver를 사용하여 View를 해석합니다. 논리적 View 이름을 실제 View 객체로 변환합니다.

View를 렌더링합니다. Model 데이터를 View에 전달하여 HTML을 생성합니다.

Interceptor의 afterCompletion을 실행합니다. 예외 발생 여부와 관계없이 실행됩니다.

응답을 클라이언트에 반환합니다.

**주요 구성요소:**

HandlerMapping은 요청 URL을 Handler에 매핑합니다. RequestMappingHandlerMapping이 @RequestMapping을 처리합니다. BeanNameUrlHandlerMapping, SimpleUrlHandlerMapping 등 여러 구현체가 있습니다.

HandlerAdapter는 Handler를 실행합니다. RequestMappingHandlerAdapter가 @RequestMapping 메서드를 실행합니다. 파라미터 바인딩과 반환값 처리를 담당합니다.

ViewResolver는 논리적 View 이름을 실제 View로 해석합니다. InternalResourceViewResolver가 JSP를 처리합니다. ThymeleafViewResolver, FreeMarkerViewResolver 등이 있습니다.

HandlerExceptionResolver는 예외를 처리합니다. ExceptionHandlerExceptionResolver가 @ExceptionHandler를 처리합니다. ResponseStatusExceptionResolver, DefaultHandlerExceptionResolver 등이 있습니다.

**초기화 과정:**

서블릿 컨테이너가 DispatcherServlet을 초기화합니다. WebApplicationContext를 생성하고 Bean을 로드합니다. HandlerMapping, HandlerAdapter, ViewResolver 등의 전략 객체를 초기화합니다.

Spring Boot는 자동 구성으로 DispatcherServlet을 등록합니다. dispatcherServlet이라는 이름의 Bean으로 관리됩니다.

**멀티 DispatcherServlet:**

여러 DispatcherServlet을 등록할 수 있습니다. 서로 다른 URL 패턴에 매핑하여 독립적인 컨텍스트를 가질 수 있습니다. API와 웹 페이지를 분리하여 관리할 때 유용합니다.

**RESTful API 처리:**

@RestController는 응답을 JSON이나 XML로 변환합니다. HttpMessageConverter가 객체를 직렬화합니다. View를 거치지 않고 직접 응답 본문에 작성합니다.

**성능 최적화:**

DispatcherServlet은 초기화 시 전략 객체를 캐싱합니다. HandlerMapping 결과를 캐싱하여 반복 탐색을 피합니다. 비동기 요청 처리를 지원하여 스레드를 효율적으로 사용합니다.

DispatcherServlet은 Spring MVC의 중심으로, 요청 처리의 전체 흐름을 조율하고 다양한 구성요소를 통합하여 유연하고 확장 가능한 웹 애플리케이션을 가능하게 합니다.
