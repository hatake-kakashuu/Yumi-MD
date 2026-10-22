import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands() {
    const commandsPath = path.join(__dirname, '..', 'Commands');
    if (!fs.existsSync(commandsPath)) return;

    const loadFiles = async (dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await loadFiles(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.js') && !entry.name.endsWith('.d.ts')) {
                await import(`file://${fullPath}`);
            }
        }
    };

    await loadFiles(commandsPath);
}

export default loadCommands;
