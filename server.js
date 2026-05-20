const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Biar server bisa ngebaca file statis di sekitarnya
app.use(express.static(path.join(__dirname)));

// Jalur utama pas web SIKAL-AI lu dibuka, langsung nembak ke index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Jalur cadangan buat ngasih makan status badge indikator di navbar biar ijo/biru
app.get('/api/status', (req, res) => {
    res.json({ status: "online", message: "Mesin BYOK SIKAL-AI siap di HP bray!" });
});

app.listen(PORT, () => {
    console.log(`Server jalan aman bray di port ${PORT}`);
});
