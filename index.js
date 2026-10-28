const express = require('express');
const app = express();

app.use(express.json());

// 1. Fitur Utama / Cek Status API
app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'API VALENX STORE Berhasil Aktif 24/7! 🚀',
        author: 'Valenova'
    });
});

// 2. Fitur List Produk / Layanan Store
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

// 3. Fitur Cek Saldo / User (Contoh Parameter)
app.get('/ceksaldo', (req, res) => {
    const { username } = req.query;
    if (!username) {
        return res.json({ status: false, message: 'Masukkan parameter username! Contoh: /ceksaldo?username=valen' });
    }
    
    res.json({
        status: true,
        username: username,
        saldo: 150000,
        role: 'VIP Member'
    });
});

module.exports = app;
