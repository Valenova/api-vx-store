const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Status Utama API
app.get('/', (req, res) => res.json({ status: true, message: 'API VALENX STORE 24/7 Online 🚀' }));

// 1. Fitur Stiker Brat (/brat) - BUKTI SUDAH BERHASIL
app.get('/brat', async (req, res) => {
    const text = req.query.text || req.query.q;
    if (!text) return res.json({ status: false, message: 'Isi parameter text!' });
    return res.json({
        status: true,
        creator: 'VALENX STORE',
        result: `https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(text)}`
    });
});

// 2. Fitur TikTok Downloader (Mendukung /tiktok dan /tt)
const handleTikTok = async (req, res) => {
    const url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, message: 'Isi parameter url!' });

    // Server 1: Tiklydown
    try {
        const r1 = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`);
        const d1 = await r1.json();
        if (d1 && (d1.video || d1.url)) {
            return res.json({
                status: true,
                creator: 'VALENX STORE',
                result: d1.video ? d1.video.noWatermark : d1.url
            });
        }
    } catch (e) {}

    // Server 2: Agatz Backup
    try {
        const r2 = await fetch(`https://api.agatz.xyz/api/tiktok?url=${encodeURIComponent(url)}`);
        const d2 = await r2.json();
        if (d2 && d2.data) {
            return res.json({ status: true, creator: 'VALENX STORE', result: d2.data });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal mengambil video TikTok. Server scraper sedang down.' });
};
app.get('/tiktok', handleTikTok);
app.get('/tt', handleTikTok);

// 3. Fitur Instagram Downloader (Mendukung /igdl dan /ig)
const handleIG = async (req, res) => {
    let url = req.query.url || req.query.link;
    if (!url) return res.json({ status: false, message: 'Isi parameter url!' });
    if (url.includes('instagram.com')) url = url.split('?')[0];

    // Server 1: Agatz
    try {
        const r1 = await fetch(`https://api.agatz.xyz/api/instagram?url=${encodeURIComponent(url)}`);
        const d1 = await r1.json();
        if (d1 && d1.data) {
            return res.json({ status: true, creator: 'VALENX STORE', result: d1.data });
        }
    } catch (e) {}

    // Server 2: Vreden
    try {
        const r2 = await fetch(`https://api.vreden.web.id/api/igdownload?url=${encodeURIComponent(url)}`);
        const d2 = await r2.json();
        if (d2 && d2.result) {
            return res.json({ status: true, creator: 'VALENX STORE', result: d2.result });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal mengambil media Instagram.' });
};
app.get('/igdl', handleIG);
app.get('/ig', handleIG);

// 4. Fitur Pinterest Search (Mendukung /pin dan /pinterest)
const handlePin = async (req, res) => {
    const query = req.query.query || req.query.q || req.query.text;
    if (!query) return res.json({ status: false, message: 'Isi parameter query!' });

    try {
        const r = await fetch(`https://api.agatz.xyz/api/pin?message=${encodeURIComponent(query)}`);
        const d = await r.json();
        if (d && d.data) {
            return res.json({ status: true, creator: 'VALENX STORE', result: d.data });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gambar Pinterest tidak ditemukan.' });
};
app.get('/pin', handlePin);
app.get('/pinterest', handlePin);

// 5. Fitur ToURL / ImgBB Uploader (/tourl)
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

module.exports = app;
