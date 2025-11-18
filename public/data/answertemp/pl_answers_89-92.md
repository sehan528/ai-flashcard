## 질문 89: Python의 동시성 처리 방법(Threading, Multiprocessing, Asyncio)을 비교해주세요.

**정의:**
Python은 Threading, Multiprocessing, Asyncio 세 가지 주요 동시성 처리 방법을 제공합니다. Threading은 단일 프로세스 내 여러 스레드, Multiprocessing은 여러 프로세스, Asyncio는 단일 스레드에서 협력적 멀티태스킹을 사용하며, 작업 유형에 따라 적절한 방법을 선택해야 합니다.

**특징/원리:**
- Threading: GIL로 인해 I/O-bound 작업에만 효과적이며 CPU-bound에는 부적합
- Multiprocessing: 별도 프로세스로 GIL 우회하여 CPU-bound 작업에 적합하지만 오버헤드 큼
- Asyncio: 이벤트 루프 기반으로 많은 I/O 작업을 효율적으로 처리하지만 CPU-bound에는 부적합

**Threading:**
- 사용: threading 모듈로 스레드 생성 및 관리
- GIL 제약: 한 번에 하나의 스레드만 Python 바이트코드 실행
- I/O 대기: I/O 작업 중에는 GIL을 해제하여 다른 스레드 실행 가능
- 공유 메모리: 스레드 간 메모리 공유로 통신 간편하지만 동기화 필요
- 컨텍스트 전환: 운영체제가 스레드 스케줄링하여 선점형 멀티태스킹

**Multiprocessing:**
- 사용: multiprocessing 모듈로 프로세스 생성 및 관리
- GIL 우회: 각 프로세스가 독립적인 GIL을 가져 진정한 병렬 실행
- CPU-bound: CPU 집약적 작업을 여러 코어에서 동시 실행
- 독립 메모리: 프로세스 간 메모리 독립적이어서 통신에 Queue, Pipe 필요
- 오버헤드: 프로세스 생성과 IPC 비용이 스레드보다 큼

**Asyncio:**
- 사용: asyncio 모듈과 async/await 문법 사용
- 이벤트 루프: 단일 스레드에서 이벤트 루프가 작업 스케줄링
- 협력적: 명시적으로 await할 때만 제어를 양보하는 협력형 멀티태스킹
- 높은 동시성: 수천 개의 동시 I/O 작업을 효율적으로 처리
- Non-blocking: I/O 대기 중에도 다른 작업 실행 가능

**선택 기준:**
- I/O-bound + 간단: Threading 사용, 스레드 풀로 관리
- I/O-bound + 고동시성: Asyncio 사용, 웹 서버나 크롤러에 적합
- CPU-bound: Multiprocessing 사용, 데이터 분석이나 계산 작업에 적합
- 혼합: 적절히 조합하여 사용, asyncio에서 CPU 작업을 ProcessPoolExecutor로 위임

**실무 활용:**
- 웹 크롤러는 asyncio로 많은 HTTP 요청을 동시에 처리
- 데이터 처리 파이프라인은 multiprocessing으로 병렬 계산
- 백그라운드 작업은 threading으로 간단하게 구현

---

## 질문 90: Python의 asyncio와 비동기 프로그래밍에 대해 설명해주세요.

**정의:**
asyncio는 Python의 표준 라이브러리로 async/await 문법을 사용하여 비동기 프로그래밍을 지원합니다. 이벤트 루프 기반으로 I/O-bound 작업을 효율적으로 처리하며, 단일 스레드에서 수천 개의 동시 작업을 관리할 수 있습니다.

**특징/원리:**
- 이벤트 루프: 작업을 스케줄링하고 실행하는 핵심 구성 요소
- 코루틴: async def로 정의되며 await로 실행을 중단하고 재개 가능
- Non-blocking: I/O 대기 중에도 다른 작업 실행하여 CPU 효율성 향상
- 단일 스레드: 스레드 안전 문제 없이 많은 동시 작업 처리

**async/await 문법:**
- async def: 코루틴 함수를 정의하며 호출 시 코루틴 객체 반환
- await: 코루틴이나 Future가 완료될 때까지 대기하며 제어를 양보
- 비동기 컨텍스트: async with와 async for로 비동기 컨텍스트 매니저와 이터레이터 사용
- 제약: await는 async 함수 내에서만 사용 가능

**핵심 개념:**
- Task: 코루틴을 이벤트 루프에서 실행하는 래퍼
- Future: 비동기 작업의 최종 결과를 나타내는 저수준 객체
- create_task(): 코루틴을 Task로 래핑하여 이벤트 루프에 스케줄
- gather(): 여러 코루틴을 동시에 실행하고 모든 결과를 기다림

**이벤트 루프:**
- asyncio.run(): 이벤트 루프를 생성하고 코루틴 실행 후 정리
- get_event_loop(): 현재 이벤트 루프 가져오기
- run_until_complete(): 코루틴이 완료될 때까지 이벤트 루프 실행
- 스케줄링: 코루틴, 콜백, Task를 관리하고 실행

**동시성 제어:**
- Semaphore: 동시 실행 가능한 작업 수 제한
- Lock: 공유 리소스에 대한 배타적 접근 보장
- Queue: 비동기 생산자-소비자 패턴 구현
- Event: 스레드 간 신호 전달

**주의사항:**
- 블로킹 작업: 블로킹 I/O나 CPU 작업은 run_in_executor()로 스레드/프로세스 풀에 위임
- 동기 코드 통합: 동기 라이브러리를 직접 사용하면 전체 이벤트 루프 블로킹
- 디버깅: 비동기 코드는 디버깅이 어려우므로 로깅과 테스트 중요

**실무 활용:**
- 비동기 웹 프레임워크(FastAPI, aiohttp)로 높은 동시성의 웹 서버 구축
- 웹 스크래핑 시 aiohttp로 수백 개의 페이지를 동시에 다운로드
- 마이크로서비스 간 비동기 통신으로 응답성 향상

---

## 질문 91: Python 2와 Python 3의 주요 차이점은 무엇인가요?

**정의:**
Python 3는 2008년에 출시된 메이저 버전으로, Python 2와의 하위 호환성을 깨고 언어의 일관성과 현대성을 개선했습니다. 2020년에 Python 2 지원이 종료되었으며, 현재는 Python 3만 사용이 권장됩니다.

**특징/원리:**
- 하위 호환 불가: Python 2 코드가 Python 3에서 바로 실행되지 않을 수 있음
- 점진적 개선: Python 3가 계속 발전하며 새로운 기능 추가
- 마이그레이션 도구: 2to3, six 등의 도구로 마이그레이션 지원
- 지원 종료: Python 2는 2020년 1월 1일부터 공식 지원 종료

**주요 차이점:**
- print 함수: Python 2는 print 문, Python 3는 print() 함수
- 정수 나눗셈: Python 2는 3/2=1, Python 3는 3/2=1.5, 정수 나눗셈은 //
- 문자열: Python 2는 str과 unicode 분리, Python 3는 str이 유니코드이고 bytes는 별도
- range: Python 2는 range가 리스트 반환, Python 3는 이터레이터 반환하여 메모리 효율적
- 예외 처리: Python 2는 except Exception, e 문법, Python 3는 except Exception as e

**문자열과 인코딩:**
- Python 2: str은 바이트 문자열, unicode는 유니코드 문자열로 혼란 발생
- Python 3: str은 항상 유니코드, bytes는 바이트 시퀀스로 명확히 구분
- 기본 인코딩: Python 3는 소스 파일이 기본적으로 UTF-8
- 문자열 리터럴: Python 2는 u"문자열", Python 3는 기본이 유니코드

**이터레이터:**
- range, zip, map, filter: Python 3에서 모두 이터레이터 반환하여 메모리 효율
- dict 메서드: keys(), values(), items()가 Python 3에서 뷰 객체 반환
- 지연 평가: Python 3가 더 많은 곳에서 지연 평가 사용

**기타 변경사항:**
- input: Python 2의 raw_input()이 Python 3의 input()이 됨
- 정수 타입: Python 2는 int와 long 분리, Python 3는 int만 존재하고 자동 확장
- 메타클래스: Python 3는 metaclass=Meta 문법으로 더 명확
- super: Python 3는 인자 없는 super() 지원으로 간결

**마이그레이션:**
- 2to3 도구: 자동으로 Python 2 코드를 Python 3로 변환
- six 라이브러리: Python 2와 3 호환 코드 작성 지원
- __future__: Python 2에서 from __future__ import로 Python 3 기능 사용
- 점진적 전환: 테스트 커버리지 확보 후 단계적으로 마이그레이션

**실무 활용:**
- 새 프로젝트는 무조건 Python 3 사용
- 레거시 코드는 테스트를 작성하고 점진적으로 Python 3로 마이그레이션
- 라이브러리는 Python 3만 지원하거나 six로 양쪽 지원

---

## 질문 92: Python의 패키지 관리 도구(pip, pipenv, poetry)를 비교해주세요.

**정의:**
Python의 패키지 관리 도구는 의존성을 설치하고 관리하는 도구로, pip는 기본 도구이고, pipenv와 poetry는 가상 환경과 의존성을 통합 관리하는 현대적 도구입니다. 각각 장단점이 있어 프로젝트 특성에 맞게 선택합니다.

**특징/원리:**
- 의존성 관리: 프로젝트에 필요한 패키지와 버전을 명시하고 설치
- 가상 환경: 프로젝트별로 독립된 환경을 만들어 의존성 충돌 방지
- 재현성: 동일한 의존성 버전으로 어디서나 같은 환경 구축
- 잠금 파일: 정확한 버전을 고정하여 일관된 환경 보장

**pip:**
- 기본 도구: Python 설치 시 기본 포함되는 패키지 관리자
- requirements.txt: 의존성 목록을 텍스트 파일로 관리
- 간단함: 가장 기본적이고 널리 사용됨
- 한계: 가상 환경을 별도로 관리해야 하고 의존성 해결이 약함

**pipenv:**
- 통합 관리: 가상 환경과 패키지 관리를 통합
- Pipfile: requirements.txt를 대체하는 TOML 형식 파일
- Pipfile.lock: 정확한 버전과 해시를 기록하여 보안과 재현성 향상
- 자동 생성: pipenv install 시 자동으로 가상 환경 생성
- 단점: 느린 속도와 복잡한 의존성 해결

**poetry:**
- 현대적: 최신 Python 프로젝트 관리 도구
- pyproject.toml: PEP 518 표준 설정 파일 사용
- poetry.lock: 의존성 잠금 파일로 정확한 재현
- 빌드 시스템: 패키지 빌드와 배포까지 통합 지원
- 빠른 의존성 해결: pipenv보다 빠르고 정확한 의존성 해결
- 가상 환경: 자동으로 생성하고 관리

**비교:**
- 사용 편의성: poetry > pipenv > pip + venv
- 속도: pip > poetry > pipenv
- 기능: poetry > pipenv > pip
- 표준 준수: poetry > pipenv > pip
- 학습 곡선: pip < pipenv < poetry

**선택 기준:**
- 간단한 프로젝트: pip와 venv로 충분
- 협업 프로젝트: pipenv나 poetry로 의존성 정확히 관리
- 라이브러리 개발: poetry로 빌드와 배포까지 통합 관리
- 레거시: 기존 requirements.txt 사용 중이면 점진적 전환

**실무 활용:**
- 새 프로젝트는 poetry로 시작하여 현대적인 의존성 관리
- CI/CD에서 잠금 파일을 사용하여 일관된 환경에서 테스트
- Docker 이미지 빌드 시 잠금 파일로 재현 가능한 환경 구축

---
