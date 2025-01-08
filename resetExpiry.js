const { client } = require('./redis');
const dotnev = require('dotenv');
dotnev.config();

const resetExpire = async (userId) => {
    if(!userId){
        console.log("Unable to reset expiry");
    }

    try{
        await client.expire(`active_users`, process.env.SESSION_EXPIRE);
        await client.expire(`all_tasks:${userId}`, process.env.SESSION_EXPIRE);
    }
    catch(err){
        console.log(err);
    }
};

module.exports = { resetExpire };