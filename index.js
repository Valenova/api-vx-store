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

// 2. AI Chat (Bahasa Indonesia)
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

// 4. Pinterest Search (JoshWeb & FGMods - Kebal Blokir Vercel)
const handlePin = async (req, res) => {
    const query = req.query.query || req.query.q || req.query.text;
    if (!query) return res.json({ status: false, message: 'Isi parameter query!' });

    // Server 1: JoshWeb
    try {
        const r1 = await fetch(`https://api.joshweb.click/api/pinterest?q=${encodeURIComponent(query)}`);
        const d1 = await r1.json();
        if (d1 && d1.status && d1.result) {
            const imgs = Array.isArray(d1.result) ? d1.result : [d1.result];
            return res.json({ status: true, creator: 'VALENX STORE', result: imgs });
        }
    } catch (e) {}

    // Server 2: FGMods
    try {
        const r2 = await fetch(`https://api.fgmods.xyz/api/downloader/pinterest?text=${encodeURIComponent(query)}&apikey=fg-fmtk`);
        const d2 = await r2.json();
        if (d2 && d2.status && d2.result) {
            const imgs = Array.isArray(d2.result) ? d2.result.map(i => i.image || i) : [d2.result];
            return res.json({ status: true, creator: 'VALENX STORE', result: imgs });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gambar Pinterest tidak ditemukan.' });
};
app.get('/pin', handlePin);
app.get('/pinterest', handlePin);

// 5. Instagram Downloader (JoshWeb & FGMods - Kebal Blokir Vercel)
const handleIG = async (req, res) => {
    let url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, message: 'Isi parameter url!' });

    if (url.includes('instagram.com')) {
        url = url.split('?')[0];
    }

    // Server 1: JoshWeb
    try {
        const r1 = await fetch(`https://api.joshweb.click/api/igdl?url=${encodeURIComponent(url)}`);
        const d1 = await r1.json();
        if (d1 && d1.status && d1.result) {
            let media = Array.isArray(d1.result) ? d1.result[0]?.url || d1.result[0] : d1.result.url || d1.result;
            if (typeof media === 'string' && media.startsWith('http')) {
                return res.json({ status: true, creator: 'VALENX STORE', result: media });
            }
        }
    } catch (e) {}

    // Server 2: FGMods
    try {
        const r2 = await fetch(`https://api.fgmods.xyz/api/downloader/igdl?url=${encodeURIComponent(url)}&apikey=fg-fmtk`);
        const d2 = await r2.json();
        if (d2 && d2.status && d2.result) {
            let media = Array.isArray(d2.result) ? d2.result[0]?.url || d2.result[0] : d2.result.url || d2.result;
            if (typeof media === 'string' && media.startsWith('http')) {
                return res.json({ status: true, creator: 'VALENX STORE', result: media });
            }
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal mengambil media Instagram.' });
};
app.get('/igdl', handleIG);
app.get('/ig', handleIG);

// 6. ToURL Uploader (Direct Link Handler)
app.all('/tourl', async (req, res) => {
    let media = req.query.url || req.body.url || req.body.image || req.body.base64;
    if (!media) return res.json({ status: false, message: 'Parameter media kosong' });

    if (typeof media === 'string' && media.startsWith('http')) {
        return res.json({ status: true, creator: 'VALENX STORE', result: media });
    }

    res.json({ status: false, message: 'Gagal upload gambar ke server.' });
});

module.exports = app;
