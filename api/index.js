const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const CREATOR = "VALENX STORE";

app.get('/', (req, res) => {
    return res.json({ status: true, creator: CREATOR, message: "✅ API Berjalan Normal!" });
});

// TIKTOK SAJA DULU
app.get('/api/tiktok', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ status: false, message: "Masukkan parameter url!" });
    
    try {
        const resApi = await axios.post('https://www.tikwm.com/api/', new URLSearchParams({ url }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 8000
        });
        const videoUrl = resApi.data?.data?.hdplay || resApi.data?.data?.play;
        if (videoUrl) return res.json({ status: true, result: videoUrl });
    } catch (e) {}
    
    return res.json({ status: false, message: "Gagal mengambil video" });
});

app.get('/api/igdl', (req, res) => {
    return res.json({ status: false, message: "🔧 Fitur IG sedang perbaikan, coba nanti ya" });
});

app.get('/api/pin', (req, res) => {
    const q = req.query.query || 'nature';
    return res.json({ 
        status: true, 
        result: `https://image.pollinations.ai/prompt/${encodeURIComponent(q)}?width=720&height=1280&nologo=true` 
    });
});

app.get('/api/ai', async (req, res) => {
    const text = req.query.text;
    if (!text) return res.json({ status: false, message: "Masukkan teks!" });
    try {
        const r = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(text)}`, { timeout: 15000 });
        return res.json({ status: true, result: r.data });
    } catch (e) {
        return res.json({ status: false, message: "AI sedang tidak merespon" });
    }
});

module.exports = app;
