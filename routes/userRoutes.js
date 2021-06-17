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
router.get('/login/', async function(req,res,next){
  let user = req.query;
  console.log("user:",user);
  let userGET= await userModel.getAccount(user.username);
  let compare = await hashCompare(user,userGET);
  res.send(compare);
});

//Novo user (registrar) recebe user object
router.post('/register', async function (req, res, next) {
  let user = req.body;
  let newUser = await hashCreate(user); 
});

// Post da nova Hash (Nova password e registro)
router.put('/:username', async function (req, res, next) {
});

function hashCreate(user) {
  try{
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      userModel.newUser(user.username,hash);
    });
  });}
  catch (err) {
    console.log(err);}
}

function hashCompare(user,userGET) {
  console.log(userGET);
  try{let hash = userGET.data[0].password;
  bcrypt.compare(user.password, hash, function (err, match) {
    console.log(match);
    if (match) {
      console.log("ACEITE");
    } else {
      console.log("Password Errada");
    }
  });} catch(err){
    console.log(err);
  }
}

module.exports = router;