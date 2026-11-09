const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const CREATOR = 'VALENX STORE';
const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY;

function pollinationsHeaders() {
    return {
        Authorization: `Bearer ${POLLINATIONS_API_KEY}`
    };
}

app.get('/', (req, res) => {
    res.json({
        status: true,
        creator: CREATOR,
        message: '✅ API VX-STORE Berjalan'
    });
});

// TIKTOK
app.get('/api/tiktok', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({
            status: false,
            message: 'Masukkan link TikTok!'
        });
    }

    try {
        const response = await axios.post(
            'https://www.tikwm.com/api/',
            new URLSearchParams({ url }),
            { timeout: 20000 }
        );

        const link =
            response.data?.data?.hdplay ||
            response.data?.data?.play;

        if (link) {
            return res.json({ status: true, result: link });
        }

        return res.status(502).json({
            status: false,
            message: 'Link TikTok tidak berhasil diproses.'
        });
    } catch (error) {
        console.error('TikTok error:', error.response?.status || error.message);

        return res.status(502).json({
            status: false,
            message: 'Gagal memproses link TikTok. Coba lagi nanti.'
        });
    }
});

// PIN — membuat gambar AI, bukan mengunduh dari Pinterest
app.get('/api/pin', (req, res) => {
    const query = req.query.query || 'landscape';
    const imageUrl = new URL('/api/pin/image', `${req.protocol}://${req.get('host')}`);
    imageUrl.searchParams.set('query', query);

    res.json({
        status: true,
        result: imageUrl.toString()
    });
});

// Proxy gambar supaya API key tidak dikirim ke browser
app.get('/api/pin/image', async (req, res) => {
    const query = req.query.query || 'landscape';

    if (!POLLINATIONS_API_KEY) {
        return res.status(503).json({
            status: false,
            message: 'API key belum dikonfigurasi di server.'
        });
    }

    try {
        const response = await axios.get(
            `https://gen.pollinations.ai/image/${encodeURIComponent(query)}`,
            {
                params: {
                    width: 720,
                    height: 1280,
                    nologo: true
                },
                headers: pollinationsHeaders(),
                responseType: 'arraybuffer',
                timeout: 60000
            }
        );

        res.set(
            'Content-Type',
            response.headers['content-type'] || 'image/jpeg'
        );
        res.set('Cache-Control', 'no-store');
        return res.send(response.data);
    } catch (error) {
        console.error(
            'Pollinations image error:',
            error.response?.status || error.message
        );

        return res.status(502).json({
            status: false,
            message: 'Gagal membuat gambar. Periksa API key atau coba lagi nanti.'
        });
    }
});

// AI CHAT
app.get('/api/ai', async (req, res) => {
    const text = req.query.text || req.query.q;

    if (!text) {
        return res.status(400).json({
            status: false,
            message: 'Masukkan pertanyaan!'
        });
    }

    if (!POLLINATIONS_API_KEY) {
        return res.status(503).json({
            status: false,
            message: 'API key belum dikonfigurasi di server.'
        });
    }

    try {
        const response = await axios.get(
            `https://gen.pollinations.ai/text/${encodeURIComponent(text)}`,
            {
                headers: pollinationsHeaders(),
                timeout: 60000
            }
        );

        return res.json({
            status: true,
            result: response.data
        });
    } catch (error) {
        console.error(
            'Pollinations AI error:',
            error.response?.status || error.message
        );

        return res.status(502).json({
            status: false,
            message: 'AI gagal merespons. Periksa API key atau coba lagi nanti.'
        });
    }
});

// INSTAGRAM — sementara dinonaktifkan
app.get('/api/igdl', (req, res) => {
    res.json({
        status: false,
        message: '⚠️ Fitur IG sementara dinonaktifkan.'
    });
});

module.exports = app;
