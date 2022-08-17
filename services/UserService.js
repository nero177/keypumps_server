const User = require('../models/User')
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config')

class UserService{
    async login(userLogin, userPassword){
        try{
            const user = await User.findOne({login: userLogin});
           
            if(!user)
                return null;
    
            if(user.password !== userPassword)
                return null;

            const token = jwt.sign({id: user.id}, jwtSecret, {expiresIn: "7d"})
            return {token, user: {
                id: user.id,
                login: user.login
            }}
        } catch (err) {
            console.log('[UserService.js, login]: ' + err)
        }
    }
}

module.exports = new UserService();