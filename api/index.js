const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const CREATOR = "VALENX STORE";
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// 0. Health Check
app.get('/', (req, res) => {
    return res.json({
        status: true,
        creator: CREATOR,
        message: "API Server VX-STORE Operational & Fresh 🚀"
    });
});

// 1. AI Chat (Pake Pollinations AI - Gratis & Tanpa Key / Bebas Limit)
app.get('/api/ai', async (req, res) => {
    const text = req.query.text || req.query.prompt || req.query.query || req.query.q;
    if (!text) return res.json({ status: false, creator: CREATOR, message: "Parameter ?text= wajib diisi" });

    try {
        const response = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(text)}`, { timeout: 10000 });
        if (response.data) {
            return res.json({ status: true, creator: CREATOR, result: response.data });
        }
    } catch (e) {}

    return res.json({ status: false, creator: CREATOR, message: "AI sedang tidak merespon" });
});

// 2. Pinterest Search (Pake Unsplash/Pollinations Direct Image Fallback)
app.get('/api/pin', async (req, res) => {
    const query = req.query.query || req.query.q || req.query.text;
    if (!query) return res.json({ status: false, creator: CREATOR, message: "Parameter ?query= wajib diisi" });

    try {
        const resPin = await axios.get(`https://api.vreden.web.id/api/pinterest?query=${encodeURIComponent(query)}`, { timeout: 10000 });
        if (resPin.data?.result?.[0]) {
            return res.json({ status: true, creator: CREATOR, result: resPin.data.result[0] });
        }
    } catch (e) {}

    // Fallback image generator kalau scraper pinterest down
    const fallbackImg = `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=720&height=1280&nologo=true`;
    return res.json({ status: true, creator: CREATOR, result: fallbackImg });
});

// 3. TikTok Downloader (Multi Direct Backup)
app.get('/api/tiktok', async (req, res) => {
    const url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    const providers = [
        `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`,
        `https://api.vreden.web.id/api/tiktok?url=${encodeURIComponent(url)}`
    ];

    for (const pUrl of providers) {
        try {
            const response = await axios.get(pUrl, { headers: { 'User-Agent': USER_AGENT }, timeout: 10000 });
            const data = response.data;
            const ttUrl = data?.video?.noWatermark || data?.result?.video || data?.data?.nowm || data?.data?.video;
            if (ttUrl) return res.json({ status: true, creator: CREATOR, result: ttUrl });
        } catch (e) {
            continue;
        }
    }

    return res.json({ status: false, creator: CREATOR, message: "Gagal mendownload TikTok" });
});

// 4. Instagram Downloader
app.get('/api/igdl', async (req, res) => {
    const url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    try {
        const response = await axios.get(`https://api.vreden.web.id/api/igdl?url=${encodeURIComponent(url)}`, { headers: { 'User-Agent': USER_AGENT }, timeout: 10000 });
        const igUrl = response.data?.result?.[0]?.url || response.data?.data?.[0]?.url;
        if (igUrl) return res.json({ status: true, creator: CREATOR, result: igUrl });
    } catch (e) {}

    return res.json({ status: false, creator: CREATOR, message: "Gagal mendownload IG" });
});

module.exports = app;
