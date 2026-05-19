// api/generate.js

export const config = {
  maxDuration: 60,
  api: { bodyParser: { sizeLimit: '10mb' } },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Harus POST, bray!' });

  try {
    const { prompt, apiKey, modelType, imageUrl } = req.body;

    if (!apiKey) return res.status(400).json({ error: 'API Key Magnific kosong, cok!' });
    if (!prompt || !imageUrl) return res.status(400).json({ error: 'Prompt dan gambar wajib isi!' });

    const cleanKey = apiKey.trim();

    // DIRECT ENDPOINT KE SERVER PUSAT MAGNIFIC VIDEO GENERATION
    const response = await fetch('https://api.magnific.com/v1/ai/video-generation', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-magnific-api-key': cleanKey // HEADER RESMI WAJIB DARI MAGNIFIC DOCS!
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
        error: data.message || 'Ditolak Magnific! Periksa kuota atau kunci FPSX lu.' 
      });
    }
    
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
