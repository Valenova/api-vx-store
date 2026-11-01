const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const CREATOR = "VALENX STORE";
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// Home Route
app.get('/', (req, res) => {
    return res.json({
        status: true,
        creator: CREATOR,
        message: "API Server VX-STORE Running Smoothly 🚀"
    });
});

// TikTok Downloader Route
app.get('/api/tiktok', async (req, res) => {
    const url = req.query.url || req.query.link;
    if (!url) {
        return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });
    }

    try {
        // Tembak TikWM
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

    // Fallback Cadangan
    try {
        const fallback = await axios.get(`https://widipe.com/download/tiktok?url=${encodeURIComponent(url)}`, { timeout: 8000 });
        const videoUrl = fallback.data?.result?.video || fallback.data?.result?.noWatermark;
        if (videoUrl) {
            return res.json({ status: true, creator: CREATOR, result: videoUrl });
        }
    } catch (e) {}

    return res.json({ status: false, creator: CREATOR, message: "Gagal mendownload TikTok" });
});

// AI Chat Route
app.get('/api/ai', async (req, res) => {
    const text = req.query.text || req.query.prompt || req.query.q;
    if (!text) return res.json({ status: false, creator: CREATOR, message: "Parameter ?text= wajib diisi" });

    try {
        const response = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(text)}`, { timeout: 10000 });
        if (response.data) return res.json({ status: true, creator: CREATOR, result: response.data });
    } catch (e) {}

    return res.json({ status: false, creator: CREATOR, message: "AI sedang tidak merespon" });
});

module.exports = app;
