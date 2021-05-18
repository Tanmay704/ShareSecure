"use strict";
import express from 'express';
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render("createroom");
});

export { router };