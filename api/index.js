const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const CREATOR = "VALENX STORE";
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Helper Fetch Multi-Provider untuk Cadangan
async function fetchProvider(urls, timeout = 10000) {
    for (const url of urls) {
        try {
            const res = await axios.get(url, { headers: { 'User-Agent': USER_AGENT }, timeout });
            if (res.data) return res.data;
        } catch (e) {
            continue;
        }
    }
    return null;
}

// Root Check
app.get('/', (req, res) => {
    return res.json({
        status: true,
        creator: CREATOR,
        message: "API Server VX-STORE Active & Ready 🚀"
    });
});

// 1. AI CHAT
app.get('/api/ai', async (req, res) => {
    const text = req.query.text || req.query.prompt || req.query.q;
    if (!text) return res.json({ status: false, creator: CREATOR, message: "Parameter ?text= wajib diisi" });

    try {
        const response = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(text)}`, { timeout: 10000 });
        if (response.data) return res.json({ status: true, creator: CREATOR, result: response.data });
    } catch (e) {}

    return res.json({ status: false, creator: CREATOR, message: "AI sedang tidak merespon" });
});

// 2. PINTEREST SEARCH
app.get('/api/pin', async (req, res) => {
    const query = req.query.query || req.query.q;
    if (!query) return res.json({ status: false, creator: CREATOR, message: "Parameter ?query= wajib diisi" });

    const data = await fetchProvider([
        `https://api.vreden.web.id/api/pinterest?query=${encodeURIComponent(query)}`,
        `https://widipe.com/pinterest?query=${encodeURIComponent(query)}`
    ]);

    const imgUrl = data?.result?.[0] || data?.data?.[0]?.images_url || data?.data?.[0];
    if (imgUrl) return res.json({ status: true, creator: CREATOR, result: imgUrl });

    const fallbackImg = `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=720&height=1280&nologo=true`;
    return res.json({ status: true, creator: CREATOR, result: fallbackImg });
});

// 3. TIKTOK DOWNLOADER (Diperkuat Multi-Method & Header Khusus)
app.get('/api/tiktok', async (req, res) => {
    const url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    // Metode 1: TikWM Direct Post dengan Cookie/Header simulasi browser
    try {
        const tikwmRes = await axios.post('https://www.tikwm.com/api/', new URLSearchParams({ url: url, count: 12, cursor: 0, web: 1, hd: 1 }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': USER_AGENT,
                'Origin': 'https://www.tikwm.com',
                'Referer': 'https://www.tikwm.com/'
            },
            timeout: 8000
        });
        
        const playUrl = tikwmRes.data?.data?.hdplay || tikwmRes.data?.data?.play;
        if (playUrl) {
            return res.json({ status: true, creator: CREATOR, result: playUrl });
        }
    } catch (e) {}

    // Metode 2: Fallback ke Vreden & Widipe
    const data = await fetchProvider([
        `https://api.vreden.web.id/api/tiktok?url=${encodeURIComponent(url)}`,
        `https://widipe.com/download/tiktok?url=${encodeURIComponent(url)}`
    ]);

    const ttUrl = data?.result?.video || data?.result?.noWatermark || data?.data?.nowm || data?.data?.video || data?.result?.play;
    if (ttUrl) return res.json({ status: true, creator: CREATOR, result: ttUrl });

    return res.json({ status: false, creator: CREATOR, message: "Gagal mendownload TikTok" });
});

// 4. INSTAGRAM DOWNLOADER
app.get('/api/igdl', async (req, res) => {
    const url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    const data = await fetchProvider([
        `https://api.vreden.web.id/api/igdl?url=${encodeURIComponent(url)}`,
        `https://widipe.com/download/igdl?url=${encodeURIComponent(url)}`
    ]);

    const igUrl = data?.result?.[0]?.url || data?.data?.[0]?.url || data?.data?.url || (typeof data?.result === 'string' ? data.result : null);
    if (igUrl) return res.json({ status: true, creator: CREATOR, result: igUrl });

    return res.json({ status: false, creator: CREATOR, message: "Gagal mendownload IG" });
});

module.exports = app;
