const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Header universal agar tidak gampang diblokir
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// 1. ENDPOINT TIKTOK
app.get('/tiktok', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'Masukkan parameter url' });

    try {
        const response = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`, { timeout: 8000 });
        const videoUrl = response.data?.video?.noWatermark || response.data?.url;
        
        if (videoUrl) {
            return res.json({ status: true, result: videoUrl });
        }
        res.json({ status: false, message: 'Gagal mengekstrak video TikTok' });
    } catch (e) {
        res.json({ status: false, message: 'Error/Timeout saat mengambil data TikTok' });
    }
});

// 2. ENDPOINT INSTAGRAM
app.get('/igdl', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'Masukkan parameter url' });

    try {
        const response = await axios.get(`https://v3.fdownloader.net/api/ajaxSearch?q=${encodeURIComponent(url)}`, { headers, timeout: 8000 });
        // Jika API scraper ganti, fallback ke endpoint publik
        if (response.data) {
            return res.json({ status: true, result: response.data });
        }
        res.json({ status: false, message: 'Gagal mengambil media Instagram' });
    } catch (e) {
        res.json({ status: false, message: 'Instagram Scraper Timeout di Vercel' });
    }
});

// 3. ENDPOINT PINTEREST
app.get('/pin', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json({ status: false, message: 'Masukkan parameter query' });

    try {
        const response = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?data=${encodeURIComponent(JSON.stringify({ options: { query: query, scope: "pins" } }))}`, { headers, timeout: 8000 });
        const results = response.data?.resource_response?.data?.results;
        if (results && results.length > 0) {
            const random = results[Math.floor(Math.random() * results.length)];
            const imgUrl = random?.images?.orig?.url;
            return res.json({ status: true, result: imgUrl });
        }
        res.json({ status: false, message: 'Gambar tidak ditemukan' });
    } catch (e) {
        res.json({ status: false, message: 'Pinterest Error/Timeout' });
    }
});

// 4. ENDPOINT AI (CHATGPT)
app.get('/ai', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: 'Masukkan parameter text' });

    try {
        const response = await axios.get(`https://api.simsimi.vn/v1/simtalk`, {
            params: { text: text, lc: 'id' },
            timeout: 8000
        });
        if (response.data?.message) {
            return res.json({ status: true, result: response.data.message });
        }
        res.json({ status: false, message: 'AI tidak merespon' });
    } catch (e) {
        res.json({ status: false, message: 'AI Response Timeout' });
    }
});

// 5. ENDPOINT BRAT STICKER
app.get('/brat', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: 'Masukkan parameter text' });

    const bratUrl = `https://png.vcap.me/brat?text=${encodeURIComponent(text)}`;
    return res.json({ status: true, result: bratUrl });
});

app.listen(PORT, () => {
    console.log(`API VX Store jalan di port ${PORT}`);
});

module.exports = app;
