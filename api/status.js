// api/status.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method harus POST, bray!' });

  try {
    const { request_id, apiKey } = req.body;
    if (!request_id || !apiKey) {
      return res.status(400).json({ error: 'Parameter pelacakan tidak lengkap bray!' });
    }

    const cleanKey = apiKey.trim();

    // Lacak status render antrean video langsung ke server Magnific
    const response = await fetch(`https://api.magnific.com/v1/video-generation/${request_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${cleanKey}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Gagal melacak status ke Magnific.' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
