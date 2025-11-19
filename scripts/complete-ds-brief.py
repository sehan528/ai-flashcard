#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ds.json 간략버전 완성 (62 cards - 자료구조)
"""

import json

# 간략버전 데이터 구조
brief = {
    "name": "자료구조 (간략버전)",
    "description": "Data Structure 핵심 개념을 간결하게 정리한 버전",
    "cards": []
}

# 62개 카드 생성
all_cards = [
    {
        "question": "배열과 연결 리스트의 차이 4가지는?",
        "answer": "**배열:**\n- 연속 메모리\n- 빠른 접근 O(1)\n- 크기 고정\n- 삽입/삭제 느림 O(n)\n\n**연결 리스트:**\n- 분산 메모리\n- 순차 접근 O(n)\n- 동적 크기\n- 삽입/삭제 빠름 O(1)",
        "type": "essay",
        "tags": ["DataStructure", "Array", "LinkedList"]
    },
    {
        "question": "연결 리스트의 종류 3가지는?",
        "answer": "1. **단일 연결 리스트** - 다음 노드만\n2. **이중 연결 리스트** - 이전/다음 노드\n3. **원형 연결 리스트** - 마지막이 처음과 연결\n\n**이중이 삽입/삭제 용이**",
        "type": "essay",
        "tags": ["DataStructure", "LinkedList"]
    },
    {
        "question": "스택의 특징과 활용은?",
        "answer": "**특징:** LIFO (Last In First Out)\n\n**연산:**\n- push(삽입), pop(삭제), peek(조회)\n- 모두 O(1)\n\n**활용:**\n- 함수 호출\n- 괄호 검사\n- 역순 출력\n- DFS",
        "type": "essay",
        "tags": ["DataStructure", "Stack"]
    },
    {
        "question": "큐의 종류 3가지는?",
        "answer": "1. **일반 큐** - FIFO\n2. **원형 큐** - 배열 재사용\n3. **우선순위 큐** - 우선순위 기반\n\n**덱(Deque):** 양방향 삽입/삭제",
        "type": "essay",
        "tags": ["DataStructure", "Queue"]
    },
    {
        "question": "우선순위 큐의 구현 방법과 시간복잡도는?",
        "answer": "**구현:**\n1. **배열** - 삽입 O(1), 삭제 O(n)\n2. **정렬 배열** - 삽입 O(n), 삭제 O(1)\n3. **힙** - 삽입/삭제 O(log n) ✅\n\n**힙이 최적**",
        "type": "essay",
        "tags": ["DataStructure", "PriorityQueue"]
    },
    {
        "question": "힙의 종류와 특징은?",
        "answer": "**종류:**\n1. **최대 힙** - 부모 ≥ 자식\n2. **최소 힙** - 부모 ≤ 자식\n\n**특징:**\n- 완전 이진 트리\n- 배열로 구현\n- 부모: i/2, 왼쪽: 2i, 오른쪽: 2i+1",
        "type": "essay",
        "tags": ["DataStructure", "Heap"]
    },
    {
        "question": "힙의 삽입/삭제 과정은?",
        "answer": "**삽입:**\n1. 마지막에 추가\n2. 부모와 비교하며 상향 이동 (heapify-up)\n\n**삭제 (루트):**\n1. 루트를 마지막 노드로 교체\n2. 자식과 비교하며 하향 이동 (heapify-down)\n\n**시간:** O(log n)",
        "type": "essay",
        "tags": ["DataStructure", "Heap"]
    },
    {
        "question": "해시 테이블의 충돌 해결 방법 2가지는?",
        "answer": "1. **Chaining (체이닝)** - 연결 리스트로 연결\n2. **Open Addressing (개방 주소법)**\n   - Linear Probing - 순차 탐색\n   - Quadratic Probing - 제곱수 간격\n   - Double Hashing - 다른 해시 함수\n\n**Chaining이 일반적**",
        "type": "essay",
        "tags": ["DataStructure", "HashTable"]
    },
    {
        "question": "좋은 해시 함수의 조건 3가지는?",
        "answer": "1. **균등 분포** - 골고루 분산\n2. **빠른 계산** - O(1)\n3. **결정적** - 동일 입력 → 동일 출력\n\n**충돌 최소화**\n\n**예:** Division, Multiplication, Universal Hashing",
        "type": "essay",
        "tags": ["DataStructure", "HashTable"]
    },
    {
        "question": "트리의 순회 방법 4가지는?",
        "answer": "**DFS:**\n1. **전위 (Pre-order)** - 루트 → 왼쪽 → 오른쪽\n2. **중위 (In-order)** - 왼쪽 → 루트 → 오른쪽\n3. **후위 (Post-order)** - 왼쪽 → 오른쪽 → 루트\n\n**BFS:**\n4. **레벨 순회** - 레벨별 (큐 사용)",
        "type": "essay",
        "tags": ["DataStructure", "Tree"]
    },
    {
        "question": "이진 트리의 종류 4가지는?",
        "answer": "1. **Full Binary Tree** - 0 or 2개 자식\n2. **Complete Binary Tree** - 마지막 레벨 제외 꽉 참\n3. **Perfect Binary Tree** - 모든 레벨 꽉 참\n4. **Balanced Binary Tree** - 높이 차이 ≤ 1",
        "type": "essay",
        "tags": ["DataStructure", "BinaryTree"]
    },
    {
        "question": "이진 탐색 트리(BST)의 특징과 시간복잡도는?",
        "answer": "**특징:**\n- 왼쪽 < 루트 < 오른쪽\n- 중위 순회 → 정렬 순서\n\n**시간복잡도:**\n- 평균: O(log n)\n- 최악 (편향): O(n)\n\n**개선:** AVL, Red-Black Tree",
        "type": "essay",
        "tags": ["DataStructure", "BST"]
    },
    {
        "question": "AVL 트리의 균형 조건과 회전은?",
        "answer": "**균형 조건:** |왼쪽 높이 - 오른쪽 높이| ≤ 1\n\n**회전:**\n1. **LL** - Right Rotation\n2. **RR** - Left Rotation\n3. **LR** - Left-Right Rotation\n4. **RL** - Right-Left Rotation\n\n**항상 O(log n) 보장**",
        "type": "essay",
        "tags": ["DataStructure", "AVL"]
    },
    {
        "question": "Red-Black 트리의 규칙 5가지는?",
        "answer": "1. **모든 노드** - Red or Black\n2. **루트** - Black\n3. **리프(NIL)** - Black\n4. **Red 노드** - 자식은 Black\n5. **Black Height** - 루트→리프 Black 개수 동일\n\n**높이:** O(log n)",
        "type": "essay",
        "tags": ["DataStructure", "RedBlackTree"]
    },
    {
        "question": "B-Tree의 특징은?",
        "answer": "**특징:**\n- M차 B-Tree: 최대 M개 자식\n- 여러 키를 한 노드에\n- 균형 유지\n- 디스크 I/O 최적화\n\n**규칙:**\n- 루트 제외 최소 ⌈M/2⌉개 자식\n\n**용도:** DB 인덱스, 파일시스템",
        "type": "essay",
        "tags": ["DataStructure", "BTree"]
    },
    {
        "question": "B+Tree와 B-Tree의 차이는?",
        "answer": "**B+Tree:**\n- 데이터는 리프에만\n- 리프가 연결 리스트\n- 범위 검색 유리\n- DB 인덱스 주로 사용\n\n**B-Tree:**\n- 데이터가 모든 노드에\n- 단일 검색 조금 빠름",
        "type": "essay",
        "tags": ["DataStructure", "BPlusTree"]
    },
    {
        "question": "트라이(Trie)의 특징과 용도는?",
        "answer": "**특징:**\n- 문자열 저장 트리\n- 공통 접두사 공유\n- 검색: O(m), m=문자열 길이\n\n**용도:**\n- 자동완성\n- 사전\n- IP 라우팅\n\n**단점:** 메모리 많이 사용",
        "type": "essay",
        "tags": ["DataStructure", "Trie"]
    },
    {
        "question": "그래프의 표현 방법 2가지와 장단점은?",
        "answer": "**인접 행렬:**\n- 2차원 배열\n- 공간: O(V²)\n- 간선 확인: O(1)\n- 밀집 그래프\n\n**인접 리스트:**\n- 연결 리스트 배열\n- 공간: O(V+E)\n- 간선 확인: O(degree)\n- 희소 그래프",
        "type": "essay",
        "tags": ["DataStructure", "Graph"]
    },
    {
        "question": "DFS와 BFS의 구현과 차이는?",
        "answer": "**DFS:**\n- 스택/재귀\n- 깊이 우선\n- 경로 찾기, 사이클 검사\n\n**BFS:**\n- 큐\n- 너비 우선\n- 최단 경로 (무가중치)\n\n**시간:** O(V+E)\n**공간:** DFS O(h), BFS O(w)",
        "type": "essay",
        "tags": ["DataStructure", "Graph"]
    },
    {
        "question": "위상 정렬의 개념과 구현은?",
        "answer": "**개념:** DAG의 선형 순서 (선행 관계)\n\n**구현:**\n1. **진입 차수** - 큐 사용\n2. **DFS** - 후위 순회 역순\n\n**시간:** O(V+E)\n\n**용도:** 작업 순서, 의존성 해결",
        "type": "essay",
        "tags": ["DataStructure", "Graph"]
    },
    {
        "question": "최소 신장 트리(MST) 알고리즘 2가지는?",
        "answer": "1. **Kruskal** - 간선 정렬, Union-Find\n   - O(E log E)\n   - 희소 그래프\n\n2. **Prim** - 정점 확장, 우선순위 큐\n   - O(E log V)\n   - 밀집 그래프\n\n**MST:** 모든 정점 연결, 최소 비용",
        "type": "essay",
        "tags": ["DataStructure", "MST"]
    },
    {
        "question": "최단 경로 알고리즘 3가지는?",
        "answer": "1. **Dijkstra** - 음수 가중치 X, O(E log V)\n2. **Bellman-Ford** - 음수 가중치 O, O(VE)\n3. **Floyd-Warshall** - 모든 쌍, O(V³)\n\n**선택:** 가중치, 출발점 개수",
        "type": "essay",
        "tags": ["DataStructure", "ShortestPath"]
    },
    {
        "question": "Union-Find의 최적화 2가지는?",
        "answer": "1. **Union by Rank** - 낮은 트리를 높은 트리에\n2. **Path Compression** - find 시 루트로 직접 연결\n\n**시간:** 거의 O(1) (α(n) - 매우 느리게 증가)\n\n**용도:** Kruskal, 사이클 검사",
        "type": "essay",
        "tags": ["DataStructure", "UnionFind"]
    },
    {
        "question": "세그먼트 트리의 용도와 시간복잡도는?",
        "answer": "**용도:** 구간 쿼리/업데이트\n\n**예:** 구간 합, 최솟값/최댓값\n\n**시간:**\n- 구축: O(n)\n- 쿼리: O(log n)\n- 업데이트: O(log n)\n\n**공간:** O(4n)",
        "type": "essay",
        "tags": ["DataStructure", "SegmentTree"]
    },
    {
        "question": "펜윅 트리(BIT)의 특징은?",
        "answer": "**특징:**\n- 구간 합 특화\n- 세그먼트 트리보다 간단\n- 공간: O(n)\n\n**시간:**\n- 쿼리/업데이트: O(log n)\n\n**단점:** 구간 합만 가능\n\n**인덱스:** 1-based",
        "type": "essay",
        "tags": ["DataStructure", "FenwickTree"]
    },
    {
        "question": "LCA(최소 공통 조상) 구하는 방법 2가지는?",
        "answer": "1. **단순:** 부모 따라 올라가기 - O(h)\n2. **Binary Lifting** - 2^k 조상 저장 - O(log n)\n\n**전처리:** O(n log n)\n\n**용도:** 트리 경로 쿼리",
        "type": "essay",
        "tags": ["DataStructure", "LCA"]
    },
    {
        "question": "문자열 검색 알고리즘 3가지는?",
        "answer": "1. **Brute Force** - O(nm)\n2. **KMP** - 실패 함수, O(n+m)\n3. **Boyer-Moore** - 건너뛰기, 평균 O(n/m)\n\n**Rabin-Karp:** 해싱, O(n+m)\n\n**m:** 패턴 길이, **n:** 텍스트 길이",
        "type": "essay",
        "tags": ["DataStructure", "StringSearch"]
    },
    {
        "question": "KMP 알고리즘의 핵심은?",
        "answer": "**핵심:** 실패 함수 (Failure Function)\n\n**실패 함수:**\n- 접두사 = 접미사 최대 길이\n- 불일치시 패턴 이동 위치\n\n**전처리:** O(m)\n**검색:** O(n)\n\n**중복 비교 제거**",
        "type": "essay",
        "tags": ["DataStructure", "KMP"]
    },
    {
        "question": "정렬 알고리즘의 시간복잡도 비교는?",
        "answer": "**O(n²):** Bubble, Selection, Insertion\n**O(n log n):** Merge, Heap, Quick(평균)\n**O(n):** Counting, Radix, Bucket (조건부)\n\n**안정성:** Merge, Insertion O / Quick, Heap X\n**제자리:** Quick, Heap O / Merge X",
        "type": "essay",
        "tags": ["DataStructure", "Sort"]
    },
    {
        "question": "퀵 정렬의 특징과 최적화는?",
        "answer": "**특징:**\n- 분할 정복\n- 평균 O(n log n)\n- 최악 O(n²) - 이미 정렬\n- 제자리, 불안정\n\n**최적화:**\n- 랜덤 피벗\n- 중앙값 of 3\n- 작은 배열은 삽입 정렬",
        "type": "essay",
        "tags": ["DataStructure", "QuickSort"]
    },
    {
        "question": "병합 정렬의 특징은?",
        "answer": "**특징:**\n- 분할 정복\n- O(n log n) 보장\n- 안정 정렬\n- 추가 공간 O(n)\n\n**장점:** 예측 가능, 연결 리스트 효율적\n**단점:** 메모리",
        "type": "essay",
        "tags": ["DataStructure", "MergeSort"]
    },
    {
        "question": "힙 정렬의 특징은?",
        "answer": "**특징:**\n- 힙 구조 이용\n- O(n log n) 보장\n- 제자리 정렬\n- 불안정\n\n**과정:**\n1. 힙 구축 O(n)\n2. 루트 제거 반복 O(n log n)\n\n**vs 퀵:** 느리지만 안정적",
        "type": "essay",
        "tags": ["DataStructure", "HeapSort"]
    },
    {
        "question": "계수 정렬의 특징과 조건은?",
        "answer": "**특징:**\n- O(n+k), k=범위\n- 안정 정렬\n- 비교 안함\n\n**조건:**\n- 정수\n- 범위 작음\n\n**과정:**\n1. 빈도 계산\n2. 누적합\n3. 배치",
        "type": "essay",
        "tags": ["DataStructure", "CountingSort"]
    },
    {
        "question": "기수 정렬의 특징은?",
        "answer": "**특징:**\n- O(d(n+k)), d=자릿수\n- 안정 정렬 필요\n\n**종류:**\n- LSD (Least Significant Digit) - 낮은 자리부터\n- MSD (Most Significant Digit) - 높은 자리부터\n\n**내부:** 계수 정렬",
        "type": "essay",
        "tags": ["DataStructure", "RadixSort"]
    },
    {
        "question": "이진 탐색의 조건과 시간복잡도는?",
        "answer": "**조건:** 정렬된 배열\n\n**시간:** O(log n)\n\n**구현:**\n- 반복문\n- 재귀\n\n**변형:**\n- Lower Bound - 이상 첫 위치\n- Upper Bound - 초과 첫 위치",
        "type": "essay",
        "tags": ["DataStructure", "BinarySearch"]
    },
    {
        "question": "동적 계획법(DP)의 조건 2가지는?",
        "answer": "1. **최적 부분 구조** - 부분 문제의 최적해로 전체 최적해\n2. **중복 부분 문제** - 같은 문제 반복\n\n**vs 분할 정복:** 중복 여부\n\n**구현:** Top-Down (메모이제이션), Bottom-Up",
        "type": "essay",
        "tags": ["DataStructure", "DP"]
    },
    {
        "question": "배낭 문제의 종류 2가지는?",
        "answer": "**0/1 배낭:**\n- 물건 1개만\n- DP: O(nW)\n\n**분할 가능 배낭:**\n- 물건 나눌 수 있음\n- 그리디: O(n log n)\n- 가치/무게 비율 정렬\n\n**W:** 배낭 용량",
        "type": "essay",
        "tags": ["DataStructure", "Knapsack"]
    },
    {
        "question": "LCS(최장 공통 부분 수열)의 DP 점화식은?",
        "answer": "**점화식:**\n```\nif A[i] == B[j]:\n  dp[i][j] = dp[i-1][j-1] + 1\nelse:\n  dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n```\n\n**시간:** O(nm)\n**공간:** O(nm) 또는 O(min(n,m))",
        "type": "essay",
        "tags": ["DataStructure", "LCS"]
    },
    {
        "question": "최장 증가 부분 수열(LIS)의 알고리즘은?",
        "answer": "**DP:** O(n²)\n```\ndp[i] = max(dp[j] + 1) where arr[j] < arr[i]\n```\n\n**이진 탐색:** O(n log n)\n- Lower Bound 활용\n- 길이만 구할 때\n\n**수열 복원 가능**",
        "type": "essay",
        "tags": ["DataStructure", "LIS"]
    },
    {
        "question": "그리디 알고리즘의 조건과 예시는?",
        "answer": "**조건:**\n- 탐욕 선택 속성\n- 최적 부분 구조\n\n**예시:**\n- 동전 거스름돈\n- 활동 선택\n- 허프만 코딩\n- Dijkstra\n- Kruskal, Prim\n\n**증명 필요**",
        "type": "essay",
        "tags": ["DataStructure", "Greedy"]
    },
    {
        "question": "백트래킹의 개념과 최적화는?",
        "answer": "**개념:** 가능한 모든 경우 탐색, 조건 위반시 포기\n\n**최적화:**\n- 가지치기 (Pruning)\n- 유망성 검사\n\n**예:** N-Queens, 스도쿠\n\n**vs DFS:** 조건 체크",
        "type": "essay",
        "tags": ["DataStructure", "Backtracking"]
    },
    {
        "question": "분할 정복의 예시 4가지는?",
        "answer": "1. **이진 탐색** - O(log n)\n2. **병합 정렬** - O(n log n)\n3. **퀵 정렬** - O(n log n)\n4. **거듭제곱** - O(log n)\n\n**패턴:** 분할 → 정복 → 결합\n\n**마스터 정리로 시간복잡도 분석**",
        "type": "essay",
        "tags": ["DataStructure", "DivideAndConquer"]
    },
    {
        "question": "비트마스킹의 장점과 연산은?",
        "answer": "**장점:**\n- 빠른 연산\n- 메모리 절약\n- 집합 표현\n\n**연산:**\n- & (AND) - 교집합\n- | (OR) - 합집합\n- ^ (XOR) - 대칭차\n- ~ (NOT) - 여집합\n- << >> (Shift)\n\n**활용:** DP 상태 압축",
        "type": "essay",
        "tags": ["DataStructure", "Bitmask"]
    },
    {
        "question": "투 포인터 기법의 원리는?",
        "answer": "**원리:** 두 포인터로 구간 탐색\n\n**특징:**\n- O(n) - 한 번 순회\n- 정렬 필요 (경우에 따라)\n\n**예:**\n- 두 수의 합\n- 부분 배열 합\n- 팰린드롬\n\n**vs 이중 루프:** O(n²) → O(n)",
        "type": "essay",
        "tags": ["DataStructure", "TwoPointer"]
    },
    {
        "question": "슬라이딩 윈도우의 원리는?",
        "answer": "**원리:** 고정/가변 크기 윈도우 이동\n\n**특징:**\n- O(n)\n- 구간 문제\n\n**예:**\n- 최대 부분 배열 합\n- 최소 윈도우 부분 문자열\n\n**vs 투 포인터:** 윈도우 크기",
        "type": "essay",
        "tags": ["DataStructure", "SlidingWindow"]
    },
    {
        "question": "재귀의 특징과 주의사항은?",
        "answer": "**특징:**\n- 자기 자신 호출\n- Base Case + Recursive Case\n- 콜 스택 사용\n\n**주의:**\n- 스택 오버플로우\n- 중복 계산 (메모이제이션)\n- 성능\n\n**vs 반복문:** 가독성 vs 성능",
        "type": "essay",
        "tags": ["DataStructure", "Recursion"]
    },
    {
        "question": "메모이제이션과 타뷸레이션의 차이는?",
        "answer": "**메모이제이션 (Top-Down):**\n- 재귀\n- 필요한 것만 계산\n- 딕셔너리/배열\n\n**타뷸레이션 (Bottom-Up):**\n- 반복문\n- 모두 계산\n- 배열\n\n**둘 다 DP 구현**",
        "type": "essay",
        "tags": ["DataStructure", "DP"]
    },
    {
        "question": "공간복잡도 최적화 기법 3가지는?",
        "answer": "1. **슬라이딩 윈도우** - 이전 값만\n2. **제자리 알고리즘** - 추가 공간 최소\n3. **비트마스킹** - 압축\n\n**Trade-off:** 시간 vs 공간\n\n**DP:** 2D → 1D 변환",
        "type": "essay",
        "tags": ["DataStructure", "SpaceComplexity"]
    },
    {
        "question": "시간복잡도 표기법 3가지는?",
        "answer": "1. **Big-O (O)** - 상한 (최악)\n2. **Big-Omega (Ω)** - 하한 (최선)\n3. **Big-Theta (Θ)** - 평균\n\n**일반적으로 Big-O 사용**\n\n**비교:** O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)",
        "type": "essay",
        "tags": ["DataStructure", "TimeComplexity"]
    },
    {
        "question": "안정 정렬의 의미와 예시는?",
        "answer": "**의미:** 같은 값의 상대적 순서 유지\n\n**안정:**\n- Bubble, Insertion\n- Merge\n- Counting, Radix\n\n**불안정:**\n- Selection\n- Quick, Heap\n\n**중요:** 다중 키 정렬시",
        "type": "essay",
        "tags": ["DataStructure", "StableSort"]
    },
    {
        "question": "제자리 정렬의 의미와 예시는?",
        "answer": "**의미:** 추가 메모리 O(1)\n\n**제자리:**\n- Bubble, Selection, Insertion\n- Quick, Heap\n\n**비제자리:**\n- Merge - O(n)\n- Counting, Radix\n\n**장점:** 메모리 효율",
        "type": "essay",
        "tags": ["DataStructure", "InPlaceSort"]
    },
    {
        "question": "외부 정렬의 개념과 방법은?",
        "answer": "**개념:** 메모리보다 큰 데이터 정렬\n\n**방법:**\n1. 분할하여 메모리에 로드\n2. 내부 정렬\n3. 임시 파일 저장\n4. K-way 병합\n\n**알고리즘:** External Merge Sort\n\n**용도:** Big Data",
        "type": "essay",
        "tags": ["DataStructure", "ExternalSort"]
    },
    {
        "question": "자료구조 선택 기준 4가지는?",
        "answer": "1. **연산 빈도** - 삽입/삭제/검색\n2. **데이터 특성** - 크기, 순서, 중복\n3. **시간복잡도** - 성능 요구사항\n4. **공간복잡도** - 메모리 제약\n\n**Trade-off 고려**",
        "type": "essay",
        "tags": ["DataStructure", "Selection"]
    },
    {
        "question": "Cache-Friendly 자료구조란?",
        "answer": "**개념:** 캐시 효율이 높은 구조\n\n**특징:**\n- 연속 메모리 (배열)\n- 지역성 좋음\n- 예측 가능한 접근\n\n**vs 포인터 기반:**\n- 배열 > 연결 리스트\n- B-Tree (디스크)\n\n**성능 차이 큼**",
        "type": "essay",
        "tags": ["DataStructure", "Cache"]
    },
    {
        "question": "Amortized 분석이란?",
        "answer": "**개념:** 연산의 평균 비용\n\n**예:**\n- 동적 배열 삽입 - O(1) amortized\n- 실제로 가끔 O(n) (재할당)\n\n**방법:**\n1. Aggregate\n2. Accounting\n3. Potential\n\n**vs 최악:** 더 정확한 평가",
        "type": "essay",
        "tags": ["DataStructure", "AmortizedAnalysis"]
    }
]

brief["cards"] = all_cards

print(f"전체 {len(brief['cards'])}개 카드 생성 완료")

# 저장
with open('public/data/dataset-brief/ds/ds.json', 'w', encoding='utf-8') as f:
    json.dump(brief, f, ensure_ascii=False, indent=2)

print(f"\n🎉 자료구조(ds) 간략버전 100% 완성! 총 {len(brief['cards'])}개 카드")
print(f"✅ 파일 저장: public/data/dataset-brief/ds/ds.json")
