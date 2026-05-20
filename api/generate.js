// api/generate.js

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method harus POST bray!' });

  try {
    const { prompt, apiKey, modelType, imageUrl } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'API Key kosong di server bray!' });

    const cleanKey = apiKey.trim();

    // Taktik Jitu: Kirim langsung ke endpoint Magnific Video dengan otentikasi Bearer Token
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
      return res.status(response.status).json({ 
        error: data.message || 'Kunci ditolak Magnific. Pastikan API Key lu bener bray.' 
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
