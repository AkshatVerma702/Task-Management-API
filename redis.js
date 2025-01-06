const { createClient } = require("redis");
const dotenv = require('dotenv');
dotenv.config();

const client = createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

const redisSetup = async () => {
    client.connect();
    client.on('connect', () => {
        console.log("Redis Connected");
    });
    client.on('error', (err) => {
        console.log(err);
    })
};

module.exports = { client, redisSetup };