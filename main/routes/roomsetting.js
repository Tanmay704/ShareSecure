"use strict";
const express = require('express');
const parser = require('body-parser');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render("roomsetting");
});

module.exports =   router ;