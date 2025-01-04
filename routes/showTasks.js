const express = require('express');
const route = express.Router();
const {conn} = require('../db');
const authenticate = require('../middleware');

route.get('/', authenticate, async (req, res) => {
    const {userId} = req.body;

    if(!userId){
        return res.status(400).json({message: "Please enter a user Id"});
    }

    try{
        const result = await conn.query(`SELECT * from tasks WHERE userId = $1`, [userId])
        .catch((err) => {
            console.log(err);
        });

        if(result.rows.length === 0){
            return res.status(200).json({ message: "No Tasks created yet" })
        }

        return res.status(200).send({ message: "Tasks Retrieved", data: result.rows});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({ Error: "Internal Server Error" });
    }
});

module.exports = route;