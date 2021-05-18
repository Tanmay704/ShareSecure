"use strict";
import express from 'express';
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send("create room page");
});

export { router };