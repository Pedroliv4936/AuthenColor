var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var userModel = require("../models/userModel");

/* GET username e password nao cifrados */
router.get('/:username/:password', async function (req, res, next) {
  let username = req.params.username;
  let password = req.params.password;
  let result = await userModel.getLogin(username, password);
  res.send(result.data);
});

//Get username and hash
router.get('/login/', async function (req, res, next) {
  let user = req.query;
  console.log("user:", user);
  let userGET = await userModel.getAccount(user.username);
  if (userGET.data != null) {
    console.log(userGET);
    try {
      let hash = userGET.data[0].password;
      if(await bcrypt.compare(user.password, hash)){
        res.status(200).send(userGET.data);
      } else {res.status(401).send({"message":"Incorreto"});} /*, function (err, match) {
        if (match) {
          console.log("ACEITE");
          res.send("ACEITE");
        } else {
          console.log("Password Errada");
          res.send("Password Errada");
        }
      });*/
      //return {status:200, data: success};
    } catch (err) {
      console.log(err);
    }
  }
});

//Novo user (registrar) recebe user object
router.post('/register', async function (req, res, next) {
  let user = req.body;
  let newUser = await hashCreate(user);
});

// Post da nova Hash (Nova password e registro)
router.put('/:username', async function (req, res, next) {});

function hashCreate(user) {
  try {
    const saltRounds = 10;
    let result;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        result = userModel.newUser(user.username, hash);
      });
    });
    return {
      status: 200,
      data: result.data
    };
  } catch (err) {
    console.log(err);
  }
  return {
    status: 500,
    data: err
  };
}

function hashCompare(user, userGET) {
  console.log(userGET);
  let success;
  try {
    let hash = userGET.data[0].password;
    bcrypt.compare(user.password, hash, function (err, match) {
      if (match) {
        console.log("ACEITE");
        success = "ACEITE";
        return success;
      } else {
        console.log("Password Errada");
        success = null;
        return success;
      }
    });
    //return {status:200, data: success};
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      data: err
    };
  }
}

module.exports = router;