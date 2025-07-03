import type { VercelRequest, VercelResponse } from '@vercel/node';

// Rate Limiting을 위한 메모리 저장소 (간단한 구현)
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();

// 요청 타입 정의
interface EvaluationRequest {
    question: string;
    userAnswer: string;
    correctAnswer: string;
}

interface EvaluationResponse {
    score: number;
    feedback: string;
    improvements?: string[];
    source: 'ai' | 'fallback';
}

// IP 기반 Rate Limiting (일일 50회, 초당 5회)
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const today = new Date().toDateString();
    const key = `${ip}-${today}`;

    const current = rateLimitStore.get(key) || { count: 0, lastReset: now };

    // 일일 리셋 체크
    if (new Date(current.lastReset).toDateString() !== today) {
        current.count = 0;
        current.lastReset = now;
    }

    const dailyLimit = 50;
    const allowed = current.count < dailyLimit;

    if (allowed) {
        current.count++;
        rateLimitStore.set(key, current);
    }

    return {
        allowed,
        remaining: Math.max(0, dailyLimit - current.count)
    };
}

// Hugging Face API 호출
async function callHuggingFaceAPI(
    question: string,
    userAnswer: string,
    correctAnswer: string
): Promise<EvaluationResponse> {
    const HF_TOKEN = process.env.HUGGING_FACE_TOKEN;

    if (!HF_TOKEN) {
        throw new Error('Hugging Face token not configured');
    }

    // 영어 프롬프트로 안정적인 평가
    const prompt = `
Please evaluate this student's answer:

Question: ${question}
Correct Answer: ${correctAnswer}
Student's Answer: ${userAnswer}

Please provide evaluation in this format:
Score: [0-100]%
Feedback: [specific feedback in Korean]
Improvement: [what to study more]
`;

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
            {
                headers: {
                    Authorization: `Bearer ${HF_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 200,
                        temperature: 0.7,
                        do_sample: true
                    }
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`HF API error: ${response.status}`);
        }

        const result = await response.json();

        // AI 응답 파싱
        const aiResponse = result[0]?.generated_text || result.generated_text || '';
        const evaluation = parseAIResponse(aiResponse, userAnswer, correctAnswer);

        return {
            ...evaluation,
            source: 'ai'
        };

    } catch (error) {
        console.error('Hugging Face API error:', error);
        // 폴백으로 기본 평가 제공
        return calculateFallbackEvaluation(userAnswer, correctAnswer);
    }
}

// AI 응답 파싱 함수
function parseAIResponse(
    aiResponse: string,
    userAnswer: string,
    correctAnswer: string
): Omit<EvaluationResponse, 'source'> {
    try {
        // 점수 추출 (정규식)
        const scoreMatch = aiResponse.match(/(?:Score|점수):\s*(\d{1,3})%?/i);
        let score = scoreMatch ? parseInt(scoreMatch[1]) : null;

        // 피드백 추출
        const feedbackMatch = aiResponse.match(/(?:Feedback|피드백):\s*(.+?)(?:\n|$|Improvement)/is);
        let feedback = feedbackMatch ? feedbackMatch[1].trim() : '';

        // 개선점 추출
        const improvementMatch = aiResponse.match(/(?:Improvement|개선점):\s*(.+)/is);
        const improvements = improvementMatch ? [improvementMatch[1].trim()] : [];

        // 점수가 추출되지 않으면 키워드 매칭으로 계산
        if (!score) {
            score = calculateKeywordMatchScore(userAnswer, correctAnswer);
        }

        // 피드백이 너무 짧으면 기본 메시지 생성
        if (!feedback || feedback.length < 10) {
            feedback = generateBasicFeedback(score);
        }

        return {
            score: Math.min(100, Math.max(0, score)),
            feedback,
            improvements: improvements.length > 0 ? improvements : undefined
        };

    } catch (error) {
        console.error('AI response parsing error:', error);
        // 파싱 실패 시 폴백
        return calculateFallbackEvaluation(userAnswer, correctAnswer);
    }
}

// 키워드 매칭 기반 점수 계산 (폴백용)
function calculateKeywordMatchScore(userAnswer: string, correctAnswer: string): number {
    const userWords = userAnswer.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const correctWords = correctAnswer.toLowerCase().split(/\s+/).filter(word => word.length > 2);

    if (correctWords.length === 0) return 50;

    const matches = userWords.filter(word =>
        correctWords.some(correctWord =>
            correctWord.includes(word) || word.includes(correctWord)
        )
    );

    const baseScore = Math.round((matches.length / correctWords.length) * 100);

    // 길이 보정 (너무 짧거나 긴 답변 페널티)
    const lengthRatio = userAnswer.length / correctAnswer.length;
    const lengthPenalty = lengthRatio < 0.3 || lengthRatio > 3 ? 10 : 0;

    return Math.max(10, Math.min(90, baseScore - lengthPenalty));
}

// 폴백 평가 계산
function calculateFallbackEvaluation(
    userAnswer: string,
    correctAnswer: string
): EvaluationResponse {
    const score = calculateKeywordMatchScore(userAnswer, correctAnswer);

    return {
        score,
        feedback: generateBasicFeedback(score),
        improvements: score < 70 ? ['정답과 비교하여 누락된 키워드를 확인해보세요.'] : undefined,
        source: 'fallback'
    };
}

// 기본 피드백 생성
function generateBasicFeedback(score: number): string {
    if (score >= 90) {
        return '훌륭합니다! 정답과 거의 일치하는 답변입니다.';
    } else if (score >= 70) {
        return '좋은 답변입니다. 몇 가지 세부사항을 보완하면 더 완벽할 것 같습니다.';
    } else if (score >= 50) {
        return '기본 개념은 이해하고 계시지만, 좀 더 구체적인 설명이 필요합니다.';
    } else if (score >= 30) {
        return '부분적으로 맞는 내용이 있지만, 핵심 개념을 다시 학습해보세요.';
    } else {
        return '정답과 차이가 큽니다. 관련 개념을 다시 공부하시길 권장합니다.';
    }
}

// 메인 핸들러
export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS 요청 처리 (CORS preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // POST 요청만 허용
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // IP 주소 추출
        const ip = req.headers['x-forwarded-for'] as string ||
            req.headers['x-real-ip'] as string ||
            req.connection?.remoteAddress ||
            'unknown';

        // Rate Limiting 체크
        const rateLimit = checkRateLimit(Array.isArray(ip) ? ip[0] : ip);

        if (!rateLimit.allowed) {
            return res.status(429).json({
                error: 'Rate limit exceeded. Try again tomorrow.',
                remaining: rateLimit.remaining
            });
        }

        // 요청 데이터 검증
        const { question, userAnswer, correctAnswer }: EvaluationRequest = req.body;

        if (!question || !userAnswer || !correctAnswer) {
            return res.status(400).json({
                error: 'Missing required fields: question, userAnswer, correctAnswer'
            });
        }

        if (userAnswer.trim().length < 5) {
            return res.status(400).json({
                error: 'User answer too short. Please provide at least 5 characters.'
            });
        }

        // AI 평가 실행
        const evaluation = await callHuggingFaceAPI(question, userAnswer, correctAnswer);

        // 성공 응답
        res.status(200).json({
            ...evaluation,
            remaining: rateLimit.remaining - 1
        });

    } catch (error) {
        console.error('API Error:', error);

        // 에러 시 폴백 평가 제공
        const { userAnswer, correctAnswer } = req.body || {};

        if (userAnswer && correctAnswer) {
            const fallbackEvaluation = calculateFallbackEvaluation(userAnswer, correctAnswer);
            return res.status(200).json({
                ...fallbackEvaluation,
                error: 'AI service temporarily unavailable'
            });
        }

        res.status(500).json({
            error: 'Internal server error'
        });
    }
}