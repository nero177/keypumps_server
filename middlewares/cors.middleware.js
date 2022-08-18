function cors (req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    next();
}

module.exports = cors;