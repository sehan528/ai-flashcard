# AI Flashcard Dataset

이 디렉토리에는 개발자 면접 대비용 고품질 플래시카드 데이터셋이 포함되어 있습니다.

## 📁 데이터셋 목록

### Database (DB) - 완료 ✅
- **파일**: `db/db.json`
- **질문 수**: 60개
- **주제**:
  - Keys (Primary, Foreign, Candidate, Super)
  - ACID와 트랜잭션
  - 인덱스 (B-Tree, B+Tree, 최적화)
  - 정규화/비정규화
  - RDB vs NoSQL
  - Replication & Sharding
  - JOIN 알고리즘
  - 락킹 메커니즘
  - SQL Injection 방어
  - 쿼리 최적화

## 📥 데이터셋 Import 방법

### 방법 1: 앱에서 직접 Import (권장)

1. 앱 실행: `npm run dev`
2. 브라우저에서 **Settings** 페이지 이동
3. **데이터 가져오기 (Import)** 버튼 클릭
4. 파일 선택 대화상자에서 다음 경로의 파일 선택:
   ```
   프로젝트폴더/public/data/dataset/db/db.json
   ```
5. Import 완료! 60개의 DB 질문이 추가됩니다.

### 방법 2: 브라우저에서 직접 파일 다운로드 후 Import

1. 브라우저 주소창에 입력:
   ```
   http://localhost:5173/data/dataset/db/db.json
   ```
2. 파일 다운로드
3. Settings 페이지에서 다운로드한 파일 Import

## ✅ 데이터셋 검증

데이터셋이 올바른 형식인지 검증하려면:

```bash
npm run test:dataset
```

또는 수동으로:

```bash
node scripts/test-dataset-import.js
```

## 📋 데이터셋 형식

각 데이터셋 JSON 파일은 다음 구조를 따릅니다:

```json
{
  "id": "unique-id",
  "name": "데이터셋 이름",
  "description": "데이터셋 설명",
  "createdAt": "2025-11-17T00:00:00.000Z",
  "cards": [
    {
      "id": "unique-card-id",
      "question": "질문 내용",
      "answer": "답변 내용 (마크다운 지원)",
      "type": "essay",
      "tags": ["태그1", "태그2"],
      "createdAt": "2025-11-17T00:00:00.000Z",
      "studyCount": 0
    }
  ]
}
```

## 🚀 향후 추가 예정

- [ ] Data Structures (DS) - 80+ 질문
- [ ] Network - 106+ 질문
- [ ] Operating Systems (OS)
- [ ] Programming Languages (PL)
- [ ] Spring Framework
- [ ] And more...

## 📝 데이터셋 생성

새로운 데이터셋을 추가하려면:

1. `public/reference_data/` 에서 마크다운 파일 확인
2. 스크립트를 사용하여 데이터셋 생성
3. `scripts/fix-dataset-format.py` 로 형식 검증
4. `scripts/test-dataset-import.js` 로 Import 테스트

## 🔧 문제 해결

### "파일을 찾을 수 없습니다"

- 파일 경로가 올바른지 확인: `public/data/dataset/db/db.json`
- 개발 서버가 실행 중인지 확인: `npm run dev`

### "Invalid JSON format"

- 데이터셋 형식 검증 실행:
  ```bash
  python3 scripts/fix-dataset-format.py
  ```

### Import 후 카드가 보이지 않음

- 브라우저 개발자 도구 콘솔 확인
- LocalStorage 확인: Application > Local Storage > ai-flashcard-sets
