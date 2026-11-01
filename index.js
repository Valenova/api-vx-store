const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

// Check Status
app.get('/', (req, res) => {
    res.json({ status: true, message: 'API VX Store Online & Operational' });
});

// ================= 1. TIKTOK DOWNLOADER (TRIPLE FALLBACK ANTI-EROR) =================
app.get('/tiktok', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'URL wajib diisi' });

    // Server Utama: TikWM (Kencang)
    try {
        const res1 = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`, { headers, timeout: 6000 });
        const videoUrl1 = res1.data?.data?.play || res1.data?.data?.wmplay;
        if (videoUrl1) return res.json({ status: true, result: videoUrl1 });
    } catch (e) {}

    // Server Cadangan 1: Agatz API
    try {
        const res2 = await axios.get(`https://api.agatz.xyz/api/tiktok?url=${encodeURIComponent(url)}`, { headers, timeout: 6000 });
        const videoUrl2 = res2.data?.data?.video || res2.data?.data?.no_watermark || res2.data?.data?.hdvideo;
        if (videoUrl2) return res.json({ status: true, result: videoUrl2 });
    } catch (e) {}

    // Server Cadangan 2: Tiklydown API
    try {
        const res3 = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`, { headers, timeout: 6000 });
        const videoUrl3 = res3.data?.video?.noWatermark || res3.data?.url;
        if (videoUrl3) return res.json({ status: true, result: videoUrl3 });
    } catch (e) {}

    res.json({ status: false, message: 'Semua server TikTok sedang tidak merespon' });
});

// ================= 2. INSTAGRAM DOWNLOADER (DUAL FALLBACK) =================
app.get('/igdl', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, message: 'URL wajib diisi' });

    // Server Utama: Siputzx
    try {
        const res1 = await axios.get(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`, { headers, timeout: 7000 });
        const media = res1.data?.data;
        if (media) {
            const mediaUrl = Array.isArray(media) ? (media[0]?.url || media[0]) : media;
            if (mediaUrl) return res.json({ status: true, result: mediaUrl });
        }
    } catch (e) {}

    // Server Cadangan: Agatz
    try {
        const res2 = await axios.get(`https://api.agatz.xyz/api/instagram?url=${encodeURIComponent(url)}`, { headers, timeout: 7000 });
        const data2 = res2.data?.data;
        if (data2) {
            const mediaUrl2 = Array.isArray(data2) ? (data2[0]?.url || data2[0]) : data2;
            if (mediaUrl2) return res.json({ status: true, result: mediaUrl2 });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gagal mengambil media Instagram' });
});

// ================= 3. PINTEREST SEARCH (DUAL FALLBACK) =================
app.get('/pin', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json({ status: false, message: 'Query wajib diisi' });

    // Server Utama: Siputzx
    try {
        const res1 = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`, { headers, timeout: 7000 });
        if (res1.data?.data && res1.data.data.length > 0) {
            const random = res1.data.data[Math.floor(Math.random() * res1.data.data.length)];
            const imgUrl = random?.images_url || random?.url || random;
            if (imgUrl) return res.json({ status: true, result: imgUrl });
        }
    } catch (e) {}

    // Server Cadangan: Native Pinterest
    try {
        const res2 = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?data=${encodeURIComponent(JSON.stringify({ options: { query, scope: "pins" } }))}`, { headers, timeout: 7000 });
        const results = res2.data?.resource_response?.data?.results;
        if (results && results.length > 0) {
            const random = results[Math.floor(Math.random() * results.length)];
            const imgUrl = random?.images?.orig?.url;
            if (imgUrl) return res.json({ status: true, result: imgUrl });
        }
    } catch (e) {}

    res.json({ status: false, message: 'Gambar Pinterest tidak ditemukan' });
});

// ================= 4. AI CHAT (DUAL FALLBACK) =================
app.get('/ai', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: 'Teks wajib diisi' });

    // Server Utama: Siputzx AI
    try {
        const res1 = await axios.get(`https://api.siputzx.my.id/api/ai/chatgpt?content=${encodeURIComponent(text)}`, { headers, timeout: 7000 });
        if (res1.data?.data) return res.json({ status: true, result: res1.data.data });
    } catch (e) {}

    // Server Cadangan: SimSimi VN
    try {
        const res2 = await axios.get(`https://api.simsimi.vn/v1/simtalk`, { params: { text, lc: 'id' }, headers, timeout: 7000 });
        if (res2.data?.message) return res.json({ status: true, result: res2.data.message });
    } catch (e) {}

    res.json({ status: false, message: 'AI sedang tidak merespon' });
});

// ================= 5. BRAT STICKER GENERATOR =================
app.get('/brat', async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json({ status: false, message: 'Teks wajib diisi' });

    try {
        const bratUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}`;
        return res.json({ status: true, result: bratUrl });
    } catch (e) {
        const fallbackUrl = `https://png.vcap.me/brat?text=${encodeURIComponent(text)}`;
        return res.json({ status: true, result: fallbackUrl });
    }
});

module.exports = app;
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

const CREATOR = "VALENX STORE";
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// Helper Fetch Scraper
async function fetchProvider(urls, timeout = 10000) {
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

// Route Test / Health Check
app.get('/', (req, res) => {
    res.json({
        status: true,
        creator: CREATOR,
        message: "API Server VX-STORE Running Smoothly 🚀"
    });
});

// ================= 1. YOUTUBE PLAY & MP3 =================
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
    res.json({ status: false, creator: CREATOR, message: "Lagu tidak ditemukan" });
});

// ================= 2. YOUTUBE MP4 =================
app.get('/api/ytmp4', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(url)}`,
        `https://widipe.com/download/ytmp4?url=${encodeURIComponent(url)}`
    ]);

    const videoUrl = data?.data?.dl_url || data?.result?.dl_url || data?.result?.url;
    if (videoUrl) {
        return res.json({ status: true, creator: CREATOR, result: videoUrl });
    }
    res.json({ status: false, creator: CREATOR, message: "Gagal mengunduh video YT" });
});

// ================= 3. TIKTOK DOWNLOADER =================
app.get('/api/tiktok', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(url)}`,
        `https://api.agatz.xyz/api/tiktok?url=${encodeURIComponent(url)}`
    ]);

    const ttUrl = data?.data?.urls?.[0] || data?.data?.video || data?.data?.nowm;
    if (ttUrl) {
        return res.json({ status: true, creator: CREATOR, result: ttUrl });
    }
    res.json({ status: false, creator: CREATOR, message: "Gagal mendownload TikTok" });
});

// ================= 4. INSTAGRAM DOWNLOADER =================
app.get('/api/igdl', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`,
        `https://api.agatz.xyz/api/instagram?url=${encodeURIComponent(url)}`,
        `https://widipe.com/download/igdl?url=${encodeURIComponent(url)}`
    ]);

    const igUrl = data?.data?.[0]?.url || data?.data?.url || data?.result?.[0]?.url;
    if (igUrl) {
        return res.json({ status: true, creator: CREATOR, result: igUrl });
    }
    res.json({ status: false, creator: CREATOR, message: "Gagal mendownload IG" });
});

// ================= 5. FACEBOOK DOWNLOADER =================
app.get('/api/fb', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(url)}`,
        `https://api.agatz.xyz/api/facebook?url=${encodeURIComponent(url)}`
    ]);

    const fbUrl = data?.data?.hd || data?.data?.sd || data?.data?.[0]?.url;
    if (fbUrl) {
        return res.json({ status: true, creator: CREATOR, result: fbUrl });
    }
    res.json({ status: false, creator: CREATOR, message: "Gagal mendownload Facebook" });
});

// ================= 6. CAPCUT DOWNLOADER =================
app.get('/api/capcut', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/d/capcut?url=${encodeURIComponent(url)}`
    ]);

    const ccUrl = data?.data?.originalVideoUrl || data?.data?.video;
    if (ccUrl) {
        return res.json({ status: true, creator: CREATOR, result: ccUrl });
    }
    res.json({ status: false, creator: CREATOR, message: "Gagal mendownload CapCut" });
});

// ================= 7. SPOTIFY DOWNLOADER =================
app.get('/api/spotify', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(url)}`
    ]);

    const spUrl = data?.data?.download || data?.data?.url;
    if (spUrl) {
        return res.json({ status: true, creator: CREATOR, result: spUrl });
    }
    res.json({ status: false, creator: CREATOR, message: "Gagal mendownload Spotify" });
});

// ================= 8. MEDIAFIRE DOWNLOADER =================
app.get('/api/mediafire', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/d/mediafire?url=${encodeURIComponent(url)}`
    ]);

    if (data?.data?.link) {
        return res.json({
            status: true,
            creator: CREATOR,
            result: {
                link: data.data.link,
                filename: data.data.nama || 'file.zip',
                size: data.data.size || '-'
            }
        });
    }
    res.json({ status: false, creator: CREATOR, message: "Gagal mendownload Mediafire" });
});

// ================= 9. PINTEREST SEARCH =================
app.get('/api/pin', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json({ status: false, creator: CREATOR, message: "Parameter ?query= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(query)}`,
        `https://api.agatz.xyz/api/pinsearch?message=${encodeURIComponent(query)}`,
        `https://widipe.com/pinterest?query=${encodeURIComponent(query)}`
    ]);

    const imgUrl = data?.data?.[0]?.images_url || data?.data?.[0] || data?.result?.[0];
    if (imgUrl) {
        return res.json({ status: true, creator: CREATOR, result: imgUrl });
    }
    res.json({ status: false, creator: CREATOR, message: "Gambar Pinterest tidak ditemukan" });
});

// ================= 10. AI CHATGPT / DEEPSEEK =================
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
    if (aiAnswer) {
        return res.json({ status: true, creator: CREATOR, result: aiAnswer });
    }
    res.json({ status: false, creator: CREATOR, message: "AI sedang tidak merespon" });
});

// ================= 11. HD / REMINI PHOTO =================
app.get('/api/hd', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    try {
        const hdApiUrl = `https://api.siputzx.my.id/api/il/remini?url=${encodeURIComponent(url)}`;
        const imgBuffer = await axios.get(hdApiUrl, { responseType: 'arraybuffer', timeout: 20000 });
        res.set('Content-Type', 'image/jpeg');
        return res.send(Buffer.from(imgBuffer.data));
    } catch (e) {
        res.json({ status: false, creator: CREATOR, message: "Gagal menjernihkan foto" });
    }
});

// ================= 12. REMOVE BACKGROUND =================
app.get('/api/rembg', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    try {
        const rembgUrl = `https://api.siputzx.my.id/api/il/removebg?url=${encodeURIComponent(url)}`;
        const imgBuffer = await axios.get(rembgUrl, { responseType: 'arraybuffer', timeout: 20000 });
        res.set('Content-Type', 'image/png');
        return res.send(Buffer.from(imgBuffer.data));
    } catch (e) {
        res.json({ status: false, creator: CREATOR, message: "Gagal menghapus background" });
    }
});

// ================= 13. SCREENSHOT WEB =================
app.get('/api/ssweb', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    try {
        const ssUrl = `https://api.siputzx.my.id/api/m/ssweb?url=${encodeURIComponent(url)}&type=desktop`;
        const imgBuffer = await axios.get(ssUrl, { responseType: 'arraybuffer', timeout: 15000 });
        res.set('Content-Type', 'image/jpeg');
        return res.send(Buffer.from(imgBuffer.data));
    } catch (e) {
        res.json({ status: false, creator: CREATOR, message: "Gagal screenshot website" });
    }
});

// ================= 14. OCR (IMAGE TO TEXT) =================
app.get('/api/ocr', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json({ status: false, creator: CREATOR, message: "Parameter ?url= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/m/ocr?url=${encodeURIComponent(url)}`
    ]);

    if (data?.data) {
        return res.json({ status: true, creator: CREATOR, result: data.data });
    }
    res.json({ status: false, creator: CREATOR, message: "Gagal membaca teks gambar" });
});

// ================= 15. STALK INSTAGRAM =================
app.get('/api/stalkig', async (req, res) => {
    const { username } = req.query;
    if (!username) return res.json({ status: false, creator: CREATOR, message: "Parameter ?username= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/s/stalkig?username=${encodeURIComponent(username)}`,
        `https://api.agatz.xyz/api/stalkig?username=${encodeURIComponent(username)}`
    ]);

    if (data?.data) {
        const d = data.data;
        return res.json({
            status: true,
            creator: CREATOR,
            result: {
                username: d.username || username,
                fullname: d.fullName || d.full_name || '-',
                followers: d.followers || 0,
                following: d.following || 0,
                posts: d.posts || 0,
                bio: d.biography || d.bio || '-',
                avatar: d.profilePic || d.profile_pic || ''
            }
        });
    }
    res.json({ status: false, creator: CREATOR, message: "Username IG tidak ditemukan" });
});

// ================= 16. STALK TIKTOK =================
app.get('/api/stalktt', async (req, res) => {
    const { username } = req.query;
    if (!username) return res.json({ status: false, creator: CREATOR, message: "Parameter ?username= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/s/stalktt?username=${encodeURIComponent(username)}`,
        `https://api.agatz.xyz/api/stalktt?username=${encodeURIComponent(username)}`
    ]);

    if (data?.data) {
        const d = data.data;
        return res.json({
            status: true,
            creator: CREATOR,
            result: {
                username: d.username || username,
                nickname: d.nickname || '-',
                followers: d.followers || 0,
                following: d.following || 0,
                likes: d.likes || 0,
                bio: d.signature || d.bio || '-',
                avatar: d.avatar || ''
            }
        });
    }
    res.json({ status: false, creator: CREATOR, message: "Username TikTok tidak ditemukan" });
});

// ================= 17. CEK CUACA =================
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
    res.json({ status: false, creator: CREATOR, message: "Kota tidak ditemukan" });
});

// ================= 18. CEK RESI EKSPEDISI =================
app.get('/api/cekresi', async (req, res) => {
    const { kurir, resi } = req.query;
    if (!kurir || !resi) return res.json({ status: false, creator: CREATOR, message: "Parameter ?kurir= dan ?resi= wajib diisi" });

    const data = await fetchProvider([
        `https://api.siputzx.my.id/api/s/cekresi?kurir=${encodeURIComponent(kurir)}&resi=${encodeURIComponent(resi)}`
    ]);

    if (data?.data) {
        return res.json({
            status: true,
            creator: CREATOR,
            result: data.data
        });
    }
    res.json({ status: false, creator: CREATOR, message: "Resi tidak ditemukan" });
});

// Export Express App untuk Vercel Serverless Function
module.exports = app;
