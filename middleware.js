const {conn} = require('./db');

const authenticate = async (req, res, next) => {
    const { userId } = req.body;

    if(!userId){
        const error = new Error("Unable to verify the user");
        error.status = 400;
        return next(error);
    }

    try{
        const records = await conn.query(`SELECT COUNT(userId) as count from users WHERE userId = $1`, [userId])
        .catch((err) => {
            console.log("Error here");
        });

        if(records.rows[0].count === 0){
            const error = new Error("UserId Not Found");
            error.status = 404;
            return next(error);
        }
        next();
    }
    catch(err){
        console.log("here");
        console.log(err);
        const error = new Error("Internal Server Error");
        error.status = 500;
        return next(error);
    }
}

module.exports = authenticate;