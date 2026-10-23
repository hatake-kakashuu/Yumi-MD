import fse from "fs-extra";
const { readFile, unlink } = fse;
import { exec } from "child_process";
import { tmpdir } from "os";
import path from "path";
import fs from "fs";

export class YT {
    constructor(url, type = "video") {
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

        this.getCookiesArg = () => {
            const cwdCookies = path.resolve(process.cwd(), "cookies.txt");
            if (fs.existsSync(cwdCookies)) return `--cookies "${cwdCookies}"`;
            const baseCookies = "/home/ubuntu/Base/cookies.txt";
            if (fs.existsSync(baseCookies)) return `--cookies "${baseCookies}"`;
            return "";
        };

        this.getNodeArg = () => {
            if (fs.existsSync("/home/ubuntu/.local/bin/node")) return `--js-runtimes "node:/home/ubuntu/.local/bin/node"`;
            return "";
        };

        this.getInfo = async () => {
            if (this.url.includes("youtu.be/")) {
                this.url = this.url.replace("youtu.be/", "www.youtube.com/watch?v=");
            }
            const cookieArg = this.getCookiesArg();
            const nodeArg = this.getNodeArg();
            const cmd = `yt-dlp --no-playlist --force-ipv4 ${cookieArg} ${nodeArg} --dump-json "${this.url}"`;
            return new Promise((resolve, reject) => {
                exec(cmd, { maxBuffer: 1024 * 1024 * 100 }, (e, out) => {
                    if (e)
                        return reject(e);
                    try {
                        resolve(JSON.parse(out));
                    }
                    catch {
                        reject(new Error("Failed to parse yt-dlp output"));
                    }
                });
            });
        };

        this.download = async (quality = "medium") => {
            if (this.url.includes("youtu.be/")) {
                this.url = this.url.replace("youtu.be/", "www.youtube.com/watch?v=");
            }
            const baseId = `yt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            const cookieArg = this.getCookiesArg();
            const nodeArg = this.getNodeArg();
            let cmd;

            if (this.type === "audio") {
                const targetPath = path.join(tmpdir(), `${baseId}.%(ext)s`);
                cmd = `yt-dlp --no-playlist --force-ipv4 ${cookieArg} ${nodeArg} -x --audio-format mp3 -o "${targetPath}" "${this.url}"`;
            } else {
                const q = String(quality || "medium").toLowerCase();
                let format;
                if (q === "low") {
                    format = "b[height<=360]/bv*[height<=360]+ba/b/best";
                } else if (q === "high") {
                    format = "b[height<=1080]/bv*[height<=1080]+ba/b/best";
                } else {
                    format = "b[height<=720]/bv*[height<=720]+ba/b/best";
                }
                const targetPath = path.join(tmpdir(), `${baseId}.%(ext)s`);
                cmd = `yt-dlp --no-playlist --force-ipv4 ${cookieArg} ${nodeArg} --merge-output-format mp4 -f "${format}" -o "${targetPath}" "${this.url}"`;
            }

            try {
                await this.execCmd(cmd);
            }
            catch (e) {
                throw new Error(`yt-dlp failed: ${e}`);
            }

            // Find created file in tmpdir
            const files = fs.readdirSync(tmpdir()).filter(f => f.startsWith(baseId));
            if (!files.length) {
                throw new Error("Downloaded file not found");
            }
            const finalFilePath = path.join(tmpdir(), files[0]);
            const buffer = await readFile(finalFilePath);
            await unlink(finalFilePath).catch(() => {});
            return buffer;
        };
    }
}
