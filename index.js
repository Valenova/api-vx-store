const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Check Status
app.get('/', (req, res) => {
    res.json({ status: true, message: 'API VX Store Online & Operational' });
});

// ================= 1. TIKTOK DOWNLOADER (TRIPLE FALLBACK ANTI-EROR) =================
app.get('/tiktok', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'URL wajib diisi' });

    // Server Utama: TikWM (Kencang)
    try {
        const res1 = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`, { headers, timeout: 6000 });
        const videoUrl1 = res1.data?.data?.play || res1.data?.data?.wmplay;
        if (videoUrl1) return res.json({ status: true, result: videoUrl1 });
    } catch (e) {}

    // Server Cadangan 1: Agatz API
    try {
        const res2 = await axios.get(`https://api.agatz.xyz/api/tiktok?url=${encodeURIComponent(url)}`, { headers, timeout: 6000 });
        const videoUrl2 = res2.data?.data?.video || res2.data?.data?.no_watermark || res2.data?.data?.hdvideo;
        if (videoUrl2) return res.json({ status: true, result: videoUrl2 });
    } catch (e) {}

    // Server Cadangan 2: Tiklydown API
    try {
        const res3 = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`, { headers, timeout: 6000 });
        const videoUrl3 = res3.data?.video?.noWatermark || res3.data?.url;
        if (videoUrl3) return res.json({ status: true, result: videoUrl3 });
    } catch (e) {}

    res.json({ status: false, message: 'Semua server TikTok sedang tidak merespon' });
});

// ================= 2. INSTAGRAM DOWNLOADER (DUAL FALLBACK) =================
app.get('/igdl', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'URL wajib diisi' });

    // Server Utama: Siputzx
    try {
        const res1 = await axios.get(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`, { headers, timeout: 7000 });
        const media = res1.data?.data;
        if (media) {
            const mediaUrl = Array.isArray(media) ? (media[0]?.url || media[0]) : media;
            if (mediaUrl) return res.json({ status: true, result: mediaUrl });
        }
    } catch (e) {}

    // Server Cadangan: Agatz
    try {
        const res2 = await axios.get(`https://api.agatz.xyz/api/instagram?url=${encodeURIComponent(url)}`, { headers, timeout: 7000 });
        const data2 = res2.data?.data;
        if (data2) {
            const mediaUrl2 = Array.isArray(data2) ? (data2[0]?.url || data2[0]) : data2;
            if (mediaUrl2) return res.json({ status: true, result: mediaUrl2 });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal mengambil media Instagram' });
});

// ================= 3. PINTEREST SEARCH (DUAL FALLBACK) =================
app.get('/pin', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json({ status: false, message: 'Query wajib diisi' });

    // Server Utama: Siputzx
    try {
        const res1 = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`, { headers, timeout: 7000 });
        if (res1.data?.data && res1.data.data.length > 0) {
            const random = res1.data.data[Math.floor(Math.random() * res1.data.data.length)];
            const imgUrl = random?.images_url || random?.url || random;
            if (imgUrl) return res.json({ status: true, result: imgUrl });
        }
    } catch (e) {}

    // Server Cadangan: Native Pinterest
    try {
        const res2 = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?data=${encodeURIComponent(JSON.stringify({ options: { query, scope: "pins" } }))}`, { headers, timeout: 7000 });
        const results = res2.data?.resource_response?.data?.results;
        if (results && results.length > 0) {
            const random = results[Math.floor(Math.random() * results.length)];
            const imgUrl = random?.images?.orig?.url;
            if (imgUrl) return res.json({ status: true, result: imgUrl });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gambar Pinterest tidak ditemukan' });
});

// ================= 4. AI CHAT (DUAL FALLBACK) =================
app.get('/ai', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: 'Teks wajib diisi' });

    // Server Utama: Siputzx AI
    try {
        const res1 = await axios.get(`https://api.siputzx.my.id/api/ai/chatgpt?content=${encodeURIComponent(text)}`, { headers, timeout: 7000 });
        if (res1.data?.data) return res.json({ status: true, result: res1.data.data });
    } catch (e) {}

    // Server Cadangan: SimSimi VN
    try {
        const res2 = await axios.get(`https://api.simsimi.vn/v1/simtalk`, { params: { text, lc: 'id' }, headers, timeout: 7000 });
        if (res2.data?.message) return res.json({ status: true, result: res2.data.message });
    } catch (e) {}

    res.json({ status: false, message: 'AI sedang tidak merespon' });
});

// ================= 5. BRAT STICKER GENERATOR =================
app.get('/brat', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: 'Teks wajib diisi' });

    try {
        const bratUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}`;
        return res.json({ status: true, result: bratUrl });
    } catch (e) {
        const fallbackUrl = `https://png.vcap.me/brat?text=${encodeURIComponent(text)}`;
        return res.json({ status: true, result: fallbackUrl });
    }
});

module.exports = app;
