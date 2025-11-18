import { useState, useEffect } from 'react';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';
import type { DailyStats } from '../domains/flashcard/dtos/FlashCard';

const Statistics = () => {
    const [studyStreak, setStudyStreak] = useState(0);
    const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
    const [weekStats, setWeekStats] = useState<DailyStats[]>([]);
    const [totalStats, setTotalStats] = useState({ totalCardSets: 0, totalCards: 0, totalStudyCount: 0 });

    // 현재 보고 있는 월 (년, 월)
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11
    const [monthStats, setMonthStats] = useState<DailyStats[]>([]);

    useEffect(() => {
        // 첫 로드 시 데이터 무결성 확인
        FlashcardStorage.cleanupStudyHistory();
        loadStatistics();
    }, [currentYear, currentMonth]);

    const loadStatistics = () => {
        // 연속 학습일
        const streak = FlashcardStorage.getStudyStreak();
        setStudyStreak(streak);

        // 오늘 통계
        const today = FlashcardStorage.getDateString();
        const history = FlashcardStorage.getStudyHistory();
        setTodayStats(history.dailyStats[today] || { date: today, cardsStudied: 0, sessionsCount: 0, cardSetIds: [] });

        // 최근 7일
        const recentWeek = FlashcardStorage.getRecentStudyStats(7);
        setWeekStats(recentWeek);

        // 선택한 월의 통계
        const startDate = new Date(currentYear, currentMonth, 1);
        const endDate = new Date(currentYear, currentMonth + 1, 0); // 마지막 날
        const monthData = FlashcardStorage.getStudyStatsByDateRange(startDate, endDate);
        setMonthStats(monthData);

        // 전체 통계
        const stats = FlashcardStorage.getStatistics();
        setTotalStats(stats);
    };

    // 이전 달로 이동
    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    // 다음 달로 이동
    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // 오늘로 돌아가기
    const goToToday = () => {
        const now = new Date();
        setCurrentYear(now.getFullYear());
        setCurrentMonth(now.getMonth());
    };

    // 히트맵 색상 계산 (0~4 레벨)
    const getHeatmapColor = (count: number): string => {
        if (count === 0) return 'bg-gray-100';
        if (count <= 5) return 'bg-green-200';
        if (count <= 10) return 'bg-green-400';
        if (count <= 20) return 'bg-green-600';
        return 'bg-green-800';
    };

    // 월별 캘린더 데이터 생성
    const generateMonthCalendar = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const firstDayOfWeek = firstDay.getDay(); // 0 (일) ~ 6 (토)
        const daysInMonth = lastDay.getDate();

        const weeks: (DailyStats | null)[][] = [];
        let currentWeek: (DailyStats | null)[] = [];

        // 첫 주의 빈 칸 채우기
        for (let i = 0; i < firstDayOfWeek; i++) {
            currentWeek.push(null);
        }

        // 날짜 데이터 매핑
        const statsMap = new Map(monthStats.map(s => [s.date, s]));

        // 각 날짜 추가
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateStr = FlashcardStorage.getDateString(date);
            const stat = statsMap.get(dateStr) || {
                date: dateStr,
                cardsStudied: 0,
                sessionsCount: 0,
                cardSetIds: []
            };

            currentWeek.push(stat);

            // 주말(토요일)이거나 마지막 날이면 주 완성
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }

        // 마지막 주 빈 칸 채우기
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
        }

        return weeks;
    };

    const monthCalendar = generateMonthCalendar();

    // 이번 주/이번 달 통계
    const thisWeekTotal = weekStats.reduce((sum, s) => sum + s.cardsStudied, 0);
    const recent30Days = FlashcardStorage.getRecentStudyStats(30);
    const thisMonthTotal = recent30Days.reduce((sum, s) => sum + s.cardsStudied, 0);

    // 월 이름
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const isCurrentMonth = currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth();

    return (
        <div className="min-w-[375px] max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl xl:max-w-7xl p-4 xl:p-8">
            <h2 className="text-2xl xl:text-3xl font-bold text-gray-800 mb-6 xl:mb-8">📊 학습 통계</h2>

            {/* 주요 통계 카드 */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-6 mb-6 xl:mb-8">
                {/* 연속 학습일 */}
                <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl p-4 xl:p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl xl:text-3xl">🔥</span>
                        <span className="text-xs xl:text-sm opacity-90">연속 학습</span>
                    </div>
                    <div className="text-3xl xl:text-4xl font-bold">{studyStreak}</div>
                    <div className="text-xs xl:text-sm opacity-90 mt-1">일 연속</div>
                </div>

                {/* 오늘 학습 */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl p-4 xl:p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl xl:text-3xl">📚</span>
                        <span className="text-xs xl:text-sm opacity-90">오늘</span>
                    </div>
                    <div className="text-3xl xl:text-4xl font-bold">{todayStats?.cardsStudied || 0}</div>
                    <div className="text-xs xl:text-sm opacity-90 mt-1">개 카드</div>
                </div>

                {/* 이번 주 */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-4 xl:p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl xl:text-3xl">📈</span>
                        <span className="text-xs xl:text-sm opacity-90">이번 주</span>
                    </div>
                    <div className="text-3xl xl:text-4xl font-bold">{thisWeekTotal}</div>
                    <div className="text-xs xl:text-sm opacity-90 mt-1">개 카드</div>
                </div>

                {/* 이번 달 */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-4 xl:p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl xl:text-3xl">🎯</span>
                        <span className="text-xs xl:text-sm opacity-90">이번 달</span>
                    </div>
                    <div className="text-3xl xl:text-4xl font-bold">{thisMonthTotal}</div>
                    <div className="text-xs xl:text-sm opacity-90 mt-1">개 카드</div>
                </div>
            </div>

            {/* 학습 활동 & 전체 통계 - PC에서는 2열, 모바일에서는 1열 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8 mb-6 xl:mb-8">
                {/* 월별 캘린더 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 xl:p-6">
                    {/* 월 네비게이션 */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <h3 className="text-lg xl:text-xl font-semibold text-gray-800 flex-shrink-0">📅 학습 활동</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {!isCurrentMonth && (
                                <button
                                    onClick={goToToday}
                                    className="px-3 py-1.5 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors whitespace-nowrap"
                                >
                                    오늘
                                </button>
                            )}
                            <button
                                onClick={goToPreviousMonth}
                                className="p-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
                                title="이전 달"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="min-w-[100px] text-center font-semibold text-gray-800 whitespace-nowrap">
                                {currentYear}년 {monthNames[currentMonth]}
                            </div>
                            <button
                                onClick={goToNextMonth}
                                className="p-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
                                title="다음 달"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* 캘린더 - GitHub 스타일 */}
                    <div className="w-fit mx-auto">
                        {/* 요일 헤더 */}
                        <div className="grid grid-cols-7 gap-1.5 mb-2">
                            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                                <div key={day} className={`w-10 sm:w-12 lg:w-14 xl:w-16 text-center text-xs font-medium ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-600'}`}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* 날짜 그리드 - 작은 사각형 */}
                        <div className="space-y-1.5">
                            {monthCalendar.map((week, weekIndex) => (
                                <div key={weekIndex} className="grid grid-cols-7 gap-1.5">
                                    {week.map((day, dayIndex) => {
                                        if (!day) {
                                            return <div key={`empty-${weekIndex}-${dayIndex}`} className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16" />;
                                        }

                                        const date = new Date(day.date);
                                        const dayNum = date.getDate();
                                        const isToday = day.date === FlashcardStorage.getDateString();

                                        return (
                                            <div
                                                key={day.date}
                                                className={`
                                                    w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16
                                                    rounded border
                                                    ${getHeatmapColor(day.cardsStudied)}
                                                    ${isToday ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300'}
                                                    hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all
                                                `}
                                                title={`${date.getMonth() + 1}월 ${dayNum}일: ${day.cardsStudied}개 카드 학습${day.sessionsCount > 0 ? `, ${day.sessionsCount}회 세션` : ''}`}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* 범례 */}
                        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-600">
                            <span>적음</span>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 bg-gray-100 rounded border border-gray-300"></div>
                                <div className="w-3 h-3 bg-green-200 rounded"></div>
                                <div className="w-3 h-3 bg-green-400 rounded"></div>
                                <div className="w-3 h-3 bg-green-600 rounded"></div>
                                <div className="w-3 h-3 bg-green-800 rounded"></div>
                            </div>
                            <span>많음</span>
                        </div>
                    </div>
                </div>

                {/* 전체 통계 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 xl:p-6">
                    <h3 className="text-lg xl:text-xl font-semibold text-gray-800 mb-4">📊 전체 통계</h3>

                    <div className="grid grid-cols-1 gap-4 xl:gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-3xl xl:text-4xl font-bold text-blue-600">{totalStats.totalCardSets}</div>
                            <div className="text-sm text-gray-600 mt-1">카드셋</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-3xl xl:text-4xl font-bold text-green-600">{totalStats.totalCards}</div>
                            <div className="text-sm text-gray-600 mt-1">총 카드 수</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-3xl xl:text-4xl font-bold text-purple-600">{totalStats.totalStudyCount}</div>
                            <div className="text-sm text-gray-600 mt-1">총 학습 횟수</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 최근 7일 활동 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 xl:p-6 mt-6 xl:mt-8">
                <h3 className="text-lg xl:text-xl font-semibold text-gray-800 mb-4">📈 최근 7일 활동</h3>

                <div className="space-y-3">
                    {weekStats.slice().reverse().map((day) => {
                        const date = new Date(day.date);
                        const dayName = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
                        const isToday = day.date === FlashcardStorage.getDateString();

                        return (
                            <div key={day.date} className={`flex items-center gap-3 xl:gap-4 p-3 rounded-lg ${isToday ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                                <div className="w-16 xl:w-20 text-sm">
                                    <div className={`font-medium ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                                        {date.getMonth() + 1}/{date.getDate()}
                                    </div>
                                    <div className="text-xs text-gray-500">{dayName}요일</div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 xl:h-3 overflow-hidden">
                                            <div
                                                className={`h-full ${isToday ? 'bg-blue-500' : 'bg-green-500'} transition-all`}
                                                style={{ width: `${Math.min(100, (day.cardsStudied / 30) * 100)}%` }}
                                            />
                                        </div>
                                        <div className={`text-sm font-medium min-w-[60px] text-right ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                                            {day.cardsStudied}개 카드
                                        </div>
                                    </div>
                                    {day.sessionsCount > 0 && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {day.sessionsCount}회 학습
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Statistics;
