const userService = require('../services/UserService')

class UserController{
    async login(req, res){
        const {login, password} = req.body;
        const response = await userService.login(login, password);

        return res.json(response);
    }
}

module.exports = new UserController();