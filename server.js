const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Biar foto gak kena blokir ukuran

// Endpoint Generate Video
app.post('/api/generate', async (req, res) => {
    const { prompt, token, model } = req.body;
    
    try {
        console.log("Nembak ke Hugging Face bray...");
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ inputs: prompt })
        });

        if (!response.ok) throw new Error('Gagal dari Hugging Face');
        
        const blob = await response.blob();
        const buffer = Buffer.from(await blob.arrayBuffer());
        
        res.setHeader('Content-Type', 'video/mp4');
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SIKAL-Ai Backend jalan di port ${PORT}`));
