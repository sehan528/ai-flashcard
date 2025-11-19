#!/usr/bin/env python3
"""
누락된 답변을 추가하는 스크립트
- spring.json #83-85
- react.json #61-62
"""
import json

def add_spring_answers():
    """Spring.json의 누락된 답변 추가"""
    filepath = 'public/data/dataset/spring/spring.json'

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data['cards']

    # 카드 #83: Spring Boot Starter의 개념과 주요 Starter들의 역할
    cards[82]['answer'] = """Spring Boot Starter는 특정 기능에 필요한 의존성을 미리 묶어놓은 의존성 모음입니다. 복잡한 의존성 관리를 단순화하고 빠른 프로젝트 설정을 가능하게 합니다.

**Starter의 개념:**

첫째, 의존성 번들입니다. 특정 기능에 필요한 모든 라이브러리를 하나로 묶었습니다. 버전 호환성이 검증된 의존성들을 포함합니다. 개발자가 일일이 의존성을 추가할 필요가 없습니다.

둘째, 자동 구성과 연계됩니다. Starter를 추가하면 자동 구성이 활성화됩니다. 필요한 Bean들이 자동으로 등록됩니다. 별도 설정 없이 바로 사용 가능합니다.

**주요 Starter들:**

**spring-boot-starter-web:**
웹 애플리케이션 개발을 위한 Starter입니다. Spring MVC, Tomcat, Jackson 등을 포함합니다. RESTful API와 웹 페이지 개발에 사용됩니다.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

**spring-boot-starter-data-jpa:**
JPA 데이터베이스 접근을 위한 Starter입니다. Hibernate, Spring Data JPA, JDBC를 포함합니다. 데이터베이스 연동과 ORM 작업에 사용됩니다.

**spring-boot-starter-security:**
보안 기능을 위한 Starter입니다. Spring Security를 포함합니다. 인증, 인가, CSRF 보호 등을 제공합니다.

**spring-boot-starter-test:**
테스트를 위한 Starter입니다. JUnit, Mockito, AssertJ, Spring Test 등을 포함합니다. 단위 테스트와 통합 테스트에 사용됩니다.

**spring-boot-starter-actuator:**
프로덕션 모니터링을 위한 Starter입니다. 헬스 체크, 메트릭, 감사 기능을 제공합니다. 애플리케이션 상태를 실시간으로 모니터링할 수 있습니다.

**spring-boot-starter-data-redis:**
Redis 연동을 위한 Starter입니다. Lettuce 또는 Jedis 클라이언트를 포함합니다. 캐싱과 세션 저장소로 사용됩니다.

**Starter의 이점:**

첫째, 간편한 의존성 관리입니다. 하나의 Starter만 추가하면 됩니다. 버전 충돌 걱정이 없습니다. Maven/Gradle 설정이 간소화됩니다.

둘째, 일관된 설정입니다. Spring Boot 팀이 검증한 구성을 사용합니다. 모범 사례가 적용되어 있습니다. 설정 실수를 줄일 수 있습니다.

셋째, 빠른 개발 시작입니다. 복잡한 초기 설정 없이 바로 개발할 수 있습니다. 프로토타입을 빠르게 만들 수 있습니다. 학습 곡선이 낮아집니다.

**커스텀 Starter 만들기:**

자주 사용하는 의존성 조합을 커스텀 Starter로 만들 수 있습니다.

```xml
<!-- my-custom-starter/pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <!-- 필요한 의존성들 추가 -->
</dependencies>
```

```java
@Configuration
@ConditionalOnClass(MyService.class)
public class MyAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean
    public MyService myService() {
        return new MyService();
    }
}
```

Spring Boot Starter는 복잡한 의존성 관리를 추상화하여 개발자가 비즈니스 로직에 집중할 수 있게 합니다."""

    # 카드 #84: Java Config와 XML Config를 통한 Bean 등록 및 설정 방식의 차이점
    cards[83]['answer'] = """Java Config와 XML Config는 Spring에서 Bean을 정의하고 설정하는 두 가지 방식입니다. 현대 Spring 개발에서는 Java Config를 권장합니다.

**XML Config 방식:**

**특징:**
XML 파일에 Bean을 선언합니다. 외부 설정 파일로 관리됩니다. Spring 초기부터 사용된 전통적인 방식입니다.

```xml
<!-- applicationContext.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userService" class="com.example.UserService">
        <property name="userRepository" ref="userRepository"/>
    </bean>

    <bean id="userRepository" class="com.example.UserRepository">
        <constructor-arg ref="dataSource"/>
    </bean>

    <bean id="dataSource" class="org.apache.commons.dbcp2.BasicDataSource">
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://localhost:3306/mydb"/>
        <property name="username" value="root"/>
        <property name="password" value="password"/>
    </bean>
</beans>
```

**Java Config 방식:**

**특징:**
Java 클래스에 @Configuration과 @Bean 어노테이션을 사용합니다. 타입 안정성과 리팩토링 지원을 받습니다. 현대 Spring의 권장 방식입니다.

```java
@Configuration
public class AppConfig {

    @Bean
    public UserService userService(UserRepository userRepository) {
        return new UserService(userRepository);
    }

    @Bean
    public UserRepository userRepository(DataSource dataSource) {
        return new UserRepository(dataSource);
    }

    @Bean
    public DataSource dataSource() {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/mydb");
        dataSource.setUsername("root");
        dataSource.setPassword("password");
        return dataSource;
    }
}
```

**주요 차이점:**

**1. 타입 안정성**

XML Config: 컴파일 타임 검증이 불가능합니다. 오타나 잘못된 클래스명은 런타임에 발견됩니다. IDE의 자동완성 지원이 제한적입니다.

Java Config: 컴파일 타임에 타입 검증이 됩니다. 오류를 조기에 발견할 수 있습니다. IDE의 강력한 자동완성을 활용할 수 있습니다.

**2. 리팩토링 지원**

XML Config: 클래스명이나 패키지를 변경하면 XML을 수동으로 수정해야 합니다. IDE의 리팩토링 기능을 활용할 수 없습니다.

Java Config: IDE의 리팩토링 기능을 완벽하게 활용할 수 있습니다. 클래스 이름 변경, 메서드 이름 변경 등이 자동으로 반영됩니다.

**3. 조건부 Bean 등록**

XML Config: 조건부 로직을 표현하기 어렵습니다. 프로파일을 사용하거나 별도 파일로 분리해야 합니다.

```xml
<beans profile="dev">
    <bean id="dataSource" class="...H2DataSource"/>
</beans>
```

Java Config: Java 코드로 유연한 조건부 로직을 작성할 수 있습니다.

```java
@Configuration
public class AppConfig {

    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        return new H2DataSource();
    }

    @Bean
    @Profile("prod")
    public DataSource prodDataSource() {
        return new MySQLDataSource();
    }

    @Bean
    @ConditionalOnProperty(name = "feature.enabled", havingValue = "true")
    public FeatureService featureService() {
        return new FeatureService();
    }
}
```

**4. 가독성과 유지보수**

XML Config: 설정이 많아지면 XML 파일이 비대해집니다. 의존성 관계를 파악하기 어려울 수 있습니다.

Java Config: 객체지향적으로 설정을 구조화할 수 있습니다. 메서드로 분리하고 재사용할 수 있습니다.

```java
@Configuration
public class AppConfig {

    @Bean
    public UserService userService() {
        return new UserService(userRepository());
    }

    private UserRepository userRepository() {
        // 공통 로직을 메서드로 분리
        return new UserRepository(commonDataSource());
    }

    private DataSource commonDataSource() {
        // 재사용 가능한 설정
        return createDataSource("jdbc:mysql://localhost:3306/mydb");
    }

    private DataSource createDataSource(String url) {
        BasicDataSource ds = new BasicDataSource();
        ds.setUrl(url);
        return ds;
    }
}
```

**5. 디버깅**

XML Config: 설정 오류 시 스택 트레이스가 명확하지 않습니다. 어떤 Bean에서 문제가 발생했는지 찾기 어렵습니다.

Java Config: 일반 Java 코드이므로 브레이크포인트를 설정할 수 있습니다. 디버깅이 훨씬 쉽습니다.

**혼합 사용:**

필요하다면 두 방식을 혼합할 수 있습니다.

```java
@Configuration
@ImportResource("classpath:legacy-config.xml")
public class AppConfig {

    @Bean
    public NewService newService() {
        return new NewService();
    }
}
```

**권장사항:**

첫째, 새 프로젝트는 Java Config를 사용하세요. 타입 안정성과 리팩토링 지원의 이점이 큽니다.

둘째, 레거시 XML Config는 점진적으로 Java Config로 마이그레이션하세요. 한 번에 전환하지 않아도 됩니다.

셋째, 외부 라이브러리 통합 시에만 제한적으로 XML을 사용하세요. 대부분의 경우 Java Config로 대체 가능합니다.

Java Config는 Spring의 현대적인 설정 방식으로, 더 안전하고 유지보수하기 쉬운 코드를 작성할 수 있게 합니다."""

    # 카드 #85: 최신 Spring 버전에서 추가된 기능 및 개선 사항
    cards[84]['answer'] = """Spring Framework와 Spring Boot는 지속적으로 발전하고 있으며, 최신 버전들에서 여러 중요한 기능과 개선사항이 추가되었습니다.

**Spring Framework 6.x (2022년 11월 출시):**

**1. Java 17 베이스라인**

Java 17을 최소 요구사항으로 설정했습니다. Records, Sealed Classes, Pattern Matching 등 최신 Java 기능을 활용할 수 있습니다.

```java
// Records를 Bean으로 등록
public record UserDTO(String name, String email) {}

@Bean
public UserDTO userDTO() {
    return new UserDTO("John", "john@example.com");
}
```

**2. Jakarta EE 9+ 지원**

javax.* 패키지에서 jakarta.* 패키지로 전환되었습니다. Jakarta Servlet 5.0, Jakarta Persistence 3.0 등을 지원합니다.

```java
// 변경 전
import javax.servlet.http.HttpServlet;

// 변경 후
import jakarta.servlet.http.HttpServlet;
```

**3. Native Compilation 지원 (GraalVM)**

AOT(Ahead-of-Time) 컴파일을 통한 네이티브 이미지 생성을 지원합니다. 시작 시간이 대폭 단축되고 메모리 사용량이 감소합니다.

```bash
# Native 이미지 빌드
./mvnw -Pnative native:compile
# 실행 시간: JVM 2-3초 → Native 0.1초
```

**4. HTTP 인터페이스 클라이언트**

선언적 HTTP 클라이언트를 지원합니다. Feign과 유사하지만 Spring에 내장되어 있습니다.

```java
public interface UserClient {

    @GetExchange("/users/{id}")
    User getUser(@PathVariable Long id);

    @PostExchange("/users")
    User createUser(@RequestBody User user);
}

// 사용
@Configuration
public class ClientConfig {

    @Bean
    public UserClient userClient() {
        WebClient webClient = WebClient.builder()
            .baseUrl("https://api.example.com")
            .build();

        HttpServiceProxyFactory factory = HttpServiceProxyFactory
            .builder(WebClientAdapter.forClient(webClient))
            .build();

        return factory.createClient(UserClient.class);
    }
}
```

**5. Observability 개선**

Micrometer를 통한 메트릭과 트레이싱이 강화되었습니다. 분산 추적(Distributed Tracing)을 더 쉽게 구현할 수 있습니다.

```java
@RestController
public class UserController {

    @GetMapping("/users/{id}")
    @Observed(name = "user.get")  // 자동으로 메트릭 수집
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }
}
```

**Spring Boot 3.x (2022년 11월 출시):**

**1. 자동 구성 개선**

조건부 자동 구성이 더 정교해졌습니다. 불필요한 Bean 생성이 줄어들어 시작 시간이 단축되었습니다.

**2. 향상된 개발자 경험**

Docker Compose 지원이 추가되었습니다. 개발 환경 설정이 간소화되었습니다.

```yaml
# compose.yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: mydb
      POSTGRES_PASSWORD: secret
```

```java
// application.yml에서 자동으로 Docker Compose 활용
spring:
  docker:
    compose:
      enabled: true
```

**3. 가상 스레드 지원 (Project Loom)**

Java 21의 가상 스레드를 활용할 수 있습니다. 높은 동시성 처리 성능을 제공합니다.

```yaml
spring:
  threads:
    virtual:
      enabled: true
```

**4. Problem Details (RFC 7807) 지원**

표준화된 에러 응답 형식을 지원합니다.

```java
@RestController
public class UserController {

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }
}

// 자동 응답
// {
//   "type": "https://example.com/problems/entity-not-found",
//   "title": "Entity Not Found",
//   "status": 404,
//   "detail": "User not found",
//   "instance": "/users/123"
// }
```

**5. Improved SSL Bundle Support**

SSL 인증서 관리가 간소화되었습니다.

```yaml
spring:
  ssl:
    bundle:
      jks:
        mybundle:
          keystore:
            location: classpath:keystore.jks
            password: secret
          truststore:
            location: classpath:truststore.jks
```

**Spring Boot 3.2+ (2023년~):**

**1. JVM Checkpoint Restore (CRaC)**

애플리케이션 시작 시간을 더욱 단축시킵니다. JVM 상태를 스냅샷으로 저장하고 복원합니다.

**2. RestClient 도입**

RestTemplate과 WebClient의 중간 형태입니다. 동기 방식이지만 현대적인 API를 제공합니다.

```java
RestClient restClient = RestClient.create();

User user = restClient.get()
    .uri("https://api.example.com/users/{id}", 1)
    .retrieve()
    .body(User.class);
```

**3. Testcontainers 통합**

테스트 시 Docker 컨테이너를 자동으로 관리합니다.

```java
@SpringBootTest
@Testcontainers
class UserServiceTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
    }
}
```

**성능 개선 요약:**

- 시작 시간: 약 30% 감소
- 메모리 사용량: 약 25% 감소 (Native 이미지 사용 시 최대 90% 감소)
- 처리량: 가상 스레드 사용 시 2-3배 증가
- 빌드 시간: AOT 처리로 초기 빌드는 느리지만 런타임 성능 향상

최신 Spring 버전들은 클라우드 네이티브, 마이크로서비스, 리액티브 프로그래밍에 최적화되어 있으며, 개발자 경험과 런타임 성능을 동시에 개선했습니다."""

    # 파일 저장
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✅ Spring.json 카드 #83-85 답변 추가 완료!")
    return True

def add_react_answers():
    """React.json의 누락된 답변 추가"""
    filepath = 'public/data/dataset/react/react.json'

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data['cards']

    # 카드 #61: React 18의 주요 변경사항
    cards[60]['answer'] = """React 18은 동시성(Concurrency)을 핵심으로 하는 메이저 업데이트입니다. 사용자 경험을 향상시키고 성능을 개선하는 여러 기능이 추가되었습니다.

**1. Automatic Batching (자동 배칭)**

**변경 전 (React 17):**
```javascript
// Promise, setTimeout 등에서는 배칭이 안 됨
setTimeout(() => {
  setCount(c => c + 1);  // 리렌더링 발생
  setFlag(f => !f);      // 리렌더링 발생
  // 총 2번 리렌더링
}, 1000);
```

**변경 후 (React 18):**
```javascript
// 모든 상황에서 자동 배칭
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // 총 1번만 리렌더링 (자동으로 배칭됨)
}, 1000);

// 배칭을 원하지 않을 때
import { flushSync } from 'react-dom';

flushSync(() => {
  setCount(c => c + 1);  // 즉시 리렌더링
});
setFlag(f => !f);  // 별도로 리렌더링
```

**2. Transitions (트랜지션)**

긴급하지 않은 업데이트를 마킹하여 사용자 인터랙션의 우선순위를 관리합니다.

```javascript
import { useTransition } from 'react';

function SearchResults() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);  // 긴급: 즉시 업데이트

    // 비긴급: 백그라운드에서 업데이트
    startTransition(() => {
      setResults(searchData(value));  // 무거운 작업
    });
  };

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  );
}
```

**3. Suspense 개선**

서버 사이드 렌더링과 함께 사용할 수 있게 되었습니다.

```javascript
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile />
      <Suspense fallback={<PostsLoading />}>
        <UserPosts />
      </Suspense>
    </Suspense>
  );
}

// 데이터 fetching
function UserProfile() {
  const user = use(fetchUser());  // Suspense와 연동
  return <div>{user.name}</div>;
}
```

**4. 새로운 Root API**

```javascript
// React 17
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// React 18
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);

// Unmount도 변경
root.unmount();
```

**5. Strict Mode 강화**

개발 모드에서 컴포넌트를 두 번 마운트하여 side effect를 감지합니다.

```javascript
<React.StrictMode>
  <App />
</React.StrictMode>

// Effect가 두 번 실행됨
useEffect(() => {
  console.log('Mount');  // 개발 모드에서 2번 출력
  return () => console.log('Unmount');
}, []);
```

**6. useId Hook**

서버/클라이언트에서 일관된 고유 ID를 생성합니다.

```javascript
function FormField() {
  const id = useId();

  return (
    <>
      <label htmlFor={id}>Name:</label>
      <input id={id} type="text" />
    </>
  );
}
```

**7. useSyncExternalStore Hook**

외부 스토어와 동기화하는 Hook입니다.

```javascript
import { useSyncExternalStore } from 'react';

function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine,
    () => true  // 서버 사이드 스냅샷
  );
}

function App() {
  const isOnline = useOnlineStatus();
  return <div>{isOnline ? 'Online' : 'Offline'}</div>;
}
```

**8. Server Components (실험적)**

서버에서만 실행되는 컴포넌트를 작성할 수 있습니다.

```javascript
// Note.server.js
async function Note({ id }) {
  const note = await db.notes.get(id);  // 서버에서만 실행
  return <div>{note.content}</div>;
}
```

**성능 개선:**

- **Automatic Batching**: 불필요한 리렌더링 50% 감소
- **Transitions**: 인터랙션 응답성 향상
- **SSR with Suspense**: 초기 로딩 시간 단축

**마이그레이션:**

대부분의 앱은 코드 변경 없이 업그레이드 가능합니다. `ReactDOM.render`를 `createRoot`로 변경하면 됩니다.

React 18은 동시성 렌더링을 통해 더 부드러운 사용자 경험을 제공하며, 앞으로의 React 발전을 위한 기반을 마련했습니다."""

    # 카드 #62: useTransition과 useDeferredValue 사용 시점
    cards[61]['answer'] = """useTransition과 useDeferredValue는 React 18의 동시성 기능으로, UI 업데이트의 우선순위를 관리합니다. 비슷해 보이지만 사용 시나리오가 다릅니다.

**useTransition**

**개념:**
상태 업데이트를 "긴급하지 않은" 업데이트로 마킹합니다. React는 더 중요한 업데이트를 먼저 처리합니다.

**사용 시점:**
자신이 **제어하는 상태 업데이트**를 지연시키고 싶을 때 사용합니다.

**기본 사용법:**
```javascript
import { useState, useTransition } from 'react';

function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    const value = e.target.value;

    // 긴급: 입력 필드 즉시 업데이트
    setQuery(value);

    // 비긴급: 검색 결과는 나중에 업데이트
    startTransition(() => {
      const filtered = hugeList.filter(item =>
        item.includes(value)
      );
      setResults(filtered);
    });
  };

  return (
    <>
      <input value={query} onChange={handleSearch} />
      {isPending && <Spinner />}
      <SearchResults results={results} />
    </>
  );
}
```

**실전 예제 - 탭 전환:**
```javascript
function Tabs() {
  const [tab, setTab] = useState('about');
  const [isPending, startTransition] = useTransition();

  const selectTab = (nextTab) => {
    startTransition(() => {
      setTab(nextTab);  // 무거운 탭도 UI를 블로킹하지 않음
    });
  };

  return (
    <>
      <button onClick={() => selectTab('about')}>About</button>
      <button onClick={() => selectTab('posts')}>
        Posts {isPending && <Spinner />}
      </button>
      <button onClick={() => selectTab('contact')}>Contact</button>

      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}  {/* 매우 무거운 컴포넌트 */}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

**useDeferredValue**

**개념:**
값의 업데이트를 지연시킵니다. React는 긴급한 업데이트를 먼저 처리하고 나중에 이 값을 업데이트합니다.

**사용 시점:**
**외부에서 받은 prop이나 값**을 지연시키고 싶을 때 사용합니다. 상태 업데이트를 직접 제어할 수 없을 때 유용합니다.

**기본 사용법:**
```javascript
import { useState, useDeferredValue } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <SearchResults query={deferredQuery} />
    </>
  );
}

function SearchResults({ query }) {
  // query가 변경되어도 긴급한 업데이트가 끝날 때까지 대기
  const results = useMemo(() => {
    return hugeList.filter(item => item.includes(query));
  }, [query]);

  return <div>{results.map(...)}</div>;
}
```

**실전 예제 - 실시간 검색:**
```javascript
function ProductSearch() {
  const [input, setInput] = useState('');
  const deferredInput = useDeferredValue(input);
  const isStale = input !== deferredInput;

  return (
    <>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search products..."
      />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <ProductList query={deferredInput} />
      </div>
    </>
  );
}
```

**두 Hook의 비교:**

| 특징 | useTransition | useDeferredValue |
|------|---------------|------------------|
| **제어 대상** | 상태 업데이트 함수 | 값 자체 |
| **사용 상황** | setState를 감싸서 사용 | prop이나 값을 지연 |
| **isPending** | 제공됨 | 제공 안 됨 (직접 비교) |
| **예제** | 버튼 클릭, 탭 전환 | 검색 입력, 필터링 |

**언제 어떤 것을 사용할까?**

**useTransition을 사용하세요:**
```javascript
// 1. 상태 업데이트를 직접 제어할 때
const [tab, setTab] = useState('home');
startTransition(() => {
  setTab('profile');  // ✅ 직접 제어
});

// 2. 로딩 상태가 필요할 때
const [isPending, startTransition] = useTransition();
{isPending && <Spinner />}  // ✅ 로딩 표시

// 3. 사용자 액션에 반응할 때
<button onClick={() => startTransition(() => setPage(2))}>
  Next Page
</button>
```

**useDeferredValue를 사용하세요:**
```javascript
// 1. 외부 prop을 받을 때
function ChildComponent({ externalValue }) {
  const deferred = useDeferredValue(externalValue);  // ✅ prop 지연
  // ...
}

// 2. 값만 지연하고 싶을 때
const deferredQuery = useDeferredValue(searchQuery);  // ✅ 값만 지연

// 3. 의존성이 복잡할 때
const deferredFilters = useDeferredValue(complexFilters);  // ✅ 객체도 가능
```

**실무 팁:**

**1. 디바운스 대체:**
```javascript
// 기존 디바운스
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 500);

// useDeferredValue로 대체 (더 스마트함)
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);
// React가 자동으로 최적의 타이밍 결정
```

**2. 조합 사용:**
```javascript
function App() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);  // 즉시 업데이트

    startTransition(() => {
      // 추가 무거운 작업
      updateAnalytics(value);
    });
  };

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <Results query={deferredQuery} />
    </>
  );
}
```

**3. 성능 측정:**
```javascript
import { Profiler } from 'react';

<Profiler id="search" onRender={(id, phase, duration) => {
  console.log(`${id} ${phase}: ${duration}ms`);
}}>
  <SearchResults query={deferredQuery} />
</Profiler>
```

**주의사항:**

1. **남용 금지**: 모든 상태 업데이트에 사용하지 마세요. 정말 무거운 작업에만 사용하세요.

2. **접근성**: 로딩 상태를 명확히 표시하여 사용자가 앱이 작동 중임을 알 수 있게 하세요.

3. **Memoization 필수**: useDeferredValue와 함께 useMemo를 사용하지 않으면 효과가 없습니다.

```javascript
// ❌ 나쁜 예
function List({ query }) {
  const items = heavyComputation(query);  // 매번 계산
  return <div>{items}</div>;
}

// ✅ 좋은 예
function List({ query }) {
  const items = useMemo(() => heavyComputation(query), [query]);
  return <div>{items}</div>;
}
```

useTransition과 useDeferredValue는 사용자 경험을 크게 향상시킬 수 있는 강력한 도구입니다. 앱이 항상 반응성 있게 느껴지도록 도와줍니다."""

    # 파일 저장
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✅ React.json 카드 #61-62 답변 추가 완료!")
    return True

if __name__ == '__main__':
    print("Spring.json 답변 추가 중...")
    add_spring_answers()

    print("\n" + "="*80)
    print("React.json 질문 확인 중...")
    add_react_answers()
