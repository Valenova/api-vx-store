const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => res.json({ status: true, message: 'API VALENX STORE 24/7 Online 🚀' }));

// 1. TikTok Downloader (TikWM - 100% Anti-Block Vercel)
const handleTikTok = async (req, res) => {
    const url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, message: 'Isi parameter url!' });

    try {
        const response = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        if (data && data.code === 0 && data.data) {
            return res.json({
                status: true,
                creator: 'VALENX STORE',
                result: data.data.play || data.data.wmplay
            });
        }
    } catch (e) {}

    // Backup Server TikTok
    try {
        const r2 = await fetch(`https://bk9.fun/download/tiktok?url=${encodeURIComponent(url)}`);
        const d2 = await r2.json();
        if (d2 && d2.status && d2.BK9) {
            return res.json({ status: true, creator: 'VALENX STORE', result: d2.BK9.video || d2.BK9 });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal mengambil video TikTok.' });
};
app.get('/tiktok', handleTikTok);
app.get('/tt', handleTikTok);

// 2. Stiker Brat (HuggingFace)
app.get('/brat', async (req, res) => {
    const text = req.query.text || req.query.q;
    if (!text) return res.json({ status: false, message: 'Isi parameter text!' });
    return res.json({
        status: true,
        creator: 'VALENX STORE',
        result: `https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(text)}`
    });
});

// 3. Instagram Downloader (Global Scraper Multi-Backup)
const handleIG = async (req, res) => {
    let url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, message: 'Isi parameter url!' });
    if (url.includes('instagram.com')) url = url.split('?')[0];

    // Server 1
    try {
        const r1 = await fetch(`https://bk9.fun/download/ig?url=${encodeURIComponent(url)}`);
        const d1 = await r1.json();
        if (d1 && d1.status && d1.BK9) {
            const media = Array.isArray(d1.BK9) ? d1.BK9[0]?.url : (d1.BK9.url || d1.BK9);
            return res.json({ status: true, creator: 'VALENX STORE', result: media });
        }
    } catch (e) {}

    // Server 2
    try {
        const r2 = await fetch(`https://api.dreaded.site/api/igdl?url=${encodeURIComponent(url)}`);
        const d2 = await r2.json();
        if (d2 && d2.data) {
            const media = Array.isArray(d2.data) ? d2.data[0]?.url : (d2.data.url || d2.data);
            return res.json({ status: true, creator: 'VALENX STORE', result: media });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal mengambil media Instagram.' });
};
app.get('/igdl', handleIG);
app.get('/ig', handleIG);

// 4. Pinterest Search
const handlePin = async (req, res) => {
    const query = req.query.query || req.query.q || req.query.text;
    if (!query) return res.json({ status: false, message: 'Isi parameter query!' });

    try {
        const r1 = await fetch(`https://bk9.fun/search/pinterest?q=${encodeURIComponent(query)}`);
        const d1 = await r1.json();
        if (d1 && d1.status && d1.BK9 && d1.BK9.length > 0) {
            const images = d1.BK9.map(item => item.images || item.image || item.url || item);
            return res.json({ status: true, creator: 'VALENX STORE', result: images });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gambar Pinterest tidak ditemukan.' });
};
app.get('/pin', handlePin);
app.get('/pinterest', handlePin);

// 5. ToURL Uploader (ImgBB)
app.all('/tourl', async (req, res) => {
    let media = req.query.url || req.body.url || req.body.image || req.body.base64;
    if (!media) return res.json({ status: false, message: 'Parameter media kosong' });

    if (typeof media === 'string' && media.includes('base64,')) {
        media = media.split('base64,')[1];
    }

    try {
        const formData = new URLSearchParams();
        formData.append('image', media);

        const r = await fetch('https://api.imgbb.com/1/upload?key=6d207e02198a847aa98d0a2a901485a5', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        const d = await r.json();
        if (d && d.success && d.data && d.data.url) {
            return res.json({ status: true, creator: 'VALENX STORE', result: d.data.url });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal upload gambar ke server.' });
});

// 6. AI GPT
app.get('/ai', async (req, res) => {
    const text = req.query.text || req.query.q;
    if (!text) return res.json({ status: false, message: 'Isi parameter text!' });

    try {
        const r = await fetch(`https://bk9.fun/ai/gpt?q=${encodeURIComponent(text)}`);
        const d = await r.json();
        if (d && d.status && d.BK9) {
            return res.json({ status: true, creator: 'VALENX STORE', result: d.BK9 });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal merespon AI.' });
});

module.exports = app;
