import 'dotenv/config';

const parseNumberList = (str = '') => {
    return str
        .split(',')
        .map(s => s.trim().replace(/\r/g, ''))
        .filter(Boolean)
        .map(s => (s.includes('@') ? s : `${s.replace(/[^0-9]/g, '')}@s.whatsapp.net`));
};

export const config = {
    botName: process.env.BOT_NAME || 'Yumi',
    ownerName: process.env.OWNER_NAME || 'Kakashi',
    prefix: process.env.PREFIX || '.',
    mode: (process.env.MODE || 'public').toLowerCase(),
    logLevel: process.env.LOG_LEVEL || 'silent',
    sessionFolder: process.env.SESSION_FOLDER || 'session',
    mongoUri: process.env.MONGODB_URI || 'mongodb+srv://Redo:Redo@cluster0.iwmez.mongodb.net/?retryWrites=true&w=majority',
    dbName: process.env.DB_NAME || 'yumi_bot',
    ownerNumber: (process.env.OWNER_NUMBER || '').trim(),
    mods: [
        ...parseNumberList(process.env.OWNER_NUMBER),
        ...parseNumberList(process.env.MODS)
    ],
    googleApiKey: process.env.GOOGLE_API_KEY || '',
    port: process.env.PORT || 8070
};

export default config;
