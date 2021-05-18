"use strict";
import express from 'express';
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send("this is room page");
});

export { router };