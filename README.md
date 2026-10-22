<div align="center">

# 🌸 **YUMI MULTI-DEVICE WHATSAPP BOT** 🌸

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=1000&color=FF69B4&center=true&vCenter=true&width=500&lines=Welcome+to+Yumi-MD+WhatsApp+Bot;Ultra-Fast+%E2%80%A2+Zero+Delay+%E2%80%A2+Multi-Device;100%2B+Commands+%E2%80%A2+Economy+%E2%80%A2+Anime;Made+with+%E2%9D%A4%EF%B8%8F+by+Kakashi" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/hatake-kakashuu/Yumi-MD/main/public/menu.jpg" alt="Yumi-MD Banner" width="450" style="border-radius: 16px; box-shadow: 0 8px 24px rgba(255, 105, 180, 0.4);" />
</p>

<p align="center">
  <strong>⚡ The next-generation WhatsApp bot engineered for supreme speed, zero latency, and seamless multi-device automation.</strong>
</p>

<p align="center">
  <a href="https://github.com/hatake-kakashuu/Yumi-MD/stargazers"><img src="https://img.shields.io/github/stars/hatake-kakashuu/Yumi-MD?style=for-the-badge&color=ff69b4&logo=github" alt="Stars"></a>
  <a href="https://github.com/hatake-kakashuu/Yumi-MD/network/members"><img src="https://img.shields.io/github/forks/hatake-kakashuu/Yumi-MD?style=for-the-badge&color=ffb6c1&logo=github" alt="Forks"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
  <a href="https://github.com/WhiskeySockets/Baileys"><img src="https://img.shields.io/badge/Baileys-Multi--Device-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Baileys"></a>
  <a href="https://github.com/hatake-kakashuu/Yumi-MD/blob/main/LICENSE"><img src="https://img.shields.io/github/license/hatake-kakashuu/Yumi-MD?style=for-the-badge&color=db7093" alt="License"></a>
</p>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4380-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

</div>

## 🚀 **One-Click Instant Deploy**

Deploy **Yumi-MD** effortlessly to your favorite cloud provider with a single click:

<div align="center">

### 🌐 **Choose Your Platform**

| Platform | One-Click Deployment | Setup Type |
| :--- | :---: | :---: |
| **Heroku** | [![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/hatake-kakashuu/Yumi-MD) | `app.json` Automatic Setup |
| **Render** | [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/hatake-kakashuu/Yumi-MD) | Blueprint / Web Service |
| **Koyeb** | [![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?type=git&repository=hatake-kakashuu/Yumi-MD&branch=main&name=yumi-md) | Git Service (Buildpack/Docker) |

</div>

---

### 📦 **Deployment Instructions**

<details>
<summary><b>🟣 Deploying to Heroku</b></summary>

1. Click the **Deploy to Heroku** button above.
2. Fill in the required environment variables:
   - `OWNER_NUMBER`: Your phone number with country code (no `+`, e.g. `919876543210`).
   - `MONGODB_URI`: Your MongoDB Atlas connection URI string.
   - `BOT_NAME`: Name of your bot (default: `Yumi`).
   - `PREFIX`: Command prefix (default: `.`).
3. Click **Deploy app**.
4. Once deployment succeeds, open the app logs to view the QR code and scan it with WhatsApp.
</details>

<details>
<summary><b>🟦 Deploying to Render</b></summary>

1. Fork or push this repository to your GitHub account.
2. Click the **Deploy to Render** button above or create a new **Web Service**.
3. Configure the build & start commands:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. In the **Environment Variables** section, add:
   - `OWNER_NUMBER`: `919876543210`
   - `MONGODB_URI`: `mongodb+srv://...`
   - `BOT_NAME`: `Yumi`
   - `PREFIX`: `.`
5. Click **Deploy**. Check the deployment logs to scan the login QR code!
</details>

<details>
<summary><b>🟩 Deploying to Koyeb</b></summary>

1. Click the **Deploy to Koyeb** button above.
2. Select your repository (`hatake-kakashuu/Yumi-MD`) and branch (`main`).
3. Set buildpack or node command:
   - **Build command:** `npm install`
   - **Run command:** `npm start`
4. Under **Environment variables**, set `OWNER_NUMBER`, `MONGODB_URI`, `BOT_NAME`, and `PREFIX`.
5. Deploy and view the console logs for QR scanning.
</details>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4380-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

## 🌟 **Key Highlights & Performance**

```
⚡ ZERO LATENCY        ⟶   Non-blocking message handling & instant prefix detection (< 0.1ms)
🧠 MEMORY CACHING      ⟶   Real-time in-memory cache for group metadata and DB entities
📱 STATUS SHIELD       ⟶   Auto-drops broadcast stories at socket level, saving CPU & RAM
🔄 AUTO-RECONNECT      ⟶   Smart credentials handler keeps bot alive 24/7
🎮 100+ FEATURES       ⟶   Rich economy, anime cards, games, auto-downloaders, moderation
```

| Feature | Description |
| :--- | :--- |
| **⚡ Turbocharged Speed** | Completely removes artificial sleeps and blocking socket queries for lightning-fast command response. |
| **🛡️ Smart Group Cache** | WhatsApp group participant changes mutate cache in memory—zero redundant network roundtrips. |
| **💾 MongoDB Persistence** | Real-time cloud database keeping track of Yen wallets, levels, exp, cards, and group configurations. |
| **🎨 Media Suite** | Instant sticker creation, video/image conversion, quotation stickers, and background removal. |
| **💴 Japanese Economy** | Yen balances, bank deposits/withdrawals, gambling, daily streak rewards, rob, and bonus chests. |
| **🛡️ Auto-Moderation** | Group lock/unlock, member purge, warn limits, tag-all (`#ping`), and admin protection. |
| **📥 Auto-Downloader** | Drop links from Instagram, TikTok, YouTube, Twitter/X, Pinterest, and Sticker.ly for instant media. |

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4380-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

## 📜 **Command Showcase**

<details open>
<summary><b>👑 General & Owner Commands (Click to collapse)</b></summary>

* `#owner` / `#creator` - Sends the owner's WhatsApp contact vCard (`MY OWNER`) and direct details.
* `#help` / `#menu` - Displays the full interactive categorized menu with stats.
* `#hi` / `#hello` - Simple bot greeting.
</details>

<details>
<summary><b>💴 Economy Commands (Click to expand)</b></summary>

* `#daily` - Claim your daily Yen reward and build your streak.
* `#weekly` - Collect your massive weekly bonus.
* `#bonus` - Claim special bonus Yen.
* `#chest` - Unlock mysterious treasure chests.
* `#gamble <amount>` - Test your luck and double your Yen.
* `#slot <amount>` - Play the thrilling casino slot machine.
* `#rob <@user>` - Attempt to rob wallet Yen from another member.
* `#deposit <amount>` - Safely store your Yen in the bank.
* `#withdraw <amount>` - Withdraw Yen from the bank.
* `#give <@user> <amount>` - Transfer Yen directly to friends.
</details>

<details>
<summary><b>🍙 Anime & Weeb Commands (Click to expand)</b></summary>

* `#anime <title>` - Fetch complete anime details, score, and trailer from MyAnimeList.
* `#manga <title>` - Search and lookup manga synopsis, chapters, and author.
* `#waifu` - Receive a high-definition waifu image.
* `#neko` - Cute catgirl images.
* `#shinobu` - Get Shinobu artwork.
* `#foxgirl` - Receive aesthetic kitsune/foxgirl wallpapers.
* `#loli` / `#maid` / `#uniform` - Anime thematic image gallery.
* `#marry <character>` / `#divorce` - Haigusha marriage simulator.
</details>

<details>
<summary><b>🛠️ Utilities & Media Commands (Click to expand)</b></summary>

* `#sticker` / `#s` - Convert quoted image, video, or gif to a clean WhatsApp sticker.
* `#toimg` - Convert any static or animated sticker back into an image or video.
* `#quotly` - Create a beautiful Telegram-style chat bubble quote sticker.
* `#removebg` - Remove image background with AI precision.
* `#upload` - Upload files/media and get an instant shareable CDN URL.
* `#google <query>` - Instant Google Search results.
* `#wikipedia <query>` - Read encyclopedic summaries directly in chat.
* `#translate <lang> <text>` - Instant multi-language translation.
* `#webss <url>` - Capture a high-resolution screenshot of any web page.
</details>

<details>
<summary><b>🛡️ Group & Moderation Commands (Click to expand)</b></summary>

* `#ping` / `#tagall` - Mention all group members line by line or hidden.
* `#open` - Unlock group for all members to chat.
* `#close` - Lock group to admin announcements only.
* `#timer <minutes>` - Open group temporarily with automatic auto-close timer.
* `#purge` - Rapidly remove all non-admin members in batches.
* `#warn <@user>` - Issue official warnings with auto-kick threshold.
* `#promote <@user>` / `#demote <@user>` - Elevate or demote group admins.
* `#add <number>` / `#remove <@user>` - Add or remove participants.
* `#groupinfo` - Display comprehensive group stats, owner, and settings.
</details>

<details>
<summary><b>🎮 Interactive Games (Click to expand)</b></summary>

* `#ttt` - Play Tic-Tac-Toe in chat against friends.
* `#chess` - Full interactive chess engine with board image rendering.
* `#hangman` - Guess the hidden word before running out of attempts.
* `#startquiz` - Anime trivia quiz competition.
* `#bombgame` - Defuse the ticking bomb game.
</details>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4380-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

## 💻 **Local & VPS Installation**

### **1. Prerequisites**
* **Node.js** `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
* **Git** installed on your terminal
* **MongoDB Atlas URI** ([Create Free Cluster](https://www.mongodb.com/cloud/atlas))

### **2. Clone Repository**
```bash
git clone https://github.com/hatake-kakashuu/Yumi-MD.git
cd Yumi-MD
```

### **3. Install Dependencies**
```bash
npm install
```

### **4. Configure Environment**
Copy the example configuration file:
```bash
cp .env.example .env
```
Edit `.env` with your preferred editor:
```env
BOT_NAME=Yumi
PREFIX=.
MODE=public
LOG_LEVEL=silent
SESSION_FOLDER=session

OWNER_NUMBER=919876543210
MODS=919876543210

MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/yumi_bot?retryWrites=true&w=majority
GOOGLE_API_KEY=
```

### **5. Run Yumi-MD**
```bash
# Start bot
npm start

# For development with auto-reload:
npm run dev
```

### **6. Run 24/7 with PM2 (Recommended for VPS)**
```bash
npm install -g pm2
pm2 start src/index.js --name "yumi-md"
pm2 save
pm2 logs yumi-md
```

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4380-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

## ⚙️ **Environment Configuration Reference**

| Variable | Description | Required | Default |
| :--- | :--- | :---: | :---: |
| `BOT_NAME` | The display name of your bot | No | `Yumi` |
| `OWNER_NAME` | Name of the owner (displayed in vCard and #owner) | No | `Kakashi` |
| `PREFIX` | Command prefix symbol | No | `.` |
| `MODE` | Operating mode: `public` (anyone) or `self` (mods only) | No | `public` |
| `OWNER_NUMBER` | WhatsApp number of the bot owner (without `+` or spaces) | **Yes** | — |
| `MODS` | Additional admin numbers separated by comma | No | — |
| `MONGODB_URI` | MongoDB Atlas database connection string | **Yes** | — |
| `DB_NAME` | MongoDB database name | No | `yumi_bot` |
| `SESSION_FOLDER` | Directory where auth credentials are stored | No | `session` |
| `GOOGLE_API_KEY`| Google Custom Search API key for web lookups | No | — |

---

## 🤝 **Contributing**

Contributions, issues, and feature requests are welcome!  
Feel free to check out the [issues page](https://github.com/hatake-kakashuu/Yumi-MD/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'feat: Add NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📜 **License**

Distributed under the **MIT License**. See [`LICENSE`](https://github.com/hatake-kakashuu/Yumi-MD/blob/main/LICENSE) for more information.

<div align="center">

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4380-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

### 🌸 **Star Yumi-MD if you like this project!** 🌸

Made with 💖 by [**Kakashi**](https://github.com/hatake-kakashuu)

</div>
