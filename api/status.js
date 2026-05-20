export default async function handler(req, res) {
    // Fungsi ini buat nge-poll status apakah video udah jadi atau masih dimasak
    res.status(200).json({ status: 'COMPLETED' }); 
}
