// api/status.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Harus POST, bray!' });

  try {
    const { request_id, apiKey } = req.body;

    if (!request_id || !apiKey) {
      return res.status(400).json({ error: 'Data pencarian status kagak lengkap bray!' });
    }

    const response = await fetch(`https://api.freepik.com/v1/ai/video-generation/${request_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-api-key': apiKey,
        'Authorization': `Bearer ${apiKey}` // Dobel sistem biar gak ketendang Magnific
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Gagal mengambil status dari Freepik.');

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
