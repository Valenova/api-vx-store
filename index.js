const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Check Status
app.get('/', (req, res) => {
    res.json({ status: true, message: 'API VX Store Online & Ready' });
});

// 1. TikTok Downloader (TikWM - Kencang & Stabil)
app.get('/tiktok', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'URL wajib diisi' });

    try {
        const response = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`, { timeout: 8000 });
        const videoUrl = response.data?.data?.play || response.data?.data?.wmplay;
        
        if (videoUrl) {
            return res.json({ status: true, result: videoUrl });
        }
        res.json({ status: false, message: 'Gagal mengekstrak video TikTok' });
    } catch (e) {
        res.json({ status: false, message: 'Error/Timeout mengambil data TikTok' });
    }
});

// 2. Instagram Downloader (Dual Fallback)
app.get('/igdl', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'URL wajib diisi' });

    // Fallback Server 1
    try {
        const res1 = await axios.get(`https://api.agatz.xyz/api/instagram?url=${encodeURIComponent(url)}`, { headers, timeout: 8000 });
        const data1 = res1.data?.data;
        if (data1) {
            const mediaUrl = Array.isArray(data1) ? (data1[0]?.url || data1[0]) : data1;
            if (mediaUrl) return res.json({ status: true, result: mediaUrl });
        }
    } catch (e) {}

    // Fallback Server 2
    try {
        const res2 = await axios.get(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`, { headers, timeout: 8000 });
        const data2 = res2.data?.data;
        if (data2) {
            const mediaUrl2 = Array.isArray(data2) ? (data2[0]?.url || data2[0]) : data2;
            if (mediaUrl2) return res.json({ status: true, result: mediaUrl2 });
        }
        res.json({ status: false, message: 'Gagal mengekstrak media IG' });
    } catch (e) {
        res.json({ status: false, message: 'IP Vercel terblokir / Scraper IG Timeout' });
    }
});

// 3. Pinterest Search
app.get('/pin', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json({ status: false, message: 'Query wajib diisi' });

    try {
        const response = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?data=${encodeURIComponent(JSON.stringify({ options: { query, scope: "pins" } }))}`, { headers, timeout: 8000 });
        const results = response.data?.resource_response?.data?.results;
        if (results && results.length > 0) {
            const random = results[Math.floor(Math.random() * results.length)];
            const imgUrl = random?.images?.orig?.url;
            if (imgUrl) return res.json({ status: true, result: imgUrl });
        }
        res.json({ status: false, message: 'Gambar tidak ditemukan' });
    } catch (e) {
        res.json({ status: false, message: 'Error/Timeout Pinterest' });
    }
});

// 4. AI Chat
app.get('/ai', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: 'Teks wajib diisi' });

    try {
        const response = await axios.get(`https://api.simsimi.vn/v1/simtalk`, { params: { text, lc: 'id' }, timeout: 8000 });
        if (response.data?.message) return res.json({ status: true, result: response.data.message });
        res.json({ status: false, message: 'AI tidak merespon' });
    } catch (e) {
        res.json({ status: false, message: 'Error/Timeout AI' });
    }
});

// 5. Brat Sticker Generator
app.get('/brat', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: 'Teks wajib diisi' });

    const bratUrl = `https://png.vcap.me/brat?text=${encodeURIComponent(text)}`;
    return res.json({ status: true, result: bratUrl });
});

module.exports = app;
