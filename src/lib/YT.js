import fse from 'fs-extra';
const { readFile, unlink } = fse;
import { exec } from 'child_process';
import { tmpdir } from 'os';
import path from 'path';
export class YT {
    constructor(url, type = 'video') {
        this.url = url;
        this.type = type;
        this.execCmd = (cmd) => new Promise((resolve, reject) => {
            exec(cmd, { maxBuffer: 1024 * 1024 * 100 }, (err, _, stderr) => {
                if (err)
                    return reject(stderr || err.message);
                resolve();
            });
        });
        this.validate = async () => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\//i.test(this.url);
        this.getInfo = async () => {
            if (this.url.includes('youtu.be/')) {
                this.url = this.url.replace('youtu.be/', 'www.youtube.com/watch?v=');
            }
            const cmd = `yt-dlp ` +
                `--no-playlist ` +
                `--force-ipv4 ` +
                `--cookies "./cookies.txt" ` +
                `--dump-json "${this.url}"`;
            return new Promise((resolve, reject) => {
                exec(cmd, { maxBuffer: 1024 * 1024 * 100 }, (e, out) => {
                    if (e)
                        return reject(e);
                    try {
                        resolve(JSON.parse(out));
                    }
                    catch {
                        reject(new Error('Failed to parse yt-dlp output'));
                    }
                });
            });
        };
        this.download = async (_quality) => {
            if (this.url.includes('youtu.be/')) {
                this.url = this.url.replace('youtu.be/', 'www.youtube.com/watch?v=');
            }
            const file = path.join(tmpdir(), `${Date.now()}.%(ext)s`);
            const outFile = path.join(tmpdir(), `${Date.now()}`);
            const format = this.type === 'audio'
                ? 'ba[ext=m4a]/bestaudio/b'
                : 'bv*[ext=mp4]+ba[ext=m4a]/b/best';
            const ext = this.type === 'audio' ? 'm4a' : 'mp4';
            const out = `${outFile}.${ext}`;
            const cmd = `yt-dlp ` +
                `--no-playlist ` +
                `--force-ipv4 ` +
                `--cookies "./cookies.txt" ` +
                `-f "${format}" ` +
                `-o "${out}" "${this.url}"`;
            try {
                await this.execCmd(cmd);
            }
            catch (e) {
                throw new Error(`yt-dlp failed: ${e}`);
            }
            const buffer = await readFile(out);
            await unlink(out).catch(() => { });
            return buffer;
        };
    }
}
