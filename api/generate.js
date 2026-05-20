export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method not allowed');
    const { prompt, token, model, imageUrl } = req.body;

    try {
        // Kita nembak ke API Hugging Face (Contoh Hunyuan)
        const response = await fetch(`https://api-inference.huggingface.co/models/tencent/HunyuanVideo`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ inputs: prompt })
        });

        const data = await response.blob();
        res.setHeader('Content-Type', 'video/mp4');
        res.send(Buffer.from(await data.arrayBuffer()));
    } catch (err) {
        res.status(500).json({ error: 'Gagal generate, bray!' });
    }
}
