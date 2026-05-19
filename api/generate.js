export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt, apiKey, modelType, imageUrl } = req.body;

  try {
    const response = await fetch('https://api.freepik.com/v1/ai/text-to-video', {
      method: 'POST',
      headers: { 
        'x-freepik-api-key': apiKey,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ prompt, image: imageUrl, model: modelType })
    });
    const data = await response.json();
    return res.status(200).json(data); // Kirim balik ID/Task ke frontend
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
