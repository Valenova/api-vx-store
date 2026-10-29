const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => res.json({ status: true, message: 'API VALENX STORE Ready 🚀' }));

// Helper Parser: Ekstrak link URL murni dari bentuk objek/array scraper apa pun
function extractUrl(obj) {
    if (!obj) return null;
    if (typeof obj === 'string' && obj.startsWith('http')) return obj;
    if (Array.isArray(obj)) return extractUrl(obj[0]);
    if (typeof obj === 'object') {
        return extractUrl(obj.url || obj.video || obj.download || obj.image || obj.direct || obj.link || obj.data);
    }
    return null;
}

// 1. TikTok Downloader (TikWM - 100% SUDAH BERHASIL)
app.get(['/tiktok', '/tt'], async (req, res) => {
    const url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, message: 'Isi parameter url!' });

    try {
        const response = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        if (data && data.code === 0 && data.data) {
            return res.json({ status: true, creator: 'VALENX STORE', result: data.data.play || data.data.wmplay });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal mengambil video TikTok.' });
});

// 2. AI Chat (Pollinations Bahasa Indonesia - 100% SUDAH BERHASIL)
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

// 3. Stiker Brat (HuggingFace - 100% SUDAH BERHASIL)
app.get('/brat', async (req, res) => {
    const text = req.query.text || req.query.q;
    if (!text) return res.json({ status: false, message: 'Isi parameter text!' });
    return res.json({ status: true, creator: 'VALENX STORE', result: `https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(text)}` });
});

// 4. Pinterest Search (Penyaring Link Gambar Otomatis)
app.get(['/pin', '/pinterest'], async (req, res) => {
    const query = req.query.query || req.query.q || req.query.text;
    if (!query) return res.json({ status: false, message: 'Isi parameter query!' });

    const apis = [
        `https://api.vreden.web.id/api/pinterest?query=${encodeURIComponent(query)}`,
        `https://widipe.com/download/pinterest?text=${encodeURIComponent(query)}`,
        `https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`
    ];

    for (const api of apis) {
        try {
            const r = await fetch(api);
            const d = await r.json();
            const raw = d.result || d.data;
            if (raw) {
                const list = (Array.isArray(raw) ? raw : [raw]).map(extractUrl).filter(item => typeof item === 'string' && item.startsWith('http'));
                if (list.length > 0) {
                    return res.json({ status: true, creator: 'VALENX STORE', result: list });
                }
            }
        } catch (e) {}
    }

    res.json({ status: false, message: 'Gambar Pinterest tidak ditemukan.' });
});

// 5. Instagram Downloader (Pembersih Link + Rotasi Scraper Multi-Format)
app.get(['/igdl', '/ig'], async (req, res) => {
    let url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, message: 'Isi parameter url!' });

    if (url.includes('instagram.com')) {
        url = url.split('?')[0];
    }

    const apis = [
        `https://api.vreden.web.id/api/igdownload?url=${encodeURIComponent(url)}`,
        `https://widipe.com/download/igdl?url=${encodeURIComponent(url)}`,
        `https://bk9.fun/download/ig?url=${encodeURIComponent(url)}`
    ];

    for (const api of apis) {
        try {
            const r = await fetch(api);
            const d = await r.json();
            const media = extractUrl(d.result || d.data || d.BK9);
            if (media && typeof media === 'string' && media.startsWith('http')) {
                return res.json({ status: true, creator: 'VALENX STORE', result: media });
            }
        } catch (e) {}
    }

    res.json({ status: false, message: 'Gagal mengambil media Instagram. Pastikan postingan dari akun publik.' });
});

module.exports = app;
