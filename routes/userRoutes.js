var express = require('express');
var router = express.Router();
var userModel = require("../models/userModel")

/* GET user_ID. */
router.get('/:username/:password', async function (req, res, next) {
  let username = req.params.username;
  let password = req.params.password;
  let result = await userModel.getLogin(username, password);
  res.send(result.data);
});

module.exports = router;