"use strict";
import express from 'express';
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send("room setting and update delete and other pages");
});

export { router };