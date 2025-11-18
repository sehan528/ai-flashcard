import { useState, useEffect } from 'react';
import { FlashcardStorage } from '../domains/flashcard/utils/storage';
import type { DailyStats } from '../domains/flashcard/dtos/FlashCard';

const Statistics = () => {
    const [studyStreak, setStudyStreak] = useState(0);
    const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
    const [weekStats, setWeekStats] = useState<DailyStats[]>([]);
    const [yearStats, setYearStats] = useState<DailyStats[]>([]);
    const [totalStats, setTotalStats] = useState({ totalCardSets: 0, totalCards: 0, totalStudyCount: 0 });

    useEffect(() => {
        loadStatistics();
    }, []);

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

        // 최근 365일 (히트맵용)
        const recentYear = FlashcardStorage.getRecentStudyStats(365);
        setYearStats(recentYear);

        // 전체 통계
        const stats = FlashcardStorage.getStatistics();
        setTotalStats(stats);
    };

    // 히트맵 색상 계산 (0~4 레벨)
    const getHeatmapColor = (count: number): string => {
        if (count === 0) return 'bg-gray-100';
        if (count <= 5) return 'bg-green-200';
        if (count <= 10) return 'bg-green-400';
        if (count <= 20) return 'bg-green-600';
        return 'bg-green-800';
    };

    // 날짜를 주 단위로 그룹화
    const groupByWeeks = (stats: DailyStats[]) => {
        const weeks: DailyStats[][] = [];
        let currentWeek: DailyStats[] = [];

        // 첫 주의 시작 요일 맞추기
        const firstDate = new Date(stats[0]?.date || new Date());
        const firstDayOfWeek = firstDate.getDay(); // 0 (일) ~ 6 (토)

        // 빈 셀로 채우기
        for (let i = 0; i < firstDayOfWeek; i++) {
            currentWeek.push({ date: '', cardsStudied: 0, sessionsCount: 0, cardSetIds: [] });
        }

        stats.forEach((stat, index) => {
            currentWeek.push(stat);

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });

        // 마지막 주 채우기
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push({ date: '', cardsStudied: 0, sessionsCount: 0, cardSetIds: [] });
            }
            weeks.push(currentWeek);
        }

        return weeks;
    };

    const weeks = groupByWeeks(yearStats);

    // 이번 주/이번 달 통계
    const thisWeekTotal = weekStats.reduce((sum, s) => sum + s.cardsStudied, 0);
    const monthStats = FlashcardStorage.getRecentStudyStats(30);
    const thisMonthTotal = monthStats.reduce((sum, s) => sum + s.cardsStudied, 0);

    return (
        <div className="max-w-7xl mx-auto p-4 xl:p-8">
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

            {/* 히트맵 캘린더 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 xl:p-6 mb-6 xl:mb-8">
                <h3 className="text-lg xl:text-xl font-semibold text-gray-800 mb-4">📅 학습 활동 (최근 1년)</h3>

                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        {/* 요일 레이블 */}
                        <div className="flex gap-1 mb-2">
                            <div className="w-8 xl:w-10"></div>
                            <div className="flex-1">
                                <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
                                    <div className="text-center">일</div>
                                    <div className="text-center">월</div>
                                    <div className="text-center">화</div>
                                    <div className="text-center">수</div>
                                    <div className="text-center">목</div>
                                    <div className="text-center">금</div>
                                    <div className="text-center">토</div>
                                </div>
                            </div>
                        </div>

                        {/* 히트맵 그리드 */}
                        <div className="space-y-1">
                            {weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex gap-1">
                                    {/* 주 번호 */}
                                    <div className="w-8 xl:w-10 text-xs text-gray-400 flex items-center justify-end pr-2">
                                        {weekIndex % 4 === 0 && `${Math.floor(weekIndex / 4) + 1}월`}
                                    </div>

                                    {/* 일별 셀 */}
                                    <div className="grid grid-cols-7 gap-1 flex-1">
                                        {week.map((day, dayIndex) => (
                                            <div
                                                key={`${weekIndex}-${dayIndex}`}
                                                className={`
                                                    aspect-square rounded
                                                    ${day.date ? getHeatmapColor(day.cardsStudied) : 'bg-transparent'}
                                                    ${day.date ? 'hover:ring-2 hover:ring-blue-400 cursor-pointer' : ''}
                                                    transition-all
                                                `}
                                                title={day.date ? `${day.date}: ${day.cardsStudied}개 카드 학습` : ''}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 범례 */}
                        <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
                            <span>적음</span>
                            <div className="flex gap-1">
                                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                                <div className="w-4 h-4 bg-green-200 rounded"></div>
                                <div className="w-4 h-4 bg-green-400 rounded"></div>
                                <div className="w-4 h-4 bg-green-600 rounded"></div>
                                <div className="w-4 h-4 bg-green-800 rounded"></div>
                            </div>
                            <span>많음</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 전체 통계 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 xl:p-6">
                <h3 className="text-lg xl:text-xl font-semibold text-gray-800 mb-4">📊 전체 통계</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
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
