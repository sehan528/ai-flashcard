#!/usr/bin/env python3
"""
javascript.json 파일의 Q&A 매칭 수정 (Final)

발견된 문제:
- 카드 #43: "얕은/깊은 복사" 질문에 "메모이제이션" 답변 (중복)
- 카드 #44: "불변성" 질문에 "얕은/깊은 복사" 답변 (잘못된 매칭)
- "불변성"에 대한 답변이 원본 데이터에 누락됨

해결 방법:
- #43에 #44의 답변(얕은/깊은 복사)을 넣음
- #44에 새로운 "불변성" 답변을 AI로 생성하여 추가
"""
import json

def fix_javascript():
    filepath = 'public/data/dataset/javascript/javascript.json'

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    cards = data['cards']

    print("JavaScript.json 수정 중...")
    print("="*80)

    # 카드 #43: 얕은/깊은 복사 답변을 #44에서 가져옴
    cards[42]['answer'] = cards[43]['answer']
    print("✓ 카드 #43: '얕은/깊은 복사' 답변으로 수정")

    # 카드 #44: 불변성에 대한 새 답변 생성
    cards[43]['answer'] = """**정의:**
불변성은 데이터를 변경하지 않고 새로운 데이터를 생성하는 프로그래밍 원칙입니다. 한 번 생성된 값은 수정할 수 없으며, 변경이 필요할 때는 새로운 값을 만듭니다. React와 Redux 같은 현대 프레임워크의 핵심 개념입니다.

**불변성이 중요한 이유:**
- 예측 가능성이 높아집니다. 데이터가 언제 어떻게 변경되는지 추적하기 쉽습니다.
- 버그가 줄어듭니다. 의도치 않은 데이터 변경을 방지합니다.
- 디버깅이 쉬워집니다. 데이터 변화를 명확히 추적할 수 있습니다.
- 성능 최적화가 가능합니다. 참조 비교만으로 변경 감지가 가능합니다.

**React에서의 불변성:**
React는 상태 변경을 감지할 때 얕은 비교(Shallow Comparison)를 사용합니다. 불변성을 지키지 않으면 변경을 감지하지 못해 리렌더링이 발생하지 않습니다.

```javascript
// ❌ 나쁜 예: 불변성 위반
const badUpdate = () => {
  const user = this.state.user;
  user.name = 'New Name';  // 직접 수정
  this.setState({ user });  // React가 변경을 감지하지 못함
};

// ✅ 좋은 예: 불변성 유지
const goodUpdate = () => {
  this.setState({
    user: {
      ...this.state.user,
      name: 'New Name'  // 새 객체 생성
    }
  });
};
```

**배열의 불변 업데이트:**

```javascript
const items = [1, 2, 3];

// ❌ 가변 메서드 (원본 수정)
items.push(4);        // [1, 2, 3, 4]
items.pop();          // [1, 2, 3]
items.splice(1, 1);   // [1, 3]
items.sort();
items.reverse();

// ✅ 불변 메서드 (새 배열 반환)
const added = [...items, 4];              // [1, 2, 3, 4]
const removed = items.slice(0, -1);       // [1, 2]
const spliced = [...items.slice(0, 1), ...items.slice(2)];  // [1, 3]
const sorted = [...items].sort();         // 복사 후 정렬
const reversed = [...items].reverse();    // 복사 후 뒤집기
const mapped = items.map(x => x * 2);     // [2, 4, 6]
const filtered = items.filter(x => x > 1); // [2, 3]
```

**객체의 불변 업데이트:**

```javascript
const user = { name: 'John', age: 30, address: { city: 'Seoul' } };

// ✅ 얕은 복사로 최상위 속성 업데이트
const updated1 = { ...user, age: 31 };

// ✅ 중첩 객체 업데이트 (모든 레벨 복사)
const updated2 = {
  ...user,
  address: {
    ...user.address,
    city: 'Busan'
  }
};

// ✅ Object.assign 사용 (레거시)
const updated3 = Object.assign({}, user, { age: 31 });
```

**불변성 라이브러리:**

복잡한 중첩 구조에서는 불변성 라이브러리를 사용하면 편리합니다.

```javascript
// Immer 사용
import produce from 'immer';

const nextState = produce(currentState, draft => {
  // draft를 마치 가변 객체처럼 수정
  draft.user.name = 'New Name';
  draft.items.push(newItem);
  // Immer가 자동으로 불변 업데이트로 변환
});

// Immutable.js 사용
import { Map } from 'immutable';

const map1 = Map({ a: 1, b: 2 });
const map2 = map1.set('b', 50);  // 새 Map 반환
console.log(map1.get('b'));  // 2 (원본 유지)
console.log(map2.get('b'));  // 50 (새 값)
```

**Redux에서의 불변성:**

Redux는 상태가 항상 불변이어야 합니다. Reducer는 순수 함수여야 합니다.

```javascript
// ❌ 나쁜 예
function badReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      state.push(action.todo);  // 원본 수정!
      return state;
    default:
      return state;
  }
}

// ✅ 좋은 예
function goodReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.todo];  // 새 배열 반환
    case 'REMOVE_TODO':
      return state.filter(todo => todo.id !== action.id);
    case 'UPDATE_TODO':
      return state.map(todo =>
        todo.id === action.id
          ? { ...todo, ...action.updates }
          : todo
      );
    default:
      return state;
  }
}
```

**성능 최적화와 불변성:**

불변성은 React의 최적화 기법과 결합됩니다.

```javascript
import React, { memo } from 'react';

// React.memo는 props가 변경되지 않으면 리렌더링하지 않음
const UserCard = memo(({ user }) => {
  console.log('Rendering UserCard');
  return <div>{user.name}</div>;
});

function App() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]);

  // ✅ 불변 업데이트: user 객체가 새 참조를 가져 리렌더링됨
  const updateUser = (id) => {
    setUsers(users.map(user =>
      user.id === id
        ? { ...user, name: 'Updated' }
        : user  // 변경되지 않은 user는 같은 참조 유지
    ));
  };

  return users.map(user => <UserCard key={user.id} user={user} />);
  // user.id === id인 UserCard만 리렌더링됨
}
```

**타임 트래블 디버깅:**

불변성은 상태의 모든 변화를 기록할 수 있게 합니다.

```javascript
class StateHistory {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }

  push(state) {
    // 불변 상태이므로 안전하게 저장 가능
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(state);
    this.currentIndex++;
  }

  undo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
  }

  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
  }
}
```

**주의사항:**

- 성능: 매번 새 객체를 만드는 것이 항상 느린 것은 아닙니다. 참조 비교가 매우 빠르므로 불필요한 렌더링을 막아 오히려 성능이 좋아집니다.
- 메모리: 구조적 공유(Structural Sharing)를 사용하는 라이브러리는 메모리 효율적입니다.
- 학습 곡선: 처음에는 어색하지만, 익숙해지면 더 안전하고 예측 가능한 코드를 작성할 수 있습니다.

불변성은 현대 JavaScript 개발의 핵심 원칙으로, 특히 React, Redux, Vue 같은 프레임워크에서 필수적입니다. 데이터 흐름을 명확하게 하고 버그를 줄이며 성능을 최적화하는 강력한 도구입니다."""

    print("✓ 카드 #44: '불변성' 답변 새로 생성")

    # 파일 저장
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n💾 {filepath} 파일이 저장되었습니다!")
    print("\n✅ 수정 완료:")
    print("  - 카드 #43: 얕은/깊은 복사 답변 수정")
    print("  - 카드 #44: 불변성 답변 새로 추가")

    return True

if __name__ == '__main__':
    fix_javascript()
