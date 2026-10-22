import { MongoClient } from 'mongodb';
export class Database {
    constructor(uri) {
        this.user = {
            get: async (jid) => this.getUser(jid),
            all: async () => {
                const arr = await this.usersCollection.find().toArray();
                return arr.map(user => ({
                    value: {
                        whatsapp: {
                            net: user
                        }
                    }
                }));
            }
        };
        this.userCache = new Map();
        this.groupCache = new Map();
        this.getUser = async (jid) => {
            const cached = this.userCache.get(jid);
            if (cached && (Date.now() - cached.time < 30000)) {
                return cached.data;
            }
            let user = await this.usersCollection.findOne({ jid });
            if (user) {
                this.userCache.set(jid, { data: user, time: Date.now() });
                return user;
            }
            const defaultUser = {
                jid,
                tag: Math.floor(1000 + Math.random() * 9000).toString(),
                wallet: 0,
                experience: 0,
                bank: 0,
                spinCount: 0,
                wpname: 'Username not set',
                quizWins: 0,
                tcgDeck: [],
                tcgCollection: [],
                pokehunt: 0,
                lastDaily: 0,
                dailyTasks: null,
                lastRob: 0,
                ban: { banned: false },
                level: 1,
                party: [],
                lastHunt: 0,
                pc: [],
                wishlist: [],
                deck: [],
                spawnedPack: [],
                lastSpin: 0,
                yucard: [],
                raidPass: false,
                gender: 'Not set',
                yucoll: [],
                cardCollection: [],
                inventory: [],
                icon: { custom: false },
                about: { custom: false },
                username: { custom: false },
                haigusha: { married: false, data: {} },
                companion: 'None',
                lastHeal: 0,
                badges: [],
                gallery: [],
                afk: {
                    isOffline: false
                },
                lastWeekly: 0,
                claimedBonus: false,
                claimedOpenCreate: false,
                title: '',
                pokemonBattle: {
                    wins: 0,
                    losses: 0,
                    totalBattles: 0,
                    streak: 0,
                    lastResult: null
                },
                credits: 0,
                locked: false,
                dailyStreak: 0,
                warnings: {},
                token: 0,
                fusionPending: null,
                elitePass: undefined
            };
            await this.usersCollection.insertOne(defaultUser);
            this.userCache.set(jid, { data: defaultUser, time: Date.now() });
            return defaultUser;
        };
        this.updateUser = async (jid, field, method, update) => {
            this.userCache.delete(jid);
            await this.getUser(jid);
            const updateDoc = method === 'inc'
                ? { $inc: { [field]: update } }
                : { $set: { [field]: update } };
            await this.usersCollection.updateOne({ jid }, updateDoc);
        };
        this.setMoney = async (jid, money, field = 'wallet') => {
            await this.updateUser(jid, field, 'inc', money);
        };
        this.removeMoney = async (jid, money, field = 'wallet') => {
            await this.updateUser(jid, field, 'inc', -money);
        };
        this.setExp = async (jid, exp) => {
            await this.updateUser(jid, 'experience', 'inc', exp);
        };
        this.moveToBank = async (jid, amount) => {
            const user = await this.getUser(jid);
            if ((user.wallet || 0) < amount)
                throw new Error('Insufficient wallet Yen');
            this.userCache.delete(jid);
            await this.usersCollection.updateOne({ jid }, {
                $inc: { wallet: -amount, bank: amount }
            });
        };
        this.moveFromBank = async (jid, amount) => {
            const user = await this.getUser(jid);
            if ((user.bank || 0) < amount)
                throw new Error('Insufficient bank Yen');
            this.userCache.delete(jid);
            await this.usersCollection.updateOne({ jid }, {
                $inc: { bank: -amount, wallet: amount }
            });
        };
        this.transfer = async (from, to, amount) => {
            const sender = await this.getUser(from);
            if ((sender.wallet || 0) < amount)
                throw new Error('Insufficient Yen');
            this.userCache.delete(from);
            this.userCache.delete(to);
            await this.getUser(to);
            await this.usersCollection.updateOne({ jid: from }, { $inc: { wallet: -amount } });
            await this.usersCollection.updateOne({ jid: to }, { $inc: { wallet: amount } });
        };
        this.disabledCommandsCache = null;
        this.getDisabledCommands = async () => {
            if (this.disabledCommandsCache) return this.disabledCommandsCache;
            try {
                const doc = await this.db.collection('disabled_commands').findOne({ title: 'disabled' });
                this.disabledCommandsCache = doc && Array.isArray(doc.disabledCommands) ? doc.disabledCommands : [];
                return this.disabledCommandsCache;
            } catch {
                return [];
            }
        };
        this.denyCommand = async (commandName, reason, deniedBy) => {
            const newCmd = {
                command: commandName,
                reason,
                deniedBy,
                time: new Date().toUTCString()
            };
            const commands = await this.getDisabledCommands();
            const existingIdx = commands.findIndex(x => x.command === commandName);
            if (existingIdx >= 0) {
                commands[existingIdx] = newCmd;
            } else {
                commands.push(newCmd);
            }
            this.disabledCommandsCache = commands;
            await this.db.collection('disabled_commands').updateOne({ title: 'disabled' }, { $set: { disabledCommands: commands } }, { upsert: true });
        };
        this.acceptCommand = async (target) => {
            const commands = await this.getDisabledCommands();
            const index = typeof target === 'number'
                ? target
                : commands.findIndex(x => x.command === target);
            if (index >= 0 && index < commands.length) {
                commands.splice(index, 1);
                this.disabledCommandsCache = commands;
                await this.db.collection('disabled_commands').updateOne({ title: 'disabled' }, { $set: { disabledCommands: commands } }, { upsert: true });
                return true;
            }
            return false;
        };
        this.isCommandDenied = async (commandName) => {
            const disabled = await this.getDisabledCommands();
            return disabled.find(x => x.command === commandName) || null;
        };
        this.banUser = async (jid, bannedBy, bannedIn, reason) => {
            await this.updateUser(jid, 'ban', 'set', {
                banned: true,
                bannedBy,
                bannedIn,
                time: new Date().toUTCString(),
                reason
            });
        };
        this.unbanUser = async (jid) => {
            await this.updateUser(jid, 'ban', 'set', {
                banned: false
            });
        };
        this.getGroup = async (jid) => {
            if (this.groupCache.has(jid)) {
                return this.groupCache.get(jid);
            }
            let group = await this.groupsCollection.findOne({ jid });
            if (!group) {
                const defaultGroup = {
                    jid,
                    events: false,
                    nsfw: false,
                    wild: false,
                    cards: false,
                    news: false,
                    bot: '',
                    chara: false,
                    yucards: false,
                    pokecards: false
                };
                await this.groupsCollection.insertOne(defaultGroup);
                group = defaultGroup;
            }
            this.groupCache.set(jid, group);
            return group;
        };
        this.updateGroup = async (jid, feature, value) => {
            const group = await this.getGroup(jid);
            group[feature] = value;
            this.groupCache.set(jid, group);
            await this.groupsCollection.updateOne({ jid }, { $set: { [feature]: value } });
        };
        this.getUserWarnings = async (jid, groupJid) => {
            const doc = await this.warningsCollection.findOne({ jid, group: groupJid });
            return doc || { count: 0, reasons: [] };
        };
        this.addWarning = async (jid, groupJid, reason) => {
            const current = await this.getUserWarnings(jid, groupJid);
            const count = current.count + 1;
            const reasons = [...current.reasons, reason];
            await this.warningsCollection.updateOne({ jid, group: groupJid }, { $set: { count, reasons } }, { upsert: true });
            return count;
        };
        this.resetWarnings = async (jid, groupJid) => {
            await this.warningsCollection.deleteOne({ jid, group: groupJid });
        };
        this.getClaimedCards = async () => {
            const doc = await this.db.collection('claimed_cards').findOne({ title: 'cards' });
            if (doc)
                return { title: 'cards', data: doc.data || [] };
            const defaultData = { title: 'cards', data: [] };
            await this.db.collection('claimed_cards').insertOne(defaultData);
            return defaultData;
        };
        this.updateClaimedCards = async (data) => {
            await this.getClaimedCards();
            await this.db.collection('claimed_cards').updateOne({ title: 'cards' }, { $set: { data } }, { upsert: true });
        };
        this.addToWishlist = async (jid, card) => {
            const user = await this.getUser(jid);
            if (!user.wishlist)
                user.wishlist = [];
            if (user.wishlist.includes(card))
                return false;
            user.wishlist.push(card);
            await this.updateUser(jid, 'wishlist', 'set', user.wishlist);
            return true;
        };
        this.removeFromWishlist = async (jid, card) => {
            const user = await this.getUser(jid);
            if (!user.wishlist)
                user.wishlist = [];
            const index = user.wishlist.findIndex((w) => w.toLowerCase() === card.toLowerCase());
            if (index === -1)
                return false;
            user.wishlist.splice(index, 1);
            await this.updateUser(jid, 'wishlist', 'set', user.wishlist);
            return true;
        };
        this.getBotSetting = async (key, fallback = null) => {
            try {
                const doc = await this.settingsCollection.findOne({ key });
                return doc ? doc.value : fallback;
            } catch {
                return fallback;
            }
        };
        this.setBotSetting = async (key, value) => {
            try {
                await this.settingsCollection.updateOne(
                    { key },
                    { $set: { key, value, updatedAt: Date.now() } },
                    { upsert: true }
                );
                return true;
            } catch (e) {
                console.error('Failed to update bot setting:', e);
                return false;
            }
        };
        this.client = new MongoClient(uri);
    }
    async connect() {
        await this.client.connect();
        this.db = this.client.db(process.env.DB_NAME || 'yumi_bot');
        this.usersCollection = this.db.collection('users');
        this.groupsCollection = this.db.collection('groups');
        this.warningsCollection = this.db.collection('warnings');
        this.settingsCollection = this.db.collection('settings');
    }
}
