// api/status.js
module.exports = (req, res) => {
    res.status(200).json({ 
        status: "online", 
        message: "Mesin BYOK SIKAL-AI siap di HP bray!" 
    });
};
