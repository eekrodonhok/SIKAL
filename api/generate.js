// api/generate.js

export const config = {
  maxDuration: 60,
  api: { bodyParser: { sizeLimit: '10mb' } },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Harus POST, bray!' });

  try {
    const { prompt, apiKey, modelType, imageUrl } = req.body;

    if (!apiKey) return res.status(400).json({ error: 'API Key lu kosong di server, cok!' });
    if (!prompt || !imageUrl) return res.status(400).json({ error: 'Prompt atau gambar wajib diisi!' });

    // Bersihin spasi gaib di API Key biar ga error
    const cleanKey = apiKey.trim();

    const response = await fetch('https://api.freepik.com/v1/ai/video-generation', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': cleanKey,
        'Authorization': `Bearer ${cleanKey}`
      },
      body: JSON.stringify({
        model: modelType,
        prompt: prompt,
        image: imageUrl
      })
    });

    const data = await response.json();
    
    // Kalau Magnific nolak, kita keluarin error asli dari mereka
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.message || data.detail || 'Ditolak Magnific bray, cek sikal_key lu.' 
      });
    }
    
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
