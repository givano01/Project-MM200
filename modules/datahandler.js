const pg = require("pg");
const dbCredentials = process.env.DATABASE_URL || require("../NEI").credentials;

class StorageHandler {

    constructor(credentials) {
        this.credentials = {
            connectionString: credentials,
            ssl: {
                rejectUnauthorized: false
            }
        };
    }

    async insertUser(username, password) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('INSERT INTO "public"."users"("username", "password") VALUES($1, $2) RETURNING *;', [username, password]);
            results = results.rows[0].message;
            client.end();
        } catch (err) {
            client.end();
            console.log(err);
            results = err;
        }

        return results;
    }

    async selectUser(username, password){
        const client = new pg.Client(this.credentials);
        let resp = null;
        let results = null;
        try{
            await client.connect();
            results = await client.query('SELECT * FROM "public"."users" WHERE username=$1 AND password=$2', [username, password]);
            resp = (results.rows.length > 0) ? results.rows[0]:null;
            client.end();
        }catch(err){
            console.log(err);
        }

        return resp;        
    }
}

module.exports = new StorageHandler(dbCredentials);
