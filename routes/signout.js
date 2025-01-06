const express = require('express');
const route = express.Router();
const { client } = require('../redis');
const authenticate = require('../middleware');

route.post('/', authenticate, async (req, res) => {
    const { userId } = req.body;

    try{
        const cache = await client.SREM('active_users', userId);
        
        if(cache === 0){
            return res.status(400).json({ error: "Unable to Signout" });
        }
        
        return res.status(200).json({ message: "User Signed Out "});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error "});
    }
});

module.exports = route;