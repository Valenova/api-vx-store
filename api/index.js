const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const CREATOR = "VALENX STORE";
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

app.get('/', (req, res) => {
    return res.json({ status: true, creator: CREATOR, message: "API Server VX-STORE Running Smoothly 🚀" });
});

// AI CHAT
app.get('/api/ai', async (req, res) => {
    const text = req.query.text || req.query.prompt || req.query.q;
    if (!text) return res.json({ status: false, creator: CREATOR, message: "Parameter ?text= wajib diisi" });
    try {
        const response = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(text)}`, { timeout: 10000 });
        if (response.data) return res.json({ status: true, creator: CREATOR, result: response.data });
    } catch (e) {}
    return res.json({ status: false, creator: CREATOR, message: "AI sedang tidak merespon" });
});

// TIKTOK DOWNLOADER
app.get('/api/tiktok', async (req, res) => {
    const url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    // Jalur 1: TikWM
    try {
        const tikwmRes = await axios.post('https://www.tikwm.com/api/', new URLSearchParams({ url: url, count: 12, cursor: 0, web: 1, hd: 1 }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': USER_AGENT,
                'Origin': 'https://www.tikwm.com',
                'Referer': 'https://www.tikwm.com/'
            },
            timeout: 7000
        });
        const playUrl = tikwmRes.data?.data?.hdplay || tikwmRes.data?.data?.play;
        if (playUrl) return res.json({ status: true, creator: CREATOR, result: playUrl });
    } catch (e) {}

    // Jalur 2: Widipe
    try {
        const widipeRes = await axios.get(`https://widipe.com/download/tiktok?url=${encodeURIComponent(url)}`, { timeout: 7000 });
        const videoUrl = widipeRes.data?.result?.video || widipeRes.data?.result?.noWatermark;
        if (videoUrl) return res.json({ status: true, creator: CREATOR, result: videoUrl });
    } catch (e) {}

    return res.json({ status: false, creator: CREATOR, message: "Gagal ambil video, coba link lain" });
});

// INSTAGRAM DOWNLOADER — Lengkap dengan banyak cadangan
app.get('/api/igdl', async (req, res) => {
    const url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    // Jalur 1: Widipe IG
    try {
        const res1 = await axios.get(`https://widipe.com/download/ig?url=${encodeURIComponent(url)}`, { timeout: 10000 });
        const igUrl = res1.data?.result?.url || res1.data?.result?.video || res1.data?.result?.[0]?.url;
        if (igUrl) return res.json({ status: true, creator: CREATOR, result: igUrl });
    } catch (e) {}

    // Jalur 2: SnapIG
    try {
        const res2 = await axios.get(`https://snapig.vercel.app/api/instagram?url=${encodeURIComponent(url)}`, { timeout: 10000 });
        const igUrl = res2.data?.url || res2.data?.result?.url;
        if (igUrl) return res.json({ status: true, creator: CREATOR, result: igUrl });
    } catch (e) {}

    // Jalur 3: Instagran
    try {
        const res3 = await axios.get(`https://instagran.vercel.app/api?url=${encodeURIComponent(url)}`, { timeout: 10000 });
        const igUrl = res3.data?.data?.url || res3.data?.result?.url;
        if (igUrl) return res.json({ status: true, creator: CREATOR, result: igUrl });
    } catch (e) {}

    return res.json({ status: false, creator: CREATOR, message: "❌ Gagal mendownload IG. Pastikan akun tidak privat dan coba link lain ya~" });
});

// PINTEREST SEARCH
app.get('/api/pin', async (req, res) => {
    const query = req.query.query || req.query.q;
    if (!query) return res.json({ status: false, creator: CREATOR, message: "Parameter ?query= wajib diisi" });
    
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=720&height=1280&nologo=true`;
    return res.json({ status: true, creator: CREATOR, result: imageUrl, note: "Gambar dihasilkan oleh AI" });
});

module.exports = app;
