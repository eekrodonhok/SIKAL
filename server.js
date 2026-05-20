const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

// Kirim file HTML pas halaman web dibuka
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint status indikator navbar depan
app.get('/api/status', (req, res) => {
    res.json({ status: "online", message: "Mesin BYOK SIKAL-AI siap di HP bray!" });
});

app.listen(PORT, () => {
    console.log(`Server jalan aman bray di port ${PORT}`);
});
