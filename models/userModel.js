const {json} = require("express");
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

//Check if username exists
module.exports.getAccount = async function (username) {
    try {
        let sql = "SELECT user_ID, password FROM Cliente WHERE username=\""+username+"\"";
        let login = await pool.query(sql);
        return {status: 200, data: login};
    } catch (err) {
        console.log(err);
        return {status: 500,data: err};
    }
};

//Add new user password hashed
module.exports.newUser = async function (username,password) {
    try {
        let sql = "INSERT INTO Cliente(username,password) VALUES (?,?)";
        let result = await pool.query(sql, [username, password]);
        return {
            status: 200,
            data: result
        };
    } catch (err) {
        console.log(err);
        return {
            status: 500,
            data: err
        };
    }
};

module.exports.getLogin = async function (username, password) {
    try {
        let sql = "Select user_ID From Cliente Where username=? and password=?";
        let result = await pool.query(sql, [username, password]);
        return {
            status: 200,
            data: result
        };
    } catch (err) {
        console.log(err);
        return {
            status: 500,
            data: err
        };
    }
};