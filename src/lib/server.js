import express from 'express';
import path from 'path';
import { Logger } from './logger.js';
export function startServer(client) {
    const app = express();
    const port = process.env.PORT || 8070;
    app.use(express.json());
    app.use(express.static(path.resolve('public')));
    app.get('/api/status', (req, res) => {
        res.json({
            status: client.connectionStatus,
            qr: client.qrCode,
            botName: client.botName
        });
    });
    app.listen(port, () => {
        Logger.success(`💻 Web server is running at http://localhost:${port}`);
    });
}
