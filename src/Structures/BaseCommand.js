export class BaseCommand {
    constructor(client) {
        this.client = client;
    }
    get handler() {
        return this.client.handler;
    }
    getJid(msg) {
        return msg?.key?.remoteJid || msg?.from || null;
    }
}
