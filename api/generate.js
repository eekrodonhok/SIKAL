// api/generate.js

// Beritahu Vercel untuk tidak merusak data binary stream gambar
export const config = {
    api: {
        bodyParser: false,
    },
};

// Fungsi pembantu buat ngebaca stream data mentah dari HP lu bray
function getRawBody(req) {
    return new Promise((resolve, reject) => {
        let chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', (err) => reject(err));
    });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-hf-token, x-hf-prompt, x-hf-model');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Wajib POST bray!' });

    try {
        // Ambil data rahasia (token, prompt, model) yang kita umpetin di headers
        const token = req.headers['x-hf-token'];
        const prompt = req.headers['x-hf-prompt'];
        const model = req.headers['x-hf-model'] || 'tencent/HunyuanVideo';
        const contentType = req.headers['content-type'] || 'image/jpeg';

        if (!prompt) return res.status(400).json({ error: 'Prompt-nya mana bray?' });
        if (!token) return res.status(400).json({ error: 'Token hf_ lu kosong bray!' });

        // Telan data gambar mentah dari body tanpa bantuan formidable
        const imageBuffer = await getRawBody(req);
        if (!imageBuffer || imageBuffer.length === 0) {
            return res.status(400).json({ error: 'Gambarnya gagal ketelan server bray!' });
        }

        // Tembak langsung paketnya ke Hugging Face API
        const hfResponse = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": contentType
            },
            method: "POST",
            body: imageBuffer,
        });

        if (!hfResponse.ok) {
            const errText = await hfResponse.text();
            return res.status(hfResponse.status).json({ error: `HF Gagal Masak bray: ${errText}` });
        }

        const videoBuffer = await hfResponse.arrayBuffer();

        // Kirim balik video mp4 segar ke HP lu bray
        res.setHeader('Content-Type', 'video/mp4');
        return res.send(Buffer.from(videoBuffer));

    } catch (error) {
        return res.status(500).json({ error: `Gagal total di backend: ${error.message}` });
    }
};
              
