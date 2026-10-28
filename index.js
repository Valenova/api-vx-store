const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'API VALENX STORE berhasil aktif 24/7! 🚀'
    });
});

module.exports = app;
