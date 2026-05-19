export default async function handler(req, res) {
  const { id, apiKey } = req.body; // 'id' didapet dari generate.js tadi
  const response = await fetch(`https://api.freepik.com/v1/ai/text-to-video/${id}`, {
    headers: { 'x-freepik-api-key': apiKey }
  });
  const data = await response.json();
  return res.status(200).json(data);
}
