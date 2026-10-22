import puppeteer from 'puppeteer';
export async function toPDF(images, pdfPath) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try {
        const page = await browser.newPage();
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; padding: 0; background: black; }
                    img { width: 100%; height: auto; display: block; page-break-after: always; }
                    img:last-child { page-break-after: avoid; }
                </style>
            </head>
            <body>
                ${images.map(img => `<img src="${img}" />`).join('')}
            </body>
            </html>
        `;
        await page.setContent(html, { waitUntil: 'networkidle0' });
        await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
    }
    finally {
        await browser.close();
    }
}
