// server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Sajikan halaman depan index.html otomatis
app.use(express.static(__dirname));

// 🚀 Endpoint Utama Generator Video
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, apiKey, modelType, imageUrl } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'API Key kosong bray!' });

    const cleanKey = apiKey.trim();

    const response = await fetch('https://api.magnific.com/v1/video-generation', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanKey}`
      },
      body: JSON.stringify({
        model: modelType,
        prompt: prompt,
        image: imageUrl
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Kunci ditolak Magnific bray.' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// 🎬 Endpoint Pelacak Status Antrean Video
app.post('/api/status', async (req, res) => {
  try {
    const { request_id, apiKey } = req.body;
    const cleanKey = apiKey.trim();

    const response = await fetch(`https://api.magnific.com/v1/video-generation/${request_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${cleanKey}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Gagal lacak status bray.' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server SIKAL-Ai terbang di port ${PORT}`);
});
  
