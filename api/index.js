const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const CREATOR = "VALENX STORE";

// Root Check
app.get('/', (req, res) => {
    return res.json({
        status: true,
        creator: CREATOR,
        message: "API Server VX-STORE Operational & Fresh 🚀"
    });
});

// 1. AI Chat (Direct Pollinations AI)
app.get('/api/ai', async (req, res) => {
    const text = req.query.text || req.query.prompt || req.query.q;
    if (!text) return res.json({ status: false, creator: CREATOR, message: "Parameter ?text= wajib diisi" });

    try {
        const response = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(text)}`);
        if (response.data) {
            return res.json({ status: true, creator: CREATOR, result: response.data });
        }
    } catch (e) {}

    return res.json({ status: false, creator: CREATOR, message: "AI sedang tidak merespon" });
});

// 2. Pinterest (Direct Image)
app.get('/api/pin', async (req, res) => {
    const query = req.query.query || req.query.q || req.query.text;
    if (!query) return res.json({ status: false, creator: CREATOR, message: "Parameter ?query= wajib diisi" });

    const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=720&height=1280&nologo=true`;
    return res.json({ status: true, creator: CREATOR, result: imgUrl });
});

module.exports = app;
