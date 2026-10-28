const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Status Utama API
app.get('/', (req, res) => res.json({ status: true, message: 'API VALENX STORE Aktif 24/7! 🚀' }));

// Fitur Stiker Brat (/brat)
app.get('/brat', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: 'Isi parameter text!' });
    return res.json({ status: true, creator: 'VALENX STORE', result: `https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(text)}` });
});

// Fitur ToURL (/tourl)
app.all('/tourl', async (req, res) => {
    const media = req.query.url || req.body.url || req.body.image || req.body.base64;
    if (!media) return res.json({ status: false, message: 'Parameter media kosong' });

    try {
        let cleanMedia = media;
        if (typeof cleanMedia === 'string' && cleanMedia.includes('base64,')) {
            cleanMedia = cleanMedia.split('base64,')[1];
        }

        const formData = new URLSearchParams();
        formData.append('image', cleanMedia);

        const response = await fetch('https://api.imgbb.com/1/upload?key=6d207e02198a847aa98d0a2a901485a5', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        const data = await response.json();
        if (data && data.success && data.data) {
            return res.json({ status: true, creator: 'VALENX STORE', result: data.data.url });
        }
    } catch (e) {}

    return res.json({ status: false, message: 'Gagal upload gambar ke server.' });
});

// Fitur Instagram Downloader (/igdl) - Multi-Rotasi Server
app.get('/igdl', async (req, res) => {
    let { url } = req.query;
    if (!url) return res.json({ status: false, message: 'Isi parameter url!' });

    if (url.includes('instagram.com')) {
        url = url.split('?')[0];
    }

    const apis = [
        `https://api.vreden.web.id/api/igdownload?url=${encodeURIComponent(url)}`,
        `https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`,
        `https://widipe.com/download/igdl?url=${encodeURIComponent(url)}`
    ];

    for (const api of apis) {
        try {
            const response = await fetch(api);
            const data = await response.json();
            const resData = data.result || data.data;
            if (resData && (Array.isArray(resData) ? resData.length > 0 : true)) {
                return res.json({ status: true, creator: 'VALENX STORE', result: resData });
            }
        } catch (e) {}
    }

    res.json({ status: false, message: 'Server Instagram downloader sedang bermasalah/down.' });
});

// Fitur TikTok Downloader (/tiktok)
app.get('/tiktok', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'Isi parameter url!' });
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        res.json({ status: true, creator: 'VALENX STORE', result: data.data || data.result });
    } catch (e) {
        res.json({ status: false, message: 'Gagal mengambil video TikTok.' });
    }
});

// Fitur AI / GPT (/ai)
app.get('/ai', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: 'Isi parameter text!' });
    try {
        const response = await fetch(`https://api.siputzx.my.id/api/ai/gpt3?prompt=${encodeURIComponent(text)}`);
        const data = await response.json();
        res.json({ status: true, creator: 'VALENX STORE', result: data.data || data.result });
    } catch (e) {
        res.json({ status: false, message: 'Gagal merespon AI.' });
    }
});

module.exports = app;
