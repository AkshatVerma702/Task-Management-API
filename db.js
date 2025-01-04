const pg = require("pg");
const Client = pg.Client;
const dotenv = require('dotenv');
dotenv.config();

const conn = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

async function setupSchema(){
    const usersQuery = `CREATE TABLE IF NOT EXISTS users (
        userId UUID PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR (100) UNIQUE NOT NULL,
        password CHAR(60) NOT NULL
    );`;

    const tasksQuery = `CREATE TABLE IF NOT EXISTS tasks (
        title VARCHAR(50),
        description TEXT,
        status VARCHAR(15),
        dueDate TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
        userId UUID NOT NULL,
        taskId SERIAL PRIMARY KEY
    );`;

    try{
        conn.query(usersQuery)
        .catch((err) => {
            console.log(err);
        });

        conn.query(tasksQuery)
        .catch((err) => {
            console.log(err);
        });
    }
    catch(err){
        console.log(err);
    }
}

async function connectDB(){
    try{
        await conn.connect();
        console.log("Database Connected");
        await setupSchema();
    }
    catch(err){
        console.log(err);
    }
}


module.exports = {conn, connectDB};
