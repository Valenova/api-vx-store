const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => res.json({ status: true, message: 'API VALENX STORE 24/7 Online 🚀' }));

// 1. TikTok Downloader (TikWM - SUDAH BERHASIL 100%)
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

    res.json({ status: false, message: 'Gagal mengambil video TikTok.' });
};
app.get('/tiktok', handleTikTok);
app.get('/tt', handleTikTok);

// 2. AI Chat (SUDAH BAHASA INDONESIA 100%)
app.get('/ai', async (req, res) => {
    const text = req.query.text || req.query.q;
    if (!text) return res.json({ status: false, message: 'Isi parameter text!' });

    try {
        const promptIndo = `Jawablah selalu dalam Bahasa Indonesia yang santai dan ramah: ${text}`;
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(promptIndo)}`);
        const replyText = await response.text();
        if (replyText && !replyText.includes('Free limit reached')) {
            return res.json({ status: true, creator: 'VALENX STORE', result: replyText.trim() });
        }
    } catch (e) {}

    try {
        const r2 = await fetch(`https://bk9.fun/ai/gpt?q=${encodeURIComponent(text)}`);
        const d2 = await r2.json();
        if (d2 && d2.status && d2.BK9) {
            return res.json({ status: true, creator: 'VALENX STORE', result: d2.BK9 });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal merespon AI.' });
});

// 3. Stiker Brat (HuggingFace)
app.get('/brat', async (req, res) => {
    const text = req.query.text || req.query.q;
    if (!text) return res.json({ status: false, message: 'Isi parameter text!' });
    return res.json({
        status: true,
        creator: 'VALENX STORE',
        result: `https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(text)}`
    });
});

// 4. Pinterest Search (Rotasi Multi-Server)
const handlePin = async (req, res) => {
    const query = req.query.query || req.query.q || req.query.text;
    if (!query) return res.json({ status: false, message: 'Isi parameter query!' });

    // Server 1: Widipe
    try {
        const r1 = await fetch(`https://widipe.com/download/pinterest?text=${encodeURIComponent(query)}`);
        const d1 = await r1.json();
        if (d1 && d1.status && d1.result) {
            const imgs = Array.isArray(d1.result) ? d1.result : [d1.result];
            return res.json({ status: true, creator: 'VALENX STORE', result: imgs });
        }
    } catch (e) {}

    // Server 2: Vreden
    try {
        const r2 = await fetch(`https://api.vreden.web.id/api/pinterest?query=${encodeURIComponent(query)}`);
        const d2 = await r2.json();
        if (d2 && d2.result && d2.result.length > 0) {
            return res.json({ status: true, creator: 'VALENX STORE', result: d2.result });
        }
    } catch (e) {}

    // Server 3: Siputzx
    try {
        const r3 = await fetch(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`);
        const d3 = await r3.json();
        if (d3 && d3.data && d3.data.length > 0) {
            const imgs = d3.data.map(i => typeof i === 'string' ? i : (i.images || i.url));
            return res.json({ status: true, creator: 'VALENX STORE', result: imgs });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gambar Pinterest tidak ditemukan.' });
};
app.get('/pin', handlePin);
app.get('/pinterest', handlePin);

// 5. Instagram Downloader (Pembersih Link + 3 Server Rotasi)
const handleIG = async (req, res) => {
    let url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, message: 'Isi parameter url!' });

    if (url.includes('instagram.com')) {
        url = url.split('?')[0];
    }

    // Server 1: Widipe
    try {
        const r1 = await fetch(`https://widipe.com/download/igdl?url=${encodeURIComponent(url)}`);
        const d1 = await r1.json();
        if (d1 && d1.status && d1.result) {
            let media = d1.result;
            if (Array.isArray(media)) media = media[0]?.url || media[0];
            else if (typeof media === 'object') media = media.url || media.video || media;
            if (typeof media === 'string' && media.startsWith('http')) {
                return res.json({ status: true, creator: 'VALENX STORE', result: media });
            }
        }
    } catch (e) {}

    // Server 2: Vreden
    try {
        const r2 = await fetch(`https://api.vreden.web.id/api/igdownload?url=${encodeURIComponent(url)}`);
        const d2 = await r2.json();
        if (d2 && d2.result) {
            let media = d2.result;
            if (Array.isArray(media)) media = media[0]?.url || media[0];
            else if (typeof media === 'object') media = media.url || media;
            if (typeof media === 'string' && media.startsWith('http')) {
                return res.json({ status: true, creator: 'VALENX STORE', result: media });
            }
        }
    } catch (e) {}

    // Server 3: BK9
    try {
        const r3 = await fetch(`https://bk9.fun/download/ig?url=${encodeURIComponent(url)}`);
        const d3 = await r3.json();
        if (d3 && d3.status && d3.BK9) {
            let media = d3.BK9;
            if (Array.isArray(media)) media = media[0]?.url || media[0];
            else if (typeof media === 'object') media = media.url || media;
            if (typeof media === 'string' && media.startsWith('http')) {
                return res.json({ status: true, creator: 'VALENX STORE', result: media });
            }
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal mengambil media Instagram.' });
};
app.get('/igdl', handleIG);
app.get('/ig', handleIG);

// 6. ToURL Uploader (ImgBB + Direct Fallback)
app.all('/tourl', async (req, res) => {
    let media = req.query.url || req.body.url || req.body.image || req.body.base64;
    if (!media) return res.json({ status: false, message: 'Parameter media kosong' });

    if (typeof media === 'string' && media.includes('base64,')) {
        media = media.split('base64,')[1];
    }

    try {
        const formData = new URLSearchParams();
        formData.append('image', media);

        const r1 = await fetch('https://api.imgbb.com/1/upload?key=6d207e02198a847aa98d0a2a901485a5', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        const d1 = await r1.json();
        if (d1 && d1.success && d1.data && d1.data.url) {
            return res.json({ status: true, creator: 'VALENX STORE', result: d1.data.url });
        }
    } catch (e) {}

    if (typeof media === 'string' && media.startsWith('http')) {
        return res.json({ status: true, creator: 'VALENX STORE', result: media });
    }

    res.json({ status: false, message: 'Gagal upload gambar ke server.' });
});

module.exports = app;
