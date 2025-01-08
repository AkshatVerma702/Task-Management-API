const express = require('express');
const route = express.Router();
const { conn } = require('../db');
const authenticate = require('../middleware');
const { client } = require('../redis');

route.delete('/', authenticate, async (req, res) => {
    const {userId, taskId} = req.body;

    if(!userId || !taskId){
        return res.status(400).json({ error: "Unable to find the task"});
    }

    try{
        await conn.query(`DELETE from tasks WHERE userId = $1 AND taskId = $2`, [userId, taskId])
        .catch((err) => {
            console.log(err);
        });

        await client.HDEL(`all_tasks:${userId}`, taskId.toString());

        return res.status(200).json({ message: "Task Deleted" });
    }
    catch(err){
        return res.status(500).json({ error: err});
    }
});

module.exports = route;