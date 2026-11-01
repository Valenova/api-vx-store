const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const CREATOR = "VALENX STORE";
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// Helper Multi-Provider Fetching
async function fetchProvider(urls, timeout = 12000) {
    for (const url of urls) {
        try {
            const res = await axios.get(url, { headers: { 'User-Agent': USER_AGENT }, timeout });
            if (res.data) return res.data;
        } catch (e) {
            continue;
        }
    }
    return null;
}

// 0. Health Check (Halaman Utama)
app.get('/', (req, res) => {
    return res.json({
        status: true,
        creator: CREATOR,
        message: "API Server VX-STORE Running Smoothly 🚀"
    });
});

// 1. YouTube Play / MP3
app.get('/api/ytplay', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json({ status: false, creator: CREATOR, message: "Parameter ?query= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/d/ytplay?query=${encodeURIComponent(query)}`,
        `https://api.agatz.xyz/api/ytplay?message=${encodeURIComponent(query)}`,
        `https://widipe.com/download/ytmp3?url=${encodeURIComponent(query)}`
    ]);

    if (data?.data || data?.result) {
        const d = data.data || data.result;
        return res.json({
            status: true,
            creator: CREATOR,
            result: {
                title: d.title || query,
                channel: d.author || d.channel || 'YouTube Music',
                duration: d.duration || '-',
                views: d.views || '-',
                thumbnail: d.thumbnail || d.image,
                url: d.dl_url || d.downloadUrl || d.mp3 || d.url
            }
        });
    }
    return res.json({ status: false, creator: CREATOR, message: "Lagu tidak ditemukan" });
});

// 2. TikTok Downloader
app.get('/api/tiktok', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    const data = await fetchProvider([
        `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`,
        `https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(url)}`,
        `https://api.agatz.xyz/api/tiktok?url=${encodeURIComponent(url)}`
    ]);

    const ttUrl = data?.video?.noWatermark || data?.data?.urls?.[0] || data?.data?.video || data?.data?.nowm;
    if (ttUrl) return res.json({ status: true, creator: CREATOR, result: ttUrl });

    return res.json({ status: false, creator: CREATOR, message: "Gagal mendownload TikTok" });
});

// 3. Instagram Downloader
app.get('/api/igdl', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`,
        `https://api.agatz.xyz/api/instagram?url=${encodeURIComponent(url)}`,
        `https://widipe.com/download/igdl?url=${encodeURIComponent(url)}`
    ]);

    const igUrl = data?.data?.[0]?.url || data?.data?.url || data?.result?.[0]?.url;
    if (igUrl) return res.json({ status: true, creator: CREATOR, result: igUrl });

    return res.json({ status: false, creator: CREATOR, message: "Gagal mendownload IG" });
});

// 4. Pinterest Search
app.get('/api/pin', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json({ status: false, creator: CREATOR, message: "Parameter ?query= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`,
        `https://api.agatz.xyz/api/pinsearch?message=${encodeURIComponent(query)}`,
        `https://widipe.com/pinterest?query=${encodeURIComponent(query)}`
    ]);

    const imgUrl = data?.data?.[0]?.images_url || data?.data?.[0] || data?.result?.[0];
    if (imgUrl) return res.json({ status: true, creator: CREATOR, result: imgUrl });

    return res.json({ status: false, creator: CREATOR, message: "Gambar Pinterest tidak ditemukan" });
});

// 5. AI ChatGPT / DeepSeek
app.get('/api/ai', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, creator: CREATOR, message: "Parameter ?text= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/ai/deepseek?prompt=${encodeURIComponent(text)}`,
        `https://api.siputzx.my.id/api/ai/gpt3?prompt=${encodeURIComponent(text)}`,
        `https://api.agatz.xyz/api/degreeai?message=${encodeURIComponent(text)}`,
        `https://widipe.com/openai?text=${encodeURIComponent(text)}`
    ]);

    const aiAnswer = data?.data || data?.result;
    if (aiAnswer) return res.json({ status: true, creator: CREATOR, result: aiAnswer });

    return res.json({ status: false, creator: CREATOR, message: "AI sedang tidak merespon" });
});

// 6. Stalk Instagram
app.get('/api/stalkig', async (req, res) => {
    const { username } = req.query;
    if (!username) return res.json({ status: false, creator: CREATOR, message: "Parameter ?username= wajib diisi" });

    const cleanUser = username.replace('@', '').trim();
    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/s/stalkig?username=${encodeURIComponent(cleanUser)}`,
        `https://api.agatz.xyz/api/stalkig?username=${encodeURIComponent(cleanUser)}`
    ]);

    if (data?.data) {
        const d = data.data;
        return res.json({
            status: true,
            creator: CREATOR,
            result: {
                username: d.username || cleanUser,
                fullname: d.fullName || d.full_name || '-',
                followers: d.followers || 0,
                following: d.following || 0,
                posts: d.posts || 0,
                bio: d.biography || d.bio || '-',
                avatar: d.profilePic || d.profile_pic || ''
            }
        });
    }
    return res.json({ status: false, creator: CREATOR, message: "Username IG tidak ditemukan" });
});

// 7. Stalk TikTok
app.get('/api/stalktt', async (req, res) => {
    const { username } = req.query;
    if (!username) return res.json({ status: false, creator: CREATOR, message: "Parameter ?username= wajib diisi" });

    const cleanUser = username.replace('@', '').trim();
    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/s/stalktt?username=${encodeURIComponent(cleanUser)}`,
        `https://api.agatz.xyz/api/stalktt?username=${encodeURIComponent(cleanUser)}`
    ]);

    if (data?.data) {
        const d = data.data;
        return res.json({
            status: true,
            creator: CREATOR,
            result: {
                username: d.username || cleanUser,
                nickname: d.nickname || '-',
                followers: d.followers || 0,
                following: d.following || 0,
                likes: d.likes || 0,
                bio: d.signature || d.bio || '-',
                avatar: d.avatar || ''
            }
        });
    }
    return res.json({ status: false, creator: CREATOR, message: "Username TikTok tidak ditemukan" });
});

// 8. Cek Cuaca
app.get('/api/cuaca', async (req, res) => {
    const { kota } = req.query;
    if (!kota) return res.json({ status: false, creator: CREATOR, message: "Parameter ?kota= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/s/cuaca?kota=${encodeURIComponent(kota)}`
    ]);

    if (data?.data) {
        const d = data.data;
        return res.json({
            status: true,
            creator: CREATOR,
            result: {
                kota: kota,
                cuaca: d.cuaca || '-',
                suhu: d.suhu || '-',
                kelembapan: d.kelembapan || '-',
                angin: d.angin || '-'
            }
        });
    }
    return res.json({ status: false, creator: CREATOR, message: "Kota tidak ditemukan" });
});

module.exports = app;
