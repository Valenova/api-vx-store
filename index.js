const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 1. Status Utama API
app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'API VALENX STORE Berhasil Aktif 24/7! 🚀',
        author: 'Valenova'
    });
});

// 2. Fitur ToURL / ImgBB Uploader (/tourl)
app.all('/tourl', async (req, res) => {
    let media = req.query.url || req.body.url || req.body.image || req.body.base64;
    const apiKey = '6d207e02198a847aa98d0a2a901485a5';

    if (!media) {
        return res.json({ 
            status: false, 
            message: 'Masukkan parameter url/image media!' 
        });
    }

    if (typeof media === 'string' && media.includes('base64,')) {
        media = media.split('base64,')[1];
    }

    try {
        const formData = new URLSearchParams();
        formData.append('image', media);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        const data = await response.json();

        if (data && data.success && data.data && data.data.url) {
            return res.json({
                status: true,
                creator: 'VALENX STORE',
                result: data.data.url
            });
        }
    } catch (e) {}

    if (typeof media === 'string' && media.startsWith('http')) {
        return res.json({
            status: true,
            creator: 'VALENX STORE',
            result: media
        });
    }

    res.json({ status: false, message: 'Gagal mengunggah media ke server.' });
});

// 3. Fitur Instagram Downloader (/igdl) - Multi-Server Tanpa Siputzx
app.get('/igdl', async (req, res) => {
    let { url } = req.query;
    if (!url) return res.json({ status: false, message: 'Masukkan parameter url!' });

    try {
        if (url.includes('instagram.com')) {
            url = url.split('?')[0];
        }
    } catch (e) {}

    // Server 1: Agatz
    try {
        const res1 = await fetch(`https://api.agatz.xyz/api/instagram?url=${encodeURIComponent(url)}`);
        const data1 = await res1.json();
        if (data1?.data) {
            const media = Array.isArray(data1.data) ? (data1.data[0]?.url || data1.data[0]) : (data1.data.url || data1.data);
            if (media) return res.json({ status: true, creator: 'VALENX STORE', result: media });
        }
    } catch (e) {}

    // Server 2: Widipe
    try {
        const res2 = await fetch(`https://widipe.com/download/igdl?url=${encodeURIComponent(url)}`);
        const data2 = await res2.json();
        if (data2?.result && data2.result.length > 0) {
            const media = data2.result[0].url || data2.result[0];
            if (media) return res.json({ status: true, creator: 'VALENX STORE', result: media });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal mengambil media Instagram.' });
});

// 4. Fitur TikTok Downloader (/tiktok) - TikWM Stable
app.get('/tiktok', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'Masukkan parameter url!' });

    try {
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        if (data?.data?.play) {
            return res.json({ status: true, creator: 'VALENX STORE', result: data.data.play });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal mengambil video TikTok.' });
});

// 5. Fitur Stiker Brat (/brat)
app.get('/brat', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: 'Masukkan parameter text!' });

    try {
        const bratUrl = `https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(text)}`;
        res.json({
            status: true,
            creator: 'VALENX STORE',
            result: bratUrl
        });
    } catch (e) {
        res.json({ status: false, message: 'Gagal membuat stiker brat.' });
    }
});

// 6. Fitur AI / GPT Search (/ai) - Agatz Ragbot
app.get('/ai', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: 'Masukkan parameter text!' });

    try {
        const response = await fetch(`https://api.agatz.xyz/api/ragbot?message=${encodeURIComponent(text)}`);
        const data = await response.json();
        if (data?.data) {
            return res.json({ status: true, creator: 'VALENX STORE', result: data.data });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal merespon permintaan AI.' });
});

// 7. Fitur Pinterest Search (/pin)
app.get('/pin', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json({ status: false, message: 'Masukkan parameter query!' });

    try {
        const response = await fetch(`https://api.agatz.xyz/api/pinterest?message=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data?.data && data.data.length > 0) {
            return res.json({ status: true, creator: 'VALENX STORE', result: data.data });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal mencari gambar di Pinterest.' });
});

module.exports = app;
