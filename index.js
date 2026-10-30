const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Test Endpoint Utama
app.get('/', (req, res) => {
    res.json({ status: true, message: 'API VX Store Active' });
});

// 1. TikTok Downloader
app.get('/tiktok', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'Parameter url wajib diisi' });

    try {
        const response = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`, { timeout: 9000 });
        const videoUrl = response.data?.video?.noWatermark || response.data?.url;
        if (videoUrl) return res.json({ status: true, result: videoUrl });
        
        res.json({ status: false, message: 'Gagal mengambil video TikTok' });
    } catch (e) {
        res.json({ status: false, message: 'Error/Timeout mengambil data TikTok' });
    }
});

// 2. Instagram Downloader
app.get('/igdl', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'Parameter url wajib diisi' });

    try {
        const response = await axios.get(`https://api.vkrnotfficial.org/api/download/ig?url=${encodeURIComponent(url)}`, { headers, timeout: 9000 });
        const media = response.data?.data?.url || response.data?.result;
        if (media) return res.json({ status: true, result: Array.isArray(media) ? media[0] : media });

        res.json({ status: false, message: 'Gagal mengambil media IG' });
    } catch (e) {
        res.json({ status: false, message: 'Timeout / IP Vercel terblokir saat ambil IG' });
    }
});

// 3. Pinterest Search
app.get('/pin', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json({ status: false, message: 'Parameter query wajib diisi' });

    try {
        const response = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?data=${encodeURIComponent(JSON.stringify({ options: { query, scope: "pins" } }))}`, { headers, timeout: 9000 });
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
    if (!text) return res.json({ status: false, message: 'Parameter text wajib diisi' });

    try {
        const response = await axios.get(`https://api.simsimi.vn/v1/simtalk`, { params: { text, lc: 'id' }, timeout: 9000 });
        if (response.data?.message) return res.json({ status: true, result: response.data.message });

        res.json({ status: false, message: 'AI tidak merespon' });
    } catch (e) {
        res.json({ status: false, message: 'Error/Timeout AI' });
    }
});

// 5. Brat Generator
app.get('/brat', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: 'Parameter text wajib diisi' });

    const bratUrl = `https://png.vcap.me/brat?text=${encodeURIComponent(text)}`;
    return res.json({ status: true, result: bratUrl });
});

// Export handler untuk Vercel Serverless
module.exports = app;
