# Spring 답변 69-72

## 질문 69: Spring Boot의 자동 구성(Auto-Configuration) 원리에 대해 설명해주세요.

Spring Boot의 자동 구성은 개발자가 명시적으로 설정하지 않아도 클래스패스에 있는 라이브러리와 정의된 Bean을 분석하여 자동으로 애플리케이션을 설정하는 기능입니다.

**자동 구성의 핵심 메커니즘:**

첫째, @EnableAutoConfiguration 어노테이션입니다. @SpringBootApplication에 포함되어 있습니다. 자동 구성을 활성화하는 핵심 어노테이션입니다. Spring Boot가 자동으로 설정을 구성하도록 지시합니다.

둘째, spring.factories 파일입니다. META-INF 디렉토리 안에 위치합니다. 자동 구성 후보 클래스들을 나열합니다. Spring Boot가 이 파일을 읽어 자동 구성 클래스를 로드합니다. 수십 개에서 수백 개의 자동 구성 클래스가 등록되어 있습니다.

셋째, 자동 구성 클래스(@Configuration)입니다. 각 자동 구성은 별도의 Configuration 클래스로 정의됩니다. 조건부로 Bean을 등록합니다. 특정 조건이 만족될 때만 활성화됩니다.

**조건부 어노테이션:**

자동 구성은 다양한 조건 어노테이션을 사용하여 상황에 맞게 활성화됩니다.

첫째, @ConditionalOnClass입니다. 특정 클래스가 클래스패스에 존재할 때만 구성이 활성화됩니다. 예를 들어 JPA 관련 클래스가 있을 때만 JPA 자동 구성이 동작합니다. 라이브러리 존재 여부를 판단합니다.

둘째, @ConditionalOnMissingClass입니다. 특정 클래스가 없을 때만 활성화됩니다. 대체 구성을 제공할 때 사용합니다.

셋째, @ConditionalOnBean입니다. 특정 Bean이 이미 등록되어 있을 때만 활성화됩니다. Bean 간의 의존 관계를 표현합니다.

넷째, @ConditionalOnMissingBean입니다. 특정 Bean이 없을 때만 활성화됩니다. 가장 많이 사용되는 조건입니다. 개발자가 직접 Bean을 정의하지 않았을 때만 기본 Bean을 제공합니다. 개발자의 커스텀 설정을 우선시합니다.

다섯째, @ConditionalOnProperty입니다. 특정 프로퍼티가 설정되어 있을 때만 활성화됩니다. application.properties나 application.yml의 값에 따라 동작합니다. 기능을 켜고 끌 수 있습니다.

여섯째, @ConditionalOnResource입니다. 특정 리소스 파일이 존재할 때만 활성화됩니다.

일곱째, @ConditionalOnWebApplication입니다. 웹 애플리케이션일 때만 활성화됩니다. 서블릿 기반, 리액티브 기반을 구분할 수 있습니다.

여덟째, @ConditionalOnNotWebApplication입니다. 웹 애플리케이션이 아닐 때만 활성화됩니다. 배치 애플리케이션 등에 사용합니다.

**자동 구성 동작 과정:**

첫째, 애플리케이션 시작입니다. @SpringBootApplication 어노테이션이 붙은 메인 클래스를 실행합니다. 이 어노테이션에는 @EnableAutoConfiguration이 포함되어 있습니다.

둘째, spring.factories 로딩입니다. Spring Boot가 모든 JAR의 META-INF/spring.factories 파일을 찾습니다. EnableAutoConfiguration 키에 등록된 모든 자동 구성 클래스를 로드합니다.

셋째, 조건 평가입니다. 각 자동 구성 클래스의 조건 어노테이션을 평가합니다. 클래스패스, Bean 존재 여부, 프로퍼티 값 등을 검사합니다. 조건이 맞으면 해당 구성이 활성화됩니다.

넷째, Bean 등록입니다. 활성화된 자동 구성 클래스가 Bean을 등록합니다. @ConditionalOnMissingBean 덕분에 개발자의 커스텀 Bean이 우선합니다.

다섯째, 우선순위 적용입니다. @AutoConfigureBefore와 @AutoConfigureAfter로 자동 구성 간 순서를 제어합니다. 의존 관계가 있는 구성이 올바른 순서로 적용됩니다.

**DataSource 자동 구성 예시:**

DataSourceAutoConfiguration 클래스가 있습니다. @ConditionalOnClass로 DataSource 클래스와 JDBC 관련 클래스가 있는지 확인합니다. @ConditionalOnMissingBean으로 개발자가 DataSource를 정의하지 않았는지 확인합니다. 조건이 맞으면 application.properties의 spring.datasource 설정을 읽어 DataSource Bean을 생성합니다.

**커스터마이징 방법:**

첫째, 프로퍼티 설정입니다. application.properties나 application.yml에서 값을 변경합니다. 대부분의 자동 구성은 프로퍼티로 커스터마이징할 수 있습니다. 코드 변경 없이 설정만으로 동작을 바꿀 수 있습니다.

둘째, 직접 Bean 정의입니다. 개발자가 직접 Bean을 정의하면 자동 구성의 Bean이 무시됩니다. @ConditionalOnMissingBean 덕분입니다. 완전한 제어가 필요할 때 사용합니다.

셋째, 자동 구성 제외입니다. @SpringBootApplication의 exclude 속성으로 특정 자동 구성을 제외할 수 있습니다. spring.autoconfigure.exclude 프로퍼티로도 제외할 수 있습니다. 원하지 않는 자동 구성을 비활성화합니다.

넷째, @ConfigurationProperties입니다. 프로퍼티를 타입 안전하게 바인딩합니다. 자동 완성과 검증을 지원합니다. 복잡한 설정을 객체로 관리할 수 있습니다.

**자동 구성 확인 방법:**

첫째, 디버그 모드 활성화입니다. application.properties에 debug=true를 설정합니다. 애플리케이션 시작 시 자동 구성 리포트가 출력됩니다. 어떤 자동 구성이 활성화되고 비활성화되었는지 확인할 수 있습니다.

둘째, Actuator 엔드포인트입니다. spring-boot-starter-actuator를 추가합니다. /actuator/conditions 엔드포인트에서 자동 구성 조건을 확인할 수 있습니다. 각 조건의 평가 결과를 볼 수 있습니다.

셋째, 로그 레벨 조정입니다. logging.level.org.springframework.boot.autoconfigure를 DEBUG로 설정합니다. 자동 구성 과정의 상세한 로그를 볼 수 있습니다.

**자동 구성의 장점:**

첫째, 빠른 개발 시작입니다. 복잡한 설정 없이 바로 개발을 시작할 수 있습니다. 보일러플레이트 설정 코드가 필요 없습니다.

둘째, 모범 사례 적용입니다. Spring 팀이 검증한 설정이 자동으로 적용됩니다. 초보 개발자도 좋은 설정으로 시작할 수 있습니다.

셋째, 유지보수 편의성입니다. Spring Boot 버전 업그레이드 시 자동 구성도 함께 개선됩니다. 설정을 일일이 수정할 필요가 없습니다.

넷째, 일관성입니다. 모든 프로젝트가 비슷한 구조와 설정을 가집니다. 팀 간 협업이 쉬워집니다.

**자동 구성의 단점:**

첫째, 블랙박스 효과입니다. 내부 동작을 모르면 문제 해결이 어렵습니다. 어떤 Bean이 자동으로 생성되는지 파악하기 어려울 수 있습니다.

둘째, 불필요한 의존성입니다. 사용하지 않는 기능의 자동 구성도 로드될 수 있습니다. 애플리케이션 시작 시간이 약간 늘어날 수 있습니다.

셋째, 커스터마이징 제한입니다. 자동 구성이 제공하지 않는 설정은 직접 구성해야 합니다. 복잡한 요구사항에는 한계가 있을 수 있습니다.

**커스텀 자동 구성 만들기:**

자신만의 스타터와 자동 구성을 만들 수 있습니다. @Configuration 클래스를 작성합니다. 조건부 어노테이션을 적절히 사용합니다. META-INF/spring.factories에 자동 구성 클래스를 등록합니다. 재사용 가능한 모듈을 만들 수 있습니다.

**결론:**

자동 구성은 Spring Boot의 핵심 기능입니다. "관례보다 설정(Convention over Configuration)" 원칙을 구현합니다. 대부분의 경우 기본 설정으로 충분하며, 필요시 쉽게 커스터마이징할 수 있습니다. 이를 통해 개발자는 비즈니스 로직에 집중할 수 있습니다.

## 질문 70: 예외 처리를 위한 @ControllerAdvice의 역할과 활용 방법은 무엇인가요?

@ControllerAdvice는 Spring MVC에서 전역적으로 예외를 처리하고 공통 기능을 적용하는 어노테이션입니다.

**@ControllerAdvice의 역할:**

첫째, 전역 예외 처리입니다. 모든 컨트롤러에서 발생하는 예외를 한 곳에서 처리합니다. 각 컨트롤러마다 예외 처리 코드를 중복해서 작성할 필요가 없습니다. 일관된 예외 응답을 제공할 수 있습니다.

둘째, 모델 데이터 공통화입니다. 모든 컨트롤러에 공통으로 사용되는 모델 속성을 정의할 수 있습니다. 중복 코드를 제거합니다.

셋째, 바인더 초기화입니다. 모든 컨트롤러에 적용될 데이터 바인딩 규칙을 설정할 수 있습니다. 날짜 포맷, 문자열 트림 등을 일괄 적용합니다.

**@ExceptionHandler와의 조합:**

@ControllerAdvice 클래스 내에서 @ExceptionHandler 메서드를 정의합니다. 특정 예외 타입을 지정하여 해당 예외를 처리합니다. 여러 예외를 배열로 지정할 수 있습니다.

**기본 사용 방법:**

첫째, @ControllerAdvice 클래스 생성입니다. 클래스에 @ControllerAdvice 어노테이션을 붙입니다. @Component의 특수한 형태이므로 자동으로 Bean으로 등록됩니다.

둘째, @ExceptionHandler 메서드 정의입니다. 처리할 예외 타입을 지정합니다. 예외 객체를 매개변수로 받을 수 있습니다. 적절한 응답을 반환합니다.

셋째, 응답 형태 지정입니다. ResponseEntity를 반환하여 상태 코드와 바디를 제어할 수 있습니다. @ResponseStatus로 HTTP 상태 코드를 지정할 수 있습니다. ModelAndView를 반환하여 에러 페이지로 이동할 수 있습니다.

**적용 범위 제한:**

기본적으로 모든 컨트롤러에 적용되지만, 범위를 제한할 수 있습니다.

첫째, 특정 패키지로 제한입니다. basePackages 속성으로 패키지를 지정합니다. 해당 패키지의 컨트롤러에만 적용됩니다.

둘째, 특정 클래스로 제한입니다. assignableTypes 속성으로 컨트롤러 클래스를 지정합니다. 지정된 타입과 그 하위 타입에만 적용됩니다.

셋째, 어노테이션으로 제한입니다. annotations 속성으로 특정 어노테이션이 붙은 컨트롤러에만 적용할 수 있습니다.

**@RestControllerAdvice:**

@RestControllerAdvice는 @ControllerAdvice와 @ResponseBody의 조합입니다. RESTful API에서 사용합니다. 모든 응답이 HTTP 메시지 바디에 직접 쓰입니다. JSON 형태의 에러 응답을 반환할 때 편리합니다.

**다양한 예외 처리 패턴:**

첫째, 계층적 예외 처리입니다. 상위 예외 타입으로 여러 하위 예외를 한 번에 처리할 수 있습니다. 예를 들어 Exception으로 모든 예외를 잡을 수 있습니다. 구체적인 예외부터 처리하고 나머지는 일반 예외 핸들러로 처리합니다.

둘째, 여러 예외 동시 처리입니다. @ExceptionHandler에 배열로 여러 예외를 지정할 수 있습니다. 같은 방식으로 처리할 예외들을 묶습니다.

셋째, 우선순위입니다. 더 구체적인 예외 타입이 우선합니다. IllegalArgumentException과 Exception이 모두 있으면 IllegalArgumentException이 먼저 적용됩니다.

**실무 활용 사례:**

첫째, 비즈니스 예외 처리입니다. 커스텀 예외를 정의합니다. 각 비즈니스 예외에 맞는 HTTP 상태 코드와 메시지를 반환합니다. 사용자에게 의미 있는 에러 메시지를 제공합니다.

둘째, 검증 예외 처리입니다. MethodArgumentNotValidException을 처리합니다. Bean Validation 실패 시 발생합니다. BindingResult에서 필드별 에러 메시지를 추출합니다. 클라이언트에게 어떤 필드가 잘못되었는지 알려줍니다.

셋째, 인증/인가 예외 처리입니다. AccessDeniedException, AuthenticationException 등을 처리합니다. 401 Unauthorized나 403 Forbidden을 반환합니다. 로그인 페이지로 리다이렉트하거나 에러 응답을 반환합니다.

넷째, 리소스 없음 예외 처리입니다. 커스텀 ResourceNotFoundException을 정의합니다. 404 Not Found를 반환합니다. 존재하지 않는 리소스 요청 시 일관된 응답을 제공합니다.

다섯째, 서버 에러 처리입니다. 예상치 못한 Exception을 처리합니다. 500 Internal Server Error를 반환합니다. 상세한 에러 정보는 로그에 기록하고, 클라이언트에는 간단한 메시지만 전달합니다. 보안상 내부 정보를 노출하지 않습니다.

**에러 응답 형식 통일:**

모든 에러 응답을 일관된 형식으로 반환합니다. ErrorResponse 같은 공통 클래스를 만듭니다. 타임스탬프, 상태 코드, 메시지, 경로 등의 정보를 포함합니다. 클라이언트가 예측 가능한 에러 처리를 할 수 있습니다.

**로깅:**

예외 발생 시 적절한 로그를 남깁니다. 비즈니스 예외는 WARN 레벨로 기록합니다. 시스템 에러는 ERROR 레벨로 기록합니다. 스택 트레이스를 포함하여 디버깅을 돕습니다. 중요한 정보는 별도로 모니터링 시스템에 전송합니다.

**@ModelAttribute 활용:**

@ControllerAdvice에서 @ModelAttribute를 사용할 수 있습니다. 모든 컨트롤러의 모델에 공통 속성을 추가합니다. 현재 사용자 정보, 공통 설정값 등을 제공합니다. 각 컨트롤러에서 중복 코드를 제거합니다.

**@InitBinder 활용:**

@ControllerAdvice에서 @InitBinder를 사용할 수 있습니다. 모든 컨트롤러에 적용될 데이터 바인딩 규칙을 설정합니다. 날짜 포맷 설정, 문자열 트림, 허용할 필드 제한 등을 정의합니다. 일관된 데이터 처리를 보장합니다.

**여러 ControllerAdvice 사용:**

목적별로 여러 @ControllerAdvice를 만들 수 있습니다. 예를 들어 API용, 웹 페이지용을 분리합니다. @Order로 우선순위를 지정할 수 있습니다. 모듈별로 예외 처리를 분리하여 관리합니다.

**테스트:**

@WebMvcTest로 컨트롤러와 함께 테스트합니다. MockMvc로 예외 발생 시나리오를 시뮬레이션합니다. 예상한 상태 코드와 응답 메시지가 반환되는지 검증합니다. 예외 처리 로직의 정확성을 보장합니다.

**주의사항:**

첫째, 예외 처리 우선순위를 이해해야 합니다. 컨트롤러 내부의 @ExceptionHandler가 @ControllerAdvice보다 우선합니다. 더 구체적인 예외가 일반 예외보다 우선합니다.

둘째, 너무 많은 예외를 한 곳에서 처리하면 복잡해집니다. 적절히 분리하고 구조화해야 합니다.

셋째, 보안에 주의해야 합니다. 클라이언트에게 과도한 정보를 노출하지 않습니다. 스택 트레이스나 데이터베이스 에러 메시지는 숨깁니다.

**장점:**

코드 중복이 제거됩니다. 예외 처리가 일관됩니다. 비즈니스 로직과 예외 처리가 분리됩니다. 유지보수가 쉬워집니다. 새로운 예외를 추가하기 쉽습니다.

@ControllerAdvice는 Spring MVC 애플리케이션에서 필수적인 기능으로, 깔끔하고 일관된 예외 처리를 가능하게 합니다.

## 질문 71: Spring Security의 기본 개념과 인증/인가 처리 흐름에 대해 설명해주세요.

Spring Security는 Spring 기반 애플리케이션에 인증과 인가 기능을 제공하는 강력한 보안 프레임워크입니다.

**핵심 개념:**

첫째, 인증(Authentication)입니다. 사용자가 누구인지 확인하는 과정입니다. 로그인을 통해 신원을 증명합니다. 사용자 이름과 비밀번호, 토큰, 인증서 등을 사용합니다.

둘째, 인가(Authorization)입니다. 인증된 사용자가 특정 리소스에 접근할 권한이 있는지 확인하는 과정입니다. 역할(Role)과 권한(Authority)을 기반으로 합니다. 접근 제어 결정을 내립니다.

셋째, 주체(Principal)입니다. 인증을 요청하는 사용자나 시스템을 의미합니다. 보통 사용자 이름이나 사용자 객체입니다.

넷째, 자격 증명(Credentials)입니다. 주체를 인증하기 위한 정보입니다. 비밀번호, 토큰, 인증서 등입니다. 인증 후에는 보안상 지워집니다.

다섯째, 권한(Authority)입니다. 인증된 주체에게 부여된 권한입니다. ROLE_USER, ROLE_ADMIN 같은 역할입니다. READ, WRITE 같은 세밀한 권한도 가능합니다.

**주요 구성 요소:**

첫째, SecurityContext입니다. 현재 인증된 사용자 정보를 담고 있습니다. Authentication 객체를 포함합니다. ThreadLocal에 저장되어 어디서나 접근할 수 있습니다.

둘째, SecurityContextHolder입니다. SecurityContext를 관리합니다. 정적 메서드로 현재 인증 정보를 조회할 수 있습니다. 기본적으로 ThreadLocal 전략을 사용합니다.

셋째, Authentication입니다. 인증 정보를 담는 인터페이스입니다. Principal, Credentials, Authorities를 포함합니다. 인증 전과 후에 다른 정보를 담습니다.

넷째, UserDetails입니다. 사용자 정보를 담는 인터페이스입니다. 사용자 이름, 비밀번호, 권한, 계정 상태 등을 포함합니다. 개발자가 구현하여 자신의 사용자 모델과 연결합니다.

다섯째, UserDetailsService입니다. 사용자 이름으로 UserDetails를 조회하는 인터페이스입니다. loadUserByUsername 메서드 하나만 가지고 있습니다. 데이터베이스나 다른 저장소에서 사용자 정보를 가져옵니다.

여섯째, AuthenticationManager입니다. 인증 처리를 담당하는 인터페이스입니다. authenticate 메서드로 인증을 수행합니다. 보통 ProviderManager 구현체를 사용합니다.

일곱째, AuthenticationProvider입니다. 실제 인증 로직을 구현합니다. 여러 Provider가 체인처럼 연결될 수 있습니다. DaoAuthenticationProvider가 기본 구현체입니다. 사용자 이름/비밀번호 인증을 처리합니다.

여덟째, PasswordEncoder입니다. 비밀번호를 암호화하고 검증합니다. BCrypt, PBKDF2, SCrypt 등 다양한 알고리즘을 지원합니다. 평문 비밀번호를 저장하지 않도록 합니다.

**Filter Chain:**

Spring Security는 필터 체인으로 동작합니다.

첫째, FilterChainProxy입니다. Spring Security의 진입점입니다. 여러 보안 필터를 관리합니다. 요청마다 필터 체인을 실행합니다.

둘째, 주요 필터들입니다. SecurityContextPersistenceFilter는 SecurityContext를 로드하고 저장합니다. UsernamePasswordAuthenticationFilter는 폼 로그인을 처리합니다. BasicAuthenticationFilter는 HTTP Basic 인증을 처리합니다. ExceptionTranslationFilter는 인증/인가 예외를 처리합니다. FilterSecurityInterceptor는 최종적으로 인가 결정을 내립니다.

**인증 처리 흐름:**

첫째, 사용자 요청입니다. 사용자가 로그인 폼에 아이디와 비밀번호를 입력하고 제출합니다.

둘째, UsernamePasswordAuthenticationFilter 실행입니다. POST 요청의 username과 password를 추출합니다. UsernamePasswordAuthenticationToken을 생성합니다. 아직 인증되지 않은 상태입니다.

셋째, AuthenticationManager에 전달입니다. 필터가 AuthenticationManager에게 인증을 위임합니다. ProviderManager가 적절한 AuthenticationProvider를 찾습니다.

넷째, AuthenticationProvider 실행입니다. DaoAuthenticationProvider가 UserDetailsService를 호출합니다. 사용자 이름으로 UserDetails를 조회합니다. 데이터베이스에서 사용자 정보를 가져옵니다.

다섯째, 비밀번호 검증입니다. PasswordEncoder로 입력된 비밀번호와 저장된 비밀번호를 비교합니다. 일치하지 않으면 BadCredentialsException을 던집니다.

여섯째, 인증 성공 처리입니다. 인증된 Authentication 객체를 생성합니다. Authorities(권한)를 설정합니다. SecurityContext에 Authentication을 저장합니다. SecurityContextHolder를 통해 접근 가능하게 합니다.

일곱째, 세션에 저장입니다. SecurityContextPersistenceFilter가 SecurityContext를 세션에 저장합니다. 다음 요청에서 다시 로그인할 필요가 없습니다.

여덟째, 성공 후 처리입니다. AuthenticationSuccessHandler가 실행됩니다. 기본적으로 원래 요청했던 페이지로 리다이렉트합니다. 커스텀 핸들러로 다른 동작을 정의할 수 있습니다.

**인가 처리 흐름:**

첫째, 요청 접근입니다. 인증된 사용자가 특정 URL에 접근합니다.

둘째, FilterSecurityInterceptor 실행입니다. 접근 제어 결정을 내리는 필터입니다. 요청 URL과 HTTP 메서드를 확인합니다.

셋째, SecurityMetadataSource 조회입니다. 해당 리소스에 필요한 권한을 조회합니다. 설정에 정의된 접근 규칙을 가져옵니다.

넷째, AccessDecisionManager 실행입니다. 현재 사용자의 권한과 필요한 권한을 비교합니다. AccessDecisionVoter들이 투표합니다. 투표 결과에 따라 접근을 허용하거나 거부합니다.

다섯째, 접근 허용입니다. 권한이 충분하면 요청이 계속 진행됩니다. 컨트롤러가 실행되고 응답이 반환됩니다.

여섯째, 접근 거부입니다. 권한이 부족하면 AccessDeniedException이 발생합니다. ExceptionTranslationFilter가 예외를 처리합니다. 익명 사용자면 로그인 페이지로 리다이렉트합니다. 인증된 사용자면 403 Forbidden 페이지를 보여줍니다.

**설정 방법:**

첫째, SecurityFilterChain Bean 정의입니다. HttpSecurity 객체로 보안 규칙을 설정합니다. URL 패턴별로 접근 권한을 지정합니다. 폼 로그인, 로그아웃, CSRF 등을 설정합니다.

둘째, UserDetailsService 구현입니다. 데이터베이스에서 사용자를 조회하는 로직을 작성합니다. UserDetails를 반환합니다.

셋째, PasswordEncoder Bean 등록입니다. BCryptPasswordEncoder를 주로 사용합니다. 비밀번호를 안전하게 암호화합니다.

**다양한 인증 방식:**

폼 로그인은 전통적인 웹 애플리케이션에서 사용합니다. HTTP Basic은 API에서 간단하게 사용합니다. JWT 토큰은 RESTful API와 마이크로서비스에서 사용합니다. OAuth2는 소셜 로그인에 사용합니다. LDAP이나 Active Directory 연동도 가능합니다.

**메서드 보안:**

@EnableGlobalMethodSecurity로 활성화합니다. @PreAuthorize로 메서드 실행 전 권한을 검사합니다. @PostAuthorize로 메서드 실행 후 권한을 검사합니다. @Secured나 @RolesAllowed도 사용할 수 있습니다. SpEL 표현식으로 복잡한 조건을 표현합니다.

**CSRF 보호:**

Cross-Site Request Forgery 공격을 방지합니다. 기본적으로 활성화되어 있습니다. 모든 POST, PUT, DELETE 요청에 CSRF 토큰이 필요합니다. REST API에서는 비활성화할 수 있습니다.

**세션 관리:**

세션 고정 공격을 방지합니다. 로그인 성공 시 새 세션을 생성합니다. 동시 세션 제어를 할 수 있습니다. 한 사용자의 동시 로그인 수를 제한합니다.

Spring Security는 복잡하지만 강력한 보안 기능을 제공합니다. 인증과 인가 흐름을 이해하면 안전한 애플리케이션을 개발할 수 있습니다.

## 질문 72: RESTful API를 Spring에서 구현하는 방법과 모범 사례는 무엇인가요?

REST(Representational State Transfer)는 HTTP를 효과적으로 활용하는 아키텍처 스타일입니다. Spring에서는 다양한 기능으로 RESTful API를 쉽게 구현할 수 있습니다.

**REST의 기본 원칙:**

첫째, 자원(Resource) 기반입니다. 모든 것을 자원으로 표현합니다. 자원은 URI로 식별합니다. 명사를 사용하여 자원을 표현합니다.

둘째, HTTP 메서드를 사용합니다. GET은 조회, POST는 생성, PUT은 전체 수정, PATCH는 부분 수정, DELETE는 삭제입니다. 메서드의 의미를 올바르게 사용합니다.

셋째, 무상태(Stateless)입니다. 각 요청은 독립적입니다. 서버가 클라이언트 상태를 저장하지 않습니다. 모든 필요한 정보가 요청에 포함됩니다.

넷째, 표현(Representation)입니다. 자원을 JSON, XML 등의 형태로 표현합니다. 같은 자원을 다양한 형태로 제공할 수 있습니다.

다섯째, 계층화된 시스템입니다. 클라이언트는 서버의 내부 구조를 알 필요가 없습니다. 중간에 프록시나 게이트웨이가 있어도 동작합니다.

**Spring에서의 구현 방법:**

첫째, @RestController 사용입니다. @Controller와 @ResponseBody의 조합입니다. 모든 메서드의 반환값이 HTTP 응답 바디에 쓰입니다. JSON 변환이 자동으로 이루어집니다.

둘째, @RequestMapping과 축약 어노테이션입니다. @GetMapping은 GET 요청을 처리합니다. @PostMapping은 POST 요청을 처리합니다. @PutMapping, @PatchMapping, @DeleteMapping도 있습니다. HTTP 메서드를 명확하게 표현합니다.

셋째, @PathVariable 사용입니다. URL 경로의 변수를 메서드 파라미터로 받습니다. RESTful한 URL 설계를 가능하게 합니다.

넷째, @RequestBody 사용입니다. HTTP 요청 바디를 자바 객체로 변환합니다. JSON을 자동으로 역직렬화합니다. POST, PUT, PATCH 요청에서 사용합니다.

다섯째, @RequestParam 사용입니다. 쿼리 파라미터를 받습니다. 검색이나 필터링에 사용합니다. 선택적 파라미터를 정의할 수 있습니다.

**URI 설계 모범 사례:**

첫째, 명사를 사용합니다. 동사가 아닌 명사로 자원을 표현합니다. 복수형을 사용하는 것이 일반적입니다.

둘째, 계층 구조를 표현합니다. 관계를 URL로 나타냅니다. 중첩된 자원을 경로로 표현합니다.

셋째, 소문자와 하이픈을 사용합니다. 가독성을 높입니다. 언더스코어보다 하이픈을 선호합니다.

넷째, 파일 확장자를 사용하지 않습니다. Accept 헤더로 형식을 지정합니다. URL을 깔끔하게 유지합니다.

다섯째, CRUD를 HTTP 메서드로 표현합니다. URL에 동작을 넣지 않습니다. 메서드로 의도를 전달합니다.

**HTTP 상태 코드 사용:**

첫째, 2xx 성공입니다. 200 OK는 일반적인 성공입니다. 201 Created는 리소스 생성 성공입니다. Location 헤더에 새 리소스 URI를 포함합니다. 204 No Content는 성공했지만 반환할 내용이 없을 때 사용합니다. 보통 DELETE에서 사용합니다.

둘째, 4xx 클라이언트 오류입니다. 400 Bad Request는 잘못된 요청입니다. 401 Unauthorized는 인증이 필요합니다. 403 Forbidden은 권한이 부족합니다. 404 Not Found는 리소스가 없습니다. 409 Conflict는 리소스 상태 충돌입니다. 중복 생성 시도 등에 사용합니다.

셋째, 5xx 서버 오류입니다. 500 Internal Server Error는 서버 내부 오류입니다. 503 Service Unavailable은 서비스 이용 불가입니다.

**ResponseEntity 사용:**

ResponseEntity로 상태 코드와 헤더를 세밀하게 제어할 수 있습니다. 바디, 상태 코드, 헤더를 모두 설정할 수 있습니다. 빌더 패턴으로 가독성 있게 작성합니다.

**데이터 검증:**

Bean Validation(JSR-303)을 사용합니다. @Valid나 @Validated로 검증을 활성화합니다. @NotNull, @NotEmpty, @Size, @Email 등의 어노테이션을 사용합니다. BindingResult로 검증 오류를 처리합니다. 400 Bad Request와 함께 오류 상세를 반환합니다.

**예외 처리:**

@RestControllerAdvice로 전역 예외를 처리합니다. 비즈니스 예외를 적절한 HTTP 상태 코드로 변환합니다. 일관된 에러 응답 형식을 제공합니다. 타임스탬프, 상태 코드, 메시지, 경로 등을 포함합니다.

**DTO 사용:**

엔티티를 직접 노출하지 않습니다. DTO(Data Transfer Object)로 변환하여 반환합니다. API 응답 형식을 제어할 수 있습니다. 불필요한 정보를 숨길 수 있습니다. 순환 참조 문제를 방지합니다.

**버전 관리:**

API 버전을 관리합니다. URI에 버전을 포함하는 방법이 일반적입니다. 헤더로 버전을 지정할 수도 있습니다. 하위 호환성을 유지하며 변경합니다.

**HATEOAS:**

Hypermedia As The Engine Of Application State입니다. 응답에 관련 링크를 포함합니다. 클라이언트가 다음 가능한 액션을 발견할 수 있습니다. Spring HATEOAS가 이를 지원합니다. RESTful 성숙도를 높입니다.

**페이징과 정렬:**

대량의 데이터는 페이징 처리합니다. page, size 파라미터를 사용합니다. Spring Data의 Pageable을 활용합니다. 정렬 기준도 파라미터로 받습니다. 응답에 총 개수, 페이지 정보를 포함합니다.

**필터링과 검색:**

쿼리 파라미터로 필터 조건을 받습니다. 동적 쿼리로 조건을 처리합니다. Querydsl이나 Specification을 활용합니다. 복잡한 검색 조건을 지원합니다.

**Content Negotiation:**

Accept 헤더로 응답 형식을 지정합니다. JSON, XML 등을 선택할 수 있습니다. produces 속성으로 지원 형식을 제한합니다.

**캐싱:**

HTTP 캐싱을 활용합니다. ETag나 Last-Modified 헤더를 사용합니다. 304 Not Modified로 대역폭을 절약합니다. Cache-Control 헤더로 캐시 정책을 지정합니다.

**보안:**

Spring Security로 인증과 인가를 구현합니다. JWT 토큰 기반 인증을 많이 사용합니다. CORS 설정으로 교차 출처 요청을 제어합니다. HTTPS를 사용하여 통신을 암호화합니다.

**문서화:**

API 문서를 제공합니다. Swagger(OpenAPI)를 많이 사용합니다. SpringDoc이나 Springfox로 자동 생성합니다. 엔드포인트, 파라미터, 응답 예시를 포함합니다. 클라이언트 개발자가 쉽게 이해할 수 있게 합니다.

**테스트:**

@WebMvcTest로 컨트롤러를 테스트합니다. MockMvc로 HTTP 요청을 시뮬레이션합니다. 상태 코드, 응답 바디, 헤더를 검증합니다. @SpringBootTest로 통합 테스트를 작성합니다. RestAssured나 WebTestClient도 사용할 수 있습니다.

**성능 최적화:**

N+1 문제를 해결합니다. Fetch Join이나 EntityGraph를 사용합니다. 불필요한 데이터를 조회하지 않습니다. 데이터베이스 쿼리를 최적화합니다. 연결 풀을 적절히 설정합니다.

**모니터링과 로깅:**

모든 API 호출을 로깅합니다. 요청과 응답을 기록합니다. 성능 메트릭을 수집합니다. Actuator로 헬스 체크를 제공합니다. 에러 추적 시스템을 연동합니다.

RESTful API 설계는 일관성과 예측 가능성이 중요합니다. HTTP의 의미를 올바르게 사용하고, 클라이언트 개발자가 쉽게 이해하고 사용할 수 있는 API를 만들어야 합니다.
