const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const CREATOR = "VALENX STORE";

app.get('/', (req, res) => {
    res.json({ status: true, creator: CREATOR, message: "✅ API VX-STORE Berjalan" });
});

// TIKTOK
app.get('/api/tiktok', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ status: false, message: "Masukkan link TikTok!" });
    
    try {
        const r = await axios.post('https://www.tikwm.com/api/', new URLSearchParams({ url }), { timeout: 12000 });
        const link = r.data?.data?.hdplay || r.data?.data?.play;
        if (link) return res.json({ status: true, result: link });
    } catch (e) {}
    
    res.json({ status: false, message: "❌ Gagal. Coba link lain." });
});

// PINTEREST / GAMBAR — Tanpa axios, langsung kirim link
app.get('/api/pin', (req, res) => {
    const q = req.query.query || 'landscape';
    const gambar = `https://image.pollinations.ai/prompt/${encodeURIComponent(q)}?width=720&height=1280&nologo=true`;
    res.json({ status: true, result: gambar });
});

// AI CHAT
app.get('/api/ai', async (req, res) => {
    const text = req.query.text || req.query.q;
    if (!text) return res.json({ status: false, message: "Masukkan pertanyaan!" });
    
    try {
        const r = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(text)}`, { timeout: 20000 });
        res.json({ status: true, result: r.data });
    } catch (e) {
        res.json({ status: false, message: "⚠️ AI sedang tidak merespon, coba lagi nanti." });
    }
});

// INSTAGRAM — Info jujur
app.get('/api/igdl', (req, res) => {
    res.json({ status: false, message: "⚠️ Fitur IG sementara dinonaktifkan. Instagram memblokir akses pihak ketiga." });
});

module.exports = app;
