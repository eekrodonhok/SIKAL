// api/generate.js
// Catatan: Karena kita kirim data JSON dari frontend, kita pake fetch bawaan Node.js bray

module.exports = async (req, res) => {
    // Set CORS biar gak diblokir browser HP lu
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metode kagak didukung bray, wajib POST!' });
    }

    // Ambil data kiriman dari BYOK frontend
    const { prompt, token, model } = req.body || {};

    if (!prompt) return res.status(400).json({ error: 'Prompt-nya kosong bray, isi dulu!' });
    if (!token) return res.status(400).json({ error: 'Token hf_ lu mana bray? Tempel dulu di gerbang!' });

    const targetModel = model || 'black-forest-labs/FLUX.1-dev';

    try {
        // Tembak langsung ke Hugging Face API pake Token si User (BYOK murni)
        const hfResponse = await fetch(`https://api-inference.huggingface.co/models/${targetModel}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ inputs: prompt }),
        });

        if (!hfResponse.ok) {
            const errText = await hfResponse.text();
            return res.status(hfResponse.status).json({ error: `Hugging Face Eror bray: ${errText}` });
        }

        // Ambil data gambar binary dari Hugging Face
        const buffer = await hfResponse.arrayBuffer();
        
        // Kirim balik data gambar utuh ke HP user
        res.setHeader('Content-Type', 'image/jpeg');
        return res.send(Buffer.from(buffer));

    } catch (err) {
        return res.status(500).json({ error: `Server internal eror: ${err.message}` });
    }
};
