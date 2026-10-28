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
    const mediaUrl = req.query.url || req.body.url;
    // API Key ImgBB gratis aktif
    const apiKey = req.query.key || req.body.key || '6d207e02198a847aa98d0a2a901485a5';

    if (!mediaUrl) {
        return res.json({ 
            status: false, 
            message: 'Masukkan parameter url media! Contoh: /tourl?url=LINK_GAMBAR' 
        });
    }

    try {
        const formData = new URLSearchParams();
        formData.append('image', mediaUrl);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        const data = await response.json();

        if (data && data.success) {
            return res.json({
                status: true,
                creator: 'VALENX STORE',
                result: data.data.url,
                display_url: data.data.display_url,
                delete_url: data.data.delete_url
            });
        } else {
            return res.json({
                status: false,
                message: data.error ? data.error.message : 'Gagal mengunggah gambar ke ImgBB.'
            });
        }
    } catch (e) {
        res.json({
            status: false,
            message: 'Terjadi kesalahan saat upload ke ImgBB.',
            error: e.message
        });
    }
});

// 3. Fitur Instagram Downloader (/igdl)
app.get('/igdl', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'Masukkan parameter url!' });

    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        res.json({ status: true, creator: 'VALENX STORE', result: data.data || data });
    } catch (e) {
        res.json({ status: false, message: 'Gagal mengambil media Instagram.' });
    }
});

// 4. Fitur TikTok Downloader (/tiktok)
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

// 5. Fitur YouTube Downloader (/yt)
app.get('/yt', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'Masukkan parameter url!' });

    try {
        const response = await fetch(`https://api.siputzx.my.id/api/d/ytdl?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        res.json({ status: true, creator: 'VALENX STORE', result: data.data || data });
    } catch (e) {
        res.json({ status: false, message: 'Gagal mengambil media YouTube.' });
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

// 7. Fitur Pinterest Search (/pin)
app.get('/pin', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json({ status: false, message: 'Masukkan parameter query!' });

    try {
        const response = await fetch(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        res.json({ status: true, creator: 'VALENX STORE', result: data.data || data });
    } catch (e) {
        res.json({ status: false, message: 'Gagal mencari gambar di Pinterest.' });
    }
});

// 8. Fitur List Produk Store (/produk)
app.get('/produk', (req, res) => {
    res.json({
        status: true,
        store: 'VALENX STORE',
        categories: [
            { id: 1, name: 'Diamond Mobile Legends' },
            { id: 2, name: 'Suntik Follower / SMM' },
            { id: 3, name: 'Sewa Bot WhatsApp' }
        ]
    });
});

module.exports = app;
