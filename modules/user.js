const database = require("./datahandler")
const crypto = require('crypto');
const secret = process.env.hashSecret || require("../NEI").hashSecret;
/*
const secret = 'abcdefg';
const hash = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');
*/
class User {
    constructor(username, password) {
        this.username = username;
        this.password = crypto.createHmac('sha256', secret)
            .update(password)
            .digest('hex');
        this.valid = false
    }

    async create() {
        try {
            let respons = await database.insertUser(this.username, this.password);
        } catch (error) {
            console.error(error)
        }
    }

}


module.exports = User
