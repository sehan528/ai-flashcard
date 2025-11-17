import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validation function (copied from storage.ts)
function validateCardSet(set) {
    // Basic type check
    if (typeof set !== 'object' || set === null) {
        return { valid: false, error: '올바른 플래시카드 형식이 아닙니다.' };
    }

    // Required field checks
    if (typeof set.id !== 'string' || !set.id) {
        return { valid: false, error: '카드셋 ID가 올바르지 않습니다.' };
    }

    if (typeof set.name !== 'string' || !set.name) {
        return { valid: false, error: '카드셋 이름이 올바르지 않습니다.' };
    }

    if (!Array.isArray(set.cards)) {
        return { valid: false, error: '카드 목록이 배열 형태가 아닙니다.' };
    }

    // Validate each card
    for (const card of set.cards) {
        if (typeof card !== 'object' || card === null) {
            return { valid: false, error: '카드 데이터가 올바르지 않습니다.' };
        }

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
    }

    return { valid: true };
}

// Test the DB dataset
const dbJsonPath = path.join(__dirname, '../public/dataset/db/db.json');

console.log('Testing DB dataset import validation...\n');

try {
    const content = fs.readFileSync(dbJsonPath, 'utf8');
    const data = JSON.parse(content);

    console.log('✓ JSON parsing successful');
    console.log(`  CardSet name: ${data.name}`);
    console.log(`  Total cards: ${data.cards.length}`);
    console.log('');

    const validation = validateCardSet(data);

    if (validation.valid) {
        console.log('✅ VALIDATION PASSED!');
        console.log('The dataset is compatible with the import functionality.');
        console.log('');
        console.log('Sample card:');
        console.log(`  Question: ${data.cards[0].question.substring(0, 50)}...`);
        console.log(`  Has ID: ${!!data.cards[0].id}`);
        console.log(`  Has createdAt: ${!!data.cards[0].createdAt}`);
        console.log(`  Has studyCount: ${data.cards[0].studyCount !== undefined}`);
    } else {
        console.log('❌ VALIDATION FAILED!');
        console.log(`Error: ${validation.error}`);
        process.exit(1);
    }
} catch (error) {
    console.log('❌ ERROR!');
    console.log(error.message);
    process.exit(1);
}
