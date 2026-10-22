import { default as axios } from 'axios';
import { tmpdir } from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';
import fse from 'fs-extra';
const { readFile, unlink, writeFile } = fse;
import { load } from 'cheerio';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { createCanvas } from 'canvas';
export class Utils {
    constructor() {
        this.exec = promisify(exec);
        this.realURL = async (url) => {
            try {
                const res = await axios.get(url);
                return res.request?.res?.responseUrl || url;
            }
            catch {
                return url;
            }
        };
    }
    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
    extractUrls(text) {
        return Array.from(text.matchAll(/https?:\/\/[^\s)>\]]+/g)).map(r => r[0]);
    }
    async getBuffer(url) {
        const r = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
        return Buffer.from(r.data);
    }
    async fetch(url) {
        const r = await axios.get(url, { timeout: 15000 });
        return r.data;
    }
    async downloadQuotedMedia(quoted) {
        try {
            return (await downloadMediaMessage({ key: quoted.key, message: quoted.message }, 'buffer', {}));
        }
        catch {
            return null;
        }
    }
    async mp3ToOpus(input) {
        const file = `${tmpdir()}/${Math.random().toString(36)}`;
        await writeFile(`${file}.input`, input);
        await this.exec(`ffmpeg -y -i "${file}.input" -c:a libopus -b:a 64k "${file}.opus"`);
        const buffer = await readFile(`${file}.opus`);
        await Promise.all([
            unlink(`${file}.input`).catch(() => { }),
            unlink(`${file}.opus`).catch(() => { })
        ]);
        return buffer;
    }
    async pinterest(query) {
        try {
            const data = await this.fetch(`https://weeb-api.vercel.app/pinterest?query=${encodeURIComponent(query)}`);
            return Array.isArray(data) ? data : [];
        }
        catch {
            return [];
        }
    }
    async gifToMp4(gif) {
        const file = `${tmpdir()}/${Math.random().toString(36)}`;
        await writeFile(`${file}.gif`, gif);
        await this.exec(`ffmpeg -f gif -i "${file}.gif" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${file}.mp4"`);
        const mp4 = await readFile(`${file}.mp4`);
        unlink(`${file}.gif`).catch(() => { });
        unlink(`${file}.mp4`).catch(() => { });
        return mp4;
    }
    async webpToPng(webp) {
        const file = `${tmpdir()}/${Math.random().toString(36)}`;
        await writeFile(`${file}.webp`, webp);
        await this.exec(`dwebp "${file}.webp" -o "${file}.png"`);
        const png = await readFile(`${file}.png`);
        unlink(`${file}.webp`).catch(() => { });
        unlink(`${file}.png`).catch(() => { });
        return png;
    }
    async compressMp4(mp4) {
        const file = `${tmpdir()}/${Math.random().toString(36)}`;
        await writeFile(`${file}.mp4`, mp4);
        await this.exec(`ffmpeg -i "${file}.mp4" -preset ultrafast -c:v libx265 -crf 28 -c:a copy "${file}_compressed.mp4"`);
        const buffer = await readFile(`${file}_compressed.mp4`);
        unlink(`${file}.mp4`).catch(() => { });
        unlink(`${file}_compressed.mp4`).catch(() => { });
        return buffer;
    }
    async webpToMp4(webp) {
        const form = new FormData();
        form.append('new-image-url', '');
        form.append('new-image', webp, { filename: 'file.webp' });
        const upload = await fetch('https://ezgif.com/webp-to-mp4', {
            method: 'POST',
            body: form
        }).then(r => r.text());
        const $ = load(upload);
        const file = $('input[name="file"]').attr('value');
        const form2 = new FormData();
        form2.append('file', file);
        form2.append('convert', 'Convert WebP to MP4!');
        const convert = await fetch(`https://ezgif.com/webp-to-mp4/${file}`, {
            method: 'POST',
            body: form2
        }).then(r => r.text());
        const $$ = load(convert);
        const out = $$('div#output > p.outfile > video > source').attr('src');
        return await this.getBuffer(`https:${out}`);
    }
    async endChess(handler, client, from, winner) {
        const ch = handler.chess.challenges.get(from);
        handler.chess.games.delete(from);
        handler.chess.ongoing.delete(from);
        handler.chess.challenges.delete(from);
        if (winner && ch) {
            let winnerJid = '';
            if (winner === 'White')
                winnerJid = ch.challenger;
            else if (winner === 'Black')
                winnerJid = ch.challengee;
            else
                winnerJid = winner;
            if (winnerJid) {
                await client.DB.setExp(winnerJid, 100);
            }
        }
    }
    parseChessBoard(board1D) {
        const board2D = [];
        for (let i = 0; i < 8; i++) {
            const row = [];
            for (let j = 0; j < 8; j++) {
                const piece = board1D[(7 - i) * 8 + j];
                if (piece === '  ') {
                    row.push('');
                }
                else {
                    const color = piece[0];
                    let type = piece[1];
                    if (type === 'k')
                        type = 'N';
                    const mappedPiece = color === 'w' ? type.toUpperCase() : type.toLowerCase();
                    row.push(mappedPiece);
                }
            }
            board2D.push(row);
        }
        return board2D;
    }
    getHangman(stage) {
        const canvas = createCanvas(300, 300);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1e1e2e';
        ctx.fillRect(0, 0, 300, 300);
        ctx.strokeStyle = '#cdd6f4';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(40, 270);
        ctx.lineTo(260, 270);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(80, 270);
        ctx.lineTo(80, 40);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(80, 40);
        ctx.lineTo(200, 40);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(80, 90);
        ctx.lineTo(130, 40);
        ctx.stroke();
        ctx.strokeStyle = '#f9e2af';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(200, 40);
        ctx.lineTo(200, 90);
        ctx.stroke();
        ctx.strokeStyle = '#f38ba8';
        ctx.lineWidth = 5;
        if (stage >= 1) {
            ctx.beginPath();
            ctx.arc(200, 110, 20, 0, Math.PI * 2);
            ctx.stroke();
        }
        if (stage >= 2) {
            ctx.beginPath();
            ctx.moveTo(200, 130);
            ctx.lineTo(200, 190);
            ctx.stroke();
        }
        if (stage >= 3) {
            ctx.beginPath();
            ctx.moveTo(200, 140);
            ctx.lineTo(170, 170);
            ctx.stroke();
        }
        if (stage >= 4) {
            ctx.beginPath();
            ctx.moveTo(200, 140);
            ctx.lineTo(230, 170);
            ctx.stroke();
        }
        if (stage >= 5) {
            ctx.beginPath();
            ctx.moveTo(200, 190);
            ctx.lineTo(170, 240);
            ctx.stroke();
        }
        if (stage >= 6) {
            ctx.beginPath();
            ctx.moveTo(200, 190);
            ctx.lineTo(230, 240);
            ctx.stroke();
            ctx.strokeStyle = '#1e1e2e';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(192, 106);
            ctx.lineTo(196, 110);
            ctx.moveTo(196, 106);
            ctx.lineTo(192, 110);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(204, 106);
            ctx.lineTo(208, 110);
            ctx.moveTo(208, 106);
            ctx.lineTo(204, 110);
            ctx.stroke();
        }
        return canvas.toBuffer();
    }
}
