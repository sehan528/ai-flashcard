import type {CardSet, FlashCard} from '../dtos/FlashCard';

const STORAGE_KEY = 'ai-flashcard-sets';

export class FlashcardStorage {

    // 모든 카드셋 가져오기
    static getCardSets(): CardSet[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return [];

            const parsed = JSON.parse(data);
            // Date 객체 복원
            return parsed.map((set: any) => ({
                ...set,
                createdAt: new Date(set.createdAt),
                lastStudied: set.lastStudied ? new Date(set.lastStudied) : undefined,
                cards: set.cards.map((card: any) => ({
                    ...card,
                    createdAt: new Date(card.createdAt)
                }))
            }));
        } catch (error) {
            console.error('카드셋 로드 실패:', error);
            return [];
        }
    }

    // 모든 카드셋 저장하기
    static saveCardSets(cardSets: CardSet[]): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cardSets));
        } catch (error) {
            console.error('카드셋 저장 실패:', error);
            throw new Error('저장에 실패했습니다.');
        }
    }

    // 새 카드셋 추가
    static addCardSet(cardSet: CardSet): void {
        const cardSets = this.getCardSets();
        cardSets.push(cardSet);
        this.saveCardSets(cardSets);
    }

    // 카드셋에 카드 추가
    static addCardToSet(cardSetId: string, card: FlashCard): void {
        const cardSets = this.getCardSets();
        const setIndex = cardSets.findIndex(set => set.id === cardSetId);

        if (setIndex === -1) {
            throw new Error('카드셋을 찾을 수 없습니다.');
        }

        cardSets[setIndex].cards.push(card);
        this.saveCardSets(cardSets);
    }

    // 고유 ID 생성
    static generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // 개발용: 샘플 데이터 생성
    static createSampleData(): void {
        const sampleCardSet: CardSet = {
            id: this.generateId(),
            name: "JavaScript 기초",
            description: "JavaScript 기본 개념들",
            createdAt: new Date(),
            cards: [
                {
                    id: this.generateId(),
                    question: "호이스팅이란 무엇인가요?",
                    answer: "변수와 함수 선언이 스코프 최상단으로 끌어올려지는 JavaScript의 특성",
                    type: "essay",
                    tags: ["JavaScript", "호이스팅"],
                    createdAt: new Date(),
                    studyCount: 0
                },
                {
                    id: this.generateId(),
                    question: "다음 중 falsy 값이 아닌 것은?",
                    answer: ["0", "''", "[]", "null"],
                    type: "multiple",
                    correctIndex: 2, // "[]"가 정답
                    tags: ["JavaScript", "타입"],
                    createdAt: new Date(),
                    studyCount: 0
                }
            ]
        };

        this.addCardSet(sampleCardSet);
        console.log('샘플 데이터 생성 완료!');
    }

    // 개발용: 면접 대비 테스트 데이터 생성
    static createInterviewTestData(): void {
        const cardSets: CardSet[] = [
            // 1. Java 기초
            {
                id: this.generateId(),
                name: "Java 기초",
                description: "Java 기본 개념 및 문법",
                createdAt: new Date(),
                cards: [
                    {
                        id: this.generateId(),
                        question: "JDK, JRE, JVM의 차이점을 설명하세요.",
                        answer: "JDK는 Java Development Kit로 개발 도구 포함, JRE는 Java Runtime Environment로 실행 환경, JVM은 Java Virtual Machine으로 바이트코드를 실행하는 가상머신입니다.",
                        type: "essay",
                        tags: ["Java", "기초", "JDK", "JRE", "JVM"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 Java의 기본 자료형(Primitive Type)이 아닌 것은?",
                        answer: ["int", "boolean", "String", "double"],
                        type: "multiple",
                        correctIndex: 2,
                        tags: ["Java", "자료형"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "equals()와 ==의 차이점을 설명하세요.",
                        answer: "==는 참조 주소를 비교하고, equals()는 객체의 내용(값)을 비교합니다. 기본 자료형은 ==로 비교하고, 객체는 equals()로 비교해야 합니다.",
                        type: "essay",
                        tags: ["Java", "비교", "equals"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "String, StringBuilder, StringBuffer의 차이점을 설명하세요.",
                        answer: "String은 불변(immutable) 객체이고, StringBuilder와 StringBuffer는 가변(mutable)입니다. StringBuilder는 동기화를 지원하지 않아 빠르고, StringBuffer는 동기화를 지원하여 thread-safe합니다.",
                        type: "essay",
                        tags: ["Java", "String", "성능"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "Overloading과 Overriding의 차이점을 설명하세요.",
                        answer: "Overloading은 같은 이름의 메서드를 매개변수를 다르게 하여 여러 개 정의하는 것이고, Overriding은 상위 클래스의 메서드를 하위 클래스에서 재정의하는 것입니다.",
                        type: "essay",
                        tags: ["Java", "OOP", "상속"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "Java에서 final 키워드의 역할은?",
                        answer: ["변수 재할당 방지", "메서드 오버라이딩 방지", "클래스 상속 방지", "위 모두"],
                        type: "multiple",
                        correctIndex: 3,
                        tags: ["Java", "키워드", "final"],
                        createdAt: new Date(),
                        studyCount: 0
                    }
                ]
            },

            // 2. Java 고급
            {
                id: this.generateId(),
                name: "Java 고급 (JVM, GC)",
                description: "JVM 내부 동작 및 메모리 관리",
                createdAt: new Date(),
                cards: [
                    {
                        id: this.generateId(),
                        question: "JVM의 메모리 구조를 설명하세요.",
                        answer: "Method Area(클래스 정보), Heap(객체 인스턴스), Stack(메서드 호출 및 지역변수), PC Register(현재 수행 중인 명령 주소), Native Method Stack으로 구성됩니다.",
                        type: "essay",
                        tags: ["Java", "JVM", "메모리"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "Garbage Collection의 동작 원리를 설명하세요.",
                        answer: "더 이상 참조되지 않는 객체를 자동으로 메모리에서 제거하는 메커니즘입니다. Mark and Sweep 알고리즘을 사용하며, Young Generation과 Old Generation으로 나누어 관리합니다.",
                        type: "essay",
                        tags: ["Java", "GC", "메모리"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 GC의 종류가 아닌 것은?",
                        answer: ["Serial GC", "Parallel GC", "CMS GC", "Linear GC"],
                        type: "multiple",
                        correctIndex: 3,
                        tags: ["Java", "GC"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "Java 8의 주요 특징을 설명하세요.",
                        answer: "Lambda 표현식, Stream API, Optional, 인터페이스의 default 메서드, 새로운 날짜/시간 API(LocalDateTime), Functional Interface 등이 추가되었습니다.",
                        type: "essay",
                        tags: ["Java", "Java8", "Lambda"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "리플렉션(Reflection)이란 무엇이며, 언제 사용하나요?",
                        answer: "런타임에 클래스의 정보를 분석하고 조작할 수 있는 기능입니다. 프레임워크(Spring, Hibernate)에서 동적으로 객체를 생성하거나, 테스트 프레임워크에서 사용됩니다.",
                        type: "essay",
                        tags: ["Java", "Reflection", "고급"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 Java의 동시성 프로그래밍 도구가 아닌 것은?",
                        answer: ["synchronized", "volatile", "async/await", "ReentrantLock"],
                        type: "multiple",
                        correctIndex: 2,
                        tags: ["Java", "동시성", "멀티스레드"],
                        createdAt: new Date(),
                        studyCount: 0
                    }
                ]
            },

            // 3. Spring 기초
            {
                id: this.generateId(),
                name: "Spring 기초",
                description: "Spring Framework 핵심 개념",
                createdAt: new Date(),
                cards: [
                    {
                        id: this.generateId(),
                        question: "Spring Framework의 핵심 개념인 IoC(Inversion of Control)를 설명하세요.",
                        answer: "제어의 역전으로, 객체의 생성과 생명주기 관리를 개발자가 아닌 Spring Container가 담당합니다. 이를 통해 결합도를 낮추고 유연한 코드를 작성할 수 있습니다.",
                        type: "essay",
                        tags: ["Spring", "IoC", "DI"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "DI(Dependency Injection)의 세 가지 방법을 설명하세요.",
                        answer: "생성자 주입(Constructor Injection), 세터 주입(Setter Injection), 필드 주입(Field Injection)이 있습니다. 생성자 주입이 권장됩니다.",
                        type: "essay",
                        tags: ["Spring", "DI", "의존성주입"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 Spring Bean의 기본 스코프는?",
                        answer: ["singleton", "prototype", "request", "session"],
                        type: "multiple",
                        correctIndex: 0,
                        tags: ["Spring", "Bean", "스코프"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "@Component, @Service, @Repository, @Controller의 차이점을 설명하세요.",
                        answer: "@Component는 일반적인 컴포넌트, @Service는 비즈니스 로직, @Repository는 데이터 접근 계층, @Controller는 웹 계층을 나타냅니다. 모두 @Component를 상속하지만 역할에 따라 구분하여 사용합니다.",
                        type: "essay",
                        tags: ["Spring", "Annotation", "계층"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "Spring Boot와 Spring Framework의 차이점을 설명하세요.",
                        answer: "Spring Boot는 Spring Framework를 쉽게 사용할 수 있도록 자동 설정(Auto Configuration)과 내장 서버를 제공합니다. 설정이 간소화되고 빠르게 개발을 시작할 수 있습니다.",
                        type: "essay",
                        tags: ["Spring", "SpringBoot", "차이점"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 Spring MVC의 구성 요소가 아닌 것은?",
                        answer: ["DispatcherServlet", "HandlerMapping", "ViewResolver", "SessionFactory"],
                        type: "multiple",
                        correctIndex: 3,
                        tags: ["Spring", "MVC"],
                        createdAt: new Date(),
                        studyCount: 0
                    }
                ]
            },

            // 4. Spring 고급
            {
                id: this.generateId(),
                name: "Spring 고급 (AOP, Transaction)",
                description: "AOP, 트랜잭션, JPA 등 고급 주제",
                createdAt: new Date(),
                cards: [
                    {
                        id: this.generateId(),
                        question: "AOP(Aspect-Oriented Programming)란 무엇이며, 언제 사용하나요?",
                        answer: "관심사의 분리를 통해 핵심 로직과 부가 기능을 분리하는 프로그래밍 패러다임입니다. 로깅, 트랜잭션, 보안 등 횡단 관심사(Cross-cutting Concerns)를 처리할 때 사용합니다.",
                        type: "essay",
                        tags: ["Spring", "AOP", "고급"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "@Transactional의 동작 원리를 설명하세요.",
                        answer: "Spring AOP를 통해 프록시 패턴으로 구현됩니다. 메서드 시작 시 트랜잭션을 시작하고, 정상 종료 시 commit, 예외 발생 시 rollback합니다.",
                        type: "essay",
                        tags: ["Spring", "Transaction", "AOP"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 @Transactional의 전파 속성(Propagation)이 아닌 것은?",
                        answer: ["REQUIRED", "REQUIRES_NEW", "SUPPORTS", "INHERITS"],
                        type: "multiple",
                        correctIndex: 3,
                        tags: ["Spring", "Transaction", "전파속성"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "JPA의 영속성 컨텍스트(Persistence Context)란 무엇인가요?",
                        answer: "엔티티를 영구 저장하는 환경으로, 1차 캐시, 동일성 보장, 쓰기 지연, 변경 감지(Dirty Checking), 지연 로딩 등의 기능을 제공합니다.",
                        type: "essay",
                        tags: ["Spring", "JPA", "영속성"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "N+1 문제란 무엇이며, 어떻게 해결하나요?",
                        answer: "연관된 엔티티를 조회할 때 추가 쿼리가 N번 발생하는 문제입니다. Fetch Join, @EntityGraph, Batch Size 설정 등으로 해결할 수 있습니다.",
                        type: "essay",
                        tags: ["Spring", "JPA", "성능"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 JPA의 엔티티 상태가 아닌 것은?",
                        answer: ["비영속(new)", "영속(managed)", "준영속(detached)", "완전영속(persistent)"],
                        type: "multiple",
                        correctIndex: 3,
                        tags: ["Spring", "JPA", "엔티티"],
                        createdAt: new Date(),
                        studyCount: 0
                    }
                ]
            },

            // 5. 데이터베이스
            {
                id: this.generateId(),
                name: "데이터베이스",
                description: "DB 기본 개념 및 최적화",
                createdAt: new Date(),
                cards: [
                    {
                        id: this.generateId(),
                        question: "정규화(Normalization)란 무엇이며, 왜 필요한가요?",
                        answer: "데이터 중복을 최소화하고 데이터 무결성을 유지하기 위해 테이블을 분해하는 과정입니다. 제1정규형부터 제5정규형까지 있으며, 보통 제3정규형까지 정규화합니다.",
                        type: "essay",
                        tags: ["DB", "정규화", "설계"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "인덱스(Index)의 동작 원리와 장단점을 설명하세요.",
                        answer: "B-Tree 구조로 데이터를 정렬하여 검색 속도를 향상시킵니다. 장점은 조회 속도 향상, 단점은 추가/수정/삭제 시 오버헤드와 추가 저장 공간 필요입니다.",
                        type: "essay",
                        tags: ["DB", "인덱스", "성능"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 ACID 원칙이 아닌 것은?",
                        answer: ["Atomicity", "Consistency", "Isolation", "Availability"],
                        type: "multiple",
                        correctIndex: 3,
                        tags: ["DB", "ACID", "트랜잭션"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "클러스터드 인덱스와 논클러스터드 인덱스의 차이점을 설명하세요.",
                        answer: "클러스터드 인덱스는 데이터를 물리적으로 정렬하여 저장하며 테이블당 1개만 존재합니다. 논클러스터드 인덱스는 별도의 인덱스 테이블을 생성하며 여러 개 생성 가능합니다.",
                        type: "essay",
                        tags: ["DB", "인덱스", "종류"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "트랜잭션 격리 수준(Isolation Level)을 설명하세요.",
                        answer: "READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE 4단계가 있습니다. 레벨이 높을수록 일관성이 높지만 동시성이 낮아집니다.",
                        type: "essay",
                        tags: ["DB", "격리수준", "트랜잭션"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 NoSQL 데이터베이스가 아닌 것은?",
                        answer: ["MongoDB", "Redis", "Cassandra", "PostgreSQL"],
                        type: "multiple",
                        correctIndex: 3,
                        tags: ["DB", "NoSQL"],
                        createdAt: new Date(),
                        studyCount: 0
                    }
                ]
            },

            // 6. 네트워크
            {
                id: this.generateId(),
                name: "네트워크",
                description: "네트워크 기본 개념 및 웹 통신",
                createdAt: new Date(),
                cards: [
                    {
                        id: this.generateId(),
                        question: "HTTP와 HTTPS의 차이점을 설명하세요.",
                        answer: "HTTP는 평문 통신이고, HTTPS는 SSL/TLS를 통해 암호화된 통신을 제공합니다. HTTPS는 443 포트를 사용하며 보안성이 높습니다.",
                        type: "essay",
                        tags: ["네트워크", "HTTP", "보안"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "REST API의 특징과 설계 원칙을 설명하세요.",
                        answer: "자원(Resource), 행위(Verb), 표현(Representation)으로 구성됩니다. URI는 명사로, HTTP Method(GET, POST, PUT, DELETE)로 행위를 표현하며, Stateless하고 Cacheable합니다.",
                        type: "essay",
                        tags: ["네트워크", "REST", "API"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 HTTP 상태 코드의 의미가 잘못된 것은?",
                        answer: ["200: 성공", "404: 찾을 수 없음", "500: 서버 오류", "302: 영구 이동"],
                        type: "multiple",
                        correctIndex: 3,
                        tags: ["네트워크", "HTTP", "상태코드"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "TCP와 UDP의 차이점을 설명하세요.",
                        answer: "TCP는 연결 지향적이고 신뢰성 있는 전송을 보장하며, 3-way handshake를 사용합니다. UDP는 비연결형이고 빠르지만 신뢰성을 보장하지 않습니다.",
                        type: "essay",
                        tags: ["네트워크", "TCP", "UDP"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "CORS(Cross-Origin Resource Sharing)란 무엇이며, 왜 발생하나요?",
                        answer: "다른 출처(도메인, 프로토콜, 포트)의 리소스에 접근할 때 발생하는 보안 정책입니다. 브라우저가 Same-Origin Policy를 적용하여 보안을 강화하기 위해 발생합니다.",
                        type: "essay",
                        tags: ["네트워크", "CORS", "보안"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 OSI 7계층이 아닌 것은?",
                        answer: ["응용 계층", "표현 계층", "네트워크 계층", "보안 계층"],
                        type: "multiple",
                        correctIndex: 3,
                        tags: ["네트워크", "OSI"],
                        createdAt: new Date(),
                        studyCount: 0
                    }
                ]
            },

            // 7. 운영체제
            {
                id: this.generateId(),
                name: "운영체제",
                description: "프로세스, 스레드, 메모리 관리",
                createdAt: new Date(),
                cards: [
                    {
                        id: this.generateId(),
                        question: "프로세스와 스레드의 차이점을 설명하세요.",
                        answer: "프로세스는 실행 중인 프로그램으로 독립적인 메모리 공간을 가집니다. 스레드는 프로세스 내의 실행 단위로 Stack만 독립적이고 Code, Data, Heap은 공유합니다.",
                        type: "essay",
                        tags: ["OS", "프로세스", "스레드"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "데드락(Deadlock)이란 무엇이며, 발생 조건 4가지를 설명하세요.",
                        answer: "두 개 이상의 프로세스가 서로의 자원을 기다리며 무한 대기하는 상태입니다. 상호배제, 점유와 대기, 비선점, 순환 대기 4가지 조건이 모두 충족되면 발생합니다.",
                        type: "essay",
                        tags: ["OS", "데드락", "동기화"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 CPU 스케줄링 알고리즘이 아닌 것은?",
                        answer: ["FCFS", "SJF", "Round Robin", "Binary Search"],
                        type: "multiple",
                        correctIndex: 3,
                        tags: ["OS", "스케줄링"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "가상 메모리(Virtual Memory)란 무엇이며, 왜 사용하나요?",
                        answer: "물리 메모리보다 큰 프로그램을 실행하기 위해 디스크 일부를 메모리처럼 사용하는 기법입니다. 페이징과 세그멘테이션을 통해 구현되며, 메모리 효율성을 높입니다.",
                        type: "essay",
                        tags: ["OS", "메모리", "가상메모리"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "페이지 교체 알고리즘 중 LRU와 LFU를 설명하세요.",
                        answer: "LRU(Least Recently Used)는 가장 오래 사용되지 않은 페이지를 교체하고, LFU(Least Frequently Used)는 가장 적게 사용된 페이지를 교체합니다.",
                        type: "essay",
                        tags: ["OS", "페이지교체", "알고리즘"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 프로세스 간 통신(IPC) 방법이 아닌 것은?",
                        answer: ["파이프", "메시지 큐", "공유 메모리", "가상 메모리"],
                        type: "multiple",
                        correctIndex: 3,
                        tags: ["OS", "IPC", "통신"],
                        createdAt: new Date(),
                        studyCount: 0
                    }
                ]
            },

            // 8. 자료구조
            {
                id: this.generateId(),
                name: "자료구조",
                description: "필수 자료구조와 시간복잡도",
                createdAt: new Date(),
                cards: [
                    {
                        id: this.generateId(),
                        question: "Array와 LinkedList의 차이점과 시간복잡도를 설명하세요.",
                        answer: "Array는 연속된 메모리 공간에 저장되어 인덱스 접근이 O(1)이지만 삽입/삭제가 O(n)입니다. LinkedList는 노드로 연결되어 삽입/삭제가 O(1)이지만 탐색이 O(n)입니다.",
                        type: "essay",
                        tags: ["자료구조", "배열", "링크드리스트"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "Stack과 Queue의 차이점과 활용 사례를 설명하세요.",
                        answer: "Stack은 LIFO(Last In First Out) 구조로 함수 호출, 괄호 검사 등에 사용됩니다. Queue는 FIFO(First In First Out) 구조로 BFS, 프린터 대기열 등에 사용됩니다.",
                        type: "essay",
                        tags: ["자료구조", "스택", "큐"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 HashMap의 평균 시간복잡도는?",
                        answer: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                        type: "multiple",
                        correctIndex: 0,
                        tags: ["자료구조", "해시맵", "시간복잡도"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "이진 탐색 트리(BST)의 특징과 시간복잡도를 설명하세요.",
                        answer: "왼쪽 자식은 부모보다 작고, 오른쪽 자식은 부모보다 큰 트리입니다. 평균 시간복잡도는 O(log n)이지만, 편향 트리의 경우 O(n)이 될 수 있습니다.",
                        type: "essay",
                        tags: ["자료구조", "BST", "트리"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "해시 충돌(Hash Collision)을 해결하는 방법을 설명하세요.",
                        answer: "체이닝(Chaining)은 같은 해시값을 가진 요소들을 링크드리스트로 연결하고, 개방 주소법(Open Addressing)은 다른 빈 버킷을 찾아 저장합니다.",
                        type: "essay",
                        tags: ["자료구조", "해시", "충돌"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 힙(Heap)의 특징이 아닌 것은?",
                        answer: ["완전 이진 트리", "부모가 자식보다 크거나 작음", "정렬된 구조", "우선순위 큐 구현"],
                        type: "multiple",
                        correctIndex: 2,
                        tags: ["자료구조", "힙"],
                        createdAt: new Date(),
                        studyCount: 0
                    }
                ]
            },

            // 9. 알고리즘
            {
                id: this.generateId(),
                name: "알고리즘",
                description: "정렬, 탐색, 그래프 알고리즘",
                createdAt: new Date(),
                cards: [
                    {
                        id: this.generateId(),
                        question: "퀵 정렬(Quick Sort)의 동작 원리와 시간복잡도를 설명하세요.",
                        answer: "피벗을 선택하여 피벗보다 작은 값은 왼쪽, 큰 값은 오른쪽으로 분할하는 분할정복 알고리즘입니다. 평균 O(n log n), 최악 O(n²)의 시간복잡도를 가집니다.",
                        type: "essay",
                        tags: ["알고리즘", "정렬", "퀵정렬"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "BFS와 DFS의 차이점과 활용 사례를 설명하세요.",
                        answer: "BFS는 너비 우선 탐색으로 최단 경로 탐색에 사용되고, DFS는 깊이 우선 탐색으로 모든 경로 탐색, 사이클 검사 등에 사용됩니다.",
                        type: "essay",
                        tags: ["알고리즘", "BFS", "DFS"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 안정 정렬(Stable Sort)이 아닌 것은?",
                        answer: ["병합 정렬", "버블 정렬", "퀵 정렬", "삽입 정렬"],
                        type: "multiple",
                        correctIndex: 2,
                        tags: ["알고리즘", "정렬", "안정성"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "동적 계획법(Dynamic Programming)이란 무엇이며, 언제 사용하나요?",
                        answer: "큰 문제를 작은 부분 문제로 나누어 해결하고, 결과를 저장(Memoization)하여 재사용하는 기법입니다. 최적 부분 구조와 중복 부분 문제가 있을 때 사용합니다.",
                        type: "essay",
                        tags: ["알고리즘", "DP", "동적계획법"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "이진 탐색(Binary Search)의 시간복잡도와 전제조건을 설명하세요.",
                        answer: "정렬된 배열에서 중간값과 비교하여 탐색 범위를 절반씩 줄이는 알고리즘입니다. 시간복잡도는 O(log n)이며, 반드시 정렬된 배열이어야 합니다.",
                        type: "essay",
                        tags: ["알고리즘", "이진탐색", "탐색"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 최단 경로 알고리즘이 아닌 것은?",
                        answer: ["다익스트라", "벨만-포드", "플로이드-워셜", "크루스칼"],
                        type: "multiple",
                        correctIndex: 3,
                        tags: ["알고리즘", "그래프", "최단경로"],
                        createdAt: new Date(),
                        studyCount: 0
                    }
                ]
            },

            // 10. 디자인 패턴
            {
                id: this.generateId(),
                name: "디자인 패턴",
                description: "GoF 디자인 패턴 및 아키텍처",
                createdAt: new Date(),
                cards: [
                    {
                        id: this.generateId(),
                        question: "싱글톤 패턴(Singleton Pattern)이란 무엇이며, 구현 방법을 설명하세요.",
                        answer: "클래스의 인스턴스가 하나만 존재하도록 보장하는 패턴입니다. private 생성자와 static 메서드를 사용하며, Thread-safe를 위해 동기화 처리나 Bill Pugh Solution을 사용합니다.",
                        type: "essay",
                        tags: ["디자인패턴", "싱글톤", "GoF"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "팩토리 패턴(Factory Pattern)과 추상 팩토리 패턴의 차이점을 설명하세요.",
                        answer: "팩토리 패턴은 객체 생성을 서브클래스에 위임하고, 추상 팩토리 패턴은 관련된 객체들의 군을 생성합니다. 추상 팩토리는 여러 팩토리를 그룹화한 상위 개념입니다.",
                        type: "essay",
                        tags: ["디자인패턴", "팩토리", "생성패턴"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 구조 패턴(Structural Pattern)이 아닌 것은?",
                        answer: ["어댑터", "데코레이터", "프록시", "옵저버"],
                        type: "multiple",
                        correctIndex: 3,
                        tags: ["디자인패턴", "GoF", "분류"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "MVC, MVP, MVVM 패턴의 차이점을 설명하세요.",
                        answer: "MVC는 Controller가 Model과 View를 중재하고, MVP는 Presenter가 View와 1:1 관계로 완전히 분리하며, MVVM은 ViewModel이 데이터 바인딩을 통해 View와 연결됩니다.",
                        type: "essay",
                        tags: ["디자인패턴", "아키텍처", "MVC"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "전략 패턴(Strategy Pattern)이란 무엇이며, 언제 사용하나요?",
                        answer: "알고리즘을 캡슐화하여 런타임에 선택할 수 있도록 하는 패턴입니다. 여러 알고리즘이 있고 상황에 따라 교체가 필요할 때 사용하며, OCP 원칙을 따릅니다.",
                        type: "essay",
                        tags: ["디자인패턴", "전략패턴", "행위패턴"],
                        createdAt: new Date(),
                        studyCount: 0
                    },
                    {
                        id: this.generateId(),
                        question: "다음 중 SOLID 원칙이 아닌 것은?",
                        answer: ["단일 책임 원칙", "개방-폐쇄 원칙", "리스코프 치환 원칙", "최소 권한 원칙"],
                        type: "multiple",
                        correctIndex: 3,
                        tags: ["디자인패턴", "SOLID", "원칙"],
                        createdAt: new Date(),
                        studyCount: 0
                    }
                ]
            }
        ];

        // 모든 카드셋 저장
        cardSets.forEach(cardSet => {
            this.addCardSet(cardSet);
        });

        console.log('면접 대비 테스트 데이터 생성 완료! (총 10개 카드셋, 60개 카드)');
    }

    // Export: JSON 파일로 데이터 내보내기
    static exportToJSON(): string {
        const cardSets = this.getCardSets();
        return JSON.stringify(cardSets, null, 2);
    }

    // Export: JSON 파일 다운로드 (전체)
    static downloadAsJSON(): void {
        const jsonString = this.exportToJSON();
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        link.download = `flashcard-export-${timestamp}.json`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
    }

    // Export: 선택한 카드셋들을 각각 개별 JSON 파일로 다운로드
    static downloadSelectedCardSets(cardSetIds: string[]): void {
        const allCardSets = this.getCardSets();

        cardSetIds.forEach(id => {
            const cardSet = allCardSets.find(set => set.id === id);
            if (!cardSet) return;

            const jsonString = JSON.stringify(cardSet, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            // 파일명: 카드셋 이름 + 타임스탬프
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const safeName = cardSet.name.replace(/[^a-zA-Z0-9가-힣\s]/g, '').replace(/\s+/g, '-');
            link.download = `${safeName}-${timestamp}.json`;
            link.href = url;
            link.click();

            URL.revokeObjectURL(url);
        });
    }

    // Import: 단일 카드셋 유효성 검증
    static validateCardSet(set: any): { valid: boolean; error?: string } {
        // 기본 타입 체크
        if (typeof set !== 'object' || set === null) {
            return { valid: false, error: '올바른 플래시카드 형식이 아닙니다.' };
        }

        // 필수 필드 존재 여부 및 타입 체크
        if (typeof set.id !== 'string' || !set.id) {
            return { valid: false, error: '카드셋 ID가 올바르지 않습니다.' };
        }

        if (typeof set.name !== 'string' || !set.name) {
            return { valid: false, error: '카드셋 이름이 올바르지 않습니다.' };
        }

        if (!Array.isArray(set.cards)) {
            return { valid: false, error: '카드 목록이 배열 형태가 아닙니다.' };
        }

        // cards 배열이 비어있어도 허용 (빈 카드셋 가능)
        for (const card of set.cards) {
            // 카드 기본 타입 체크
            if (typeof card !== 'object' || card === null) {
                return { valid: false, error: '카드 데이터가 올바르지 않습니다.' };
            }

            // 필수 필드 타입 체크
            if (typeof card.id !== 'string' || !card.id) {
                return { valid: false, error: '카드 ID가 올바르지 않습니다.' };
            }

            if (typeof card.question !== 'string' || !card.question) {
                return { valid: false, error: '질문이 올바르지 않습니다.' };
            }

            if (!card.answer) {
                return { valid: false, error: '답변이 올바르지 않습니다.' };
            }

            if (typeof card.type !== 'string') {
                return { valid: false, error: '카드 타입이 올바르지 않습니다.' };
            }

            // 카드 타입 검증
            if (card.type !== 'essay' && card.type !== 'multiple') {
                return { valid: false, error: '카드 타입은 "essay" 또는 "multiple"이어야 합니다.' };
            }

            // 서술형 카드 검증
            if (card.type === 'essay' && typeof card.answer !== 'string') {
                return { valid: false, error: '서술형 카드의 답변은 문자열이어야 합니다.' };
            }

            // 객관식 카드 검증
            if (card.type === 'multiple') {
                if (!Array.isArray(card.answer)) {
                    return { valid: false, error: '객관식 카드의 답변은 배열이어야 합니다.' };
                }

                if (typeof card.correctIndex !== 'number') {
                    return { valid: false, error: '객관식 카드는 정답 인덱스가 필요합니다.' };
                }

                if (card.correctIndex < 0 || card.correctIndex >= card.answer.length) {
                    return { valid: false, error: '정답 인덱스가 유효하지 않습니다.' };
                }
            }

            // tags 필드 검증 (선택적)
            if (card.tags !== undefined && !Array.isArray(card.tags)) {
                return { valid: false, error: '태그는 배열 형태여야 합니다.' };
            }
        }

        return { valid: true };
    }

    // Import: JSON 데이터 유효성 검증 (배열 또는 단일 객체)
    static validateImportData(data: any): { valid: boolean; error?: string } {
        // 단일 카드셋 객체인 경우
        if (!Array.isArray(data)) {
            return this.validateCardSet(data);
        }

        // 카드셋 배열인 경우
        for (const set of data) {
            const validation = this.validateCardSet(set);
            if (!validation.valid) {
                return validation;
            }
        }

        return { valid: true };
    }

    // Import: JSON 문자열에서 데이터 가져오기 (배열 또는 단일 객체 지원)
    static importFromJSON(jsonString: string, mergeMode: 'merge' | 'replace' = 'merge'): {
        success: boolean;
        error?: string;
        importedCount?: number;
    } {
        try {
            const data = JSON.parse(jsonString);

            // 유효성 검증
            const validation = this.validateImportData(data);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }

            // 단일 카드셋을 배열로 변환
            const dataArray = Array.isArray(data) ? data : [data];

            // Date 객체 복원
            const importedCardSets: CardSet[] = dataArray.map((set: any) => ({
                ...set,
                createdAt: new Date(set.createdAt),
                lastStudied: set.lastStudied ? new Date(set.lastStudied) : undefined,
                cards: set.cards.map((card: any) => ({
                    ...card,
                    createdAt: new Date(card.createdAt)
                }))
            }));

            if (mergeMode === 'replace') {
                // 기존 데이터 덮어쓰기
                this.saveCardSets(importedCardSets);
            } else {
                // 기존 데이터와 병합 (중복 ID 제거)
                const existingCardSets = this.getCardSets();
                const existingIds = new Set(existingCardSets.map(set => set.id));

                const newCardSets = importedCardSets.filter(set => !existingIds.has(set.id));
                const mergedCardSets = [...existingCardSets, ...newCardSets];

                this.saveCardSets(mergedCardSets);
            }

            return {
                success: true,
                importedCount: mergeMode === 'replace' ? importedCardSets.length : importedCardSets.filter(set => !this.getCardSets().map(s => s.id).includes(set.id)).length
            };
        } catch (error) {
            console.error('Import 실패:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'JSON 파싱에 실패했습니다.'
            };
        }
    }

    // Import: 여러 JSON 파일을 동시에 가져오기
    static async importMultipleFiles(files: FileList): Promise<{
        success: boolean;
        totalImported: number;
        errors: string[];
    }> {
        let totalImported = 0;
        const errors: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // JSON 파일인지 확인
            if (!file.name.toLowerCase().endsWith('.json')) {
                errors.push(`${file.name}: JSON 파일이 아닙니다.`);
                continue;
            }

            try {
                const content = await file.text();

                // JSON 파싱 가능 여부 먼저 확인
                try {
                    JSON.parse(content);
                } catch (parseError) {
                    errors.push(`${file.name}: 올바른 JSON 형식이 아닙니다.`);
                    continue;
                }

                const result = this.importFromJSON(content, 'merge');

                if (result.success) {
                    totalImported += result.importedCount || 0;
                } else {
                    errors.push(`${file.name}: ${result.error}`);
                }
            } catch (error) {
                errors.push(`${file.name}: 파일 읽기 실패`);
            }
        }

        return {
            success: errors.length === 0,
            totalImported,
            errors
        };
    }

    // 모든 데이터 삭제
    static clearAllData(): void {
        localStorage.removeItem(STORAGE_KEY);
    }

    // 데이터 통계 정보
    static getStatistics(): {
        totalCardSets: number;
        totalCards: number;
        totalStudyCount: number;
    } {
        const cardSets = this.getCardSets();
        const totalCards = cardSets.reduce((sum, set) => sum + set.cards.length, 0);
        const totalStudyCount = cardSets.reduce((sum, set) =>
            sum + set.cards.reduce((cardSum, card) => cardSum + (card.studyCount || 0), 0), 0
        );

        return {
            totalCardSets: cardSets.length,
            totalCards,
            totalStudyCount
        };
    }
}