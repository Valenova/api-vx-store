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

// 2. Fitur Stiker Brat (/brat) - Server Generator Stabil
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

// 3. Fitur ToURL / ImgBB Uploader (/tourl) - Support URL & Base64 Chat WA
app.all('/tourl', async (req, res) => {
    const media = req.query.url || req.body.url || req.body.image || req.body.base64;
    const apiKey = '6d207e02198a847aa98d0a2a901485a5';

    if (!media) {
        return res.json({ 
            status: false, 
            message: 'Masukkan parameter url/image media!' 
        });
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

        if (data && data.success) {
            return res.json({
                status: true,
                creator: 'VALENX STORE',
                result: data.data.url
            });
        } else {
            return res.json({ status: false, message: 'Gagal upload gambar ke ImgBB.' });
        }
    } catch (e) {
        res.json({ status: false, message: 'Terjadi kesalahan upload.', error: e.message });
    }
});

// 4. Fitur Instagram Downloader (/igdl) - Multi-Backup Server
app.get('/igdl', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'Masukkan parameter url!' });

    // Server Utama (Vreden)
    try {
        const res1 = await fetch(`https://api.vreden.web.id/api/igdownload?url=${encodeURIComponent(url)}`);
        const data1 = await res1.json();
        if (data1 && data1.result) {
            return res.json({ status: true, creator: 'VALENX STORE', result: data1.result });
        }
    } catch (e) {}

    // Server Cadangan (Siputzx)
    try {
        const res2 = await fetch(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`);
        const data2 = await res2.json();
        if (data2 && data2.data) {
            return res.json({ status: true, creator: 'VALENX STORE', result: data2.data });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal mengambil media Instagram. Server scraper sedang bermasalah.' });
});

// 5. Fitur TikTok Downloader (/tiktok)
app.get('/tiktok', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'Masukkan parameter url!' });

    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        res.json({ status: true, creator: 'VALENX STORE', result: data.data || data });
    } catch (e) {
        res.json({ status: false, message: 'Gagal mengambil video TikTok.' });
    }
});

// 6. Fitur AI / GPT Search (/ai)
app.get('/ai', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: 'Masukkan parameter text!' });

    try {
        const response = await fetch(`https://api.siputzx.my.id/api/ai/gpt3?prompt=${encodeURIComponent(text)}`);
        const data = await response.json();
        res.json({ status: true, creator: 'VALENX STORE', result: data.data || data.result });
    } catch (e) {
        res.json({ status: false, message: 'Gagal merespon permintaan AI.' });
    }
});

module.exports = app;
