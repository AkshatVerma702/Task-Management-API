const express = require('express');
const route = express.Router();
const {conn} = require('../db');
const authenticate = require('../middleware');
const { client } = require('../redis');


function displayTasks(data){
    const taskArray = Object.keys(data).map(key => {
        return JSON.parse(data[key]);
    });

    return taskArray;
}

route.get('/', authenticate, async (req, res) => {
    const {userId} = req.body;

    if(!userId){
        return res.status(400).json({message: "Please enter a user Id"});
    }

    try{
        const cacheLen = await client.HLEN(`all_tasks:${userId}`, userId);

        console.log("Cache Length:" + cacheLen);

        if(cacheLen > 0){
            const data = await client.HGETALL(`all_tasks:${userId}`);
            const taskArray = displayTasks(data);
            return res.status(200).json({ message: "Redis result ", taskArray: taskArray});
        }

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