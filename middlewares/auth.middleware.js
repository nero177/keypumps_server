const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config');

module.exports = (req, res, next) => {
    if(req.method = "OPTIONS")
        return next();

    try{ 
        console.log('heeeyyeyeyey')
        const token = req.headers.authorization.split(' ')[1];

        if(!token){
            return res.status(401).json({error: 'Auth error'});
        }
        const decoded = jwt.verify(token, jwtSecret);
        
        return res.json({user: decoded})
    } catch (err) {
        console.log(err)
    }
}