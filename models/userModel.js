var pool = require("./connection");


/*module.exports.getUserID = async function(username) {
    try{
        let sql="Select user_ID From Cliente Where username=?"
        let result = await pool.query(sql,username);
        return {status:200, data: result}
    } catch(err){
        console.log(err);
        return {status:500, data: err};
    }
}*/

module.exports.getLogin = async function (username, password) {
    try {
        let sql = "Select user_ID From Cliente Where username=? and password=?"
        let result = await pool.query(sql, [username, password]);
        return {
            status: 200,
            data: result
        }
    } catch (err) {
        console.log(err);
        return {
            status: 500,
            data: err
        };
    }
}