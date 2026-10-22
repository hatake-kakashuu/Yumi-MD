import 'dotenv/config';
import { Client } from './client.js';
import { Logger } from './lib/logger.js';
import { startServer } from './lib/server.js';
import { config } from './config.js';

async function bootstrap() {
    try {
        Logger.info(`🚀 Initializing ${config.botName}...`);

        const client = new Client();
        startServer(client);

        await client.start();
    } catch (error) {
        Logger.error('Failed to start bot:');
        console.error(error);
        process.exit(1);
    }
}

process.on('unhandledRejection', (reason) => {
    Logger.error('Unhandled Promise Rejection:');
    console.error(reason);
});

process.on('uncaughtException', (error) => {
    Logger.error('Uncaught Exception:');
    console.error(error);
});

bootstrap();
