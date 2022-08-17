module.exports = function(req, res, next){
    res.header("Access-Control-Allow-Origin", "https://keypumps-client.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-type");
    next();
}

