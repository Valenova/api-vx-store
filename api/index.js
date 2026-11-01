const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const CREATOR = "VALENX STORE";

// Root Check
app.get('/', (req, res) => {
    return res.json({
        status: true,
        creator: CREATOR,
        message: "API Server VX-STORE Operational & Fresh 🚀"
    });
});

// 1. AI Chat - Paling simpel pakai Pollinations (Langsung balasan teks)
app.get('/api/ai', async (req, res) => {
    const text = req.query.text || req.query.prompt || req.query.q;
    if (!text) return res.json({ status: false, creator: CREATOR, message: "Parameter ?text= wajib diisi" });

    try {
        const response = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(text)}`);
        if (response.data) {
            return res.json({ status: true, creator: CREATOR, result: response.data });
        }
    } catch (e) {}
    
    return res.json({ status: false, creator: CREATOR, message: "AI sedang tidak merespon" });
});

// 2. TikTok Downloader - Menggunakan Tiklydown Direct
app.get('/api/tiktok', async (req, res) => {
    const url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    try {
        const response = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`);
        const videoUrl = response.data?.video?.noWatermark || response.data?.video?.watermark || response.data?.url;
        if (videoUrl) {
            return res.json({ status: true, creator: CREATOR, result: videoUrl });
        }
    } catch (e) {}

    return res.json({ status: false, creator: CREATOR, message: "Gagal mendownload TikTok" });
});

// 3. Instagram Downloader
app.get('/api/igdl', async (req, res) => {
    const url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    try {
        const response = await axios.get(`https://widipe.com/download/igdl?url=${encodeURIComponent(url)}`);
        const igUrl = response.data?.result?.[0]?.url || response.data?.result || response.data?.url;
        if (igUrl) {
            return res.json({ status: true, creator: CREATOR, result: igUrl });
        }
    } catch (e) {}

    return res.json({ status: false, creator: CREATOR, message: "Gagal mendownload IG" });
});

// 4. Pinterest Search
app.get('/api/pin', async (req, res) => {
    const query = req.query.query || req.query.q || req.query.text;
    if (!query) return res.json({ status: false, creator: CREATOR, message: "Parameter ?query= wajib diisi" });

    try {
        const response = await axios.get(`https://widipe.com/pinterest?query=${encodeURIComponent(query)}`);
        const imgUrl = response.data?.result?.[0] || response.data?.result;
        if (imgUrl) {
            return res.json({ status: true, creator: CREATOR, result: imgUrl });
        }
    } catch (e) {}

    return res.json({ status: false, creator: CREATOR, message: "Gambar Pinterest tidak ditemukan" });
});

module.exports = app;
