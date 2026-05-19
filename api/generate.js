export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    // Balikin respons tes dulu
    return res.status(200).json({ message: "API konek, bray!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
