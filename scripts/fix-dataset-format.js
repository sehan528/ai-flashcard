import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate unique ID
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Fix dataset format
function fixDatasetFormat(filePath) {
    try {
        console.log(`Processing: ${filePath}`);

        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        // Add missing top-level fields
        if (!data.id) {
            data.id = generateId();
        }

        if (!data.createdAt) {
            data.createdAt = new Date().toISOString();
        }

        // Add missing card fields
        if (Array.isArray(data.cards)) {
            data.cards = data.cards.map(card => {
                if (!card.id) {
                    card.id = generateId();
                }

                if (!card.createdAt) {
                    card.createdAt = new Date().toISOString();
                }

                if (card.studyCount === undefined) {
                    card.studyCount = 0;
                }

                return card;
            });
        }

        // Write back to file
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`✓ Fixed: ${filePath}`);
        console.log(`  - CardSet ID: ${data.id}`);
        console.log(`  - Cards: ${data.cards.length}`);

    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
    }
}

// Process all dataset files
const datasetDir = path.join(__dirname, '../public/dataset');

function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            processDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
            fixDatasetFormat(fullPath);
        }
    }
}

// Start processing
if (fs.existsSync(datasetDir)) {
    console.log('Fixing dataset formats...\n');
    processDirectory(datasetDir);
    console.log('\nDone!');
} else {
    console.error('Dataset directory not found:', datasetDir);
}
